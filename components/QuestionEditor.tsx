"use client";

import { Trash2, Plus, Clock, HelpCircle, CheckCircle2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion } from "framer-motion";

export interface Alternative {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  timeLimitSeconds: number;
  alternatives: Alternative[];
}

interface QuestionEditorProps {
  index: number;
  question: Question;
  onChange: (question: Question) => void;
  onRemove: () => void;
}

export function QuestionEditor({ index, question, onChange, onRemove }: QuestionEditorProps) {
  const updateQuestion = (updates: Partial<Question>) => {
    onChange({ ...question, ...updates });
  };

  const addAlternative = () => {
    if (question.alternatives.length < 6) {
      updateQuestion({
        alternatives: [...question.alternatives, { text: "", isCorrect: false }],
      });
    }
  };

  const removeAlternative = (idx: number) => {
    if (question.alternatives.length > 2) {
      updateQuestion({
        alternatives: question.alternatives.filter((_, i) => i !== idx),
      });
    }
  };

  const updateAlternative = (idx: number, updates: Partial<Alternative>) => {
    const newAlternatives = [...question.alternatives];
    
    // Se for SINGLE_CHOICE e estiver marcando como correta, desmarca as outras
    if (question.type === 'SINGLE_CHOICE' && updates.isCorrect) {
      newAlternatives.forEach((alt, i) => {
        if (i !== idx) alt.isCorrect = false;
      });
    }
    
    newAlternatives[idx] = { ...newAlternatives[idx], ...updates };
    updateQuestion({ alternatives: newAlternatives });
  };

  const altColors = [
    "bg-rose-500/10 border-rose-500/30 focus-within:border-rose-500 ring-rose-500",
    "bg-blue-500/10 border-blue-500/30 focus-within:border-blue-500 ring-blue-500",
    "bg-amber-500/10 border-amber-500/30 focus-within:border-amber-500 ring-amber-500",
    "bg-emerald-500/10 border-emerald-500/30 focus-within:border-emerald-500 ring-emerald-500",
    "bg-purple-500/10 border-purple-500/30 focus-within:border-purple-500 ring-purple-500",
    "bg-orange-500/10 border-orange-500/30 focus-within:border-orange-500 ring-orange-500",
  ];

  const altIcons = ["▲", "◆", "●", "■", "★", "▼"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-card/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl overflow-hidden group"
    >
      {/* Indicador de Gradiente no Topo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-50" />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lado Esquerdo: Info da Questão */}
        <div className="w-full lg:w-16 flex lg:flex-col items-center justify-between lg:justify-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl border border-primary/20 shadow-inner">
            {index + 1}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:bg-destructive/10 rounded-full h-12 w-12 transition-colors"
          >
            <Trash2 className="h-6 w-6" />
          </Button>
        </div>

        {/* Centro: Enunciado e Configs */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 relative">
              <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1 mb-2 block">Enunciado da Questão</label>
              <div className="relative">
                <HelpCircle className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/30" />
                <Input
                  placeholder="O que você quer perguntar?"
                  value={question.text}
                  onChange={(e) => updateQuestion({ text: e.target.value })}
                  className="h-16 pl-14 bg-background/50 border-white/5 rounded-2xl text-lg font-bold focus:ring-4 ring-primary/10 transition-all placeholder:text-muted-foreground/30"
                />
              </div>
            </div>
            
            <div className="md:col-span-4 grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1 block">Tipo</label>
                <Select
                  value={question.type}
                  onValueChange={(val: any) => updateQuestion({ type: val })}
                >
                  <SelectTrigger className="h-16 bg-background/50 border-white/5 rounded-2xl font-bold">
                    <Layers className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE_CHOICE">Escolha Única</SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">Múltipla Escolha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1 block">Tempo</label>
                <Select
                  value={question.timeLimitSeconds.toString()}
                  onValueChange={(val) => updateQuestion({ timeLimitSeconds: parseInt(val) })}
                >
                  <SelectTrigger className="h-16 bg-background/50 border-white/5 rounded-2xl font-bold">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15s</SelectItem>
                    <SelectItem value="30">30s</SelectItem>
                    <SelectItem value="60">60s</SelectItem>
                    <SelectItem value="120">120s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Grid de Alternativas Estilizado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.alternatives.map((alt, aIdx) => (
              <motion.div
                key={aIdx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group/alt flex items-center gap-4 p-2 pr-6 border-2 rounded-[2rem] transition-all duration-300 ${
                  alt.isCorrect 
                    ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                    : `${altColors[aIdx % altColors.length]}`
                }`}
              >
                {/* Ícone Geométrico */}
                <div className={`w-14 h-14 flex items-center justify-center text-2xl font-black rounded-2xl shadow-lg transition-transform group-hover/alt:rotate-12 ${
                  alt.isCorrect ? "bg-emerald-500 text-white" : "bg-white/10 text-white/80"
                }`}>
                  {altIcons[aIdx % altIcons.length]}
                </div>
                
                <Input
                  placeholder={`Opção ${aIdx + 1}`}
                  value={alt.text}
                  onChange={(e) => updateAlternative(aIdx, { text: e.target.value })}
                  className="bg-transparent border-none shadow-none focus-visible:ring-0 text-lg font-bold text-white placeholder:text-white/20 h-12"
                />

                <div className="flex items-center gap-3">
                  {question.alternatives.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAlternative(aIdx)}
                      className="h-10 w-10 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                  <button 
                    onClick={() => updateAlternative(aIdx, { isCorrect: !alt.isCorrect })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      alt.isCorrect 
                        ? "bg-emerald-500 text-white rotate-0" 
                        : "bg-white/10 text-white/10 hover:text-white/40 -rotate-90"
                    }`}
                  >
                    <CheckCircle2 className="h-7 w-7" />
                  </button>
                </div>
              </motion.div>
            ))}

            {question.alternatives.length < 6 && (
              <Button
                variant="outline"
                onClick={addAlternative}
                className="h-20 border-4 border-dashed border-white/5 hover:border-primary/40 bg-white/5 hover:bg-primary/5 rounded-[2rem] text-white/30 hover:text-primary transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs"
              >
                <Plus className="h-6 w-6" />
                Adicionar Alternativa
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
