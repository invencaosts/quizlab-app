"use client";

import React from "react";
import Link from "next/link";
import { Zap, LogIn, UserPlus, Sparkles } from "lucide-react";

export function LandingPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col pt-12 lg:pt-24 overflow-hidden bg-gradient-to-b from-white to-zinc-50">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex-1 flex flex-col">
          {/* Big Brand Header */}
          <div className="flex items-center gap-4 mb-16 lg:mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="bg-primary p-3 lg:p-4 rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl shadow-primary/20">
              <Zap className="w-8 h-8 lg:w-12 lg:h-12 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tighter leading-none">
                QuizLab <span className="text-primary">IF</span>
              </span>
              <span className="text-[10px] lg:text-xs font-black text-zinc-400 uppercase tracking-[0.4em] mt-2">
                Plataforma Federal de Ensino
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center flex-1 pb-20">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200/50">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Rede Federal de Ensino
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 tracking-tighter leading-[1.05]">
                Onde o saber <br />
                vira <span className="text-primary italic">Conquista.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-zinc-500 max-w-xl leading-relaxed font-medium">
                A ferramenta oficial de gamificação para Institutos Federais. Criada para transformar aulas em experiências inesquecíveis.
              </p>

              <div className="flex flex-col gap-8 pt-4">
                <div className="flex flex-wrap gap-4">
                  <Link href="/login">
                    <button className="px-8 py-5 bg-primary text-white rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 cursor-pointer">
                      Acesso do Professor
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </Link>
                  <button className="px-8 py-5 bg-white text-zinc-700 rounded-2xl font-black border border-zinc-200 hover:bg-zinc-50 transition-all shadow-sm cursor-pointer">
                    Explorar Atividades
                  </button>
                </div>

                {/* Secondary Access Links */}
                <div className="flex items-center gap-6 px-2">
                  <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-primary transition-colors group">
                    <LogIn className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Já tenho conta
                  </Link>
                  <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                  <Link href="/register" className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-primary transition-colors group">
                    <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Quero me cadastrar
                  </Link>
                </div>
              </div>
            </div>

            {/* PIN Card */}
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
              <div className="bg-white p-10 lg:p-14 rounded-[3rem] lg:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] shadow-none relative group border border-zinc-100 lg:border-none">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                
                <h2 className="text-2xl font-black text-zinc-900 mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl" data-weight="fill">sports_esports</span>
                  Entrar no Jogo
                </h2>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">PIN do Game</label>
                    <input 
                      className="w-full bg-zinc-50 border-2 border-transparent rounded-2xl py-6 px-6 text-4xl font-black tracking-[0.4em] text-center focus:border-primary/20 focus:bg-white focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-zinc-200 text-zinc-800" 
                      maxLength={6} 
                      placeholder="000 000" 
                      type="text"
                    />
                  </div>
                  
                  <button className="w-full py-6 bg-zinc-900 text-white rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-900/20 flex justify-center items-center gap-3 cursor-pointer">
                    Bora Jogar!
                    <span className="material-symbols-outlined">bolt</span>
                  </button>
                  
                  <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-loose">
                    Não precisa de conta para jogar. <br />
                    Basta o código do seu professor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>
      </header>

      {/* Features Bento Grid */}
      <section className="py-32 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter">Potencializando a Rede Federal</h2>
            <div className="h-2 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="analytics" 
              title="Real-time Analytics" 
              description="Dashboard completo para professores acompanharem o progresso da turma em tempo real."
              color="primary"
            />
            <FeatureCard 
              icon="account_balance" 
              title="Foco Institucional" 
              description="Alinhado à BNCC e às diretrizes pedagógicas específicas dos Institutos Federais."
              color="emerald"
            />
            <FeatureCard 
              icon="code_blocks" 
              title="Open-Source DNA" 
              description="Tecnologia transparente e colaborativa. Desenvolvido para permitir integrações acadêmicas."
              color="zinc"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-20 px-6 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-2xl font-black text-zinc-900 tracking-tighter lowercase">
              quizlab<span className="text-primary uppercase">if</span>
            </div>
            <p className="text-zinc-400 text-sm font-medium">© {currentYear} QuizLab IF. Ferramenta Educacional da Rede Federal.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
            <a className="hover:text-primary transition-colors" href="#">Termos</a>
            <a className="hover:text-primary transition-colors" href="#">Acessibilidade</a>
            <a className="hover:text-primary transition-colors" href="#">Suporte</a>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
              <span className="material-symbols-outlined">public</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
              <span className="material-symbols-outlined">school</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-100 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500",
        color === 'primary' ? "bg-primary/10 text-primary" : 
        color === 'emerald' ? "bg-emerald-100 text-emerald-700" : 
        "bg-zinc-100 text-zinc-600"
      )}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-black mb-4 text-zinc-900 tracking-tight">{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-medium text-sm">{description}</p>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
