import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Database, Users, HelpCircle, Flame, CheckCircle, XCircle, Heart, ShieldAlert, KeyRound, RefreshCw } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface MemoryStyles {
  hooks: string;
  ctas: string;
  lengths: string;
  topics: string;
  formats: string;
  triggers: string;
  language: string;
}

interface AudienceMemoryData {
  memorySummary: string;
  responsePatterns: string;
  strongestTriggers: string[];
  weakTriggers: string[];
  overperformingContentTypes: string;
  underperformingContentTypes: string;
  audienceTrustFactors: string;
  audienceFrictionFactors: string;
  audienceConversionTriggers: string;
  preferredStyles: MemoryStyles;
}

const DEFAULT_MEMORY: AudienceMemoryData = {
  memorySummary: "The Indian viewer profile shows extremely high resistance to standard theoretical lectures, but opens up instantly to verified screenshots, raw salary/code figures, and student campus slang.",
  responsePatterns: "Swipes away standard 3-step lists inside 2 seconds. Retains attention above 75% on code split-screens with active mobile application simulators.",
  strongestTriggers: [
    "Shock Hinglish placements data ('Tier 3 college se 24LPA')",
    "Raw GitHub public commits graphs",
    "Live API request response terminal walkthroughs in 35s"
  ],
  weakTriggers: [
    "Generic introductory self-branding frames",
    "Formal dictionary definitions lacking immediate visual implementation"
  ],
  overperformingContentTypes: "Raw mobile screenshot over the shoulder builds + developer-bro audio voiceover.",
  underperformingContentTypes: "Standard slideshow compilations of general website links.",
  audienceTrustFactors: "Showing raw software console logs, compiler failures, and unedited coding errors.",
  audienceFrictionFactors: "High-pitched salesy voices or cookie-cutter template graphics shared by numerous tutorial accounts.",
  audienceConversionTriggers: "Custom helper scripts shared automatically through automated keyword integrations (Comment template flows).",
  preferredStyles: {
    hooks: "Mistake/warning alerts paired with outcome proof",
    ctas: "Keyword-triggered comment automatons",
    lengths: "35s to 45s high-octane walkthroughs",
    topics: "Hacky terminal/VScode configurations and off-campus application hacks",
    formats: "Visual compiler split-screen overlay with speaking inset",
    triggers: "Anxiety of mass placements recruitment and financial freedom",
    language: "Conversational, campus Hinglish (Hindi language in English letters)"
  }
};

export function AudienceMemoryModule() {
  const [data, setData] = useState<AudienceMemoryData>(DEFAULT_MEMORY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_audience_memory_graph");
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
          moduleType: "audience_memory_graph",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile Audience Memory Graph.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_audience_memory_graph", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/audience_memory_graph", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Database storage offline/delayed");
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
    <div id="audience-memory-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.012] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Audience Behavior Memory Graph</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            A comprehensive mapping of repeating audience retention triggers, friction metrics, and core content preferences in Hinglish markets.
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
            <Users className="w-3.5 h-3.5" />
          )}
          <span>Synthesize Memory Graph</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl">
          <span>{error}</span>
        </div>
      )}

      {/* memory Summary Intro Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#cca972]/[0.02] border border-[#cca972]/15 rounded-xl space-y-1.5">
          <span className="text-[9px] uppercase font-black tracking-widest text-[#cca972] block">Behavioral Summary</span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.memorySummary}</p>
        </div>

        <div className="p-4 bg-black/40 border border-[#1c1b1e] rounded-xl space-y-1.5">
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Response Patterns Detected</span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.responsePatterns}</p>
        </div>
      </div>

      {/* Preferred styles grid */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#cca972] border-b border-slate-900 pb-1.5">Audience Resonance Benchmarks</h4>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Preferred Hook", value: data.preferredStyles.hooks },
            { label: "Preferred CTA Style", value: data.preferredStyles.ctas },
            { label: "Optimal Length", value: data.preferredStyles.lengths },
            { label: "Winning Topics", value: data.preferredStyles.topics },
            { label: "Format Visuals", value: data.preferredStyles.formats },
            { label: "Emotional Trigger", value: data.preferredStyles.triggers },
            { label: "Language Mix", value: data.preferredStyles.language }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-black/55 border border-slate-900 rounded-xl space-y-1 hover:border-[#cca972]/30 transition duration-300">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">{item.label}</span>
              <span className="text-xs text-slate-200 font-semibold leading-tight block">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strongest vs Weak Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 border border-[#1b3a2a]/30 bg-[#0e1713]/25 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Flame className="w-4.5 h-4.5" />
            <span className="text-[10px] uppercase font-black font-mono tracking-widest">Strong/Repeat Triggers</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-350">
            {data.strongestTriggers.map((trig, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed text-slate-200">{trig}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 border border-[#43141b]/30 bg-[#1a1012]/25 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-4.5 h-4.5" />
            <span className="text-[10px] uppercase font-black font-mono tracking-widest">Weak/Swipe Triggers</span>
          </div>
          <ul className="space-y-3 text-xs text-slate-350">
            {data.weakTriggers.map((trig, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed text-slate-200">{trig}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trust, Friction, and Conversion Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="p-4 bg-emerald-950/[0.015] border border-emerald-950/30 rounded-xl space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 block">Trust Indicator</span>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">{data.audienceTrustFactors}</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 mt-2 font-bold select-none">● high conversion potential</span>
        </div>

        <div className="p-4 bg-rose-950/[0.015] border border-rose-950/30 rounded-xl space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-rose-400 block">Friction Point</span>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">{data.audienceFrictionFactors}</p>
          </div>
          <span className="text-[10px] font-mono text-rose-500 mt-2 font-bold select-none">✕ high retention leak dropoff</span>
        </div>

        <div className="p-4 bg-[#cca972]/[0.015] border border-[#cca972]/15 rounded-xl space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#cca972] block">Conversion Catalyst</span>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">{data.audienceConversionTriggers}</p>
          </div>
          <span className="text-[10px] font-mono text-[#cca972] mt-2 font-bold select-none">★ comments automation key</span>
        </div>
      </div>
    </div>
  );
}
