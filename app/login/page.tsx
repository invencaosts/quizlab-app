"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, UserCircle, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.token) {
        Cookies.set("quizlab_token", response.token, { expires: 30 });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-0 lg:p-6 relative overflow-hidden bg-background font-sans bg-academic-pattern bg-fixed">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Central Login Container */}
      <div className="w-full max-w-5xl h-screen lg:h-auto grid grid-cols-1 lg:grid-cols-12 bg-card lg:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden z-10 border border-white/60 backdrop-blur-md relative">
        {/* Left Side: Visual/Context (Visible only on Large screens) */}
        <div className="hidden lg:flex lg:col-span-6 bg-primary relative overflow-hidden flex-col justify-between p-12 text-primary-foreground">
          {/* Subtle Geometric Overlays */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.4)_1px,transparent_0)] bg-[length:32px_32px]"></div>
          <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-10 max-w-sm mx-auto w-full flex flex-col items-start text-left">
            <span className="inline-block px-4 py-2 bg-white/15 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-white/20 backdrop-blur-xl">
              Educação Digital
            </span>
            <div className="space-y-6">
              <h2 className="font-heading text-5xl font-black leading-[1.1] tracking-tight">
                Transformando Conhecimento em Ação.
              </h2>
              <p className="text-primary-foreground/90 leading-relaxed text-xl font-medium">
                Acesse a plataforma de quizzes de elite do Instituto Federal e desafie seus limites acadêmicos.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-white/40 rounded-full"></div>
                <span className="font-heading font-black text-sm tracking-[0.25em] uppercase opacity-80">QuizLab IF</span>
             </div>
             <p className="text-[11px] font-black tracking-widest opacity-40 uppercase">© 2026 Instituto Federal de Sergipe</p>
          </div>
        </div>

        {/* Right Side: Login Interface */}
        <div className="col-span-1 lg:col-span-6 p-8 lg:p-20 flex flex-col justify-center bg-card">
          <div className="max-w-md mx-auto w-full space-y-16">
            
            <header className="space-y-6 text-center lg:text-left">
              {/* Mobile Header */}
              <div className="lg:hidden flex flex-col items-center gap-4 mb-2">
                 <div className="bg-primary p-3 rounded-[1.5rem] shadow-2xl shadow-primary/40">
                    <UserCircle className="w-8 h-8 text-white" />
                 </div>
                 <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black tracking-[0.2em] uppercase border border-primary/20">
                    Educação Digital
                 </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-heading text-3xl lg:text-4xl font-black text-foreground tracking-tighter">
                  Seja bem-vindo
                </h3>
                <p className="text-on-surface-variant font-semibold text-lg opacity-70">
                  Entre com suas credenciais institucionais.
                </p>
              </div>
            </header>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 p-5 rounded-3xl flex items-center gap-4 text-destructive animate-in fade-in zoom-in duration-300">
                <div className="bg-destructive/10 p-2 rounded-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                </div>
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-8" onSubmit={handleLogin}>
              <div className="space-y-4">
                <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1 opacity-60">
                  E-mail
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-on-surface-variant/30 group-focus-within:text-primary transition-all duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                        "block w-full pl-16 pr-6 py-6 rounded-[1.25rem]",
                        "bg-surface-container-highest border-none outline-none",
                        "font-bold text-base tracking-tight",
                        "focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all duration-300",
                        "placeholder:text-on-surface-variant/20 shadow-sm",
                        "disabled:opacity-50"
                    )}
                    placeholder="Seu e-mail cadastrado"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">
                    Senha
                  </label>
                  <Link href="#" className="text-[11px] font-black text-primary hover:underline transition-all uppercase tracking-widest hover:text-primary/70">
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-on-surface-variant/30 group-focus-within:text-primary transition-all duration-300">
                    <Lock className="w-6 h-6" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                        "block w-full pl-16 pr-14 py-6 rounded-[1.25rem]",
                        "bg-surface-container-highest border-none outline-none",
                        "font-bold text-base",
                        "focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all duration-300",
                        "placeholder:text-on-surface-variant/20 shadow-sm",
                        "disabled:opacity-50"
                    )}
                    placeholder="Sua senha secreta"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-on-surface-variant/30 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                disabled={loading}
                className={cn(
                    "w-full py-9 rounded-[1.25rem] font-heading font-black text-xl tracking-tight cursor-pointer",
                    "bg-primary hover:bg-primary/90 text-white shadow-[0_20px_40px_-12px_rgba(50,160,65,0.4)]",
                    "transition-all active:scale-[0.96] group",
                    "disabled:opacity-70 disabled:grayscale-[0.5] disabled:cursor-not-allowed"
                )}
                type="submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-7 h-7 mr-3 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Acessar QuizLab
                    <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-on-surface-variant font-bold opacity-60">
                  Novo por aqui?{" "}
                  <Link href="#" className="text-primary font-black hover:underline transition-colors hover:text-primary/70">
                    Faça cadastro
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
