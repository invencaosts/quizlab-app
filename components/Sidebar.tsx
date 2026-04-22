"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Globe2, 
  UserCircle2, 
  LogOut, 
  Plus, 
  Zap,
  Menu,
  X,
  ChevronRight,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  userRole: "PROFESSOR" | "STUDENT";
}

const navItems = [
  { label: "Painel Principal", href: "/dashboard", icon: LayoutDashboard, roles: ["PROFESSOR", "STUDENT"] },
  { label: "Meus Quizzes", href: "/quizzes", icon: BookOpen, roles: ["PROFESSOR"] },
  { label: "Comunidade", href: "/community", icon: Globe2, roles: ["PROFESSOR", "STUDENT"] },
  { label: "Perfil", href: "/profile", icon: UserCircle2, roles: ["PROFESSOR", "STUDENT"] },
  { label: "Configurações", href: "/settings", icon: Settings, roles: ["PROFESSOR", "STUDENT"] },
];

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-8">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/30">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-foreground tracking-tighter leading-none">
            QuizLab<span className="text-primary">IF</span>
          </h1>
          <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-1">
            Plataforma Federal
          </p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em] mb-4">
            Menu Principal
          </p>
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-on-surface-variant/50 hover:bg-surface-container-highest hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                    isActive ? "text-white" : "opacity-40 group-hover:opacity-100"
                  )} />
                  <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-all duration-300 opacity-0 -translate-x-2",
                  !isActive && "group-hover:opacity-30 group-hover:translate-x-0"
                )} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Action Area */}
      <div className="space-y-6 pt-8 border-t border-surface-container-highest mt-auto">
        {userRole === "PROFESSOR" ? (
          <Button 
            className="w-full h-14 rounded-2xl font-black text-sm tracking-tight shadow-[0_12px_24px_-8px_rgba(50,160,65,0.4)] hover:shadow-[0_16px_32px_-8px_rgba(50,160,65,0.5)] transition-all active:scale-[0.97] group cursor-pointer relative"
          >
            <div className="flex items-center justify-center w-full">
              <Plus className="absolute left-6 w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
              <span>Novo Quiz</span>
            </div>
          </Button>
        ) : (
          <Button 
            variant="secondary"
            className="w-full h-14 rounded-2xl font-black text-sm tracking-tight bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/10 group cursor-pointer"
          >
            <Zap className="w-5 h-5 mr-2 animate-pulse" />
            Desafio Rápido
          </Button>
        )}

        {/* User Profile Summary */}
        <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl border border-surface-container-highest/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-black text-xs shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-foreground truncate">João D. Silva</p>
            <p className="text-[10px] text-on-surface-variant/40 font-bold truncate uppercase tracking-widest">Campus Aracaju</p>
          </div>
          <button className="p-2 text-on-surface-variant/30 hover:text-destructive transition-colors group cursor-pointer">
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-surface-container-highest z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-lg border-b border-surface-container-highest/50 flex items-center justify-between px-8 z-40">
        <div className="flex items-center gap-2.5">
           <div className="bg-primary p-1.5 rounded-lg">
             <Zap className="w-4 h-4 text-white fill-white" />
           </div>
           <h1 className="text-lg font-black text-foreground tracking-tighter">QuizLab</h1>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-surface-container-highest p-2.5 rounded-2xl text-on-surface-variant transition-all active:scale-90"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside className={cn(
        "lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-card z-50 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2.5 bg-surface-container-highest rounded-2xl text-on-surface-variant transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
