import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, RefreshCw, Layers, Sparkles, FolderPlus, ArrowRight, ClipboardList, CheckCircle } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface CampaignItem {
  name: string;
  campaignType: string;
  campaignGoal: string;
  targetAudience: string;
  coreMessage: string;
  contentPillars: string[];
  hookStrategy: string;
  ctaStrategy: string;
  postingRhythm: string;
  campaignLength: string;
  expectedSignal: string;
  successIndicators: string;
  bottleneckRisk: string;
  recommendedImprovements: string;
}

interface CalendarSlot {
  day: string;
  title: string;
  pillar: string;
  format: string;
  hookType: string;
  ctaType: string;
  bestPostingWindow: string;
}

interface CalendarData {
  dailyPlan: CalendarSlot[];
  weeklyPlan: string;
  monthlyPlan: string;
  pillarAllocation: Record<string, number>;
  formatAllocation: Record<string, number>;
  hookAllocation: Record<string, number>;
  ctaAllocation: Record<string, number>;
  testingSlots: string[];
  revisionSlots: string[];
  postingPriority: string;
  bestPostingWindows: string;
}

interface CampaignCalendarData {
  campaigns: CampaignItem[];
  calendar: CalendarData;
}

const DEFAULT_CALENDAR_PLANS: CalendarData = {
  dailyPlan: [
    { day: "Monday", title: "Leetcode Hidden Pattern Cheat-sheets", pillar: "Interview Hacks", format: "Split Screen Walkthrough", hookType: "Proof-first (0.5s visual match)", ctaType: "Keyword Automated trigger", bestPostingWindow: "7:30 PM - 8:30 PM" },
    { day: "Tuesday", title: "Why you should never use traditional arrays in C++", pillar: "No-Bs Build", format: "Code voiceover clip", hookType: "Contrarian warning", ctaType: "Save for future config", bestPostingWindow: "12:30 PM - 1:30 PM" },
    { day: "Wednesday", title: "How a Tier-3 college student bypassed mass recruiter filters", pillar: "Tier-3 Escape", format: "Speaking head outdoor", hookType: "Mistake Alert", ctaType: "Share on WhatsApp groups", bestPostingWindow: "8:00 PM - 9:00 PM" },
    { day: "Thursday", title: "Coding client dashboard database entirely on smartphone", pillar: "No-Bs Build", format: "Split screen mobile compiler", hookType: "Curiosity loop", ctaType: "Save", bestPostingWindow: "5:30 PM - 6:30 PM" },
    { day: "Friday", title: "Aukaat check placements salary benchmarks decoded", pillar: "Tier-3 Escape", format: "Storytelling timeline", hookType: "Shock Placement Stat", ctaType: "Direct profile follow", bestPostingWindow: "7:30 PM - 8:30 PM" },
    { day: "Saturday", title: "3 Keyboard terminal shortcuts that make you look lazy", pillar: "Developer Tooling", format: "UI Zoom", hookType: "Curiosity gap", ctaType: "Save to configure tomorrow", bestPostingWindow: "11:30 AM - 1:00 PM" },
    { day: "Sunday", title: "Reviewing broken repositories submitted by subscribers live", pillar: "Community Review", format: "Interactive Live stream", hookType: "Interactive custom Q&A", ctaType: "Direct Bio Link Click", bestPostingWindow: "3:00 PM - 5:00 PM" }
  ],
  weeklyPlan: "Focus heavily on authority-based Interview Blueprint hacks Monday to Wednesday; transition to high-loyalty storytelling, tips campaigns Fri-Sun.",
  monthlyPlan: "Weeks 1-2 Focus on broad mass reach Reels; Week 3 run custom dynamic 'Bhai Code Theek Kar' series; Week 4 conversion strategy with comment automations.",
  pillarAllocation: { "Interview Hacks": 40, "No-Bs Build": 30, "Tier-3 Escape": 20, "Developer Tooling": 10 },
  formatAllocation: { "Split-screen walk": 50, "Speaking-head feedback": 30, "Live interactive streams": 20 },
  hookAllocation: { "Proof-first": 45, "Contrarian warning": 25, "Curiosity loop": 20, "Direct statement": 10 },
  ctaAllocation: { "Comment Keyword automation": 50, "Save for future reference": 30, "Profile follow": 20 },
  testingSlots: [
    "Thursday afternoon - Experimenting with 0.5s ultra-fast terminal screenshot cuts.",
    "Saturday noon - Testing custom high-contrast neon highlighter cursors."
  ],
  revisionSlots: [
    "Tuesday midnight - Review drop-off metric curves from Monday evening and apply custom voiceover hacks."
  ],
  postingPriority: "Maximize Hook retention on Monday/Friday placement anxiety peaks.",
  bestPostingWindows: "College students active hours peak at lunch breaks (12:30 PM) and late evenings (7:30 PM - 9:30 PM)."
};

