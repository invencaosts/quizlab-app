"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Fingerprint, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCPF } from "@/lib/utils";
import { isValidCPF } from "@/lib/cpf-validator";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHero } from "@/components/auth/AuthHero";
import { AuthInput } from "@/components/auth/AuthInput";
import { SearchableSelect } from "@/components/SearchableSelect";

interface Campus {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface Course {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    registration: "",
    campusId: "",
    courseId: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  


  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campusData, courseData] = await Promise.all([
          apiFetch("/campuses"),
          apiFetch("/courses")
        ]);
        setCampuses(campusData);
        setCourses(courseData);
      } catch (err) {
        console.error("Erro ao carregar dados acadêmicos:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Matrícula: Só números, max 10
    if (name === "registration") {
      processedValue = value.replace(/\D/g, "").substring(0, 10);
    }
    
    if (name === "cpf") {
      processedValue = formatCPF(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    // Clear error for that field when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "Nome completo é obrigatório";
      if (!formData.cpf || formData.cpf.length < 14 || !isValidCPF(formData.cpf)) {
        newErrors.cpf = "CPF inválido ou incompleto";
      }
    }

    if (currentStep === 2) {
      if (!formData.registration) newErrors.registration = "Matrícula é obrigatória";
      if (!formData.campusId) newErrors.campusId = "Selecione um campus";
      if (!formData.courseId) newErrors.courseId = "Selecione um curso";
    }

    if (currentStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        newErrors.email = "E-mail é obrigatório";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "E-mail inválido (deve conter @ e .)";
      }

      if (!formData.password) {
        newErrors.password = "Senha é obrigatória";
      } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          newErrors.password = "A senha deve ter 8+ caracteres, com maiúsculas, minúsculas, números e um símbolo (@$!%*?&#)";
        }
      }


      if (formData.password !== formData.passwordConfirmation) {
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      nextStep();
      return;
    }

    if (!validateStep(3)) return;

    setLoading(true);

    setError(null);


    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const token = response.token || response.data?.token;

      if (token) {
        Cookies.set("quizlab_token", token, { expires: 30 });
        window.location.href = "/";
      } else {
        console.error("Token não encontrado na resposta de cadastro:", response);
        setError("Erro ao processar cadastro. Token não recebido.");
      }
    } catch (err: any) {
      // Handle Validation Errors from Backend (status 422)
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const backendErrors: Record<string, string> = {};
        let targetStep = 3;

        err.data.errors.forEach((e: any) => {
          backendErrors[e.field] = e.message;
          
          // Determine which step to return to based on the field with error
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
        // Generic Server Errors
        setError("Ocorreu um erro interno. Tente novamente mais tarde ou contate o suporte.");
      }
    } finally {
      setLoading(false);
    }

  };

  // Referência para evitar re-renders do listener
  const handleRegisterRef = React.useRef(handleRegister);
  handleRegisterRef.current = handleRegister;

  // Escuta global para a tecla Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evita disparar se estiver em um elemento que já trata o Enter (como botões)
      // ou se o formulário estiver carregando
      if (e.key === "Enter" && !loading) {
        // Se o foco estiver em um botão, deixa o navegador tratar naturalmente
        if (document.activeElement?.tagName === 'BUTTON') return;
        
        handleRegisterRef.current(e as any);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading]); // Depende apenas do loading

  return (
    <main className="min-h-screen flex items-center justify-center p-0 lg:p-6 relative overflow-hidden bg-background font-sans bg-academic-pattern bg-fixed">
      <AuthBackground />

      <AuthCard>
        <AuthHero 
          title="Faça parte da Rede Acadêmica Federal." 
          subtitle="Acesse ferramentas de avaliação de alto nível e análises competitivas em tempo real." 
        />

        <div className="col-span-1 lg:col-span-6 p-8 lg:p-16 flex flex-col justify-center bg-card">
          <div className="max-w-xl mx-auto w-full space-y-10">
            
            <header className="space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-between lg:justify-start lg:gap-4 mb-2">
                 <div className="bg-primary p-2.5 rounded-[1.25rem] shadow-xl shadow-primary/40">
                    <User className="w-6 h-6 text-white" />
                 </div>
                 <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                      <div 
                        key={s} 
                        className={cn(
                          "h-1.5 w-8 rounded-full transition-all duration-500",
                          step >= s ? "bg-primary" : "bg-primary/10"
                        )} 
                      />
                    ))}
                 </div>
              </div>
              <h2 className="font-heading text-3xl font-black text-foreground tracking-tighter">
                {step === 1 && "Primeiros passos"}
                {step === 2 && "Dados acadêmicos"}
                {step === 3 && "Segurança e acesso"}
              </h2>
              <p className="text-on-surface-variant font-semibold text-lg opacity-70">
                {step === 1 && "Vamos começar com sua identificação básica."}
                {step === 2 && "Vincule sua conta à sua instituição oficial."}
                {step === 3 && "Dê o toque final na sua conta QuizLab."}
              </p>
            </header>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-3xl flex items-center gap-4 text-destructive animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleRegister} noValidate>
              
              {/* Step 1: Identity */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <AuthInput 
                    label="Nome Completo"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Como devemos te chamar?"
                    error={errors.fullName}
                  />
                  <AuthInput
                    label="CPF"
                    name="cpf"
                    icon={Fingerprint}
                    required
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    inputMode="numeric"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    error={errors.cpf}
                  />


                </div>
              )}

              {/* Step 2: Academic */}
              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AuthInput
                      label="Matrícula"
                      name="registration"
                      required
                      value={formData.registration}
                      onChange={handleChange}
                      placeholder="Somente números (max 10)"
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      error={errors.registration}
                    />
                    <div className="space-y-4">
                      <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1 opacity-60">
                        Campus de Origem
                      </label>
                      <SearchableSelect 
                        placeholder="Pesquisar campus..."
                        items={campuses.map(c => ({
                          id: c.id,
                          label: c.name,
                          sublabel: c.state,
                          searchTerm: `${c.name} ${c.city} ${c.state}`
                        }))}
                        value={formData.campusId}
                        onValueChange={(val) => {
                          setFormData(p => ({ ...p, campusId: val }));
                          if (errors.campusId) setErrors(prev => ({ ...prev, campusId: "" }));
                        }}
                        error={errors.campusId}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1 opacity-60">
                      Curso Vinculado
                    </label>
                    <SearchableSelect 
                      placeholder="Pesquisar curso..."
                      items={courses.map(c => ({
                        id: c.id,
                        label: c.name,
                        searchTerm: c.name
                      }))}
                      value={formData.courseId}
                      onValueChange={(val) => {
                        setFormData(p => ({ ...p, courseId: val }));
                        if (errors.courseId) setErrors(prev => ({ ...prev, courseId: "" }));
                      }}
                      error={errors.courseId}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Access */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <AuthInput 
                    label="E-mail Institucional"
                    name="email"
                    type="email"
                    icon={Mail}
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@ifs.edu.br"
                    error={errors.email}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AuthInput 
                      label="Sua Senha"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      icon={Lock}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      error={errors.password}
                      rightElement={
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-on-surface-variant/30 hover:text-primary transition-colors focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </button>
                      }
                    />

                    <AuthInput 
                      label="Confirmar"
                      name="passwordConfirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.passwordConfirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      error={errors.passwordConfirmation}
                      rightElement={
                        <button 
                          type="button" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-on-surface-variant/30 hover:text-primary transition-colors focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </button>
                      }
                    />
                  </div>
                </div>
              )}


              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={loading}
                    className="flex-1 py-4 md:py-8 rounded-[1.25rem] border-2 border-primary/20 font-heading font-black text-base md:text-lg tracking-tight hover:bg-primary/5 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                    Voltar
                  </Button>


                )}
                <Button 
                  disabled={loading}
                  onClick={() => {
                    if (step < 3) nextStep();
                  }}
                  className={cn(
                      "flex-[2] py-4 md:py-8 rounded-[1.25rem] font-heading font-black text-base md:text-xl tracking-tight cursor-pointer",
                      "bg-primary hover:bg-primary/90 text-white shadow-[0_20px_40px_-12px_rgba(50,160,65,0.4)]",
                      "transition-all active:scale-[0.96] group",
                      "disabled:opacity-70 disabled:grayscale-[0.5] disabled:cursor-not-allowed"
                  )}
                  type="submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      {step === 3 ? "Finalizar Cadastro" : "Próximo Passo"}
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </>
                  )}
                </Button>

              </div>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-on-surface-variant font-bold opacity-60">
                  Já possui conta?{" "}
                  <Link href="/login" className="text-primary font-black hover:underline transition-colors hover:text-primary/70">
                    Acesse aqui
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
