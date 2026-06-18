import React from "react";
import { Cpu, Sun, Moon, VolumeX, Volume2, Sparkles, Settings } from "lucide-react";

interface TopBarProps {
  theme: "atelier" | "light";
  toggleTheme: () => void;
  isMuted: boolean;
  toggleSound: () => void;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
  showProfile: boolean;
  toggleProfile: () => void;
}

export default function TopBar({
  theme,
  toggleTheme,
  isMuted,
  toggleSound,
  animationsEnabled,
  toggleAnimations,
  showProfile,
  toggleProfile
}: TopBarProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-[#141416]/95 backdrop-blur-xl border border-[#232225] rounded-2xl shadow-xl gap-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 bg-gradient-to-tr from-[#cf7051] to-[#cca972] rounded-xl flex items-center justify-center shadow-lg shadow-[#cf7051]/20">
          <Cpu className="w-5.5 h-5.5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-tight text-white font-display">CreatorOS</span>
            <span className="text-[10px] bg-[#cca972]/15 text-[#cca972] border border-[#cca972]/30 font-mono font-bold px-2.5 py-0.5 rounded-full">Atelier v3.5</span>
          </div>
          <p className="text-xs text-[#9cd69c] text-opacity-80">Refined Content Intelligence Command Center</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Theme select controls */}
        <button
          onClick={toggleTheme}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
            theme === "light"
              ? "bg-[#cf7051]/10 text-[#cf7051] border-[#cf7051]/30 hover:bg-[#cf7051]/15"
              : "bg-[#202022] text-[#cca972] border-[#2e2c2a] hover:bg-[#2c2c2f]"
          }`}
          title={theme === "light" ? "Switch to Atelier Dark Mode" : "Switch to High-Contrast Light Mode"}
        >
          {theme === "light" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>Theme: {theme === "light" ? "Light" : "Atelier"}</span>
        </button>

        {/* Audio feedback config */}
        <button
          onClick={toggleSound}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
            !isMuted 
              ? "bg-[#cf7051]/10 text-[#cf7051] border-[#cf7051]/30 hover:bg-[#cf7051]/15" 
              : "bg-[#202022] text-[#5e5a5c] border-[#2e2b2a] hover:bg-[#28282b]"
          }`}
          title={isMuted ? "Enable click feedback audio" : "Mute button sounds"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Audio Feedback</span>
        </button>

        {/* Canvas Drift toggle */}
        <button
          onClick={toggleAnimations}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition duration-200 cursor-pointer ${
            animationsEnabled 
              ? "bg-[#9ca69b]/10 text-[#9ca69b] border-[#9ca69b]/30 hover:bg-[#9ca69b]/15" 
              : "bg-[#202022] text-[#5e5a5c] border-[#2e2b2a] hover:bg-[#28282b]"
          }`}
          title={animationsEnabled ? "Disable floating animations" : "Enable luxury floating visual drifts"}
        >
          <Sparkles className={`w-3.5 h-3.5 ${animationsEnabled ? "animate-pulse" : ""}`} />
          <span className="hidden sm:inline">Canvas Drifts</span>
        </button>

        {/* Dynamic platform status badge */}
        <div className="flex items-center gap-2 bg-[#9ca69b]/10 border border-[#9ca69b]/25 rounded-xl px-3 py-1.5 text-[10.5px] font-mono font-bold text-[#9ca69b]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cca972] animate-ping"></span>
          GEMINI FLASH ACTIVE
        </div>
        
        {/* Profile Settings toggler */}
        <button
          onClick={toggleProfile}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border ${
            showProfile
              ? "bg-[#cf7051]/20 text-white border-[#cf7051]/55 shadow-lg shadow-[#cf7051]/10"
              : "bg-[#202022] hover:bg-[#2c2c2f] border-[#2e2c2a] text-[#cca972] hover:text-white"
          }`}
          title={showProfile ? "Close Profile Settings" : "Open Profile Settings"}
        >
          <Settings className={`w-3.5 h-3.5 transition-transform duration-500 ${showProfile ? "rotate-90 text-[#cf7051]" : ""}`} />
          <span>Profile Settings</span>
        </button>
      </div>
    </header>
  );
}
