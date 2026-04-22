"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  User, 
  Mail, 
  Hash, 
  MapPin, 
  BookOpen, 
  ShieldCheck, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [campuses, setCampuses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    registration: "",
    campusId: "",
    courseId: "",
    password: "",
  });

  // Ref para controle de performance do clique
  const loadingRef = useRef(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        registration: user.registration || "",
        campusId: user.campus?.id || "",
        courseId: user.course?.id || "",
        password: "", // Mantemos vazio inicialmente por segurança
      });
    }
  }, [user]);

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

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (loadingRef.current) return;

    setLoading(true);
    loadingRef.current = true;
    setError(null);
    setSuccess(false);

    try {
      const payload: any = {
        fullName: formData.fullName,
        email: formData.email,
        registration: formData.registration,
        campusId: formData.campusId,
        courseId: formData.courseId,
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }

      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
        auth: true
      });

      await refreshUser();
      
      setSuccess(true);
      // Mantemos a senha no formulário se o usuário digitou, 
      // ou apenas não limpamos se ele quiser continuar editando.
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex font-sans">
      <Sidebar 
        userRole={user.role} 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />

      <main className={cn(
        "flex-1 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isSidebarCollapsed ? "lg:ml-24" : "lg:ml-80",
        "p-4 lg:p-12 pb-24 lg:pb-12"
      )}>
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header Mobile Otimizado */}
          <div className="flex items-center justify-between lg:hidden mb-8">
             <Link href="/" className="p-3 bg-card rounded-2xl border border-surface-container-highest">
                <ArrowLeft className="w-5 h-5" />
             </Link>
             <h1 className="text-xl font-black tracking-tight">Editar Perfil</h1>
             <div className="w-11" />
          </div>

          <header className="space-y-4 hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              Configurações de Conta
            </div>
            <h2 className="text-5xl font-black text-foreground tracking-tighter">
              Seu Perfil, <span className="text-primary opacity-80">Sua Identidade.</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Avatar & Identity Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card rounded-[2.5rem] p-8 border border-surface-container-highest shadow-xl shadow-black/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                <div className="relative flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary/30 group-hover:scale-105 transition-transform duration-500">
                      {user.initials}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-background p-2 rounded-2xl shadow-lg border border-surface-container-highest">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-foreground truncate w-full">{user.fullName}</h3>
                    <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">
                      {user.role === 'ADMIN' ? 'Administrador' : user.role === 'PROFESSOR' ? 'Professor' : 'Estudante'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {success && (
                <div className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] flex items-center gap-4 text-primary animate-in fade-in zoom-in duration-500">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                  <p className="text-sm font-black tracking-tight">Alterações salvas com sucesso!</p>
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-[2rem] flex items-center gap-4 text-destructive animate-in fade-in zoom-in duration-500">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <p className="text-sm font-black tracking-tight">{error}</p>
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSave} className="space-y-8">
                
                <div className="bg-card lg:border border-surface-container-highest lg:rounded-[3rem] lg:p-10 space-y-10">
                  
                  {/* Basic Info Group */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant/60">Informações Básicas</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileInput 
                        label="Nome Completo"
                        icon={User}
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                      <ProfileInput 
                        label="E-mail Institucional"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </section>

                  {/* Academic Info Group */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant/60">Dados Acadêmicos</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileInput 
                        label="Matrícula"
                        icon={Hash}
                        value={formData.registration}
                        onChange={(e) => setFormData({...formData, registration: e.target.value})}
                      />
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Campus</label>
                        <div className="relative group">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
                          <select 
                            value={formData.campusId}
                            onChange={(e) => setFormData({...formData, campusId: e.target.value})}
                            className="w-full h-14 pl-14 pr-6 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="">Selecione o Campus</option>
                            {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Curso</label>
                      <div className="relative group">
                        <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
                        <select 
                          value={formData.courseId}
                          onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                          className="w-full h-14 pl-14 pr-6 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Selecione o Curso</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Security Group */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <h4 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface-variant/60">Segurança</h4>
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Deixe em branco para manter a atual"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full h-14 pl-14 pr-14 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-sm font-bold transition-all outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/30 hover:text-primary transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </section>
                </div>

                <div className="pt-4">
                  <Button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-8 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer group"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        Salvar Alterações
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileInput({ label, icon: Icon, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
        <input 
          type={type}
          value={value}
          onChange={onChange}
          className="w-full h-14 pl-14 pr-6 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-sm font-bold transition-all outline-none"
        />
      </div>
    </div>
  );
}