const DEFAULT_CAMPAIGNS: CampaignItem[] = [
  {
    name: "14-Day Off-Campus Placements Authority Sprint",
    campaignType: "authority",
    campaignGoal: "Establish absolute niche authority for students on bypassing initial campus filter barriers.",
    targetAudience: "3rd & 4th year Indian engineering aspirants.",
    coreMessage: "Recruiter tracking works on secret keyword indicators. Bypass generic formats to get shortlisted.",
    contentPillars: ["Leetcode pattern cheats", "Bypassing mass recruiter resume bots"],
    hookStrategy: "Direct screen show matching criteria: 'Ye galti apply karte waqt mat karna...'",
    ctaStrategy: "Comment 'RECRUIT' to receive the automated markdown notebook link.",
    postingRhythm: "Daily upload at exactly 7:30 PM (campus preparation endpoint)",
    campaignLength: "14 Days",
    expectedSignal: "Excellent custom comment volume and direct keyword conversions.",
    successIndicators: "Average watch-time rate exceeding 80% with a 3.5% registration rate.",
    bottleneckRisk: "Viewer frustration if link deliveries are slow. Keep automated API server checks running.",
    recommendedImprovements: "Include a 30s quick Loom video demo on how to run markdown scripts."
  },
  {
    name: "7-Day High-Octane Coder Tooling Upgrade",
    campaignType: "engagement",
    campaignGoal: "Boost core engagement metrics through rapid terminal and keyboard script configurations.",
    targetAudience: "Junior developers and active campus engineers.",
    coreMessage: "If you configure packages manually, you waste 3 hours. Automate everything in 10 lines.",
    contentPillars: ["Developer tooling hacks", "Automation scripts"],
    hookStrategy: "'I swear these keyboard terminal hacks feel illegal to know...'",
    ctaStrategy: "Save this Reel to configure your system tomorrow morning.",
    postingRhythm: "Alternating days at 11:30 AM (during professional coffee blocks)",
    campaignLength: "7 Days",
    expectedSignal: "Extremely high Save count spikes.",
    successIndicators: "Save-to-view ratio above 8.5%.",
    bottleneckRisk: "Content might feel too quick. Keep overlay text extremely spacious.",
    recommendedImprovements: "Use neon colors and highlight terminal text in bold standard font pairings."
  }
];

