import React from "react";
import { CheckCircle2, XCircle, RefreshCw, Flame, Lightbulb, AlertOctagon } from "lucide-react";
import { IntelStrategyResponse } from "../../types";

interface StrategyPlaybookProps {
  strategy: IntelStrategyResponse;
}

export const StrategyPlaybook: React.FC<StrategyPlaybookProps> = ({ strategy }) => {
  // Safe defaults if arrays or properties are empty
  const keepDoing = strategy.keepDoing || [];
  const stopDoing = strategy.stopDoing || [];
  const improveFirst = strategy.improveFirst || [];
  const testNext = strategy.testNext || [];

  return (
    <div id="StrategyPlaybook" className="bg-[#0b0a0c]/40 border border-[#1b1a1c] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-[#1b1a1c]">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Executive Creator Strategy Playbook</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">High-impact execution vectors synthesized specifically for this content profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Keep Doing - Leverage points */}
        <div className="p-4 rounded-xl border border-[#232225] bg-emerald-950/[0.02] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-sans">Double Down (Keep)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {keepDoing.map((item, idx) => (
                <li key={idx} className="flex gap-1.5 items-start leading-relaxed font-sans">
                  <span className="text-emerald-400 mt-1 select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {keepDoing.length === 0 && <li className="text-slate-500 italic">No instructions logged</li>}
            </ul>
          </div>
        </div>

        {/* Stop Doing - Friction reduction */}
        <div className="p-4 rounded-xl border border-[#232225] bg-rose-950/[0.01] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-rose-450 text-rose-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-450 text-rose-400 font-sans">Eliminate (Stop)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {stopDoing.map((item, idx) => (
                <li key={idx} className="flex gap-1.5 items-start leading-relaxed font-sans">
                  <span className="text-rose-400 mt-1 select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {stopDoing.length === 0 && <li className="text-slate-500 italic">No instructions logged</li>}
            </ul>
          </div>
        </div>

        {/* Improve First - Priority optimizations */}
        <div className="p-4 rounded-xl border border-[#232225] bg-amber-950/[0.02] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-sans">Amplify (Improve)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {improveFirst.map((item, idx) => (
                <li key={idx} className="flex gap-1.5 items-start leading-relaxed font-sans">
                  <span className="text-amber-400 mt-1 select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {improveFirst.length === 0 && <li className="text-slate-500 italic">No instructions logged</li>}
            </ul>
          </div>
        </div>

        {/* Test Next - Innovate vectors */}
        <div className="p-4 rounded-xl border border-[#232225] bg-sky-950/[0.02] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-sky-450 text-sky-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-450 text-sky-400 font-sans">Sandbox (Test Next)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {testNext.map((item, idx) => (
                <li key={idx} className="flex gap-1.5 items-start leading-relaxed font-sans">
                  <span className="text-sky-400 mt-1 select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {testNext.length === 0 && <li className="text-slate-500 italic">No instructions logged</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Primary bottlenecks overlay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#1b1a1c]">
        <div className="flex gap-3 bg-rose-950/[0.04] border border-rose-950/40 p-4 rounded-xl">
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="block text-[9.5px] uppercase font-bold tracking-wider text-rose-400 font-sans">Primary Strategic Bottleneck</span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{strategy.biggestBottleneck || "Delayed curiosity expansion in the opening sequences."}</p>
          </div>
        </div>

        <div className="flex gap-3 bg-[#cca972]/[0.02] border border-[#cca972]/15 p-4 rounded-xl">
          <Flame className="w-5 h-5 text-[#cca972] shrink-0" />
          <div>
            <span className="block text-[9.5px] uppercase font-bold tracking-wider text-[#cca972] font-sans">Highest Leverage Modification</span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{strategy.highestLeverageFix || "Immediately anchor benefits using high status outcome proofs."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
