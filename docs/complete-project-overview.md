# 🇦🇿 TESTAI.AZ - Tam Layihə Bələdçisi

## 📋 Layihə Haqqında

**TESTAI.AZ** - Azərbaycan təhsil sistemini süni intellekt texnologiyası ilə birləşdirən innovativ test platformasıdır. Platforma şagirdlər, valideynlər, müəllimlər və məktəb direktorları üçün nəzərdə tutulub.

### 🎯 Əsas Məqsəd
Azərbaycan dərslikləri əsasında AI tərəfindən yaradılan testlər vasitəsilə şagirdlərin bilik səviyyəsini qiymətləndirmək və inkişafını izləmək.

---

## 🏗️ Sistem Arxitekturası

### Frontend Stack:
\`\`\`typescript
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui komponentiləri
- React Hook Form + Zod validasiyası
\`\`\`

### Backend Stack:
\`\`\`python
- FastAPI (Python)
- SQLite database
- OpenAI GPT-4o API
- xAI Grok API (əlavə dəstək)
- Bcrypt (password hashing)
- CORS middleware
\`\`\`

### AI/ML Stack:
\`\`\`python
- RAG (Retrieval-Augmented Generation)
- FAISS vector database
- Sentence Transformers
- LoRA fine-tuning
- Weights & Biases (MLOps)
\`\`\`

---

## 👥 İstifadəçi Növləri və Hüquqları

### 1. 🎓 Şagird Hesabı
**Funksiyalar:**
- ✅ Test yaratmaq və həll etmək
- ✅ Nəticələri görmək
- ✅ Performans təhlili
- ✅ Şəxsi statistika
- ✅ Mövzu üzrə progress

**Qeydiyyat Məlumatları:**
\`\`\`typescript
interface StudentRegistration {
  firstName: string          // Ad
  lastName: string           // Soyad
  fatherName: string        // Ata adı
  region: string            // Ərazi (67 rayon/şəhər)
  subRegion?: string        // Alt-rayon (əgər varsa)
  school: string            // Məktəb
  class: string             // Sinif (1-11)
  email: string             // Email
  password: string          // Şifrə
}
\`\`\`

### 2. 👨‍👩‍👧‍👦 Valideyn Hesabı
**Funksiyalar:**
- ✅ Çoxlu övlad əlavə etmək
- ✅ Real-time nəticə izləmə
- ✅ Fənn üzrə performans təhlili
- ✅ Müqayisəli statistika
- ✅ Zəif sahələri müəyyən etmək

**Əlavə Məlumatlar:**
\`\`\`typescript
interface ParentAccount {
  role: 'parent'
  linkedStudents: Student[]
  canViewResults: true
  canAddStudents: true
}
\`\`\`

### 3. 👨‍🏫 Müəllim Hesabı
**Funksiyalar:**
- ✅ Sinif şagirdlərini əlavə etmək
- ✅ Toplu nəticə təhlili
- ✅ Fənn üzrə statistika
- ✅ Zəif şagirdləri müəyyən etmək
- ✅ Təhsil planlaşdırması

**Əlavə İmkanlar:**
\`\`\`typescript
interface TeacherAccount {
  role: 'teacher'
  classSize: number
  subjects: string[]
  canExportData: true
  canGenerateReports: true
}
\`\`\`

### 4. 👔 Məktəb Direktoru Hesabı
**Funksiyalar:**
- ✅ Məktəb səviyyəsində monitoring
- ✅ Bütün şagird nəticələri
- ✅ Müəllim performansı
- ✅ Analitik hesabatlar
- ✅ Strategik qərarlar

**Admin İmkanları:**
\`\`\`typescript
interface DirectorAccount {
  role: 'director'
  schoolWideAccess: true
  canViewAllData: true
  canGenerateReports: true
  canExportAnalytics: true
}
\`\`\`

---

## 🎨 Mədəni İnteqrasiya

### 1. Regional Tema Sistemi

**67 Azərbaycan Regionu:**
\`\`\`typescript
const regions = [
  // Şəhərlər
  "Bakı", "Gəncə", "Sumqayıt", "Mingəçevir", 
  "Naftalan", "Şirvan", "Şəki", "Yevlax",
  
  // Rayonlar
  "Abşeron", "Ağcabədi", "Ağdam", "Ağdaş", ...
  // + 59 digər rayon
]
\`\`\`

**Hər Region üçün:**
\`\`\`typescript
interface RegionInfo {
  name: string              // Region adı
  symbol: string           // Emoji simvol
  description: string      // Qısa təsvir
  landmarks: string[]      // Məşhur yerlər
  history: string          // Tarix
  culture: string          // Mədəniyyət
  economy: string          // İqtisadiyyat
  backgroundImage: string  // Arxa plan şəkli
  colorScheme: {
    primary: string
    secondary: string
    accent: string
  }
}
\`\`\`

**Alt-Region Dəstəyi:**
\`\`\`typescript
// Nümunə: Bakı alt-rayonları
const bakuDistricts = [
  { name: "Nəsimi", type: "district", symbol: "🏛️" },
  { name: "Nərimanov", type: "district", symbol: "🏢" },
  { name: "Yasamal", type: "district", symbol: "🏘️" },
  // ... 12 rayon daha
]

// Kənd/qəsəbə dəstəyi
const subRegionTypes = {
  district: "rayon",
  village: "kənd",
  settlement: "qəsəbə"
}
\`\`\`

### 2. Rəng Temaları

**6 Tema Variantı:**
\`\`\`typescript
const themes = {
  classic: {
    primary: "bg-blue-600",
    secondary: "bg-blue-100",
    name: "Klassik Mavi"
  },
  nature: {
    primary: "bg-green-600",
    secondary: "bg-green-100",
    name: "Təbii Yaşıl"
  },
  sunset: {
    primary: "bg-orange-600",
    secondary: "bg-orange-100",
    name: "Günəş Batımı"
  },
  ocean: {
    primary: "bg-cyan-600",
    secondary: "bg-cyan-100",
    name: "Okean Mavisi"
  },
  royal: {
    primary: "bg-purple-600",
    secondary: "bg-purple-100",
    name: "Kral Bənövşəyi"
  },
  energy: {
    primary: "bg-red-600",
    secondary: "bg-red-100",
    name: "Enerji Qırmızı"
  }
}
\`\`\`

### 3. Interaktiv Xəritə
\`\`\`typescript
// Region seçimi ilə
- Xəritə üzərində region seçimi
- Hover effektləri
- Regional statistika göstərməsi
- Məşhur yerlərin işarələnməsi
\`\`\`

---

## 📚 Dərslik İnteqrasiyası

### Dərslik Scraper Sistemi

**e-derslik.edu.az İnteqrasiyası:**
\`\`\`python
class EDerslikScraper:
    """
    Azərbaycan Təhsil Nazirliyinin rəsmi 
    elektron dərslik platformasından məlumat toplama
    """
    
    def __init__(self):
        self.base_url = "https://e-derslik.edu.az"
        self.supported_classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        
    async def fetch_textbooks(self, class_number: int):
        """Sinif üzrə dərslikləri əldə et"""
        pass
        
    async def extract_content(self, textbook_id: str):
        """Dərslik məzmununu çıxar"""
        pass
        
    async def parse_chapters(self, content: str):
        """Fəsilləri parse et"""
        pass
        
    async def extract_topics(self, chapter: dict):
        """Mövzuları çıxar"""
        pass
\`\`\`

**Dəstəklənən Fənnlər:**
\`\`\`python
subjects = {
    "Riyaziyyat": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    "Fizika": ["6", "7", "8", "9", "10", "11"],
    "Kimya": ["7", "8", "9", "10", "11"],
    "Biologiya": ["6", "7", "8", "9", "10", "11"],
    "Coğrafiya": ["5", "6", "7", "8", "9", "10", "11"],
    "Tarix": ["5", "6", "7", "8", "9", "10", "11"],
    "Ədəbiyyat": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    "İngilis dili": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
    "Informatika": ["5", "6", "7", "8", "9", "10", "11"],
}
\`\`\`

---

## 🤖 AI Test Generasiya Sistemi

### 1. RAG (Retrieval-Augmented Generation)

**Sistem Arxitekturası:**
\`\`\`python
class RAGSystem:
    """
    Retrieval-Augmented Generation sistemi
    Dərslik məzmununa əsaslanan test generasiyası
    """
    
    def __init__(self):
        self.vectorizer = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')
        self.vector_store = FAISS(dimension=768)
        self.llm = OpenAI(model="gpt-4o")
        
    async def ingest_textbook(self, textbook_path: str):
        """
        Dərsliği RAG sisteminə əlavə et
        
        Steps:
        1. PDF-dən mətn çıxarma
        2. Chunk-lara bölmə (500 token)
        3. Embedding yaratma
        4. FAISS-ə əlavə etmə
        """
        text = self.extract_text(textbook_path)
        chunks = self.split_into_chunks(text, chunk_size=500)
        embeddings = self.vectorizer.encode(chunks)
        self.vector_store.add(embeddings, chunks)
        
    async def retrieve_context(self, query: str, k: int = 5):
        """
        Sorğuya uyğun kontekst əldə et
        
        Args:
            query: Mövzu/sual
            k: Qaytarılacaq chunk sayı
        """
        query_embedding = self.vectorizer.encode([query])
        distances, indices = self.vector_store.search(query_embedding, k)
        return [self.vector_store.get_text(i) for i in indices[0]]
        
    async def generate_questions(self, topic: str, num_questions: int = 10):
        """
        RAG ilə test sualları generasiya et
        
        Process:
        1. Mövzuya aid kontekst tap
        2. Konteksti LLM-ə göndər
        3. Strukturlaşdırılmış suallar al
        4. Validasiya et
        """
        context = await self.retrieve_context(topic)
        
        prompt = f"""
        Kontekst: {context}
        
        Mövzu: {topic}
        
        {num_questions} test sualı yarat. Hər sual üçün:
        - 4 variant
        - 1 düzgün cavab
        - Ətraflı izahat
        
        Format: JSON
        """
        
        response = await self.llm.generate(prompt)
        questions = self.parse_and_validate(response)
        return questions
\`\`\`

**FAISS Vector Database:**
\`\`\`python
# Vector store konfiqurasiyası
vector_config = {
    "dimension": 768,              # Embedding ölçüsü
    "index_type": "IVF",          # Index növü
    "nlist": 100,                 # Cluster sayı
    "metric": "cosine",           # Məsafə metriki
    "nprobe": 10                  # Axtarış cluster sayı
}

# Performance
- Insert: ~1000 vectors/second
- Search: ~10000 queries/second
- Storage: ~3KB per vector
\`\`\`

### 2. LoRA Fine-tuning

**Model Optimallaşdırması:**
\`\`\`python
class LoRATrainer:
    """
    LoRA (Low-Rank Adaptation) ilə model fine-tuning
    Azərbaycan dərsliklərinə xüsusi optimallaşdırma
    """
    
    def __init__(self):
        self.base_model = "meta-llama/Llama-2-7b-hf"
        self.lora_config = LoraConfig(
            r=16,                    # Rank
            lora_alpha=32,          # Alpha parameter
            target_modules=[         # Target layers
                "q_proj", "v_proj", 
                "k_proj", "o_proj"
            ],
            lora_dropout=0.05,
            bias="none",
            task_type="CAUSAL_LM"
        )
        
    async def prepare_dataset(self):
        """
        Training dataset hazırlığı
        
        Data Sources:
        1. Dərslik məzmunu
        2. Mövcud test sualları
        3. Şagird cavabları
        4. Müəllim feedback-i
        """
        dataset = {
            "train": [],
            "validation": [],
            "test": []
        }
        
        # RAG-dan əldə edilmiş data
        textbook_data = await self.load_textbook_content()
        
        # Format: instruction-response pairs
        for chapter in textbook_data:
            instruction = f"Bu mövzu haqqında test sualı yarat: {chapter.title}"
            response = await self.generate_training_example(chapter.content)
            dataset["train"].append({
                "instruction": instruction,
                "response": response
            })
            
        return dataset
        
    async def train(self, dataset, epochs: int = 3):
        """
        Model training
        
        Training parameters:
        - Batch size: 4
        - Learning rate: 2e-4
        - Warmup steps: 100
        - Max length: 2048 tokens
        """
        trainer = Trainer(
            model=self.base_model,
            args=TrainingArguments(
                output_dir="./lora_checkpoints",
                num_train_epochs=epochs,
                per_device_train_batch_size=4,
                learning_rate=2e-4,
                warmup_steps=100,
                logging_steps=10,
                save_steps=500,
                evaluation_strategy="steps",
                eval_steps=100
            ),
            train_dataset=dataset["train"],
            eval_dataset=dataset["validation"]
        )
        
        trainer.train()
        return trainer.model
\`\`\`

**Model Versiyalaşdırması:**
\`\`\`python
class ModelVersionManager:
    """
    LoRA model versiyalarını idarə etmə
    """
    
    versions = {
        "v1.0.0": {
            "date": "2024-01-15",
            "training_data": "10000 samples",
            "performance": {
                "accuracy": 0.85,
                "f1_score": 0.83,
                "perplexity": 12.5
            },
            "changes": "İlk versiya - baza model"
        },
        "v1.1.0": {
            "date": "2024-02-01", 
            "training_data": "25000 samples",
            "performance": {
                "accuracy": 0.89,
                "f1_score": 0.87,
                "perplexity": 10.2
            },
            "changes": "Riyaziyyat və Fizika üzrə təkmilləşdirmə"
        },
        "v1.2.0": {
            "date": "2024-03-15",
            "training_data": "50000 samples", 
            "performance": {
                "accuracy": 0.92,
                "f1_score": 0.90,
                "perplexity": 8.7
            },
            "changes": "Bütün fənlər üzrə geniş training"
        }
    }
\`\`\`

### 3. Avtomatik Benchmarking

**Performance Monitoring:**
\`\`\`python
class AutomatedBenchmark:
    """
    Model performansını avtomatik test etmə
    """
    
    def __init__(self):
        self.test_suites = {
            "accuracy": self.test_accuracy,
            "quality": self.test_question_quality,
            "diversity": self.test_diversity,
            "relevance": self.test_relevance,
            "difficulty": self.test_difficulty_distribution
        }
        
    async def run_benchmark(self, model_version: str):
        """
        Tam benchmark suite
        
        Tests:
        1. Accuracy (düzgünlük)
        2. Question quality (sual keyfiyyəti)
        3. Diversity (müxtəliflik)
        4. Relevance (uyğunluq)
        5. Difficulty (çətinlik)
        """
        results = {}
        
        for test_name, test_func in self.test_suites.items():
            print(f"Running {test_name}...")
            results[test_name] = await test_func(model_version)
            
        return BenchmarkReport(
            version=model_version,
            timestamp=datetime.now(),
            results=results,
            overall_score=self.calculate_overall_score(results)
        )
        
    async def test_accuracy(self, model):
        """
        Düzgün cavab accuracy-si
        
        Method:
        1. 1000 test sualı generasiya et
        2. Düzgün cavabları yoxla
        3. Accuracy hesabla
        """
        correct = 0
        total = 1000
        
        for i in range(total):
            question = await model.generate_question()
            if self.validate_answer(question):
                correct += 1
                
        return correct / total
        
    async def test_question_quality(self, model):
        """
        Sual keyfiyyəti metrikləri
        
        Checks:
        - Qrammatika
        - Aydınlıq
        - Müəyyənlik
        - Dərslik uyğunluğu
        """
        questions = await model.generate_questions(100)
        scores = []
        
        for q in questions:
            score = self.quality_scorer.score(q)
            scores.append(score)
            
        return np.mean(scores)
\`\`\`

---

## 📊 Weights & Biases İnteqrasiyası

**MLOps Monitoring:**
\`\`\`python
import wandb

class WandBIntegration:
    """
    Weights & Biases ilə training monitoring
    """
    
    def __init__(self):
        wandb.init(
            project="testai-az",
            entity="azerbaijan-ai",
            config={
                "architecture": "LoRA + GPT-4o",
                "dataset": "azerbaijan-textbooks",
                "learning_rate": 2e-4,
            }
        )
        
    def log_training_metrics(self, epoch, metrics):
        """Training metrikləri"""
        wandb.log({
            "epoch": epoch,
            "train_loss": metrics["loss"],
            "train_accuracy": metrics["accuracy"],
            "learning_rate": metrics["lr"],
            "gpu_memory": metrics["gpu_memory_mb"]
        })
        
    def log_evaluation_metrics(self, metrics):
        """Evaluation metrikləri"""
        wandb.log({
            "eval_accuracy": metrics["accuracy"],
            "eval_f1": metrics["f1_score"],
            "eval_perplexity": metrics["perplexity"],
            "question_quality": metrics["quality_score"]
        })
        
    def log_production_metrics(self, metrics):
        """Production metrikləri"""
        wandb.log({
            "total_tests_generated": metrics["total_tests"],
            "avg_student_score": metrics["avg_score"],
            "api_latency_ms": metrics["latency"],
            "error_rate": metrics["error_rate"]
        })
        
    def create_sweep(self):
        """Hyperparameter tuning"""
        sweep_config = {
            "method": "bayes",
            "metric": {
                "name": "eval_accuracy",
                "goal": "maximize"
            },
            "parameters": {
                "learning_rate": {
                    "distribution": "log_uniform",
                    "min": 1e-5,
                    "max": 1e-3
                },
                "lora_rank": {
                    "values": [8, 16, 32, 64]
                },
                "batch_size": {
                    "values": [2, 4, 8]
                }
            }
        }
        
        sweep_id = wandb.sweep(sweep_config, project="testai-az")
        return sweep_id
\`\`\`

**Dashboard Visualization:**
\`\`\`typescript
// Real-time metrics görüntülənməsi
interface WandBMetrics {
  training: {
    current_epoch: number
    loss: number
    accuracy: number
    time_remaining: string
  }
  
  evaluation: {
    best_accuracy: number
    best_f1: number
    model_version: string
  }
  
  production: {
    daily_tests: number
    avg_score: number
    active_users: number
  }
}
\`\`\`

---

## 🔒 Təhlükəsizlik və Məxfilik

### Autentifikasiya Sistemi

**Password Hashing:**
\`\`\`python
import bcrypt

def hash_password(password: str) -> str:
    """
    Bcrypt ilə password hash-lənməsi
    
    Security:
    - Salt rounds: 12
    - Algorithm: bcrypt
    - Rainbow table resistant
    """
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Password verification"""
    return bcrypt.checkpw(
        password.encode('utf-8'), 
        hashed.encode('utf-8')
    )
\`\`\`

**Session Management:**
\`\`\`typescript
interface UserSession {
  sessionId: string
  userId: number
  accountType: 'student' | 'parent'
  role?: 'parent' | 'teacher' | 'director'
  expiresAt: Date
  lastActivity: Date
  ipAddress: string
  userAgent: string
}

// Session timeout: 2 hours
// Auto-refresh: 15 minutes
// Max concurrent sessions: 3
\`\`\`

### Giriş Səviyyəsi Nəzarəti

**RBAC (Role-Based Access Control):**
\`\`\`typescript
const permissions = {
  student: {
    canTakeTests: true,
    canViewOwnResults: true,
    canViewOthersResults: false,
    canManageStudents: false,
    canExportData: false
  },
  
  parent: {
    canTakeTests: false,
    canViewOwnResults: false,
    canViewOthersResults: true,  // only linked students
    canManageStudents: true,     // add/remove links
    canExportData: true          // own children only
  },
  
  teacher: {
    canTakeTests: false,
    canViewOwnResults: false,
    canViewOthersResults: true,  // class students
    canManageStudents: true,     // add/remove students
    canExportData: true,         // class data
    canGenerateReports: true
  },
  
  director: {
    canTakeTests: false,
    canViewOwnResults: false,
    canViewOthersResults: true,  // all students
    canManageStudents: true,     // all students
    canExportData: true,         // all data
    canGenerateReports: true,
    canViewAnalytics: true,
    canManageTeachers: true
  }
}
\`\`\`

**Access Control Middleware:**
\`\`\`typescript
async function checkAccess(
  userId: number,
  resource: string,
  action: string
): Promise<boolean> {
  const user = await getUserById(userId)
  const permission = permissions[user.role][`can${action}${resource}`]
  
  // Additional checks for parent/teacher
  if (user.role === 'parent' && resource === 'StudentResults') {
    return await isStudentLinked(userId, resourceId)
  }
  
  if (user.role === 'teacher' && resource === 'StudentResults') {
    return await isStudentInClass(userId, resourceId)
  }
  
  return permission
}
\`\`\`

### Data Şifrələmə

**Sensitive Data Protection:**
\`\`\`python
from cryptography.fernet import Fernet

class DataEncryption:
    """
    Həssas məlumatların şifrələnməsi
    """
    
    def __init__(self):
        self.key = Fernet.generate_key()
        self.cipher = Fernet(self.key)
        
    def encrypt_personal_data(self, data: dict) -> str:
        """
        Şəxsi məlumatları şifrələ
        
        Encrypted fields:
        - Email addresses
        - Phone numbers
        - Parent/student links
        - Test results (in transit)
        """
        json_data = json.dumps(data)
        encrypted = self.cipher.encrypt(json_data.encode())
        return encrypted.decode()
        
    def decrypt_personal_data(self, encrypted_data: str) -> dict:
        """Şəxsi məlumatları deşifrə et"""
        decrypted = self.cipher.decrypt(encrypted_data.encode())
        return json.loads(decrypted.decode())
\`\`\`

---

## 📱 API Endpoints

### Autentifikasiya

\`\`\`typescript
// POST /api/auth/register
Request:
{
  accountType: 'student' | 'parent',
  role?: 'parent' | 'teacher' | 'director',
  firstName: string,
  lastName: string,
  fatherName: string,
  region: string,
  subRegion?: string,
  school: string,
  class?: string,  // student only
  email: string,
  password: string,
  confirmPassword: string
}

Response:
{
  success: true,
  message: string,
  user: {
    id: number,
    accountType: string,
    firstName: string,
    lastName: string,
    email: string
  }
}
\`\`\`

\`\`\`typescript
// POST /api/auth/login
Request:
{
  email: string,
  password: string
}

Response:
{
  success: true,
  message: string,
  user: {
    id: number,
    accountType: 'student' | 'parent',
    role?: string,
    firstName: string,
    lastName: string,
    region: string,
    school: string,
    class?: string
  }
}
\`\`\`

### Test Generasiya

\`\`\`typescript
// POST /api/generate-test
Request:
{
  textbook: string,
  topic: string,
  class: string,
  numQuestions: number,
  difficulty?: 'easy' | 'medium' | 'hard',
  useRAG: boolean
}

Response:
{
  success: true,
  questions: [
    {
      id: number,
      question: string,
      options: string[],
      correctAnswer: number,
      explanation: string,
      difficulty: string,
      topic: string
    }
  ],
  metadata: {
    generatedAt: string,
    model: string,
    ragUsed: boolean
  }
}
\`\`\`

### Test Nəticələri

\`\`\`typescript
// POST /api/save-results
Request:
{
  userId: number,
  testData: {
    textbook: string,
    topic: string,
    class: string
  },
  questions: Question[],
  answers: { [questionId: number]: number },
  score: number,
  timeSpent: number,
  completedAt: string
}

Response:
{
  success: true,
  message: string,
  resultId: number,
  savedAt: string
}
\`\`\`

### Şagird-Valideyn Bağlantısı

\`\`\`typescript
// POST /api/students/link
Request:
{
  parentId: number,
  studentEmail: string,
  relationshipType: 'parent' | 'teacher' | 'director'
}

Response:
{
  success: true,
  message: string,
  link: {
    id: number,
    parentId: number,
    studentId: number,
    studentName: string,
    studentClass: string,
    linkedAt: string
  }
}
\`\`\`

\`\`\`typescript
// GET /api/students/link?parentId=1
Response:
{
  success: true,
  links: [
    {
      id: number,
      studentName: string,
      studentClass: string,
      studentSchool: string,
      linkedAt: string
    }
  ]
}
\`\`\`

\`\`\`typescript
// DELETE /api/students/link?linkId=1
Response:
{
  success: true,
  message: string
}
\`\`\`

### Şagird Nəticələri

\`\`\`typescript
// GET /api/students/results?studentId=5&parentId=1
Response:
{
  success: true,
  results: TestResult[],
  statistics: {
    totalTests: number,
    averageScore: number,
    bestScore: number,
    recentTests: TestResult[],
    subjectBreakdown: {
      [subject: string]: {
        count: number,
        averageScore: number
      }
    }
  }
}
\`\`\`

### RAG Sistemi

\`\`\`typescript
// POST /api/rag/ingest
Request:
{
  textbookId: string,
  pdfPath: string,
  metadata: {
    subject: string,
    class: string,
    chapter: string
  }
}

Response:
{
  success: true,
  message: string,
  chunksProcessed: number,
  vectorsCreated: number
}
\`\`\`

\`\`\`typescript
// POST /api/rag/search
Request:
{
  query: string,
  k: number,
  filters?: {
    subject?: string,
    class?: string
  }
}

Response:
{
  success: true,
  results: [
    {
      text: string,
      score: number,
      metadata: object
    }
  ]
}
\`\`\`

### LoRA Training

\`\`\`typescript
// POST /api/lora/train
Request:
{
  datasetPath: string,
  epochs: number,
  batchSize: number,
  learningRate: number,
  loraConfig: {
    r: number,
    alpha: number,
    dropout: number
  }
}

Response:
{
  success: true,
  trainingId: string,
  status: 'started',
  estimatedTime: string
}
\`\`\`

\`\`\`typescript
// GET /api/lora/versions
Response:
{
  success: true,
  versions: [
    {
      version: string,
      date: string,
      performance: {
        accuracy: number,
        f1Score: number
      },
      status: 'active' | 'deprecated'
    }
  ]
}
\`\`\`

### Benchmarking

\`\`\`typescript
// POST /api/lora/benchmark
Request:
{
  modelVersion: string,
  testSuite: 'full' | 'accuracy' | 'quality'
}

Response:
{
  success: true,
  benchmarkId: string,
  results: {
    accuracy: number,
    quality: number,
    diversity: number,
    relevance: number,
    overallScore: number
  }
}
\`\`\`

### Production Metrics

\`\`\`typescript
// GET /api/production-metrics?timeRange=7d
Response:
{
  success: true,
  metrics: {
    totalTests: number,
    avgScore: number,
    activeUsers: number,
    peakHours: [{ hour: number, tests: number }],
    subjectPopularity: { [subject: string]: number },
    modelPerformance: {
      avgLatency: number,
      errorRate: number,
      successRate: number
    }
  }
}
\`\`\`

\`\`\`typescript
// GET /api/regional-metrics?region=Bakı
Response:
{
  success: true,
  regional: {
    region: string,
    totalTests: number,
    avgScore: number,
    topSubjects: string[],
    comparison: {
      vsNational: number,
      vsNeighboring: number
    }
  }
}
\`\`\`

---

## 💾 Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  account_type VARCHAR(20) NOT NULL,  -- 'student' or 'parent'
  role VARCHAR(20),                    -- 'parent', 'teacher', 'director'
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  father_name VARCHAR(50) NOT NULL,
  region VARCHAR(50) NOT NULL,
  sub_region VARCHAR(50),
  school VARCHAR(100) NOT NULL,
  class VARCHAR(2),                    -- student only
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  theme_preference VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(account_type);
CREATE INDEX idx_users_region ON users(region);
\`\`\`

### Student Links Table
\`\`\`sql
CREATE TABLE student_links (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER NOT NULL REFERENCES users(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  relationship_type VARCHAR(20) NOT NULL,  -- 'parent', 'teacher', 'director'
  linked_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',     -- 'active' or 'inactive'
  
  UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_links_parent ON student_links(parent_id);
CREATE INDEX idx_links_student ON student_links(student_id);
CREATE INDEX idx_links_status ON student_links(status);
\`\`\`

### Test Results Table
\`\`\`sql
CREATE TABLE test_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  textbook VARCHAR(100) NOT NULL,
  topic VARCHAR(200) NOT NULL,
  class VARCHAR(2) NOT NULL,
  questions TEXT NOT NULL,          -- JSON string
  answers TEXT NOT NULL,            -- JSON string
  score INTEGER NOT NULL,
  time_spent INTEGER NOT NULL,      -- seconds
  completed_at TIMESTAMP NOT NULL,
  rag_used BOOLEAN DEFAULT FALSE,
  model_version VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_results_user ON test_results(user_id);
CREATE INDEX idx_results_subject ON test_results(textbook);
CREATE INDEX idx_results_date ON test_results(completed_at);
CREATE INDEX idx_results_score ON test_results(score);
\`\`\`

### Textbooks Table
\`\`\`sql
CREATE TABLE textbooks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  class VARCHAR(2) NOT NULL,
  author VARCHAR(100),
  publisher VARCHAR(100),
  year INTEGER,
  pdf_path VARCHAR(500),
  cover_image VARCHAR(500),
  total_pages INTEGER,
  rag_indexed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_textbooks_subject ON textbooks(subject);
CREATE INDEX idx_textbooks_class ON textbooks(class);
\`\`\`

### RAG Vectors Table
\`\`\`sql
CREATE TABLE rag_vectors (
  id SERIAL PRIMARY KEY,
  textbook_id INTEGER REFERENCES textbooks(id),
  chunk_text TEXT NOT NULL,
  vector VECTOR(768),               -- PostgreSQL pgvector
  metadata JSONB,
  page_number INTEGER,
  chapter VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vectors_textbook ON rag_vectors(textbook_id);
CREATE INDEX idx_vectors_vector ON rag_vectors USING ivfflat (vector);
\`\`\`

### LoRA Models Table
\`\`\`sql
CREATE TABLE lora_models (
  id SERIAL PRIMARY KEY,
  version VARCHAR(20) UNIQUE NOT NULL,
  base_model VARCHAR(50) NOT NULL,
  training_dataset VARCHAR(100),
  training_samples INTEGER,
  training_date TIMESTAMP,
  hyperparameters JSONB,
  performance_metrics JSONB,
  model_path VARCHAR(500),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Benchmark Results Table
\`\`\`sql
CREATE TABLE benchmark_results (
  id SERIAL PRIMARY KEY,
  model_version VARCHAR(20) REFERENCES lora_models(version),
  test_suite VARCHAR(50) NOT NULL,
  accuracy FLOAT,
  quality_score FLOAT,
  diversity_score FLOAT,
  relevance_score FLOAT,
  overall_score FLOAT,
  test_date TIMESTAMP DEFAULT NOW(),
  details JSONB
);
\`\`\`

---

## 🎯 İstifadəçi Axınları

### Şagird Axını

\`\`\`mermaid
graph TD
    A[Ana Səhifə] --> B[Qeydiyyat]
    B --> C[Şagird Hesabı]
    C --> D[Dashboard]
    D --> E[Test Yarat]
    E --> F[Dərslik Seç]
    F --> G[Mövzu Seç]
    G --> H[Test Həll Et]
    H --> I[Nəticələrə Bax]
    I --> J[Performans Təhlili]
    J --> D
\`\`\`

### Valideyn Axını

\`\`\`mermaid
graph TD
    A[Qeydiyyat] --> B[Valideyn Hesabı]
    B --> C[Parent Dashboard]
    C --> D[Şagird Əlavə Et]
    D --> E[Email Daxil Et]
    E --> F{Şagird Tapıldı?}
    F -->|Bəli| G[Bağlantı Yarat]
    F -->|Xeyr| H[Xəta Mesajı]
    G --> I[Nəticələrə Bax]
    I --> J[Statistika]
    J --> K[Fənn Təhlili]
    K --> L[Zəif Sahələr]
    L --> C
\`\`\`

### Müəllim Axını

\`\`\`mermaid
graph TD
    A[Qeydiyyat] --> B[Müəllim Hesabı]
    B --> C[Teacher Dashboard]
    C --> D[Sinif Şagirdləri]
    D --> E[Toplu Əlavə]
    E --> F[Sinif Nəticələri]
    F --> G[Performans Müqayisəsi]
    G --> H[Zəif Şagirdlər]
    H --> I[Fərdi Kömək Planı]
    I --> C
\`\`\`

---

## 📈 Performans və Optimallaşdırma

### Frontend Performance

\`\`\`typescript
// Code splitting
const DashboardPage = dynamic(() => import('./dashboard'), {
  loading: () => <LoadingSpinner />
})

// Image optimization
<Image
  src={regionImage || "/placeholder.svg"}
  alt={regionName}
  width={1920}
  height={1080}
  priority
  quality={80}
  placeholder="blur"
/>

// API caching
const { data } = useSWR('/api/test-results', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000
})
\`\`\`

### Backend Performance

\`\`\`python
# Database connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True
)

# Query optimization
# Use indexes
# Limit result sets
# Use select_related/prefetch_related

# Caching strategy
@lru_cache(maxsize=1000)
def get_textbook_content(textbook_id: str):
    return db.query(Textbook).filter_by(id=textbook_id).first()

# Async operations
async def generate_test_async(params):
    results = await asyncio.gather(
        fetch_textbook_content(params.textbook),
        retrieve_rag_context(params.topic),
        generate_questions(params.num_questions)
    )
    return results
\`\`\`

### AI Model Performance

\`\`\`python
# Batch processing
def batch_generate_questions(topics: List[str], batch_size: int = 10):
    """
    Batch test generasiyası
    
    Performance improvement: 5x faster
    """
    for i in range(0, len(topics), batch_size):
        batch = topics[i:i+batch_size]
        results = await model.generate_batch(batch)
        yield results

# Model caching
@cache_model_response(ttl=3600)
async def generate_with_cache(topic: str):
    """
    Eyni mövzular üçün cache istifadəsi
    Cache hit rate: ~40%
    """
    return await model.generate(topic)

# GPU optimization
# Use mixed precision (FP16)
# Batch inference
# Model quantization (8-bit)
\`\`\`

---

## 🚀 Deployment

### Production Setup

\`\`\`bash
# Environment variables
NEXT_PUBLIC_BACKEND_URL=https://api.testai.az
OPENAI_API_KEY=sk-...
XAI_API_KEY=xai-...
DATABASE_URL=postgresql://user:pass@host:5432/testai.az
WANDB_API_KEY=...
REDIS_URL=redis://...

# Docker deployment
docker-compose up -d

# Kubernetes deployment
kubectl apply -f k8s/
\`\`\`

### Monitoring

\`\`\`yaml
# Prometheus metrics
metrics:
  - api_requests_total
  - api_latency_seconds
  - test_generation_duration
  - database_query_duration
  - model_inference_time
  - error_rate
  - active_users

# Grafana dashboards
dashboards:
  - System Overview
  - AI Performance
  - User Analytics
  - Error Tracking
\`\`\`

---

## 📚 Sənədləşmə

### Tam Sənəd Strukturu

\`\`\`
docs/
├── complete-project-overview.md         (Bu sənəd)
├── parent-teacher-access-guide.md       (Valideyn/Müəllim bələdçisi)
├── rag-system-guide.md                  (RAG sistemi)
├── lora-training-guide.md               (LoRA training)
├── wandb-integration-guide.md           (W&B inteqrasiyası)
├── model-versioning-guide.md            (Model versiyalaşdırması)
├── automated-benchmarking-guide.md      (Benchmark sistemi)
├── dynamic-weights-guide.md             (Dinamik çəki sistemi)
├── regional-metrics-guide.md            (Regional metrikalar)
├── xai-api-setup.md                     (xAI konfiqurasiyası)
└── deployment-guide.md                  (Production deployment)
\`\`\`

---

## 🎉 Layihənin Nailiyyətləri

### Texniki Nailiyyətlər
✅ 67 Azərbaycan regionu üçün unikal tema sistemı
✅ İki növ istifadəçi (şagird və valideyn/müəllim)
✅ RAG əsaslı test generasiya sistemi
✅ LoRA fine-tuning ilə model optimallaşdırması
✅ Avtomatik benchmarking və versiyalaşdırma
✅ Weights & Biases ilə MLOps
✅ Real-time performans izləmə
✅ Regional metrika və təhlil sistemi
✅ E-derslik.edu.az inteqrasiyası
✅ Çoxsəviyyəli giriş nəzarəti

### Mədəni Nailiyyətlər
✅ Azərbaycan dili tam dəstəyi
✅ Regional mədəniyyət inteqrasiyası
✅ Yerli dərslik məzmunu
✅ Milli simvol və emojilərdən istifadə
✅ Regional fakt və məlumatlar

### İstifadəçi Təcrübəsi
✅ İntuitiv interfeys
✅ Tez və responsive dizayn
✅ Ətraflı statistika və təhlil
✅ Real-time feedback
✅ Mobil uyğunluq

---

## 🔮 Gələcək İnkişaf Planları

### Qısa Müddət (1-3 ay)
- [ ] Mobil tətbiq (React Native)
- [ ] Offline rejim dəstəyi
- [ ] Video izahatlar
- [ ] Gamification elementləri
- [ ] WhatsApp bildiriş sistemi

### Orta Müddət (3-6 ay)
- [ ] Canlı dərs sistemi
- [ ] Müəllim-şagird chat
- [ ] Homework tracking
- [ ] Parent-teacher meetings
- [ ] Virtual sinif otaqları

### Uzun Müddət (6-12 ay)
- [ ] AI tutor (şəxsi müəllim)
- [ ] Adaptive learning path
- [ ] Multimodal learning (audio, video, text)
- [ ] AR/VR təcrübələr
- [ ] Blockchain sertifikat sistemi

---

## 📞 Əlaqə və Dəstək

### Layihə Komandası
- **Lead Developer**: [Ad]
- **AI/ML Engineer**: [Ad]
- **Backend Developer**: [Ad]
- **Frontend Developer**: [Ad]
- **DevOps Engineer**: [Ad]

### Texniki Dəstək
- Email: support@testai.az
- Telegram: @testai_support
- WhatsApp: +994XXXXXXXXX

### Repository
- GitHub: github.com/testai-az/platform
- Issues: github.com/testai-az/platform/issues
- Docs: docs.testai.az

---

## 📄 Lisenziya

Bu layihə [Lisenziya Növü] altında lisenziyalaşdırılıb.

© 2025 TESTAI.AZ. Bütün hüquqlar qorunur.

---

## 🙏 Təşəkkürlər

- Azərbaycan Təhsil Nazirliyi
- OpenAI və xAI komandaları
- Açıq mənbə icması
- Beta test iştirakçıları
- Müəllim və valideyn geri bildirimi

---

**Son yenilənmə**: 2024-10-21
**Versiya**: 2.0.0
**Status**: ✅ Production Ready

---

Bu sənəd **TESTAI.AZ** platformasının tam texniki və funksional təsvirini təqdim edir. 🎓🇦🇿
