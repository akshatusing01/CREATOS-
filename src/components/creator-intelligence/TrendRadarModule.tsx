import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, BarChart2, Zap, ArrowUpRight } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface Trend {
  name: string;
  nicheFit: string;
  audienceFit: string;
  opportunityScore: number;
  competitionScore: number;
  saturationScore: number;
  confidenceScore: number;
  contentGap: string;
  hookAngle: string;
  recommendedFormat: string;
  suggestedCta: string;
  recommendedLanguageStyle: string;
}

interface TrendRadarData {
  trends: Trend[];
}

const DEFAULT_TRENDS: TrendRadarData = {
  trends: [
    {
      name: "AI Placements Hackathon in Indian Engineering Colleges",
      nicheFit: "High (Perfect for student coders)",
      audienceFit: "Excellent (Job aspirers & tech geeks)",
      opportunityScore: 94,
      competitionScore: 40,
      saturationScore: 28,
      confidenceScore: 90,
      contentGap: "Most creators talk about placements, but barely anyone does a step-by-step on automating resume bullet-points using Gemini Flash APIs on live video.",
      hookAngle: "Placements optimization using local API keys",
      recommendedFormat: "40s high-speed screencast layout with Hinglish sound overlays",
      suggestedCta: "Comment PROMPTS to get the resume system script",
      recommendedLanguageStyle: "Casual, roommate Hinglish jargon ('Github check kar', 'deploy in 1 sec')"
    },
    {
      name: "Arbitrage Freelancing with Indian SMBs",
      nicheFit: "Moderate-High",
      audienceFit: "High (Side-income hunters)",
      opportunityScore: 85,
      competitionScore: 55,
      saturationScore: 35,
      confidenceScore: 82,
      contentGap: "Creators genericize freelancing on Upwork. There is a huge gap for showing real client chats and active quotation formats for Indian local retail shops.",
      hookAngle: "Local freelance pitch blueprints",
      recommendedFormat: "Divided screens comparing bad pitch email vs real-world chat",
      suggestedCta: "Save this reel to copy my local client contracts template",
      recommendedLanguageStyle: "Encouraging, authentic sibling guide"
    }
  ]
};

export function TrendRadarModule() {
  const [data, setData] = useState<TrendRadarData>(DEFAULT_TRENDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_trend_intel");
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
          moduleType: "trend_radar",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to parse emerging trend indices.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_trend_intel", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/trend_radars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("No trend indicators returned by AI strategist.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch latest trends.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="trend-radar-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Indian Trend Radar</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Identify hot, emerging local trends, calculate saturation scores, and target massive open content gaps.
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
          <span>Scan Latest Trends</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455" />
          <span>{error}</span>
        </div>
      )}

      {/* Dynamic trends list of cards */}
      <div className="space-y-6">
        {data.trends?.map((trend, trendIdx) => (
          <div key={trendIdx} className="p-5 bg-black/45 border border-slate-900 rounded-xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#cca972]/[0.01] to-transparent pointer-events-none" />
            
            {/* Title & Score stats */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-900/60 pb-3">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-[#cca972] tracking-widest block">emerging trend opportunity</span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#cca972] transition duration-200 flex items-center gap-1.5 leading-tight">
                  {trend.name}
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#cca972] opacity-70" />
                </h4>
              </div>

              {/* High Octane Scores Grid */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">opportunity</span>
                  <span className="block font-mono text-xs font-bold text-[#cca972]">{trend.opportunityScore}/100</span>
                </div>
                <div className="text-center border-l border-slate-900 pl-3">
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">competition</span>
                  <span className="block font-mono text-xs font-semibold text-slate-405 text-slate-400">{trend.competitionScore}/100</span>
                </div>
                <div className="text-center border-l border-slate-900 pl-3">
                  <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">saturation</span>
                  <span className="block font-mono text-xs font-semibold text-rose-405 text-rose-400">{trend.saturationScore}/100</span>
                </div>
              </div>
            </div>

            {/* Alignments and content gaps details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-2">
                <div>
                  <span className="block text-[8.5px] uppercase text-slate-500 font-bold">Niche & Audience Fit</span>
                  <span className="block font-medium text-slate-200 mt-0.5">{trend.nicheFit} — {trend.audienceFit}</span>
                </div>
                <div>
                  <span className="block text-[8.5px] uppercase text-slate-500 font-bold">Content Gap (Differentiator)</span>
                  <p className="text-[#cca972] leading-relaxed mt-0.5 font-medium">{trend.contentGap}</p>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-[#0c0b0e] rounded-lg border border-slate-900">
                <span className="block text-[8px] uppercase text-[#cca972] font-extrabold tracking-widest mb-1.5">execution strategy blueprint</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                  <div>
                    <span className="text-slate-500 font-bold block text-[8px] uppercase">Hook Angle</span>
                    <span className="text-slate-200 font-medium block mt-0.5">{trend.hookAngle}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[8px] uppercase">Recommended Format</span>
                    <span className="text-slate-200 font-medium block mt-0.5">{trend.recommendedFormat}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[8px] uppercase">Call-To-Action</span>
                    <span className="text-slate-200 font-medium block mt-0.5">{trend.suggestedCta}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[8px] uppercase">Language Tone</span>
                    <span className="text-slate-200 font-medium block mt-0.5">{trend.recommendedLanguageStyle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
