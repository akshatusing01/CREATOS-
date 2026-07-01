import React from "react";
import { Cpu, Settings } from "lucide-react";

interface TopBarProps {
  theme?: "atelier" | "light";
  toggleTheme?: () => void;
  isMuted?: boolean;
  toggleSound?: () => void;
  animationsEnabled?: boolean;
  toggleAnimations?: () => void;
  showProfile: boolean;
  toggleProfile: () => void;
}

export default function TopBar({
  showProfile,
  toggleProfile
}: TopBarProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border border-soft-stone rounded-2xl shadow-sm gap-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-copper rounded-xl flex items-center justify-center shadow-sm">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-charcoal font-display">CreatorOS AI</span>
            <span className="text-[10px] bg-copper/10 text-copper border border-copper/20 font-sans font-bold px-2.5 py-0.5 rounded-full">Atelier v3.5</span>
          </div>
          <p className="text-xs text-slate-gray mt-0.5 font-sans">Your professional script writing and content strategy advisor</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile Settings toggler */}
        <button
          onClick={toggleProfile}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
            showProfile
              ? "bg-copper/10 text-copper border-copper/30 shadow-sm"
              : "bg-soft-sand hover:bg-[#eae5db] border-soft-stone text-slate-gray hover:text-charcoal"
          }`}
          title={showProfile ? "Close Profile Settings" : "Open Profile Settings"}
        >
          <Settings className={`w-3.5 h-3.5 transition-transform duration-500 ${showProfile ? "rotate-90 text-copper" : ""}`} />
          <span>Profile Blueprint</span>
        </button>
      </div>
    </header>
  );
}
