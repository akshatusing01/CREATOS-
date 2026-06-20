import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Activity, 
  Brain, 
  History, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  Sliders, 
  Award, 
  ShieldCheck, 
  Database,
  ArrowRight,
  RefreshCw,
  Cpu,
  Calendar,
  Compass,
  Users,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CreatorIntelligenceReport, IntelDNAUpdate } from "../types";
import { soundManager } from "../utils/sound";

// Import custom modular system components
import { InputWorkspace } from "./creator-intelligence/InputWorkspace";
import { ScoreHub } from "./creator-intelligence/ScoreHub";
import { StrategyPlaybook } from "./creator-intelligence/StrategyPlaybook";
import { ScriptAnatomy } from "./creator-intelligence/ScriptAnatomy";
import { ProductionSuite } from "./creator-intelligence/ProductionSuite";
import { CreatorDNAView } from "./creator-intelligence/CreatorDNAView";
import { HistoryVault } from "./creator-intelligence/HistoryVault";

// Import new Phase 2 differentiator engines
import { HookIntelligenceModule } from "./creator-intelligence/HookIntelligenceModule";
import { CtaIntelligenceModule } from "./creator-intelligence/CtaIntelligenceModule";
import { TrendRadarModule } from "./creator-intelligence/TrendRadarModule";
import { ContentGapRadarModule } from "./creator-intelligence/ContentGapRadarModule";
import { CompetitorDeconstructionModule } from "./creator-intelligence/CompetitorDeconstructionModule";
import { AudiencePersonaModule } from "./creator-intelligence/AudiencePersonaModule";
import { FestivalSeasonModule } from "./creator-intelligence/FestivalSeasonModule";
import { ProgressDashboardModule } from "./creator-intelligence/ProgressDashboardModule";
import { ComparisonHistoryModule } from "./creator-intelligence/ComparisonHistoryModule";

// Import new Phase 3 Strategic Workspace Modules
import { CreatorEvolutionModule } from "./creator-intelligence/CreatorEvolutionModule";
import { AudienceMemoryModule } from "./creator-intelligence/AudienceMemoryModule";
import { ContentSystemModule } from "./creator-intelligence/ContentSystemModule";
import { CampaignCalendarModule } from "./creator-intelligence/CampaignCalendarModule";
import { ExperimentForecastModule } from "./creator-intelligence/ExperimentForecastModule";


// Import pre-seeded strategy templates
import { 
  MOCK_SCRIPT_DOCTOR_REPORT, 
  MOCK_PERFORMANCE_REPORT, 
  MOCK_DNA_REPORT, 
  MOCK_WINNER_LOSER_REPORT,
  MOCK_COMPETITOR_REPORT,
  MOCK_MULTI_PATTERN_REPORT,
  MOCK_FULL_AUDIT_REPORT,
  MOCK_STRATEGY_ENGINE_REPORT,
  MOCK_HISTORY_REPORTS 
} from "./creator-intelligence/mockReports";

interface CreatorIntelligencePageProps {
  onIntelCountChange?: (count: number) => void;
}

