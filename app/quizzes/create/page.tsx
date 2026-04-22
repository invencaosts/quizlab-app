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
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="min-h-screen bg-background flex font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <Sidebar 
        userRole={user.role} 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <main className={cn(
        "flex-1 transition-all duration-500 relative",
        isSidebarCollapsed ? "lg:ml-24" : "lg:ml-80",
        "mt-20 lg:mt-0 pb-32"
      )}>
        {/* Header Fixo Premium */}
        <div className="sticky top-0 z-30 bg-background/60 backdrop-blur-2xl border-b border-white/5 p-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/quizzes" className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
              <ArrowLeft className="w-6 h-6 text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Criador Pro</p>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tighter">CONFIGURAR <span className="text-primary">DESAFIO</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-2xl shadow-primary/25 transition-all active:scale-95 flex items-center gap-3 border-none group"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
              <span className="hidden sm:inline">PUBLICAR QUIZ</span>
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-16">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-[2.5rem] flex items-center gap-4 text-destructive shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-destructive/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm tracking-tight">{error}</p>
            </motion.div>
          )}

          {/* Configurações Gerais */}
          <section className="space-y-10">
            <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Settings2 className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">Detalhes Mestres</h2>
            </div>

            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[3.5rem] p-8 lg:p-12 shadow-2xl space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                <div className="lg:col-span-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Título do Desafio</label>
                    <div className="relative group">
                      <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text"
                        placeholder="Ex: Domínio da Álgebra Linear"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full h-18 pl-16 pr-8 bg-background/50 border-2 border-white/5 focus:border-primary/40 rounded-3xl text-lg font-bold transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Sobre o Quiz</label>
                    <textarea 
                      placeholder="Breve descrição para seus alunos..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-40 p-8 bg-background/50 border-2 border-white/5 focus:border-primary/40 rounded-[2.5rem] text-base font-bold transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Disciplina</label>
                    <SearchableSelect 
                      variant="profile"
                      placeholder="Escolher Disciplina"
                      items={disciplines.map(d => ({
                        id: d.id,
                        label: d.name,
                        searchTerm: d.name
                      }))}
                      value={disciplineId}
                      onValueChange={setDisciplineId}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Visibilidade</label>
                    <div className="p-2 bg-background/50 border-2 border-white/5 rounded-3xl grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsPublic(true)}
                        className={cn(
                          "h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] transition-all",
                          isPublic ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/20 hover:bg-white/5"
                        )}
                      >
                        <Globe2 className="w-4 h-4" />
                        PÚBLICO
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsPublic(false)}
                        className={cn(
                          "h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] transition-all",
                          !isPublic ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/20 hover:bg-white/5"
                        )}
                      >
                        <Lock className="w-4 h-4" />
                        PRIVADO
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Banco de Questões */}
          <section className="space-y-10">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">Questões</h2>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[11px] font-black text-white/40 uppercase tracking-widest shadow-xl">
                Total: <span className="text-primary">{questions.length}</span>
              </div>
            </div>

            <div className="space-y-10">
              <AnimatePresence mode="popLayout">
                {questions.map((q, idx) => (
                  <QuestionEditor 
                    key={idx}
                    index={idx}
                    question={q}
                    onChange={(updated) => updateQuestion(idx, updated)}
                    onRemove={() => removeQuestion(idx)}
                  />
                ))}
              </AnimatePresence>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={addQuestion}
                className="w-full py-12 rounded-[3.5rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 text-white/10 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group"
              >
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-2xl group-hover:shadow-primary/25">
                  <Plus className="w-10 h-10" />
                </div>
                <span className="font-black text-xs uppercase tracking-[0.3em]">Adicionar Nova Questão</span>
              </motion.button>
            </div>
          </section>

          {/* Rodapé de Ação */}
          <div className="pt-10">
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="w-full h-24 rounded-[3rem] bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-700 text-white font-black text-xl shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>
                  <Save className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  SALVAR E PUBLICAR AGORA
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
