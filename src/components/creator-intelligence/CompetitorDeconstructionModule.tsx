import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, Layers, Users, ShieldAlert, Check } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface CompetitorData {
  competitor: string;
  whatTheyDoWell: string;
  whatTheyRepeat: string;
  whatTheyAvoid: string;
  structurePreferred: string;
  ctaStrategy: string;
  whatToLearn: string;
  whereToDifferentiate: string;
  whatToCopyCarefully: string;
  whatToAvoidCopying: string;
}

const DEFAULT_COMPETITOR: CompetitorData = {
  competitor: "Ishan Sharma / Siddharth Warrier Style Profiles",
  whatTheyDoWell: "Bold high-contrast colored captions, immediate face-to-camera eye contact inside second 0, and triggering a highly relatable Indian student career worry.",
  whatTheyRepeat: "They constantly repeat a 'Proof-first validation slide' (e.g., showing a massive dollar figure screenshot, Stripe dashboard, or a gorgeous working GitHub portfolio screen).",
  whatTheyAvoid: "Passive academic introductions, slow slide overlays, long corporate greetings, or pre-paying calls to action.",
  structurePreferred: "Proof Overlay (0-2s) -> Shock/Pain Trigger (2-8s) -> Actionable 3-Step Plan (8-24s) -> DM keyword automated trigger (24-30s).",
  ctaStrategy: "Automated direct-message keyword campaigns ('Comment TEMPLATE below, bhej deta hoon') that bypasses standard link in bio friction.",
  whatToLearn: "The timing and speed of visual retention transitions. Changing on-screen assets or zooming every 1.5 seconds keeps eyes fully locked.",
  whereToDifferentiate: "Instead of talking about general remote corporate jobs, show localized technical coding failure logs and raw developer systems architecture. Provide deeper educational values.",
  whatToCopyCarefully: "Their rapid structural pacing and the usage of relatable conversational student slang words.",
  whatToAvoidCopying: "The ultra-exaggerated clickbaity reaction thumbnails or toxic hustle productivity traps that erode expert credibility long-term."
};

export function CompetitorDeconstructionModule() {
  const [data, setData] = useState<CompetitorData>(DEFAULT_COMPETITOR);
  const [competitorName, setCompetitorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_competitor_intel");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    }
  }, []);

  const handleDeconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    soundManager.playSparkle();

    try {
      const name = competitorName || "Ishan Sharma / Siddharth Warrier Style Profiles";
      const response = await fetch("/api/creator-intelligence/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleType: "competitor_deconstruction",
          context: { competitorName: name }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process competitor structural diagnostics.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_competitor_intel", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/competitor_deconstructions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("No data returned by deconstruction engine.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to deconstruct competitor.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="competitor-deconstruction-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Competitor Deconstruction</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Dissect competitor script patterns. Know what styles to mimic carefully and where to design authentic contrasts.
          </p>
        </div>
      </div>

      {/* Deconstruction Search Form */}
      <form onSubmit={handleDeconstruct} className="flex gap-2">
        <input
          type="text"
          value={competitorName}
          onChange={(e) => setCompetitorName(e.target.value)}
          placeholder="Enter Indian Creator or channel name..."
          className="flex-1 bg-black/60 border border-[#232225] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#cca972] font-sans"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider bg-white text-[#070608] px-4 py-2.5 rounded-xl border border-white/10 hover:bg-slate-200 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Brain className="w-3.5 h-3.5" />
          )}
          <span>Deconstruct</span>
        </button>
      </form>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455" />
          <span>{error}</span>
        </div>
      )}

      {/* Competitor Overview info card */}
      <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-900 flex justify-between items-center">
        <div>
          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">active target deconstructed</span>
          <span className="block text-sm font-extrabold text-white font-sans mt-0.5">{data.competitor}</span>
        </div>
        <span className="text-[9px] uppercase font-bold text-[#cca972] bg-[#cca972]/10 px-2.5 py-1 rounded-full border border-[#cca972]/20">
          tactical audit ready
        </span>
      </div>

      {/* Grid containing What they do well, repeat, avoid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-1.5">
          <span className="block text-[9px] uppercase text-emerald-400 font-bold">what they do well</span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.whatTheyDoWell}</p>
        </div>
        <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-1.5">
          <span className="block text-[9px] uppercase text-[#cca972] font-bold">what they repeat</span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.whatTheyRepeat}</p>
        </div>
        <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-1.5">
          <span className="block text-[9px] uppercase text-rose-400 font-bold">what they avoid</span>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.whatTheyAvoid}</p>
        </div>
      </div>

      {/* Dynamic structural & CTA breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-black/40 border border-[#232225] rounded-xl space-y-1.5">
          <span className="block text-[9px] uppercase text-slate-400 font-bold">Preferred Script Anatomy</span>
          <p className="text-xs text-white leading-relaxed font-sans font-medium">{data.structurePreferred}</p>
        </div>
        <div className="p-4 bg-black/40 border border-[#232225] rounded-xl space-y-1.5">
          <span className="block text-[9px] uppercase text-slate-400 font-bold">CTA Conversion Strategy</span>
          <p className="text-xs text-white leading-relaxed font-sans font-medium">{data.ctaStrategy}</p>
        </div>
      </div>

      {/* Differential lessons to learn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-emerald-950/[0.02] border border-emerald-950/25 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">what to learn & carefully copy</span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.whatToLearn}</p>
          <div className="h-[1px] bg-emerald-950/50 my-1"/>
          <p className="text-[11px] text-slate-300 italic">"Copy carefully: {data.whatToCopyCarefully}"</p>
        </div>

        <div className="p-4 bg-rose-950/[0.02] border border-rose-950/25 rounded-xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">what to carefully avoid copying</span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.whatToAvoidCopying}</p>
          <div className="h-[1px] bg-rose-950/50 my-1"/>
          <p className="text-[11px] text-slate-300 italic flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-455 shrink-0" />
            <span>Avoid: {data.whereToDifferentiate}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
