import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Sparkles, 
  Flame, 
  Compass, 
  Share2, 
  Activity, 
  Folder, 
  Database, 
  Cloud, 
  CloudOff, 
  AlertTriangle,
  Check,
  Copy,
  Save,
  FileText,
  FileJson
} from "lucide-react";

import ProfileConfig from "./components/ProfileConfig";
import ProjectHistory from "./components/ProjectHistory";
import LoadingIndicator from "./components/LoadingIndicator";
import EmptyState from "./components/EmptyState";
import { ContentPackage, SavedProject, ProfileMemory } from "./types";
import { soundManager } from "./utils/sound";
import QuoteOrb from "./components/QuoteOrb";
import FloatingAccentLayer from "./components/FloatingAccentLayer";
import AppShell from "./components/AppShell";
import SidebarNav from "./components/SidebarNav";
import TopBar from "./components/TopBar";

import ScriptStudioView from "./components/ScriptStudioView";
import ContentAdvisorView from "./components/ContentAdvisorView";
import OpportunityHubView from "./components/OpportunityHubView";
import PublishKitView from "./components/PublishKitView";

export default function App() {
  // 1. Navigation & UI States
  const [activeWorkspace, setActiveWorkspace] = useState<
    "script-studio" | "content-advisor" | "opportunity-hub" | "creator-library" | "publish-kit"
  >("script-studio");
  const [showProfile, setShowProfile] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  // 2. Input Parameter States
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("Full creator script");
  const [language, setLanguage] = useState("Hinglish");
  const [niche, setNiche] = useState("Tech / coding / dev");
  const [tone, setTone] = useState("Smart friend");
  const [platform, setPlatform] = useState("Both");
  const [goal, setGoal] = useState("Viral");
  const [style, setStyle] = useState("Modern / minimal");

  // 3. Project Information
  const [projectName, setProjectName] = useState("Untitled Project");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // 4. Content Output Package & Diagnostics
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [intelCount, setIntelCount] = useState(0);

  // 5. Loading, Errors, & Progress States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compileProgress, setCompileProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [moduleLoadingKey, setModuleLoadingKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  // 6. DB Status Matrix
  const [dbStatus, setDbStatus] = useState<{
    reachable: boolean;
    url?: string;
    setupSql?: string;
  } | null>(null);

  // 7. Initialize Sounds and Configs
  useEffect(() => {
    soundManager.setMuteStatus(!soundEnabled);
  }, [soundEnabled]);

  // Load Initial Saved Projects and DB Info on Mount
  useEffect(() => {
    checkDatabaseStatus();
    fetchProjects();
  }, []);

  // Sync Global Settings Profile config
  const handleProfileSync = (mem: ProfileMemory) => {
    soundManager.playSparkle();
    if (mem.language) setLanguage(mem.language);
    if (mem.niche) setNiche(mem.niche);
    if (mem.tone) setTone(mem.tone);
    setShowProfile(false);
    triggerBannerAlert("db-synced");
  };

  // Check Supabase Cloud Connection Status
  const checkDatabaseStatus = async () => {
    try {
      const res = await fetch("/api/database-status");
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      } else {
        setDbStatus({ reachable: false });
      }
    } catch {
      setDbStatus({ reachable: false });
    }
  };

  // Fetch saved projects from Cloud Run API (Supabase / Local cache fallback)
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data)) {
          if (data.source === "localStorage") {
            const local = localStorage.getItem("creatoros_projects");
            if (local) {
              setSavedProjects(JSON.parse(local));
              return;
            }
          }
          setSavedProjects(data.data);
          if (data.source === "supabase") {
            localStorage.setItem("creatoros_projects", JSON.stringify(data.data));
          }
        } else if (data && Array.isArray(data)) {
          // Fallback if array returned directly
          setSavedProjects(data);
          localStorage.setItem("creatoros_projects", JSON.stringify(data));
        } else {
          const local = localStorage.getItem("creatoros_projects");
          if (local) setSavedProjects(JSON.parse(local));
        }
      } else {
        const local = localStorage.getItem("creatoros_projects");
        if (local) setSavedProjects(JSON.parse(local));
      }
    } catch (e) {
      console.warn("Could not retrieve projects from database:", e);
      const local = localStorage.getItem("creatoros_projects");
      if (local) {
        setSavedProjects(JSON.parse(local));
      }
    }
  };

  // Compile Progress Simulator
  const simulateCompilation = (onComplete: () => void) => {
    setShowProgressBar(true);
    setCompileProgress(0);
    
    const interval = setInterval(() => {
      setCompileProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setTimeout(() => {
            setShowProgressBar(false);
            onComplete();
          }, 450);
          return 100;
        }
        return prev + Math.random() * 15 + 8;
      });
    }, 120);
  };

  // Core Transform Content Generator
  const handleGenerate = async () => {
    if (!text.trim()) return;
    soundManager.playSparkle();
    setLoading(true);
    setError(null);
    setContentPackage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          contentType,
          language,
          niche,
          tone,
          platform,
          goal,
          style,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const data: ContentPackage = await res.json();
      
      simulateCompilation(() => {
        setContentPackage(data);
        const headline = data.titles?.headlines?.[0] || data.titles?.titleIdeas?.[0] || `Transform: ${niche.split("/")[0].trim()}`;
        setProjectName(headline);
        setLoading(false);
        // Automatically route to Publish Kit to encourage posting!
        setActiveWorkspace("publish-kit");
        soundManager.playSuccess();
      });

    } catch (e: any) {
      setError(e.message || "Transformation pipeline encountered an issue. Please try again.");
      setLoading(false);
    }
  };

  // Module Refinement Generator (Captions, Hooks, SEO, CTAs, etc.)
  const handleRegenerateModule = async (moduleKey: string) => {
    if (!contentPackage) return;
    soundManager.playClick();
    setModuleLoadingKey(moduleKey);

    try {
      const res = await fetch("/api/regenerate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleKey,
          currentPackage: contentPackage,
          parameters: { text, contentType, language, niche, tone, platform, goal, style }
        }),
      });

      if (!res.ok) throw new Error("Module refinement pipeline failed.");

      const updatedPackage = await res.json();
      setContentPackage(updatedPackage);
      triggerBannerAlert(`refine-${moduleKey}`);
      soundManager.playSuccess();
    } catch (e: any) {
      console.error(e);
      setError(`Failed to refine: ${moduleKey}`);
    } finally {
      setModuleLoadingKey(null);
    }
  };

  // Save Project to Database (Cloud / Local state fallback)
  const handleSaveProject = async () => {
    if (!contentPackage) return;
    soundManager.playSparkle();

    const projectId = activeProjectId || `proj-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const payload: SavedProject = {
      id: projectId,
      timestamp,
      name: projectName,
      inputText: text,
      config: { 
        contentType, 
        language, 
        niche, 
        tone, 
        platform, 
        rewriteStrength: "Medium", 
        goal, 
        style 
      },
      packageData: contentPackage,
    };

    // Update local React state and local storage immediately for responsive offline support
    let updatedProjects: SavedProject[] = [];
    if (activeProjectId) {
      updatedProjects = savedProjects.map(p => p.id === activeProjectId ? payload : p);
    } else {
      setActiveProjectId(projectId);
      updatedProjects = [payload, ...savedProjects];
    }
    setSavedProjects(updatedProjects);
    localStorage.setItem("creatoros_projects", JSON.stringify(updatedProjects));

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        triggerBannerAlert(dbStatus?.reachable ? "project-saved-supabase" : "project-saved");
      } else {
        throw new Error("DB server rejected project saving");
      }
    } catch (e) {
      console.warn("Could not save project to remote database, saved offline:", e);
      triggerBannerAlert("project-saved-local-only");
    }
  };

  // Delete Project from Database
  const handleDeleteProject = async (id: string) => {
    soundManager.playClick();

    const updatedProjects = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updatedProjects);
    localStorage.setItem("creatoros_projects", JSON.stringify(updatedProjects));

    if (activeProjectId === id) {
      setActiveProjectId(null);
      setContentPackage(null);
    }

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerBannerAlert(dbStatus?.reachable ? "deleted-supabase" : "deleted");
      } else {
        triggerBannerAlert("deleted");
      }
    } catch (e) {
      console.warn("Could not delete project from remote database, deleted offline:", e);
      triggerBannerAlert("deleted");
    }
  };

  // Restore Saved Project back to active editing state
  const handleSelectProject = (proj: SavedProject) => {
    soundManager.playSparkle();
    setActiveProjectId(proj.id);
    setProjectName(proj.name);
    setText(proj.inputText);
    
    const params = proj.config;
    if (params) {
      if (params.contentType) setContentType(params.contentType);
      if (params.language) setLanguage(params.language);
      if (params.niche) setNiche(params.niche);
      if (params.tone) setTone(params.tone);
      if (params.platform) setPlatform(params.platform);
      if (params.goal) setGoal(params.goal);
      if (params.style) setStyle(params.style);
    }

    setContentPackage(proj.packageData);
  };

  // Clear Form parameters
  const handleClearAll = () => {
    if (!clearConfirm) {
      soundManager.playClick();
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      return;
    }
    soundManager.playClick();
    setText("");
    setProjectName("Untitled Project");
    setActiveProjectId(null);
    setContentPackage(null);
    setClearConfirm(false);
  };

  // Copy to clipboard utility
  const handleCopyToClipboard = (textVal: string, key: string) => {
    soundManager.playSuccess();
    navigator.clipboard.writeText(textVal).then(() => {
      triggerBannerAlert(key);
    });
  };

  // Helper: Trigger temporal banner feedback alerts
  const triggerBannerAlert = (key: string) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  // Compile entire generated kit into clean copyable document markdown
  const getCompiledTextKit = () => {
    if (!contentPackage) return "";
    return `
# CREATOROS TRANSFORMATION ASS-PACKAGE
# PROJECT: ${projectName}
# NICHE: ${niche} | PLATFORM: ${platform} | TONE: ${tone}

=========================================
📝 REFACTORED SHORT REEL SCRIPT (15s):
-----------------------------------------
${contentPackage.scripts.short}

=========================================
📝 REFACTORED LONG STORYTELLING SCRIPT (60s+):
-----------------------------------------
${contentPackage.scripts.storytelling}

=========================================
⚡ AB HOOK ANGLE SUGGESTIONS:
-----------------------------------------
- CURIOSITY: ${contentPackage.hooks.curiosityGap}
- FOMO: ${contentPackage.hooks.fearOfMissingOut}
- BENEFIT: ${contentPackage.hooks.directBenefit}
- CONTRARIAN: ${contentPackage.hooks.contrarianAngle}

=========================================
📱 FEED CAPTIONS READY-TO-POST:
-----------------------------------------
- INSTAGRAM REELS:
${contentPackage.captions.instagramReels}

- YOUTUBE SHORTS:
${contentPackage.captions.youtubeShorts}

=========================================
🏷️ HASHTAGS:
-----------------------------------------
${contentPackage.hashtags.platformFriendlySets.map(set => set.join(" ")).join("\n")}
    `.trim();
  };

  // Export TXT file download
  const handleExportTxt = () => {
    soundManager.playSuccess();
    const element = document.createElement("a");
    const file = new Blob([getCompiledTextKit()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${projectName.toLowerCase().replace(/\s+/g, "_")}_kit.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Export JSON file download
  const handleExportJson = () => {
    soundManager.playSuccess();
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(contentPackage, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${projectName.toLowerCase().replace(/\s+/g, "_")}_kit.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Prepopulate form templates
  const handleLoadSample = (sampleType: "idea" | "draft") => {
    soundManager.playClick();
    if (sampleType === "idea") {
      setText("A full breakdown of how young Indian graduates can start micro-agencies providing automated video-editing assets to local gyms and cafes in Delhi.");
      setNiche("Startup / entrepreneurship");
      setLanguage("Hinglish");
      setGoal("Viral");
    } else {
      setText("So today we will talk about personal budget. standard SIP mistakes. standard tax deductions are increased in finance budget. But is middle class saving? Actually index funds are growing fast, SIP of 5000 is great for long term.");
      setNiche("Finance / money / investing");
      setLanguage("Hinglish");
      setGoal("Clarity");
    }
  };

  return (
    <AppShell>
      
      {/* 1. Header Top Bar */}
      <TopBar
        showProfile={showProfile}
        toggleProfile={() => {
          soundManager.playClick();
          setShowProfile(!showProfile);
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24">
        
        {/* Floating Ambient Art Effect */}
        <FloatingAccentLayer animationsEnabled={animationsEnabled} />

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
            <AnimatePresence mode="wait">
              {activeWorkspace === "script-studio" && (
                <motion.div
                  key="script-studio"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <ScriptStudioView
                    text={text}
                    setText={setText}
                    contentType={contentType}
                    setContentType={setContentType}
                    language={language}
                    setLanguage={setLanguage}
                    niche={niche}
                    setNiche={setNiche}
                    tone={tone}
                    setTone={setTone}
                    platform={platform}
                    setPlatform={setPlatform}
                    goal={goal}
                    setGoal={setGoal}
                    loading={loading}
                    compileProgress={compileProgress}
                    showProgressBar={showProgressBar}
                    contentPackage={contentPackage}
                    projectName={projectName}
                    setProjectName={setProjectName}
                    handleGenerate={handleGenerate}
                    handleClearAll={handleClearAll}
                    handleSaveProject={handleSaveProject}
                    handleExportTxt={handleExportTxt}
                    handleExportJson={handleExportJson}
                    handleRegenerateModule={handleRegenerateModule}
                    moduleLoadingKey={moduleLoadingKey}
                    copiedKey={copiedKey}
                    handleCopyToClipboard={handleCopyToClipboard}
                    clearConfirm={clearConfirm}
                    error={error}
                  />
                </motion.div>
              )}

              {activeWorkspace === "content-advisor" && (
                <motion.div
                  key="content-advisor"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <ContentAdvisorView
                    contentPackage={contentPackage}
                    handleRegenerateModule={handleRegenerateModule}
                    moduleLoadingKey={moduleLoadingKey}
                    copiedKey={copiedKey}
                    handleCopyToClipboard={handleCopyToClipboard}
                    setActiveWorkspace={setActiveWorkspace}
                  />
                </motion.div>
              )}

              {activeWorkspace === "opportunity-hub" && (
                <motion.div
                  key="opportunity-hub"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <OpportunityHubView
                    setText={setText}
                    setNiche={setNiche}
                    setLanguage={setLanguage}
                    setActiveWorkspace={setActiveWorkspace}
                  />
                </motion.div>
              )}

              {activeWorkspace === "creator-library" && (
                <motion.div
                  key="creator-library"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-soft-stone rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-soft-sand">
                      <div>
                        <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                          📁 Saved Workspace Archives
                        </h2>
                        <p className="text-xs text-slate-gray mt-1">
                          Browse and restore your historical content packages and scripts directly back into Script Studio.
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold uppercase px-3 py-1 bg-soft-sand border border-soft-stone rounded-lg text-slate-gray">
                        Total Saved: {savedProjects.length}
                      </span>
                    </div>

                    <ProjectHistory
                      projects={savedProjects}
                      onSelect={(proj) => {
                        handleSelectProject(proj);
                        setActiveWorkspace("script-studio");
                      }}
                      onDelete={handleDeleteProject}
                      selectedId={activeProjectId}
                    />
                  </div>
                </motion.div>
              )}

              {activeWorkspace === "publish-kit" && (
                <motion.div
                  key="publish-kit"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <PublishKitView
                    contentPackage={contentPackage}
                    copiedKey={copiedKey}
                    handleCopyToClipboard={handleCopyToClipboard}
                    handleRegenerateModule={handleRegenerateModule}
                    moduleLoadingKey={moduleLoadingKey}
                    getCompiledTextKit={getCompiledTextKit}
                    setActiveWorkspace={setActiveWorkspace}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Meta Diagnostics */}
        <footer className="mt-12 pt-6 border-t border-soft-stone flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-gray uppercase tracking-widest max-w-7xl mx-auto w-full font-mono">
          <div className="flex flex-wrap justify-center gap-4">
            <span>Storage Engine: <span className="text-copper font-semibold">Secure Auto-Save Project Database Cache</span></span>
            <span className="hidden sm:inline text-slate-gray/30">•</span>
            <span>Security Model: <span className="text-copper font-semibold">Server-Side Proxy Vault</span></span>
          </div>
          <div>
            <span className="text-slate-gray/60">Crafted in Cloud Container Workspace</span>
          </div>
        </footer>

      </div>

      {/* Global Success Banner alerts */}
      <AnimatePresence>
        {copiedKey && !copiedKey.startsWith("script") && !copiedKey.startsWith("hook") && !copiedKey.startsWith("cta") && !copiedKey.startsWith("caption") && !copiedKey.startsWith("v-") && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-charcoal border border-copper/30 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2.5 z-50"
          >
            <span className="w-2 h-2 rounded-full bg-copper animate-ping"></span>
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

    </AppShell>
  );
}
