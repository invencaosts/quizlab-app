"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  User, 
  Hash, 
  CheckCircle2, 
  MapPin, 
  BookOpen,
  ChevronLeft,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHero } from "@/components/auth/AuthHero";
import { AuthInput } from "@/components/auth/AuthInput";
import { SearchableSelect } from "@/components/SearchableSelect";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [campuses, setCampuses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cpf: "",
    registration: "",
    campusId: "",
    courseId: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Ref para estabilidade de performance
  const loadingRef = useRef(false);
  const formDataRef = useRef(formData);
  
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campusRes, courseRes] = await Promise.all([
          apiFetch("/campuses"),
          apiFetch("/courses")
        ]);
        setCampuses(campusRes.data || campusRes);
        setCourses(courseRes.data || courseRes);
      } catch (err) {
        console.error("Erro ao buscar dados auxiliares:", err);
      }
    };
    fetchData();
  }, []);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    const data = formDataRef.current;
    
    if (currentStep === 1) {
      if (!data.fullName) newErrors.fullName = "Nome completo é obrigatório";
      if (!data.email) {
        newErrors.email = "E-mail é obrigatório";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = "E-mail inválido";
      }
      if (!data.cpf) newErrors.cpf = "CPF é obrigatório";
    }

    if (currentStep === 2) {
      if (!data.registration) newErrors.registration = "Matrícula é obrigatória";
      if (!data.campusId) newErrors.campusId = "Campus é obrigatório";
      if (!data.courseId) newErrors.courseId = "Curso é obrigatório";
    }

    if (currentStep === 3) {
      if (!data.password) {
        newErrors.password = "Senha é obrigatória";
      } else if (data.password.length < 8) {
        newErrors.password = "A senha deve ter pelo menos 8 caracteres";
      }

      if (data.password !== data.passwordConfirmation) {
        newErrors.passwordConfirmation = "As senhas não coincidem";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setError(null);
      setStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  const prevStep = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleRegister = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (step < 3) {
      nextStep();
      return;
    }

    if (!validateStep(3)) return;
    if (loadingRef.current) return;

    setLoading(true);
    loadingRef.current = true;
    setError(null);

    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formDataRef.current),
      });

      const token = response.token || response.data?.token;

      if (token) {
        Cookies.set("quizlab_token", token, { expires: 30 });
        window.location.href = "/";
      } else {
        setError("Erro ao processar cadastro. Token não recebido.");
      }
    } catch (err: any) {
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const backendErrors: Record<string, string> = {};
        let targetStep = 3;

        err.data.errors.forEach((e: any) => {
          backendErrors[e.field] = e.message;
          if (["fullName", "cpf"].includes(e.field)) targetStep = Math.min(targetStep, 1);
          if (["registration", "campusId", "courseId"].includes(e.field)) targetStep = Math.min(targetStep, 2);
        });

        setErrors(backendErrors);
        if (targetStep < 3) {
          setStep(targetStep);
          setError("Verifique as informações destacadas nos passos anteriores.");
        } else {
          setError("Alguns campos precisam de atenção.");
        }
      } else {
        setError("Ocorreu um erro interno. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [step]);

  // Listener de Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loadingRef.current) {
        if (document.activeElement?.tagName === 'BUTTON') return;
        handleRegister();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRegister]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          title="Sua Jornada Acadêmica Começa Aqui." 
          subtitle="Cadastre-se para acessar os recursos exclusivos do QuizLab e elevar seu aprendizado ao próximo nível." 
        />

        <div className="col-span-1 lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-card">
          <div className="max-w-md mx-auto w-full space-y-10">
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between px-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500",
                    step === s ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : 
                    step > s ? "bg-primary/20 text-primary" : "bg-on-surface-variant/5 text-on-surface-variant/30"
                  )}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={cn(
                      "h-1 mx-4 flex-1 rounded-full transition-all duration-1000",
                      step > s ? "bg-primary/30" : "bg-on-surface-variant/5"
                    )} />
                  )}
                </div>
              ))}
            </div>

            <header className="space-y-4 text-center lg:text-left">
              <div className="space-y-1">
                <h3 className="font-heading text-3xl font-black text-foreground tracking-tighter">
                  {step === 1 ? "Dados Pessoais" : step === 2 ? "Dados Acadêmicos" : "Segurança"}
                </h3>
                <p className="text-on-surface-variant font-semibold text-base opacity-70">
                  {step === 1 ? "Comece com as informações básicas." : 
                   step === 2 ? "Agora, seus dados do Instituto Federal." : 
                   "Para finalizar, crie uma senha forte."}
                </p>
              </div>
            </header>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 p-5 rounded-3xl flex items-center gap-4 text-destructive animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleRegister} noValidate>
              
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                {step === 1 && (
                  <div className="space-y-6">
                    <AuthInput 
                      label="Nome Completo"
                      icon={User}
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange("fullName", e.target.value)}
                      placeholder="Como você quer ser chamado"
                      error={errors.fullName}
                      disabled={loading}
                    />
                    <AuthInput 
                      label="E-mail Institucional"
                      icon={Mail}
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      placeholder="seu.nome@if.edu.br"
                      error={errors.email}
                      disabled={loading}
                    />
                    <AuthInput 
                      label="CPF"
                      icon={ShieldCheck}
                      value={formData.cpf}
                      onChange={(e) => handleFieldChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                      error={errors.cpf}
                      disabled={loading}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <AuthInput 
                      label="Matrícula"
                      icon={Hash}
                      value={formData.registration}
                      onChange={(e) => handleFieldChange("registration", e.target.value)}
                      placeholder="Sua matrícula institucional"
                      error={errors.registration}
                      disabled={loading}
                    />
                    
                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60 px-1">
                        Campus
                      </label>
                      <SearchableSelect 
                        variant="auth"
                        icon={MapPin}
                        placeholder="Pesquisar campus..."
                        items={campuses.map(c => ({
                          id: c.id,
                          label: c.name,
                          sublabel: c.state,
                          searchTerm: `${c.name} ${c.city} ${c.state}`
                        }))}
                        value={formData.campusId}
                        onValueChange={(val) => handleFieldChange("campusId", val)}
                        error={errors.campusId}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60 px-1">
                        Curso
                      </label>
                      <SearchableSelect 
                        variant="auth"
                        icon={BookOpen}
                        placeholder="Pesquisar curso..."
                        items={courses.map(c => ({
                          id: c.id,
                          label: c.name,
                          searchTerm: c.name
                        }))}
                        value={formData.courseId}
                        onValueChange={(val) => handleFieldChange("courseId", val)}
                        error={errors.courseId}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <AuthInput 
                      label="Senha"
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleFieldChange("password", e.target.value)}
                      placeholder="Pelo menos 8 caracteres"
                      error={errors.password}
                      disabled={loading}
                      rightElement={
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setShowPassword(!showPassword);
                          }}
                          className="text-on-surface-variant/30 hover:text-primary transition-colors focus:outline-none cursor-pointer p-2 -mr-2"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />
                    <AuthInput 
                      label="Confirme a Senha"
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      value={formData.passwordConfirmation}
                      onChange={(e) => handleFieldChange("passwordConfirmation", e.target.value)}
                      placeholder="Repita sua senha"
                      error={errors.passwordConfirmation}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={loading}
                    className="flex-1 py-8 rounded-2xl font-black text-lg border-2 hover:bg-surface-container-highest cursor-pointer active:scale-95 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 mr-2" />
                    Voltar
                  </Button>
                )}
                
                <Button
                  disabled={loading}
                  onClick={handleRegister}
                  className={cn(
                    "flex-[2] py-8 rounded-2xl font-heading font-black text-lg tracking-tight cursor-pointer",
                    "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
                    "transition-all active:scale-[0.96] group"
                  )}
                  type="button"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {step < 3 ? "Próximo Passo" : "Finalizar Cadastro"}
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-on-surface-variant font-bold opacity-60">
                  Já possui conta?{" "}
                  <Link href="/login" className="text-primary font-black hover:underline transition-colors hover:text-primary/70">
                    Faça login
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
