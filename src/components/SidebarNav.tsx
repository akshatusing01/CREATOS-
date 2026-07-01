import React from "react";
import { Sparkles, Activity, FileText, Settings, ShieldAlert, Cpu, Heart, Flame, Calendar, Trophy, Zap, MessageSquare } from "lucide-react";
import { motion } from "motion/react";

interface SidebarNavProps {
  activeTab: "pulse" | "script-lab" | "content-mirror" | "india-pulse" | "hook-library" | "cta-lab";
  setActiveTab: (tab: "pulse" | "script-lab" | "content-mirror" | "india-pulse" | "hook-library" | "cta-lab") => void;
  eventVibe: "diwali" | "holi" | "independence" | "normal";
  setEventVibe: (vibe: "diwali" | "holi" | "independence" | "normal") => void;
}

export default function SidebarNav({
  activeTab,
  setActiveTab,
  eventVibe,
  setEventVibe
}: SidebarNavProps) {
  // Navigation tabs config
  const navItems = [
    { id: "pulse", name: "Creator Pulse", icon: Activity, badge: "LIVE" },
    { id: "script-lab", name: "Script Lab (Atelier)", icon: Sparkles, badge: "NEW" },
    { id: "content-mirror", name: "Content Mirror", icon: FileText, badge: "FEEDBACK" },
    { id: "india-pulse", name: "India Pulse Engine", icon: Flame, badge: "TRENDS" },
    { id: "hook-library", name: "Hook Library", icon: Heart, badge: "PROVEN" },
    { id: "cta-lab", name: "CTA Lab", icon: MessageSquare, badge: "LIGHT" }
  ] as const;

  const getVibeName = (vibe: string) => {
    switch (vibe) {
      case "diwali": return "Diwali Gold Mood";
      case "holi": return "Holi Pastel Mood";
      case "independence": return "Independence Vibe";
      default: return "Normal Off-season";
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 flex flex-col gap-5 shadow-sm relative overflow-hidden">
      {/* Absolute design branding token in background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#cf7051]/5 to-transparent blur-2xl pointer-events-none" />

      {/* Launcher Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#cf7051] to-[#cca972] flex items-center justify-center shadow-md">
          <Cpu className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none font-display mb-1 uppercase">CreatorOS</h3>
          <span className="text-[9px] text-[#cca972] font-mono tracking-wider uppercase font-extrabold">Operating System</span>
        </div>
      </div>

      {/* 6 Modules Navigation */}
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold px-2.5 mb-1.5 select-none">
          Active Modules
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-bold select-none cursor-pointer transition relative ${
                isSelected
                  ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/10 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 z-10">
                <Icon className={`w-4 h-4 transition ${isSelected ? "text-[#cf7051]" : "text-slate-400 group-hover:text-[#cca972]"}`} />
                <span>{item.name}</span>
              </div>
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border z-10 ${
                isSelected
                  ? "bg-[#cf7051]/10 border-[#cf7051]/20 text-[#cf7051]"
                  : "bg-slate-50 border-slate-100 text-slate-400 group-hover:text-slate-600"
              }`}>
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Seasonal alignment widget at bottom of sidebar */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold px-2.5 mb-1.5 select-none block">
            System Event Alignment
          </span>
          <select
            value={eventVibe}
            onChange={(e) => setEventVibe(e.target.value as any)}
            className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl p-2.5 border border-slate-200 focus:outline-none transition cursor-pointer"
          >
            <option value="diwali">🪔 Diwali Gold Vibe</option>
            <option value="holi">🎨 Holi Colors Vibe</option>
            <option value="independence">🇮🇳 Independence Pride</option>
            <option value="normal">🌧️ Normal / Monsoon Vibe</option>
          </select>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150">
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-[#cca972] uppercase tracking-wide mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#cf7051]" />
            <span>Operator Mode</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal font-sans">
            Offline Sandbox Active. Auto-persisted to browser cash.
          </p>
        </div>
      </div>
    </aside>
  );
}
