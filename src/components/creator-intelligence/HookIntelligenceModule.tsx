import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, Layers, ThumbsUp, Zap } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface HookRank {
  type: string;
  rating: number; // 0-100
  trend: "up" | "down" | "stable";
}

interface HookRewrite {
  original: string;
  rewrite: string;
}

interface HookIntelData {
  bestHookTypes: string[];
  weakHookTypes: string[];
  performanceRanking: HookRank[];
  styleByNiche: string;
  styleByLanguage: string;
  styleByPlatform: string;
  hookGapNotes: string;
  recommendedNext: string[];
  rewriteSuggestions: HookRewrite[];
}

const DEFAULT_HOOK_DATA: HookIntelData = {
  bestHookTypes: ["proof hooks", "mistake hooks", "relatability hooks"],
  weakHookTypes: ["result hooks", "fear hooks", "standard introduction"],
  performanceRanking: [
    { type: "Proof-first Hook (0-1.5s visual proof)", rating: 95, trend: "up" },
    { type: "Mistake/Warning Alert ('College placements are broken')", rating: 88, trend: "up" },
    { type: "Common Relatability ('Bhai, agar tum tier-3 engineering mein ho...')", rating: 85, trend: "stable" },
    { type: "Curiosity Loops ('The secret github repo no senior tells you')", rating: 78, trend: "stable" },
    { type: "Standard Classroom Explanation style", rating: 30, trend: "down" }
  ],
  styleByNiche: "Pragmatic, high-utility automation & student code walkthroughs",
  styleByLanguage: "Conversational, natural student Hinglish (Hindi text in English script)",
  styleByPlatform: "Instagram Reels with text overlay centered directly on viewport with vibrant colors",
  hookGapNotes: "You are starting your voiceover too late (first 1.2 seconds are silent or slow-pitch). This triggers a 55% dropoff rate at second 4. Shift to proof fast.",
  recommendedNext: [
    "How I got 1.2 Lakh organic views on my side-project in 2 days (Proof)",
    "Bhai, ye 3 Chrome Extensions placements mein tumhara 100+ hours save karengi (Mistake-utility)"
  ],
  rewriteSuggestions: [
    { original: "Today in this video we will discuss how to optimize a React bundle", rewrite: "Bhai, standard React bundles are extremely heavy. Use this 3-line build config to cut loading speed by 70%!" },
    { original: "Here are some tips for interviewers during placements", rewrite: "Interviewer se conversation end karne se pehle ye 3 precise questions pooch lo, offer secure!" }
  ]
};

export function HookIntelligenceModule() {
  const [data, setData] = useState<HookIntelData>(DEFAULT_HOOK_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt local load
    const saved = localStorage.getItem("creatoros_hook_intel");
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
          moduleType: "hook_intelligence",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile Hook Intelligence data.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_hook_intel", JSON.stringify(result.data));
        soundManager.playSuccess();
        
        // Save to Supabase custom database too
        try {
          fetch("/api/creator-intelligence/profile/hook_intelligence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("No data returned by developer strategist agent.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process generative request.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="hook-intelligence-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Hook Intelligence Engine</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Learn which hook families perform best for your audience. Avoid generic setups to master 3s retention.
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
          <span>Synthesize Hook DNA</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-450" />
          <span>{error}</span>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Hook Rating */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">hook family performance rating</h4>
          <div className="space-y-3">
            {data.performanceRanking.map((rank, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-300">{rank.type}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[#cca972]">{rank.rating}%</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                      rank.trend === "up" ? "bg-emerald-950/40 text-emerald-455 text-emerald-400" :
                      rank.trend === "down" ? "bg-rose-950/40 text-rose-455 text-rose-400" : "bg-slate-900 text-slate-450 text-slate-400"
                    }`}>
                      {rank.trend}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-black/60 rounded-full overflow-hidden border border-[#1b1a1c]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rank.rating}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#cca972]/40 to-[#cca972]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Niche Alignment Details */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">strategic style guidelines</h4>
          <div className="grid grid-cols-1 gap-3.5">
            <div className="p-3 bg-black/40 rounded-xl border border-slate-900">
              <span className="block text-[9px] uppercase text-slate-500 font-bold">niche delivery key</span>
              <span className="block text-xs text-white font-medium mt-1">{data.styleByNiche}</span>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-slate-900">
              <span className="block text-[9px] uppercase text-slate-500 font-bold">recommended language structure</span>
              <span className="block text-xs text-white font-medium mt-1">{data.styleByLanguage}</span>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-slate-900">
              <span className="block text-[9px] uppercase text-slate-500 font-bold">platform visual aesthetics</span>
              <span className="block text-xs text-white font-medium mt-1">{data.styleByPlatform}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Underused Hook warning block */}
      <div className="p-4 bg-[#cca972]/[0.03] border border-[#cca972]/15 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#cca972] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="block text-[10px] uppercase font-bold text-[#cca972] tracking-wider">Hook retention bottleneck alert</span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.hookGapNotes}</p>
        </div>
      </div>

      {/* Best vs Weak Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-950/[0.03] border border-emerald-950/25 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-450 text-emerald-400" />
            <span className="text-[10px] uppercase font-extrabold text-emerald-450 text-emerald-400 font-sans">Best performing family groups</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.bestHookTypes.map((t, idx) => (
              <span key={idx} className="text-[10px] font-semibold text-slate-200 bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-950/20 capitalize">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-rose-950/[0.03] border border-rose-950/25 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-450 text-rose-400" />
            <span className="text-[10px] uppercase font-extrabold text-rose-450 text-rose-400 font-sans">Weak/underperforming groups</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.weakHookTypes.map((t, idx) => (
              <span key={idx} className="text-[10px] font-semibold text-slate-200 bg-rose-950/30 px-2.5 py-1 rounded-full border border-rose-950/20 capitalize">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Hook Playbook Examples */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">recommended upcoming angles to test</h4>
        <div className="space-y-2">
          {data.recommendedNext.map((rec, idx) => (
            <div key={idx} className="p-3 bg-[#0d0d10] border border-[#232225] rounded-xl flex items-center gap-2.5">
              <Zap className="w-3.5 h-3.5 text-[#cca972] shrink-0" />
              <span className="text-xs text-slate-200 font-medium">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewrite suggestions panel */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1">hook script transformation blueprints</h4>
        <div className="grid grid-cols-1 gap-3">
          {data.rewriteSuggestions.map((rew, idx) => (
            <div key={idx} className="p-4 bg-black/45 border border-slate-900 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#cca972]/10 text-[#cca972] text-[8px] font-bold px-2 py-0.5 rounded-bl">Hinglish Upgrade</div>
              <div className="text-[11px] text-slate-500 line-clamp-2">
                <span className="font-extrabold uppercase block text-[8px] tracking-wider text-rose-500 mb-0.5">original dry script</span>
                "{rew.original}"
              </div>
              <div className="text-xs text-slate-100 italic bg-[#cca972]/[0.015] border border-[#cca972]/10 p-2.5 rounded-lg leading-relaxed font-sans">
                <span className="font-extrabold uppercase block text-[8px] tracking-wider text-emerald-400 mb-0.5">high-octane retention rewrite</span>
                "{rew.rewrite}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
