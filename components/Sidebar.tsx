"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { 
  LogOut, 
  Plus, 
  Zap,
  Menu as MenuIcon,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  userRole: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = React.memo(function Sidebar({ userRole, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  
  // Referência estável para o logout (Performance Fix)
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  // Mapeamento dinâmico de ícones vindos do Banco de Dados
  const navItems = useMemo(() => {
    if (!user?.menus) return [];
    
    return user.menus.map(item => {
      const IconComponent = (Icons as any)[item.icon] || HelpCircle;
      return {
        ...item,
        icon: IconComponent
      };
    });
  }, [user?.menus]);

  // Log de Auditoria RBAC
  useEffect(() => {
    // RBAC carregado com sucesso
  }, [user]);

  const SidebarContent = ({ collapsed = false }: { collapsed: boolean }) => (
    <div className={cn(
      "flex flex-col h-full transition-all duration-500",
      collapsed ? "p-4" : "p-8"
    )}>
      {/* Brand Header */}
      <div className={cn(
        "flex items-center mb-12 relative group/header",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative">
            <div className="bg-primary/10 p-2.5 rounded-2xl shrink-0 group-hover/header:bg-primary/20 transition-colors duration-500">
              <Zap className="w-6 h-6 text-primary fill-primary" />
            </div>
          </div>
          {!collapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
              <h1 className="text-xl font-black text-foreground tracking-tighter leading-none">
                QuizLab<span className="text-primary">IF</span>
              </h1>
              <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-1">
                Plataforma Federal
              </p>
            </div>
          )}
        </div>
        
        {!collapsed && onToggleCollapse && (
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 hover:bg-surface-container-highest rounded-xl text-on-surface-variant/30 hover:text-foreground transition-all duration-300 cursor-pointer"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}

        {collapsed && onToggleCollapse && (
          <button 
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-7 top-1/2 -translate-y-1/2 p-1.5 bg-card border border-surface-container-highest text-on-surface-variant/40 hover:text-primary hover:border-primary/30 rounded-full shadow-xl hover:scale-110 transition-all z-50 cursor-pointer"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        <div className="space-y-3">
          {!collapsed && (
            <p className="px-4 text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em] mb-4">
              Menu Principal
            </p>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group relative flex items-center rounded-xl transition-all duration-300",
                  collapsed ? "justify-center p-4" : "justify-between px-4 py-4",
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
                  {!collapsed && <span className="font-bold text-[13px] tracking-tight">{item.label}</span>}
                </div>
                {!collapsed && (
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-all duration-300 opacity-0 -translate-x-2",
                    !isActive && "group-hover:opacity-30 group-hover:translate-x-0"
                  )} />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Action Area */}
      <div className={cn(
        "space-y-6 pt-8 border-t border-surface-container-highest mt-auto",
        collapsed ? "flex flex-col items-center" : ""
      )}>
        {(user?.role === 'PROFESSOR' || user?.role === 'ADMIN') && (
          <Link href="/quizzes/create" className="block w-full">
            <Button 
              className={cn(
                "font-black tracking-tight shadow-[0_8px_16px_-4px_rgba(50,160,65,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(50,160,65,0.5)] transition-all active:scale-[0.97] group cursor-pointer relative overflow-hidden",
                collapsed ? "w-12 h-12 rounded-full p-0" : "w-full h-12 rounded-xl text-[13px]"
              )}
            >
              <div className="flex items-center justify-center w-full">
                <Plus className={cn(
                  "group-hover:rotate-180 transition-transform duration-700",
                  collapsed ? "w-6 h-6" : "absolute left-6 w-5 h-5"
                )} />
                {!collapsed && <span>Novo Quiz</span>}
              </div>
            </Button>
          </Link>
        )}

        {(user?.role === 'STUDENT') && (
          <Button 
            variant="secondary"
            className={cn(
              "font-black tracking-tight bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/10 group cursor-pointer",
              collapsed ? "w-12 h-12 rounded-full p-0" : "w-full h-12 rounded-xl text-[13px]"
            )}
          >
            <Zap className={cn("animate-pulse", collapsed ? "w-6 h-6" : "w-5 h-5 mr-2")} />
            {!collapsed && "Desafio Rápido"}
          </Button>
        )}

        {/* User Profile Summary */}
        <div className={cn(
          "flex items-center bg-surface-container-low border border-surface-container-highest/50 transition-all duration-500",
          collapsed ? "p-1 rounded-full flex-col gap-2" : "p-3 rounded-xl gap-3"
        )}>
          <Link 
            href="/profile"
            className="flex flex-1 items-center gap-3 min-w-0 group/profile cursor-pointer"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className={cn(
              "rounded-lg bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white font-black shrink-0 group-hover/profile:scale-110 transition-transform",
              collapsed ? "w-12 h-12 rounded-full text-xs" : "w-9 h-9 text-[10px]"
            )}>
              {user?.initials || "??"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-foreground truncate group-hover/profile:text-primary transition-colors">{user?.fullName || "Usuário"}</p>
                <p className="text-[10px] text-on-surface-variant/40 font-bold truncate uppercase tracking-widest">
                  {user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'PROFESSOR' ? 'Professor' : 'Estudante'}
                </p>
              </div>
            )}
          </Link>
          
          <button 
            onClick={() => logoutRef.current()}
            className={cn(
              "p-2 text-on-surface-variant/30 hover:text-destructive transition-colors group cursor-pointer flex items-center justify-center",
              collapsed ? "border-t border-surface-container-highest w-full pt-4 mt-2" : ""
            )}
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn(
        "hidden lg:block fixed left-0 top-0 bottom-0 bg-card border-r border-surface-container-highest z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isCollapsed ? "w-24" : "w-80"
      )}>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-lg border-b border-surface-container-highest/50 flex items-center justify-between px-8 z-40">
        <div className="flex items-center gap-2.5">
           <div className="bg-primary p-1.5 rounded-lg">
             <Zap className="w-4 h-4 text-white fill-white" />
           </div>
           <h1 className="text-lg font-black text-foreground tracking-tighter">QuizLab</h1>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="bg-surface-container-highest p-2.5 rounded-2xl text-on-surface-variant transition-all active:scale-90"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </header>

      <div 
        className={cn(
          "lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside className={cn(
        "lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-card z-[60] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsMobileOpen(false);
          }}
          className="absolute top-6 right-6 w-11 h-11 bg-surface-container-highest rounded-2xl text-on-surface-variant transition-all active:scale-90 cursor-pointer flex items-center justify-center z-[70] shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent collapsed={false} />
      </aside>
    </>
  );
});
