"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Folder,
  BookOpen,
  Layers,
  List,
  Loader2,
  CheckCircle2,
  BarChart2,
  Search,
  Filter,
  Award,
  HelpCircle,
  Copy,
  Check,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Analytics Modal Component
const AnalyticsModal = ({ isOpen, onClose, question }: any) => {
  if (!isOpen || !question) return null;

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

  const mockDifficulty = Math.floor(seededRandom(seed) * 40) + 40;
  const mockDiscrimination = (seededRandom(seed + 1) * 0.5 + 0.3).toFixed(2);
  const mockTime = Math.floor(seededRandom(seed + 2) * 30) + 15;
  const mockDropOut = Math.floor(seededRandom(seed + 3) * 10) + 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="text-blue-500" /> Sual Analitikası (Item Analysis)
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg italic text-sm">
            "{question.question}"
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-xs text-slate-400 mb-1">Çətinlik İndeksi</p>
              <p className="text-2xl font-bold text-green-400">{mockDifficulty}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Düzgün cavablandırma</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-xs text-slate-400 mb-1">Ayıredicilik (D.I.)</p>
              <p className="text-2xl font-bold text-blue-400">{mockDiscrimination}</p>
              <p className="text-[10px] text-slate-500 mt-1">Güclü/Zəif fərqi</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-xs text-slate-400 mb-1">Ortalama Zaman</p>
              <p className="text-2xl font-bold text-orange-400">{mockTime}s</p>
              <p className="text-[10px] text-slate-500 mt-1">Həll vaxtı</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
              <p className="text-xs text-slate-400 mb-1">Drop-out Rate</p>
              <p className="text-2xl font-bold text-red-400">{mockDropOut}%</p>
              <p className="text-[10px] text-slate-500 mt-1">Testi atıb gedənlər</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-slate-300">Distractor (Çaşdırıcı) Analizi</h4>
            <div className="space-y-3">
              {question.options?.map((opt: string, idx: number) => {
                const letter = String.fromCharCode(65 + idx);
                const isCorrect = question.correctAnswer === idx;
                const pickRate = isCorrect
                  ? mockDifficulty
                  : Math.floor((100 - mockDifficulty) / Math.max(1, question.options.length - 1));

                return (
                  <div key={idx} className="flex items-center gap-4 text-xs">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold ${
                        isCorrect ? "bg-green-500 text-white" : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {letter}
                    </span>
                    <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${isCorrect ? "bg-green-500" : "bg-slate-500"}`}
                        style={{ width: `${pickRate}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-right font-medium">{pickRate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function QuestionsViewerContent() {
  const searchParams = useSearchParams();
  const initialGrade = searchParams.get("grade");
  const initialSubject = searchParams.get("subject");

  const [grades, setGrades] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(initialGrade);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(initialSubject);

  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyticsQuestion, setAnalyticsQuestion] = useState<any>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPassportId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Load Grades
  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/test-bank/hierarchy")
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "grades") {
          setGrades(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 2. Load Subjects when Grade changes
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
        })
        .catch(() => setLoading(false));
    } else {
      setSubjects([]);
      setSelectedSubject(null);
      setTopics([]);
      setSelectedTopic(null);
      setQuestions([]);
    }
  }, [selectedGrade]);

  // 3. Load Topics when Subject changes
  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      setLoading(true);
      fetch(
        `/api/admin/test-bank/hierarchy?grade=${selectedGrade}&subject=${encodeURIComponent(
          selectedSubject
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.type === "topics") {
            setTopics(data.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setTopics([]);
      setSelectedTopic(null);
      setQuestions([]);
    }
  }, [selectedGrade, selectedSubject]);

  // 4. Load Questions for a Topic
  const handleTopicClick = (topicName: string) => {
    if (selectedTopic === topicName) {
      setSelectedTopic(null);
      return;
    }
    setSelectedTopic(topicName);
    setQuestions([]);
    setLoading(true);

    fetch(
      `/api/admin/test-bank/hierarchy?grade=${selectedGrade}&subject=${encodeURIComponent(
        selectedSubject!
      )}&topic=${encodeURIComponent(topicName)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.type === "questions") {
          setQuestions(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Filter questions by search query and difficulty
  const filteredQuestions = questions.filter((q) => {
    if (selectedDifficulty !== "all") {
      const qDiff = (q.difficulty || "").toLowerCase();
      if (!qDiff.includes(selectedDifficulty.toLowerCase())) return false;
    }
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase().trim();
      const qText = (q.question || q.q || "").toLowerCase();
      const pId = (q.passport_id || "").toLowerCase();
      const opts = Array.isArray(q.options) ? q.options.join(" ").toLowerCase() : "";
      const expl = (q.explanation || q.izah || "").toLowerCase();
      return qText.includes(s) || pId.includes(s) || opts.includes(s) || expl.includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <AnalyticsModal
        isOpen={!!analyticsQuestion}
        onClose={() => setAnalyticsQuestion(null)}
        question={analyticsQuestion}
      />

      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-3 border-b pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Sual Mərkəzi (Question Explorer)
            </h1>
            <p className="text-slate-500 mt-1">
              69,000 suallıq test bazasını sinif, fənn və mövzu iyerarxiyası üzrə gəzin və yoxlayın.
            </p>
          </div>
          <Badge className="w-fit bg-blue-600 text-white font-medium">
            Struktur: Sinif → Fənn → Mövzu → Sual
          </Badge>
        </div>

        {/* Interactive Breadcrumb Navigation */}
        <div className="flex items-center flex-wrap gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
          <button
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition ${
              !selectedGrade ? "bg-blue-600 text-white font-bold" : "hover:text-blue-600 text-slate-700"
            }`}
            onClick={() => {
              setSelectedGrade(null);
              setSelectedSubject(null);
              setSelectedTopic(null);
            }}
          >
            <Folder size={16} /> Bütün Baza (2-11)
          </button>

          {selectedGrade && (
            <>
              <ChevronRight size={14} className="text-slate-400" />
              <button
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition ${
                  selectedGrade && !selectedSubject
                    ? "bg-blue-600 text-white font-bold"
                    : "hover:text-blue-600 text-slate-700"
                }`}
                onClick={() => {
                  setSelectedSubject(null);
                  setSelectedTopic(null);
                }}
              >
                <BookOpen size={16} /> {selectedGrade}-ci Sinif
              </button>
            </>
          )}

          {selectedSubject && (
            <>
              <ChevronRight size={14} className="text-slate-400" />
              <button
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition ${
                  selectedSubject && !selectedTopic
                    ? "bg-blue-600 text-white font-bold"
                    : "hover:text-blue-600 text-slate-700"
                }`}
                onClick={() => setSelectedTopic(null)}
              >
                <Layers size={16} /> {selectedSubject}
              </button>
            </>
          )}

          {selectedTopic && (
            <>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold text-xs line-clamp-1 max-w-xs">
                <List size={14} /> {selectedTopic}
              </span>
            </>
          )}
        </div>
      </div>

      {/* STEP 1: SELECT GRADE */}
      {!selectedGrade && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">1. Sinif Seçin</h2>
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {grades.map((g) => {
                const gradeNum = g.grade || g;
                const qCount = g.questionsCount || 0;
                const sCount = g.subjectsCount || 0;

                return (
                  <div
                    key={gradeNum}
                    onClick={() => setSelectedGrade(String(gradeNum))}
                    className="cursor-pointer rounded-xl bg-white border border-slate-200 p-5 shadow-sm transition-all hover:border-blue-500 hover:shadow-md group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Folder size={20} />
                      </div>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {gradeNum}-ci sinif
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{gradeNum}-ci Sinif</h3>
                      {qCount > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          {qCount.toLocaleString()} sual • {sCount} fənn
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: SELECT SUBJECT */}
      {selectedGrade && !selectedSubject && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              2. {selectedGrade}-ci Sinif üzrə Fənn / Dərslik Seçin
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedGrade(null)}
              className="text-slate-500 text-xs"
            >
              ← Siniflərə qayıt
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((sub: any, idx: number) => {
                const title = typeof sub === "string" ? sub : sub.title || sub.name;
                const count = typeof sub === "object" ? sub.questionCount || sub.count : null;
                const tCount = typeof sub === "object" ? sub.topicsCount : null;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedSubject(title)}
                    className="cursor-pointer rounded-xl bg-white border border-slate-200 p-5 shadow-sm transition-all hover:border-purple-500 hover:shadow-md flex flex-col justify-between group"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors mt-0.5">
                        <BookOpen size={18} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 flex-1">
                        {title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t text-xs text-slate-500">
                      <span className="font-semibold text-emerald-600">
                        {count ? `${count.toLocaleString()} sual` : "Sual yoxdur"}
                      </span>
                      {tCount && <span>{tCount} mövzu</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 3 & 4: TOPICS & QUESTIONS */}
      {selectedGrade && selectedSubject && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{selectedSubject}</h2>
              <p className="text-xs text-slate-500">
                {selectedGrade}-ci sinif • {topics.length} mövzu
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSubject(null)}
                className="text-xs"
              >
                ← Fənlərə qayıt
              </Button>
            </div>
          </div>

          {loading && !selectedTopic && (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
          )}

          {topics.length === 0 && !loading && (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500">Bu fənn üçün hələlik test bazası tapılmadı.</p>
            </div>
          )}

          <div className="space-y-3">
            {topics.map((t, idx) => {
              const isExpanded = selectedTopic === t.name;

              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all ${
                    isExpanded
                      ? "border-blue-500 bg-white shadow-md ring-1 ring-blue-500"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => handleTopicClick(t.name)}
                  >
                    <div className="flex items-center gap-3 flex-1 pr-4">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isExpanded ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <List size={18} />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">{t.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-semibold text-xs">
                        {t.questionCount} Sual
                      </Badge>
                      <ChevronRight
                        size={16}
                        className={`text-slate-400 transition-transform ${
                          isExpanded ? "rotate-90 text-blue-600" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* EXPANDED QUESTIONS LIST */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 p-6 bg-slate-50/70 space-y-4">
                      {/* Search & Filter Bar inside topic */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border">
                        <div className="relative flex-1 w-full">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Mövzu daxilində suallarda axtarış..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 text-xs h-9"
                          />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Filter className="h-4 w-4 text-slate-400" />
                          <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="text-xs h-9 px-3 rounded-md border border-slate-200 bg-white"
                          >
                            <option value="all">Bütün Çətinliklər</option>
                            <option value="sadə">Sadə</option>
                            <option value="orta">Orta</option>
                            <option value="çətin">Çətin</option>
                          </select>
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="animate-spin text-blue-600" size={32} />
                        </div>
                      ) : filteredQuestions.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 text-sm bg-white rounded-lg border">
                          Heç bir sual tapılmadı.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-xs font-semibold text-slate-500">
                            Cəmi {filteredQuestions.length} sual göstərilir:
                          </p>

                          {filteredQuestions.map((q, qIdx) => {
                            const ansLetter = (q.correct_answer || q.answer || "").toString().trim().toUpperCase();
                            const correctIdx =
                              typeof q.correctAnswer === "number"
                                ? q.correctAnswer
                                : typeof q.correct_index === "number"
                                ? q.correct_index
                                : ansLetter === "B"
                                ? 1
                                : ansLetter === "C"
                                ? 2
                                : ansLetter === "D"
                                ? 3
                                : ansLetter === "E"
                                ? 4
                                : 0;

                            const opts = Array.isArray(q.options)
                              ? q.options
                              : Array.isArray(q.opts)
                              ? q.opts
                              : [];

                            const diffText = (q.difficulty || "orta").toLowerCase();
                            const diffBadgeColor = diffText.includes("sad")
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : diffText.includes("çət")
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200";

                            const pId = q.passport_id || `0${selectedGrade}-Q-${qIdx + 1}`;

                            return (
                              <div
                                key={q.id || qIdx}
                                className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4"
                              >
                                {/* Top Meta Row */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                                      {qIdx + 1}
                                    </span>
                                    <button
                                      onClick={() => copyPassportId(pId)}
                                      className="flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition"
                                      title="Pasport ID-ni kopyala"
                                    >
                                      {copiedId === pId ? (
                                        <Check size={12} className="text-emerald-600" />
                                      ) : (
                                        <Copy size={12} />
                                      )}
                                      <span>{pId}</span>
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`text-[10px] font-medium ${diffBadgeColor}`}>
                                      {q.difficulty || "Orta"}
                                    </Badge>
                                    {(q.bloomLevel || q.bloom_level) && (
                                      <Badge variant="outline" className="text-[10px] font-medium bg-purple-50 text-purple-700 border-purple-200">
                                        Bloom: {q.bloomLevel || q.bloom_level}
                                      </Badge>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setAnalyticsQuestion(q)}
                                      className="h-7 text-xs flex items-center gap-1.5 text-blue-600 hover:bg-blue-50"
                                    >
                                      <BarChart2 size={14} /> Analitika
                                    </Button>
                                  </div>
                                </div>

                                {/* Question Text */}
                                <p className="text-sm md:text-base text-slate-900 font-semibold leading-relaxed">
                                  {q.question || q.q}
                                </p>

                                {/* Options A, B, C, D */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {opts.map((optVal: string, optIdx: number) => {
                                    const letter = String.fromCharCode(65 + optIdx);
                                    const isCorrect = correctIdx === optIdx;

                                    return (
                                      <div
                                        key={optIdx}
                                        className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs leading-relaxed transition ${
                                          isCorrect
                                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium"
                                            : "bg-slate-50 border-slate-200 text-slate-700"
                                        }`}
                                      >
                                        <span
                                          className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
                                            isCorrect
                                              ? "bg-emerald-600 text-white"
                                              : "bg-slate-200 text-slate-700"
                                          }`}
                                        >
                                          {letter}
                                        </span>
                                        <span className="flex-1 mt-0.5">
                                          {optVal.replace(/^[A-D]\)\s*/i, "")}
                                        </span>
                                        {isCorrect && (
                                          <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={16} />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Explanation (İzah) */}
                                {(q.explanation || q.izah) && (
                                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                                    <HelpCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold">İzah: </span>
                                      <span>{q.explanation || q.izah}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuestionsViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
      }
    >
      <QuestionsViewerContent />
    </Suspense>
  );
}
