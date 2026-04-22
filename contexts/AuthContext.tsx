"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: "P" | "S" | "A";
  initials: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const token = Cookies.get("quizlab_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch("/profile", { auth: true });
      const userData = data.data || data;
      
      // Renova o cookie por mais 7 dias ao carregar o sistema com sucesso
      Cookies.set("quizlab_token", token, { expires: 7 });
      
      setUser(userData);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      // Se o token for inválido, limpa e redireciona
      Cookies.remove("quizlab_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    Cookies.remove("quizlab_token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
