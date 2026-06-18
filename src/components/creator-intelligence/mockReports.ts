import { CreatorIntelligenceReport } from "../../types";

export const MOCK_SCRIPT_DOCTOR_REPORT: CreatorIntelligenceReport = {
  id: "mock_doctor_01",
  createdAt: new Date().toISOString(),
  mode: "script_doctor",
  title: "AI Automation Agency Retention Diagnostic",
  summary: "This script is highly informative but suffers from a slow curiosity-gap delivery and late-stage call to action dropoffs. Tightening the opening 3 seconds is the highest leverage fix.",
  scores: {
    hook: { score: 72, label: "moderate", reason: "Good hook keyword choice, but pacing lacks urgent consequence framing." },
    retention: { score: 65, label: "moderate", reason: "Visual explanations are density-heavy but lack pattern interrupts." },
    flow: { score: 81, label: "strong", reason: "Logical hierarchy is robust; clear progressive steps make it highly readable." },
    story: { score: 45, label: "weak", reason: "Highly clinical setup; lacks humanized narrative tension or personal stakes." },
    emotion: { score: 58, label: "weak", reason: "Topic offers strong productivity relief, but fails to trigger FOMO or urgency." },
    cta: { score: 48, label: "weak", reason: "CTA placed post-climax; retention has likely dropped by over 60% at this point." },
    packaging: { score: 78, label: "strong", reason: "Excellent text overlay placement and high contrast topic hook tags." },
    audienceMatch: { score: 85, label: "excellent", reason: "Perfect match for intermediate solopreneurs and workflow developers." },
    overall: { score: 69, label: "moderate", reason: "Solid educational foundation. Pacing discipline and CTA restructuring will drive compound improvement." }
  },
  structure: [
    {
      name: "Hook",
      exists: true,
      strength: 72,
      impact: "Establishes productivity value immediately.",
      weakness: "Uses passive tone that slows the early attention curve.",
      fix: "Replace 'In this video I will show you' with the outcome-first punch statement."
    },
    {
      name: "Setup",
      exists: true,
      strength: 68,
      impact: "Gives context on custom chatbot automation frameworks.",
      weakness: "Packs too many acronyms in the first 8 seconds.",
      fix: "Focus on the universal friction block (time wasted) before naming the tech."
    },
    {
      name: "Problem",
      exists: true,
      strength: 84,
      impact: "Triggers active pain of managing massive unread client messages.",
      weakness: "Fails to quantify the financial leak of unreplied leads.",
      fix: "Explicitly connect unread leads with lost organic sales."
    },
    {
      name: "Curiosity Gap",
      exists: true,
      strength: 78,
      impact: "Teasable middle section with hidden terminal setup.",
      weakness: "Does not establish a secondary hook before the visual reveal.",
      fix: "State 'But 99% of people configure this backwards' right before the dashboard view."
    },
    {
      name: "Value",
      exists: true,
      strength: 88,
      impact: "Highly actionable walkthrough of the JSON webhook trigger.",
      weakness: "Slight explanation lag.",
      fix: "Keep the code script on screen but speed up video pacing by 1.15x."
    },
    {
      name: "CTA",
      exists: true,
      strength: 45,
      impact: "Clear keyword trigger call for automated templates.",
      weakness: "Arrives at the very end after the energy has tapered.",
      fix: "Pitch the comment keyword 10 seconds earlier, overlaying the active workflow demonstration."
    }
  ],
  strengths: [
    "High-utility actionable walkthrough",
    "Establishes deep domain authority",
    "Clean visual-overlay pacing cues"
  ],
  weaknesses: [
    "Hook slows attention curve with passive phrasing",
    "Clinical narrative lacking emotional tension",
    "Retention dropoff due to excessive technical vocabulary"
  ],
  missingElements: [
    "Pattern interrupts in the midsection",
    "Financial consequence framing of the problem",
    "Pre-payoff mid-reels micro hook"
  ],
  recommendedFixes: [
    "Switch hook from passive explanation to active outcome-first statement.",
    "Place the automated template comment trigger keyword during the active visual demo.",
    "Introduce a sound transition or punchy text card zoom at the 7-second mark."
  ],
  improvedVersion: `How I built a custom AI inbox agent that closes $4k in deals while I sleep. Let's build it in 30 seconds.

Most creators lose half their leads because they reply 2 hours too late. This automated agent triggers instantly whenever someone comments "FLOW" below.

Here is the exact setup.
Step 1: Mount a webhook in Make.com pointing to your Instagram API.
Step 2: Connect the Claude 3.5 Sonnet payload to parse the lead's niche dynamically.
Step 3: Prompt Sonnet to serve a high-converting resource link and log the lead inside Supabase.

I just dropped the complete webhook template for free. Comment "FLOW" below and I'll send it directly to your DMs right now.`,
  shorterVersion: `Comment "FLOW" below and I'll send you the exact webhook system I use to automate 100% of my Instagram DMs.

Reply speed is everything. If you reply 30 minutes too late, that customer is gone. 

This automation uses Claude to parse lead intent, logs their niches in Supabase, and drops the precise conversion assets they need.

Save this video for later, and comment "FLOW" to copy the template.`,
  punchierVersion: `Stop wasting hours in your Instagram DMs. 

This webhook agent closes clients on autopilot while you sleep. Here's how:
1. Comments trigger the webhook
2. Claude identifies the buyer's pain
3. Supabase records the lead data
4. DMs drop the exact system link

Comment "FLOW" and I'll DM you the free templates immediately. Run it!`,
  creatorDNAUpdate: {
    niche: "AI Productivity & Automations",
    audience: "Technical solopreneurs and workflow developers looking to scale operations.",
    strongestFormats: ["Step-by-step visual builders", "Code-stripped setup walkthroughs"],
    strongestHooks: ["Direct financial consequence claims", "Outcome-driven 'How I automated' stories"],
    strongestCTAs: ["Comment trigger automated setups", "Save for step-by-step guidelines"],
    contentLengthPreference: "25-35 seconds",
    recurringPatterns: ["Highly clinical language", "Rigid technical walkthroughs without narrative stakes"],
    biggestBottleneck: "Delayed curiosity-gap resolution",
    recommendedFocus: "Tighten opening line; shift from explanatory to active outcomes."
  },
  strategy: {
    keepDoing: [
      "Use live visual webhook builders to establish deep credibility.",
      "Conclude with clean, automated comment trigger incentives.",
      "Keep text overlay styles clear & obsidian-themed."
    ],
    stopDoing: [
      "No more passive intros like 'In this video I want to show you...'.",
      "Avoid post-conclusion CTAs; pitch during active payoff demonstrations.",
      "Stop explaining dry technical terms without demonstrating immediate relief."
    ],
    improveFirst: [
      "Tighten the first 3 seconds of the hook using outcome-driven claims.",
      "Insert pattern interrupts (transitions, zooms) at the 6-second mark.",
      "Anchor benefits with emotional stake metrics."
    ],
    testNext: [
      "A split-screen style showing 'Manual DM replies' vs 'Claude Automation replies'.",
      "Highlighting a customer success chat bubble screenshot as the background hook overlay."
    ],
    biggestBottleneck: "A delayed curiosity gap that slows down the early viewer retention curve.",
    highestLeverageFix: "Re-record hook using active-alert voice pattern: 'Stop wasting hours in your DMs...'."
  },
  metadata: {
    language: "english",
    platform: "instagram",
    dataConfidence: "high",
    isEstimated: false
  }
};

