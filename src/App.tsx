/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Download,
  Save,
  RefreshCw,
  Flame,
  TrendingUp,
  BarChart3,
  Layers,
  Settings,
  HelpCircle,
  Check,
  FileJson,
  FileText,
  Trash2,
  Cpu,
  Video,
  AlertTriangle,
  Bookmark,
  Share2,
  MessageSquare,
  Hash,
  Search,
  BookOpen,
  FolderOpen,
  ClipboardList,
  Database,
  Cloud,
  CloudOff,
  Terminal,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as RechartsTooltip
} from "recharts";
import ProfileConfig from "./components/ProfileConfig";
import ProjectHistory from "./components/ProjectHistory";
import LoadingIndicator from "./components/LoadingIndicator";
import EmptyState from "./components/EmptyState";
import { ContentPackage, SavedProject, ProfileMemory, CreatorIntelligenceReport } from "./types";
import { soundManager } from "./utils/sound";
import QuoteOrb from "./components/QuoteOrb";
import FloatingAccentLayer from "./components/FloatingAccentLayer";
import AppShell from "./components/AppShell";
import SidebarNav from "./components/SidebarNav";
import TopBar from "./components/TopBar";
import CreatorIntelligencePage from "./components/CreatorIntelligencePage";

// Custom, highly-creative staggering transition presets for active tab content modules
const tabContainerVariants = (enabled: boolean) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: enabled ? 0.08 : 0,
      delayChildren: enabled ? 0.05 : 0
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: enabled ? 0.04 : 0,
      staggerDirection: -1
    }
  }
});

const tabItemVariants = (enabled: boolean) => ({
  hidden: enabled 
    ? { opacity: 0, y: 16, filter: "blur(6px)", scale: 0.98 } 
    : { opacity: 0 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: enabled 
      ? {
          type: "spring",
          stiffness: 110,
          damping: 14,
          mass: 0.8
        } 
      : { duration: 0 }
  },
  exit: enabled 
    ? {
        opacity: 0,
        y: -12,
        filter: "blur(6px)",
        scale: 0.98,
        transition: {
          duration: 0.2,
          ease: "easeInOut"
        }
      } 
    : { duration: 0 }
});

const DEMO_PROJECTS_FOR_CHARTS = [
  { config: { niche: "AI tools for Indian students", tone: "Smart friend", goal: "Viral" } },
  { config: { niche: "Tech / coding / dev", tone: "Proof-based educator", goal: "Retention" } },
  { config: { niche: "Finance / money / investing", tone: "Founder voice", goal: "Authority" } },
  { config: { niche: "College / student life", tone: "Storytelling creator", goal: "Personal brand" } },
  { config: { niche: "AI tools for Indian students", tone: "Proof-based educator", goal: "Retention" } },
  { config: { niche: "Tech / coding / dev", tone: "Smart friend", goal: "Viral" } },
  { config: { niche: "Freelancing / remote work", tone: "Storytelling creator", goal: "Clarity" } },
  { config: { niche: "Edtech / education", tone: "Proof-based educator", goal: "Clarity" } },
];

