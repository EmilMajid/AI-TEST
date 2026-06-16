"use client";

import React, { useState, useEffect } from "react";
import { Folder, BookOpen, Layers, List, Loader2, CheckCircle2, BarChart2, X, Lock, Unlock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Analytics Modal Component (Demo / Mock Data)
const AnalyticsModal = ({ isOpen, onClose, question }: any) => {
  if (!isOpen || !question) return null;

  // Simple hash function to seed the mock data based on the question text
  const getSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; 
    }
    return Math.abs(hash);
  };

  const seed = getSeed(question.question || "");
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  // Generate consistent mock data using the seed
  const mockDifficulty = Math.floor(seededRandom(seed) * 40) + 40; // 40-80%
  const mockDiscrimination = (seededRandom(seed + 1) * 0.5 + 0.3).toFixed(2); // 0.3 - 0.8
  const mockTime = Math.floor(seededRandom(seed + 2) * 30) + 15; // 15-45 sec
  const mockDropOut = Math.floor(seededRandom(seed + 3) * 10) + 1; // 1-10%

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="text-blue-500" /> Sual Analitikası (Item Analysis)
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg italic">
            "{question.question}"
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-1">Çətinlik İndeksi</p>
              <p className="text-3xl font-bold text-green-400">{mockDifficulty}%</p>
              <p className="text-xs text-slate-500 mt-1">Düzgün cavablandırma</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-1">Ayıredicilik (D.I.)</p>
              <p className="text-3xl font-bold text-blue-400">{mockDiscrimination}</p>
              <p className="text-xs text-slate-500 mt-1">Güclü/Zəif fərqi</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-1">Ortalama Zaman</p>
              <p className="text-3xl font-bold text-orange-400">{mockTime}s</p>
              <p className="text-xs text-slate-500 mt-1">Həll vaxtı</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-sm text-slate-400 mb-1">Drop-out Rate</p>
              <p className="text-3xl font-bold text-red-400">{mockDropOut}%</p>
              <p className="text-xs text-slate-500 mt-1">Testi atıb gedənlər</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">Distractor (Çağdırıcı) Analizi</h4>
            <div className="space-y-3">
              {question.options?.map((opt: string, idx: number) => {
                const letter = String.fromCharCode(65 + idx);
                const isCorrect = question.correctAnswer === idx;
                const pickRate = isCorrect ? mockDifficulty : Math.floor((100 - mockDifficulty) / (question.options.length - 1));
                
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded flex items-center justify-center font-bold ${isCorrect ? 'bg-green-500' : 'bg-slate-700'}`}>
                      {letter}
                    </span>
                    <div className="flex-1 bg-slate-800 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full ${isCorrect ? 'bg-green-500' : 'bg-slate-500'}`} 
                        style={{ width: `${pickRate}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right font-medium">{pickRate}%</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function QuestionsViewerPage() {
  const [grades, setGrades] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [analyticsQuestion, setAnalyticsQuestion] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/test-bank/hierarchy")
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "grades") {
          setGrades(data.data);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      setLoading(true);
      fetch(`/api/admin/test-bank/hierarchy?grade=${selectedGrade}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.type === "subjects") {
            setSubjects(data.data);
          }
          setLoading(false);
        });
    }
  }, [selectedGrade]);

  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      setLoading(true);
      fetch(`/api/admin/test-bank/hierarchy?grade=${selectedGrade}&subject=${selectedSubject}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.type === "topics") {
            setTopics(data.data);
          }
          setLoading(false);
        });
    }
  }, [selectedGrade, selectedSubject]);

  const handleTopicClick = (topicName: string) => {
    if (selectedTopic === topicName) {
      setSelectedTopic(null);
      return;
    }
    setSelectedTopic(topicName);
    setQuestions([]);
    setLoading(true);

    fetch(`/api/admin/test-bank/hierarchy?grade=${selectedGrade}&subject=${selectedSubject}&topic=${topicName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "questions") {
          setQuestions(data.data);
        }
        setLoading(false);
      });
  };

  return (
    <div className="p-6 font-sans">
      <AnalyticsModal isOpen={!!analyticsQuestion} onClose={() => setAnalyticsQuestion(null)} question={analyticsQuestion} />
      
      <header className="mb-8 flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-bold">Sual Mərkəzi (Viewer & Analytics)</h1>
        <p className="text-slate-500">
          Sualları iyerarxik gəzin və hər bir sualın Element Analizini aparın.
        </p>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 mt-4 text-sm font-medium text-slate-600">
          <span
            className="cursor-pointer hover:text-blue-500 flex items-center gap-2"
            onClick={() => {
              setSelectedGrade(null);
              setSelectedSubject(null);
              setSelectedTopic(null);
            }}
          >
            <Folder size={16} /> Bütün Baza
          </span>
          {selectedGrade && (
            <>
              <span>/</span>
              <span
                className="cursor-pointer hover:text-blue-500 flex items-center gap-2"
                onClick={() => {
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                }}
              >
                <BookOpen size={16} /> {selectedGrade}-ci sinif
              </span>
            </>
          )}
          {selectedSubject && (
            <>
              <span>/</span>
              <span className="text-blue-600 flex items-center gap-2">
                <Layers size={16} /> {selectedSubject}
              </span>
            </>
          )}
        </div>
      </header>

      {loading && !selectedTopic && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      )}

      {/* STEP 1: GRADES */}
      {!selectedGrade && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {grades.map((grade) => (
            <div
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className="cursor-pointer rounded-xl bg-white border border-slate-200 p-6 shadow-sm transition hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                  <Folder size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{grade}-ci sinif</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: SUBJECTS */}
      {selectedGrade && !selectedSubject && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((sub: any, idx: number) => {
            const title = typeof sub === 'string' ? sub : sub.title;
            const count = typeof sub === 'string' ? null : sub.count;
            return (
              <div
                key={idx}
                onClick={() => setSelectedSubject(title)}
                className="cursor-pointer rounded-xl bg-white border border-slate-200 p-5 shadow-sm transition hover:border-purple-500 hover:shadow-md flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-50 text-purple-500">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-sm font-bold line-clamp-2 flex-1">{title}</h3>
                </div>
                {count !== null && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                    count > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {count > 0 ? `${count} sual` : 'Sual yoxdur'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 3 & 4: TOPICS & QUESTIONS */}
      {selectedGrade && selectedSubject && (
        <div className="flex flex-col gap-3">
          {topics.length === 0 && !loading && (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500">Bu fənn üçün hələlik test bazası tapılmadı.</p>
            </div>
          )}

          {topics.map((t, idx) => {
            const isExpanded = selectedTopic === t.name;

            return (
              <div key={idx} className={`rounded-xl border transition-colors ${isExpanded ? "border-blue-500 bg-blue-50/10" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => handleTopicClick(t.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isExpanded ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                      <List size={18} />
                    </div>
                    <h3 className="text-base font-semibold">{t.name}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-slate-100 text-xs font-medium rounded-full text-slate-600 border border-slate-200">
                      {t.questionCount} Sual
                    </span>
                  </div>
                </div>

                {/* Expanded Questions Area */}
                {isExpanded && (
                  <div className="border-t border-slate-200 p-6 bg-slate-50">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-blue-500" size={30} />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((q, qIdx) => (
                          <div key={q.id || qIdx} className="p-5 rounded-lg bg-white border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex gap-4 flex-1">
                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                  {qIdx + 1}
                                </span>
                                <div className="flex-1">
                                  {/* Fixed: Use q.question instead of q.text */}
                                  <p className="text-base text-slate-800 mb-4 leading-relaxed whitespace-pre-wrap font-medium">{q.question}</p>
                                  
                                  <div className="space-y-2 max-w-2xl">
                                    {/* Fixed: Iterate array and convert to A, B, C, D */}
                                    {Array.isArray(q.options) && q.options.map((optVal: string, optIdx: number) => {
                                      const letter = String.fromCharCode(65 + optIdx);
                                      const isCorrect = q.correctAnswer === optIdx;
                                      return (
                                        <div 
                                          key={optIdx} 
                                          className={`flex items-start gap-3 p-3 rounded-md border ${
                                            isCorrect 
                                              ? "bg-green-50 border-green-200 text-green-900" 
                                              : "bg-slate-50 border-transparent text-slate-700"
                                          }`}
                                        >
                                          <span className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                            isCorrect ? "bg-green-500 text-white" : "bg-slate-200 text-slate-600"
                                          }`}>
                                            {letter}
                                          </span>
                                          <span className="flex-1 text-sm">{optVal}</span>
                                          {isCorrect && <CheckCircle2 className="text-green-500" size={18} />}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => setAnalyticsQuestion(q)}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 rounded-md text-sm font-medium transition"
                              >
                                <BarChart2 size={16} /> Analitika
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