export const MOCK_PERFORMANCE_REPORT: CreatorIntelligenceReport = {
  id: "mock_perf_01",
  createdAt: new Date().toISOString(),
  mode: "performance_analyzer",
  title: "V1 Core Product Launch Insights & Dropoffs",
  summary: "This video achieved strong outbound saves but has high swipe-away rate at 4 seconds. The visual pacing of the demo was too slow, stalling user momentum.",
  scores: {
    hook: { score: 55, label: "moderate", reason: "Title text overlay was compelling, but audio script was silent for the first 1.2 seconds." },
    retention: { score: 72, label: "moderate", reason: "Good pattern interrupts, but screen share was low-resolution." },
    flow: { score: 86, label: "excellent", reason: "Logical flow was clear and step-by-step; easy for users to follow." },
    story: { score: 62, label: "moderate", reason: "Simple developer-struggle back-story; honest but lacked tension." },
    emotion: { score: 70, label: "moderate", reason: "Relatable relief for founders; clear problem solving." },
    cta: { score: 79, label: "strong", reason: "Clean final screen action with link instructions; visible on screen for 5 seconds." },
    packaging: { score: 82, label: "strong", reason: "Thumbnail alignment and typography are crisp and readable." },
    audienceMatch: { score: 91, label: "excellent", reason: "Addresses founders explicitly with relatable, direct workspace context." },
    overall: { score: 75, label: "strong", reason: "Clear product demo with great structural mechanics but suffers from initial hook silence." }
  },
  structure: [
    {
      name: "Hook",
      exists: true,
      strength: 55,
      impact: "Addresses founders who want to ship apps quickly.",
      weakness: "Delayed voiceover entry; visual background static.",
      fix: "Begin speaking the word 'Stop' on frame 0."
    },
    {
      name: "Setup",
      exists: true,
      strength: 78,
      impact: "Introduces the CreatorOS AI shell layout.",
      weakness: "The cursor moves too erratically.",
      fix: "Use zoomed-in cropped layout loops instead of manual cursor drag."
    }
  ],
  strengths: [
    "Flawless logical flow of steps",
    "Clear aesthetic premium alignment",
    "Highly actionable save CTA value"
  ],
  weaknesses: [
    "Initial audio latency on absolute hook frame",
    "Erratic mouse tracking on screen walkthrough",
    "Lacks intense solution payoff payoff frame"
  ],
  missingElements: [
    "Zoom-ins on important sidebar menus",
    "Quick outcome proof overlay on first second"
  ],
  recommendedFixes: [
    "Cut first 1.2 seconds of silence from timeline.",
    "Add transition sound effects on menu expansions.",
    "Export high-DPI crisp screen recordings."
  ],
  improvedVersion: "Ship your web apps 10x faster. Let me show you how to set up server APIs on CreatorOS. (Fast demo...)",
  shorterVersion: "Ship apps fast. Setup server APIs in 3 clicks. Comment SHIP.",
  punchierVersion: "Stop fighting server code. Ship web apps now.",
  creatorDNAUpdate: {
    niche: "SaaS Builders & Tech Creators",
    audience: "Self-taught developers, indie hackers, and creative founders.",
    strongestFormats: ["Tech walkthroughs", "Speed testing UI"],
    strongestHooks: ["Ship apps fast claims", "Workflow automations"],
    strongestCTAs: ["Word comments triggers", "Bookmark guides"],
    contentLengthPreference: "30-45 seconds",
    recurringPatterns: ["Clean modular code screenshots", "Explanatory developer dialogue"],
    biggestBottleneck: "Delayed startup audio hooks",
    recommendedFocus: "Never allow frame silence. Start speaking instantly."
  },
  strategy: {
    keepDoing: [
      "Showing clean dashboard screenshots with black borders.",
      "Encouraging bookmarks for code snippets."
    ],
    stopDoing: [
      "No silent seconds on raw upload files.",
      "Avoid showing huge messy IDE setups."
    ],
    improveFirst: [
      "Improve text caption sizing.",
      "Clarify early retention with zoom states."
    ],
    testNext: [
      "A fast 15-second bento review."
    ],
    biggestBottleneck: "First frame viewer dropoff.",
    highestLeverageFix: "Eliminate silent pre-rolls."
  },
  metadata: {
    language: "english",
    platform: "youtube_shorts",
    dataConfidence: "high",
    isEstimated: false
  }
};

