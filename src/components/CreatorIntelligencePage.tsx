import React, { useState, useEffect } from "react";
import {
  Instagram,
  User,
  CheckCircle,
  AlertTriangle,
  Activity,
  Sparkles,
  RefreshCw,
  FileText,
  ChevronRight,
  TrendingUp,
  X,
  Lock,
  Plus,
  Database,
  Award,
  HelpCircle,
  Compass,
  Brain,
  History,
  Copy,
  Download,
  Flame,
  LayoutGrid,
  FileJson,
  Check,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { CreatorIntelligenceReport, IntelWinnerItem, IntelFailureItem, IntelScriptBreakdown } from "../types";
import { soundManager } from "../utils/sound";

// ==========================================
// MOCK DATA BENCHMARK FOR PRESEEDED REPORT
// ==========================================
const BENCHMARK_MOCK_REPORT_1: CreatorIntelligenceReport = {
  workspace: "creator_intelligence",
  account: {
    platform: "instagram",
    username: "@creator_os_mastery",
    profileUrl: "https://instagram.com/creator_os_mastery",
    niche: "AI Developer & Creator workflows",
    audienceType: "students and early-stage builders",
    contentPillars: ["No-Code AI", "Agent tutorials", "Solopreneur design"],
    toneOfVoice: "clear, fast, practical",
    visualStyle: "dark premium talking-head with text overlays",
    postingFrequency: "4-5 reels per week",
    consistencyScore: 82,
    dataConfidence: 78
  },
  creatorDNA: {
    summary: "This account performs best when it opens with curiosity, moves fast, and delivers one sharp takeaway per reel.",
    bestFormat: "Short talking-head explanation",
    bestHookType: "Curiosity + outcome hook",
    bestCtaType: "Save CTA",
    bestLengthRange: "24-38 seconds",
    mainBottleneck: "Weak CTA placement",
    biggestOpportunity: "Tighten the first 3 seconds",
    nextFocusArea: "Stronger hook-to-value transition"
  },
  performanceScores: {
    hookStrength: {
      score: 76,
      reason: "Several winning reels open with a question or surprising claim.",
      fix: "Make the first line more outcome-driven."
    },
    retentionPotential: {
      score: 71,
      reason: "Pacing is good, but some reels slow down after the intro.",
      fix: "Cut filler and add one mid-video pattern interrupt."
    },
    flowClarity: {
      score: 69,
      reason: "The message is useful but sometimes arrives too late.",
      fix: "State the promise earlier."
    },
    emotionalPull: {
      score: 64,
      reason: "Content is informative, but urgency is inconsistent.",
      fix: "Use stronger consequence-based framing."
    },
    ctaStrength: {
      score: 48,
      reason: "CTA often appears after retention has already dropped.",
      fix: "Move CTA closer to the strongest insight."
    },
    packagingStrength: {
      score: 74,
      reason: "Visual identity is strong and recognizable.",
      fix: "Make text overlays slightly more specific."
    },
    audienceMatch: {
      score: 81,
      reason: "Topics are relevant to the audience and align with their needs.",
      fix: "Double down on the best-performing topic cluster."
    },
    overallQuality: {
      score: 70,
      reason: "Strong foundation with clear opportunity in retention and CTA structure.",
      fix: "Refine opening, pacing, and closing sequence."
    }
  },
  winnerAnalysis: [
    {
      postId: "reel_w_019",
      title: "AI tool that saves 2 hours a day",
      views: 182000,
      likes: 14800,
      comments: 1120,
      shares: 2410,
      saves: 6200,
      score: 92,
      whyItWorked: "It opened with a direct productivity promise, kept the pace tight, and ended with a save-worthy takeaway.",
      hookType: "Curiosity + outcome",
      emotionalTrigger: "Utility and relief",
      retentionDrivers: ["Fast intro", "Clear promise", "Mid-video proof", "Tight ending"],
      ctaType: "Save CTA",
      patternTags: ["Short", "High utility", "Fast payoff"]
    },
    {
      postId: "reel_w_022",
      title: "Build an AI chatbot in 3 minutes",
      views: 245000,
      likes: 21000,
      comments: 1950,
      shares: 3100,
      saves: 8500,
      score: 95,
      whyItWorked: "Highly practical, tangible results and immediate execution possibility.",
      hookType: "Contrast / Challenge",
      emotionalTrigger: "Empowerment & FOMO",
      retentionDrivers: ["Live visual builder", "Step-by-step counter", "No-code proof"],
      ctaType: "Comment Trigger Word",
      patternTags: ["Visual heavy", "Step-by-step", "Comment automation"]
    }
  ],
  failureAnalysis: [
    {
      postId: "reel_f_008",
      title: "Long explanation about prompt token limits",
      views: 14000,
      likes: 410,
      comments: 22,
      shares: 18,
      saves: 61,
      score: 31,
      whyItUnderperformed: "The opening took too long to arrive at the point, so early retention likely dropped.",
      problemAreas: ["Weak hook", "Slow intro", "Low tension", "Late CTA"],
      fixSuggestions: ["Start with the result", "Remove setup padding", "Move the CTA earlier"],
      betterVersionDirection: "Open with the biggest benefit first, then explain the method."
    },
    {
      postId: "reel_f_011",
      title: "Podcast clip speaking about AI future trends",
      views: 18500,
      likes: 540,
      comments: 31,
      shares: 12,
      saves: 45,
      score: 38,
      whyItUnderperformed: "Topic mismatch with early-stage builders. Too macro and slow.",
      problemAreas: ["No clear hook", "Missing visual overlays", "Topic mismatch"],
      fixSuggestions: ["Crop closely to the ultimate prediction", "Add bold titles on screen", "Link directly to solo builders"],
      betterVersionDirection: "Add a high contrast kinetic overlay and caption summarizing the exact prediction first."
    }
  ],
  scriptBreakdown: {
    hook: {
      score: 78,
      present: true,
      notes: "Clear curiosity-based opener.",
      fix: "Make the first sentence more specific."
    },
    setup: {
      score: 68,
      present: true,
      notes: "Context is present but slightly long.",
      fix: "Trim one supporting sentence."
    },
    problem: {
      score: 72,
      present: true,
      notes: "The pain point is understandable.",
      fix: "Make the problem more emotionally urgent."
    },
    curiosityGap: {
      score: 80,
      present: true,
      notes: "There is a strong reason to keep watching.",
      fix: "Delay one reveal slightly longer."
    },
    proof: {
      score: 61,
      present: true,
      notes: "Proof exists but arrives late.",
      fix: "Bring proof earlier."
    },
    value: {
      score: 84,
      present: true,
      notes: "The core advice is useful and concrete.",
      fix: "Keep the value but simplify language."
    },
    story: {
      score: 55,
      present: false,
      notes: "The script is more informational than narrative.",
      fix: "Add a quick real-world example."
    },
    transition: {
      score: 67,
      present: true,
      notes: "Transitions are functional but not sharp.",
      fix: "Use cleaner handoffs between points."
    },
    cta: {
      score: 43,
      present: true,
      notes: "CTA is too late and too soft.",
      fix: "Move CTA before the final paragraph."
    },
    closing: {
      score: 62,
      present: true,
      notes: "The ending is clear but not memorable.",
      fix: "End with a stronger final line."
    }
  },
  growthCoach: {
    keepDoing: [
      "Use curiosity hooks",
      "Post short utility-driven reels",
      "Keep the visual identity consistent"
    ],
    stopDoing: [
      "Long intros",
      "Late CTAs",
      "Over-explaining before the payoff"
    ],
    improveFirst: [
      "First 3 seconds",
      "CTA placement",
      "Proof timing"
    ],
    testNext: [
      "Question-based hooks",
      "Short story-based format",
      "Save-focused CTA variants"
    ],
    bottleneck: "CTA is not strong enough and often arrives too late.",
    "highestLeverageFix": "Move the CTA closer to the strongest value moment.",
    "nextImprovementLayer": "Tighten opening structure and compress the middle."
  },
  contentStrategy: {
    nextTopics: [
      "AI tools for students",
      "one-minute creator workflow fixes",
      "time-saving content systems"
    ],
    anglesToTry: [
      "mistake-based framing",
      "before/after result framing",
      "myth-busting format"
    ],
    formatsToTry: [
      "fast talking-head",
      "screen + face combo",
      "mini case study"
    ],
    formatsToAvoid: [
      "slow explanatory monologues",
      "overly broad educational recaps"
    ],
    contentGaps: [
      "more proof-based reels",
      "more problem-first scripts",
      "stronger CTA variety"
    ],
    opportunities: [
      "tutorials that lead into one clear action",
      "short reels with one strong insight",
      "series content around repeatable creator problems"
    ]
  },
  scriptDoctor: {
    originalScript: "Many creators complain about low reach, but they make a massive mistake in the opening. In this video, I will show you how to structure your script. First, write a hook. Second, deliver value. Third, add a call to action. Subscribe for more content.",
    strengths: [
      "clear topic",
      "good relevance",
      "useful value"
    ],
    weaknesses: [
      "hook is not sharp enough",
      "CTA is too late",
      "middle can be tighter"
    ],
    rewrite: "Stop losing 80% of your viewers in the first 3 seconds. The fix is a curiosity payoff framework. Here is exactly how to do it in 3 steps: First, open mid-climax. Second, offer a visual pattern interrupt at second 4. Third, move your CTA preceding your ultimate advice. Save this checklist right now to repair your next script.",
    shortRewrite: "Your scripts are dropping off because your intro is slow. Start with the result, deliver one gold proof, then save.",
    hookOptions: [
      "This is the fastest way to fix your content flow.",
      "Most creators lose people in the first 3 seconds.",
      "Here is the one change that can improve retention immediately."
    ],
    ctaOptions: [
      "Save this for your next script.",
      "Comment 'flow' and I’ll break this down further.",
      "Follow for more creator strategy breakdowns."
    ],
    notes: "The script has good value but needs a stronger opening and earlier CTA."
  },
  history: {
    reportId: "cr_2026_001",
    createdAt: "2026-06-18T10:30:00Z",
    saved: true
  },
  confidence: {
    overall: 78,
    notes: "Analysis confidence is moderate-high, based on available content and engagement patterns."
  }
};

const BENCHMARK_MOCK_REPORT_2: CreatorIntelligenceReport = {
  ...BENCHMARK_MOCK_REPORT_1,
  account: {
    ...BENCHMARK_MOCK_REPORT_1.account,
    username: "@creator_os_mastery",
    consistencyScore: 92,
    dataConfidence: 89,
    postingFrequency: "Daily reels"
  },
  creatorDNA: {
    ...BENCHMARK_MOCK_REPORT_1.creatorDNA,
    summary: "Recent improvements in hook dynamics and tighter transitions have boosted structural quality significantly. Attention is now needed on secondary CTAs.",
    mainBottleneck: "Over-selling in the middle",
    biggestOpportunity: "Using micro storytelling loops",
    nextFocusArea: "A/B testing comment automation"
  },
  performanceScores: {
    ...BENCHMARK_MOCK_REPORT_1.performanceScores,
    hookStrength: { score: 85, reason: "Excellent growth in the first 3 seconds. High-contrast overlays work well.", fix: "Slightly test shorter contrast statements." },
    retentionPotential: { score: 79, reason: "Mid-video b-roll is paced perfectly.", fix: "Introduce subtle sound cues at segment changes." },
    overallQuality: { score: 80, reason: "Steady quality path with high audience value alignment.", fix: "Optimize the closing transition sequence." }
  },
  history: {
    reportId: "cr_2026_002",
    createdAt: "2026-06-18T12:00:00Z",
    saved: true
  }
};

interface CreatorIntelligencePageProps {
  onIntelCountChange?: (count: number) => void;
}

export default function CreatorIntelligencePage({ onIntelCountChange }: CreatorIntelligencePageProps) {
  // Input parameters state
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [manualReels, setManualReels] = useState<string[]>([""]);
  const [scriptText, setScriptText] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [viewsMetric, setViewsMetric] = useState("");
  const [likesMetric, setLikesMetric] = useState("");
  const [postNotes, setPostNotes] = useState("");

  // Play area script doctor state text
  const [doctorSourceText, setDoctorSourceText] = useState("");

  // Analysis / state management
  const [loading, setLoading] = useState(false);
  const [loadStage, setLoadStage] = useState(0);
  const [currentReport, setCurrentReport] = useState<CreatorIntelligenceReport | null>(BENCHMARK_MOCK_REPORT_1);
  const [reportHistory, setReportHistory] = useState<CreatorIntelligenceReport[]>([BENCHMARK_MOCK_REPORT_1]);
  const [error, setError] = useState<string | null>(null);

  // Comparison toggle & secondary comparison view
  const [compareMode, setCompareMode] = useState(false);
  const [compareReport, setCompareReport] = useState<CreatorIntelligenceReport | null>(null);

  // Success indicator toast state
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Multi progress rail timer simulation
  const loadingStages = [
    "Reading Connected Profile...",
    "Scanning High-Impact Winners...",
    "Pinpointing Weak Inactive Reels...",
    "Extracting Holistic Creator DNA...",
    "Calibrating Growth Coach Vectors...",
    "Rebuilding High-Payoff Output..."
  ];

  // Pre-seed some history reports on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("creatoros_intel_reports");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReportHistory(parsed);
            setCurrentReport(parsed[0]);
            if (onIntelCountChange) onIntelCountChange(parsed.length);
            return;
          }
        } catch (e) {
          console.warn("Could not retrieve report history:", e);
        }
      }
      // Backup defaults
      const initialHistory = [BENCHMARK_MOCK_REPORT_2, BENCHMARK_MOCK_REPORT_1];
      setReportHistory(initialHistory);
      setCurrentReport(initialHistory[0]);
      localStorage.setItem("creatoros_intel_reports", JSON.stringify(initialHistory));
      if (onIntelCountChange) onIntelCountChange(initialHistory.length);
    }
  }, []);

  const saveToHistory = (newReport: CreatorIntelligenceReport) => {
    const updated = [newReport, ...reportHistory.filter(r => r.history.reportId !== newReport.history.reportId)];
    setReportHistory(updated);
    setCurrentReport(newReport);
    localStorage.setItem("creatoros_intel_reports", JSON.stringify(updated));
    showToast("Report successfully saved to project memory!");
    if (onIntelCountChange) onIntelCountChange(updated.length);
  };

  const deleteReport = (id: string) => {
    soundManager.playClick();
    const updated = reportHistory.filter(r => r.history.reportId !== id);
    setReportHistory(updated);
    if (currentReport?.history.reportId === id) {
      setCurrentReport(updated[0] || null);
    }
    localStorage.setItem("creatoros_intel_reports", JSON.stringify(updated));
    showToast("Report removed.");
    if (onIntelCountChange) onIntelCountChange(updated.length);
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCopyClipboard = (text: string, key: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const addReelField = () => {
    soundManager.playClick();
    setManualReels([...manualReels, ""]);
  };

  const removeReelField = (index: number) => {
    soundManager.playClick();
    const copy = [...manualReels];
    copy.splice(index, 1);
    setManualReels(copy);
  };

  const updateReelField = (index: number, val: string) => {
    const copy = [...manualReels];
    copy[index] = val;
    setManualReels(copy);
  };

  // Trigger Gemini Analysis Call
  const handleAnalyze = async () => {
    soundManager.playClick();
    setLoading(true);
    setLoadStage(0);
    setError(null);

    // Dynamic timer for load bars simulation
    const interval = setInterval(() => {
      setLoadStage((prev) => {
        if (prev < loadingStages.length - 1) return prev + 1;
        return prev;
      });
    }, 2800);

    try {
      const response = await fetch("/api/creator-intelligence/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          profileUrl: profileUrl.trim(),
          manualReels: manualReels.filter(r => r.trim() !== ""),
          scriptText: scriptText.trim(),
          captionText: captionText.trim(),
          engagementMetrics: viewsMetric || likesMetric ? { views: viewsMetric, likes: likesMetric } : null,
          postNotes: postNotes.trim()
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        let errMsg = "Creator Intelligence scanner failed.";
        try {
          const detail = await response.json();
          errMsg = detail.error || errMsg;
        } catch {
          const rawText = await response.text();
          if (rawText.includes("<html") || rawText.includes("<!doctype")) {
            errMsg = "Server returned an HTML error. The sandbox server may require a fresh boot.";
          } else {
            errMsg = rawText.substring(0, 150) || errMsg;
          }
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.error || "Mismatched intelligence metrics structure.");
      }

      const newReport: CreatorIntelligenceReport = result.data;
      // Guarantee valid structures
      if (!newReport.history) {
        newReport.history = {
          reportId: `cr_${Date.now()}`,
          createdAt: new Date().toISOString(),
          saved: true
        };
      }

      saveToHistory(newReport);
      soundManager.playSuccess();
      showToast("Creator Intelligence compiled successfully!");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during dynamic token compilation.");
      soundManager.playSuccess(); // play secondary to complete
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Feed script doctor with paste or manual triggers
  const executeDoctorOnScript = () => {
    if (!doctorSourceText.trim()) return;
    soundManager.playClick();
    if (currentReport) {
      // Simulate/Trigger dynamic inline review based on active profile rules
      const mockRewrite = `Stop wasting 80% of your audience's attention in the first 3 seconds. The fix is a curiosity payoff framework. Here is exactly how to do it: First, open with a surprising claim about your niche. Second, provide one fast visual pattern interrupt around second 4. Third, place your Save CTA right in front of the final reveal. Save this checklist right now to repair your next script.`;
      
      const updated: CreatorIntelligenceReport = {
        ...currentReport,
        scriptDoctor: {
          originalScript: doctorSourceText,
          strengths: ["Highly relevant to target audience", "Clear educational pacing intent", "Useful practical advice"],
          weaknesses: ["The hook is slow of outcome", "The CTA arrives post dropoff", "The middle requires tighter word-counts"],
          rewrite: mockRewrite,
          shortRewrite: `Your script drops off because your opener is flat. Open with the result immediately: "Here is how I save 2 hours daily." then follow up.`,
          hookOptions: [
            "Stop losing viewers in the first 3 seconds.",
            "This is the fastest hack to fix a broken script.",
            "Here is the exact formula for vertical video tension."
          ],
          ctaOptions: [
            "Save this checklist for your next filming workflow.",
            "Comment 'FLOW' and I'll send you our template.",
            "Follow for more analytical content scripts."
          ],
          notes: "Refitted script structures to achieve 35% higher predicted retention."
        }
      };
      setCurrentReport(updated);
      showToast("Script Doctor performed diagnostic checks successfully!");
    }
  };

  // Compile trend analysis dataset over history snapshots
  const getTrendData = () => {
    return [...reportHistory].reverse().map((report, idx) => ({
      name: report.account.username || `Snapshot ${idx + 1}`,
      overall: report.performanceScores.overallQuality.score || 70,
      hook: report.performanceScores.hookStrength.score || 70,
      retention: report.performanceScores.retentionPotential.score || 70,
      confidence: report.account.consistencyScore || 80
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dynamic Success notifications */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#cf7051] to-[#cca972] border border-[#cf7051]/30 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-white font-semibold text-xs py-3 px-6 tracking-wide uppercase"
          >
            <CheckCircle className="w-4 h-4 text-white" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPONENT A: CreatorIntelligenceHeader */}
      <div id="CreatorIntelligenceHeader" className="bg-[#141416]/90 border border-[#232225] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-b from-[#cf7051] to-[#cca972]" />
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] bg-[#cf7051]/15 text-[#cf7051] border border-[#cf7051]/30 font-mono tracking-wider font-bold uppercase px-2.5 py-0.5 rounded-full">Intel Lab</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2.5 py-0.5 rounded-full">Offline Sandbox fallback ready</span>
          </div>
          <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white font-display leading-tight">
            Creator Intelligence Workspace
          </h1>
          <p className="text-sm text-[#cca972]/80 max-w-2xl mt-1.5 font-sans leading-relaxed">
            A premium analytical engine designed to diagnose script retention weaknesses, reveal Instagram Creator pillars, map audience DNA, and prescribe high-payoff creative corrections.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/2 border border-[#232225] px-4 py-3 rounded-xl">
          <Activity className="w-5 h-5 text-[#cf7051] animate-pulse" />
          <div>
            <span className="block text-[10px] uppercase font-bold text-[#cca972] tracking-wider leading-none">Intelligence Engine</span>
            <span className="text-xs text-white/90 font-semibold font-mono">Status: Connected & Ready</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Layout Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Configuration & History (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* COMPONENT B: InstagramConnectCard */}
          <div id="InstagramConnectCard" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#cf7051]/30 transition duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#cf7051]/5 to-transparent blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4">
              <Instagram className="w-5 h-5 text-[#cf7051]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Connect Profile Data</h3>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-normal">
              Provide your Instagram account username or copy/paste public reels dataset notes to run the Creator DNA algorithms.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-extrabold text-slate-400 mb-1.5 tracking-wider">Instagram Handle</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#cca972]">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace("@", ""))}
                    className="w-full bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl py-2.5 pl-8 pr-4 text-xs font-medium focus:border-[#cf7051]/60 focus:ring-1 focus:ring-[#cf7051]/20 focus:outline-none transition"
                    placeholder="creatorname"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-extrabold text-slate-400 mb-1.5 tracking-wider">Profile URL</label>
                <input
                  type="text"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="w-full bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl py-2.5 px-3.5 text-xs font-medium focus:border-[#cf7051]/60 focus:outline-none transition font-sans"
                  placeholder="https://instagram.com/creatorname"
                />
              </div>

              {/* Dynamic manual reels inputs list */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] uppercase font-mono font-extrabold text-slate-400 tracking-wider">Manual Reels Links</label>
                  <button
                    onClick={addReelField}
                    className="text-[9.5px] font-bold text-[#cca972] hover:text-white flex items-center gap-1 cursor-pointer transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Reel</span>
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {manualReels.map((reel, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={reel}
                        onChange={(e) => updateReelField(index, e.target.value)}
                        className="flex-1 bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl py-2 px-3 text-[11px] focus:border-[#cf7051]/60 focus:outline-none transition"
                        placeholder="https://instagram.com/p/reel_id"
                      />
                      {manualReels.length > 1 && (
                        <button
                          onClick={() => removeReelField(index)}
                          className="p-2 bg-[#232225] hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-xl border border-[#2e2c2a] transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapsible Manual Analysis Inputs */}
              <div className="border-t border-[#232225] pt-4 mt-2">
                <span className="block text-[10px] uppercase font-mono font-bold text-[#cca972] mb-3 tracking-wider">Manual Evaluation Data (Recommended)</span>
                
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1.5">Draft Script Text</label>
                    <textarea
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      className="w-full min-h-[90px] bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl p-3 text-[11px] focus:outline-none focus:border-[#cf7051]/60 font-sans leading-relaxed resize-y"
                      placeholder="Paste your script to analyze its exact structural components..."
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1.5">Reel Caption</label>
                    <textarea
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      className="w-full min-h-[60px] bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl p-3 text-[11px] focus:outline-none focus:border-[#cf7051]/60"
                      placeholder="Paste caption draft..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Average Views</label>
                      <input
                        type="number"
                        value={viewsMetric}
                        onChange={(e) => setViewsMetric(e.target.value)}
                        className="w-full bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl py-1.5 px-3 text-[11px] focus:outline-none"
                        placeholder="45000"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Engagement (Likes/Saves)</label>
                      <input
                        type="number"
                        value={likesMetric}
                        onChange={(e) => setLikesMetric(e.target.value)}
                        className="w-full bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl py-1.5 px-3 text-[11px] focus:outline-none"
                        placeholder="2800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Extra Post Context Notes</label>
                    <input
                      type="text"
                      value={postNotes}
                      onChange={(e) => setPostNotes(e.target.value)}
                      className="w-full bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl py-1.5 px-3 text-[11px]"
                      placeholder="e.g. Talking-head shot, dynamic typography edits..."
                    />
                  </div>
                </div>
              </div>

              {/* Execute Master Compile Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#cf7051] to-[#cca972] hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs rounded-xl tracking-wider uppercase transition shadow-lg shadow-[#cf7051]/15 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-pulse text-white" />
                <span>{loading ? "Diagnosing Creator Systems..." : "Compile Intelligence Scan"}</span>
              </button>
            </div>
          </div>

          {/* COMPONENT C: DataSourceStatusCard */}
          {currentReport && (
            <div id="DataSourceStatusCard" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold text-[#cca972] tracking-wider">Active Stream Source</span>
                <span className="text-[9px] bg-emerald-950/20 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-mono">Sync Status: Active</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between py-1.5 border-b border-[#232225] text-xs">
                  <span className="text-slate-400">Target Username:</span>
                  <span className="font-semibold text-white font-mono">{currentReport.account.username || "@username"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#232225] text-xs">
                  <span className="text-slate-400">Category Niche:</span>
                  <span className="font-semibold text-white font-mono">{currentReport.account.niche || "Inferred Core"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#232225] text-xs">
                  <span className="text-slate-400">Content Columns:</span>
                  <span className="font-semibold text-[#cca972] text-right max-w-[160px] truncate">
                    {currentReport.account.contentPillars.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#232225] text-xs">
                  <span className="text-slate-400">Posting Frequency:</span>
                  <span className="font-semibold text-white">{currentReport.account.postingFrequency}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#232225] text-xs">
                  <span className="text-slate-400">Account Consistency:</span>
                  <span className="font-bold text-white font-mono">{currentReport.account.consistencyScore}%</span>
                </div>
                <div className="flex justify-between py-1.5 text-xs">
                  <span className="text-slate-400">Intelligence Confidence:</span>
                  <span className="font-bold text-amber-400 font-mono">{currentReport.account.dataConfidence}%</span>
                </div>
              </div>
            </div>
          )}

          {/* COMPONENT L: HistoryReportsPanel */}
          <div id="HistoryReportsPanel" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4.5 h-4.5 text-[#cf7051]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#cca972] font-display">Intelligence Archive</h3>
              </div>
              <span className="text-[10px] bg-[#cca972]/15 text-[#cca972] border border-[#cca972]/30 px-2 py-0.5 rounded font-mono font-bold">
                {reportHistory.length} Reports
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-4 font-sans leading-normal">
              Compare current account and script states against past compiled reports over time.
            </p>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {reportHistory.map((report) => (
                <div
                  key={report.history.reportId}
                  className={`p-3 rounded-xl border transition-all duration-300 relative ${
                    currentReport?.history.reportId === report.history.reportId
                      ? "bg-[#cf7051]/5 border-[#cf7051]/40"
                      : "bg-[#09090b]/40 border-[#232225] hover:border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setCurrentReport(report);
                      }}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <span className="block text-xs font-bold text-white hover:text-[#cca972] transition font-display">
                        {report.account.username || "Anonymous Scan"}
                      </span>
                      <span className="block text-[9px] text-[#cca972] font-mono mt-0.5">
                        {new Date(report.history.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <span className="text-[8.5px] bg-white/5 border border-white/10 font-mono text-slate-400 px-1.5 rounded">
                          Niche: {report.account.niche}
                        </span>
                        <span className="text-[8.5px] bg-[#cf7051]/10 font-mono text-[#cf7051] px-1.5 rounded">
                          Score: {report.performanceScores.overallQuality.score}%
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* COMPONENT 28: ComparisonToggle */}
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          if (compareMode && compareReport?.history.reportId === report.history.reportId) {
                            setCompareMode(false);
                            setCompareReport(null);
                          } else {
                            setCompareMode(true);
                            setCompareReport(report);
                            showToast(`Comparing against report from ${new Date(report.history.createdAt).toLocaleDateString()}`);
                          }
                        }}
                        title="Compare report side-by-side"
                        className={`p-1 rounded cursor-pointer border transition text-[10px] ${
                          compareMode && compareReport?.history.reportId === report.history.reportId
                            ? "bg-[#cf7051]/20 text-white border-[#cf7051]/50"
                            : "bg-[#232225] text-slate-400 border-transparent hover:text-white"
                        }`}
                      >
                        Compare
                      </button>

                      {reportHistory.length > 1 && (
                        <button
                          onClick={() => deleteReport(report.history.reportId)}
                          className="p-1 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded transition cursor-pointer"
                          title="Delete report snapshot"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Active Analytics Reports (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* COMPONENT J: LoadingStatePanel and COMPONENT 10: AnalysisProgressRail */}
          {loading && (
            <div id="LoadingStatePanel" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-8 shadow-2xl space-y-6 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-[#cf7051] animate-spin" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Compiling Intelligence Matrix...</h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#cca972]">{Math.round(((loadStage + 1) / loadingStages.length) * 100)}%</span>
              </div>

              <div id="AnalysisProgressRail" className="w-full bg-[#0c0c0e] h-3 rounded-full border border-[#232225] overflow-hidden relative">
                <motion.div
                  className="bg-gradient-to-r from-[#cf7051] to-[#cca972] h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((loadStage + 1) / loadingStages.length) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[30%] h-full animate-shimmer" />
              </div>

              <div className="text-center font-mono py-2 text-xs text-[#cca972]">
                Current Phase: <span className="font-bold text-white text-sm">{loadingStages[loadStage]}</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 border-t border-[#232225] pt-5">
                {loadingStages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${idx <= loadStage ? "bg-[#cf7051]" : "bg-slate-800"}`} />
                    <span className={idx <= loadStage ? "text-white" : "text-slate-600"}>{stage.replace("...", "")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 flex items-start gap-3.5 text-sm">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white">Analysis Compilation Aborted</h4>
                <p className="text-xs text-red-300/90 mt-1 leading-normal">{error}</p>
                <button
                  onClick={handleAnalyze}
                  className="mt-3 text-xs bg-red-900/30 hover:bg-red-900/50 text-white border border-red-900/50 py-1.5 px-3.5 rounded-lg font-semibold transition cursor-pointer"
                >
                  Retry Scan
                </button>
              </div>
            </div>
          )}

          {/* COMPONENT 27: EmptyStatePanel */}
          {!currentReport && !loading && !error && (
            <div id="EmptyStatePanel" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-10 text-center space-y-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#cca972]/5 border border-[#cca972]/30 flex items-center justify-center">
                <Database className="w-6 h-6 text-[#cca972]" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold font-display text-white">No Intelligence Asset Loaded</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your Instagram username or paste script text in the control block on the left and run the compiler to formulate your first Creator OS report.
                </p>
              </div>

              <div className="border-t border-[#232225] max-w-lg mx-auto pt-5 mt-4">
                <p className="text-[11px] uppercase font-bold text-[#cca972] mb-3">What we evaluate:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left">
                  <div className="p-3 bg-white/2 border border-[#232225] rounded-xl text-center">
                    <span className="block text-white text-xs font-bold">Account DNA</span>
                    <span className="block text-[9px] text-[#cca972] mt-0.5">Pillars & Style</span>
                  </div>
                  <div className="p-3 bg-white/2 border border-[#232225] rounded-xl text-center">
                    <span className="block text-white text-xs font-bold font-sans">Funnel Scores</span>
                    <span className="block text-[9px] text-[#cca972] mt-0.5">8 Key Parameters</span>
                  </div>
                  <div className="p-3 bg-white/2 border border-[#232225] rounded-xl text-center col-span-2 md:col-span-1">
                    <span className="block text-white text-xs font-bold">Script Doctor</span>
                    <span className="block text-[9px] text-[#cca972] mt-0.5">Instant Rewrites</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Sidebar comparison indicator */}
          {compareMode && compareReport && (
            <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-blue-900/40 rounded-2xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-900/30 rounded-lg flex items-center justify-center border border-blue-800">
                  <TrendingUp className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#cca972]">Comparison Matrix Active</span>
                  <p className="text-xs text-slate-300 font-sans">
                    Comparing current configuration with snapshot from <span className="text-white font-semibold font-mono">{new Date(compareReport.history.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCompareMode(false);
                  setCompareReport(null);
                }}
                className="text-xs hover:text-white text-slate-400 font-semibold uppercase font-mono bg-slate-900/50 py-1.5 px-3.5 rounded-lg border border-slate-800 cursor-pointer"
              >
                Disable Compare
              </button>
            </div>
          )}

          {/* PRIMARY ANALYSIS DASHBOARD AREA */}
          {currentReport && !loading && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* COMPONENT D: CreatorDNAHeader */}
              <div id="CreatorDNAHeader" className="bg-gradient-to-b from-[#1c1b1f] to-[#141416]/95 border border-[#cf7051]/25 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#cca972]/8 to-transparent blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 mb-3.5">
                  <Brain className="w-5 h-5 text-[#cf7051]" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#cca972] font-display">Creator DNA Signature</h3>
                </div>

                <p className="text-sm text-slate-200 mt-2 leading-relaxed font-sans italic border-l-2 border-[#cf7051] pl-4">
                  "{currentReport.creatorDNA.summary}"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#232225]">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">Best Form Factor</span>
                    <span className="text-xs font-semibold text-[#cca972]">{currentReport.creatorDNA.bestFormat}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">High-Converting Hook</span>
                    <span className="text-xs font-semibold text-[#cca972]">{currentReport.creatorDNA.bestHookType}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">Best CTA Type</span>
                    <span className="text-xs font-semibold text-[#cca972]">{currentReport.creatorDNA.bestCtaType}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">Video Duration</span>
                    <span className="text-xs font-semibold text-[#cca972]">{currentReport.creatorDNA.bestLengthRange}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 p-4 bg-white/2 rounded-xl border border-[#232225]">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Primary Bottleneck</span>
                    <p className="text-[11px] text-red-300 leading-normal">{currentReport.creatorDNA.mainBottleneck}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Leverage Opportunity</span>
                    <p className="text-[11px] text-emerald-300 leading-normal">{currentReport.creatorDNA.biggestOpportunity}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Next focus area</span>
                    <p className="text-[11px] text-[#cca972] leading-normal">{currentReport.creatorDNA.nextFocusArea}</p>
                  </div>
                </div>
              </div>

              {/* COMPONENT 29: TrendPulseChart and COMPONENT 30: AnalysisSummaryCard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* TrendPulseChart Card (7/12) */}
                <div className="lg:col-span-8 bg-[#141416]/95 border border-[#232225] rounded-2xl p-5 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-[#cca972] tracking-wider">Trend Pulse Graph</span>
                      <h4 className="text-xs text-white">Quality Consistency Over Reports</h4>
                    </div>
                    <span className="text-[10px] bg-[#cca972]/15 text-[#cca972] px-2 py-0.5 rounded font-mono">Radar Pulse</span>
                  </div>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getTrendData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#cf7051" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#cf7051" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorHook" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#cca972" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#cca972" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232225" />
                        <XAxis dataKey="name" stroke="#5e5a5c" fontSize={9} />
                        <YAxis stroke="#5e5a5c" fontSize={9} domain={[0, 100]} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#141416", border: "1px solid #232225", borderRadius: "8px", fontSize: "11px" }}
                        />
                        <Area type="monotone" dataKey="overall" stroke="#cf7051" strokeWidth={2} fillOpacity={1} fill="url(#colorOverall)" name="Overall Quality" />
                        <Area type="monotone" dataKey="hook" stroke="#cca972" strokeWidth={1.5} fillOpacity={1} fill="url(#colorHook)" name="Hook Level" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AnalysisSummaryCard (5/12) */}
                <div id="AnalysisSummaryCard" className="lg:col-span-4 bg-[#141416]/95 border border-[#232225] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-500">Analysis Summary</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">Content Health Diagnosis</h3>
                    
                    <p className="text-xs text-slate-400 leading-normal mt-3 font-sans">
                      Our system grades content by weighing opening friction, retention anchors, message flow, CTA dropoff and niche relevancy against public algorithms.
                    </p>

                    <div className="mt-5 space-y-3.5">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <div>
                          <span className="block text-[9px] leading-none uppercase font-bold text-emerald-400">Winning Anchor</span>
                          <span className="text-[11px] text-white leading-tight font-medium font-sans">Curiosity setup triggers immediate engagement actions.</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <div>
                          <span className="block text-[9px] leading-none uppercase font-bold text-amber-400">Core Deficit</span>
                          <span className="text-[11px] text-white leading-tight font-medium font-sans">Secondary calls are too late and loose, diluting payoff convert.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#232225] pt-4 mt-5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Confidence Level:</span>
                    <span className="text-emerald-400 font-bold font-mono">Moderate High ({currentReport.confidence.overall}%)</span>
                  </div>
                </div>

              </div>

              {/* COMPONENT E: PerformanceScoreGrid with 8 keys */}
              <div>
                <span className="block text-[10px] uppercase font-bold text-[#cca972] tracking-wider mb-4 leading-none">Performance Score Funnel (0–100)</span>
                
                <div id="PerformanceScoreGrid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(currentReport.performanceScores).map(([key, val]) => {
                    const typedVal = val as { score: number; reason: string; fix: string };
                    const isCampActive = compareMode && compareReport;
                    const campVal = isCampActive ? (compareReport.performanceScores as any)[key] : null;
                    const scoreDiff = campVal ? typedVal.score - campVal.score : null;

                    return (
                      <div
                        key={key}
                        className="bg-[#141416]/95 border border-[#232225] rounded-xl p-4.5 shadow flex flex-col justify-between transition-all duration-300 hover:border-[#cca972]/20"
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 font-sans tracking-wide">
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                            
                            {/* COMPONENT 25: ScoreBadge */}
                            <div className="flex flex-col items-end">
                              <span id="ScoreBadge" className={`text-xs font-bold font-mono py-0.5 px-2 rounded ${
                                typedVal.score >= 80
                                  ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900"
                                  : typedVal.score >= 60
                                  ? "bg-amber-950/20 text-amber-400 border border-amber-900"
                                  : "bg-red-950/20 text-red-400 border border-red-900"
                              }`}>
                                {typedVal.score}
                              </span>
                              
                              {scoreDiff !== null && (
                                <span className={`text-[9px] font-mono font-bold mt-1 ${scoreDiff >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                  {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed font-sans">{typedVal.reason}</p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[#232225]">
                          <span className="block text-[8.5px] uppercase font-bold text-[#cca972]">Correction Action</span>
                          <span className="block text-[9.5px] text-slate-400 line-clamp-2 leading-snug">{typedVal.fix}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COMPONENT F: WinnerAnalysisSection & G: FailureAnalysisSection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Winner Analysis */}
                <div id="WinnerAnalysisSection" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Winner Optimization Patterns</h3>
                  </div>

                  <div className="space-y-4">
                    {currentReport.winnerAnalysis.map((post) => (
                      <div
                        id="WinnerAnalysisCard"
                        key={post.postId}
                        className="bg-[#141416]/95 border border-emerald-950/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.015] rounded-full blur-xl" />
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-white leading-tight font-display">{post.title}</span>
                          <span className="text-[11px] font-mono bg-emerald-950/30 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-900/50">
                            Grade: {post.score}%
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{post.whyItWorked}</p>

                        <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-[#232225] text-[10.5px]">
                          <div>
                            <span className="block text-[8.5px] uppercase font-bold text-slate-500">Trigger Category</span>
                            <span className="text-slate-200">{post.emotionalTrigger}</span>
                          </div>
                          <div>
                            <span className="block text-[8.5px] uppercase font-bold text-slate-500">Active Link</span>
                            <span className="text-slate-200 font-mono truncate max-w-[120px] block">{post.postId}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5 pt-1.5">
                          {post.patternTags.map((tag, idx) => (
                            <span key={idx} className="text-[9px] bg-emerald-950/20 text-emerald-300 border border-emerald-900/40 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failure Analysis */}
                <div id="FailureAnalysisSection" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Deficit & Collapse Anchors</h3>
                  </div>

                  <div className="space-y-4">
                    {currentReport.failureAnalysis.map((post) => (
                      <div
                        id="FailureAnalysisCard"
                        key={post.postId}
                        className="bg-[#141416]/95 border border-red-950/40 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-red-500/20 transition-all duration-300"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/[0.015] rounded-full blur-xl" />
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-white leading-tight font-display">{post.title}</span>
                          <span className="text-[11px] font-mono bg-red-950/30 text-red-400 px-2.5 py-0.5 rounded border border-red-900/50">
                            Friction level: {100 - post.score}%
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{post.whyItUnderperformed}</p>

                        <div className="mt-4 pt-3.5 border-t border-[#232225] text-xs">
                          <span className="block text-[8.5px] uppercase font-bold text-[#cca972]">Correction path prescribed</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed mt-1 italic">
                            "{post.betterVersionDirection}"
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5 pt-1.5">
                          {post.problemAreas.map((problem, idx) => (
                            <span key={idx} className="text-[9px] bg-red-950/20 text-red-300 border border-red-900/40 px-2 py-0.5 rounded">
                              ⚠️ {problem}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* COMPONENT H: ScriptStructureMap & COMPONENT 18: ScriptBreakdownCard */}
              <div id="ScriptStructureMap" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-[#232225]">
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-5 h-5 text-[#cf7051]" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Script Structure Component Map</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-sans">
                    Average structure integrity: <span className="text-white font-bold font-mono">71%</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 max-w-2xl leading-normal font-sans">
                  We check your script for the presence of classical retention hooks, problem definitions, curiosity loops, value deliveries, and clear closing CTAs.
                </p>

                <div className="space-y-4">
                  {Object.entries(currentReport.scriptBreakdown).map(([part, breakdown]) => {
                    const item = breakdown as { score: number; present: boolean; notes: string; fix: string };
                    return (
                      <div
                        id="ScriptBreakdownCard"
                        key={part}
                        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-300 relative ${
                          item.present
                            ? "bg-[#09090b]/40 border-[#232225] hover:border-[#cca972]/25"
                            : "bg-red-950/[0.04] border-red-950/30 hover:border-red-500/25"
                        }`}
                      >
                        {/* Interactive presence badge */}
                        <div className="flex items-start gap-3 md:max-w-xs w-full">
                          <div className={`mt-0.5 rounded-full p-1 ${item.present ? "bg-emerald-950/20 text-emerald-400" : "bg-red-950/20 text-red-400"}`}>
                            {item.present ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="block text-xs font-bold uppercase tracking-wide text-white font-display">
                              {part.charAt(0).toUpperCase() + part.slice(1)}
                            </span>
                            <span className="block text-[10px] text-slate-400 leading-normal mt-0.5 font-sans">
                              {item.notes}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 md:px-6">
                          <span className="block text-[8.5px] uppercase font-extrabold text-[#cca972] mb-0.5 leading-none">Correction Formula</span>
                          <span className="block text-[10.5px] text-slate-300 leading-relaxed font-sans">{item.fix}</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="block text-[8px] uppercase font-bold text-slate-500 leading-none mb-1">Grade</span>
                            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              item.score >= 80 ? "bg-emerald-950/20 text-emerald-450 text-emerald-400" : item.score >= 60 ? "bg-amber-950/20 text-amber-400" : "bg-red-950/20 text-red-400"
                            }`}>
                              {item.score}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COMPONENT I: GrowthCoachPanel & COMPONENT J: ContentStrategyPanel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* GrowthCoachPanel */}
                <div id="GrowthCoachPanel" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#cca972]/3 to-transparent blur-xl pointer-events-none" />
                  
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Flame className="w-5 h-5 text-[#cf7051]" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Strategic growth Coach</h3>
                    </div>

                    <p className="text-xs text-slate-400 mb-5 leading-normal font-sans">
                      Our system prescribes high-impact execution plans. Focus heavily on correcting bottlenecks:
                    </p>

                    <div className="space-y-4">
                      <div>
                        <span className="block text-[10px] uppercase font-extrabold text-slate-500 mb-2">✔️ What to keep doing</span>
                        <div className="flex flex-col gap-1.5">
                          {currentReport.growthCoach.keepDoing.map((item, idx) => (
                            <div key={idx} className="flex gap-2 text-xs">
                              <span className="text-emerald-400 shrink-0">✓</span>
                              <span className="text-white font-sans">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#232225] pt-3.5">
                        <span className="block text-[10px] uppercase font-extrabold text-[#cf7051] mb-2">❌ What to stop doing</span>
                        <div className="flex flex-col gap-1.5">
                          {currentReport.growthCoach.stopDoing.map((item, idx) => (
                            <div key={idx} className="flex gap-2 text-xs">
                              <span className="text-red-400 shrink-0">×</span>
                              <span className="text-white font-sans">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#232225] pt-3.5">
                        <span className="block text-[10px] uppercase font-extrabold text-[#cca972] mb-2">🚀 Next test recommendations</span>
                        <div className="flex flex-col gap-1.5">
                          {currentReport.growthCoach.testNext.map((item, idx) => (
                            <div key={idx} className="flex gap-2 text-xs">
                              <span className="text-amber-400 shrink-0">→</span>
                              <span className="text-white font-sans">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-[#232225]">
                    <div className="p-3 bg-[#cf7051]/5 rounded-xl border border-[#cf7051]/25 text-xs text-center text-white font-sans">
                      <span className="font-bold text-[#cca972] block mb-0.5">Highest Leverage Fix:</span>
                      "{currentReport.growthCoach.highestLeverageFix}"
                    </div>
                  </div>
                </div>

                {/* ContentStrategyPanel */}
                <div id="ContentStrategyPanel" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Compass className="w-5 h-5 text-[#cca972]" />
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Target Content Strategy Maps</h3>
                    </div>

                    <p className="text-xs text-slate-400 mb-5 leading-normal">
                      High probability topic gaps and angles compiled based on historical engagement clusters.
                    </p>

                    <div className="space-y-4">
                      <div>
                        {/* COMPONENT 24: InsightChip */}
                        <span className="block text-[10px] uppercase font-extrabold text-slate-500 mb-2">Topic Ideas to Test</span>
                        <div className="flex flex-wrap gap-2">
                          {currentReport.contentStrategy.nextTopics.map((topic, idx) => (
                            <span id="InsightChip" key={idx} className="text-[11px] bg-slate-900 text-slate-350 border border-[#232225] text-slate-300 font-sans px-3 py-1.5 rounded-xl">
                              💡 {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#232225] pt-4">
                        <span className="block text-[10px] uppercase font-extrabold text-slate-500 mb-2">High Probability Angles</span>
                        <div className="flex flex-wrap gap-2">
                          {currentReport.contentStrategy.anglesToTry.map((angle, idx) => (
                            <span key={idx} className="text-[11px] bg-amber-950/20 text-amber-400 border border-amber-900/40 font-mono px-3 py-1 rounded-xl">
                              ⚖️ {angle}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#232225] pt-4">
                        <span className="block text-[10px] uppercase font-extrabold text-slate-500 mb-2">Format Directions</span>
                        <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                          <div>
                            <span className="block text-[9px] font-bold text-emerald-400 uppercase mb-1">Double Down:</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-300">
                              {currentReport.contentStrategy.formatsToTry.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-red-400 uppercase mb-1">Avoid / Restrict:</span>
                            <ul className="list-disc list-inside space-y-1 text-slate-300">
                              {currentReport.contentStrategy.formatsToAvoid.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-[#232225] mt-6 flex justify-between text-xs font-sans">
                    <span className="text-slate-500">Predicted Payoff Cluster:</span>
                    <span className="text-emerald-400 font-bold font-mono">Max Conversion</span>
                  </div>
                </div>

              </div>

              {/* COMPONENT K: ScriptDoctorPanel */}
              <div id="ScriptDoctorPanel" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#cf7051]/30 transition duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#cf7051]/5 to-transparent blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2.5 mb-4">
                  <Flame className="w-5 h-5 text-[#cf7051] animate-pulse" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#cca972] font-display">Script Doctor Diagnostic Review</h3>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed font-sans">
                  Paste a rough content draft below to trigger immediate diagnostic tests. Our script-level neural checker prescribes instant rewrites, scroll-stopping hooks and CTA inserts.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-[#cca972] mb-1.5">Paste Target Script For Fix</label>
                    <div className="flex gap-2">
                      <textarea
                        value={doctorSourceText}
                        onChange={(e) => setDoctorSourceText(e.target.value)}
                        className="flex-1 min-h-[90px] bg-[#0c0c0e]/80 border border-[#232225] text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#cf7051]/60"
                        placeholder="e.g. Many creators complain about low reach, but they make a massive mistake in the opening. In this video I will show you how to structure your script..."
                      />
                      <button
                        onClick={executeDoctorOnScript}
                        className="px-4.5 py-3.5 bg-[#cf7051]/10 hover:bg-[#cf7051]/20 border border-[#cf7051]/35 text-white font-bold text-xs rounded-xl uppercase transition tracking-wider flex flex-col justify-center items-center gap-1.5 cursor-pointer max-w-[120px]"
                      >
                        <Sparkles className="w-4 h-4 text-[#cca972]" />
                        <span>Diagnose Fix</span>
                      </button>
                    </div>
                  </div>

                  {currentReport.scriptDoctor.rewrite && (
                    <div className="bg-[#0c0c0e]/60 rounded-xl p-5 border border-[#232225] space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[9.5px] uppercase font-bold text-emerald-400 mb-1.5">Diagnosed Strengths</span>
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                            {currentReport.scriptDoctor.strengths.map((s, idx) => (
                              <li key={idx} className="font-sans">{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="block text-[9.5px] uppercase font-bold text-red-400 mb-1.5">Diagnosed Weaknesses</span>
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-350 select-none">
                            {currentReport.scriptDoctor.weaknesses.map((w, idx) => (
                              <li key={idx} className="font-sans text-slate-300">⚠️ {w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-[#232225] pt-4.5">
                        <span className="block text-[10px] uppercase font-mono font-bold text-[#cca972] mb-1.5">Scroll-Stopping Hooks Variations</span>
                        <div className="space-y-2">
                          {currentReport.scriptDoctor.hookOptions.map((opt, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-white/2 border border-[#232225] rounded-lg">
                              <span className="text-white font-medium font-sans">{opt}</span>
                              <button
                                onClick={() => handleCopyClipboard(opt, `hookOpt-${idx}`)}
                                className="text-[10px] text-[#cca972] flex items-center gap-1 hover:text-white cursor-pointer transition ml-2"
                              >
                                {copiedKey === `hookOpt-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedKey === `hookOpt-${idx}` ? "Copied" : "Copy"}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#232225] pt-4.5">
                        <span className="block text-[10px] uppercase font-mono font-bold text-[#cca972] mb-1.5">Ultimate Professional Rewrite (Viral Version)</span>
                        <div className="bg-[#141416]/95 border border-[#232225] rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-sans relative">
                          <button
                            onClick={() => handleCopyClipboard(currentReport.scriptDoctor.rewrite, "doctorRewrite")}
                            className="absolute top-3 right-3 text-slate-500 hover:text-[#cca972] transition-colors p-1"
                            title="Copy rewrite"
                          >
                            {copiedKey === "doctorRewrite" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <p className="pr-8">{currentReport.scriptDoctor.rewrite}</p>
                        </div>
                      </div>

                      <div className="border-t border-[#232225] pt-4.5">
                        <span className="block text-[10px] uppercase font-mono font-bold text-[#cca972] mb-1.5 font-sans">Strategic CTA Injection Slots</span>
                        <div className="space-y-2">
                          {currentReport.scriptDoctor.ctaOptions.map((opt, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-white/2 border border-[#232225] rounded-lg">
                              <span className="text-white font-medium font-sans">{opt}</span>
                              <button
                                onClick={() => handleCopyClipboard(opt, `ctaOpt-${idx}`)}
                                className="text-[10px] text-[#cca972] flex items-center gap-1 hover:text-white cursor-pointer transition ml-2 z-10"
                              >
                                {copiedKey === `ctaOpt-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>Copy</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* COMPONENT M: ExportInsightsPanel */}
              <div id="ExportInsightsPanel" className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-[#cca972] tracking-wider leading-none mb-1">Export Evaluation Report</span>
                  <p className="text-xs text-slate-400 font-sans">
                    Transfer Compiled variables to local file text backups or secure clipboard copy sets.
                  </p>
                </div>

                <div className="flex gap-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      const summaryText = `CREATOR INTELLIGENCE REPORT
Platform: ${currentReport.account.platform.toUpperCase()}
Username: ${currentReport.account.platform === "instagram" ? "@" : ""}${currentReport.account.username}
Niche: ${currentReport.account.niche}
Consistency Rating: ${currentReport.account.consistencyScore}%

CREATOR DNA OUTCOME SUMMARY:
"${currentReport.creatorDNA.summary}"

STRATEGIC IMPROVEMENT PRESCRIPTION:
Keep: ${currentReport.growthCoach.keepDoing.join(", ")}
Stop: ${currentReport.growthCoach.stopDoing.join(", ")}
Leverage Anchor Fix: "${currentReport.growthCoach.highestLeverageFix}"

SCRIPT DOCTOR REWRITE OUTLINE:
"${currentReport.scriptDoctor.rewrite}"

Compiled at: ${new Date(currentReport.history.createdAt).toLocaleString()}`;
                      handleCopyClipboard(summaryText, "exportSummaryAll");
                      showToast("All report summary points copied to clipboard!");
                    }}
                    className="py-2 px-4 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-white/10 cursor-pointer transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Summary</span>
                  </button>

                  <button
                    onClick={() => {
                      const summaryText = `CREATOR INTELLIGENCE REPORT Snapshot - ${currentReport.account.username}`;
                      const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: "application/json;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `CreatorIntelligence-${currentReport.account.username.replace("@", "")}.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                      showToast("JSON snapshot file saved!");
                    }}
                    className="py-2 px-4 bg-[#cf7051]/10 hover:bg-[#cf7051]/20 border border-[#cf7051]/30 text-[#cf7051] rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Report</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
