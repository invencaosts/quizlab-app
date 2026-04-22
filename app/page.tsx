"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const toggleSidebar = React.useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  useEffect(() => {
    if (user) {
      console.log("DEBUG - Dados do Usuário Logado:", {
        id: user.id,
        nome: user.fullName,
        role_bruta: user.role,
        role_tipo: typeof user.role
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-on-surface-variant/60 font-bold animate-pulse uppercase tracking-widest text-[10px]">
            Sincronizando ambiente...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const getNormalizedRole = (rawRole: string): "P" | "S" | "A" => {
    const role = String(rawRole || "").toUpperCase().trim();
    if (role === "P" || role === "PROFESSOR" || role === "DOCENTE") return "P";
    if (role === "S" || role === "STUDENT" || role === "ESTUDANTE" || role === "ALUNO") return "S";
    if (role === "A" || role === "ADMIN" || role === "ADMINISTRADOR") return "A";
    return "S";
  };

  const normalizedRole = getNormalizedRole(user.role);
  const isProfessor = normalizedRole === "P";
  const isAdmin = normalizedRole === "A";
  const canManage = isProfessor || isAdmin; // Admins e Professores gerenciam conteúdo

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      <Sidebar 
        userRole={user.role} 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      <main className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "pt-20 lg:pt-0 min-h-screen bg-zinc-50/50",
        isSidebarCollapsed ? "lg:pl-24" : "lg:pl-80"
      )}>
        <div className="p-6 lg:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          
          {/* Header Section with Stats */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tighter mb-2">
                {isAdmin ? "Painel Administrativo" : 
                 isProfessor ? "Painel do Professor" : 
                 "Painel do Estudante"}
              </h2>
              <p className="text-zinc-500 font-bold">
                {canManage 
                  ? `Bem-vindo, ${user.fullName.split(' ')[0]}. Gerencie os conteúdos e usuários do sistema.`
                  : `Bem-vindo de volta, ${user.fullName.split(' ')[0]}! Pronto para os desafios?`}
              </p>
            </div>
            
            <div className="flex gap-4">
              <StatBadge 
                value={canManage ? "24" : "15"} 
                label={canManage ? "Quizzes Criados" : "Partidas"} 
              />
              <StatBadge 
                value={canManage ? "1.2k" : "8.5"} 
                label={canManage ? "Alunos Alcançados" : "Média"} 
              />
            </div>
          </div>

          {/* Bento Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Active Session / Hero Card */}
            <div className="md:col-span-8 bg-primary rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-primary/20 min-h-[320px] flex flex-col justify-end group transition-all duration-700">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <span className="material-symbols-outlined text-[160px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {canManage ? "add_circle" : "rocket_launch"}
                </span>
              </div>
              
              <div className="relative z-10 space-y-6">
                <span className="inline-block bg-white/20 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/10">
                  {canManage ? "Gestão Global" : "Ação Recomendada"}
                </span>
                <h3 className="text-white text-3xl lg:text-5xl font-black leading-tight tracking-tighter">
                  {canManage ? (
                    <>Crie ou gerencie <br/>conteúdos agora</>
                  ) : (
                    <>Pronto para o seu<br/>próximo desafio?</>
                  )}
                </h3>
                <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 cursor-pointer w-fit">
                  <span className="material-symbols-outlined font-black">
                    {canManage ? "add" : "bolt"}
                  </span>
                  {canManage ? "Novo Quiz" : "Jogar Agora"}
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Featured Quiz Card */}
            <div className="md:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200/50 flex flex-col border border-zinc-100">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    trending_up
                  </span>
                </div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {canManage ? "Destaque Institucional" : "Destaque da Semana"}
                </span>
              </div>
              
              <div className="flex-1 space-y-3">
                <h4 className="text-2xl font-black text-zinc-900 tracking-tight">Análise de Dados III</h4>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  {canManage 
                    ? "Este quiz possui o maior índice de engajamento na plataforma atualmente."
                    : "Você está no top 5% dos estudantes que completaram este desafio."}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-50">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">group</span>
                  45 Alunos participaram
                </div>
              </div>
            </div>

            {/* Quizzes List Section */}
            <div className="md:col-span-12 mt-8">
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-2xl lg:text-3xl font-black text-zinc-900 tracking-tighter">
                  {isAdmin ? "Todos os Quizzes" : 
                   isProfessor ? "Meus Quizzes" : 
                   "Quizzes Disponíveis"}
                </h3>
                <button className="text-[11px] font-black text-primary hover:underline cursor-pointer uppercase tracking-widest">
                  Ver todos
                </button>
              </div>

              <div className="space-y-4">
                <QuizListItem 
                  title={canManage ? "Cálculo Diferencial Avançado" : "Matemática Básica"}
                  date="12 Out 2023"
                  questions={15}
                  image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=60"
                  role={normalizedRole}
                />
                <QuizListItem 
                  title={canManage ? "Fundamentos de Python" : "Lógica de Programação"}
                  date="20 Set 2023"
                  questions={20}
                  image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=60"
                  role={normalizedRole}
                />
                <QuizListItem 
                  title={canManage ? "Redes de Computadores" : "Hardware e IoT"}
                  date="05 Set 2023"
                  questions={12}
                  image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=60"
                  role={normalizedRole}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-24 md:hidden" />
      </main>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white px-8 py-4 rounded-[1.5rem] flex flex-col items-center justify-center shadow-xl shadow-zinc-200/40 border border-zinc-100 min-w-[120px]">
      <span className="text-primary font-black text-2xl lg:text-3xl tracking-tighter">{value}</span>
      <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-1">{label}</span>
    </div>
  );
}

function QuizListItem({ title, date, questions, image, role }: any) {
  const canManage = role === "P" || role === "A";

  return (
    <div className="bg-white p-5 lg:p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all duration-500 border border-zinc-100 hover:border-primary/20">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-zinc-100">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div>
          <h4 className="font-black text-xl text-zinc-900 tracking-tight">{title}</h4>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {date}
            </span>
            <span className="text-xs font-bold text-zinc-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">quiz</span>
              {questions} Perguntas
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {canManage ? (
          <button className="px-8 py-3.5 rounded-2xl text-sm font-black bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.97] transition-all flex items-center gap-3 cursor-pointer group/btn">
            <span className="material-symbols-outlined text-xl">settings</span>
            Gerenciar
          </button>
        ) : (
          <button className="px-8 py-3.5 rounded-2xl text-sm font-black bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.97] transition-all flex items-center gap-3 cursor-pointer group/btn">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
            Começar Agora
          </button>
        )}
      </div>
    </div>
  );
}
