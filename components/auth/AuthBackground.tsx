"use client";

import React from "react";

export function AuthBackground() {
  return (
    <>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
    </>
  );
}
