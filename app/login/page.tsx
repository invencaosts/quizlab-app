"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHero } from "@/components/auth/AuthHero";
import { AuthInput } from "@/components/auth/AuthInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = "O e-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "E-mail inválido";
    }
    
    if (!password) {
      newErrors.password = "A senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
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
      if (err.status === 500) {
        setError("Ocorreu um erro interno. Tente novamente mais tarde.");
      } else {
        setError(err.message || "Credenciais inválidas. Verifique seu e-mail e senha.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-0 lg:p-6 relative overflow-hidden bg-background font-sans bg-academic-pattern bg-fixed">
      <AuthBackground />

      <AuthCard>
        <AuthHero 
          title="Transformando Conhecimento em Ação." 
          subtitle="Acesse a plataforma de quizzes de elite do Instituto Federal e desafie seus limites acadêmicos." 
        />

        <div className="col-span-1 lg:col-span-6 p-8 lg:p-20 flex flex-col justify-center bg-card">
          <div className="max-w-md mx-auto w-full space-y-16">
            <header className="space-y-6 text-center lg:text-left">
              <div className="lg:hidden flex flex-col items-center gap-4 mb-2">
                <div className="bg-primary p-3 rounded-[1.5rem] shadow-2xl shadow-primary/40">
                  <Mail className="w-8 h-8 text-white" />
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

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 p-5 rounded-3xl flex items-center gap-4 text-destructive animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleLogin} noValidate>
              <div className="space-y-4">
                <AuthInput 
                  label="E-mail"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Seu e-mail cadastrado"
                  disabled={loading}
                  error={errors.email}
                />
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
                <AuthInput 
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  placeholder="Sua senha secreta"
                  disabled={loading}
                  error={errors.password}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-on-surface-variant/30 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-7 h-7" /> : <Eye className="w-7 h-7" />}

                    </button>
                  }
                />
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
                  <Link href="/register" className="text-primary font-black hover:underline transition-colors hover:text-primary/70">
                    Faça cadastro
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </AuthCard>
    </main>
  );
}