export const MOCK_DNA_REPORT: CreatorIntelligenceReport = {
  id: "mock_dna_01",
  createdAt: new Date().toISOString(),
  mode: "creator_dna_builder",
  title: "Atelier Aesthetic Creator DNA Vector Map",
  summary: "Your core Creator Profile is highly authoritative, analytical, and visually unified. Your content operates best when structured around deep system reviews combined with simple comments-trigger hooks.",
  scores: {
    hook: { score: 88, label: "excellent", reason: "Great use of outcome-based curiosity hooks that establish high developer status." },
    retention: { score: 82, label: "strong", reason: "Clean typography and sound pattern interrupts keep energy high." },
    flow: { score: 90, label: "excellent", reason: "Excellent logical structure, clear progressive blocks throughout." },
    story: { score: 70, label: "strong", reason: "Good struggle-to-system arcs; very relatable for solo builders." },
    emotion: { score: 76, label: "strong", reason: "Appeals to independence, productivity relief, and high-status execution." },
    cta: { score: 84, label: "strong", reason: "Crisp DM automation integrations that drive compound share/save ratios." },
    packaging: { score: 89, label: "excellent", reason: "Consistently polished dark backgrounds and clear title overlays." },
    audienceMatch: { score: 93, label: "excellent", reason: "High-level alignment with ambitious digital builders." },
    overall: { score: 86, label: "excellent", reason: "Elite profile DNA. Visually distinctive, strategically sharp, and highly consistent." }
  },
  structure: [
    {
      name: "Overall DNA",
      exists: true,
      strength: 88,
      impact: "Creates immediate high-status authority branding.",
      weakness: "Can feel slightly unapproachable to beginners.",
      fix: "Incorporate 'No complex code' or 'Even if you are a beginner' qualifiers."
    }
  ],
  strengths: [
    "Obsidian-charcoal visual branding alignment",
    "Highly clear logic with deep authoritative delivery",
    "Outstanding engagement call with DM automation"
  ],
  weaknesses: [
    "Slightly high technical bar for absolute novices",
    "Prone to heavy data density that challenges quick watches"
  ],
  missingElements: [
    "Beginner-friendly onboarding hooks",
    "Casual casual talking head clips"
  ],
  recommendedFixes: [
    "Test an ultra-simple 'No-code API' explanation.",
    "Add quick warm conversational smile cues during the hook.",
    "Use standard font-sans subtitles with 1 key high-contrast word."
  ],
  improvedVersion: "You do not need to write 1000 lines of complex server code to ship your next app. Let's build a functional Stripe database page in 3 clicks using CreatorOS...",
  shorterVersion: "No-code Stripe dashboards in 3 clicks. Comment CASH.",
  punchierVersion: "Stop fighting payment code. Try this Stripe workspace.",
  creatorDNAUpdate: {
    niche: "No-Code & Full-Stack AI Creation",
    audience: "Creators, solopreneurs, and designer-producers.",
    strongestFormats: ["Bento layout breakdowns", "Speed automations tutorials"],
    strongestHooks: ["Status-driven outcome builders", "Productivity workflow shortcuts"],
    strongestCTAs: ["Comment trigger automated assets", "Save for progressive execution"],
    contentLengthPreference: "20-35 seconds",
    recurringPatterns: ["Dark obsidian backdrop with warm bronze accents", "Fast screen-share tutorials"],
    biggestBottleneck: "Overly technical dense terms",
    recommendedFocus: "Simplify complex technical systems into visual bento grid steps."
  },
  strategy: {
    keepDoing: [
      "Using obsidian card visual frameworks.",
      "Triggering comment templates automation workflows.",
      "Using warm copper accent spotlights."
    ],
    stopDoing: [
      "Avoid showing uncropped complex code terminals.",
      "Do not begin with personal introductions like 'Hi friends'."
    ],
    improveFirst: [
      "Improve onboarding clarity for early-stage builders.",
      "Add quick sound triggers to transition cards."
    ],
    testNext: [
      "A fast split-screen visual comparison."
    ],
    biggestBottleneck: "Technical barrier cognitive friction.",
    highestLeverageFix: "Add a 'no-experience required' qualifier in the hook."
  },
  metadata: {
    language: "english",
    platform: "instagram",
    dataConfidence: "excellent",
    isEstimated: false
  }
};

