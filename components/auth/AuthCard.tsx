"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className={cn(
      "w-full max-w-5xl h-screen lg:h-auto grid grid-cols-1 lg:grid-cols-12",
      "bg-card lg:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]",
      "overflow-hidden z-10 border border-white/60 backdrop-blur-md relative",
      className
    )}>
      {children}
    </div>
  );
}
