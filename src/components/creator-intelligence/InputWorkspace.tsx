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
    views: "10000",
    likes: "500",
    comments: "50",
    shares: "25",
    saves: "100",
    followerCount: "2500",
    durationSeconds: "35",
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
    winnerViews: "50000",
    loserViews: "2000",
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
    trendContext: "AI operations, micro tutorial frameworks, productivity shortcuts",
    notes: "Targeting high growth solopreneurs"
  });

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
        scriptTitle: "Automated Lead Gen Blueprint",
        platform: "instagram",
        language: "english",
        contentGoal: "leads",
        audience: "knowledge creators who hate complex CRM software",
        scriptText: "Do you also hate managing manual spreadsheets? In this video I want to show you my dynamic lead pipeline framework. It uses Make and Claude to instantly update CRM cards based on comments. Save this and comment 'SETUP' to copy.",
        notes: "Trying to maximize comment engagement for my automated direct-message campaigns."
      });
    } else if (modeName === "performance_analyzer") {
      setPerfAnalyzer({
        platform: "instagram",
        views: "45000",
        likes: "3200",
        comments: "812",
        shares: "450",
        saves: "1900",
        followerCount: "8200",
        durationSeconds: "28",
        caption: "Comment FLOW to copy my dynamic client-closer templates! Stop fighting sales code.",
        transcriptOrScript: "This single webhook closes over four thousand dollars worth of leads every month on autopilot. Let's compile it under thirty seconds. First connect Stripe, second link Claude, third trigger DMs. Comment FLOW to lock in.",
        notes: "Excellent saves ratio but swipe-away spiked around second 4."
      });
    } else if (modeName === "creator_dna_builder") {
      setDnaBuilder({
        niche: "AI-Powered Business Workflows",
        audience: "Ambitious solopreneurs and product designers",
        platform: "instagram",
        contentGoal: "authority",
        tone: "bold_authoritative",
        bestContentSample: "How I built a Stripe analytics overlay in 10 minutes without code",
        worstContentSample: "A standard walkthrough of why clean variables are important in Python scripts",
        notes: "My absolute strongest reels showcase highly polished, dark bento dashboards."
      });
    } else if (modeName === "winner_loser_comparison") {
      setWinnerLoser({
        winnerSample: "Winner Script: Built Stripe analytics overlay in 10 mins. Comments trigger direct link.",
        loserSample: "Loser Script: Explaining what Stripe APIs are in theory. Slow developer dialogue.",
        winnerViews: "95000",
        loserViews: "1800",
        notes: "Comparative review to identify the visual vs informational gap."
      });
    } else if (modeName === "competitor_analysis") {
      setCompetitor({
        referenceSample: "Competitor Reel: Displays clean split-screen layout with automated direct messaging keyword 'Blueprints' overlay. Audio is fast-paced with chime triggers and zooms every 0.5s. High virality potential.",
        userSample: "User Reel: Single screen terminal recording showing Make webhook dashboard with low-contrast caption. Audio delivery is calm but pacing is slow and has a long 3s pre-roll silent gap.",
        notes: "Identify styling gap and cinematic pacing tweaks."
      });
    } else if (modeName === "multi_pattern_analysis") {
      setMultiPattern({
        contentItems: "Video 1: Showing automated leads capture webhook mapping. Drop at second 5.\n\nVideo 2: 3-click guide to link Stripe to Claude. Drop at second 5.\n\nVideo 3: Creating a custom DB query in 10s. Drop at second 6.",
        metrics: "All posts average 35% retention dropoffs on second 5",
        notes: "Analyze recurring transition pacing bottleneck."
      });
    } else if (modeName === "full_content_audit") {
      setContentAudit({
        niche: "Solopreneur Automations & High-Yield Flows",
        audience: "Advanced freelancing developers and agency designers",
        platform: "instagram",
        goals: "brand_awareness",
        contentSamples: "Post A: Stripe invoicing blueprint walkthrough\n\nPost B: Claude inbox agent setup loops\n\nPost C: Airtable CRM webhooks tutorial",
        challenges: "Follower growth is stagnant despite great save ratios on analytical videos",
        notes: "Comprehensive systems health check and macro roadmap request."
      });
    } else if (modeName === "strategy_engine") {
      setStrategyEngine({
        creatorDNA: "Premium Obsidian studio style, high authority tone, outcome-first webhook tutorials.",
        latestAnalysis: "High viewer dropoff before payment pay-off screen is shown.",
        latestComparison: "Outcome-first hooks gain 50x views compared to general whiteboard theories.",
        trendContext: "AI visual overlays, rapid workflow templates, no-code billing widgets, clean bento sheets",
        notes: "Build a high-retention 30-day concept playbook mapping direct DM commented capture keywords."
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
          
          <button
            type="button"
            onClick={() => handlePrefill(activeMode)}
            className="text-[10px] uppercase font-bold text-[#cca972]/80 hover:text-[#cca972] px-3 py-1.5 rounded-lg border border-[#302e32] hover:border-[#cca972]/45 transition duration-200"
          >
            ✦ Load Refined Template
          </button>
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
                  placeholder="e.g. Busy freelance designers"
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
                  placeholder="Paste your raw, unedited content script here..."
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
                  placeholder="e.g. Save this for your next workflow buildup..."
                  value={perfAnalyzer.caption}
                  onChange={e => setPerfAnalyzer({ ...perfAnalyzer, caption: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Active Script or Transcript text</label>
                <textarea
                  rows={4}
                  placeholder="Paste script/transcript text here of this exact post..."
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
                  placeholder="e.g. AI Workflow Engineering"
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
                  placeholder="e.g. Tech founders wanting to automate CRM"
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
                  placeholder="Describe your absolute best performing post (e.g. Webhook setup tutorial)..."
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
                  placeholder="Describe your weakest performing post (e.g. why database relations matter theory)..."
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
                  placeholder="Paste or describe what worked perfectly..."
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
                  placeholder="Paste or describe what under-performed..."
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