export const MOCK_WINNER_LOSER_REPORT: CreatorIntelligenceReport = {
  id: "mock_wl_01",
  createdAt: new Date().toISOString(),
  mode: "winner_loser_comparison",
  title: "Winner vs Loser Diagnostic: Workflow Automation contrast",
  summary: "This direct side-by-side comparison reveals that outcome-first hook delivery combined with active visual demonstration drove a 50x view multiplexer compared to theoretical developer lectures.",
  scores: {
    hook: { score: 94, label: "excellent", reason: "Winner hook launched mid-action without introductions, while Loser hook was slow and theoretical." },
    retention: { score: 85, label: "strong", reason: "Winner integrated b-roll pattern interrupts, while Loser remained on stagnant static screen." },
    flow: { score: 89, label: "strong", reason: "Highly readable step progression across both, but winner used visual title overlays as transition signals." },
    story: { score: 60, label: "moderate", reason: "Standard developer struggle format. Winner used it as brief context, Loser rambled for 15s." },
    emotion: { score: 82, label: "strong", reason: "Winner triggers heavy desire for business efficiency and workflow automation." },
    cta: { score: 88, label: "excellent", reason: "Winner used comment triggers mapped to automated lead capture, Loser asked for external link clicks." },
    packaging: { score: 90, label: "excellent", reason: "Beautiful charcoal-and-bronze thumbnail pairing on the winner." },
    audienceMatch: { score: 95, label: "excellent", reason: "Perfect alignment on solopreneurs wanting rapid workflow automation." },
    overall: { score: 88, label: "excellent", reason: "Outstanding contrast profile. Shifting entirely to outcome-driven visual formats is the clear directive." }
  },
  structure: [
    {
      name: "Winner Hook",
      exists: true,
      strength: 95,
      impact: "Launches instantly into the active $4k automated webhook workspace.",
      weakness: "None identified. Near perfect early frame retention.",
      fix: "Maintain this clean zero-filler framing discipline."
    },
    {
      name: "Loser Hook",
      exists: true,
      strength: 35,
      impact: "Slow explanation of Stripe API endpoints without visual proof.",
      weakness: "High viewer dropoff (estimated 65%) in first 3 seconds.",
      fix: "Ax the theory completely; begin directly with the dashboard results."
    }
  ],
  strengths: [
    "Showing immediate visual outcome on winner",
    "Seamless integration of automated DM trigger keyword",
    "Pacing kept short and concise (28 seconds)"
  ],
  weaknesses: [
    "Loser used overly long preambles explaining simple concepts",
    "Loser lacked interactive visual assets on-screen",
    "Theoretical API explanations triggered low save ratios"
  ],
  missingElements: [
    "Action-outcome proof framing on the underperformer",
    "Contrast highlights showing exact friction vs relief states",
    "Fast visual pacing resets on the slow-dialogue loops"
  ],
  recommendedFixes: [
    "Stop explaining underlying software theories; show only the tactical webhook workspace logic.",
    "Replace all external bio link calls with direct automated comment lead keywords.",
    "Introduce warm amber spotlight overlays behind key dashboard frames."
  ],
  improvedVersion: `Winner Concept: 'How I automated 100% of my CRM leads in 3 clicks. Comment CRM to copy the blueprint.'
Loser Concept: 'Why database integrations are critical for modern business operations.'`,
  shorterVersion: "CRM automation in 3 clicks. Comment CRM.",
  punchierVersion: "Stop losing CRM leads. Try this 3-click webhook setup now.",
  creatorDNAUpdate: {
    niche: "Lead Automations & Workflows",
    audience: "High growth agency founders and solopreneurs.",
    strongestFormats: ["Side-by-side system comparative reviews", "3-click speed setups"],
    strongestHooks: ["Direct productivity claims", "No-code webhook walkthroughs"],
    strongestCTAs: ["Direct comment trigger keywords", "Save for blueprint setup guidelines"],
    contentLengthPreference: "24-30 seconds",
    recurringPatterns: ["Winner: Dark high-contrast dashboard frames", "Loser: Theoretical whiteboards and developer lecture loops"],
    biggestBottleneck: "Theoretical education lag",
    recommendedFocus: "Only film finished functioning systems; skip basic architecture theories."
  },
  strategy: {
    keepDoing: [
      "Use outcome-first webhook walkthroughs.",
      "Anchor benefits with exact dollar metrics.",
      "Conclude with clean, automated comment trigger keywords."
    ],
    stopDoing: [
      "Stop explaining general conceptual theories.",
      "Do not request users to open external links in bio.",
      "Avoid slow pre-rolls and static video pauses."
    ],
    improveFirst: [
      "Maximize visual contrast on screen share cards.",
      "Shorten transition pacing between setup stages.",
      "Align text subtitles with active speech rhythm."
    ],
    testNext: [
      "A fast 15-second system summary reel.",
      "A split-screen comparing manual leads processing vs automation."
    ],
    biggestBottleneck: "Theoretical explanations lag viewer attention.",
    highestLeverageFix: "Introduce high-DPI dashboard screen shots in the absolute first frame."
  },
  metadata: {
    language: "english",
    platform: "instagram",
    dataConfidence: "high",
    isEstimated: false
  }
};

