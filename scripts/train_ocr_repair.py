
import os
import json
import torch
from typing import List, Dict
from tqdm import tqdm
from torch.utils.data import Dataset, DataLoader
from transformers import (
    ByT5Tokenizer, 
    T5ForConditionalGeneration, 
    AdamW, 
    get_linear_schedule_with_warmup
)

# Configuration
MODEL_NAME = "google/byt5-small"
DATA_PATH = "data/ocr_repair_training.jsonl"
OUTPUT_DIR = "models/ocr_repair_byt5"
MAX_LENGTH = 256
BATCH_SIZE = 8
EPOCHS = 3
LEARNING_RATE = 5e-5

class OCRDataset(Dataset):
    def __init__(self, data_path: str, tokenizer: ByT5Tokenizer, max_len: int):
        self.data = []
        with open(data_path, 'r', encoding='utf-8') as f:
            for line in f:
                self.data.append(json.loads(line))
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        inputs = self.tokenizer(
            item["input"], 
            max_length=self.max_len, 
            padding="max_length", 
            truncation=True, 
            return_tensors="pt"
        )
        targets = self.tokenizer(
            item["target"], 
            max_length=self.max_len, 
            padding="max_length", 
            truncation=True, 
            return_tensors="pt"
        )
        
        return {
            "input_ids": inputs.input_ids.flatten(),
            "attention_mask": inputs.attention_mask.flatten(),
            "labels": targets.input_ids.flatten()
        }

def train():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Load model and tokenizer
    tokenizer = ByT5Tokenizer.from_pretrained(MODEL_NAME)
    model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME).to(device)

    # Prepare dataset
    dataset = OCRDataset(DATA_PATH, tokenizer, MAX_LENGTH)
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

    # Optimizer
    optimizer = AdamW(model.parameters(), lr=LEARNING_RATE)
    total_steps = len(dataloader) * EPOCHS
    scheduler = get_linear_schedule_with_warmup(
        optimizer, num_warmup_steps=0, num_training_steps=total_steps
    )

    # Training Loop
    model.train()
    for epoch in range(EPOCHS):
        print(f"Epoch {epoch+1}/{EPOCHS}")
        epoch_loss = 0
        pbar = tqdm(dataloader, desc="Training")
        for batch in pbar:
            optimizer.zero_grad()
            
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )
            
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            scheduler.step()
            
            epoch_loss += loss.item()
            pbar.set_postfix({"loss": loss.item()})

        avg_loss = epoch_loss / len(dataloader)
        print(f"Average Loss: {avg_loss:.4f}")
        
        # Save checkpoint
        model.save_pretrained(os.path.join(OUTPUT_DIR, f"checkpoint-epoch-{epoch+1}"))
    
    # Save final model
    model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    print(f"Model saved to {OUTPUT_DIR}")

if __name__ == "__main__":
    # Check if data exists
    if not os.path.exists(DATA_PATH):
        print(f"Error: Training data not found at {DATA_PATH}")
    else:
        train()
