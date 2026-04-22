import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get user role from auth context
  const userRole = "PROFESSOR";

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Sidebar userRole={userRole} />
      
      {/* 
          Main Content Area 
          Desktop: Fixed Sidebar at 80 units (320px)
          Mobile: Top padding for fixed header (20 units / 80px)
      */}
      <main className="lg:pl-80 pt-20 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
          {children}
        </div>
      </main>
    </div>
  );
}
