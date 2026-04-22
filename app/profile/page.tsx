"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  User, 
  Mail, 
  Hash, 
  MapPin, 
  BookOpen, 
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
import { SearchableSelect } from "@/components/SearchableSelect";

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

  const handleFieldChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === "registration") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const loadingRef = useRef(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        registration: user.registration || "",
        campusId: user.campus?.id || "",
        courseId: user.course?.id || "",
        password: "",
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingRef.current) return;
    setLoading(true);
    loadingRef.current = true;
    setError(null);
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
        "flex-1 transition-all duration-500",
        isSidebarCollapsed ? "lg:ml-24" : "lg:ml-80",
        "mt-20 lg:mt-0 p-0 lg:p-12 pb-0 lg:pb-12"
      )}>
        <div className="max-w-3xl mx-auto space-y-10 lg:space-y-12">
          
          <form onSubmit={handleSave} className="space-y-10">
            <div className="bg-card lg:border border-surface-container-highest lg:rounded-[4rem] rounded-none p-8 lg:p-12 space-y-10 shadow-sm lg:shadow-none min-h-screen lg:min-h-0 pb-24 lg:pb-12">
              
              {/* Top Header Desktop/Mobile Unified */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter">
                    Editar <span className="text-primary">Perfil</span>
                  </h1>
                  <p className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest hidden lg:block">
                    Gerencie suas informações e preferências
                  </p>
                </div>
                <Link href="/" className="lg:hidden p-2 bg-surface-container-highest rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>

              {/* Status Banners */}
              {success && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center gap-3 text-primary animate-in fade-in zoom-in">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-bold">Alterações salvas com sucesso!</p>
                </div>
              )}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 text-destructive animate-in fade-in zoom-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
            {/* Basic Info Group */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Dados Pessoais</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                  label="Nome Completo"
                  icon={User}
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange("fullName", e.target.value)}
                />
                <ProfileInput 
                  label="E-mail Institucional"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange("email", e.target.value)}
                />
              </div>
            </section>

            {/* Academic Info Group */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant/40">Institucional</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                  label="Matrícula"
                  icon={Hash}
                  value={formData.registration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange("registration", e.target.value)}
                />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Campus</label>
                  <SearchableSelect 
                    variant="profile"
                    icon={MapPin}
                    placeholder="Selecione o Campus"
                    items={campuses.map(c => ({
                      id: c.id,
                      label: c.name,
                      sublabel: c.state,
                      searchTerm: `${c.name} ${c.city} ${c.state}`
                    }))}
                    value={formData.campusId}
                    onValueChange={(val) => handleFieldChange("campusId", val)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Curso</label>
                <SearchableSelect 
                  variant="profile"
                  icon={BookOpen}
                  placeholder="Selecione o Curso"
                  items={courses.map(c => ({
                    id: c.id,
                    label: c.name,
                    searchTerm: c.name
                  }))}
                  value={formData.courseId}
                  onValueChange={(val) => handleFieldChange("courseId", val)}
                />
              </div>
            </section>

            {/* Security Group */}
            <section className="space-y-8 pt-6 border-t border-surface-container-highest/50">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-destructive rounded-full" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Segurança</h4>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase">Alterar sua senha de acesso</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-1">Nova Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-on-surface-variant/20 group-focus-within:text-primary transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Deixe em branco para manter a atual"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange("password", e.target.value)}
                    className="w-full h-16 pl-16 pr-16 bg-surface-container-highest/30 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-2xl text-sm font-bold transition-all outline-none"
                  />
                  <button
                    type="button"
                    onMouseDown={(e: React.MouseEvent) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant/20 hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </section>

            <div className="pt-6">
              <Button 
                disabled={loading}
                type="submit"
                className="w-full py-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </form>
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
