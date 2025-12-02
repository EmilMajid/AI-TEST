"""
LoRA Trainer with W&B Integration
"""
import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, PeftModel
from datasets import load_dataset
from pathlib import Path
import json
from datetime import datetime

from wandb_integration import WandBLogger


class LoRATrainerWithWandB:
    """LoRA Trainer with W&B logging"""
    
    def __init__(
        self,
        base_model: str = "meta-llama/Meta-Llama-3-8B-Instruct",
        output_dir: str = "lora_models",
        project_name: str = "edutest-ai",
        run_name: Optional[str] = None
    ):
        self.base_model = base_model
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize W&B
        self.wandb_logger = WandBLogger(project_name=project_name)
        self.run_name = run_name or f"training_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        self.model = None
        self.tokenizer = None
        self.trainer = None
    
    def prepare_model(
        self,
        lora_r: int = 64,
        lora_alpha: int = 128,
        lora_dropout: float = 0.05,
        target_modules: List[str] = None
    ):
        """Prepare model with LoRA"""
        
        print(f"Loading base model: {self.base_model}...")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(self.base_model)
        self.tokenizer.pad_token = self.tokenizer.eos_token
        self.tokenizer.padding_side = "right"
        
        # Load model with 4-bit quantization
        self.model = AutoModelForCausalLM.from_pretrained(
            self.base_model,
            load_in_4bit=True,
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True
        )
        
        # Configure LoRA
        if target_modules is None:
            target_modules = ["q_proj", "k_proj", "v_proj", "o_proj"]
        
        peft_config = LoraConfig(
            r=lora_r,
            lora_alpha=lora_alpha,
            target_modules=target_modules,
            lora_dropout=lora_dropout,
            bias="none",
            task_type="CAUSAL_LM"
        )
        
        # Apply LoRA
        self.model = get_peft_model(self.model, peft_config)
        
        # Enable gradient checkpointing
        self.model.gradient_checkpointing_enable()
        
        # Print trainable parameters
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        total_params = sum(p.numel() for p in self.model.parameters())
        
        print(f"Trainable parameters: {trainable_params:,} ({trainable_params/total_params:.2%})")
        print(f"Total parameters: {total_params:,}")
        
        return {
            "trainable_params": trainable_params,
            "total_params": total_params,
            "trainable_percentage": trainable_params / total_params
        }
    
    def load_dataset(self, dataset_path: str):
        """Load training dataset"""
        
        print(f"Loading dataset: {dataset_path}")
        
        dataset = load_dataset("json", data_files=dataset_path, split="train")
        
        # Split into train/eval
        dataset = dataset.train_test_split(test_size=0.1, seed=42)
        
        print(f"Train samples: {len(dataset['train'])}")
        print(f"Eval samples: {len(dataset['test'])}")
        
        # Tokenize function
        def tokenize_function(examples):
            # Format: instruction + input + output
            texts = []
            for inp, out in zip(examples["input"], examples["output"]):
                text = f"### İnstruction:\n{inp}\n\n### Response:\n{json.dumps(out, ensure_ascii=False)}"
                texts.append(text)
            
            return self.tokenizer(
                texts,
                truncation=True,
                max_length=2048,
                padding="max_length"
            )
        
        # Tokenize dataset
        tokenized_dataset = dataset.map(
            tokenize_function,
            batched=True,
            remove_columns=dataset["train"].column_names
        )
        
        return tokenized_dataset
    
    def train(
        self,
        dataset_path: str,
        num_epochs: int = 3,
        batch_size: int = 4,
        learning_rate: float = 2e-4,
        warmup_steps: int = 100,
        logging_steps: int = 10,
        eval_steps: int = 100,
        save_steps: int = 500
    ):
        """Train model with W&B logging"""
        
        # Training config
        config = {
            "base_model": self.base_model,
            "dataset": dataset_path,
            "num_epochs": num_epochs,
            "batch_size": batch_size,
            "learning_rate": learning_rate,
            "warmup_steps": warmup_steps,
            "lora_r": self.model.peft_config.r if hasattr(self.model, 'peft_config') else 64,
            "lora_alpha": self.model.peft_config.lora_alpha if hasattr(self.model, 'peft_config') else 128,
        }
        
        # Initialize W&B run
        self.wandb_logger.init_run(
            run_name=self.run_name,
            config=config,
            run_type="training",
            tags=["lora", "question-generation", "azerbaijani"]
        )
        
        # Log model params
        model_params = self.prepare_model()
        self.wandb_logger.log_metrics({
            "model/trainable_params": model_params["trainable_params"],
            "model/total_params": model_params["total_params"],
            "model/trainable_percentage": model_params["trainable_percentage"]
        })
        
        # Load dataset
        tokenized_dataset = self.load_dataset(dataset_path)
        
        # Log dataset as artifact
        self.wandb_logger.log_dataset_artifact(
            dataset_path,
            f"training_dataset_{datetime.now().strftime('%Y%m%d')}",
            metadata={
                "train_samples": len(tokenized_dataset["train"]),
                "eval_samples": len(tokenized_dataset["test"])
            }
        )
        
        # Training arguments
        output_path = self.output_dir / self.run_name
        output_path.mkdir(exist_ok=True)
        
        training_args = TrainingArguments(
            output_dir=str(output_path),
            num_train_epochs=num_epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            gradient_accumulation_steps=4,
            learning_rate=learning_rate,
            warmup_steps=warmup_steps,
            logging_steps=logging_steps,
            eval_steps=eval_steps,
            save_steps=save_steps,
            evaluation_strategy="steps",
            save_strategy="steps",
            load_best_model_at_end=True,
            fp16=True,
            report_to="wandb",
            run_name=self.run_name,
            gradient_checkpointing=True,
            optim="adamw_torch",
            lr_scheduler_type="cosine"
        )
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False
        )
        
        # Create trainer
        self.trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=tokenized_dataset["train"],
            eval_dataset=tokenized_dataset["test"],
            data_collator=data_collator
        )
        
        # Train
        print(f"\n{'='*60}")
        print(f"🚀 Training başladı: {self.run_name}")
        print(f"{'='*60}\n")
        
        train_result = self.trainer.train()
        
        # Save final model
        final_model_path = output_path / "final"
        self.trainer.save_model(str(final_model_path))
        
        print(f"\n✅ Training tamamlandı!")
        print(f"   Model saxlanıldı: {final_model_path}")
        
        # Log final metrics
        self.wandb_logger.log_metrics({
            "train/final_loss": train_result.training_loss,
            "train/total_steps": train_result.global_step,
        })
        
        # Log model artifact
        self.wandb_logger.log_model_artifact(
            str(final_model_path),
            self.run_name,
            metadata={
                "base_model": self.base_model,
                "final_loss": train_result.training_loss,
                "epochs": num_epochs
            }
        )
        
        # Finish W&B run
        self.wandb_logger.finish()
        
        return final_model_path


def main():
    """CLI interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="LoRA Trainer with W&B")
    parser.add_argument("--dataset", required=True, help="Path to training dataset")
    parser.add_argument("--base-model", default="meta-llama/Meta-Llama-3-8B-Instruct")
    parser.add_argument("--output-dir", default="lora_models")
    parser.add_argument("--run-name", help="W&B run name")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch-size", type=int, default=4)
    parser.add_argument("--learning-rate", type=float, default=2e-4)
    
    args = parser.parse_args()
    
    trainer = LoRATrainerWithWandB(
        base_model=args.base_model,
        output_dir=args.output_dir,
        run_name=args.run_name
    )
    
    trainer.train(
        dataset_path=args.dataset,
        num_epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate
    )


if __name__ == "__main__":
    main()