export const MOCK_COMPETITOR_REPORT: CreatorIntelligenceReport = {
  id: "mock_comp_01",
  createdAt: new Date().toISOString(),
  mode: "competitor_analysis",
  title: "Industry Referencing & Stylistic Gap Vector Matrix",
  summary: "Comparative analysis vs market leaders reveals a pacing and typographic contrast deficit. Their reels maintain a constant 0.4s clip transition rhythm combined with large customized dual-colored caption blocks.",
  scores: {
    hook: { score: 71, label: "moderate", reason: "Good topic focus, but lacks the high-contrast highlighted text boxes used by competitor feeds." },
    retention: { score: 68, label: "moderate", reason: "Your video pacing averages 1.8 seconds per raw clip; competitor pacing remains strictly under 0.6 seconds." },
    flow: { score: 85, label: "strong", reason: "Logical steps are cleaner and more educational than competitor's purely aesthetic reels." },
    story: { score: 50, label: "weak", reason: "Competitive creators use hyper-relatable meme intro overrides to build early retention." },
    emotion: { score: 72, label: "moderate", reason: "Topic appeals to CRM automation pain but lacks active competitor urgency." },
    cta: { score: 80, label: "strong", reason: "Your DM automation setup is outstanding; competitor uses manual link-in-bio pitches." },
    packaging: { score: 75, label: "moderate", reason: "Good bento frames, but needs bolder typography with high contrast borders." },
    audienceMatch: { score: 90, label: "excellent", reason: "Targeting developers with higher accuracy than generic competitor channels." },
    overall: { score: 74, label: "strong", reason: "Excellent strategic depth. Closing the stylistic gap (typography, fast pacing, visual overrides) will capture high-market positioning." }
  },
  structure: [
    {
      name: "Your Hook",
      exists: true,
      strength: 71,
      impact: "Explains CRM automated webhook setup.",
      weakness: "Uses plain system screenshot on first frame.",
      fix: "Overlay a large highlighted text prompt: 'STOP manual CRM data entries'."
    },
    {
      name: "Competitor Hook",
      exists: true,
      strength: 95,
      impact: "Stops feed using a meme scene switching into high contrast zoom overlay.",
      weakness: "Lacks actual technical setup details under the fold.",
      fix: "Combine their high-hook visual override with your deep analytical setup guidance."
    }
  ],
  strengths: [
    "Your content has genuine technical authority and utility",
    "Highly efficient automated DM capture workflows",
    "Clean educational delivery lacking superficial hype"
  ],
  weaknesses: [
    "Slow transition loops (averaging 1.8 seconds per slide)",
    "Lack of custom colorful text background headers",
    "Absence of sound effect triggers on main visual reveals"
  ],
  missingElements: [
    "0.5s visual b-roll loops to reset eye tracking",
    "Large colorful highlighted caption overrides (yellow on dark charcoal)",
    "Short funny meme context frames inside the hook"
  ],
  recommendedFixes: [
    "Speed up video frame clips to a maximum of 0.6 seconds in the edit timeline.",
    "Integrate high contrast text boxes with bold fonts like Grotesk.",
    "Add transition whoosh sounds on every slide change."
  ],
  improvedVersion: "Competitor Style: High-contrast yellow pop captions + fast visual resets every 0.5s combined with deep CRM setups.",
  shorterVersion: "Competitor Hook formatting: Fast cut, big caption, action first.",
  punchierVersion: "Stylistic shift: Speed up cuts, make text massive.",
  creatorDNAUpdate: {
    niche: "Stylized Creator Automations",
    audience: "Tech founders looking for premium aesthetic tutorials.",
    strongestFormats: ["Fast-cut tutorial sheets with audio pops", "Meme-to-demonstration sequences"],
    strongestHooks: ["Meme context triggers", "High-contrast text box warnings"],
    strongestCTAs: ["Direct DM comments systems", "Quick bookmark saves"],
    contentLengthPreference: "18-25 seconds",
    recurringPatterns: ["High-speed cuts (under 0.8 seconds)", "Branded dual-color yellow/white text headers"],
    biggestBottleneck: "Stagnant camera positioning",
    recommendedFocus: "Adopt rapid editing timelines with multiple zoom scales."
  },
  strategy: {
    keepDoing: [
      "Provide high-utility code-stripped webhook breakdowns.",
      "Execute automated comment triggers directly.",
      "Retain premium Obsidian dark background theme structures."
    ],
    stopDoing: [
      "Avoid continuous talking head loops exceeding 3 seconds.",
      "No more passive plain screenshots without text boxes.",
      "Ax the generic preambles."
    ],
    improveFirst: [
      "Double contrast ratio on system screen shares.",
      "Insert whoosh transitions between steps.",
      "Optimize text subtitle lines to occupy center focus."
    ],
    testNext: [
      "A fast 20-second competitor pacing replica.",
      "A caption-focused video featuring only typography loops."
    ],
    biggestBottleneck: "Pacing drag in the middle section.",
    highestLeverageFix: "Cut video frames using 1.1x playback speed adjustments."
  },
  metadata: {
    language: "english",
    platform: "instagram",
    dataConfidence: "medium",
    isEstimated: true
  }
};

