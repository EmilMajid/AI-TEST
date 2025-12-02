"""
LoRA Version Manager - Model versiyalarını idarə edir
"""
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import hashlib

class LoRAVersionManager:
    def __init__(self, registry_path: str = "lora_models/registry.json"):
        self.registry_path = Path(registry_path)
        self.registry_path.parent.mkdir(parents=True, exist_ok=True)
        self.registry = self._load_registry()
        
    def _load_registry(self) -> Dict:
        """Registry-ni yüklə"""
        if self.registry_path.exists():
            with open(self.registry_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {
            "models": {},
            "active_model": None,
            "version_counter": 0
        }
    
    def _save_registry(self):
        """Registry-ni saxla"""
        with open(self.registry_path, 'w', encoding='utf-8') as f:
            json.dump(self.registry, f, indent=2, ensure_ascii=False)
    
    def _generate_version_id(self) -> str:
        """Unikal version ID yarat"""
        self.registry["version_counter"] += 1
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"v{self.registry['version_counter']}_{timestamp}"
    
    def _calculate_model_hash(self, model_path: Path) -> str:
        """Model fayllarının hash-ini hesabla"""
        hash_md5 = hashlib.md5()
        
        # Adapter fayllarını hash-lə
        for file_path in sorted(model_path.glob("**/*")):
            if file_path.is_file():
                with open(file_path, 'rb') as f:
                    for chunk in iter(lambda: f.read(4096), b""):
                        hash_md5.update(chunk)
        
        return hash_md5.hexdigest()
    
    def register_model(
        self,
        model_path: str,
        name: str,
        description: str = "",
        training_config: Dict = None,
        metrics: Dict = None,
        tags: List[str] = None
    ) -> str:
        """Yeni modeli qeydiyyatdan keçir"""
        
        model_path = Path(model_path)
        if not model_path.exists():
            raise ValueError(f"Model path mövcud deyil: {model_path}")
        
        # Version ID yarat
        version_id = self._generate_version_id()
        
        # Model hash-ini hesabla
        model_hash = self._calculate_model_hash(model_path)
        
        # Check for duplicate
        for existing_id, existing_model in self.registry["models"].items():
            if existing_model.get("hash") == model_hash:
                print(f"⚠️ Eyni model artıq mövcuddur: {existing_id}")
                return existing_id
        
        # Modeli versiya qovluğuna kopyala
        version_dir = Path(f"lora_models/versions/{version_id}")
        version_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy model files
        if model_path.is_dir():
            shutil.copytree(model_path, version_dir / "model", dirs_exist_ok=True)
        else:
            shutil.copy2(model_path, version_dir / "model")
        
        # Model metadata
        model_info = {
            "version_id": version_id,
            "name": name,
            "description": description,
            "path": str(version_dir / "model"),
            "hash": model_hash,
            "created_at": datetime.now().isoformat(),
            "training_config": training_config or {},
            "metrics": metrics or {},
            "tags": tags or [],
            "status": "registered",
            "downloads": 0,
            "active": False
        }
        
        # Registry-ə əlavə et
        self.registry["models"][version_id] = model_info
        
        # İlk model-dirsə, aktiv et
        if self.registry["active_model"] is None:
            self.set_active_model(version_id)
        
        self._save_registry()
        
        print(f"✅ Model qeydiyyatdan keçdi: {version_id}")
        print(f"   Ad: {name}")
        print(f"   Path: {version_dir}")
        
        return version_id
    
    def list_models(self, tags: List[str] = None) -> List[Dict]:
        """Bütün modelləri siyahıla"""
        models = list(self.registry["models"].values())
        
        # Filter by tags
        if tags:
            models = [
                m for m in models
                if any(tag in m.get("tags", []) for tag in tags)
            ]
        
        # Sort by creation date (newest first)
        models.sort(key=lambda x: x["created_at"], reverse=True)
        
        return models
    
    def get_model(self, version_id: str) -> Optional[Dict]:
        """Konkret modeli əldə et"""
        return self.registry["models"].get(version_id)
    
    def get_active_model(self) -> Optional[Dict]:
        """Aktiv modeli əldə et"""
        active_id = self.registry.get("active_model")
        if active_id:
            return self.get_model(active_id)
        return None
    
    def set_active_model(self, version_id: str):
        """Aktiv modeli təyin et"""
        if version_id not in self.registry["models"]:
            raise ValueError(f"Model tapılmadı: {version_id}")
        
        # Deactivate previous
        if self.registry["active_model"]:
            prev_model = self.registry["models"][self.registry["active_model"]]
            prev_model["active"] = False
        
        # Activate new
        self.registry["active_model"] = version_id
        self.registry["models"][version_id]["active"] = True
        
        # Create symlink to active model
        active_link = Path("lora_models/active")
        if active_link.exists():
            active_link.unlink()
        
        model_path = Path(self.registry["models"][version_id]["path"])
        active_link.symlink_to(model_path.resolve())
        
        self._save_registry()
        
        print(f"✅ Aktiv model: {version_id}")
    
    def delete_model(self, version_id: str, force: bool = False):
        """Modeli sil"""
        if version_id not in self.registry["models"]:
            raise ValueError(f"Model tapılmadı: {version_id}")
        
        model_info = self.registry["models"][version_id]
        
        # Aktiv modeli silməyə icazə vermə
        if model_info.get("active") and not force:
            raise ValueError("Aktiv modeli silə bilməzsiniz. force=True istifadə edin.")
        
        # Model fayllarını sil
        model_path = Path(model_info["path"])
        if model_path.exists():
            if model_path.is_dir():
                shutil.rmtree(model_path.parent)
            else:
                model_path.unlink()
        
        # Registry-dən sil
        del self.registry["models"][version_id]
        
        # Əgər aktiv model idisə, null et
        if self.registry["active_model"] == version_id:
            self.registry["active_model"] = None
        
        self._save_registry()
        
        print(f"🗑️ Model silindi: {version_id}")
    
    def compare_models(self, version_ids: List[str]) -> Dict:
        """Modelləri müqayisə et"""
        comparison = {
            "models": [],
            "metrics_comparison": {},
            "config_differences": []
        }
        
        for vid in version_ids:
            model = self.get_model(vid)
            if model:
                comparison["models"].append({
                    "version_id": vid,
                    "name": model["name"],
                    "created_at": model["created_at"],
                    "metrics": model.get("metrics", {}),
                    "training_config": model.get("training_config", {})
                })
        
        # Compare metrics
        if comparison["models"]:
            all_metrics = set()
            for model in comparison["models"]:
                all_metrics.update(model["metrics"].keys())
            
            for metric in all_metrics:
                comparison["metrics_comparison"][metric] = [
                    model["metrics"].get(metric, None)
                    for model in comparison["models"]
                ]
        
        return comparison
    
    def update_metrics(self, version_id: str, metrics: Dict):
        """Model metriklərini yenilə"""
        if version_id not in self.registry["models"]:
            raise ValueError(f"Model tapılmadı: {version_id}")
        
        self.registry["models"][version_id]["metrics"].update(metrics)
        self._save_registry()
        
        print(f"✅ Metriklər yeniləndi: {version_id}")
    
    def add_tags(self, version_id: str, tags: List[str]):
        """Model-ə tag əlavə et"""
        if version_id not in self.registry["models"]:
            raise ValueError(f"Model tapılmadı: {version_id}")
        
        current_tags = set(self.registry["models"][version_id].get("tags", []))
        current_tags.update(tags)
        self.registry["models"][version_id]["tags"] = list(current_tags)
        
        self._save_registry()
        
        print(f"🏷️ Tag-lar əlavə edildi: {tags}")
    
    def get_best_model(self, metric: str = "eval_loss", higher_is_better: bool = False) -> Optional[Dict]:
        """Ən yaxşı modeli tap"""
        models = [m for m in self.registry["models"].values() if metric in m.get("metrics", {})]
        
        if not models:
            return None
        
        models.sort(
            key=lambda x: x["metrics"][metric],
            reverse=higher_is_better
        )
        
        return models[0]
    
    def export_model(self, version_id: str, export_path: str):
        """Modeli export et"""
        if version_id not in self.registry["models"]:
            raise ValueError(f"Model tapılmadı: {version_id}")
        
        model_info = self.registry["models"][version_id]
        model_path = Path(model_info["path"])
        export_path = Path(export_path)
        
        # Export directory yarat
        export_path.mkdir(parents=True, exist_ok=True)
        
        # Model fayllarını kopyala
        shutil.copytree(model_path, export_path / "model", dirs_exist_ok=True)
        
        # Metadata-nı export et
        metadata = {
            "version_id": version_id,
            "name": model_info["name"],
            "description": model_info["description"],
            "created_at": model_info["created_at"],
            "training_config": model_info["training_config"],
            "metrics": model_info["metrics"],
            "tags": model_info["tags"]
        }
        
        with open(export_path / "metadata.json", 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        print(f"📦 Model export edildi: {export_path}")
        
        return export_path

# CLI interface
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="LoRA Model Version Manager")
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Register command
    register_parser = subparsers.add_parser("register", help="Register new model")
    register_parser.add_argument("model_path", help="Path to model")
    register_parser.add_argument("--name", required=True, help="Model name")
    register_parser.add_argument("--description", default="", help="Model description")
    register_parser.add_argument("--tags", nargs="+", help="Model tags")
    
    # List command
    list_parser = subparsers.add_parser("list", help="List all models")
    list_parser.add_argument("--tags", nargs="+", help="Filter by tags")
    
    # Activate command
    activate_parser = subparsers.add_parser("activate", help="Set active model")
    activate_parser.add_argument("version_id", help="Version ID to activate")
    
    # Delete command
    delete_parser = subparsers.add_parser("delete", help="Delete model")
    delete_parser.add_argument("version_id", help="Version ID to delete")
    delete_parser.add_argument("--force", action="store_true", help="Force delete active model")
    
    # Compare command
    compare_parser = subparsers.add_parser("compare", help="Compare models")
    compare_parser.add_argument("version_ids", nargs="+", help="Version IDs to compare")
    
    args = parser.parse_args()
    
    manager = LoRAVersionManager()
    
    if args.command == "register":
        manager.register_model(
            model_path=args.model_path,
            name=args.name,
            description=args.description,
            tags=args.tags
        )
    
    elif args.command == "list":
        models = manager.list_models(tags=args.tags)
        print(f"\n📚 Modellər ({len(models)}):")
        print("=" * 80)
        for model in models:
            status = "🟢 ACTIVE" if model.get("active") else "⚪"
            print(f"{status} {model['version_id']}")
            print(f"   Ad: {model['name']}")
            print(f"   Yaradılıb: {model['created_at']}")
            if model.get("metrics"):
                print(f"   Metriklər: {model['metrics']}")
            if model.get("tags"):
                print(f"   Tag-lar: {', '.join(model['tags'])}")
            print()
    
    elif args.command == "activate":
        manager.set_active_model(args.version_id)
    
    elif args.command == "delete":
        manager.delete_model(args.version_id, force=args.force)
    
    elif args.command == "compare":
        comparison = manager.compare_models(args.version_ids)
        print("\n🔍 Model Müqayisəsi:")
        print("=" * 80)
        print(json.dumps(comparison, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