export default function App() {
  // Theme state switcher with localStorage persistence
  const [theme, setTheme] = useState<"atelier" | "light">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("creatoros_theme");
      if (savedTheme === "light" || savedTheme === "atelier") {
        return savedTheme;
      }
    }
    return "atelier";
  });

  // Sound & animation preferences state (directly configurable with full reversibility)
  const [isMuted, setIsMuted] = useState(soundManager.getMuteStatus());
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("creatoros_animations_disabled");
      if (stored === null) {
        localStorage.setItem("creatoros_animations_disabled", "false");
        return true;
      }
      return stored !== "true";
    }
    return true;
  });

  // Track the unique theme sweep wave for glorious physical transition feel
  const [themeWave, setThemeWave] = useState<{ id: number; theme: "light" | "atelier" } | null>(null);

  // Separate view state for Profile Settings configuration section
  const [showProfile, setShowProfile] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === "atelier" ? "light" : "atelier";
    if (typeof window !== "undefined") {
      localStorage.setItem("creatoros_theme", nextTheme);
      setTheme(nextTheme);
      soundManager.playSwitch(nextTheme === "light");
      if (animationsEnabled) {
        setThemeWave({ id: Date.now(), theme: nextTheme });
      }
    }
  };

  const toggleSound = () => {
    const nextValue = !isMuted;
    soundManager.setMuteStatus(nextValue);
    setIsMuted(nextValue);
    if (!nextValue) {
      soundManager.playClick();
    }
  };

  const toggleAnimations = () => {
    const nextValue = !animationsEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("creatoros_animations_disabled", String(!nextValue));
      setAnimationsEnabled(nextValue);
      window.dispatchEvent(new Event("creatoros_settings_updated"));
    }
  };

  // Input parameters state
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("Rough script");
  const [language, setLanguage] = useState("Hinglish");
  const [niche, setNiche] = useState("Tech / coding / dev");
  const [tone, setTone] = useState("Smart friend");
  const [platform, setPlatform] = useState("Both");
  const [rewriteStrength, setRewriteStrength] = useState("Medium rewrite");
  const [goal, setGoal] = useState("Viral");
  const [style, setStyle] = useState("Hinglish Reel Format");
  const [clearConfirm, setClearConfirm] = useState(false);

  // Custom metadata syncing from localStorage config
  const [profileMemory, setProfileMemory] = useState<ProfileMemory | null>(null);

  // App running states
  const [loading, setLoading] = useState(false);
  
  // State and simulated timer for Compilation Progress Feedback Bar
  const [compileProgress, setCompileProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let fadeOutTimeout: NodeJS.Timeout;

    if (loading) {
      setShowProgressBar(true);
      setCompileProgress(0);
      const startTime = Date.now();
      const estimatedDuration = 10000; // 10 seconds simulation

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressRaw = (elapsed / estimatedDuration) * 100;
        
        if (progressRaw < 92) {
          setCompileProgress(Math.min(92, Math.round(progressRaw)));
        } else {
          // Slow crawling progression above 92% (up to 98%)
          setCompileProgress((prev) => {
            const nextVal = prev + Math.random() * 0.4;
            return nextVal >= 98 ? 98 : nextVal;
          });
        }
      }, 100);
    } else if (showProgressBar) {
      // Set to 100% when success completes
      setCompileProgress(100);
      
      // Keep it at 100% for a smooth instant, then fade out
      fadeOutTimeout = setTimeout(() => {
        setShowProgressBar(false);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
    };
  }, [loading]);

  const [moduleLoadingKey, setModuleLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);
  const [projectName, setProjectName] = useState("");

  // History State
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>(undefined);

  // Supabase Database Connection & Setup Status
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    reachable: boolean;
    status: string;
    url?: string;
    setupSql?: string;
  } | null>(null);
  const [dbSyncLoading, setDbSyncLoading] = useState(false);
  const [showSqlSetup, setShowSqlSetup] = useState(false);

  // Active module view Tab category for output rendering
  const [activeTab, setActiveTab] = useState<"scripts" | "hooks-ctas" | "captions" | "analysis" | "versions">("scripts");

  // Dynamic Workspace routing state
  const [activeWorkspace, setActiveWorkspace] = useState<"atelier" | "intelligence">("atelier");
  const [intelCount, setIntelCount] = useState(0);

  // Copy success animation states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper to dynamically calculate niche, tone, and goal frequency radar datasets
  const getRadarData = (key: "niche" | "tone" | "goal") => {
    const isDemo = savedProjects.length === 0;
    const dataset = isDemo ? DEMO_PROJECTS_FOR_CHARTS : savedProjects;
    const counts: Record<string, number> = {};

    const defaultKeysMap: Record<string, string[]> = {
      niche: ["AI", "Tech", "Business", "Storytelling", "Documentary", "Education"],
      tone: ["Professional", "Casual", "Bold", "Emotional", "Educational", "Story-driven"],
      goal: ["Viral", "Retention", "Clarity", "Authority", "Personal brand"]
    };

    const defaultKeys = defaultKeysMap[key];
    defaultKeys.forEach((k) => {
      counts[k] = 0;
    });

    dataset.forEach((item) => {
      const rawVal = item.config?.[key];
      if (rawVal) {
        const matchedKey = defaultKeys.find((dk) => dk.toLowerCase() === rawVal.toLowerCase()) || rawVal;
        counts[matchedKey] = (counts[matchedKey] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({
      subject: name,
      count,
      fullMark: Math.max(...Object.values(counts), 3) + 1
    }));
  };

  // Query live Supabase configuration status from server
  const checkDbStatus = async () => {
    try {
      const response = await fetch("/api/db-status");
      if (response.ok) {
        const data = await response.json();
        setDbStatus(data);
        return data;
      }
    } catch (e) {
      console.error("Failed to query DB integration status:", e);
    }
    return null;
  };

  // Sync / retrieve projects from Supabase
  const handleFetchSupabaseProjects = async () => {
    setDbSyncLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.source === "supabase") {
          setSavedProjects(result.data);
          // Sync back to local storage for offline memory
          localStorage.setItem("creatoros_history", JSON.stringify(result.data));
          triggerCopyNotification("db-synced");
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.code === "TABLE_NOT_FOUND" || response.status === 404) {
          // Keep local intact but warning user
          await checkDbStatus();
        }
      }
    } catch (e) {
      console.error("Failed to fetch Supabase records:", e);
    } finally {
      setDbSyncLoading(false);
    }
  };

  // Load Saved Projects on start & Sync Supabase DB in parallel
  useEffect(() => {
    // 1. Instantly load from localStorage for lightning fast startup UX
    const localHistory = localStorage.getItem("creatoros_history");
    if (localHistory) {
      try {
        setSavedProjects(JSON.parse(localHistory));
      } catch (e) {
        console.error("Failed to parse saved projects history", e);
      }
    }

    // 2. Query Supabase connection status & reload items if online
    const initDbSync = async () => {
      const status = await checkDbStatus();
      if (status && status.configured && status.reachable && status.status === "CONNECTED") {
        try {
          const res = await fetch("/api/projects");
          if (res.ok) {
            const body = await res.json();
            if (body.success && body.source === "supabase") {
              setSavedProjects(body.data);
              localStorage.setItem("creatoros_history", JSON.stringify(body.data));
            }
          }
        } catch (err) {
          console.error("Auto background DB sync failed:", err);
        }
      }
    };
    initDbSync();
  }, []);

  // Quick Action: Pre-populate sample creator scripts for user convenience if empty
  const handleLoadSample = (sampleType: "idea" | "script") => {
    if (sampleType === "idea") {
      setText(
        "Indian students ke liye AI tools jo coding aur assignments me 10x time bachate hain. Main bataunga 3 free tools jo ChatGPT se behtar hain aur local laptop pe bina internet chalte hain, using Ollama and a custom script. It should feel super helpful and focus on student daily struggles."
      );
      setContentType("Topic only");
      setNiche("AI tools for Indian students");
      setTone("Smart friend");
      setGoal("Viral");
    } else {
      setText(
        "Bhai, agar tum coding seekh rahe ho aur final-year product placements ki fikar hai, toh ye 3 Github repos bacha lo. Hum log sab seekhte hain par resume me project build nahi kar paate. Main dikhaunga kaise ready-to-deploy Tailwind aur React code copy karke deployment seekh sako in 30 seconds."
      );
      setContentType("Rough script");
      setNiche("Tech / coding / dev");
      setTone("Smart friend");
      setGoal("Retention");
    }
  };

  // Sync profile options with input form defaults
  const handleProfileSync = (profile: ProfileMemory) => {
    setProfileMemory(profile);
    // sync default parameters to make starting faster
    setLanguage(profile.language);
    setNiche(profile.niche);
    setTone(profile.tone);
    setStyle(profile.style);
    setRewriteStrength(profile.rewriteStrength);
  };

  // Run content transformation API pipeline
  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please paste a script, topic, or rough draft first before running CreatorOS.");
      return;
    }

    soundManager.playCompile();
    setLoading(true);
    setError(null);
    setContentPackage(null);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          contentType,
          language,
          niche,
          tone,
          platform,
          rewriteStrength,
          goal,
          style,
          profileMemory
        }),
      });

      if (!response.ok) {
        let errMsg = "Failed to trigger AI content transformation.";
        try {
          const result = await response.json();
          errMsg = result.error || errMsg;
        } catch {
          try {
            const rawText = await response.text();
            if (rawText.includes("<!doctype") || rawText.includes("<html")) {
              errMsg = "Server returned an HTML error page. This usually indicates a server error, a network timeout, or that the backend has crashed.";
            } else {
              errMsg = rawText.substring(0, 150) || errMsg;
            }
          } catch {}
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to trigger AI content transformation.");
      }

      setContentPackage(result.data);
      soundManager.playSuccess();
      // Auto-suggest a default project name based on inputs
      const shortTopic = text.trim().substring(0, 30) + "...";
      const autoSavedName = `Refactor: ${niche} - ${shortTopic}`;
      setProjectName(autoSavedName);

      // Auto-save generated creator package to local storage and secure DB backup in the background
      setTimeout(() => {
        handleSaveProject(autoSavedName, result.data);
        syncScriptLabToCreatorIntelligence(autoSavedName, result.data);
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Network lost or Server API error. Make sure your GEMINI_API_KEY is configured correctly in the Secrets Panel.");
    } finally {
      setLoading(false);
    }
  };

  // Auto sync the script lab with creator intelligence
  const syncScriptLabToCreatorIntelligence = async (name: string, packageData: ContentPackage) => {
    try {
      const getLabel = (score: number) => {
        if (score >= 90) return "excellent";
        if (score >= 80) return "strong";
        if (score >= 65) return "moderate";
        return "weak";
      };

      // 1. Build a new CreatorIntelligenceReport from contentPackage
      const newReport: CreatorIntelligenceReport = {
        id: "intel_sync_" + Date.now(),
        createdAt: new Date().toISOString(),
        mode: "script_doctor",
        title: `Script Lab: ${name.replace("Refactor: ", "")}`,
        summary: packageData.viralScore?.explanation || "Script Lab Auto-Synced analysis report evaluating flow alignment and dropoff risks.",
        scores: {
          hook: {
            score: packageData.viralScore?.hookStrength || 75,
            label: getLabel(packageData.viralScore?.hookStrength || 75),
            reason: `Evaluates how effectively the initial message grabs and locks student attention inside 3 seconds.`
          },
          retention: {
            score: packageData.viralScore?.retention || 70,
            label: getLabel(packageData.viralScore?.retention || 70),
            reason: `Mid-clip structure density and logical pacing continuity.`
          },
          flow: {
            score: packageData.viralScore?.clarity || 80,
            label: getLabel(packageData.viralScore?.clarity || 80),
            reason: `Structural block transit clarity and linguistic fluidity.`
          },
          story: {
            score: packageData.viralScore?.curiosity || 65,
            label: getLabel(packageData.viralScore?.curiosity || 65),
            reason: `Narrative core elements and setups for payoff suspense.`
          },
          emotion: {
            score: Math.round(((packageData.viralScore?.curiosity || 65) + (packageData.viralScore?.clarity || 80)) / 2),
            label: "moderate",
            reason: `Relatable problem presentation and professional validation.`
          },
          cta: {
            score: packageData.viralScore?.overallScore || 75,
            label: getLabel(packageData.viralScore?.overallScore || 75),
            reason: `Prompt action alignment and conversion friction reductions.`
          },
          packaging: {
            score: packageData.viralScore?.viralityPotential || 78,
            label: getLabel(packageData.viralScore?.viralityPotential || 78),
            reason: `Click incentive and curiosity-driven title packaging effectiveness.`
          },
          audienceMatch: {
            score: packageData.viralScore?.overallScore || 75,
            label: getLabel(packageData.viralScore?.overallScore || 75),
            reason: `High relevance matching with standard professional audience clusters.`
          },
          overall: {
            score: packageData.viralScore?.overallScore || 74,
            label: getLabel(packageData.viralScore?.overallScore || 74),
            reason: `Consolidated quality index for generated creative segments.`
          }
        },
        structure: [
          {
            name: "Hook Section",
            exists: true,
            strength: packageData.viralScore?.hookStrength || 75,
            impact: "Establishes video topic parameters immediately.",
            weakness: packageData.retentionAnalysis?.weaknesses?.[0] || "No upfront visual proof or hook alerts.",
            fix: packageData.retentionAnalysis?.suggestions?.[0] || "Lead directly with quantitative proof metrics."
          },
          {
            name: "Setup Phase",
            exists: true,
            strength: packageData.viralScore?.clarity || 80,
            impact: "Validates technical stack setup or core framework.",
            weakness: "Explanation can dwell on concepts dryly.",
            fix: "Keep background visuals moving at 1.5x zoom cuts."
          },
          {
            name: "Problem Delivery",
            exists: true,
            strength: packageData.viralScore?.curiosity || 70,
            impact: "Connects with student frustrations or placement bottlenecks.",
            weakness: "Lacks sharp relatable metaphors.",
            fix: "Use Hinglish terms describing placement day anxiety."
          },
          {
            name: "Value Payoff",
            exists: true,
            strength: packageData.viralScore?.retention || 75,
            impact: "Actionable screen demonstration coordinates.",
            weakness: "Low-contrast background overlay.",
            fix: "Introduce bold highlighter arrows on screen sections."
          },
          {
            name: "Call To Action",
            exists: true,
            strength: packageData.viralScore?.overallScore || 75,
            impact: "Comment automation prompt triggers with comment-to-DM triggers.",
            weakness: "Arrives right near final fade.",
            fix: "Pitch keyword 10s earlier before climax solution fades."
          }
        ],
        strengths: [
          packageData.styleNotes?.strongestAngle || "Clean bilingual Hinglish expression",
          "Rich interactive multi-format alternatives produced",
          "Optimized keyword density structures"
        ],
        weaknesses: packageData.retentionAnalysis?.weaknesses || ["pacing latency transitions"],
        missingElements: [
          "Middle pattern interrupt sound triggers",
          "Frictionless comment automation keyword linkups"
        ],
        recommendedFixes: packageData.retentionAnalysis?.suggestions || ["Insert zoom resets every 4 seconds"],
        improvedVersion: packageData.scripts?.viral || "No template",
        shorterVersion: packageData.scripts?.short || packageData.scripts?.improved || "No shorter template",
        punchierVersion: packageData.scripts?.hookFirst || "No punchy template",
        creatorDNAUpdate: {
          niche: packageData.styleNotes?.style || niche,
          audience: packageData.styleNotes?.audienceMatch || "Indian Tech & Professional Developers",
          strongestFormats: [packageData.styleNotes?.style || "Hinglish Reel Format"],
          strongestHooks: packageData.hooks?.scrollStopper || ["Quantified salary packages proofs", "Warning mistake logs opener"],
          strongestCTAs: packageData.ctas?.comment || ["Automated comments DM keyword drops"],
          contentLengthPreference: packageData.styleNotes?.pacing || "30-45 seconds",
          recurringPatterns: ["Proof-first visual layout structures", "Relatable sibling Hinglish style"],
          biggestBottleneck: packageData.retentionAnalysis?.weaknesses?.[0] || "Hook speed attention latency",
          recommendedFocus: packageData.retentionAnalysis?.suggestions?.[0] || "Cut early silent pre-rolls from timeline"
        },
        strategy: {
          keepDoing: [
            "Use live screen demos in high contrast black boxes.",
            "Integrate automated keywords triggering comment-to-DM.",
            "Deliver scripts in energetic buddy voice."
          ],
          stopDoing: packageData.retentionAnalysis?.weaknesses || ["No dry theoretical roadmapping without code"],
          improveFirst: packageData.retentionAnalysis?.suggestions || ["Lead instantly with visual package result"],
          testNext: [
            "A fast 15-second visual bento-grid review.",
            "Splitting screen between manual typing and code CLI"
          ],
          biggestBottleneck: packageData.retentionAnalysis?.weaknesses?.[0] || "Viewer dropoff inside first 3 seconds",
          highestLeverageFix: packageData.retentionAnalysis?.suggestions?.[0] || "Use outcome-driven shock numbers at frame 0"
        },
        metadata: {
          language: language,
          platform: platform,
          dataConfidence: "high",
          isEstimated: false
        }
      };

      // 2. Read history, prepend work, write back
      const existingHistoryStr = localStorage.getItem("creatoros_intel_history");
      let updatedHistory: CreatorIntelligenceReport[] = [];
      if (existingHistoryStr) {
        try {
          const parsed = JSON.parse(existingHistoryStr);
          updatedHistory = [newReport, ...parsed];
        } catch {
          updatedHistory = [newReport];
        }
      } else {
        updatedHistory = [newReport];
      }

      localStorage.setItem("creatoros_intel_history", JSON.stringify(updatedHistory));
      setIntelCount(updatedHistory.length);

      // 3. Write back DNA as the live cumulative DNA
      localStorage.setItem("creatoros_cumulative_dna", JSON.stringify(newReport.creatorDNAUpdate));

      // 4. Trigger async POST calls to the DB endpoints safely
      try {
        await fetch("/api/creator-intelligence/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReport)
        });
      } catch (err) {
        console.warn("Could not sync script history to server db backup:", err);
      }

      try {
        await fetch("/api/creator-intelligence/dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReport.creatorDNAUpdate)
        });
      } catch (err) {
        console.warn("Could not sync script DNA to server db backup:", err);
      }
    } catch (syncErr) {
      console.warn("Creator intelligence auto-sync error:", syncErr);
    }
  };

  // Save Current Project to localStorage & Supabase
  const handleSaveProject = async (customName?: any, customPackage?: any) => {
    const pkg = customPackage || contentPackage;
    if (!pkg) return;

    const actualCustomName = typeof customName === "string" ? customName : undefined;
    const nameToSave = ((actualCustomName || projectName) || "").trim() || `Transform Project - ${new Date().toLocaleDateString()}`;
    const newProject: SavedProject = {
      id: activeProjectId || Date.now().toString(),
      name: nameToSave,
      timestamp: new Date().toISOString(),
      inputText: text,
      config: {
        contentType,
        language,
        niche,
        tone,
        platform,
        rewriteStrength,
        goal,
        style
      },
      packageData: pkg
    };

    let updatedList = [...savedProjects];
    const existingIndex = updatedList.findIndex(p => p.id === newProject.id);
    
    if (existingIndex > -1) {
      updatedList[existingIndex] = newProject;
    } else {
      updatedList.unshift(newProject);
    }

    setSavedProjects(updatedList);
    localStorage.setItem("creatoros_history", JSON.stringify(updatedList));
    soundManager.playSuccess();
    setActiveProjectId(newProject.id);

    // Sync to Supabase in parallel if configured & connected
    if (dbStatus?.configured && dbStatus?.reachable && dbStatus?.status === "CONNECTED") {
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject)
        });
        if (response.ok) {
          triggerCopyNotification("project-saved-supabase");
        } else {
          console.warn("Supabase failed saving. Stored in localStorage backup.");
          triggerCopyNotification("project-saved-local-only");
        }
      } catch (err) {
        console.error("Supabase REST POST failed:", err);
        triggerCopyNotification("project-saved-local-only");
      }
    } else {
      triggerCopyNotification("project-saved");
    }
  };

  // Restore Project from History
  const handleSelectProject = (project: SavedProject) => {
    soundManager.playClick();
    setActiveProjectId(project.id);
    setText(project.inputText);
    setContentType(project.config.contentType);
    setLanguage(project.config.language);
    setNiche(project.config.niche);
    setTone(project.config.tone);
    setPlatform(project.config.platform);
    setRewriteStrength(project.config.rewriteStrength);
    setGoal(project.config.goal);
    setStyle(project.config.style);
    setContentPackage(project.packageData);
    setProjectName(project.name);
    setError(null);
  };

  // Delete Project from History & Supabase
  const handleDeleteProject = async (id: string) => {
    soundManager.playClick();
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem("creatoros_history", JSON.stringify(updated));
    if (activeProjectId === id) {
      setActiveProjectId(undefined);
    }

    // Try deleting from Supabase
    if (dbStatus?.configured && dbStatus?.reachable && dbStatus?.status === "CONNECTED") {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          triggerCopyNotification("deleted-supabase");
        } else {
          triggerCopyNotification("deleted-local-only");
        }
      } catch (err) {
        console.error("Failed to delete project from Supabase:", err);
        triggerCopyNotification("deleted-local-only");
      }
    } else {
      triggerCopyNotification("deleted");
    }
  };

  // Targeted single-module regeneration to refine results
  const handleRegenerateModule = async (moduleKey: string) => {
    if (!text.trim() || !contentPackage) return;

    soundManager.playCompile();
    setModuleLoadingKey(moduleKey);
    setError(null);

    try {
      const response = await fetch("/api/regenerate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          contentType,
          language,
          niche,
          tone,
          platform,
          rewriteStrength,
          goal,
          style,
          moduleKey,
          currentValue: (contentPackage as any)[moduleKey],
          profileMemory
        })
      });

      if (!response.ok) {
        let errMsg = `Failed to refine ${moduleKey} module.`;
        try {
          const result = await response.json();
          errMsg = result.error || errMsg;
        } catch {
          try {
            const rawText = await response.text();
            if (rawText.includes("<!doctype") || rawText.includes("<html")) {
              errMsg = "Server returned an HTML error page. This usually indicates a server error, a network timeout, or that the backend has crashed.";
            } else {
              errMsg = rawText.substring(0, 150) || errMsg;
            }
          } catch {}
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || `Failed to refine ${moduleKey} module.`);
      }

      setContentPackage((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          [moduleKey]: result.data
        };
      });

      soundManager.playSuccess();
      triggerCopyNotification(`regen-${moduleKey}`);
    } catch (err: any) {
      console.error(err);
      setError(`Module refinement failed: ${err.message}`);
    } finally {
      setModuleLoadingKey(null);
    }
  };

  // Clear App deck for clean slate
  const handleClearAll = () => {
    if (!clearConfirm) {
      soundManager.playClick();
      setClearConfirm(true);
      // Automatically reset option after 4 seconds of idle
      setTimeout(() => {
        setClearConfirm(prev => {
          if (prev) return false;
          return prev;
        });
      }, 4000);
    } else {
      soundManager.playSuccess();
      setText("");
      setContentPackage(null);
      setProjectName("");
      setActiveProjectId(undefined);
      setError(null);
      setClearConfirm(false);
    }
  };

  // General element copy helper
  const handleCopyToClipboard = (textToCopy: string, keyName: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(textToCopy);
    triggerCopyNotification(keyName);
  };

  const triggerCopyNotification = (key: string) => {
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Full-kit bulk compilers
  const getCompiledTextKit = (): string => {
    if (!contentPackage) return "";
    let data = `=== CREATOROS PACKAGE: ${projectName || "Untitled"} ===\n`;
    data += `Goal: ${goal} | Niche: ${niche} | Tone: ${tone} | Language: ${language}\n\n`;

    data += `--- REWRITTEN SCRIPT (VIRAL VERSION) ---\n${contentPackage.scripts.viral}\n\n`;
    data += `--- REWRITTEN SCRIPT (STORYTELLING) ---\n${contentPackage.scripts.storytelling}\n\n`;
    data += `--- REWRITTEN SCRIPT (HOOK FIRST) ---\n${contentPackage.scripts.hookFirst}\n\n`;

    data += `--- HOOKS ---\n`;
    data += `[Curiosity] ${contentPackage.hooks.curiosity.join(" | ")}\n`;
    data += `[Shock] ${contentPackage.hooks.shock.join(" | ")}\n`;
    data += `[Negative] ${contentPackage.hooks.negative.join(" | ")}\n\n`;

    data += `--- CALLS TO ACTION ---\n`;
    data += `[Follow CTA] ${contentPackage.ctas.follow.join("\n")}\n`;
    data += `[Comment Trigger] ${contentPackage.ctas.comment.join("\n")}\n\n`;

    data += `--- CAPTIONS & METADATA ---\n`;
    data += `[Viral Format]\n${contentPackage.captions.viralFormat}\n\n`;
    data += `[SEO Keywords] ${contentPackage.keywords.primary.join(", ")}\n`;
    data += `[Hashtags] ${contentPackage.hashtags.broad.join(" ")}\n`;

    return data;
  };

  const handleExportTxt = () => {
    const rawData = getCompiledTextKit();
    if (!rawData) return;
    const blob = new Blob([rawData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CreatorOS-${projectName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!contentPackage) return;
    const blob = new Blob([JSON.stringify(contentPackage, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CreatorOS-${projectName.toLowerCase().replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="creatoros-app-root" className={`min-h-screen text-[#e8dfd8] bg-[#0c0c0e] font-sans relative py-6 px-4 md:px-8 flex flex-col justify-between overflow-hidden selection:bg-[#cf7051]/30 selection:text-white pb-12 transition-all duration-300 ${theme === "light" ? "theme-light" : "theme-atelier"}`}>
      {/* Background Cinematic Floating Particles & Orbs */}
      <FloatingAccentLayer />

      {/* Elegant, cinematic theme transition sweep overlay - Bottom to Top Sweep */}
      <AnimatePresence mode="popLayout">
        {themeWave && (
          <motion.div
            key={themeWave.id}
            initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", opacity: 0.9 }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: [0.9, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              clipPath: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
              opacity: { times: [0, 0.5, 1], duration: 0.75, ease: "easeOut" }
            }}
            onAnimationComplete={() => setThemeWave(null)}
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
            style={{
              background: themeWave.theme === "light"
                ? "linear-gradient(0deg, rgba(255,255,255,0.96) 0%, rgba(207,112,81,0.5) 40%, rgba(202,169,114,0.15) 75%, rgba(12,12,14,0) 100%)"
                : "linear-gradient(0deg, rgba(14,14,16,0.96) 0%, rgba(32,32,34,0.6) 40%, rgba(207,112,81,0.1) 75%, rgba(0,0,0,0) 100%)"
            }}
          >
            {/* Luminous, sweeping vertical high-vibrancy brand colored ray (bottom-to-top) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-t from-transparent via-[#cf7051]/35 to-[#cca972]/20 blur-3xl filter brightness-150"
            />
            {/* Central glowing, expanding dimensional tactile ripple */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.8 }}
              animate={{ scale: 4.0, opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -track-translate-x-1/2 -track-translate-y-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#cca972]/30"
              style={{ boxShadow: "0 0 50px rgba(207,112,81,0.3)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Ambient Sand and Rose Globs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#cf7051]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#cca972]/3 blur-[120px] pointer-events-none" />

      {/* Main Container Layer */}
      <AppShell>
        <TopBar
          theme={theme}
          toggleTheme={toggleTheme}
          isMuted={isMuted}
          toggleSound={toggleSound}
          animationsEnabled={animationsEnabled}
          toggleAnimations={toggleAnimations}
          showProfile={showProfile}
          toggleProfile={() => {
            soundManager.playClick();
            setShowProfile(!showProfile);
          }}
        />

        {/* Local Settings Configuration Area */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, height: 0, scaleY: 0.95, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", scaleY: 1, marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, scaleY: 0.95, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="origin-top overflow-hidden"
            >
              <ProfileConfig onSync={handleProfileSync} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Inspiration Fuel Quote System */}
        <QuoteOrb language={language} />

        {/* Master Workspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4">
          
          {/* Suite Hub sidebar controller */}
          <div className="lg:col-span-3">
            <SidebarNav
              activeWorkspace={activeWorkspace}
              setWorkspace={(ws) => {
                soundManager.playClick();
                setActiveWorkspace(ws);
              }}
              savedCount={savedProjects.length}
              intelCount={intelCount}
              onOpenSettings={() => {
                soundManager.playClick();
                setShowProfile(!showProfile);
              }}
              showProfile={showProfile}
            />
          </div>

          {/* Active Workspace Container (Right side - Spans 9/12) */}
          <div className="lg:col-span-9 space-y-6">
            
            <AnimatePresence mode="popLayout">
              {activeWorkspace === "intelligence" ? (
                <motion.div
                  key="workspace-intel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <CreatorIntelligencePage onIntelCountChange={setIntelCount} />
                </motion.div>
              ) : (
                <motion.div
                  key="workspace-atelier"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
                >
                  
                  {/* LEFT SIDEBAR: Control Deck & History (Spans 5/12) */}
                  <div className="xl:col-span-5 space-y-6">
            
            {/* Input Configuration Deck */}
            <div className="bg-[#141416]/95 backdrop-blur-md border border-[#232225] rounded-2xl p-6 shadow-xl relative overflow-hidden transition duration-300 hover:border-[#cf7051]/30">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-widest text-[#cca972] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#cf7051] animate-pulse" />
                  <span>Control Deck</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      handleLoadSample("idea");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="text-[10px] bg-[#222224] hover:bg-[#2e2e32] border border-[#2e2c2a] px-3.5 py-1.5 rounded-lg text-[#e8dfd8] transition cursor-pointer"
                  >
                    💡 Sample Topic
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      handleLoadSample("script");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="text-[10px] bg-[#222224] hover:bg-[#2e2e32] border border-[#2e2c2a] px-3.5 py-1.5 rounded-lg text-[#e8dfd8] transition cursor-pointer"
                  >
                    📝 Sample Script
                  </button>
                </div>
              </div>

              {/* Paste Inputs Textarea */}
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => soundManager.playHover()}
                  className="w-full min-h-[160px] bg-[#0c0c0e]/80 border border-[#232225] rounded-xl p-4 text-sm text-[#e8dfd8] placeholder-[#5e5a5c] focus:outline-none focus:border-[#cf7051]/60 focus:ring-1 focus:ring-[#cf7051]/20 font-sans leading-relaxed resize-y transition duration-200"
                  placeholder="Paste your topic, rough idea, bullet points or complete script here. CreatorOS will transform it completely..."
                />
                {text && (
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-[#9ca69b] uppercase bg-[#141416] px-2 py-0.5 rounded border border-[#232225]">
                    {text.length} characters
                  </span>
                )}
              </div>

              {/* Form Input parameters */}
              <div className="grid grid-cols-2 gap-3.5 mt-5">
                <div>
                  <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Source Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => {
                      soundManager.playClick();
                      setContentType(e.target.value);
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                  >
                    <option value="Topic only" className="bg-[#141416]">Topic Only</option>
                    <option value="Rough script" className="bg-[#141416]">Rough Script</option>
                    <option value="Full creator script" className="bg-[#141416]">Full Creator Script</option>
                  </select>
                </div>

                <div>
                   <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Target Niche</label>
                   <select
                     value={niche}
                     onChange={(e) => {
                       soundManager.playClick();
                       setNiche(e.target.value);
                     }}
                     onMouseEnter={() => soundManager.playHover()}
                     className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                   >
                     <option value="AI tools for Indian students" className="bg-[#141416]">AI for Indian Students</option>
                     <option value="Tech / coding / dev" className="bg-[#141416]">Tech & Coding / Dev</option>
                     <option value="JEE / NEET / UPSC / SSC" className="bg-[#141416]">JEE / NEET / UPSC / SSC</option>
                     <option value="College / student life" className="bg-[#141416]">College / Student Life</option>
                     <option value="Finance / money / investing" className="bg-[#141416]">Finance & Investing</option>
                     <option value="Startup / entrepreneurship" className="bg-[#141416]">Startup & Business</option>
                     <option value="Freelancing / remote work" className="bg-[#141416]">Freelancing & Remote Work</option>
                     <option value="Personal branding" className="bg-[#141416]">Personal Branding</option>
                     <option value="Edtech / education" className="bg-[#141416]">Edtech & Education</option>
                     <option value="Fitness / self-improvement" className="bg-[#141416]">Fitness & Self-Improvement</option>
                     <option value="Meme / entertainment" className="bg-[#141416]">Meme & Entertainment</option>
                     <option value="Mixed / General" className="bg-[#141416]">Mixed / General</option>
                   </select>
                 </div>
 
                 <div>
                   <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Voice Tone</label>
                   <select
                     value={tone}
                     onChange={(e) => {
                       soundManager.playClick();
                       setTone(e.target.value);
                     }}
                     onMouseEnter={() => soundManager.playHover()}
                     className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                   >
                     <option value="Friendly teacher" className="bg-[#141416]">Friendly teacher</option>
                     <option value="Smart friend" className="bg-[#141416]">Smart friend</option>
                     <option value="Expert advisor" className="bg-[#141416]">Expert advisor</option>
                     <option value="Founder voice" className="bg-[#141416]">Founder voice</option>
                     <option value="Student mentor" className="bg-[#141416]">Student mentor</option>
                     <option value="Straightforward Indian creator" className="bg-[#141416]">Straightforward Indian creator</option>
                     <option value="Proof-based educator" className="bg-[#141416]">Proof-based educator</option>
                     <option value="Storytelling creator" className="bg-[#141416]">Storytelling creator</option>
                   </select>
                 </div>
 
                 <div>
                   <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Platform Style</label>
                   <select
                     value={platform}
                     onChange={(e) => {
                       soundManager.playClick();
                       setPlatform(e.target.value);
                     }}
                     onMouseEnter={() => soundManager.playHover()}
                     className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                   >
                     <option value="Instagram Reels" className="bg-[#141416]">Instagram Reels Only</option>
                     <option value="YouTube Shorts" className="bg-[#141416]">YouTube Shorts Only</option>
                     <option value="Both" className="bg-[#141416]">Vertical Dual-Feed (Both)</option>
                   </select>
                 </div>
 
                 <div>
                   <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Refactor Goal</label>
                   <select
                     value={goal}
                     onChange={(e) => {
                       soundManager.playClick();
                       setGoal(e.target.value);
                     }}
                     onMouseEnter={() => soundManager.playHover()}
                     className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                   >
                     <option value="Viral" className="bg-[#141416]">Max Virality Potential</option>
                     <option value="Retention" className="bg-[#141416]">High Dynamic Retention</option>
                     <option value="Clarity" className="bg-[#141416]">Simple Explainer Clarity</option>
                     <option value="Authority" className="bg-[#141416]">Elite Industry Authority</option>
                     <option value="Personal brand" className="bg-[#141416]">Personal Connection</option>
                   </select>
                 </div>
 
                 <div>
                   <label className="block text-[10.5px] uppercase font-bold text-[#cca972] mb-1.5">Output Language</label>
                   <select
                     value={language}
                     onChange={(e) => {
                       soundManager.playClick();
                       setLanguage(e.target.value);
                     }}
                     onMouseEnter={() => soundManager.playHover()}
                     className="w-full bg-[#18181b] text-xs text-[#e8dfd8] rounded-xl p-2.5 border border-[#28282b] focus:border-[#cf7051]/50 focus:outline-none transition cursor-pointer"
                   >
                     <option value="Hinglish" className="bg-[#141416]">Spoken Hinglish (Conversational)</option>
                     <option value="Hindi" className="bg-[#141416]">Hindi only (हिंदी)</option>
                     <option value="English" className="bg-[#141416]">English only</option>
                   </select>
                 </div>
               </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  onMouseEnter={() => soundManager.playHover()}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#cf7051] to-[#cca972] hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs rounded-xl tracking-wider uppercase transition shadow-lg shadow-[#cf7051]/15 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#e8dfd8] animate-pulse" />
                  {loading ? "Transforming Creator Package..." : "Compile Creator Package"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`flex-1 py-2.5 text-[11px] font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                      clearConfirm 
                        ? "bg-[#cf7051]/20 hover:bg-[#cf7051]/30 text-white border-[#cf7051]/60 shadow-lg shadow-[#cf7051]/10 scale-[1.01] animate-pulse" 
                        : "bg-[#202022] hover:bg-[#28282a] text-[#cca972] border-[#2e2a28]"
                    }`}
                  >
                    {clearConfirm ? "⚠️ Confirm Clear?" : "Clear Slate"}
                  </button>
                  {contentPackage && (
                    <button
                      onClick={handleSaveProject}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 py-2.5 bg-[#cf7051]/10 hover:bg-[#cf7051]/20 text-[#cf7051] border border-[#cf7051]/20 text-[11px] font-semibold rounded-xl transition cursor-pointer animate-pulse"
                    >
                      {dbStatus?.status === "CONNECTED" ? "Manual Cloud Backup" : "Save Local Backup"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Local History Sidebar Deck */}
            <div className="bg-[#141416]/95 backdrop-blur-md border border-[#232225] rounded-2xl p-5 shadow-xl transition duration-300 hover:border-[#cca972]/30">
              <div className="flex justify-between items-center pb-3 border-b border-[#232225] mb-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-[#cca972]" />
                  <h3 className="text-xs font-bold uppercase text-[#e8dfd8] tracking-wider mb-0">Project Backups</h3>
                </div>
                <span className="text-[10px] bg-[#cca972]/15 border border-[#cca972]/30 font-mono font-bold px-2.5 py-0.5 rounded-full text-[#cca972]">
                  {savedProjects.length} STORES
                </span>
              </div>
              
              <ProjectHistory
                projects={savedProjects}
                onSelect={handleSelectProject}
                onDelete={handleDeleteProject}
                selectedId={activeProjectId}
              />
            </div>

          </div>

          {/* RIGHT VIEW AREA: Dynamic Transform Deck (Spans 7/12 in sub-layout) */}
          <div className="xl:col-span-7 space-y-6">

            {/* Elegant Compilation Progress Bar */}
            <AnimatePresence>
              {showProgressBar && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#141416]/95 border border-[#cca972]/30 rounded-2xl p-4 shadow-xl shadow-[#cf7051]/5 relative overflow-hidden">
                    {/* Glowing corner ambiance */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#cf7051]/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cf7051] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#cf7051]"></span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#cca972]">
                          {compileProgress === 100 ? "Creator Package Compiled!" : "Compiling Creator Package..."}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#e8dfd8] font-mono font-bold bg-[#cf7051]/20 px-2 py-0.5 rounded border border-[#cf7051]/30">
                          {Math.floor(compileProgress)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 bg-[#0c0c0e] rounded-full overflow-hidden border border-[#232225] p-[1px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#cf7051] via-[#cca972] to-[#9ca69b] rounded-full relative"
                        style={{ width: `${compileProgress}%` }}
                        transition={{ ease: "easeOut" }}
                      >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[pulse_1.5s_infinite]" />
                      </motion.div>
                    </div>

                    <div className="flex justify-between items-center mt-2.5 gap-4">
                      <p className="text-[10px] text-slate-400 mb-0 leading-normal flex-1">
                        {compileProgress < 30 && "Spawning neural pipeline & fetching content models..."}
                        {compileProgress >= 30 && compileProgress < 65 && "Structuring viral Hook and dynamic Call-To-Action configurations..."}
                        {compileProgress >= 65 && compileProgress < 90 && "Tailoring 4 production scripts for B-Roll directors & caption editors..."}
                        {compileProgress >= 90 && compileProgress < 100 && "Polishing output streams & generating token schemas..."}
                        {compileProgress === 100 && "Compilation complete! Enjoy your refined assets!"}
                      </p>
                      <span className="text-[9px] text-[#9ca69b] font-mono shrink-0 uppercase tracking-widest pl-2">
                        {compileProgress === 100 ? "SUCCESS" : "Processing"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3.5 text-sm"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white mb-0.5">Pipeline Processing Outage</p>
                  <p className="text-red-300/80 text-xs leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Loader Trigger screen */}
            {loading && <LoadingIndicator />}

            {/* Empty view screen before initial process */}
            {!loading && !contentPackage && (
              <div className="py-12">
                <EmptyState 
                  type="no-input" 
                  onAction={() => handleLoadSample("idea")}
                  actionText="Apply Sample AI Agent Concept"
                />
              </div>
            )}

            {/* FULLY TRANSFORMED CREATOR PACKAGE CARD */}
            {contentPackage && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                tabIndex={0}
                className="space-y-6 focus:outline-none font-sans"
              >
                
                {/* Save Project Name / Metadata control */}
                <div className="p-4 bg-[#141416]/95 backdrop-blur-md border border-[#232225] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 w-full">
                    <label className="block text-[9px] uppercase tracking-widest font-extrabold text-[#cca972] mb-1">
                      Refactoring Project Identity
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Name your transformed asset package..."
                      className="w-full bg-[#0c0c0e]/80 border border-[#232225] rounded-xl py-2 px-3 text-sm font-semibold text-[#e8dfd8] focus:outline-none focus:border-[#cf7051]/60"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0">
                    <button
                      onClick={handleSaveProject}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#cf7051] hover:bg-[#c06041] hover:brightness-110 active:scale-[0.98] text-white shadow-lg transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      onClick={handleExportTxt}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#202022] hover:bg-[#2c2c2f] border border-[#2e2c2a] text-[#cca972] hover:text-white transition cursor-pointer"
                      title="Export compiled text asset"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      TXT
                    </button>
                    <button
                      onClick={handleExportJson}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#202022] hover:bg-[#2c2c2f] border border-[#2e2c2a] text-[#cca972] hover:text-white transition cursor-pointer"
                      title="Export JSON struct"
                    >
                      <FileJson className="w-3.5 h-3.5" />
                      JSON
                    </button>
                  </div>
                </div>

                {/* Score Widget Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#cf7051]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Hook Strength</span>
                    <span className="text-2xl font-black text-[#cf7051] mt-2 font-mono">{contentPackage.viralScore.hookStrength}%</span>
                  </div>
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#cca972]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Curiosity</span>
                    <span className="text-2xl font-black text-[#cca972] mt-2 font-mono">{contentPackage.viralScore.curiosity}%</span>
                  </div>
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#9ca69b]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Retention</span>
                    <span className="text-2xl font-black text-[#9ca69b] mt-2 font-mono">{contentPackage.viralScore.retention}%</span>
                  </div>
                  <div className="bg-[#141416]/95 border border-[#232225] hover:border-[#cca972]/30 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Clarity</span>
                    <span className="text-2xl font-black text-[#cca972] mt-2 font-mono">{contentPackage.viralScore.clarity}%</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 bg-[#141416]/95 border border-gradient-to-tr border-[#cf7051]/20 hover:border-[#cf7051]/40 rounded-xl p-3.5 flex flex-col justify-between transition duration-200">
                    <span className="text-[10px] text-[#9ca69b] font-bold uppercase tracking-wider">Overall SCORE</span>
                    <span className="text-2xl font-black text-[#cf7051] mt-2 font-mono">{contentPackage.viralScore.overallScore}%</span>
                  </div>
                </div>

                {/* Main Tab Controller navigation */}
                <div className="flex flex-wrap gap-2 border-b border-[#232225] pb-2.5">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("scripts");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "scripts" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    📝 Refactored Scripts
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("hooks-ctas");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "hooks-ctas" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    🪝 Scroll Hooks & CTAs
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("captions");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "captions" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    📱 Thumbnail & Captions
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("analysis");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "analysis" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    📊 Retention & Style Notes
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab("versions");
                    }}
                    onMouseEnter={() => soundManager.playHover()}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition cursor-pointer ${
                      activeTab === "versions" 
                        ? "bg-[#cf7051]/10 text-[#cf7051] border border-[#cf7051]/30 font-bold" 
                        : "text-[#e8dfd8]/60 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    🔄 The 4 Variant Models
                  </button>
                </div>

                {/* Dynamic Modules Rendering based on Active Tab */}
                <div className="relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "scripts" && (
                      <motion.div
                        key="scripts"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabContainerVariants(animationsEnabled)}
                        className="space-y-6"
                      >
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-400">Transform Multiverse (Script Rewrites)</h3>
                            <p className="text-[11px] text-slate-400">Choose the ideal framework variation derived from your raw draft.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("scripts")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "scripts" ? "animate-spin" : ""}`} />
                            {moduleLoadingKey === "scripts" ? "Refining..." : "Refine Scripts Only"}
                          </button>
                        </div>

                        {/* Script cards layout container */}
                        <div className="space-y-4">
                          
                          {/* Hyper-Viral Loop script variation */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative group">
                            <span className="inline-flex items-center gap-1 text-[10px] bg-red-600/20 text-red-300 font-mono font-bold px-2 py-0.5 rounded-md mb-2">
                              <Flame className="w-3 h-3" />
                              HYPER-VIRAL LOOP VARIATION
                            </span>
                            <p className="text-white text-xs leading-relaxed whitespace-pre-line font-mono">
                              {contentPackage.scripts.viral}
                            </p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.viral, "script-viral")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-slate-300 rounded-lg text-xs"
                              title="Copy version script"
                            >
                              {copiedKey === "script-viral" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Classic Immersive Storytelling variation */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative group">
                            <span className="inline-flex items-center gap-1 text-[10px] bg-purple-600/20 text-purple-300 font-mono font-bold px-2 py-0.5 rounded-md mb-2">
                              <BookOpen className="w-3 h-3" />
                              IMMERSIVE STORYTELLING FORMAT (Hero's Journey)
                            </span>
                            <p className="text-white text-xs leading-relaxed whitespace-pre-line font-medium text-slate-300">
                              {contentPackage.scripts.storytelling}
                            </p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.storytelling, "script-story")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-slate-300 rounded-lg text-xs"
                            >
                              {copiedKey === "script-story" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* No-Filler Hook First adaptation */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative group">
                            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-600/20 text-blue-300 font-mono font-bold px-2 py-0.5 rounded-md mb-2">
                              ⚡ NO-FILLER HOOK-FIRST ADAPTATION
                            </span>
                            <p className="text-white text-xs leading-relaxed whitespace-pre-line font-mono">
                              {contentPackage.scripts.hookFirst}
                            </p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.hookFirst, "script-hookfirst")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-slate-300 rounded-lg text-xs"
                            >
                              {copiedKey === "script-hookfirst" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Grid with Short (15s) vs Long (60-90s) formats & clean original */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative">
                              <span className="block text-[10px] font-bold text-amber-400 mb-2">⏱️ ULTRA PUNCHY REELS (15-30 SECONDS)</span>
                              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line font-mono">{contentPackage.scripts.short}</p>
                              <button
                                onClick={() => handleCopyToClipboard(contentPackage.scripts.short, "script-short")}
                                className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 text-slate-400 rounded-lg"
                              >
                                {copiedKey === "script-short" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>

                            <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative">
                              <span className="block text-[10px] font-bold text-teal-400 mb-2">📖 INTEGRATED DETAILED EXPOSITION (60-90 SECONDS)</span>
                              <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line font-medium text-slate-300">{contentPackage.scripts.longer}</p>
                              <button
                                onClick={() => handleCopyToClipboard(contentPackage.scripts.longer, "script-longer")}
                                className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 text-slate-400 rounded-lg"
                              >
                                {copiedKey === "script-longer" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>

                          </div>

                          {/* Original Cleaned Formatter */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 relative">
                            <span className="block text-[10px] font-bold text-indigo-400 mb-2">Cleaned / Structured Base Model</span>
                            <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-line">{contentPackage.scripts.originalCleaned}</p>
                            <button
                              onClick={() => handleCopyToClipboard(contentPackage.scripts.originalCleaned, "script-original-cleaned")}
                              className="absolute top-3 right-3 p-1.5 bg-gray-900 border border-gray-800 text-slate-400 rounded-lg"
                            >
                              {copiedKey === "script-original-cleaned" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* TAB 2: HOOK DECK & CTA BUILDER */}
                  {activeTab === "hooks-ctas" && (
                    <motion.div
                      key="hooks-ctas"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tabContainerVariants(animationsEnabled)}
                      className="space-y-6"
                    >
                      
                      {/* Hooks Section Card */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Scroll-Stopping Hooks Array</h3>
                            <p className="text-[11px] text-slate-400">7 distinctive emotional starting angles to immediately freeze viewer thumbs.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("hooks")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "hooks" ? "animate-spin" : ""}`} />
                            Refine Hooks list
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Loop other hooks */}
                          {Object.entries(contentPackage.hooks).map(([key, list]) => {
                            if (!Array.isArray(list)) return null;
                            const colors: Record<string, string> = {
                              curiosity: "border-indigo-500/30 text-indigo-300 bg-indigo-950/20",
                              shock: "border-purple-500/30 text-purple-300 bg-purple-950/20",
                              negative: "border-red-500/30 text-red-300 bg-red-950/20",
                              story: "border-teal-500/30 text-teal-300 bg-teal-950/20",
                              question: "border-blue-500/30 text-blue-300 bg-blue-950/20",
                              contrarian: "border-amber-500/30 text-amber-300 bg-amber-950/20",
                              scrollStopper: "border-pink-500/30 text-pink-300 bg-pink-950/20"
                            };
                            return (
                              <div key={key} className="bg-black/20 rounded-xl p-4 border border-white/5 relative">
                                <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md mb-2.5 ${colors[key] || "bg-gray-800"}`}>
                                  {key.replace(/([A-Z])/g, " $1")} Hook Type
                                </span>
                                <ul className="space-y-2 text-xs text-white">
                                  {list.map((hook, idx) => (
                                    <li key={idx} className="flex items-start gap-2 italic hover:text-indigo-200 transition">
                                      <span className="text-slate-500 font-mono shrink-0">#{idx + 1}</span>
                                      <span>&ldquo;{hook}&rdquo;</span>
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  onClick={() => handleCopyToClipboard(list.join("\n"), `hook-${key}`)}
                                  className="absolute top-3.5 right-3.5 text-xs text-slate-500 hover:text-white"
                                  title="Copy hook set"
                                >
                                  {copiedKey === `hook-${key}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* CTA Generator Card */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Audience Action CTAs</h3>
                            <p className="text-[11px] text-slate-400">Contextual calls-to-action designed to convert passive scrolls into loyal assets or comments.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("ctas")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "ctas" ? "animate-spin" : ""}`} />
                            Refine Call-to-actions
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(contentPackage.ctas).map(([key, list]) => {
                            if (!Array.isArray(list)) return null;
                            return (
                              <div key={key} className="bg-black/20 border border-white/5 rounded-xl p-3.5 relative">
                                <span className="block text-[10px] font-mono uppercase text-indigo-400 font-bold mb-2">
                                  {key} conversion trigger
                                </span>
                                <ul className="space-y-2 text-xs text-slate-300">
                                  {list.map((cta, idx) => (
                                    <li key={idx} className="bg-black/30 p-2 rounded border border-white/5 leading-relaxed">
                                      {cta}
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  onClick={() => handleCopyToClipboard(list.join("\n"), `cta-${key}`)}
                                  className="absolute top-3 right-3 text-xs text-slate-500 hover:text-white"
                                >
                                  {copiedKey === `cta-${key}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* TAB 3: CAPTIONS, THUMBNAILS & TAGS */}
                  {activeTab === "captions" && (
                    <motion.div
                      key="captions"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tabContainerVariants(animationsEnabled)}
                      className="space-y-6"
                    >
                      
                      {/* Caption Generator */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Multi-Format Bio Captions</h3>
                            <p className="text-[11px] text-slate-400">Clean copy variants formatted exactly for Instagram Reels and YouTube feeds.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("captions")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "captions" ? "animate-spin" : ""}`} />
                            Refine Captions
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(Object.entries(contentPackage.captions) as [string, string][]).map(([key, textVal]) => {
                            return (
                              <div key={key} className="bg-black/20 border border-white/5 rounded-xl p-4 relative group">
                                <span className="inline-block text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md mb-2 uppercase tracking-wide">
                                  {key.replace(/([A-Z])/g, " $1")} caption format
                                </span>
                                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                                  {textVal}
                                </p>
                                <button
                                  onClick={() => handleCopyToClipboard(textVal, `caption-${key}`)}
                                  className="absolute top-4.5 right-4 text-xs text-slate-500 hover:text-white"
                                >
                                  {copiedKey === `caption-${key}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>

                      {/* Thumbnail Text Overlay Suggestions */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-300">Thumbnail Overlay Copywriter</h3>
                            <p className="text-[11px] text-slate-500">Short, brutal micro segments formatted to display perfectly on high-speed canvases.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("thumbnailText")}
                            disabled={moduleLoadingKey !== null}
                            className="text-[10px] bg-gray-800 hover:bg-gray-700 text-slate-300 px-3 py-1.5 rounded-lg"
                          >
                            Refine Overlay Text
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <span className="block text-[10px] text-indigo-400 uppercase font-bold mb-2">⏱️ Under 3-Words Extreme</span>
                            <ul className="space-y-2 text-xs">
                              {contentPackage.thumbnailText.short.map((t, i) => (
                                <li key={i} className="text-white font-black bg-indigo-500/10 border border-indigo-500/20 p-2 rounded text-center">
                                  &ldquo;{t}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <span className="block text-[10px] text-purple-400 uppercase font-bold mb-2">⚡ 2-Line High Contrast</span>
                            <ul className="space-y-2 text-xs">
                              {contentPackage.thumbnailText.punchy.map((t, i) => (
                                <li key={i} className="text-white font-extrabold bg-purple-500/10 border border-purple-500/20 p-2 rounded text-center">
                                  &ldquo;{t}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                            <span className="block text-[10px] text-emerald-400 uppercase font-bold mb-2">🤔 Curiosity Gap Builder</span>
                            <ul className="space-y-2 text-xs">
                              {contentPackage.thumbnailText.curiosityBased.map((t, i) => (
                                <li key={i} className="text-white bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-center font-semibold italic">
                                  &ldquo;{t}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>

                      {/* Hashtags & Keywords Modules */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Hashtag list widget */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold uppercase text-indigo-400">Hashtags Categorizer</h4>
                            <button
                              onClick={() => handleRegenerateModule("hashtags")}
                              className="text-[10px] text-slate-500 hover:text-white"
                            >
                              Regen
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold mb-1.5">Niche focused:</span>
                              <p className="text-xs text-slate-300 font-mono tracking-wide">
                                {contentPackage.hashtags.niche.join(" ")}
                              </p>
                            </div>
                            
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold mb-1.5">Topic focused:</span>
                              <p className="text-xs text-slate-300 font-mono tracking-wide col-span-2">
                                {contentPackage.hashtags.topicSpecific.join(" ")}
                              </p>
                            </div>

                            <div className="bg-black/30 p-3 rounded-lg border border-white/5 relative">
                              <span className="block text-[10px] text-emerald-400 font-bold mb-1.5">⭐ Ready Copy Blocks (Instagram / TikTok):</span>
                              {contentPackage.hashtags.platformFriendlySets.map((block, idx) => (
                                <p key={idx} className="text-xs text-slate-200 mt-1 font-mono hover:text-indigo-300 cursor-pointer"
                                   onClick={() => handleCopyToClipboard(block.join(" "), `tag-set-${idx}`)}>
                                  {block.join(" ")}
                                </p>
                              ))}
                              <small className="block text-[9px] text-slate-500 mt-2">Click any copy block to send cleanly to clipboard.</small>
                            </div>
                          </div>
                        </div>

                        {/* Keyword list widget */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold uppercase text-indigo-400">SEO Keyword Registry</h4>
                            <button
                              onClick={() => handleRegenerateModule("keywords")}
                              className="text-[10px] text-slate-500 hover:text-white"
                            >
                              Regen
                            </button>
                          </div>

                          <div className="space-y-3.5">
                            <div>
                              <span className="block text-[9px] text-slate-500 font-mono uppercase">Primary Query Target:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contentPackage.keywords.primary.map((k, i) => (
                                  <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="block text-[9px] text-slate-500 font-mono uppercase">Long-Tail Hooks:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contentPackage.keywords.longTail.map((k, i) => (
                                  <span key={i} className="text-[11px] bg-emerald-900/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/20">
                                    {k}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                              <span className="block text-[9px] text-slate-400 font-mono uppercase mb-1">High-Volume Search Phrases:</span>
                              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                                {contentPackage.keywords.searchPhrases.map((phrase, i) => (
                                  <li key={i}>{phrase}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* TAB 4: RETENTION ANALYSIS & STYLE CARDS */}
                  {activeTab === "analysis" && (
                    <motion.div
                      key="analysis"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tabContainerVariants(animationsEnabled)}
                      className="space-y-6"
                    >
                      
                      {/* NEW: SAVED PORTFOLIO RADAR ANALYSIS PANEL */}
                      <motion.div 
                        variants={tabItemVariants(animationsEnabled)} 
                        className="bg-[#141416]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden"
                      >
                        {/* Shimmer element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#cf7051]/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#232225]">
                          <div>
                            <h3 className="text-sm font-bold text-[#cca972] uppercase tracking-wider flex items-center gap-2">
                              <Activity className="w-4 h-4 text-[#cf7051]" />
                              Saved Portfolio Frequency Matrix
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Dynamic radar insights plotting your core niche signatures, voice tones, and brand conversion goals.
                            </p>
                          </div>
                          
                          {/* Sync / Status Indicator */}
                          <div className="flex items-center gap-2 self-start md:self-auto">
                            {savedProjects.length > 0 ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                Custom Portfolio (Active: {savedProjects.length})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#cf7051]/10 border border-[#cf7051]/20 text-[#cf7051]">
                                <span className="w-1.5 h-1.5 bg-[#cf7051] rounded-full animate-ping" />
                                Demonstration mode (Seeded Data)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Radar Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* NICHES RADAR */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-3">
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">🌐 Content Niches</span>
                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Aggregate</span>
                            </div>
                            <div className="w-full h-[220px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData("niche")}>
                                  <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                                  <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fill: "rgba(232, 223, 216, 0.6)", fontSize: 8, fontWeight: 500 }} 
                                  />
                                  <PolarRadiusAxis 
                                    angle={90} 
                                    domain={[0, "auto"]} 
                                    tick={{ fill: "rgba(156, 166, 155, 0.5)", fontSize: 7 }} 
                                    axisLine={false}
                                  />
                                  <Radar 
                                    name="Niches" 
                                    dataKey="count" 
                                    stroke="#cf7051" 
                                    fill="#cf7051" 
                                    fillOpacity={0.25} 
                                  />
                                  <RechartsTooltip 
                                    contentStyle={{ 
                                      backgroundColor: "rgba(20, 20, 22, 0.95)", 
                                      border: "1px solid rgba(255, 255, 255, 0.15)", 
                                      borderRadius: "12px", 
                                      fontSize: "11px" 
                                    }}
                                    itemStyle={{ color: "#e8dfd8" }}
                                    labelClassName="text-slate-400 text-[10px]"
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
                              Focus centers on <strong className="text-[#cf7051]">AI</strong> and <strong className="text-[#cf7051]">Tech</strong> sectors.
                            </p>
                          </div>

                          {/* TONES RADAR */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-3">
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">🎭 Voice Tones</span>
                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Distribution</span>
                            </div>
                            <div className="w-full h-[220px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData("tone")}>
                                  <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                                  <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fill: "rgba(232, 223, 216, 0.6)", fontSize: 8, fontWeight: 500 }} 
                                  />
                                  <PolarRadiusAxis 
                                    angle={90} 
                                    domain={[0, "auto"]} 
                                    tick={{ fill: "rgba(156, 166, 155, 0.5)", fontSize: 7 }} 
                                    axisLine={false}
                                  />
                                  <Radar 
                                    name="Tones" 
                                    dataKey="count" 
                                    stroke="#cca972" 
                                    fill="#cca972" 
                                    fillOpacity={0.25} 
                                  />
                                  <RechartsTooltip 
                                    contentStyle={{ 
                                      backgroundColor: "rgba(20, 20, 22, 0.95)", 
                                      border: "1px solid rgba(255, 255, 255, 0.15)", 
                                      borderRadius: "12px", 
                                      fontSize: "11px" 
                                    }}
                                    itemStyle={{ color: "#e8dfd8" }}
                                    labelClassName="text-slate-400 text-[10px]"
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
                              Preferring an <strong className="text-[#cca972]">Educational</strong> and <strong className="text-[#cca972]">Bold</strong> delivery style.
                            </p>
                          </div>

                          {/* GOALS RADAR */}
                          <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-3">
                              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">🎯 Refactor Goals</span>
                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Alignment</span>
                            </div>
                            <div className="w-full h-[220px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData("goal")}>
                                  <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                                  <PolarAngleAxis 
                                    dataKey="subject" 
                                    tick={{ fill: "rgba(232, 223, 216, 0.6)", fontSize: 8, fontWeight: 500 }} 
                                  />
                                  <PolarRadiusAxis 
                                    angle={90} 
                                    domain={[0, "auto"]} 
                                    tick={{ fill: "rgba(156, 166, 155, 0.5)", fontSize: 7 }} 
                                    axisLine={false}
                                  />
                                  <Radar 
                                    name="Goals" 
                                    dataKey="count" 
                                    stroke="#9ca69b" 
                                    fill="#9ca69b" 
                                    fillOpacity={0.25} 
                                  />
                                  <RechartsTooltip 
                                    contentStyle={{ 
                                      backgroundColor: "rgba(20, 20, 22, 0.95)", 
                                      border: "1px solid rgba(255, 255, 255, 0.15)", 
                                      borderRadius: "12px", 
                                      fontSize: "11px" 
                                    }}
                                    itemStyle={{ color: "#e8dfd8" }}
                                    labelClassName="text-slate-400 text-[10px]"
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
                              Optimized mostly for <strong className="text-[#9ca69b]">Virality</strong> and <strong className="text-[#9ca69b]">High Retention</strong> indices.
                            </p>
                          </div>
                        </div>

                        {/* Interactive Hint banner below */}
                        {savedProjects.length > 0 && (
                          <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">
                              Your trends map is computed from your live database/local workspace history log in real-time.
                            </span>
                            <span className="text-[10px] font-bold text-[#cca972] font-mono uppercase tracking-wider">
                              Real-Time Stream Active
                            </span>
                          </div>
                        )}
                      </motion.div>

                      {/* Pipeline retention step diagnostics */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Dynamic Viewer Retention Diagnostics</h3>
                            <p className="text-[11px] text-slate-400">Strategic breakdown of speaking patterns, tension releases and CTAs drops.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("retentionAnalysis")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "retentionAnalysis" ? "animate-spin" : ""}`} />
                            Refine Diagnostics
                          </button>
                        </div>

                        {/* 5 Stage Retention pipeline cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mb-5">
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-indigo-400 font-mono uppercase font-bold">1. Hook Trigger</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.hook}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-purple-400 font-mono uppercase font-bold">2. Setup Step</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.setup}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-red-400 font-mono uppercase font-bold">3. Tension release</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.tension}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-emerald-400 font-mono uppercase font-bold">4. Value Payoff</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.payoff}</p>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl">
                            <span className="block text-[9px] text-amber-400 font-mono uppercase font-bold">5. Conversion CTA</span>
                            <p className="text-[11px] text-slate-200 mt-2 leading-relaxed">{contentPackage.retentionAnalysis.pipeline.cta}</p>
                          </div>
                        </div>

                        {/* Weakness & Improvements lists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-red-950/15 border border-red-900/30 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-red-300 uppercase mb-2">🚨 Potential Audience Dropoff Risks</h4>
                            <ul className="space-y-2 text-xs text-slate-300 list-disc pl-5">
                              {contentPackage.retentionAnalysis.weaknesses.map((w, i) => (
                                <li key={i} className="leading-relaxed">{w}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-emerald-950/15 border border-emerald-900/30 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-emerald-300 uppercase mb-2">🚀 Actionable Speed Tweak Solutions</h4>
                            <ul className="space-y-2 text-xs text-slate-300 list-disc pl-5">
                              {contentPackage.retentionAnalysis.suggestions.map((s, i) => (
                                <li key={i} className="leading-relaxed">{s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>

                      {/* Title Generator Section */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Viral Title & click-stopper Ideas</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                            <span className="block text-[10px] text-indigo-400 font-bold uppercase mb-2">Creative Shorts Titles</span>
                            <ul className="space-y-2 text-xs text-white">
                              {contentPackage.titles.titleIdeas.map((t, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start hover:text-indigo-400 cursor-pointer"
                                    onClick={() => handleCopyToClipboard(t, `title-${idx}`)}>
                                  <span className="text-slate-500 font-mono">#{idx+1}</span>
                                  <span>&ldquo;{t}&rdquo;</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                            <span className="block text-[10px] text-purple-400 font-bold uppercase mb-2">Clickable YouTube Headlines</span>
                            <ul className="space-y-2 text-xs text-white">
                              {contentPackage.titles.headlines.map((t, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start hover:text-purple-400 cursor-pointer"
                                    onClick={() => handleCopyToClipboard(t, `headline-${idx}`)}>
                                  <span className="text-slate-500 font-mono">#{idx+1}</span>
                                  <span>&ldquo;{t}&rdquo;</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5">
                            <span className="block text-[10px] text-rose-400 font-bold uppercase mb-2">Aggressive Click-Stoppers</span>
                            <ul className="space-y-2 text-xs text-white">
                              {contentPackage.titles.scrollStopping.map((t, idx) => (
                                <li key={idx} className="flex gap-1.5 items-start hover:text-rose-400 cursor-pointer"
                                    onClick={() => handleCopyToClipboard(t, `stopping-${idx}`)}>
                                  <span className="text-slate-500 font-mono">#{idx+1}</span>
                                  <span>&ldquo;{t}&rdquo;</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>

                      {/* Instructor Style Notes Card */}
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-300">Creator Delivery Blueprint</h3>
                            <p className="text-[11px] text-slate-500">Physical directives regarding pacing, style tone, and energetic thresholds.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("styleNotes")}
                            className="text-[10px] text-slate-500 hover:text-white"
                          >
                            Tweak Delivery Profile
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <span className="block text-[10px] text-indigo-400 font-bold uppercase mb-2">Physical Delivery parameters</span>
                            
                            <table className="w-full text-xs text-slate-300 space-y-2">
                              <tbody>
                                <tr className="border-b border-gray-800">
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Style Layout:</td>
                                  <td className="py-2 pl-4 font-bold text-white">{contentPackage.styleNotes.style}</td>
                                </tr>
                                <tr className="border-b border-gray-800">
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Talking speed & pacing:</td>
                                  <td className="py-2 pl-4 text-slate-300">{contentPackage.styleNotes.pacing}</td>
                                </tr>
                                <tr className="border-b border-gray-800">
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Emotional tone:</td>
                                  <td className="py-2 pl-4 text-slate-300">{contentPackage.styleNotes.tone}</td>
                                </tr>
                                <tr>
                                  <td className="py-2 text-slate-500 font-semibold uppercase">Energy Profile:</td>
                                  <td className="py-2 pl-4 text-slate-300 font-mono text-indigo-400">{contentPackage.styleNotes.emotionalEnergy}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                            <div>
                              <span className="block text-[10px] text-emerald-400 font-bold uppercase mb-2">Perfect Audience Avatar match</span>
                              <p className="text-xs text-slate-300 leading-relaxed">{contentPackage.styleNotes.audienceMatch}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-800 mt-4">
                              <span className="block text-[10px] text-amber-400 font-bold uppercase mb-1">Strongest Competitive Hook Angle</span>
                              <p className="text-xs text-slate-300 leading-relaxed italic">&ldquo;{contentPackage.styleNotes.strongestAngle}&rdquo;</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* TAB 5: MULTIPLE SELF-CONTAINED PRODUCTION VERSIONS */}
                  {activeTab === "versions" && (
                    <motion.div
                      key="versions"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tabContainerVariants(animationsEnabled)}
                      className="space-y-6"
                    >
                      <motion.div variants={tabItemVariants(animationsEnabled)} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Self-Contained Content Packages</h3>
                            <p className="text-[11px] text-slate-400">4 distinct product concepts, complete with title, hook, text script, and caption.</p>
                          </div>
                          <button
                            onClick={() => handleRegenerateModule("fullVersions")}
                            disabled={moduleLoadingKey !== null}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 self-start"
                          >
                            <RefreshCw className={`w-3 h-3 ${moduleLoadingKey === "fullVersions" ? "animate-spin" : ""}`} />
                            Refine All 4 Versions
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {(Object.entries(contentPackage.fullVersions) as [string, { title: string; hook: string; script: string; caption: string }][]).map(([vKey, data]) => {
                            const badgeColors: Record<string, string> = {
                              conservative: "bg-blue-600/20 text-blue-300 border-blue-500/30",
                              viral: "bg-red-600/20 text-red-300 border-red-500/30",
                              storytelling: "bg-purple-600/20 text-purple-300 border-purple-500/30",
                              concise: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30"
                            };

                            return (
                              <div key={vKey} className="bg-black/30 border border-white/5 rounded-xl p-4.5 relative space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                                  <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${badgeColors[vKey] || "bg-gray-800"}`}>
                                    {vKey} execution model
                                  </span>
                                  <button
                                    onClick={() => handleCopyToClipboard(
                                      `Title: ${data.title}\nHook: ${data.hook}\nScript: ${data.script}\nCaption: ${data.caption}`,
                                      `v-${vKey}`
                                    )}
                                    className="text-xs text-slate-500 hover:text-white"
                                    title="Copy package parameters"
                                  >
                                    {copiedKey === `v-${vKey}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                <div className="space-y-2 text-xs">
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Click-proven Title:</span>
                                    <p className="text-white font-bold">{data.title}</p>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Thumb-Freeze Hook:</span>
                                    <p className="text-slate-300 italic font-mono">&ldquo;{data.hook}&rdquo;</p>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Production Script:</span>
                                    <p className="text-slate-200 whitespace-pre-line leading-relaxed bg-black/40 p-2.5 rounded border border-white/5 text-[11px] font-mono">{data.script}</p>
                                  </div>
                                  <div>
                                    <span className="block text-[9px] text-slate-500 uppercase font-mono">Accompanying Caption:</span>
                                    <p className="text-slate-400 leading-normal line-clamp-2">{data.caption}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>

                {/* Overarching encouraging notes from the system */}
                {contentPackage.notes && (
                  <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-4.5 mt-4 text-xs italic text-emerald-300 flex items-start gap-3">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Director Feedback Loop:</strong> {contentPackage.notes}
                    </span>
                  </div>
                )}

                {/* Consolidated Executive Action Bar */}
                <div className="bg-gradient-to-r from-[#141416]/95 to-[#232225]/40 border border-[#cf7051]/30 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl">
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#e8dfd8] tracking-widest">Execute Executive Bulk Copy</h4>
                    <p className="text-[11px] text-[#cca972]/85 mt-0.5">Copy all rewrites, hooks, CTAs, and captions cleanly formatted with a single command.</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleCopyToClipboard(getCompiledTextKit(), "bulk-kit")}
                      onMouseEnter={() => soundManager.playHover()}
                      className={`flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                        copiedKey === "bulk-kit" ? "bg-emerald-600 text-white" : "bg-[#cf7051] hover:bg-[#c06041] hover:scale-[1.02] text-white shadow-lg"
                      }`}
                    >
                      {copiedKey === "bulk-kit" ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce" />
                          Complete Kit Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Entire Package
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>
</AppShell>

      {/* Footer Meta Diagnostics */}
      <footer className="mt-12 pt-6 border-t border-[#232225] flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-[#9ca69b] uppercase tracking-widest max-w-7xl mx-auto w-full font-mono">
        <div className="flex flex-wrap justify-center gap-4">
          <span>Storage Engine: <span className="text-[#cca972] font-semibold">Secure Auto-Save Project Database Cache</span></span>
          <span className="hidden sm:inline text-white/10">•</span>
          <span>Security Model: <span className="text-[#cca972] font-semibold">Server-Side Proxy Vault</span></span>
        </div>
        <div>
          <span className="text-white/40">Crafted in Cloud Container Workspace for akshatusing02@gmail.com</span>
        </div>
      </footer>

      {/* Global Success Banner alerts */}
      <AnimatePresence>
        {copiedKey && !copiedKey.startsWith("script") && !copiedKey.startsWith("hook") && !copiedKey.startsWith("cta") && !copiedKey.startsWith("caption") && !copiedKey.startsWith("v-") && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-green-500/30 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2.5 z-50"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span>
              {copiedKey === "project-saved-supabase" && "Project Auto-Saved to Secure Cloud Backup!"}
              {copiedKey === "project-saved-local-only" && "Saved Locally (Notice: Cloud backup is processing)"}
              {copiedKey === "project-saved" && "Transform Package Auto-Saved to Secure Local Storage!"}
              {copiedKey === "deleted-supabase" && "Project Deleted & Cleaned from Secure Cloud Backup!"}
              {copiedKey === "deleted" && "Project Deleted Successfully!"}
              {copiedKey === "db-synced" && "Database Synced: Reloaded Live Records!"}
              {copiedKey === "setup-sql" && "SQL Creation Schema Copied!"}
              {copiedKey === "bulk-kit" && "Entire Content Package Copied to Clipboard!"}
              {!["project-saved-supabase", "project-saved", "deleted-supabase", "deleted", "db-synced", "setup-sql", "bulk-kit", "project-saved-local-only"].includes(copiedKey) && `Refactoring Completed: [${copiedKey}]`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
