"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Loader2,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { QuizCard } from "@/components/QuizCard";
import { EmptyQuizState } from "@/components/EmptyQuizState";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function QuizzesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/quizzes");
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => 
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.discipline?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [quizzes, search]);

  const handleCreate = () => {
    router.push("/quizzes/create");
  };

  const handlePlay = (id: string) => {
    // Iniciar sessão (a implementar)
    console.log("Iniciar quiz:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Editar quiz:", id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este quiz?")) {
      try {
        await apiFetch(`/quizzes/${id}`, { method: "DELETE" });
        setQuizzes(prev => prev.filter(q => q.id !== id));
      } catch (error) {
        alert("Erro ao excluir quiz");
      }
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
        "mt-20 lg:mt-0 p-6 lg:p-12 pb-32"
      )}>
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter">
                Meus <span className="text-primary">Quizzes</span>
              </h1>
              <p className="text-sm font-bold text-on-surface-variant/50 uppercase tracking-widest">
                Gerencie seus desafios e salas de aula
              </p>
            </div>

            <Button 
              onClick={handleCreate}
              className="hidden lg:flex h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95 items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              NOVO QUIZ
            </Button>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Buscar por título ou disciplina..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-16 pl-14 pr-6 bg-card border-2 border-surface-container-highest/50 focus:border-primary/20 rounded-3xl text-sm font-bold transition-all outline-none shadow-sm"
              />
            </div>
            <button className="h-16 px-6 bg-card border-2 border-surface-container-highest/50 rounded-3xl flex items-center justify-center gap-2 text-on-surface-variant/60 font-black text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-all">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm font-black text-on-surface-variant/40 uppercase tracking-widest">Carregando seus desafios...</p>
            </div>
          ) : filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {filteredQuizzes.map((quiz) => (
                <QuizCard 
                  key={quiz.id}
                  quiz={quiz}
                  onPlay={handlePlay}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <EmptyQuizState onCreateClick={handleCreate} />
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={handleCreate}
        className="lg:hidden fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-90 transition-all z-50"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
