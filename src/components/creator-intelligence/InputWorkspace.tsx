import React, { useState } from "react";
import { Sparkles, Activity, FileText, Send, Layers, Share2, Award, Briefcase, Plus, AlertCircle, FileUp, Eye } from "lucide-react";
import { soundManager } from "../../utils/sound";

interface InputWorkspaceProps {
  activeMode: string;
  isAnalyzing: boolean;
  onAnalyze: (inputData: any) => void;
}

export const InputWorkspace: React.FC<InputWorkspaceProps> = ({ activeMode, isAnalyzing, onAnalyze }) => {
  // State for Script Doctor
  const [scriptDoctor, setScriptDoctor] = useState({
    scriptTitle: "",
    platform: "instagram",
    language: "english",
    contentGoal: "views",
    audience: "",
    scriptText: "",
    notes: ""
  });

  // State for Performance Analyzer
  const [perfAnalyzer, setPerfAnalyzer] = useState({
    platform: "instagram",
    views: "",
    likes: "",
    comments: "",
    shares: "",
    saves: "",
    followerCount: "",
    durationSeconds: "",
    caption: "",
    transcriptOrScript: "",
    notes: ""
  });

  // State for Creator DNA Builder
  const [dnaBuilder, setDnaBuilder] = useState({
    niche: "",
    audience: "",
    platform: "instagram",
    contentGoal: "authority",
    tone: "professional",
    bestContentSample: "",
    worstContentSample: "",
    notes: ""
  });

  // State for Winner vs Loser Comparison
  const [winnerLoser, setWinnerLoser] = useState({
    winnerSample: "",
    loserSample: "",
    winnerViews: "",
    loserViews: "",
    notes: ""
  });

  // State for Competitor Analysis
  const [competitor, setCompetitor] = useState({
    referenceSample: "",
    userSample: "",
    notes: ""
  });

  // State for Multi-Pattern Analysis
  const [multiPattern, setMultiPattern] = useState({
    contentItems: "",
    metrics: "",
    notes: ""
  });

  // State for Full Content Audit
  const [contentAudit, setContentAudit] = useState({
    niche: "",
    audience: "",
    platform: "instagram",
    goals: "brand_awareness",
    contentSamples: "",
    challenges: "",
    notes: ""
  });

  // State for Content Strategy Engine
  const [strategyEngine, setStrategyEngine] = useState({
    creatorDNA: "",
    latestAnalysis: "",
    latestComparison: "",
    trendContext: "",
    notes: ""
  });

  // Synced content checking block
  const [hasSyncedContent, setHasSyncedContent] = React.useState(false);

  React.useEffect(() => {
    const checkIfSynced = () => {
      const content = localStorage.getItem("creatoros_last_generated_content");
      setHasSyncedContent(!!content);
    };
    checkIfSynced();
    // Watch for other triggers
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "creatoros_last_generated_content") {
        setHasSyncedContent(!!e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleImportSync = () => {
    soundManager.playSparkle();
    const contentStr = localStorage.getItem("creatoros_last_generated_content");
    if (!contentStr) return;
    try {
      const content = JSON.parse(contentStr);
      if (activeMode === "script_doctor") {
        setScriptDoctor({
          scriptTitle: `Synced: ${content.idea.slice(0, 35)}`,
          platform: content.platform || "instagram",
          language: content.language || "hinglish",
          contentGoal: "views",
          audience: "My core short-form fans",
          scriptText: content.script || "",
          notes: "Imported from Script Lab automatically."
        });
      } else if (activeMode === "performance_analyzer") {
        setPerfAnalyzer({
          platform: content.platform || "instagram",
          views: "15000",
          likes: "800",
          comments: "100",
          shares: "50",
          saves: "450",
          followerCount: "5000",
          durationSeconds: "45",
          caption: content.caption || "",
          transcriptOrScript: content.script || "",
          notes: "Auto-synced performance evaluation parameters."
        });
      } else if (activeMode === "creator_dna_builder") {
        setDnaBuilder({
          niche: `Education - ${content.idea.slice(0, 30)}`,
          audience: `Student community`,
          platform: content.platform || "instagram",
          contentGoal: "authority",
          tone: "fast_energetic",
          bestContentSample: content.script || "",
          worstContentSample: "",
          notes: "Derived from Script Lab generated template package."
        });
      } else if (activeMode === "winner_loser_comparison") {
        setWinnerLoser({
          winnerSample: content.script || "",
          loserSample: "Yesterday's slower unpolished classroom topic lecture explanation.",
          winnerViews: "50000",
          loserViews: "2300",
          notes: "Direct contrast side-by-side gap insights."
        });
      } else if (activeMode === "competitor_analysis") {
        setCompetitor({
          referenceSample: "Viral splitscreen with dual outcome loops in Reels.",
          userSample: content.script || "",
          notes: "Identify styling and scripting cues."
        });
      } else if (activeMode === "multi_pattern_analysis") {
        setMultiPattern({
          contentItems: `Script: ${content.script}\n\nHooks: ${content.hooks.join(", ")}`,
          metrics: "Retains 75% at hook, drops slightly during midsection explanation setup.",
          notes: "Testing structure pacing stability."
        });
      } else if (activeMode === "full_content_audit") {
        setContentAudit({
          niche: "Educational Tutorials Tech",
          audience: "Undergraduate development majors",
          platform: content.platform || "instagram",
          goals: "retention",
          contentSamples: content.script || "",
          challenges: "Hook is powerful but visual transition density in Hinglish splitscreen needs polish.",
          notes: "Audit syncing diagnostics."
        });
      } else if (activeMode === "strategy_engine") {
        setStrategyEngine({
          creatorDNA: "Interactive buddy tech tutor",
          latestAnalysis: content.script || "",
          latestComparison: "N/A",
          trendContext: "Placements roadmap, automated keyword direct messages to build student newsletter lists.",
          notes: "Evolve dynamic test ideas."
        });
      }
    } catch {}
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    // Route active mode state
    let dataToSend: any = null;
    switch (activeMode) {
      case "script_doctor":
        dataToSend = scriptDoctor;
        break;
      case "performance_analyzer":
        dataToSend = {
          ...perfAnalyzer,
          views: Number(perfAnalyzer.views),
          likes: Number(perfAnalyzer.likes),
          comments: Number(perfAnalyzer.comments),
          shares: Number(perfAnalyzer.shares),
          saves: Number(perfAnalyzer.saves),
          followerCount: Number(perfAnalyzer.followerCount),
          durationSeconds: Number(perfAnalyzer.durationSeconds)
        };
        break;
      case "creator_dna_builder":
        dataToSend = dnaBuilder;
        break;
      case "winner_loser_comparison":
        dataToSend = {
          winnerSample: winnerLoser.winnerSample,
          loserSample: winnerLoser.loserSample,
          winnerMetrics: { views: Number(winnerLoser.winnerViews) },
          loserMetrics: { views: Number(winnerLoser.loserViews) },
          notes: winnerLoser.notes
        };
        break;
      case "competitor_analysis":
        dataToSend = competitor;
        break;
      case "multi_pattern_analysis":
        dataToSend = {
          contentItems: multiPattern.contentItems.split("\n\n").filter(Boolean),
          notes: multiPattern.notes
        };
        break;
      case "full_content_audit":
        dataToSend = {
          ...contentAudit,
          contentSamples: contentAudit.contentSamples.split("\n\n").filter(Boolean)
        };
        break;
      case "strategy_engine":
        dataToSend = strategyEngine;
        break;
      default:
        dataToSend = {};
    }

    onAnalyze(dataToSend);
  };

  // Helper input styling classes to respect the Obsidian Atelier theme
  const inputClass = "w-full bg-[#141416] border border-[#232225] focus:border-[#cca972] text-sm text-slate-100 rounded-xl px-4 py-3 placeholder-slate-600 focus:outline-none transition-all duration-200 shadow-inner";
  const selectClass = "w-full bg-[#141416] border border-[#232225] focus:border-[#cca972] text-sm text-slate-100 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 cursor-pointer";
  const labelClass = "block text-[11px] uppercase tracking-wider font-extrabold text-[#cca972] font-sans mb-1.5";

  // Pre-fill helpers based on mode to provide helpful and polished defaults
  const handlePrefill = (modeName: string) => {
    soundManager.playPop();
    if (modeName === "script_doctor") {
      setScriptDoctor({
        scriptTitle: "NEET Physics Hack: 3 Formula Shortcuts",
        platform: "instagram",
        language: "hinglish",
        contentGoal: "leads",
        audience: "JEE / NEET Aspirants looking for quick Physics shortcuts",
        scriptText: "Bhai, agar tum NEET ya JEE prep kar rahe ho, toh ye Physics shortcut save karlo. Kinematics ke linear motion numericals 10 seconds mein solve honge. Formula hai v square equal to u square plus 2as but ek trick hai jo coaching classes nahi sikhate. Comment 'PHYSICS' aur main formula sheet DMs mein bhej dunga.",
        notes: "I want to improve the hook and make the storytelling feel organic for student aspirants."
      });
    } else if (modeName === "performance_analyzer") {
      setPerfAnalyzer({
        platform: "instagram",
        views: "65000",
        likes: "4800",
        comments: "1200",
        shares: "950",
        saves: "3500",
        followerCount: "15000",
        durationSeconds: "35",
        caption: "Comment 'WEBHOOK' to get the full Airtable automation guide! 🚀 Save for later!",
        transcriptOrScript: "Bhai, agar tum freelancing karte ho aur clients manually onboard kar rahe ho, toh tum bohot time waste kar rahe ho. Maine ek code zero chatbot banaya jo comments trigger hote hi, automated proposal client ko bhej deta hai. Ek click mein database update. Comment karo 'WEBHOOK' aur template tumhare direct messages mein.",
        notes: "Excellent save-to-comment ratio, but swipe-away spikes when I show the Airtable screen around 12 seconds."
      });
    } else if (modeName === "creator_dna_builder") {
      setDnaBuilder({
        niche: "Coding & AI for Indian College Students",
        audience: "CS / IT students trying to land off-campus placements",
        platform: "instagram",
        contentGoal: "authority",
        tone: "fast_energetic",
        bestContentSample: "High paying freelance niches for Indian students who only know Tailwind & basic React",
        worstContentSample: "Theoretical explanation of Time Complexity and Big O notation with standard whiteboards",
        notes: "Placement roadmaps and freelancing hacks get 10x higher saves compared to core academic math."
      });
    } else if (modeName === "winner_loser_comparison") {
      setWinnerLoser({
        winnerSample: "Winner Script: React placement roadmap in 30 days starting with zero knowledge. Comments trigger checklist.",
        loserSample: "Loser Script: What is React and why did Facebook build it? Theory class with standard slides.",
        winnerViews: "120000",
        loserViews: "3500",
        notes: "Outcome-first roadmaps drive crazy student saves, whereas theory explanations completely kill retention on Instagram."
      });
    } else if (modeName === "competitor_analysis") {
      setCompetitor({
        referenceSample: "Competitor Reel: Fast transition splitscreen. Shows real-life rupees credited in bank account notification. Audio delivery is super quick with chime transitions and zoom every 0.5s. Hook: 'React seekho aur side income start karo'.",
        userSample: "User Reel: Screen recording of a terminal showing code. Voice is slow, dull, with a 3-second silent gap before introducing 'Hi guys, today we will look at setting up React'.",
        notes: "Looking to replace dry tutorial flow with cinematic pacing, on-screen key rewards, and spoken Hinglish punchiness."
      });
    } else if (modeName === "multi_pattern_analysis") {
      setMultiPattern({
        contentItems: "Video 1: Showing JEE Math integration cheat-sheet. Viewer retention drop at second 4 during formula list.\n\nVideo 2: 3-step guide on how to get internships using cold emails. Drop at second 5 when transition is slow.\n\nVideo 3: ChatGPT prompt template to write resumes in 10s. Drop at second 5 when slide transition occurs.",
        metrics: "All videos experience a 40% retention drop off at second 4-5 during the 'technical explanations'.",
        notes: "Identify how to mask complex information with better B-roll pattern interrupts or Hinglish callouts."
      });
    } else if (modeName === "full_content_audit") {
      setContentAudit({
        niche: "Tech Placement & Freelance Hacks",
        audience: "Tier-2 & Tier-3 engineering college students in India",
        platform: "instagram",
        goals: "brand_awareness",
        contentSamples: "Post A: How I got 3 remote freelance clients in 1 month\n\nPost B: Best github repositories for final-year projects\n\nPost C: JEE preparation mistake that cost me my grade",
        challenges: "Follower growth is quite slow despite high save and share numbers on analytical placement roadmaps",
        notes: "Comprehensive systems health check to understand macro optimization."
      });
    } else if (modeName === "strategy_engine") {
      setStrategyEngine({
        creatorDNA: "Smart friend placement guide, high authority but relatable outcome-first roadmaps.",
        latestAnalysis: "High student viewer drop-offs before showing the salary range or resource list.",
        latestComparison: "Direct action roadmaps get 40x higher engagement than generalized theoretical notes.",
        trendContext: "College backlogs guide, internship trackers, remote work setups, high impact Hinglish captions, comments keyword triggers",
        notes: "Build a premium high-retention 30-day playbook targeting tier-2/3 college students with Hinglish scripts."
      });
    }
  };

  return (
    <div id="InputWorkspacePanel" className="bg-[#0b0a0c]/98 border border-[#1b1a1c] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#cca972]/[0.015] rounded-full blur-2xl" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#1b1a1c]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-sans">
              Evaluate Inputs for <span className="text-[#cca972]">{activeMode.replace(/_/g, " ")}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Fill out parameters to generate an executive-level performance breakdown.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {hasSyncedContent && (
              <button
                type="button"
                onClick={handleImportSync}
                className="text-[10px] uppercase font-bold text-white bg-[#cf7051]/30 hover:bg-[#cf7051]/40 border border-[#cf7051]/40 px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer"
              >
                📥 Import Script Lab Sync
              </button>
            )}
            <button
              type="button"
              onClick={() => handlePrefill(activeMode)}
              className="text-[10px] uppercase font-bold text-[#cca972]/80 hover:text-[#cca972] px-3 py-1.5 rounded-lg border border-[#302e32] hover:border-[#cca972]/45 transition duration-200"
            >
              ✦ Load Refined Template
            </button>
          </div>
        </div>

        {/* Dynamic Inputs Based on Active Mode */}
        {activeMode === "script_doctor" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Script or Hook Title</label>
                <input
                  type="text"
                  placeholder="e.g. Automated Lead Gen Secret"
                  value={scriptDoctor.scriptTitle}
                  onChange={e => setScriptDoctor({ ...scriptDoctor, scriptTitle: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Target Platform</label>
                  <select
                    value={scriptDoctor.platform}
                    onChange={e => setScriptDoctor({ ...scriptDoctor, platform: e.target.value })}
                    className={selectClass}
                  >
                    <option value="instagram">Instagram Reels</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn Video</option>
                    <option value="x">X / Twitter</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Primary Language</label>
                  <select
                    value={scriptDoctor.language}
                    onChange={e => setScriptDoctor({ ...scriptDoctor, language: e.target.value })}
                    className={selectClass}
                  >
                    <option value="english">English (US/UK)</option>
                    <option value="hinglish">Hinglish</option>
                    <option value="hindi">Hindi</option>
                    <option value="spanish">Spanish</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Script Intent / Goal</label>
                <select
                  value={scriptDoctor.contentGoal}
                  onChange={e => setScriptDoctor({ ...scriptDoctor, contentGoal: e.target.value })}
                  className={selectClass}
                >
                  <option value="views">Maximize Views / Virality</option>
                  <option value="followers">Drive New Followers</option>
                  <option value="leads">Comment Auto-Leads Generation</option>
                  <option value="sales">Product sales / Direct Closings</option>
                  <option value="authority">Establish Premium Authority</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Target Audience Persona</label>
                <input
                  type="text"
                  placeholder="e.g. Audience: Students"
                  value={scriptDoctor.audience}
                  onChange={e => setScriptDoctor({ ...scriptDoctor, audience: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-between">
              <div className="flex-1">
                <label className={labelClass}>Raw Script Text for Diagnosis</label>
                <textarea
                  rows={8}
                  placeholder={`Paste your reel script here...\n\nExample:\nAaj mai tumhe bataunga ek aisi mistake jo 90% creators karte hain aur isi wajah se unki reels viral nahi hoti...`}
                  value={scriptDoctor.scriptText}
                  onChange={e => setScriptDoctor({ ...scriptDoctor, scriptText: e.target.value })}
                  className={`${inputClass} resize-none h-[180px] font-mono text-xs`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Contextual Notes or Impediments (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Pacing feels slightly dragged in the mid section..."
                  value={scriptDoctor.notes}
                  onChange={e => setScriptDoctor({ ...scriptDoctor, notes: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {activeMode === "performance_analyzer" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Active Platform</label>
                  <select
                    value={perfAnalyzer.platform}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, platform: e.target.value })}
                    className={selectClass}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Follower Count</label>
                  <input
                    type="number"
                    value={perfAnalyzer.followerCount}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, followerCount: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Total Views</label>
                  <input
                    type="number"
                    value={perfAnalyzer.views}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, views: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Likes</label>
                  <input
                    type="number"
                    value={perfAnalyzer.likes}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, likes: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Comments</label>
                  <input
                    type="number"
                    value={perfAnalyzer.comments}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, comments: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Shares</label>
                  <input
                    type="number"
                    value={perfAnalyzer.shares}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, shares: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Saves</label>
                  <input
                    type="number"
                    value={perfAnalyzer.saves}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, saves: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Duration (sec)</label>
                  <input
                    type="number"
                    value={perfAnalyzer.durationSeconds}
                    onChange={e => setPerfAnalyzer({ ...perfAnalyzer, durationSeconds: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Original Caption / Metadata</label>
                <input
                  type="text"
                  placeholder={`Paste caption here...\n\nExample:\n90% creators focus on editing.\nOnly 10% focus on retention.\nSave this reel if you want more growth tips.`}
                  value={perfAnalyzer.caption}
                  onChange={e => setPerfAnalyzer({ ...perfAnalyzer, caption: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Active Script or Transcript text</label>
                <textarea
                  rows={4}
                  placeholder={`Paste transcript from your reel...\n\nExample:\nDosto agar aap Instagram par grow nahi kar pa rahe ho toh pehle yeh samjho...`}
                  value={perfAnalyzer.transcriptOrScript}
                  onChange={e => setPerfAnalyzer({ ...perfAnalyzer, transcriptOrScript: e.target.value })}
                  className={`${inputClass} resize-none font-mono text-xs`}
                />
              </div>
            </div>
          </div>
        )}

        {activeMode === "creator_dna_builder" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Niche / Topic Cluster</label>
                <input
                  type="text"
                  placeholder="e.g. Niche: Education"
                  value={dnaBuilder.niche}
                  onChange={e => setDnaBuilder({ ...dnaBuilder, niche: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Target Audience Profile</label>
                <input
                  type="text"
                  placeholder="e.g. Audience: Students"
                  value={dnaBuilder.audience}
                  onChange={e => setDnaBuilder({ ...dnaBuilder, audience: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Favored Platform</label>
                  <select
                    value={dnaBuilder.platform}
                    onChange={e => setDnaBuilder({ ...dnaBuilder, platform: e.target.value })}
                    className={selectClass}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tone Alignment</label>
                  <select
                    value={dnaBuilder.tone}
                    onChange={e => setDnaBuilder({ ...dnaBuilder, tone: e.target.value })}
                    className={selectClass}
                  >
                    <option value="bold_authoritative">Bold & Authoritative</option>
                    <option value="clinical_educational">Clinical & Educational</option>
                    <option value="fast_energetic">Fast & Energetic</option>
                    <option value="warm_storyteller">Warm Storyteller</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Primal Winner Sample Concept</label>
                <textarea
                  rows={2}
                  placeholder="Paste your best-performing content..."
                  value={dnaBuilder.bestContentSample}
                  onChange={e => setDnaBuilder({ ...dnaBuilder, bestContentSample: e.target.value })}
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Primal Under-performer Sample Concept</label>
                <textarea
                  rows={2}
                  placeholder="Paste your underperforming content..."
                  value={dnaBuilder.worstContentSample}
                  onChange={e => setDnaBuilder({ ...dnaBuilder, worstContentSample: e.target.value })}
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Winner vs Loser Comparison Mode */}
        {activeMode === "winner_loser_comparison" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Winner Post Sample (Script, Hook or Description)</label>
                <textarea
                  rows={5}
                  placeholder="Paste your best-performing content..."
                  value={winnerLoser.winnerSample}
                  onChange={e => setWinnerLoser({ ...winnerLoser, winnerSample: e.target.value })}
                  className={`${inputClass} h-[130px] font-mono text-xs resize-none`}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Winner Views</label>
                  <input
                    type="number"
                    value={winnerLoser.winnerViews}
                    onChange={e => setWinnerLoser({ ...winnerLoser, winnerViews: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Underperformer Views</label>
                  <input
                    type="number"
                    value={winnerLoser.loserViews}
                    onChange={e => setWinnerLoser({ ...winnerLoser, views: e.target.value, loserViews: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Underperformer (Loser) Post Sample</label>
                <textarea
                  rows={5}
                  placeholder="Paste your underperforming content..."
                  value={winnerLoser.loserSample}
                  onChange={e => setWinnerLoser({ ...winnerLoser, loserSample: e.target.value })}
                  className={`${inputClass} h-[130px] font-mono text-xs resize-none`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Comparative Goal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Try to identify why the first topic triggered 50x higher engagement..."
                  value={winnerLoser.notes}
                  onChange={e => setWinnerLoser({ ...winnerLoser, notes: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* Fallbacks for other modes */}
        {!["script_doctor", "performance_analyzer", "creator_dna_builder", "winner_loser_comparison"].includes(activeMode) && (
          <div className="p-4 bg-[#141416] border border-[#232225] rounded-xl text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-[#cca972] mx-auto opacity-70" />
            <div className="max-w-md mx-auto">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Sub-Workspace Operational Mode</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Provide operational notes below. Our system will dynamically analyze input parameters using AI models and synthesize corresponding reports.
              </p>
            </div>
            <div className="text-left max-w-lg mx-auto">
              <label className={labelClass}>Analytical Guidelines / Sandbox Input</label>
              <textarea
                rows={4}
                value={activeMode === "competitor_analysis" ? competitor.referenceSample || competitor.userSample : activeMode === "multi_pattern_analysis" ? multiPattern.contentItems : activeMode === "full_content_audit" ? contentAudit.contentSamples : strategyEngine.trendContext}
                onChange={e => {
                  const val = e.target.value;
                  if (activeMode === "competitor_analysis") setCompetitor({ ...competitor, referenceSample: val, userSample: val });
                  else if (activeMode === "multi_pattern_analysis") setMultiPattern({ ...multiPattern, contentItems: val });
                  else if (activeMode === "full_content_audit") setContentAudit({ ...contentAudit, contentSamples: val });
                  else setStrategyEngine({ ...strategyEngine, trendContext: val });
                }}
                placeholder="Type or paste outline inputs or notes here..."
                className={`${inputClass} h-[100px] font-mono text-xs`}
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-end pt-4 border-t border-[#1b1a1c]">
          <button
            type="submit"
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold font-sans text-xs uppercase tracking-widest text-[#0b0a0c] bg-gradient-to-r from-[#cca972] via-[#e2c192] to-[#cca972] hover:shadow-lg hover:shadow-[#cca972]/15 active:scale-95 transition-all duration-200 ${
              isAnalyzing ? "opacity-45 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#0b0a0c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Synthesizing Diagnosis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#0b0a0c] animate-pulse" />
                <span>Initialize AI Diagnostic</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
