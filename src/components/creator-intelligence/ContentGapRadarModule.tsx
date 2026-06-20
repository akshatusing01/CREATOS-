import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, Layers, Compass, HelpCircle, CheckCircle } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface ContentGapData {
  missingContentTypes: string[];
  overusedContentTypes: string[];
  underusedThemes: string[];
  weakTopicClusters: string;
  formatImbalance: string;
  languageImbalance: string;
  emotionalImbalance: string;
  recommendedExperiments: string[];
}

const DEFAULT_GAPS: ContentGapData = {
  missingContentTypes: [
    "Hinglish speaking-head scripts backed by direct, real github commits proof screens",
    "Tier-3 engineering placement anxiety-relief content with transparent templates"
  ],
  overusedContentTypes: [
    "Dry theoretical roadmaps with generic graphics",
    "Passive informational explainers about widely known libraries"
  ],
  underusedThemes: [
    "Failed side-projects deconstruction (why my app got 0 views)",
    "Hinglish negotiation scripts for freelancing local bids"
  ],
  weakTopicClusters: "Your content has a weak hub on advanced system architecture. Focus is entirely saturated with basic CSS/HTML utility tricks.",
  formatImbalance: "90% of your current layouts are single screencast videos. You represent zero high-retention face-to-camera humanized videos or interactive whiteboard sketches.",
  languageImbalance: "Formal text-book English is over-utilized, rendering the delivery slightly clinical and academic. Switch to natural spoken bro-style student Hinglish.",
  emotionalImbalance: "Extremely educational but 0% motivation, excitement of creation, or urgent career stakes.",
  recommendedExperiments: [
    "Record a 40-second Hinglish script starting with direct failed dashboard proof screen, explaining the exact line error.",
    "Split visual overlay layout: Left side showing clean production code vs Right side showing slow legacy coding method."
  ]
};

export function ContentGapRadarModule() {
  const [data, setData] = useState<ContentGapData>(DEFAULT_GAPS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_gap_intel");
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
          moduleType: "content_gap",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile content gap indices.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_gap_intel", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/content_gaps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("Invalid schema returned by intelligence agent.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to scan content gaps.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="content-gap-radar-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Content Gap Radar</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Audit thematic imbalances in your scripts. Discover high-demand missing content classes before your competition does.
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
          <span>Audit Niche Gaps</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455" />
          <span>{error}</span>
        </div>
      )}

      {/* Core Split Cards: Missing vs Overused */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-950/[0.02] border border-emerald-950/25 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">missing high-demand content types</span>
          <div className="space-y-1.5 text-xs text-slate-200">
            {data.missingContentTypes?.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-emerald-400 font-bold font-mono shrink-0">·</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-rose-950/[0.02] border border-rose-950/25 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">overused/declining content types</span>
          <div className="space-y-1.5 text-xs text-slate-300">
            {data.overusedContentTypes?.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-rose-450 text-rose-400 font-bold font-mono shrink-0">·</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balanced diagnostic lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        <div className="p-3 bg-black/40 border border-slate-900 rounded-xl space-y-1">
          <span className="block text-[8.5px] uppercase text-slate-500 font-bold">format imbalances</span>
          <p className="text-slate-200 leading-normal">{data.formatImbalance}</p>
        </div>
        <div className="p-3 bg-black/40 border border-slate-900 rounded-xl space-y-1">
          <span className="block text-[8.5px] uppercase text-slate-500 font-bold">language & vocabulary gap</span>
          <p className="text-slate-200 leading-normal">{data.languageImbalance}</p>
        </div>
        <div className="p-3 bg-black/40 border border-slate-900 rounded-xl space-y-1">
          <span className="block text-[8.5px] uppercase text-slate-500 font-bold">emotional & stake balance</span>
          <p className="text-slate-200 leading-normal">{data.emotionalImbalance}</p>
        </div>
      </div>

      {/* Weak cluster details */}
      <div className="p-4 bg-slate-900/30 border border-[#232225] rounded-xl space-y-1.5">
        <span className="block text-[9px] uppercase font-bold text-[#cca972] tracking-wider">underdeveloped topic cluster alert</span>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.weakTopicClusters}</p>
      </div>

      {/* High leverage recommended experiments */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">recommended high-leverage experiments</h4>
        <div className="space-y-2">
          {data.recommendedExperiments?.map((exp, idx) => (
            <div key={idx} className="p-3 bg-black/50 border border-[#232225] rounded-xl flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200 font-sans leading-normal">{exp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
