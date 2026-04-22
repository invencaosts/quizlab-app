"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, TrendingUp, Users, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 1. Loading State
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

  // 2. Unauthenticated State (Landing Page)
  if (!user) {
    return <LandingPage />;
  }

  // 3. Authenticated State (Dashboard)
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      <Sidebar 
        userRole={user.role} 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <main className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "pt-20 lg:pt-0 min-h-screen",
        isSidebarCollapsed ? "lg:pl-24" : "lg:pl-80"
      )}>
        <div className="p-6 lg:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          <div className="space-y-12">
            {/* Hero Welcome */}
            <header className="relative p-10 rounded-[3rem] bg-primary overflow-hidden shadow-2xl shadow-primary/20 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                    <Sparkles className="w-3 h-3" />
                    Bem-vindo de volta
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    Olá, {user.fullName}!
                  </h1>
                  <p className="text-white/70 font-bold text-lg max-w-md leading-relaxed">
                    Sua jornada de ensino digital está pronta. Vamos criar algo incrível hoje?
                  </p>
                </div>
                
                <button className="bg-white text-primary px-8 py-5 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
                  {user.role === 'P' ? 'Criar Primeiro Quiz' : 'Ver Meus Quizzes'}
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard 
                icon={BookOpen} 
                label="Quizzes Ativos" 
                value="12" 
                trend="+2 essa semana"
                color="primary"
              />
              <StatCard 
                icon={Users} 
                label="Total de Alunos" 
                value="148" 
                trend="+15% vs mês passado"
                color="secondary"
              />
              <StatCard 
                icon={TrendingUp} 
                label="Média Global" 
                value="8.4" 
                trend="Top 10% do campus"
                color="zinc"
              />
            </div>

            {/* Recent Activity Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Atividades Recentes</h2>
                <button className="text-sm font-bold text-primary hover:underline">Ver tudo</button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group p-6 bg-card border border-foreground/[0.03] rounded-[2rem] flex items-center justify-between hover:bg-surface-container-highest transition-colors cursor-pointer shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        0{i}
                      </div>
                      <div>
                        <h4 className="font-black text-foreground">Quiz de Algoritmos {i}</h4>
                        <p className="text-xs text-on-surface-variant/40 font-bold uppercase tracking-widest mt-1">Sistemas para Internet • Há 2 horas</p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-black text-foreground">42 Alunos</p>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest">Finalizado</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
  const colorClasses: any = {
    primary: "bg-primary/5 border-primary/10 text-primary",
    secondary: "bg-secondary/5 border-secondary/10 text-secondary",
    zinc: "bg-surface-container-highest border-surface-container-highest text-foreground"
  };

  return (
    <Card className={cn("p-10 border-0 rounded-[3rem] shadow-sm relative overflow-hidden group", colorClasses[color])}>
      <Icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-5 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
      <div className="relative z-10 space-y-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", 
          color === 'zinc' ? "bg-white dark:bg-zinc-800" : "bg-current"
        )}>
          <Icon className={cn("w-7 h-7", color === 'zinc' ? "text-foreground" : "text-white")} />
        </div>
        <div>
          <p className="text-sm font-black opacity-60 uppercase tracking-[0.2em] mb-1">{label}</p>
          <h3 className="text-4xl font-black tracking-tighter text-foreground">{value}</h3>
          <p className="text-[10px] font-black mt-3 opacity-40 uppercase tracking-widest">{trend}</p>
        </div>
      </div>
    </Card>
  );
}
