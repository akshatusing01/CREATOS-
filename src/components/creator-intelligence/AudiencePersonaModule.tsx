import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, Layers, Smile, Target, ShieldCheck, Heart } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface AudiencePersonaData {
  primaryPersona: string;
  secondaryPersona: string;
  painPoints: string[];
  goals: string[];
  fears: string[];
  desires: string[];
  languagePreference: string;
  hookSensitivity: string;
  ctaSensitivity: string;
  trustTrigger: string;
  conversionTrigger: string;
}

const DEFAULT_PERSONA: AudiencePersonaData = {
  primaryPersona: "The Tier-3 Engineering Aspirant / Hustler",
  secondaryPersona: "The Self-Taught Frontend Transitioner",
  painPoints: [
    "College curricula is outdated, focusing heavily on rote theories",
    "On-campus placement training is non-existent or inadequate",
    "MASS recruitments are drying up, creating huge job market panic"
  ],
  goals: [
    "Secure a high-paying remote development job (10LPA+ package)",
    "Build a production-ready real project portfolio to prove competence"
  ],
  fears: [
    "Ending up unemployed or stuck in low-salary boring support roles",
    "Wasting massive amounts of money on expensive visual bootcamps"
  ],
  desires: [
    "Genuine, step-by-step practical advice, clean code access, and direct feedback from an expert."
  ],
  languagePreference: "Casual, spoken college Hinglish with local dev terms ('Bhai github upload kaise karu')",
  hookSensitivity: "Extremely high. Instantly swipes away formal theoretical lectures. Craves real proof and metric claims.",
  ctaSensitivity: "Will save step-by-step checklists, and comment keyword tags only if promised direct zip source code files.",
  trustTrigger: "Showing real GitHub commits, compiling live terminal dashboards, or active database queries on viewport.",
  conversionTrigger: "Gaining community access, high-value prompt cheatsheets, or real feedback on their portfolio link."
};

export function AudiencePersonaModule() {
  const [data, setData] = useState<AudiencePersonaData>(DEFAULT_PERSONA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_persona_intel");
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
          moduleType: "audience_persona",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile audience personas.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_persona_intel", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/audience_personas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("No audience details compiled by strategy module.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to compile personas.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="audience-persona-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Smile className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Audience Persona Builder</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Profile the authentic ambitions, local struggles, vocabulary habits, and trust triggers of your core Indian viewers.
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
          <span>Synthesize Persona Library</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455" />
          <span>{error}</span>
        </div>
      )}

      {/* Core Persona Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-black/40 border border-[#232225] rounded-xl space-y-1">
          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block">primary audience persona</span>
          <h4 className="text-xs font-extrabold text-[#cca972] uppercase font-sans">{data.primaryPersona}</h4>
        </div>
        <div className="p-4 bg-black/40 border border-[#232225] rounded-xl space-y-1">
          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold block">secondary audience persona</span>
          <h4 className="text-xs font-extrabold text-[#cca972] uppercase font-sans">{data.secondaryPersona}</h4>
        </div>
      </div>

      {/* Pain points, Goals, fears */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold text-rose-400 tracking-wider block border-b border-rose-950/40 pb-1 flex items-center gap-1">
            <Smile className="w-3.5 h-3.5" /> local audience pain-points
          </span>
          <div className="space-y-2 text-xs text-slate-300 font-sans">
            {data.painPoints?.map((p, idx) => (
              <div key={idx} className="flex gap-1.5 p-2 bg-rose-950/[0.02] border border-rose-950/10 rounded-lg">
                <span className="text-rose-450 text-rose-400 font-bold shrink-0">·</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block border-b border-emerald-950/40 pb-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> active goals
          </span>
          <div className="space-y-2 text-xs text-slate-300 font-sans">
            {data.goals?.map((g, idx) => (
              <div key={idx} className="flex gap-1.5 p-2 bg-emerald-950/[0.02] border border-emerald-950/10 rounded-lg">
                <span className="text-emerald-400 font-bold shrink-0">✔</span>
                <span>{g}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold text-[#cca972] tracking-wider block border-b border-[#cca972]/20 pb-1 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> audience fears & pitfalls
          </span>
          <div className="space-y-2 text-xs text-slate-300 font-sans">
            {data.fears?.map((f, idx) => (
              <div key={idx} className="flex gap-1.5 p-2 bg-[#cca972]/[0.015] border border-[#cca972]/10 rounded-lg">
                <span className="text-[#cca972] font-bold shrink-0">·</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust and Conversion Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-emerald-950/[0.02] border border-emerald-950/25 rounded-xl space-y-1.5">
          <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> trust-building triggers (high proof)
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.trustTrigger}</p>
        </div>

        <div className="p-4 bg-[#cca972]/[0.02] border border-[#cca972]/20 rounded-xl space-y-1.5">
          <span className="text-[9px] uppercase font-bold text-[#cca972] tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> conversion & engagement trigger
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{data.conversionTrigger}</p>
        </div>
      </div>

      {/* Language, Hook, CTA Sensitivity details */}
      <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-3 text-xs">
        <span className="block text-[8.5px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-900 pb-1">viewer behavior sensitivities</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-[8px] uppercase font-extrabold text-slate-500">verbal language preference</span>
            <p className="text-slate-350 text-slate-300 font-medium font-sans mt-0.5">{data.languagePreference}</p>
          </div>
          <div>
            <span className="text-[8px] uppercase font-extrabold text-slate-500">hook sensitivity rating</span>
            <p className="text-slate-350 text-slate-300 font-medium font-sans mt-0.5">{data.hookSensitivity}</p>
          </div>
          <div>
            <span className="text-[8px] uppercase font-extrabold text-slate-500">action response rate sensitivity</span>
            <p className="text-slate-350 text-slate-300 font-medium font-sans mt-0.5">{data.ctaSensitivity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
