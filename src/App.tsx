import React, { useState } from "react";
import { Sparkles, Cpu, Sun, VolumeX, Volume2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SidebarNav from "./components/SidebarNav";
import QuoteOrb from "./components/QuoteOrb";
import CreatorPulse from "./components/CreatorPulse";
import ScriptLab from "./components/ScriptLab";
import ContentMirror from "./components/ContentMirror";
import IndiaPulseEngine from "./components/IndiaPulseEngine";
import HookLibrary from "./components/HookLibrary";
import CtaLab from "./components/CtaLab";

export default function App() {
  const [activeTab, setActiveTab] = useState<"pulse" | "script-lab" | "content-mirror" | "india-pulse" | "hook-library" | "cta-lab">("pulse");
  const [eventVibe, setEventVibe] = useState<"diwali" | "holi" | "independence" | "normal">("diwali");
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  const getEventTitle = () => {
    switch (eventVibe) {
      case "diwali": return "🪔 DIWALI FESTIVAL GOLD ACTIVE";
      case "holi": return "🎨 HOLI PASTEL COLORWAY ACTIVE";
      case "independence": return "🇮🇳 INDEPENDENCE PATRIOTIC ACTIVE";
      default: return "🌧️ MONSOON / NORMAL VIBE";
    }
  };

  return (
    <div
      id="creatoros-app-root"
      className="min-h-screen text-[#1a1613] bg-[#f7f5f1] font-sans relative py-6 px-4 md:px-8 flex flex-col justify-between overflow-x-hidden selection:bg-[#cf7051]/30 selection:text-white pb-12 transition-all duration-500 theme-light"
    >
      {/* Absolute Dynamic Seasonal Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {eventVibe === "diwali" && (
          <>
            <div className="absolute top-[10%] left-[5%] w-[45%] h-[45%] rounded-full bg-amber-500/5 blur-[120px]" />
            <div className="absolute bottom-[15%] right-[5%] w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]" />
          </>
        )}
        {eventVibe === "holi" && (
          <>
            <div className="absolute top-[5%] left-[10%] w-[35%] h-[35%] rounded-full bg-pink-500/5 blur-[120px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] rounded-full bg-purple-500/5 blur-[130px]" />
            <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-yellow-500/4 blur-[100px]" />
          </>
        )}
        {eventVibe === "independence" && (
          <>
            <div className="absolute top-[5%] left-[5%] w-[45%] h-[45%] rounded-full bg-orange-600/5 blur-[130px]" />
            <div className="absolute bottom-[5%] right-[5%] w-[45%] h-[45%] rounded-full bg-emerald-600/5 blur-[130px]" />
          </>
        )}
        {eventVibe === "normal" && (
          <>
            <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-sky-500/5 blur-[110px]" />
            <div className="absolute bottom-[15%] right-[15%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[110px]" />
          </>
        )}
      </div>

      {/* Main App Content container */}
      <div className="max-w-7xl mx-auto w-full space-y-6 relative z-10 flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white border border-slate-200 rounded-3xl shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-gradient-to-tr from-[#cf7051] to-[#cca972] rounded-2xl flex items-center justify-center shadow-md">
              <Cpu className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-black tracking-tight text-slate-900 font-display uppercase">CreatorOS AI</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-mono font-bold px-2.5 py-0.5 rounded-full">
                  Atelier Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Premium India-First Creator Operating System</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Active Vibe Status */}
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-200 rounded-xl px-3 py-1.5 text-[10.5px] font-mono font-bold text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
              {getEventTitle()}
            </div>

            {/* Audio configuration toggle */}
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
                !isMuted
                  ? "bg-[#cf7051]/10 text-[#cf7051] border-[#cf7051]/30 hover:bg-[#cf7051]/15"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>Audio feedback: {isMuted ? "OFF" : "ON"}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Indian creator Quote of the Day */}
        <QuoteOrb language="Hinglish" />

        {/* Master Workspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Side navigation workspace selector */}
          <div className="lg:col-span-3">
            <SidebarNav
              activeTab={activeTab}
              setActiveTab={(tab) => {
                if (!isMuted) {
                  try {
                    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                    audio.volume = 0.25;
                    audio.play().catch(() => {});
                  } catch {}
                }
                setActiveTab(tab);
              }}
              eventVibe={eventVibe}
              setEventVibe={(vibe) => {
                if (!isMuted) {
                  try {
                    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");
                    audio.volume = 0.25;
                    audio.play().catch(() => {});
                  } catch {}
                }
                setEventVibe(vibe);
              }}
            />
          </div>

          {/* Active Workspace Render Space */}
          <main className="lg:col-span-9 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {activeTab === "pulse" && (
                  <CreatorPulse eventVibe={eventVibe} onNavigateToScriptLab={() => setActiveTab("script-lab")} />
                )}
                {activeTab === "script-lab" && <ScriptLab />}
                {activeTab === "content-mirror" && <ContentMirror />}
                {activeTab === "india-pulse" && <IndiaPulseEngine />}
                {activeTab === "hook-library" && <HookLibrary />}
                {activeTab === "cta-lab" && <CtaLab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Simple dynamic page footer */}
      <footer className="max-w-7xl mx-auto w-full mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-xs gap-4">
        <div>
          <span>© {new Date().getFullYear()} CreatorOS AI • Made for Indian Creators 🇮🇳</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-[#cca972]" />
          <span>Offline Sandbox. All logic runs on local container environment.</span>
        </div>
      </footer>
    </div>
  );
}
