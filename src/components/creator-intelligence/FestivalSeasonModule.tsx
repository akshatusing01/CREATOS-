import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, Calendar, Flame, Timer, Zap } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface SeasonalOpportunity {
  relevantSeason: string;
  contentAngle: string;
  hookStyle: string;
  emotionalTrigger: string;
  ctaStyle: string;
  urgencyLevel: "critical" | "high" | "moderate" | string;
  audienceFit: string;
  bestPostingWindow: string;
}

interface SeasonIntelData {
  seasons: SeasonalOpportunity[];
}

const DEFAULT_SEASONS: SeasonIntelData = {
  seasons: [
    {
      relevantSeason: "Indian Placements / College Admissions Season (July-September)",
      contentAngle: "Automation systems setup to bypass boring resume screening",
      hookStyle: "Anxiety-easing direct outcome proof ('Placements season starts next week. Use this system...')",
      emotionalTrigger: "Career security, placement desperation and peer ambition",
      ctaStyle: "Comment RESUME for markdown script files",
      urgencyLevel: "critical",
      audienceFit: "Excellent for final-year engineering/CS students",
      bestPostingWindow: "Mondays & Thursdays, 7:30 PM to 9:30 PM"
    },
    {
      relevantSeason: "Diwali & End-of-Year Vacations Reflection (October-November)",
      contentAngle: "Contrarian upskilling checklists ('How to stay ahead of 99% of coders during vacations')",
      hookStyle: "Contrarian wake-up style ('Diwali par timepass mat karo...')",
      emotionalTrigger: "Self-improvement, productive ambition, and competitiveness",
      ctaStyle: "Save for Diwali vacation syllabus planner",
      urgencyLevel: "high",
      audienceFit: "Student developers and side-hustle freelancers",
      bestPostingWindow: "Sundays, 11:30 AM to 1:30 PM"
    }
  ]
};

export function FestivalSeasonModule() {
  const [data, setData] = useState<SeasonIntelData>(DEFAULT_SEASONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("creatoros_season_intel");
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
          moduleType: "festival_engine",
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile Indian cultural calendar indexes.");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        localStorage.setItem("creatoros_season_intel", JSON.stringify(result.data));
        soundManager.playSuccess();

        try {
          fetch("/api/creator-intelligence/profile/season_reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase background save offline/delayed");
        }
      } else {
        throw new Error("No seasonal blueprint returned.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sync calendar.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="festival-season-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.015] to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Festival & Season Engine</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Map Indian cultural holidays, academic calendars, and exam cycles into high-performing content hook hooks.
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
          <span>Predict Season Calendar</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455" />
          <span>{error}</span>
        </div>
      )}

      {/* Seasonal cards list */}
      <div className="space-y-6">
        {data?.seasons?.map((season, i) => {
          const isCritical = season.urgencyLevel?.toLowerCase() === "critical";
          const isHigh = season.urgencyLevel?.toLowerCase() === "high";

          return (
            <div key={i} className="p-5 bg-black/45 border border-slate-900 rounded-xl space-y-4 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className={`w-4 h-4 ${isCritical ? "text-rose-500" : isHigh ? "text-amber-500" : "text-[#cca972]"}`} />
                  <h4 className="text-sm font-bold text-white font-sans">{season.relevantSeason}</h4>
                </div>
                
                <span className={`text-[9px] uppercase font-bold px-3 py-1 rounded-full border ${
                  isCritical ? "bg-rose-950/20 text-rose-450 border-rose-950/40" : 
                  isHigh ? "bg-amber-950/20 text-amber-450 border-amber-950/40" : "bg-slate-950 text-slate-350 border-slate-900"
                }`}>
                  Urgency: {season.urgencyLevel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-2">
                  <div>
                    <span className="block text-[8px] uppercase text-slate-500 font-bold">content conceptual angle</span>
                    <span className="block text-slate-200 font-medium mt-0.5">{season.contentAngle}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-slate-500 font-bold">custom psychological trigger</span>
                    <span className="block text-slate-200 font-medium mt-0.5">{season.emotionalTrigger}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="block text-[8px] uppercase text-[#cca972] font-bold">suggested hook type & intro style</span>
                    <span className="block text-slate-200 mt-0.5 italic">"{season.hookStyle}"</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900/60">
                    <div>
                      <span className="block text-[7.5px] uppercase text-slate-500">CTA Goal Ask</span>
                      <span className="block font-semibold text-slate-200 mt-0.5">{season.ctaStyle}</span>
                    </div>
                    <div>
                      <span className="block text-[7.5px] uppercase text-slate-500">best posting hour (IST)</span>
                      <span className="block font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                        <Timer className="w-3 h-3 text-[#cca972] shrink-0" />
                        {season.bestPostingWindow}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
