"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  rightElement?: React.ReactNode;
}

export function AuthInput({ 
  label, 
  icon: Icon, 
  error, 
  rightElement, 
  className, 
  ...props 
}: AuthInputProps) {
  return (
    <div className="space-y-4 w-full">
      <label className="block text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1 opacity-60">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-on-surface-variant/30 group-focus-within:text-primary transition-all duration-300">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <input
          {...props}
          className={cn(
            "block w-full py-6 rounded-[1.25rem]",
            Icon ? "pl-16" : "px-6",
            rightElement ? "pr-14" : "pr-6",
            "bg-surface-container-highest border-none outline-none",
            "font-bold text-base tracking-tight",
            "focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all duration-300",
            "placeholder:text-on-surface-variant/20 shadow-sm",
            "disabled:opacity-50",
            error && "ring-2 ring-destructive/30 bg-destructive/5",
            className
          )}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-top-1 duration-300">
          {error}
        </p>
      )}
    </div>
  );
}
