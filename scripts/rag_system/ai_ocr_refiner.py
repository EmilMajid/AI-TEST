
import os
import torch
import logging
from transformers import ByT5Tokenizer, T5ForConditionalGeneration
from typing import Optional

class AIOCRRefiner:
    """
    Inference engine for Azerbaijani OCR Repair using ByT5.
    Can use a locally fine-tuned model or fallback to base ByT5.
    """
    def __init__(self, model_path: str = "models/ocr_repair_byt5", base_model: str = "google/byt5-small"):
        self.logger = logging.getLogger(__name__)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        try:
            if os.path.exists(os.path.join(model_path, "config.json")):
                self.logger.info(f"Loading local fine-tuned model from {model_path}")
                self.tokenizer = ByT5Tokenizer.from_pretrained(model_path)
                self.model = T5ForConditionalGeneration.from_pretrained(model_path).to(self.device)
            else:
                self.logger.warning(f"Local model not found at {model_path}. Using base model {base_model}")
                self.tokenizer = ByT5Tokenizer.from_pretrained(base_model)
                self.model = T5ForConditionalGeneration.from_pretrained(base_model).to(self.device)
            self.model.eval()
        except Exception as e:
            self.logger.error(f"Failed to load AI OCR model: {e}")
            self.model = None
            self.tokenizer = None

    def refine(self, text: str, max_length: int = 256) -> str:
        if not self.model or not self.tokenizer or not text:
            return text
            
        try:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=max_length).to(self.device)
            
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs.input_ids,
                    max_length=max_length,
                    num_beams=4,
                    early_stopping=True
                )
                
            refined_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return refined_text
        except Exception as e:
            self.logger.error(f"Error during AI OCR inference: {e}")
            return text

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    # Test with base model if fine-tuning hasn't run yet
    refiner = AIOCRRefiner()
    test_text = "Azrbaycan Respublikasinin thsil sistemi."
    print(f"Input: {test_text}")
    print(f"Output: {refiner.refine(test_text)}")
