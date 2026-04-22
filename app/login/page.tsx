"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Referências para persistência de estado fora do ciclo de render (Performance Pro)
  const loadingRef = useRef(false);
  const formRef = useRef({ email, password });
  
  // Atualiza as refs conforme o estado muda (sem disparar re-render extra)
  useEffect(() => {
    formRef.current = { email, password };
  }, [email, password]);

  const handleLogin = useCallback(async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    // Evita cliques múltiplos se já estiver carregando
    if (loadingRef.current) return;

    const { email: currentEmail, password: currentPassword } = formRef.current;

    if (!currentEmail || !currentPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    loadingRef.current = true;
    setError(null);

    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: currentEmail, password: currentPassword }),
      });

      const token = response.token || response.data?.token;

      if (token) {
        Cookies.set("quizlab_token", token, { expires: 30 });
        window.location.href = "/";
      } else {
        setError("Erro ao processar login. Token não recebido.");
      }
    } catch (err: any) {
      setError(err.message || "E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Listener de Enter otimizado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loadingRef.current) {
        // Se o foco estiver em um botão, deixa o navegador lidar com o clique padrão
        if (document.activeElement?.tagName === 'BUTTON') return;
        handleLogin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleLogin]);

  return (
    <main className="min-h-screen flex items-center justify-center p-0 lg:p-6 relative overflow-hidden bg-background font-sans bg-academic-pattern bg-fixed">
      <AuthBackground />

      <AuthCard>
        <AuthHero 
          title="O Conhecimento é a sua maior Antigravidade." 
          subtitle="Acesse sua conta para continuar transformando o aprendizado no Instituto Federal." 
        />

        {/* Login Form Section */}
        <div className="col-span-1 lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-card">
          <div className="max-w-md mx-auto w-full space-y-10">
            <header className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                Área de Acesso
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-4xl font-black text-foreground tracking-tighter">
                  Bem-vindo de volta
                </h3>
                <p className="text-on-surface-variant font-semibold text-base opacity-70">
                  Insira suas credenciais institucionais.
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
              <div className="space-y-6">
                <AuthInput 
                  label="E-mail Institucional"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@if.edu.br"
                  disabled={loading}
                />

                <AuthInput 
                  label="Senha"
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  rightElement={
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Previne perda de foco
                        setShowPassword(!showPassword);
                      }}
                      className="text-on-surface-variant/30 hover:text-primary transition-colors focus:outline-none cursor-pointer p-2 -mr-2"
                      title={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
              </div>

              <div className="flex items-center justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors opacity-60 hover:opacity-100"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              <Button
                disabled={loading}
                onClick={handleLogin}
                className={cn(
                  "w-full py-8 rounded-2xl font-heading font-black text-lg tracking-tight cursor-pointer",
                  "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
                  "transition-all active:scale-[0.98] group relative overflow-hidden"
                )}
                type="button" // Mudamos para button para controle total via onClick
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="flex items-center justify-center">
                    Acessar Plataforma
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-on-surface-variant font-bold opacity-60">
                  Não possui conta?{" "}
                  <Link href="/register" className="text-primary font-black hover:underline transition-colors hover:text-primary/70">
                    Cadastre-se agora
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
