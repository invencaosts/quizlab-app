"use client";

import React from "react";

interface AuthHeroProps {
  title: string;
  subtitle: string;
}

export function AuthHero({ title, subtitle }: AuthHeroProps) {
  return (
    <div className="hidden lg:flex lg:col-span-6 bg-primary relative overflow-hidden flex-col justify-between p-12 text-primary-foreground">
      {/* Subtle Geometric Overlays */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.4)_1px,transparent_0)] bg-[length:32px_32px]"></div>
      <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 space-y-10 max-w-sm mx-auto w-full flex flex-col items-start text-left">
        <span className="inline-block px-4 py-2 bg-white/15 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-white/20 backdrop-blur-xl">
          Educação Digital
        </span>
        <div className="space-y-6">
          <h2 className="font-heading text-5xl font-black leading-[1.1] tracking-tight">
            {title}
          </h2>
          <p className="text-primary-foreground/90 leading-relaxed text-xl font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-1 bg-white/40 rounded-full"></div>
          <span className="font-heading font-black text-sm tracking-[0.25em] uppercase opacity-80">QuizLab IF</span>
        </div>
        <p className="text-[11px] font-black tracking-widest opacity-40 uppercase">© 2026 Instituto Federal de Sergipe</p>
      </div>
    </div>
  );
}
