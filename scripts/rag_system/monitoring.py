import time
from collections import defaultdict

class IngestionMonitor:
    """
    Dəlillərin yüklənməsi prosesini izləyən modul.
    """
    def __init__(self):
        self.start_time = time.time()
        self.stats = defaultdict(int)
        self.scores = []

    def log_chunk(self, score: float):
        self.stats["total_chunks"] += 1
        if score < 0.6:
            self.stats["low_quality_skipped"] += 1
        else:
            self.stats["accepted"] += 1
        self.scores.append(score)

    def get_summary(self):
        avg_score = sum(self.scores) / len(self.scores) if self.scores else 0
        return {
            "elapsed_time": round(time.time() - self.start_time, 2),
            "total_processed": self.stats["total_chunks"],
            "accepted": self.stats["accepted"],
            "skipped": self.stats["low_quality_skipped"],
            "average_quality": round(avg_score, 3)
        }