export const MOCK_MULTI_PATTERN_REPORT: CreatorIntelligenceReport = {
  id: "mock_multi_01",
  createdAt: new Date().toISOString(),
  mode: "multi_pattern_analysis",
  title: "Batch Multi-Content Performance Pattern Audit",
  summary: "An audit across your past 6 tutorial videos reveals a recurring viewer dropoff pattern between seconds 4 and 7. Pacing remains stagnant when moving from the hook to the secondary setup.",
  scores: {
    hook: { score: 80, label: "strong", reason: "Good hook topic clusters, but hook lengths vary significantly from 2 to 6 seconds." },
    retention: { score: 62, label: "moderate", reason: "Consistent drop of 35% at second 5 across 5/6 analyzed posts." },
    flow: { score: 84, label: "strong", reason: "Step-by-step logic is clean, but transition pauses are too relaxed." },
    story: { score: 55, label: "moderate", reason: "Topic formats are too technical; lacking narrative progression." },
    emotion: { score: 71, label: "moderate", reason: "Solves tangible business pain but fails to trigger emotional curiosity." },
    cta: { score: 88, label: "excellent", reason: "Highly repeatable and optimized comment capture triggers." },
    packaging: { score: 79, label: "strong", reason: "Uniform cover layouts look cohesive, but blend together too much in feeds." },
    audienceMatch: { score: 92, label: "excellent", reason: "Exceptionally aligned with productivity developers." },
    overall: { score: 76, label: "strong", reason: "Strong mechanical core. Adjusting the transitional pacing at second 5 is the key to unlocking compound channel growth." }
  },
  structure: [
    {
      name: "Transitional Gap",
      exists: true,
      strength: 40,
      impact: "Viewer drops off as setup is introduced.",
      weakness: "Averages 1.5 seconds of static screenshot pause during narration shift.",
      fix: "Overlay an animated arrow or zoom-in highlight at second 5 to reset loop focus."
    }
  ],
  strengths: [
    "Cohesive system aesthetics across the feed",
    "Highly reliable comment automated pipeline triggers",
    "Clear instructional value in terminal/code tutorials"
  ],
  weaknesses: [
    "Recurring pacing lag at seconds 4-7 across multiple videos",
    "Feed thumbnails are too similar, creating user scrolling fatigue",
    "Lack of vocal tone transitions when introducing solution paying"
  ],
  missingElements: [
    "Diverse visual formats on covers to distinguish topics",
    "Fast zoom resets every 4 seconds dynamically",
    "High-contrast sound pop triggers on steps"
  ],
  recommendedFixes: [
    "Insert a dynamic pattern disruptor (transition, text card zoom) exactly at second 5 in edited timelines.",
    "Alter cover colors slightly (bronze, charcoal, soft amber) to organize feed structure.",
    "Use active outcome hooks: 'I spent 10 hours automating this CRM so you don't have to...'."
  ],
  improvedVersion: "Batch Strategy Pattern: Anchor second 5 transition with dynamic text card zoom + audio chime trigger.",
  shorterVersion: "Transition speed alignment: Speed up narration shift by 1.2x.",
  punchierVersion: "Pattern shift: Eliminate static frames, add zoom resets.",
  creatorDNAUpdate: {
    niche: "Solopreneur Workflow Engineering",
    audience: "Tech developers, freelancers, and workflow designers.",
    strongestFormats: ["Automated bento blueprints", "Speed setup walkthrough sheets"],
    strongestHooks: ["Direct time/financial savings claims", "Outcome-driven comparative formulas"],
    strongestCTAs: ["Direct comment keyword systems", "Save files for workspace reference"],
    contentLengthPreference: "25-32 seconds",
    recurringPatterns: ["Stagnant secondary transitional frames at second 5", "Beautiful charcoal-and-bronze colors"],
    biggestBottleneck: "Batch transitional pacing drag",
    recommendedFocus: "Re-edit second 5 transitions using dynamic camera zooms."
  },
  strategy: {
    keepDoing: [
      "Keep using dark premium system backdrops.",
      "Keep mapping automated keywords comment capture systems.",
      "Maintain clear instructional developer language styles."
    ],
    stopDoing: [
      "Stop releasing static screens exceeding 3 seconds without scale changes.",
      "Stop repeating identical thumbnail text overlays.",
      "Avoid slow analytical explanations."
    ],
    improveFirst: [
      "Optimize transitional frame edits.",
      "Differentiate cover styles for topic types.",
      "Increase audio volume levels of background dynamic tracks."
    ],
    testNext: [
      "A fast 18-second bento system review.",
      "A multi-screen comparison feed format."
    ],
    biggestBottleneck: "Feed thumbnail fatigue and transitional frame silence.",
    highestLeverageFix: "Incorporate transitional whoosh sound layers directly into second 5 timelines."
  },
  metadata: {
    language: "english",
    platform: "instagram",
    dataConfidence: "high",
    isEstimated: false
  }
};

