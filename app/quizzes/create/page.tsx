"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Loader2, 
  Settings2,
  FileText,
  Globe2,
  Lock,
  AlertCircle
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "@/components/SearchableSelect";
import { QuestionEditor } from "@/components/QuestionEditor";
import { Button } from "@/components/ui/button";

interface Alternative {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  timeLimitSeconds: number;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  alternatives: Alternative[];
}

export default function CreateQuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disciplines, setDisciplines] = useState<any[]>([]);

  // Estado Global do Quiz
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      timeLimitSeconds: 30,
      type: "SINGLE_CHOICE",
      alternatives: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]
    }
  ]);

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    try {
      const data = await apiFetch("/disciplines");
      setDisciplines(data);
    } catch (err) {
      console.error("Erro ao carregar disciplinas");
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        timeLimitSeconds: 30,
        type: "SINGLE_CHOICE",
        alternatives: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ]
      }
    ]);
  };

  const updateQuestion = (index: number, updated: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    if (!title.trim()) return "O título do quiz é obrigatório.";
    if (!disciplineId) return "Selecione uma disciplina.";
    if (questions.some(q => !q.text.trim())) return "Todas as questões devem ter um enunciado.";
    if (questions.some(q => q.alternatives.some(a => !a.text.trim()))) return "Todas as alternativas devem ter um texto.";
    if (questions.some(q => !q.alternatives.some(a => a.isCorrect))) return "Cada questão deve ter pelo menos uma resposta correta.";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiFetch("/quizzes", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          disciplineId,
          isPublic,
          questions
        })
      });
      router.push("/quizzes");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar quiz. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex font-sans">
      <Sidebar 
        userRole={user.role} 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <main className={cn(
        "flex-1 transition-all duration-500",
        isSidebarCollapsed ? "lg:ml-24" : "lg:ml-80",
        "mt-20 lg:mt-0 pb-32"
      )}>
        {/* Barra de Ações Fixa no Topo (Desktop) */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-surface-container-highest/50 p-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/quizzes" className="p-3 hover:bg-surface-container-highest rounded-2xl transition-all">
              <ArrowLeft className="w-6 h-6 text-on-surface-variant/60" />
            </Link>
            <div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tight">Novo <span className="text-primary">Quiz</span></h1>
              <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Criação de Desafio</p>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={loading}
            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span className="hidden sm:inline">SALVAR QUIZ</span>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-12">
          
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-[2rem] flex items-center gap-4 text-destructive animate-in fade-in zoom-in">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-bold text-sm">{error}</p>
            </div>
          )}

          {/* Seção 1: Informações Básicas */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <Settings2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-black tracking-tight uppercase">Configurações Gerais</h2>
            </div>

            <div className="bg-card border-2 border-surface-container-highest/50 rounded-[3rem] p-8 lg:p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Título do Quiz</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text"
                      placeholder="Ex: Equilíbrio Químico - 2º Ano"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-sm font-bold transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Disciplina</label>
                    <SearchableSelect 
                      variant="profile"
                      placeholder="Selecione a Disciplina"
                      items={disciplines.map(d => ({
                        id: d.id,
                        label: d.name,
                        searchTerm: d.name
                      }))}
                      value={disciplineId}
                      onValueChange={setDisciplineId}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Visibilidade</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsPublic(true)}
                        className={cn(
                          "flex-1 h-16 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs transition-all",
                          isPublic ? "bg-primary/5 border-primary text-primary" : "bg-surface-container-highest/30 border-transparent text-on-surface-variant/30"
                        )}
                      >
                        <Globe2 className="w-4 h-4" />
                        PÚBLICO
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsPublic(false)}
                        className={cn(
                          "flex-1 h-16 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-xs transition-all",
                          !isPublic ? "bg-primary/5 border-primary text-primary" : "bg-surface-container-highest/30 border-transparent text-on-surface-variant/30"
                        )}
                      >
                        <Lock className="w-4 h-4" />
                        PRIVADO
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Descrição (Opcional)</label>
                  <textarea 
                    placeholder="Sobre o que é este quiz?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-6 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-3xl text-sm font-bold transition-all outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Seção 2: Questões */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Plus className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black tracking-tight uppercase">Questões do Quiz</h2>
              </div>
              <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {questions.length} Questões
              </div>
            </div>

            <div className="space-y-8">
              {questions.map((q, idx) => (
                <QuestionEditor 
                  key={idx}
                  index={idx}
                  question={q}
                  onChange={(updated) => updateQuestion(idx, updated)}
                  onRemove={() => removeQuestion(idx)}
                />
              ))}

              <button 
                type="button"
                onClick={addQuestion}
                className="w-full py-10 rounded-[2.5rem] border-4 border-dashed border-surface-container-highest/50 flex flex-col items-center justify-center gap-4 text-on-surface-variant/30 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-16 h-16 bg-surface-container-highest rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">Adicionar Nova Questão</span>
              </button>
            </div>
          </section>

          {/* Botão de Salvar Final */}
          <div className="pt-10">
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
            >
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Save className="w-8 h-8" />}
              SALVAR E FINALIZAR QUIZ
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
