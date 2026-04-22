"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { 
  User, 
  Mail, 
  School, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  MapPin,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/SearchableSelect";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Escuta global para a tecla Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        if (document.activeElement?.tagName === 'BUTTON') return;
        handleSave(e as any);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, formData]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        registration: user.registration || "",
        campusId: user.campus?.id || "",
        courseId: user.course?.id || "",
      }));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setFormData(prev => ({ ...prev, password: "" }));
      
      // Redireciona para a home após o sucesso
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      <Sidebar 
        userRole={user.role} 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <main className={cn(
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "pt-20 lg:pt-0 min-h-screen bg-zinc-50/50 pb-20",
        isSidebarCollapsed ? "lg:pl-24" : "lg:pl-80"
      )}>
        <div className="p-6 lg:p-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tighter">
              Edição de Perfil
            </h2>
            <p className="text-zinc-500 font-bold mt-2">
              Mantenha seus dados institucionais atualizados para uma melhor experiência.
            </p>
          </header>

          <form onSubmit={handleSave} className="space-y-8">
            
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4 text-emerald-700 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-6 h-6" />
                <p className="font-bold">Dados salvos com sucesso!</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-700 animate-in fade-in zoom-in duration-500">
                <AlertCircle className="w-6 h-6" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-zinc-200/50 border border-zinc-100 space-y-12">
              
              {/* Personal Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-50">
                  <div className="bg-emerald-50 p-2 rounded-xl text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-black text-zinc-900 tracking-tight">Dados Pessoais</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ProfileInput 
                    label="Nome Completo" 
                    icon={User} 
                    value={formData.fullName}
                    onChange={(val: string) => setFormData(prev => ({ ...prev, fullName: val }))}
                  />
                  <ProfileInput 
                    label="E-mail Institucional" 
                    icon={Mail} 
                    type="email"
                    value={formData.email}
                    onChange={(val: string) => setFormData(prev => ({ ...prev, email: val }))}
                  />
                </div>
              </section>

              {/* Academic Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-50">
                  <div className="bg-emerald-50 p-2 rounded-xl text-primary">
                    <School className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-black text-zinc-900 tracking-tight">Dados Acadêmicos</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ProfileInput 
                    label="Matrícula" 
                    icon={Hash} 
                    value={formData.registration}
                    onChange={(val: string) => setFormData(prev => ({ ...prev, registration: val }))}
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
                      Campus de Origem
                    </label>
                    <SearchableSelect 
                      variant="profile"
                      icon={MapPin}
                      placeholder="Pesquisar campus..."
                      items={campuses.map(c => ({
                        id: c.id,
                        label: c.name,
                        sublabel: c.state,
                        searchTerm: `${c.name} ${c.city} ${c.state}`
                      }))}
                      value={formData.campusId}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, campusId: val }))}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
                      Curso Vinculado
                    </label>
                    <SearchableSelect 
                      variant="profile"
                      icon={BookOpen}
                      placeholder="Pesquisar curso..."
                      items={courses.map(c => ({
                        id: c.id,
                        label: c.name,
                        searchTerm: c.name
                      }))}
                      value={formData.courseId}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, courseId: val }))}
                    />
                  </div>
                </div>
              </section>

              {/* Security Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-50">
                  <div className="bg-emerald-50 p-2 rounded-xl text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xl font-black text-zinc-900 tracking-tight">Alteração de Senha</h4>
                </div>
                
                <div className="max-w-md">
                  <ProfileInput 
                    label="Nova Senha" 
                    icon={Lock} 
                    type="password"
                    placeholder="Mantenha vazio se não quiser alterar"
                    value={formData.password}
                    onChange={(val: string) => setFormData(prev => ({ ...prev, password: val }))}
                  />
                </div>
              </section>

              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-12 py-8 rounded-[1.5rem] font-black text-xl bg-primary hover:bg-emerald-700 text-white shadow-2xl shadow-primary/20 transition-all active:scale-[0.97] flex items-center gap-4 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <Save className="w-7 h-7" />
                  )}
                  Atualizar Dados
                </Button>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Registrado em</p>
                  <p className="text-sm font-bold text-zinc-400">
                    {new Date(user.createdAt || "").toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function ProfileInput({ label, icon: Icon, type = "text", value, onChange, placeholder, disabled }: {
  label: string;
  icon: any;
  type?: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className={cn("space-y-2", disabled && "opacity-50 pointer-events-none")}>
      <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
        {label}
      </label>
      <div className="relative group">
        <div className={cn(
          "absolute left-5 top-1/2 -translate-y-1/2 transition-colors",
          "text-zinc-400 group-focus-within:text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-14 pr-6 font-bold text-zinc-900 transition-all outline-none",
            "focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5"
          )}
        />
      </div>
    </div>
  );
}