export function CampaignCalendarModule() {
  const [subTab, setSubTab] = useState<"campaigns" | "calendar">("calendar");
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(DEFAULT_CAMPAIGNS);
  const [calendar, setCalendar] = useState<CalendarData>(DEFAULT_CALENDAR_PLANS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage
    const savedCampaigns = localStorage.getItem("creatoros_campaign_plans");
    const savedCalendar = localStorage.getItem("creatoros_content_calendars");
    if (savedCampaigns) {
      try { setCampaigns(JSON.parse(savedCampaigns)); } catch (e) {}
    }
    if (savedCalendar) {
      try { setCalendar(JSON.parse(savedCalendar)); } catch (e) {}
    }
  }, []);

  const handleRegenerate = async () => {
    setLoading(true);
    setError(null);
    soundManager.playSparkle();

    try {
      const niche = localStorage.getItem("creatoros_profile_niche") || "AI Productivity & Student coding tutorials";
      
      // Determine what to trigger
      const mType = subTab === "campaigns" ? "campaign_plans" : "content_calendars";
      const response = await fetch("/api/creator-intelligence/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleType: mType,
          context: { niche }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to compile ${subTab === "campaigns" ? "Campaign Options" : "Strategic Calendar"}.`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        if (subTab === "campaigns") {
          const fetchedCampaigns = result.data.campaigns || [result.data];
          setCampaigns(fetchedCampaigns);
          localStorage.setItem("creatoros_campaign_plans", JSON.stringify(fetchedCampaigns));
        } else {
          setCalendar(result.data);
          localStorage.setItem("creatoros_content_calendars", JSON.stringify(result.data));
        }
        soundManager.playSuccess();

        // Background save to Supabase
        try {
          fetch(`/api/creator-intelligence/profile/${mType}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data)
          });
        } catch (dbErr) {
          console.warn("Supabase save delayed");
        }
      } else {
        throw new Error("No data returned by generative strategist agent.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process generative request.");
      soundManager.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="campaign-calendar-panel" className="border border-[#232225] bg-[#0c0b0e] p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#cca972]/[0.012] to-transparent pointer-events-none" />

      {/* Header with SubTabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1b1e] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded bg-[#cca972]/15 text-[#cca972]">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white font-sans">Campaigns & Content Calendar</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Plan high-value multi-day visual campaigns and map out daily, weekly, and monthly video slots aligned with student campus schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center font-mono">
          <div className="bg-black/60 p-1 rounded-lg border border-[#1c1b1e] flex gap-1">
            <button
              onClick={() => setSubTab("calendar")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition ${
                subTab === "calendar" ? "bg-[#cca972] text-[#070608]" : "text-slate-400 hover:text-white"
              }`}
            >
              Content Calendar
            </button>
            <button
              onClick={() => setSubTab("campaigns")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition ${
                subTab === "campaigns" ? "bg-[#cca972] text-[#070608]" : "text-slate-400 hover:text-white"
              }`}
            >
              Campaign Planner
            </button>
          </div>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center gap-2 text-[10px] bg-[#1a191c] text-slate-200 px-3 py-2 rounded-xl border border-slate-900 hover:bg-black transition disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3 animate-spin" /> : <Layers className="w-3" />}
            <span>Re-Optimize</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/20 border border-rose-950/50 text-rose-300 text-xs rounded-xl">
          <span>{error}</span>
        </div>
      )}

      {/* RENDER VIEW 1: CAMPAIGN PLANNER */}
      {subTab === "campaigns" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((camp, idx) => (
              <div key={idx} className="border border-[#232225] bg-black/35 p-5 rounded-2xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#cca972]/15 text-[#cca972] uppercase font-mono text-[8px] px-3.5 py-1 rounded-bl">
                  {camp.campaignType}
                </div>
                
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-slate-500 font-mono tracking-widest">{camp.campaignLength} Sprint</span>
                  <h4 className="text-sm font-extrabold text-white tracking-tight">{camp.name}</h4>
                </div>

                <div className="p-3 bg-white/[0.012] border border-slate-900 leading-relaxed text-xs text-slate-300 rounded-xl">
                  <span className="font-bold text-[#cca972] block text-[9px] uppercase">Campaign Goal</span>
                  {camp.campaignGoal}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                  <div>
                    <span className="text-slate-500 font-bold block text-[8px] uppercase">Core Message</span>
                    <span className="text-slate-200 mt-0.5 block">{camp.coreMessage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[8px] uppercase">Posting Rhythm</span>
                    <span className="text-slate-200 mt-0.5 block">{camp.postingRhythm}</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-slate-900 pt-3">
                  <div className="flex gap-2 items-center text-xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase shrink-0">Hooks:</span>
                    <span className="text-slate-200 italic">"{camp.hookStrategy}"</span>
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase shrink-0">CTAs:</span>
                    <span className="text-emerald-400 font-semibold">"{camp.ctaStrategy}"</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-900 pt-3 text-[11px] font-mono">
                  <div className="p-2.5 bg-emerald-950/[0.015] border border-emerald-950/20 rounded-lg">
                    <span className="text-[8px] text-[#cca972] uppercase font-bold block">Signal Expected</span>
                    <span className="text-slate-300 mt-0.5 block capitalize leading-tight">{camp.expectedSignal}</span>
                  </div>
                  <div className="p-2.5 bg-[#cca972]/[0.015] border border-[#cca972]/10 rounded-lg">
                    <span className="text-[8px] text-[#cca972] uppercase font-bold block">Success Criteria</span>
                    <span className="text-slate-300 mt-0.5 block capitalize leading-tight">{camp.successIndicators}</span>
                  </div>
                </div>

                {/* Risk Deconstruction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 border-t border-slate-900 pt-3">
                  <div className="p-3.5 bg-[#1a1012]/40 border border-rose-950/40 rounded-xl space-y-0.5">
                    <span className="block text-[8px] font-black uppercase text-rose-450 text-rose-400">Risk Bottleneck</span>
                    <span className="block text-xs text-slate-300 font-sans leading-relaxed">{camp.bottleneckRisk}</span>
                  </div>
                  <div className="p-3.5 bg-[#0e1713]/40 border border-emerald-950/40 rounded-xl space-y-0.5">
                    <span className="block text-[8px] font-black uppercase text-emerald-450 text-emerald-400">Improvement Play</span>
                    <span className="block text-xs text-slate-300 font-sans leading-relaxed">{camp.recommendedImprovements}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER VIEW 2: CONTENT CALENDAR INTERACTIVE PLATS */}
      {subTab === "calendar" && (
        <div className="space-y-6">
          {/* Calendar Allocation Split Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-black/25 p-4 rounded-xl border border-[#1b1a1c] font-sans">
            <div>
              <span className="text-[8px] text-slate-500 uppercase font-bold">Pillar Allocation</span>
              <div className="space-y-1.5 mt-2">
                {Object.entries(calendar.pillarAllocation).map(([pil, val]) => (
                  <div key={pil} className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="text-slate-400 truncate max-w-[90px]">{pil}</span>
                    <span className="text-[#cca972] font-extrabold">{val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[8px] text-slate-500 uppercase font-bold">Format Allocation</span>
              <div className="space-y-1.5 mt-2">
                {Object.entries(calendar.formatAllocation).map(([form, val]) => (
                  <div key={form} className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="text-slate-400 truncate max-w-[90px]">{form}</span>
                    <span className="text-[#cca972] font-extrabold">{val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[8px] text-slate-500 uppercase font-bold">Hook Allocation</span>
              <div className="space-y-1.5 mt-2">
                {Object.entries(calendar.hookAllocation).map(([hk, val]) => (
                  <div key={hk} className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="text-slate-400 truncate max-w-[90px]">{hk}</span>
                    <span className="text-[#cca972] font-extrabold">{val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[8px] text-slate-500 uppercase font-bold">CTA Allocation</span>
              <div className="space-y-1.5 mt-2">
                {Object.entries(calendar.ctaAllocation).map(([ct, val]) => (
                  <div key={ct} className="flex justify-between items-center text-[10px] font-mono leading-none">
                    <span className="text-slate-400 truncate max-w-[90px]">{ct}</span>
                    <span className="text-[#cca972] font-extrabold">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Broad Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white/[0.01] border border-slate-900 rounded-xl leading-relaxed text-xs">
              <span className="font-bold text-slate-500 text-[8px] uppercase block tracking-wider">Weekly Theme pacing style</span>
              <p className="text-slate-300 mt-1">{calendar.weeklyPlan}</p>
            </div>
            <div className="p-3 bg-white/[0.01] border border-slate-900 rounded-xl leading-relaxed text-xs">
              <span className="font-bold text-slate-500 text-[8px] uppercase block tracking-wider">30-Day strategic cycle</span>
              <p className="text-slate-300 mt-1">{calendar.monthlyPlan}</p>
            </div>
          </div>

          {/* Daily Table Planner */}
          <div className="border border-[#1c1b1e] rounded-xl overflow-hidden bg-black/40">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1c1b1e] bg-black/60 font-mono text-[9px] text-[#cca972] uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Weekday</th>
                    <th className="p-3.5 font-bold">Strategic Topic</th>
                    <th className="p-3.5 font-bold">Pillar</th>
                    <th className="p-3.5 font-bold">Format</th>
                    <th className="p-3.5 font-bold">Anchor Hook / CTA</th>
                    <th className="p-3.5 font-bold">Ideal Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#131215]">
                  {calendar.dailyPlan.map((slot, id) => (
                    <tr key={id} className="hover:bg-white/[0.015] transition duration-200">
                      <td className="p-3.5 font-bold text-slate-400 font-mono">{slot.day}</td>
                      <td className="p-3.5 font-semibold text-white leading-relaxed max-w-[200px]">{slot.title}</td>
                      <td className="p-3.5 text-slate-300">
                        <span className="text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-0.5 font-semibold">
                          {slot.pillar}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 truncate max-w-[120px]">{slot.format}</td>
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="block text-[10px] text-slate-300 font-medium">H: {slot.hookType}</span>
                          <span className="block text-[9px] text-emerald-400 italic">C: {slot.ctaType}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300 text-[10px] bg-black/20 font-bold whitespace-nowrap">
                        {slot.bestPostingWindow}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Testing and Revision slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#cca972]/[0.015] border border-[#cca972]/15 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#cca972] tracking-wider block font-mono">
                Planned Experimentation Slots
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {calendar.testingSlots.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start leading-relaxed">
                    <span className="text-[#cca972] font-black shrink-0 font-mono">★</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-900/[0.05] border border-slate-900/60 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                Review & Revision Windows
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {calendar.revisionSlots.map((item, idx) => (
                  <li key={idx} className="flex gap-2 items-start leading-relaxed">
                    <span className="text-slate-500 font-black shrink-0 font-mono">↺</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
