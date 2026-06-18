import React from "react";
import { Brain, Sparkles, Sliders, PlayCircle, Eye, Flame, AlertCircle } from "lucide-react";
import { IntelDNAUpdate } from "../../types";

interface CreatorDNAViewProps {
  dna: IntelDNAUpdate;
}

export const CreatorDNAView: React.FC<CreatorDNAViewProps> = ({ dna }) => {
  if (!dna) return null;

  return (
    <div id="CreatorDNAProfileView" className="bg-[#0b0a0c]/40 border border-[#1b1a1c] rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#cca972]/[0.01] rounded-full blur-2xl" />

      <div className="flex justify-between items-center pb-3 border-b border-[#1b1a1c]">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#cca972]" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Active Creator DNA Vector Map</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Dynamic intelligence attributes mapping your core content algorithms.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Niche & Audience Card */}
        <div className="bg-[#141416]/50 border border-[#232225] p-4 rounded-xl flex flex-col justify-between">
          <div>
            <span className="block text-[9.5px] uppercase font-bold text-[#cca972] tracking-wider mb-2 font-sans">Core Segment Mapping</span>
            <div className="space-y-3">
              <div>
                <span className="block text-[8px] uppercase text-slate-500 font-sans">Identified Niche</span>
                <span className="text-xs text-white leading-relaxed font-sans">{dna.niche || "AI Custom Automations"}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase text-slate-500 font-sans">Primary Audience Target</span>
                <span className="text-xs text-slate-200 leading-relaxed font-sans">{dna.audience || "Busy entrepreneurs wanting fast tech solutions"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strongest Pillars */}
        <div className="bg-[#141416]/50 border border-[#232225] p-4 rounded-xl flex flex-col justify-between">
          <div>
            <span className="block text-[9.5px] uppercase font-bold text-[#cca972] tracking-wider mb-2 font-sans">Content Pillar Formats</span>
            <div className="space-y-3">
              <div>
                <span className="block text-[8px] uppercase text-slate-500 font-sans">Strongest Format Vectors</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(dna.strongestFormats || ["Bento builders walkthroughs"]).map((f, idx) => (
                    <span key={idx} className="text-[9px] bg-[#cca972]/5 text-[#cca972] border border-[#cca972]/15 px-2 py-0.5 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-[8px] uppercase text-slate-500 font-sans">Dominant Hook Style</span>
                <span className="text-xs text-slate-200 mt-1 block font-sans">{dna.strongestHooks?.[0] || "Financial impact outcomes alerts"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Preferences */}
        <div className="bg-[#141416]/50 border border-[#232225] p-4 rounded-xl flex flex-col justify-between">
          <div>
            <span className="block text-[9.5px] uppercase font-bold text-[#cca972] tracking-wider mb-2 font-sans">Timeline Preferences</span>
            <div className="space-y-3">
              <div>
                <span className="block text-[8px] uppercase text-slate-500 font-sans">Optimal Length Threshold</span>
                <span className="text-xs text-slate-200 font-mono font-bold mt-1 block">{dna.contentLengthPreference || "20-35 seconds"}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase text-slate-500 font-sans">Optimal CTA Formula</span>
                <span className="text-xs text-slate-200 mt-1 block font-sans">{dna.strongestCTAs?.[0] || "Comment auto-direct messages"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Recurring Patterns and focus area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="p-3 bg-[#111112] border border-[#232225] rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#cf7051] shrink-0 mt-0.5" />
          <div>
            <span className="block text-[8.5px] uppercase font-bold text-slate-500">Recurrent Content Friction</span>
            <p className="text-[11px] text-slate-300 leading-normal mt-0.5 font-sans">
              {dna.recurringPatterns?.[0] || "Slightly clinical conversational delivery lacking narrative micro loops."}
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#111112] border border-[#232225] rounded-xl flex items-start gap-2">
          <Sliders className="w-4 h-4 text-[#cca972] shrink-0 mt-0.5" />
          <div>
            <span className="block text-[8.5px] uppercase font-bold text-slate-500">Recommended Focus Vector</span>
            <p className="text-[11px] text-slate-300 leading-normal mt-0.5 font-sans">
              {dna.recommendedFocus || "Shift explanations back into active result payoffs early in timelines."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