export const MOCK_FULL_AUDIT_REPORT: CreatorIntelligenceReport = {
  id: "mock_audit_01",
  createdAt: new Date().toISOString(),
  mode: "full_content_audit",
  title: "CreatorOS Content Health Check & Macro Strategy Roadmap",
  summary: "Comprehensive qualitative audit reveals highly authoritative technical value but low engagement rates. Transforming informational tutorials into dramatic, outcome-first visual guides will unlock elite positioning.",
  scores: {
    hook: { score: 73, label: "strong", reason: "Excellent topic choices, but hook voiceovers lack early dramatic hook-anchors." },
    retention: { score: 65, label: "moderate", reason: "High click-away in first 4 seconds combined with stagnation around middle sections." },
    flow: { score: 88, label: "strong", reason: "Instructional flow is elite. Logical, concise, and structured." },
    story: { score: 48, label: "weak", reason: "Rambles too much on dry documentation explanations. Lacks human stakes." },
    emotion: { score: 60, label: "moderate", reason: "Offers strong relief from manual spreadsheets but fails to trigger envy or excitement." },
    cta: { score: 91, label: "excellent", reason: "World-class integration of automated DM keywords commenting workflows." },
    packaging: { score: 80, label: "strong", reason: "Clean visual covers but titles are too abstract and developer-centric." },
    audienceMatch: { score: 94, label: "excellent", reason: "Targeting high value solopreneurs and workflow builders accurately." },
    overall: { score: 75, label: "strong", reason: "Superb foundational assets. Transitioning from theoretical documentation to visually-driven outcome lessons is the primary goal." }
  },
  structure: [
    {
      name: "Macro Feeds Alignment",
      exists: true,
      strength: 75,
      impact: "Creates beautiful, consistent dark obsidian feed layouts.",
      weakness: "Lacks diverse video concepts, making scrolling feel repetitive.",
      fix: "Incorporate talking component videos, live setup screencasts, and text slides."
    }
  ],
  strengths: [
    "Elite technical knowledge and system authority",
    "Flawless instructional logic systems",
    "Clean, automated comment trigger keywords campaigns"
  ],
  weaknesses: [
    "Overly clinical developer vocabulary framing simple tasks",
    "Feed aesthetic is excessively identical, causing scrolling fatigue",
    "Delayed hook visual delivery during voice preambles"
  ],
  missingElements: [
    "Diverse cover layouts (bronze, amber, charcoal accents)",
    "Talking-head context screen overlaps",
    "Casual casual conversational cues during intros"
  ],
  recommendedFixes: [
    "Reorganize video topic pillars: 40% Action setups, 30% comparative files, 20% aesthetic bento, 10% lifestyle notes.",
    "Use standard display typography with yellow highlighted focus words.",
    "Eliminate all dry software definitions; show only active workspaces."
  ],
  improvedVersion: "Macro Pivot: Pivot from clinical documentation tutorials to high-impact workflow outcome demonstrations.",
  shorterVersion: "Content distribution: Shift layout balance to 3 cuts per minute.",
  punchierVersion: "Aesthetic overhaul: Utilize warm copper spotlights and massive text overlays.",
  creatorDNAUpdate: {
    niche: "Aesthetic Business Automations",
    audience: "High growth agency solopreneurs and automation developers.",
    strongestFormats: ["Bento screen walkthrough arrays", "Comparative setup sheets"],
    strongestHooks: ["Direct automated business savings claims", "Outcome-driven workflow tutorials"],
    strongestCTAs: ["Direct comment keyword systems", "Save files for workstation guides"],
    contentLengthPreference: "25-35 seconds",
    recurringPatterns: ["Clinical dry developer narration", "Stagnant camera screens shares"],
    biggestBottleneck: "Theoretical technical definitions",
    recommendedFocus: "Only film active software workspaces; explain nothing theoretically."
  },
  strategy: {
    keepDoing: [
      "Keep using dark premium charcoal canvas aesthetics.",
      "Keep implementing automated comment triggers.",
      "Maintain clear instructional step-by-step structures."
    ],
    stopDoing: [
      "Avoid static screen frames exceeding 3 seconds.",
      "Stop using abstract clinical vocabulary.",
      "No more passive link-in-bio setups."
    ],
    improveFirst: [
      "Clarify early hook outcomes.",
      "Introduce pattern interrupts (zooms, arrows, callouts).",
      "Diversify thumbnail structures."
    ],
    testNext: [
      "A fast 15-second system overview reel.",
      "A talking-head over screencast layout pattern."
    ],
    biggestBottleneck: "Theoretical education lag.",
    highestLeverageFix: "Re-edit opening lines using first-frame outcome demonstrations."
  },
  metadata: {
    language: "english",
    platform: "instagram",
    dataConfidence: "high",
    isEstimated: false
  }
};

