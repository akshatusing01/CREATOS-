import React from "react";
import { Compass, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { IntelStructureBlock } from "../../types";

interface ScriptAnatomyProps {
  structure: IntelStructureBlock[];
}

export const ScriptAnatomy: React.FC<ScriptAnatomyProps> = ({ structure = [] }) => {
  // Compute average structure strength score
  const validBlocks = structure.filter(b => b.exists);
  const averageIntegrity = validBlocks.length
    ? Math.round(validBlocks.reduce((acc, curr) => acc + (curr.strength || 0), 0) / validBlocks.length)
    : 0;

  const getStrengthBadge = (strength: number) => {
    if (strength >= 80) return "bg-emerald-950/20 text-emerald-400 border border-emerald-900/35";
    if (strength >= 60) return "bg-amber-950/20 text-amber-500 border border-amber-900/35";
    return "bg-rose-950/25 text-rose-450 text-rose-400 border border-rose-900/35";
  };

  return (
    <div id="ScriptBreakdownSection" className="bg-[#0b0a0c]/40 border border-[#1b1a1c] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-[#1b1a1c]">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-[#cf7051]" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Script Anatomy Component Map</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">We check for the logical presence of classical narrative retention components and triggers.</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-sans hidden sm:block">
          Avg integrity: <span className="text-white font-bold font-mono text-xs">{averageIntegrity}%</span>
        </span>
      </div>

      <div className="space-y-4">
        {structure.map((item, idx) => (
          <div
            id="ScriptBreakdownCard"
            key={idx}
            className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition duration-300 relative ${
              item.exists
                ? "bg-[#0b0a0c]/60 border-[#1f1e21] hover:border-[#cca972]/20"
                : "bg-rose-950/[0.02] border-rose-950/20 hover:border-rose-500/20"
            }`}
          >
            {/* Presence indicator and naming */}
            <div className="flex items-start gap-3 lg:max-w-[280px] w-full">
              <div className={`mt-0.5 rounded-full p-1.5 ${item.exists ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/40" : "bg-rose-950/20 text-rose-400 border border-rose-900/40"}`}>
                {item.exists ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
              </div>
              
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-white font-display">
                  {item.name}
                </span>
                <span className="block text-[10.5px] text-slate-400 leading-normal mt-1 font-sans">
                  {item.impact || (item.exists ? "Integrated into the active narrative line." : "Completely omitted from sequence.")}
                </span>
              </div>
            </div>

            {/* Micro details panel */}
            <div className="flex-1 lg:px-4">
              {item.exists ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[8.5px] uppercase font-bold text-[#cca972]">Observed Friction</span>
                    <span className="block text-[10.5px] text-slate-400 font-sans leading-relaxed">{item.weakness || "No significant structural friction observed."}</span>
                  </div>
                  <div>
                    <span className="block text-[8.5px] uppercase font-bold text-[#cca972]">Correction Prescription</span>
                    <span className="block text-[10.5px] text-slate-300 font-sans leading-relaxed">{item.fix || "Maintain active pacing controls."}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-450 text-rose-400/80">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10.5px] italic font-sans leading-relaxed">
                    CRITICAL DEFICIT: Missing {item.name}. Refactor using: "{item.fix || "Integrate direct outcomes."}"
                  </span>
                </div>
              )}
            </div>

            {/* Score item */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <div className="text-right">
                <span className="block text-[8px] uppercase font-bold text-slate-500 leading-none mb-1">Integrity Score</span>
                <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded ${getStrengthBadge(item.strength || 0)}`}>
                  {item.exists ? `${item.strength}%` : "Omitted / 0%"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {structure.length === 0 && (
          <div className="p-8 text-center text-slate-500 italic text-xs font-sans">
            No anatomic structures available for active report mode.
          </div>
        )}
      </div>
    </div>
  );
};
