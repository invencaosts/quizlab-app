"use client";

import React from "react";
import { Plus, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyQuizStateProps {
  onCreateClick: () => void;
}

export function EmptyQuizState({ onCreateClick }: EmptyQuizStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-700">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center animate-pulse">
          <BookOpen className="w-16 h-16 text-primary opacity-40" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce duration-[2000ms]">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <h2 className="text-3xl font-black text-foreground tracking-tighter mb-4">
        Nenhum Quiz <span className="text-primary">Encontrado</span>
      </h2>
      
      <p className="max-w-md text-on-surface-variant/60 font-bold leading-relaxed mb-10">
        Parece que você ainda não criou nenhum desafio. Que tal começar agora e engajar seus alunos com um novo quiz?
      </p>

      <Button 
        onClick={onCreateClick}
        className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-3"
      >
        <Plus className="w-6 h-6" />
        CRIAR MEU PRIMEIRO QUIZ
      </Button>
    </div>
  );
}
