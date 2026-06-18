import React from "react";
import { Sparkles, Activity, FileText, Settings, ShieldAlert, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface SidebarNavProps {
  activeWorkspace: "atelier" | "intelligence";
  setWorkspace: (ws: "atelier" | "intelligence") => void;
  savedCount: number;
  intelCount: number;
  onOpenSettings: () => void;
  showProfile: boolean;
}

export default function SidebarNav({
  activeWorkspace,
  setWorkspace,
  savedCount,
  intelCount,
  onOpenSettings,
  showProfile
}: SidebarNavProps) {
  return (
    <aside className="w-full lg:w-64 bg-[#141416]/95 backdrop-blur-xl border border-[#232225] rounded-2xl p-5 flex flex-col gap-6 shadow-xl relative overflow-hidden">
      {/* Absolute design branding token in background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#cf7051]/5 to-transparent blur-2xl pointer-events-none" />

      {/* Launcher Profile Brain header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#232225]">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#cf7051] to-[#cca972] flex items-center justify-center shadow-md">
          <Cpu className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight leading-none font-display mb-1">CreatorOS</h3>
          <span className="text-[9px] text-[#cca972] font-mono tracking-wider uppercase font-semibold">Workspace Hub</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <span className="text-[9px] uppercase tracking-widest text-[#5e5a5c] font-bold px-2.5 mb-1.5 select-none">
          Workspaces
        </span>

        {/* WORKSPACE 1: Script Atelier */}
        <button
          onClick={() => setWorkspace("atelier")}
          className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold select-none cursor-pointer transition-all duration-300 relative ${
            activeWorkspace === "atelier"
              ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/20 shadow-md shadow-[#cf7051]/5"
              : "text-[#5e5a5c] hover:bg-white/5 hover:text-white border border-transparent"
          }`}
        >
          {activeWorkspace === "atelier" && (
            <motion.div
              layoutId="activeWorkspaceBubble"
              className="absolute inset-0 bg-[#cf7051]/5 border border-[#cf7051]/15 rounded-xl pointer-events-none"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <div className="flex items-center gap-2.5 z-10">
            <Sparkles className={`w-4 h-4 transition-transform duration-300 ${activeWorkspace === "atelier" ? "text-[#cf7051] rotate-12" : "text-[#5e5a5c] group-hover:rotate-12 group-hover:text-[#cca972]"}`} />
            <span>Script Lab & Atelier</span>
          </div>
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border z-10 ${
            activeWorkspace === "atelier"
              ? "bg-[#cf7051]/15 border-[#cf7051]/30 text-[#cf7051]"
              : "bg-[#232225] border-[#2e2b2a] text-[#5e5a5c] group-hover:text-white"
          }`}>
            {savedCount}
          </span>
        </button>

        {/* WORKSPACE 2: Creator Intelligence */}
        <button
          onClick={() => setWorkspace("intelligence")}
          className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold select-none cursor-pointer transition-all duration-300 relative ${
            activeWorkspace === "intelligence"
              ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/20 shadow-md shadow-[#cf7051]/5"
              : "text-[#5e5a5c] hover:bg-white/5 hover:text-white border border-transparent"
          }`}
        >
          {activeWorkspace === "intelligence" && (
            <motion.div
              layoutId="activeWorkspaceBubble"
              className="absolute inset-0 bg-[#cf7051]/5 border border-[#cf7051]/15 rounded-xl pointer-events-none"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <div className="flex items-center gap-2.5 z-10">
            <Activity className={`w-4 h-4 transition-transform duration-300 ${activeWorkspace === "intelligence" ? "text-[#cf7051]" : "text-[#5e5a5c] group-hover:scale-110 group-hover:text-[#cca972]"}`} />
            <span className="font-semibold">Creator Intelligence</span>
          </div>
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border z-10 ${
            activeWorkspace === "intelligence"
              ? "bg-[#cf7051]/15 border-[#cf7051]/30 text-[#cf7051]"
              : "bg-[#232225] border-[#2e2b2a] text-[#5e5a5c] group-hover:text-white"
          }`}>
            {intelCount}
          </span>
        </button>
      </div>

      {/* Footer support panel */}
      <div className="pt-4 border-t border-[#232225] flex flex-col gap-3">
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-[#5e5a5c] hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer ${
            showProfile ? "bg-white/5 text-white" : ""
          }`}
        >
          <Settings className={`w-4 h-4 ${showProfile ? "text-[#cf7051] rotate-45" : ""}`} />
          <span>Atelier Profile Engine</span>
        </button>

        <div className="p-3 bg-white/2 rounded-xl border border-[#232225]">
          <div className="flex items-center gap-1 text-[9.5px] font-bold text-[#cca972] uppercase tracking-wide mb-1">
            <ShieldAlert className="w-3 h-3 text-[#cf7051]" />
            <span>Telemetry</span>
          </div>
          <p className="text-[10px] text-[#5e5a5c] leading-normal font-sans">
            Operating in absolute single-operator sandbox mode.
          </p>
        </div>
      </div>
    </aside>
  );
}
