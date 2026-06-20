import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, BarChart3, TrendingUp, HelpCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface CategoryMetric {
  name: string;
  change: number; // e.g. +15, -8
  current: number;
}

interface ComparisonData {
  earliestAnalyzedScriptsCount: number;
  latestAnalyzedScriptsCount: number;
  thisMonthAverage: number;
  lastMonthAverage: number;
  specificMetricsTrends: CategoryMetric[];
  experimentsRan: string[];
  highestRoiActionFromPast: string;
}

const DEFAULT_COMPARISON: ComparisonData = {
  earliestAnalyzedScriptsCount: 3,
  latestAnalyzedScriptsCount: 15,
  thisMonthAverage: 82,
  lastMonthAverage: 69,
  specificMetricsTrends: [
    { name: "Hook Quality rating", change: 16, current: 88 },
    { name: "Retention pacing", change: 12, current: 78 },
    { name: "Flow / Clarity", change: 5, current: 84 },
    { name: "CTA Conversion Rate", change: -8, current: 62 }
  ],
  experimentsRan: [
    "Test automated DM comments delivery with custom zip setup (Outcome: Huge +120% Leads lift)",
    "Split-screen manual layout testing vs simple slides (Outcome: High audience retention on second 3-10)",
    "Verbal final-frame follow pitches (Outcome: Slow swiped ratios, swiped out in under 2 seconds)"
  ],
  highestRoiActionFromPast: "Shifting hook verbal tone from passive class notes template to bold consequence statement ('Bhai ye galti rank duba degi...'): Led to a 4.2x view lift across 4 Reels."
};

export function ComparisonHistoryModule() {
  const [data, setData] = useState<ComparisonData>(DEFAULT_COMPARISON);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_comparison_intel");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    }
  }, []);

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    soundManager.playSparkle();

    try {
      // Simulate/fetch comparisons
      setTimeout(() => {
        setData(DEFAULT_COMPARISON);
        localStorage.setItem("creatoros_comparison_intel", JSON.stringify(DEFAULT_COMPARISON));
        soundManager.playSuccess();
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError("Failed to compile comparison logs.");
      soundManager.playError();
      setLoading(false);
    }
  };

  return (
    <div id="comparison-history-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Performance Comparison Vault</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Compare current tactical metrics side-by-side against early historical references. Inspect gains and drops across specific channels.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider bg-white text-[#070608] px-4 py-2.5 rounded-xl border border-white/10 hover:bg-slate-200 transition cursor-pointer self-start md:self-center disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Brain className="w-3.5 h-3.5" />
          )}
          <span>Recalculate Vault</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455" />
          <span>{error}</span>
        </div>
      )}

      {/* Numerical Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-black/45 border border-slate-900 rounded-xl space-y-1">
          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">earliest vs latest reports logged</span>
          <div className="text-xl font-mono font-bold text-white flex items-center gap-2">
            <span>{data.earliestAnalyzedScriptsCount}</span>
            <span className="text-slate-600 font-sans font-light">to</span>
            <span className="text-[#cca972]">{data.latestAnalyzedScriptsCount} analyzed</span>
          </div>
        </div>

        <div className="p-4 bg-black/45 border border-slate-900 rounded-xl space-y-1">
          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">last month average overall</span>
          <div className="text-xl font-mono font-bold text-slate-400">{data.lastMonthAverage}%</div>
        </div>

        <div className="p-4 bg-black/45 border border-[#cca972]/20 rounded-xl space-y-1 relative overflow-hidden shadow-[0_0_15px_-3px_rgba(204,169,114,0.05)]">
          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">this month average overall</span>
          <div className="text-xl font-mono font-bold text-emerald-400 flex items-center gap-1.5">
            <span>{data.thisMonthAverage}%</span>
            <span className="text-[10px] bg-emerald-950/45 text-emerald-455 px-2 py-0.5 rounded-full border border-emerald-950/20 font-bold">
              +{data.thisMonthAverage - data.lastMonthAverage}% gains
            </span>
          </div>
        </div>
      </div>

      {/* Specific Metrics Gains or Losses */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">category metrics index trajectory</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.specificMetricsTrends?.map((metric, idx) => {
            const isGain = metric.change >= 0;
            return (
              <div key={idx} className="p-3.5 bg-black/50 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium">{metric.name}</span>
                  <div className="h-1.5 w-32 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
                    <div className="h-full bg-gradient-to-r from-[#cca972]/40 to-[#cca972]" style={{ width: `${metric.current}%` }} />
                  </div>
                </div>

                <div className="text-right flex items-center gap-1.5">
                  <span className="font-mono font-bold text-white text-sm">{metric.current}%</span>
                  <div className={`p-1 rounded font-mono text-[10px] font-bold flex items-center ${
                    isGain ? "bg-emerald-950/40 text-emerald-455 text-emerald-400" : "bg-rose-950/45 text-rose-455 text-rose-400"
                  }`}>
                    {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{isGain ? "+" : ""}{metric.change}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Experiments outcomes logs */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">experiments & strategic outcomes logged</h4>
        <div className="space-y-2 text-xs text-slate-300 font-sans">
          {data.experimentsRan?.map((exp, idx) => (
            <div key={idx} className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl leading-relaxed">
              {exp}
            </div>
          ))}
        </div>
      </div>

      {/* Historic ROI Action remind */}
      <div className="p-5 bg-[#cca972]/[0.025] border border-[#cca972]/20 rounded-xl space-y-2">
        <span className="block text-[10px] uppercase font-extrabold text-[#cca972] tracking-wider">highest ROI past strategic lever (repeat this)</span>
        <p className="text-xs text-white leading-relaxed font-sans font-medium">"{data.highestRoiActionFromPast}"</p>
      </div>
    </div>
  );
}