export const MOCK_STRATEGY_ENGINE_REPORT: CreatorIntelligenceReport = {
  id: "mock_se_01",
  createdAt: new Date().toISOString(),
  mode: "strategy_engine",
  title: "Content Strategy Engine & Hook Generation Vault",
  summary: "An AI-engineered hook blueprint containing high-intent topics, high-hook concepts, conversational script drafts, and CTA templates engineered specifically for workflow solopreneurs.",
  scores: {
    hook: { score: 90, label: "excellent", reason: "Engineered outcome hooks with zero-filler preambles for immediate audience captures." },
    retention: { score: 83, label: "strong", reason: "Incorporates recommended Zoom Resets every 4 seconds to maintain eye focus." },
    flow: { score: 92, label: "excellent", reason: "Highly logical step sequence, easy for developers to copy." },
    story: { score: 72, label: "strong", reason: "Brief, high-tension 'How I did it' setups to anchor educational pay-offs." },
    emotion: { score: 84, label: "strong", reason: "Triggers professional efficiency desire and FOMO on modern toolkits." },
    cta: { score: 92, label: "excellent", reason: "Provides direct comment keywords trigger campaigns mapped to files." },
    packaging: { score: 86, label: "strong", reason: "Cohesive dark premium bento covers featuring bright bronze typography hooks." },
    audienceMatch: { score: 96, label: "excellent", reason: "Directly addresses intermediate and advanced automated builders." },
    overall: { score: 88, label: "excellent", reason: "Highly strategic blueprint. Standardizing hook-first openings with automated CTA comments drives viral retention curves." }
  },
  structure: [
    {
      name: "Strategic Hook Blueprint",
      exists: true,
      strength: 90,
      impact: "Captures high feed viewer attention via immediate outcome claims.",
      weakness: "Can feel fast; needs clear, large subtitle overlays.",
      fix: "Always display massive central screen text overlay captions."
    }
  ],
  strengths: [
    "Compelling outcome claim hook options",
    "Perfect integration of files commenting comment campaigns",
    "Highly modular and easy to script quickly"
  ],
  weaknesses: [
    "Relies extensively on automated tools niches, may exclude general builders",
    "Pacing is fast, requiring fluent vocal delivery",
    "Required exact screen screencasts of finished dashboard outcomes"
  ],
  missingElements: [
    "Slow-pacing backup fallback options",
    "General lifestyle talking points",
    "Plain textbook definitions grids"
  ],
  recommendedFixes: [
    "Film 3 core webhook screencasts ahead of script recording.",
    "Use JetBrains Mono fonts for code overlays.",
    "Incorporate clean hover clicks pops sound clips."
  ],
  improvedVersion: `How I automated 100% of my client invoices with zero complex developers lines. Comment CASH to copy. Most freelancers spend 5 hours every Friday compiling invoices. I built a webhook that triggers on Stripe comments, generates PDF layouts inside Claude, and records the lead details in Supabase. Comment 'CASH' to copy my template right now.`,
  shorterVersion: "Stripe invoicing automated in 1 click. Comment CASH.",
  punchierVersion: "Stop writing client invoices. Automate it now. Comment CASH.",
  creatorDNAUpdate: {
    niche: "Aesthetic Freelancer Workflows",
    audience: "Busy freelance developers, designers, and agency founders.",
    strongestFormats: ["Bento screen workflow tutorials", "Tools comparison lists"],
    strongestHooks: ["Direct time/monetary savings claim hooks", "How I built setup stories"],
    strongestCTAs: ["Direct comment keyword systems", "Save files for workbench configs"],
    contentLengthPreference: "20-28 seconds",
    recurringPatterns: ["High contrast dual-colored caption overlays", "Whoosh step transitions"],
    biggestBottleneck: "Slow talking pacing loops",
    recommendedFocus: "Maintain energetic vocal delivery with zero pauses."
  },
  strategy: {
    keepDoing: [
      "Keep using Charcoal premium theme containers.",
      "Keep deploying direct automated comments keywords capture setups.",
      "Maintain active outcome demonstration hooks."
    ],
    stopDoing: [
      "Avoid generic introductions like 'Today I want to talk...'.",
      "Do not ask user to open links inside profiles bio.",
      "Avoid static cameras setups."
    ],
    improveFirst: [
      "Maximize visual contrast on screenshots.",
      "Insert whoosh animation pops between slides.",
      "Optimize subtitle fonts visibility."
    ],
    testNext: [
      "A fast 15-second screenshot comparison.",
      "A split-screen tracking manual task vs automation setups."
    ],
    biggestBottleneck: "Early second dropoffs before pay-off.",
    highestLeverageFix: "Introduce large contrasted text warning blocks in slide 1."
  },
  metadata: {
    language: "english",
    platform: "instagram",
    dataConfidence: "excellent",
    isEstimated: false
  }
};

export const MOCK_HISTORY_REPORTS: CreatorIntelligenceReport[] = [
  MOCK_SCRIPT_DOCTOR_REPORT,
  MOCK_PERFORMANCE_REPORT,
  MOCK_DNA_REPORT,
  MOCK_WINNER_LOSER_REPORT,
  MOCK_COMPETITOR_REPORT,
  MOCK_MULTI_PATTERN_REPORT,
  MOCK_FULL_AUDIT_REPORT,
  MOCK_STRATEGY_ENGINE_REPORT
];
