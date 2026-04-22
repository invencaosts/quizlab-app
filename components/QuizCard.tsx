"use client";

import React from "react";
import { 
  BookOpen, 
  MoreVertical, 
  Play, 
  Edit3, 
  Trash2, 
  Layers,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    discipline?: { name: string };
    questionsCount?: number | string;
    questions_count?: number | string;
    extras?: { questions_count: number | string };
    createdAt: string;
  };
  onPlay: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuizCard({ quiz, onPlay, onEdit, onDelete }: QuizCardProps) {
  const colors = [
    "from-emerald-400 to-emerald-600",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-amber-400 to-amber-600",
    "from-rose-400 to-rose-600",
  ];
  const colorIndex = quiz.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  const qCount = quiz.questionsCount ?? quiz.questions_count ?? quiz.extras?.questions_count ?? 0;

  return (
    <div className="group bg-card hover:bg-surface-container-highest/30 border border-surface-container-highest/50 rounded-[2.5rem] p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* Quiz Identity / Thumbnail (Top) */}
      <div className={cn(
        "relative w-full aspect-video rounded-3xl bg-gradient-to-br flex items-center justify-center text-white shadow-inner shrink-0 overflow-hidden",
        bgColor
      )}>
        <BookOpen className="w-12 h-12 opacity-80 group-hover:scale-110 transition-transform duration-500" />
        
        {/* Dropdown Menu (Overlaid) */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-xl transition-colors outline-none">
              <MoreVertical className="w-4 h-4 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-surface-container-highest shadow-2xl p-2 min-w-[160px]">
              <DropdownMenuItem 
                onClick={() => onEdit(quiz.id)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer font-bold text-sm"
              >
                <Edit3 className="w-4 h-4 text-blue-500" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(quiz.id)}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer font-bold text-sm text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Question Count Badge */}
        <div className="absolute bottom-3 left-3 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{qCount} Questões</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mt-4 flex flex-col">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
          {quiz.discipline?.name || "Geral"}
        </p>
        <h3 className="font-black text-lg text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
          {quiz.title}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-container-highest/50">
          <div className="flex items-center gap-1.5 text-on-surface-variant/40">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">{new Date(quiz.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
          
          <button 
            onClick={() => onPlay(quiz.id)}
            className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
