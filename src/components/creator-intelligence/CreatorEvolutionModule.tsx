import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw, TrendingUp, Sparkles, AlertTriangle, ArrowRight, BookOpen, ThumbsUp } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface ScoreEvolution {
  past: number;
  current: number;
  allTimeAvg: number;
}

interface EvolutionData {
  evolutionSummary: string;
  whatImproved: string;
  whatDeclined: string;
  whatStayedStable: string;
  patternsEmerged: string;
  contentShiftHappened: string;
  skillBecomingStronger: string;
  weaknessNotFixed: string;
  whatToEvolveNext: string;
  hookEvolution: ScoreEvolution;
  retentionEvolution: ScoreEvolution;
  ctaEvolution: ScoreEvolution;
  clarityEvolution: ScoreEvolution;
  audienceFitEvolution: ScoreEvolution;
  packagingEvolution: ScoreEvolution;
  proofStrengthEvolution: ScoreEvolution;
  storytellingEvolution: ScoreEvolution;
}

const DEFAULT_EVOLUTION: EvolutionData = {
  evolutionSummary: "Transitioned remarkably from dry theoretical Hinglish tutorials into high-retention proof-driven career guides. Early 3s retention drop-off has resolved, but explanation visual velocity remains slightly stiff.",
  whatImproved: "Hook rate improved from 45% (past) to 82% (current) due to instant visible screen results and high-shock Hinglish placements data.",
  whatDeclined: "Saves count on casual code clips slightly dropped, as hooks are hyper-optimized but backend depth was shortened.",
  whatStayedStable: "Unfiltered studio background setup and transparent code editor workspace representation.",
  patternsEmerged: "Hinglish warnings starting with 'Bhai ye galti mat karna...' drive 3.5x higher comments compared to direct tutorials.",
  contentShiftHappened: "Evolved from slow English textbook slideshow summaries to action-first live troubleshooting split-screens.",
  skillBecomingStronger: "Strategic Hook placement speed and native campus-slang voiceover delivery.",
  weaknessNotFixed: "Failing to simplify advanced backend database/cache topics within the central 15 seconds explanation flow.",
  whatToEvolveNext: "Implement structured 3-part micro-series campaigns with continuous numbered story hooks to lock repeat-view loyalty.",
  hookEvolution: { past: 54, current: 86, allTimeAvg: 71 },
  retentionEvolution: { past: 48, current: 74, allTimeAvg: 61 },
  ctaEvolution: { past: 60, current: 81, allTimeAvg: 72 },
  clarityEvolution: { past: 72, current: 84, allTimeAvg: 78 },
  audienceFitEvolution: { past: 65, current: 90, allTimeAvg: 79 },
  packagingEvolution: { past: 55, current: 82, allTimeAvg: 69 },
  proofStrengthEvolution: { past: 40, current: 88, allTimeAvg: 65 },
  storytellingEvolution: { past: 50, current: 78, allTimeAvg: 66 },
};

