import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, AlertTriangle, RefreshCw, ThumbsUp, HelpCircle, Pointer, Clock } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface CTAIntelData {
  bestCtaType: string;
  weakestCtaType: string;
  timingAnalysis: string;
  placementAnalysis: string;
  strengthByNiche: string;
  strengthByLanguage: string;
  strengthByPlatform: string;
  frictionNotes: string;
  recommendedStrategy: string;
}

const DEFAULT_CTA_DATA: CTAIntelData = {
  bestCtaType: "Save for Later Checklist / Comment keyword automated trigger flow",
  weakestCtaType: "In-video verbal 'follow me' pitching on final frame with standard layout",
  timingAnalysis: "Verify that CTA is introduced at the 80% mark of the video, NOT at the very end after the video climax. Placing a CTA after the climax leads to an instant 78% swipe-away rate.",
  placementAnalysis: "Overlay the prompt 'Comment WEBHOOK' cleanly centered, while demonstrating the active app screen. Never use static empty color frames.",
  strengthByNiche: "Save CTA is very high for finance/student resource planners. Verbal comments trigger highest on controversy or templates.",
  strengthByLanguage: "Clear localized commands: 'Abhi ke abhi is video ko Save karlo' has a 40% higher action rate compared to formal instructions.",
  strengthByPlatform: "Instagram is keyword trigger dominated. YouTube Shorts relies heavily on pinned comments pointing to a related link.",
  frictionNotes: "Avoid asking viewers to: Follow, Save, Tag a friend, and click link-in-bio all in one 30-second video. This creates extreme decision anxiety. Restrict to exactly ONE ask.",
  recommendedStrategy: "Stick to Comment keyword triggers for assets delivery, and Save CTAs for step-by-step guides. Never ask to follow verbally."
};

export function CtaIntelligenceModule() {
  const [data, setData] = useState<CTAIntelData>(DEFAULT_CTA_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_cta_intel");
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
      const niche = localStorage.getItem("creatoros_profile_niche") || "AI Productivity & Student coding tutorials";
      const response = await fetch("/api/creator-intelligence/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleType: "cta_intelligence",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process CTA Intelligence vectors.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_cta_intel", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/cta_intelligence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("Invalid response received from strategist engine.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process generative request.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="cta-intelligence-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Pointer className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">CTA Intelligence Engine</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Optimize conversion and action ratios. Stop losing viewer attention on slow-pitch final-screen calls-to-action.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider bg-[#cca972] text-[#070608] px-4 py-2.5 rounded-xl border border-white/10 hover:bg-[#ebd0a3] transition cursor-pointer self-start md:self-center disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Brain className="w-3.5 h-3.5" />
          )}
          <span>Evaluate CTA Vectors</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-450" />
          <span>{error}</span>
        </div>
      )}

      {/* Split Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-950/[0.03] border border-emerald-950/20 rounded-xl space-y-2">
          <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
            <ThumbsUp className="w-3 h-3" /> Highest Conversion CTA
          </span>
          <p className="text-xs text-white font-medium italic">"{data.bestCtaType}"</p>
        </div>

        <div className="p-4 bg-rose-950/[0.03] border border-rose-950/20 rounded-xl space-y-2">
          <span className="text-[9px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Lowest Performing CTA
          </span>
          <p className="text-xs text-slate-400 font-medium italic">"{data.weakestCtaType}"</p>
        </div>
      </div>

      {/* Timing and Placement Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#cca972]" />
            <span className="text-[10px] uppercase font-bold text-[#cca972] tracking-wider font-sans">CTA Placement Timing</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">{data.timingAnalysis}</p>
        </div>

        <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5">
            <Pointer className="w-3.5 h-3.5 text-[#cca972]" />
            <span className="text-[10px] uppercase font-bold text-[#cca972] tracking-wider font-sans">Visual & Placement Overlay style</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">{data.placementAnalysis}</p>
        </div>
      </div>

      {/* Niche Alignment Details */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">CTA strength parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-black/30 rounded-xl border border-slate-900/60">
            <span className="block text-[8.5px] uppercase text-slate-500 font-bold">niche specificity</span>
            <span className="block text-[11px] text-slate-200 mt-1 leading-normal">{data.strengthByNiche}</span>
          </div>
          <div className="p-3 bg-black/30 rounded-xl border border-slate-900/60">
            <span className="block text-[8.5px] uppercase text-slate-500 font-bold">bilingual friction score</span>
            <span className="block text-[11px] text-slate-200 mt-1 leading-normal">{data.strengthByLanguage}</span>
          </div>
          <div className="p-3 bg-black/30 rounded-xl border border-slate-900/60">
            <span className="block text-[8.5px] uppercase text-slate-500 font-bold">platform optimizations</span>
            <span className="block text-[11px] text-slate-200 mt-1 leading-normal">{data.strengthByPlatform}</span>
          </div>
        </div>
      </div>

      {/* Friction warnings */}
      <div className="p-4 bg-rose-950/[0.04] border border-rose-950/30 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="block text-[10px] uppercase font-bold text-rose-455 text-rose-400 tracking-wider">CTA Overcrowding warning (friction points)</span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.frictionNotes}</p>
        </div>
      </div>

      {/* Recommended Strategy Playbook */}
      <div className="p-4 bg-[#cca972]/[0.02] border border-[#cca972]/15 rounded-xl space-y-2">
        <span className="block text-[10px] uppercase font-bold text-[#cca972] tracking-wider">recommended active-action playbook</span>
        <p className="text-xs text-white leading-relaxed font-sans font-medium">{data.recommendedStrategy}</p>
      </div>
    </div>
  );
}