export default function CreatorIntelligencePage({ onIntelCountChange }: CreatorIntelligencePageProps = {}) {
  // Analytical Modes List
  const INTEL_MODES = [
    { key: "script_doctor", label: "Script Doctor", desc: "Line-by-line hooks, pacing, and CTAs diagnostic", icon: Sparkles },
    { key: "performance_analyzer", label: "Performance Analyzer", desc: "Retention drops and metrics optimization", icon: Activity },
    { key: "creator_dna_builder", label: "Creator DNA Builder", desc: "Uncover core styles, triggers, and content niche", icon: Brain },
    { key: "winner_loser_comparison", label: "Winner vs Loser", desc: "Direct contrast side-by-side gap insights", icon: Award },
    { key: "competitor_analysis", label: "Competitor Analysis", desc: "Style gap vs industry references", icon: Sliders },
    { key: "multi_pattern_analysis", label: "Multi-Content Patterns", desc: "Identify batch performance errors", icon: BookOpen },
    { key: "full_content_audit", label: "Full Content Audit", desc: "Macro qualitative and systems roadmap", icon: ShieldCheck },
    { key: "strategy_engine", label: "Content Strategy Engine", desc: "Targeted hooks lists & idea pipelines", icon: DbIcon }
  ];

  // Helper custom icon mapping if DB is requested
  function DbIcon(props: any) {
    return <Database className={props.className} />;
  }

  // Active state management
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("script_doctor");
  const [activeMode, setActiveMode] = useState<string>("script_doctor");
  const [currentReport, setCurrentReport] = useState<CreatorIntelligenceReport | null>(null);
  const [history, setHistory] = useState<CreatorIntelligenceReport[]>([]);
  const [cumulativeDNA, setCumulativeDNA] = useState<IntelDNAUpdate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResetConfirming, setIsResetConfirming] = useState<boolean>(false);

  const autoSyncEverything = (loadedHistory: CreatorIntelligenceReport[]) => {
    if (loadedHistory.length === 0) return loadedHistory;

    // Sort history descending by original date so order is consistent
    const sorted = [...loadedHistory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const today = new Date();
    const updatedHistory = sorted.map((report, idx) => {
      // Shift report dates relative to today:
      // Index 0: today, Index 1: yesterday, Index 2: 2 days ago, and so on...
      const reportDate = new Date(today);
      reportDate.setDate(today.getDate() - idx);
      
      const originalDate = new Date(report.createdAt);
      reportDate.setHours(originalDate.getHours() || 10 + (idx % 4));
      reportDate.setMinutes(originalDate.getMinutes() || 15 + (idx * 7) % 45);
      
      return {
        ...report,
        createdAt: reportDate.toISOString()
      };
    });

    // Also update calendar and campaign starting days to make them dynamic
    const todayDateString = today.toDateString();
    const lastSync = localStorage.getItem("creatoros_last_sync_date");
    
    if (lastSync !== todayDateString) {
      localStorage.setItem("creatoros_last_sync_date", todayDateString);
      
      // Sync Content calendar
      const savedCalendarStr = localStorage.getItem("creatoros_content_calendars");
      if (savedCalendarStr) {
        try {
          const calendarObj = JSON.parse(savedCalendarStr);
          calendarObj.lastAutoSynced = today.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          localStorage.setItem("creatoros_content_calendars", JSON.stringify(calendarObj));
        } catch(e) {}
      }

      // Sync campaigns
      const savedCampaignsStr = localStorage.getItem("creatoros_campaign_plans");
      if (savedCampaignsStr) {
        try {
          const campaignsArr = JSON.parse(savedCampaignsStr);
          if (Array.isArray(campaignsArr)) {
            const updatedCampaigns = campaignsArr.map((c: any) => {
              const startDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return {
                ...c,
                activePeriod: `${startDate} onwards`
              };
            });
            localStorage.setItem("creatoros_campaign_plans", JSON.stringify(updatedCampaigns));
          }
        } catch(e) {}
      }
      
      console.log("Daily dynamic calibration with Current date complete!");
    }

    return updatedHistory;
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      // 1. Remove from Local state first to keep responsiveness
      const updatedHistory = history.filter(report => report.id !== reportId);
      setHistory(updatedHistory);
      localStorage.setItem("creatoros_intel_history", JSON.stringify(updatedHistory));
      
      if (onIntelCountChange) onIntelCountChange(updatedHistory.length);

      // 2. Adjust active report selection if the active report was deleted
      if (currentReport?.id === reportId) {
        setCurrentReport(updatedHistory.length > 0 ? updatedHistory[0] : null);
      }

      // 3. Make the API delete request to Supabase backend
      await fetch(`/api/creator-intelligence/history/${reportId}`, {
        method: "DELETE"
      });

      showToast("Report deleted from strategy vault.");
    } catch (err) {
      console.warn("Failed to delete report from remote server, local update succeeded:", err);
      showToast("Report removed from vault.");
    }
  };

  const handleResetAll = async (bypassConfirm = false) => {
    if (!bypassConfirm) return;
    
    soundManager.playSparkle();
    
    // 1. Reset client-side states
    setHistory([]);
    setCurrentReport(null);
    setCumulativeDNA(null);
    setErrorMessage(null);
    
    if (onIntelCountChange) onIntelCountChange(0);

    // 2. Clear all cached keys
    const keysToReset = [
      "creatoros_intel_history",
      "creatoros_cumulative_dna",
      "creatoros_progress_intel",
      "creatoros_comparison_intel",
      "creatoros_evolution_data",
      "creatoros_audience_memory_graph",
      "creatoros_content_systems",
      "creatoros_campaign_plans",
      "creatoros_content_calendars",
      "creatoros_experiment_labs",
      "creatoros_forecast_reports",
      "creatoros_segment_maps",
      "creatoros_archive_intelligence",
      "creatoros_season_intel",
      "creatoros_trend_intel",
      "creatoros_gap_intel"
    ];
    keysToReset.forEach(key => localStorage.removeItem(key));

    // 3. Remote Reset trigger
    try {
      await fetch("/api/creator-intelligence/reset", {
        method: "POST"
      }).catch(e => console.log("Database reset delay/offline context", e));
    } catch (err) {
      console.log("Database reset failed:", err);
    }

    // Dispatch reload event for all listening modules
    window.dispatchEvent(new Event("storage"));
    
    // Refresh to force clean slate states on all sub-components beautifully
    window.location.reload();
  };

  const loadMockForMode = (mode: string, currentHistoryList?: CreatorIntelligenceReport[]) => {
    const list = currentHistoryList || history;
    const matched = list.find(item => item.mode === mode);
    setCurrentReport(matched || null);
  };

  // Sync state with Supabase and localStorage fallback
  useEffect(() => {
    const fetchIntelHistory = async () => {
      let loadedHistory: CreatorIntelligenceReport[] = [];
      try {
        const response = await fetch("/api/creator-intelligence/history");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.source === "supabase") {
            loadedHistory = result.data || [];
          }
        }
      } catch (err) {
        console.warn("Failed to fetch Creator Intelligence history from server, using local fallback:", err);
      }

      if (loadedHistory.length === 0) {
        const savedHistory = localStorage.getItem("creatoros_intel_history");
        if (savedHistory) {
          try {
            loadedHistory = JSON.parse(savedHistory);
          } catch {}
        }
      }

      // Automatically sync everything everyday with Current date
      let syncedHistory = loadedHistory;
      if (loadedHistory.length > 0) {
        syncedHistory = autoSyncEverything(loadedHistory);
      }

      setHistory(syncedHistory);
      localStorage.setItem("creatoros_intel_history", JSON.stringify(syncedHistory));
      if (onIntelCountChange) onIntelCountChange(syncedHistory.length);

      // Select active report matching activeMode, if any
      const modeToSearch = localStorage.getItem("creatoros_intel_active_mode") || "script_doctor";
      const matched = syncedHistory.find(item => item.mode === modeToSearch);
      setCurrentReport(matched || (syncedHistory.length > 0 ? syncedHistory[0] : null));
    };

    const fetchCreatorDNA = async () => {
      try {
        const response = await fetch("/api/creator-intelligence/dna");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setCumulativeDNA(result.data);
            localStorage.setItem("creatoros_cumulative_dna", JSON.stringify(result.data));
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch Creator DNA from server:", err);
      }

      // Local fallback
      const savedDNA = localStorage.getItem("creatoros_cumulative_dna");
      if (savedDNA) {
        try {
          setCumulativeDNA(JSON.parse(savedDNA));
        } catch (e) {
          setCumulativeDNA(null);
        }
      } else {
        setCumulativeDNA(null);
      }
    };

    fetchIntelHistory();
    fetchCreatorDNA();

    // Sync active mode selection
    const savedMode = localStorage.getItem("creatoros_intel_active_mode");
    const savedTab = localStorage.getItem("creatoros_intel_active_category_tab");
    if (savedTab) {
      setActiveCategoryTab(savedTab);
    }
    if (savedMode) {
      setActiveMode(savedMode);
    }
  }, [onIntelCountChange]);

  const handleModeChange = (key: string) => {
    soundManager.playClick();
    setActiveMode(key);
    localStorage.setItem("creatoros_intel_active_mode", key);
    loadMockForMode(key);
    setErrorMessage(null);
  };

  const handleCategoryTabChange = (key: string) => {
    soundManager.playClick();
    setActiveCategoryTab(key);
    localStorage.setItem("creatoros_intel_active_category_tab", key);
    if (key === "script_doctor") {
      handleModeChange("script_doctor");
    } else if (key === "leak_detector") {
      handleModeChange("performance_analyzer");
    } else if (key === "winner_loser") {
      handleModeChange("winner_loser_comparison");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run dynamic analysis API connection
  const handleAnalyze = async (inputData: any) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    soundManager.playSparkle();

    // Staged loading state machine logic
    const steps = [
      "STAGE A: Parsing Input Variables & Metrics...",
      "STAGE B: Extracting Script Narrative Coordinates...",
      "STAGE C: Formulating Hook and Retention Diagnostic Matrices...",
      "STAGE D: Sifting Comparative Patterns & DNA Markers...",
      "STAGE E: Synthesizing Dynamic Strategist Report JSON..."
    ];

    let currentStepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setLoadingStep(steps[currentStepIdx]);
      }
    }, 1500);

    try {
      const response = await fetch("/api/creator-intelligence/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: activeMode, inputData })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errDetails = await response.json();
        throw new Error(errDetails.error || "Synthesis Failed.");
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error("Invalid report response envelope received from engine.");
      }

      // Add report metadata
      const newReport: CreatorIntelligenceReport = {
        ...result.data,
        id: "intel_" + Date.now(),
        createdAt: new Date().toISOString()
      };

      setCurrentReport(newReport);
      
      // Update historical archives securely
      const updatedHistory = [newReport, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("creatoros_intel_history", JSON.stringify(updatedHistory));

      // Sync count dynamically
      if (onIntelCountChange) onIntelCountChange(updatedHistory.length);

      // Async write to Supabase history backup table (Stage 8)
      try {
        fetch("/api/creator-intelligence/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReport)
        }).catch(e => console.warn("Supabase backup delayed/offline", e));
      } catch (err) {
        console.warn("Supabase backup failed", err);
      }

      // If Creator DNA is updated during active analysis, write back to live DNA profile table (Stage 1 & 8)
      if (newReport.creatorDNAUpdate) {
        setCumulativeDNA(newReport.creatorDNAUpdate);
        localStorage.setItem("creatoros_cumulative_dna", JSON.stringify(newReport.creatorDNAUpdate));
        try {
          fetch("/api/creator-intelligence/dna", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReport.creatorDNAUpdate)
          }).catch(e => console.warn("Creator DNA database sync offline/delayed", e));
        } catch (err) {
          console.warn("Creator DNA database sync offline", err);
        }
      }

      // Successfully generated sound
      soundManager.playSuccess();
      showToast("Strategist Report Synthesized & DNA Profile Updated!");

    } catch (err: any) {
      console.error(err);
      soundManager.playError();
      setErrorMessage(
        err.message || 
        "Synthesis failed on server gateway. Please verify your GEMINI_API_KEY parameters inside the Secrets Sidebar."
      );
    } finally {
      setIsAnalyzing(false);
      setLoadingStep("");
    }
  };

  // Single report export logic
  const handleExportMarkdown = (report: CreatorIntelligenceReport) => {
    const mdContent = `\
# CREATOR INTELLIGENCE EVALUATION REPORT
**Mode:** ${report.mode.toUpperCase()}
**Title:** ${report.title}
**Date:** ${new Date(report.createdAt).toUTCString()}

## EXECUTIVE SUMMARY
${report.summary}

## DIAGNOSTIC DIMENSION RATINGS
- Hook strength: ${report.scores.hook.score}% (${report.scores.hook.label})
- Retention potential: ${report.scores.retention.score}% (${report.scores.retention.label})
- Narrative flow: ${report.scores.flow.score}% (${report.scores.flow.label})
- Audience matching index: ${report.scores.audienceMatch.score}% (${report.scores.audienceMatch.label})
- Compounded core grade: ${report.scores.overall.score}% (${report.scores.overall.label})

## EXECUTIVE STRATEGY PLAYBOOK
### Keep Doing
${report.strategy.keepDoing.map(x => `- ${x}`).join("\n")}

### Stop Doing
${report.strategy.stopDoing.map(x => `- ${x}`).join("\n")}

### Critical Bottleneck
${report.strategy.biggestBottleneck}

### Highest Leverage Fix
${report.strategy.highestLeverageFix}

## DETAILED SCRIPT REWRITE ALTERNATIVE
${report.improvedVersion}
`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CI-Report-${report.id}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Markdown Report Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-[#070608] text-slate-100 pb-20 relative select-none selection:bg-[#cca972]/30 selection:text-white">
      {/* Absolute faint copper mesh grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cca972/[0.015]_1px,transparent_1px),linear-gradient(to_bottom,#cca972/[0.015]_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Primary toast container popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#cca972] text-[#070608] font-sans font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-[#070608]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 relative">
        
        {/* HERO SECTION - The Obsidian Strategy Lab */}
        <div className="relative border border-[#232225] bg-[#0c0b0e] p-8 rounded-2xl shadow-3xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#cca972]/[0.025] to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#cca972]/20 to-transparent" />
          
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#cca972] bg-[#cca972]/10 px-3 py-1 rounded-full border border-[#cca972]/20 inline-block font-sans">
              ✦ India-First Strategy Engine
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
              The Indian Creator Strategy Lab
            </h1>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Tweak your Hinglish scripts, check retention hooks for Indian platform styles, compare video structures, and build your local audience growth blueprints.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 self-start md:self-center">
            {isResetConfirming ? (
              <div className="flex items-center gap-1.5 bg-rose-950/20 border border-rose-500/40 p-1 rounded-xl transition duration-200">
                <span className="text-[9px] uppercase font-bold text-rose-300 px-2 font-mono">Really Reset?</span>
                <button
                  type="button"
                  onClick={() => {
                    handleResetAll(true);
                    setIsResetConfirming(false);
                  }}
                  className="bg-rose-600 hover:bg-rose-550 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg cursor-pointer transition duration-150"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetConfirming(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg cursor-pointer transition duration-150"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                id="ResetIntelligenceLabButton"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setIsResetConfirming(true);
                }}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-rose-400 hover:text-rose-350 bg-rose-950/15 hover:bg-rose-950/30 px-3.5 py-2.5 rounded-xl border border-rose-900/40 transition duration-200 cursor-pointer"
                title="Reset all pre-existing creator intelligence database logs and cached reports"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Lab Data</span>
              </button>
            )}

            {currentReport && (
              <button
                type="button"
                onClick={() => handleExportMarkdown(currentReport)}
                className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 hover:text-[#cca972] bg-white/[0.02] hover:bg-white/[0.04] px-4 py-2.5 rounded-xl border border-[#232225] transition duration-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Executive Report</span>
              </button>
            )}
          </div>
        </div>

        {/* PREMIUM EXECUTIVES LAB TABS */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#cca972] font-sans">Strategic Workspace Modules</h2>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Explore real-time data logs, intelligence engines, and predictive Indian market radars.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 pb-2">
            {[
              { key: "script_doctor", label: "Script Doctor", icon: Sparkles },
              { key: "leak_detector", label: "Leak Detector", icon: Activity },
              { key: "winner_loser", label: "Winner vs Loser", icon: Award },
              { key: "creator_dna", label: "Creator DNA Lab", icon: Brain },
              { key: "scorecard_charts", label: "Scorecard & Progress", icon: TrendingUp },
              { key: "trend_season", label: "Trend & Season Radar", icon: Sliders },
              { key: "creator_evolution", label: "Evolution Engine", icon: RefreshCw },
              { key: "audience_memory", label: "Audience Memory", icon: Users },
              { key: "content_systems", label: "Content System", icon: Cpu },
              { key: "campaigns_calendar", label: "Campaigns & Cal", icon: Calendar },
              { key: "experiment_forecast", label: "Strategic Labs", icon: Compass },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeCategoryTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleCategoryTabChange(tab.key)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-[85px] transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-br from-[#cca972]/15 to-transparent border-[#cca972]/50 scale-[1.03] shadow-[0_0_15px_-4px_rgba(204,169,114,0.15)] text-white font-semibold"
                      : "bg-[#0c0b0e] border-[#1c1b1e] hover:border-[#38373b] hover:bg-[#141316] text-[#b0afb2]"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className={`p-1 rounded-md ${isActive ? "bg-[#cca972]/20 text-[#cca972]" : "bg-black/30 text-slate-500 group-hover:text-slate-300"}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#cca972] animate-ping" />
                    )}
                  </div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider font-sans mt-2 truncate w-full">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONDITIONALLY RENDER ACTIVE WORKSPACE PANELS */}
        {(activeCategoryTab === "script_doctor" || activeCategoryTab === "leak_detector" || activeCategoryTab === "winner_loser") && (
          <div className="space-y-8">
            {/* INPUT PANEL COCHRAN HUB */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <InputWorkspace 
                activeMode={activeMode} 
                isAnalyzing={isAnalyzing} 
                onAnalyze={handleAnalyze} 
              />
            </div>
          </div>
        )}

        {/* ERROR STATE VIEW */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-rose-950/[0.04] border border-rose-950/45 text-rose-450 text-rose-400 rounded-2xl flex items-start gap-3.5"
          >
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider">Strategic Pipeline Error</h4>
              <p className="text-xs text-slate-300 leading-normal font-sans">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* INTENTIONAL PREMIUM LOADING STATE SKELETON */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 pointer-events-none select-none py-10"
            >
              <div className="text-center space-y-3 max-w-md mx-auto py-4">
                <div className="relative w-12 h-12 mx-auto">
                  <RefreshCw className="w-10 h-10 text-[#cca972] animate-spin opacity-80" />
                  <Cpu className="w-5 h-5 text-white absolute inset-0 m-auto" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#cca972] font-sans">{loadingStep}</h3>
                <p className="text-[10px] text-slate-500">Compiling structural vectors, grading hooks algorithms, and aligning output schemas...</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 opacity-35">
                <div className="md:col-span-4 h-56 bg-slate-900/30 rounded-2xl animate-pulse border border-slate-900" />
                <div className="md:col-span-8 h-56 bg-slate-900/30 rounded-2xl animate-pulse border border-slate-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE DISPLAY SUB-MODULES */}
        {(activeCategoryTab === "script_doctor" || activeCategoryTab === "leak_detector" || activeCategoryTab === "winner_loser") && currentReport && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* COMPONENT 1: METRICS HUB AREA */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#cca972] tracking-wider font-sans">Compacted Strategic Summary</span>
                <p className="text-sm font-medium text-white italic leading-relaxed mt-1">"{currentReport.summary}"</p>
              </div>
              <ScoreHub scores={currentReport.scores} />
            </div>

            {/* COMPONENT 2: PLAYBOOK PANEL */}
            <StrategyPlaybook strategy={currentReport.strategy} />

            {/* COMPONENT 3: SCRIPT REWRITE ALTERNATIVES */}
            {(currentReport.improvedVersion || currentReport.shorterVersion || currentReport.punchierVersion) && (
              <ProductionSuite 
                originalText="Source evaluation script parsed successfully." 
                improvedVersion={currentReport.improvedVersion}
                shorterVersion={currentReport.shorterVersion}
                punchierVersion={currentReport.punchierVersion}
              />
            )}

            {/* COMPONENT 4: SCRIPT STRUCTURAL MAP */}
            {currentReport.structure && currentReport.structure.length > 0 && (
              <ScriptAnatomy structure={currentReport.structure} />
            )}

            {/* COMPONENT 5: CREATOR DNA */}
            {currentReport.creatorDNAUpdate && (
              <CreatorDNAView dna={currentReport.creatorDNAUpdate} />
            )}
          </motion.div>
        )}

        {/* TAB 4: CREATOR DNA MODULES SUITE */}
        {activeCategoryTab === "creator_dna" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <CreatorDNAView dna={cumulativeDNA || MOCK_DNA_REPORT.creatorDNAUpdate!} />
            <HookIntelligenceModule />
            <CtaIntelligenceModule />
            <AudiencePersonaModule />
          </motion.div>
        )}

        {/* TAB 5: SCORECARD & PROGRESS TRAJECTORY SUITE */}
        {activeCategoryTab === "scorecard_charts" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-2">
              <span className="text-[9px] uppercase font-bold text-[#cca972]">Overall Quality Score Target</span>
              <ScoreHub scores={currentReport?.scores || MOCK_SCRIPT_DOCTOR_REPORT.scores} />
            </div>
            <ProgressDashboardModule />
            <ComparisonHistoryModule />
          </motion.div>
        )}

        {/* TAB 6: TREND & SEASON OPPORTUNITIES SUITE */}
        {activeCategoryTab === "trend_season" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <TrendRadarModule />
            <FestivalSeasonModule />
            <ContentGapRadarModule />
            <CompetitorDeconstructionModule />
          </motion.div>
        )}

        {/* TAB 7: CREATOR EVOLUTION WORKSPACE */}
        {activeCategoryTab === "creator_evolution" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <CreatorEvolutionModule />
          </motion.div>
        )}

        {/* TAB 8: AUDIENCE BEHAVIOR MEMORY GRAPH */}
        {activeCategoryTab === "audience_memory" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <AudienceMemoryModule />
          </motion.div>
        )}

        {/* TAB 9: CONTENT SYSTEM BUILDER */}
        {activeCategoryTab === "content_systems" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <ContentSystemModule />
          </motion.div>
        )}

        {/* TAB 10: CAMPAIGNS & CALENDAR ENGAGEMENT MANAGER */}
        {activeCategoryTab === "campaigns_calendar" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <CampaignCalendarModule />
          </motion.div>
        )}

        {/* TAB 11: HYPOTHESIS LAB & PREDICTIVE FORECASTER */}
        {activeCategoryTab === "experiment_forecast" && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <ExperimentForecastModule />
          </motion.div>
        )}

        {/* EMPTY STATE - WHEN CURRENT REPORT IS DELETED OR OFFLINE */}
        {!currentReport && !isAnalyzing && (activeCategoryTab === "script_doctor" || activeCategoryTab === "leak_detector" || activeCategoryTab === "winner_loser") && (
          <div className="p-12 border border-[#232225] bg-[#0c0b0e] h-[220px] rounded-2xl flex flex-col justify-center items-center text-center space-y-3 shadow-xl animate-fade-in">
            <BookOpen className="w-8 h-8 text-[#cca972]" />
            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-widest font-sans">
                {activeCategoryTab === "script_doctor" ? "Script Doctor Lab Workspace" : activeCategoryTab === "leak_detector" ? "Leak Detector Operational Desk" : "Winner/Loser Comparison Suite"}
              </h4>
              <p className="text-xs text-slate-400 mt-2">
                {activeCategoryTab === "script_doctor" 
                  ? "No content available yet. Generate a script inside Script Lab or paste one manually." 
                  : activeCategoryTab === "leak_detector" 
                  ? "No script detected. Generate or paste content to begin analysis." 
                  : "No comparison available yet. Paste your winner vs loser content packages to begin gap analysis."}
              </p>
            </div>
          </div>
        )}

        {/* HISTORIC ARCHIVES VAULT CONTAINER */}
        <HistoryVault 
          history={history} 
          activeReportId={currentReport?.id} 
          onSelectReport={(report) => {
            setCurrentReport(report);
            setActiveMode(report.mode);
          }} 
          onExportMarkdown={handleExportMarkdown} 
          onDeleteReport={handleDeleteReport}
        />

      </div>
    </div>
  );
}
