"use client";

import React from "react";
import { 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle,
  GripVertical,
  Type,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface QuestionEditorProps {
  index: number;
  question: Question;
  onChange: (updated: Question) => void;
  onRemove: () => void;
}

export function QuestionEditor({ index, question, onChange, onRemove }: QuestionEditorProps) {
  
  const handleUpdate = (updates: Partial<Question>) => {
    onChange({ ...question, ...updates });
  };

  const updateAlternative = (idx: number, text: string) => {
    const newAlts = [...question.alternatives];
    newAlts[idx].text = text;
    handleUpdate({ alternatives: newAlts });
  };

  const toggleCorrect = (idx: number) => {
    const newAlts = question.alternatives.map((alt, i) => ({
      ...alt,
      isCorrect: question.type === 'SINGLE_CHOICE' ? i === idx : (i === idx ? !alt.isCorrect : alt.isCorrect)
    }));
    handleUpdate({ alternatives: newAlts });
  };

  const addAlternative = () => {
    if (question.alternatives.length < 6) {
      handleUpdate({ 
        alternatives: [...question.alternatives, { text: "", isCorrect: false }] 
      });
    }
  };

  const removeAlternative = (idx: number) => {
    if (question.alternatives.length > 2) {
      handleUpdate({ 
        alternatives: question.alternatives.filter((_, i) => i !== idx) 
      });
    }
  };

  return (
    <div className="bg-card border-2 border-surface-container-highest/50 rounded-[2.5rem] p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header da Questão */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl">
            {index + 1}
          </div>
          <h3 className="font-black text-lg uppercase tracking-tight text-on-surface-variant/80">Questão</h3>
        </div>
        <button 
          onClick={onRemove}
          className="p-3 text-on-surface-variant/30 hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      {/* Pergunta */}
      <div className="space-y-4">
        <div className="relative group">
          <Type className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Qual é a pergunta?"
            value={question.text}
            onChange={(e) => handleUpdate({ text: e.target.value })}
            className="w-full h-20 pl-16 pr-8 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-[1.5rem] text-lg font-bold outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Tempo Limite */}
          <div className="flex items-center gap-3 bg-surface-container-highest/40 p-2 rounded-2xl border border-surface-container-highest/50">
            <div className="p-2 bg-background rounded-xl">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <select 
              value={question.timeLimitSeconds}
              onChange={(e) => handleUpdate({ timeLimitSeconds: Number(e.target.value) })}
              className="bg-transparent font-black text-sm outline-none pr-2 cursor-pointer"
            >
              <option value={15}>15 segundos</option>
              <option value={30}>30 segundos</option>
              <option value={60}>1 minuto</option>
              <option value={120}>2 minutos</option>
            </select>
          </div>

          {/* Tipo de Questão */}
          <div className="flex items-center gap-3 bg-surface-container-highest/40 p-2 rounded-2xl border border-surface-container-highest/50">
            <div className="p-2 bg-background rounded-xl">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <select 
              value={question.type}
              onChange={(e) => handleUpdate({ type: e.target.value as any })}
              className="bg-transparent font-black text-sm outline-none pr-2 cursor-pointer"
            >
              <option value="SINGLE_CHOICE">Escolha Única</option>
              <option value="MULTIPLE_CHOICE">Múltipla Escolha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alternativas */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Alternativas de Resposta</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.alternatives.map((alt, idx) => (
            <div 
              key={idx}
              className={cn(
                "group relative flex items-center gap-4 p-2 rounded-[1.5rem] border-2 transition-all duration-300",
                alt.isCorrect 
                  ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" 
                  : "bg-surface-container-highest/20 border-transparent hover:border-surface-container-highest"
              )}
            >
              <button
                type="button"
                onClick={() => toggleCorrect(idx)}
                className={cn(
                  "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  alt.isCorrect ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-background text-on-surface-variant/20 hover:text-primary/40"
                )}
              >
                {alt.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>

              <input 
                type="text"
                placeholder={`Alternativa ${idx + 1}`}
                value={alt.text}
                onChange={(e) => updateAlternative(idx, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-bold text-sm"
              />

              {question.alternatives.length > 2 && (
                <button
                  onClick={() => removeAlternative(idx)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant/20 hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {question.alternatives.length < 6 && (
            <button
              type="button"
              onClick={addAlternative}
              className="flex items-center justify-center gap-3 p-4 rounded-[1.5rem] border-2 border-dashed border-surface-container-highest/50 text-on-surface-variant/30 hover:border-primary/40 hover:text-primary transition-all font-black text-xs uppercase tracking-widest"
            >
              <Plus className="w-5 h-5" />
              Adicionar Alternativa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