export function CreatorEvolutionModule() {
  const [data, setData] = useState<EvolutionData>(DEFAULT_EVOLUTION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_evolution_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // use default
      }
    }
  }, []);

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    soundManager.playSparkle();

    try {
      const niche = localStorage.getItem("creatoros_profile_niche") || "AI Productivity & Student coding tutorials";
      const response = await fetch("/api/creator-intelligence/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleType: "creator_evolution",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile Creator Evolution Report.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_evolution_data", JSON.stringify(result.data));
        soundManager.playSuccess();

        // Push to database history
        try {
          fetch("/api/creator-intelligence/profile/creator_evolution", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase save delayed");
        }
      } else {
        throw new Error("No data returned by strategist agent.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process generative request.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  const metrics: { key: keyof EvolutionData; label: string }[] = [
    { key: "hookEvolution", label: "Hook Performance" },
    { key: "retentionEvolution", label: "Retention Rate" },
    { key: "ctaEvolution", label: "CTA Conversion" },
    { key: "clarityEvolution", label: "Flow Clarity" },
    { key: "audienceFitEvolution", label: "Audience Fit" },
    { key: "packagingEvolution", label: "Packaging/Thumbnail" },
    { key: "proofStrengthEvolution", label: "Proof Strength" },
    { key: "storytellingEvolution", label: "Storytelling Depth" },
  ];

  return (
    <div id="creator-evolution-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.012] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Creator Evolution Engine</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Compare early vs recent phases to map how your niche delivery, hook performance, and core skills have evolved.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider bg-[#cca972] text-[#070608] px-4 py-2.5 rounded-xl border border-white/10 hover:bg-[#ebd0a3] transition cursor-pointer self-start md:self-center disabled:opacity-50 font-mono"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <TrendingUp className="w-3.5 h-3.5" />
          )}
          <span>Compare Evolution Trajectory</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl">
          <span>{error}</span>
        </div>
      )}

      {/* Evolution Summary Intro Card */}
      <div className="p-4 bg-[#cca972]/[0.02] border border-[#cca972]/15 rounded-xl space-y-1.5">
        <span className="text-[9px] uppercase font-black tracking-widest text-[#cca972] block">Current Strategic Diagnosis</span>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.evolutionSummary}</p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Metric Evolution Timetable */}
        <div className="space-y-4 border border-[#1c1b1e] p-5 rounded-xl bg-black/30">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-[#1c1b1e] pb-1.5 flex items-center justify-between">
            <span>Core Score Evolution</span>
            <span className="text-[9px] text-slate-500 lowercase">past vs current vs avg</span>
          </h4>
          <div className="space-y-4">
            {metrics.map(({ key, label }, idx) => {
              const val = data[key] as ScoreEvolution;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">{label}</span>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-slate-500">Past: {val.past}%</span>
                      <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                      <span className="text-emerald-400 font-bold">Current: {val.current}%</span>
                      <span className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded text-[9px]">Avg: {val.allTimeAvg}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-black/60 rounded-full overflow-hidden flex border border-[#1b1a1c]">
                    <div className="bg-slate-700 h-full" style={{ width: `${val.past}%` }} />
                    <div className="bg-[#cca972] h-full" style={{ width: `${Math.max(0, val.current - val.past)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Evolution Observations */}
        <div className="grid grid-cols-1 gap-4">
          
          <div className="p-4 bg-emerald-950/[0.02] border border-emerald-950/25 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] uppercase font-black text-emerald-400">What Evolved Well</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{data.whatImproved}</p>
          </div>

          <div className="p-4 bg-rose-950/[0.02] border border-rose-950/25 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] uppercase font-black text-rose-400">What Regressed or Decreased</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{data.whatDeclined}</p>
          </div>

          <div className="p-4 bg-slate-900/[0.05] border border-slate-900 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] uppercase font-black text-slate-400">Stable Architecture Guarded</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{data.whatStayedStable}</p>
          </div>
        </div>
      </div>

      {/* Nitty-Gritty Details Segment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-black/40 border border-[#1c1b1e] rounded-xl space-y-2">
          <span className="text-[9px] uppercase font-bold text-[#cca972]">Language & Delivery Pivot</span>
          <span className="block text-xs text-slate-200 mt-1 font-semibold">{data.contentShiftHappened}</span>
        </div>

        <div className="p-4 bg-black/40 border border-[#1c1b1e] rounded-xl space-y-2">
          <span className="text-[9px] uppercase font-bold text-[#cca972]">Emerging Custom Patterns</span>
          <span className="block text-xs text-slate-200 mt-1 font-semibold">{data.patternsEmerged}</span>
        </div>
      </div>

      {/* Skill evolution highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#1c1b1e] pt-5">
        <div className="p-3.5 bg-[#0e1713]/40 border border-emerald-950/40 rounded-xl space-y-1">
          <span className="text-[8px] font-black text-emerald-450 uppercase text-emerald-400">Dominant Strong Skill</span>
          <p className="text-xs text-white font-medium">{data.skillBecomingStronger}</p>
        </div>

        <div className="p-3.5 bg-[#1a1012]/40 border border-rose-950/40 rounded-xl space-y-1">
          <span className="text-[8px] font-black text-rose-450 uppercase text-rose-400">Continuous Bottleneck</span>
          <p className="text-xs text-white font-medium">{data.weaknessNotFixed}</p>
        </div>

        <div className="p-3.5 bg-black/50 border border-slate-900 rounded-xl space-y-1">
          <span className="text-[8px] font-black text-[#cca972] uppercase">Deliberate Next Pivot</span>
          <p className="text-xs text-white font-medium">{data.whatToEvolveNext}</p>
        </div>
      </div>
    </div>
  );
}
