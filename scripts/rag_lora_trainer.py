"""
LoRA Trainer - LLM-i dərslik məlumatları ilə fine-tune edir
"""
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    TaskType
)
from datasets import load_dataset
import os
from pathlib import Path
import json

class LoRATrainer:
    def __init__(
        self,
        base_model: str = "meta-llama/Meta-Llama-3-8B-Instruct",
        output_dir: str = "lora_models/edutest_v1"
    ):
        self.base_model = base_model
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.tokenizer = None
        self.model = None
        
    def load_model(self, load_in_4bit: bool = True):
        """Modeli yüklə və LoRA üçün hazırla"""
        print(f"📥 Model yüklənir: {self.base_model}")
        
        # Tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.base_model,
            trust_remote_code=True
        )
        self.tokenizer.pad_token = self.tokenizer.eos_token
        self.tokenizer.padding_side = "right"
        
        # Model config
        model_kwargs = {
            "trust_remote_code": True,
            "device_map": "auto",
            "torch_dtype": torch.bfloat16,
        }
        
        if load_in_4bit:
            from transformers import BitsAndBytesConfig
            model_kwargs["quantization_config"] = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.bfloat16,
                bnb_4bit_use_double_quant=True,
            )
        
        # Load model
        self.model = AutoModelForCausalLM.from_pretrained(
            self.base_model,
            **model_kwargs
        )
        
        # Prepare for LoRA
        self.model = prepare_model_for_kbit_training(self.model)
        
        print("✅ Model yükləndi")
        
    def setup_lora(
        self,
        r: int = 64,
        lora_alpha: int = 128,
        lora_dropout: float = 0.05,
        target_modules: list = None
    ):
        """LoRA konfiqurasiyasını tətbiq et"""
        
        if target_modules is None:
            # Llama-3 üçün standart target modules
            target_modules = [
                "q_proj",
                "k_proj", 
                "v_proj",
                "o_proj",
                "gate_proj",
                "up_proj",
                "down_proj",
            ]
        
        peft_config = LoraConfig(
            r=r,
            lora_alpha=lora_alpha,
            target_modules=target_modules,
            lora_dropout=lora_dropout,
            bias="none",
            task_type=TaskType.CAUSAL_LM,
        )
        
        self.model = get_peft_model(self.model, peft_config)
        self.model.print_trainable_parameters()
        
        print("✅ LoRA konfiqurasiyası tətbiq edildi")
        
    def prepare_dataset(self, data_dir: str = "training_data"):
        """Training dataset-i hazırla"""
        print(f"📚 Dataset yüklənir: {data_dir}")
        
        # Load JSONL dataset
        dataset = load_dataset(
            "json",
            data_files={
                "train": f"{data_dir}/train.jsonl",
                "eval": f"{data_dir}/eval.jsonl"
            }
        )
        
        def format_prompt(example):
            """Prompt formatı"""
            prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{example['instruction']}<|eot_id|><|start_header_id|>user<|end_header_id|>

{example['input']}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{example['output']}<|eot_id|>"""
            return {"text": prompt}
        
        # Format dataset
        dataset = dataset.map(format_prompt)
        
        def tokenize_function(examples):
            """Tokenization"""
            result = self.tokenizer(
                examples["text"],
                truncation=True,
                max_length=2048,
                padding="max_length",
            )
            result["labels"] = result["input_ids"].copy()
            return result
        
        tokenized_dataset = dataset.map(
            tokenize_function,
            batched=True,
            remove_columns=dataset["train"].column_names
        )
        
        print(f"✅ Dataset hazırdır:")
        print(f"   Train: {len(tokenized_dataset['train'])} nümunə")
        print(f"   Eval: {len(tokenized_dataset['eval'])} nümunə")
        
        return tokenized_dataset
    
    def train(
        self,
        dataset,
        num_epochs: int = 3,
        batch_size: int = 4,
        gradient_accumulation_steps: int = 4,
        learning_rate: float = 2e-4,
        warmup_steps: int = 100,
        logging_steps: int = 10,
        save_steps: int = 100,
    ):
        """Training prosesi"""
        
        training_args = TrainingArguments(
            output_dir=str(self.output_dir),
            num_train_epochs=num_epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            gradient_accumulation_steps=gradient_accumulation_steps,
            learning_rate=learning_rate,
            warmup_steps=warmup_steps,
            logging_steps=logging_steps,
            save_steps=save_steps,
            eval_steps=save_steps,
            evaluation_strategy="steps",
            save_strategy="steps",
            load_best_model_at_end=True,
            fp16=True,
            gradient_checkpointing=True,
            optim="paged_adamw_8bit",
            lr_scheduler_type="cosine",
            report_to="none",
        )
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False
        )
        
        # Trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=dataset["train"],
            eval_dataset=dataset["eval"],
            data_collator=data_collator,
        )
        
        print("🚀 Training başlayır...")
        trainer.train()
        
        print("✅ Training tamamlandı!")
        
        # Save final model
        trainer.save_model(str(self.output_dir / "final"))
        self.tokenizer.save_pretrained(str(self.output_dir / "final"))
        
        # Save training metrics
        with open(self.output_dir / "training_metrics.json", 'w') as f:
            json.dump(trainer.state.log_history, f, indent=2)
        
        return trainer

def main():
    """Ana training funksiyası"""
    
    # Configuration
    config = {
        "base_model": "meta-llama/Meta-Llama-3-8B-Instruct",
        "output_dir": "lora_models/edutest_v1",
        "data_dir": "training_data",
        "lora_r": 64,
        "lora_alpha": 128,
        "num_epochs": 3,
        "batch_size": 4,
        "learning_rate": 2e-4,
    }
    
    print("🎓 EduTest LoRA Training")
    print("=" * 60)
    print(json.dumps(config, indent=2))
    print("=" * 60)
    
    # Initialize trainer
    trainer = LoRATrainer(
        base_model=config["base_model"],
        output_dir=config["output_dir"]
    )
    
    # Load and prepare model
    trainer.load_model(load_in_4bit=True)
    trainer.setup_lora(
        r=config["lora_r"],
        lora_alpha=config["lora_alpha"]
    )
    
    # Prepare dataset
    dataset = trainer.prepare_dataset(config["data_dir"])
    
    # Train
    trainer.train(
        dataset=dataset,
        num_epochs=config["num_epochs"],
        batch_size=config["batch_size"],
        learning_rate=config["learning_rate"]
    )
    
    print(f"\n🎉 Training tamamlandı!")
    print(f"📁 Model qeyd edildi: {config['output_dir']}")

if __name__ == "__main__":
    main()
