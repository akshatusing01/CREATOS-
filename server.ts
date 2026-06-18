import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Agent, setGlobalDispatcher } from "undici";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Configure undici global dispatcher to prevent HeadersTimeoutError (especially for large JSON schemas)
setGlobalDispatcher(new Agent({
  headersTimeout: 300000, // 5 minutes
  bodyTimeout: 300000,
  connectTimeout: 300000,
}));

// Warm caching of Supabase Client dynamically
let supabaseClientCached: any = null;

function cleanEnvValue(val: string | undefined): string {
  if (!val) return "";
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function getSupabaseClient() {
  if (supabaseClientCached) return supabaseClientCached;
  const url = cleanEnvValue(process.env.SUPABASE_URL);
  const key = cleanEnvValue(process.env.SUPABASE_ANON_KEY);
  if (
    !url ||
    !key ||
    url === "MY_SUPABASE_URL" ||
    key === "MY_SUPABASE_ANON_KEY" ||
    (!url.startsWith("http://") && !url.startsWith("https://"))
  ) {
    return null;
  }
  try {
    supabaseClientCached = createClient(url, key);
    return supabaseClientCached;
  } catch (err) {
    console.warn("Supabase client creation failed:", err);
    return null;
  }
}

// Initialize Gemini Client Lazily/Safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured or contains placeholder. Please set your Gemini API key in the Secrets panel in AI Studio.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Complete Output Schema Definition for content transformation
const contentPackageSchema = {
  type: Type.OBJECT,
  properties: {
    scripts: {
      type: Type.OBJECT,
      properties: {
        originalCleaned: { type: Type.STRING, description: "A beautifully formatted, cleaned-up version of the original input topic/script." },
        improved: { type: Type.STRING, description: "Professional-grade script rewrite fixing grammatical flows and pacing." },
        viral: { type: Type.STRING, description: "Energetic version packed with retention loops, visual suggestions, and high curiosity." },
        storytelling: { type: Type.STRING, description: "Intimate, narrative-heavy version following a classic hero's journey framework or storytelling arc." },
        short: { type: Type.STRING, description: "Ultra-punchy short form script suitable for 15-30s Reels/Shorts." },
        longer: { type: Type.STRING, description: "Comprehensive longer script version suitable for 60-90s with detailed exposition." },
        hookFirst: { type: Type.STRING, description: "A script version leading directly with the ultimate scroll stopper with no filler introduction." }
      },
      required: ["originalCleaned", "improved", "viral", "storytelling", "short", "longer", "hookFirst"]
    },
    hooks: {
      type: Type.OBJECT,
      properties: {
        curiosity: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Curiosity hooks designed to intrigue the audience" },
        shock: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Shock / attention-grabbing hooks" },
        negative: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Fear of missing out or pain point hooks" },
        story: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Narrative-starting hook variations" },
        question: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 High-engagement question hooks" },
        contrarian: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Hooks that challenge standard industry beliefs" },
        scrollStopper: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 Aggressive scroll-stopper statements" }
      },
      required: ["curiosity", "shock", "negative", "story", "question", "contrarian", "scrollStopper"]
    },
    ctas: {
      type: Type.OBJECT,
      properties: {
        follow: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 High-conversion follow calls-to-action" },
        comment: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 Trigger-word comment CTAs (e.g. 'Comment \"GROW\"')" },
        save: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 Reminders to save this value-packed post" },
        share: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 Sharing prompts related to utility" },
        part2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 Part-2 teaser hooks/CTAs" },
        dm: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2 DM automation style CTAs" }
      },
      required: ["follow", "comment", "save", "share", "part2", "dm"]
    },
    captions: {
      type: Type.OBJECT,
      properties: {
        shortFormat: { type: Type.STRING, description: "A one or two line fast-paced caption with emoji." },
        viralFormat: { type: Type.STRING, description: "Spacing heavy, bold statement with visual linebreaks." },
        emotionalFormat: { type: Type.STRING, description: "Designed to build deep personal connection." },
        seoFriendly: { type: Type.STRING, description: "Heavily packed with contextual keywords and searchable queries." },
        storytelling: { type: Type.STRING, description: "An mini-blog formatted story caption." }
      },
      required: ["shortFormat", "viralFormat", "emotionalFormat", "seoFriendly", "storytelling"]
    },
    hashtags: {
      type: Type.OBJECT,
      properties: {
        broad: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 general broad hashtags (e.g., #creator, #viral)" },
        niche: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 industry-niche hashtags" },
        topicSpecific: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 very precise hashtags about this script" },
        platformFriendlySets: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } }, description: "2 ready-to-copy hashtag blocks" }
      },
      required: ["broad", "niche", "topicSpecific", "platformFriendlySets"]
    },
    keywords: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.ARRAY, items: { type: Type.STRING } },
        related: { type: Type.ARRAY, items: { type: Type.STRING } },
        longTail: { type: Type.ARRAY, items: { type: Type.STRING } },
        searchPhrases: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["primary", "related", "longTail", "searchPhrases"]
    },
    titles: {
      type: Type.OBJECT,
      properties: {
        titleIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 Creative titles" },
        headlines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 YouTube style headlines" },
        scrollStopping: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 Brutally honest click-stopper titles" }
      },
      required: ["titleIdeas", "headlines", "scrollStopping"]
    },
    thumbnailText: {
      type: Type.OBJECT,
      properties: {
        short: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 words or less thumbnail text options" },
        punchy: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High contrast 2-line thumbnail options" },
        curiosityBased: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Curiosity gap thumbnail text ideas" }
      },
      required: ["short", "punchy", "curiosityBased"]
    },
    viralScore: {
      type: Type.OBJECT,
      properties: {
        hookStrength: { type: Type.INTEGER, description: "Hook score from 0-100" },
        curiosity: { type: Type.INTEGER, description: "Curiosity score from 0-100" },
        retention: { type: Type.INTEGER, description: "Predicted retention rate score from 0-100" },
        clarity: { type: Type.INTEGER, description: "Clarity/comprehension score from 0-100" },
        viralityPotential: { type: Type.INTEGER, description: "Viral potential score from 0-100" },
        overallScore: { type: Type.INTEGER, description: "Average overall score from 0-100" },
        explanation: { type: Type.STRING, description: "Comprehensive breakdown of the scores and reasoning." }
      },
      required: ["hookStrength", "curiosity", "retention", "clarity", "viralityPotential", "overallScore", "explanation"]
    },
    retentionAnalysis: {
      type: Type.OBJECT,
      properties: {
        pipeline: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING, description: "Hook retention analysis and pacing note." },
            setup: { type: Type.STRING, description: "Context setting retention feedback." },
            tension: { type: Type.STRING, description: "Mid-video conflict or tension analysis." },
            payoff: { type: Type.STRING, description: "Climax/payoff structure analysis." },
            cta: { type: Type.STRING, description: "Call to action dropoff warning/insight." }
          },
          required: ["hook", "setup", "tension", "payoff", "cta"]
        },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 parts where viewers are highly likely to drop off" },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 dynamic editing or scripts optimization suggestions to fix dropoff" }
      },
      required: ["pipeline", "weaknesses", "suggestions"]
    },
    styleNotes: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING, description: "Identified style (e.g. fast-cut b-roll, micro documentary)" },
        audienceMatch: { type: Type.STRING, description: "Description of the perfect target avatar for this content" },
        pacing: { type: Type.STRING, description: "Suggested talking speed, pauses, and transition intervals" },
        tone: { type: Type.STRING, description: "Emotional delivery instructions for the creator" },
        emotionalEnergy: { type: Type.STRING, description: "Scale or description of the required energy profile" },
        strongestAngle: { type: Type.STRING, description: "What makes this specific piece stand out from common creators" }
      },
      required: ["style", "audienceMatch", "pacing", "tone", "emotionalEnergy", "strongestAngle"]
    },
    fullVersions: {
      type: Type.OBJECT,
      properties: {
        conservative: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            script: { type: Type.STRING },
            caption: { type: Type.STRING },
            hook: { type: Type.STRING }
          },
          required: ["title", "script", "caption", "hook"]
        },
        viral: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            script: { type: Type.STRING },
            caption: { type: Type.STRING },
            hook: { type: Type.STRING }
          },
          required: ["title", "script", "caption", "hook"]
        },
        storytelling: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            script: { type: Type.STRING },
            caption: { type: Type.STRING },
            hook: { type: Type.STRING }
          },
          required: ["title", "script", "caption", "hook"]
        },
        concise: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            script: { type: Type.STRING },
            caption: { type: Type.STRING },
            hook: { type: Type.STRING }
          },
          required: ["title", "script", "caption", "hook"]
        }
      },
      required: ["conservative", "viral", "storytelling", "concise"]
    },
    notes: { type: Type.STRING, description: "An overarching encouraging message and quick wins for the creator." }
  },
  required: [
    "scripts", "hooks", "ctas", "captions", "hashtags", "keywords", "titles",
    "thumbnailText", "viralScore", "retentionAnalysis", "styleNotes", "fullVersions", "notes"
  ]
};

const scoreItemSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    reason: { type: Type.STRING },
    fix: { type: Type.STRING }
  },
  required: ["score", "reason", "fix"]
};

const scriptBreakdownItemSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    present: { type: Type.BOOLEAN },
    notes: { type: Type.STRING },
    fix: { type: Type.STRING }
  },
  required: ["score", "present", "notes", "fix"]
};

const scoreDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    label: { type: Type.STRING },
    reason: { type: Type.STRING }
  },
  required: ["score", "label", "reason"]
};

const creatorIntelligenceResponseSchema = {
  type: Type.OBJECT,
  properties: {
    mode: { type: Type.STRING },
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    scores: {
      type: Type.OBJECT,
      properties: {
        hook: scoreDetailsSchema,
        retention: scoreDetailsSchema,
        flow: scoreDetailsSchema,
        story: scoreDetailsSchema,
        emotion: scoreDetailsSchema,
        cta: scoreDetailsSchema,
        packaging: scoreDetailsSchema,
        audienceMatch: scoreDetailsSchema,
        overall: scoreDetailsSchema
      },
      required: ["hook", "retention", "flow", "story", "emotion", "cta", "packaging", "audienceMatch", "overall"]
    },
    structure: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          exists: { type: Type.BOOLEAN },
          strength: { type: Type.INTEGER },
          impact: { type: Type.STRING },
          weakness: { type: Type.STRING },
          fix: { type: Type.STRING }
        },
        required: ["name", "exists", "strength", "impact", "weakness", "fix"]
      }
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendedFixes: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvedVersion: { type: Type.STRING },
    shorterVersion: { type: Type.STRING },
    punchierVersion: { type: Type.STRING },
    creatorDNAUpdate: {
      type: Type.OBJECT,
      properties: {
        niche: { type: Type.STRING },
        audience: { type: Type.STRING },
        strongestFormats: { type: Type.ARRAY, items: { type: Type.STRING } },
        strongestHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
        strongestCTAs: { type: Type.ARRAY, items: { type: Type.STRING } },
        contentLengthPreference: { type: Type.STRING },
        recurringPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
        biggestBottleneck: { type: Type.STRING },
        recommendedFocus: { type: Type.STRING }
      },
      required: ["niche", "audience", "strongestFormats", "strongestHooks", "strongestCTAs", "contentLengthPreference", "recurringPatterns", "biggestBottleneck", "recommendedFocus"]
    },
    strategy: {
      type: Type.OBJECT,
      properties: {
        keepDoing: { type: Type.ARRAY, items: { type: Type.STRING } },
        stopDoing: { type: Type.ARRAY, items: { type: Type.STRING } },
        improveFirst: { type: Type.ARRAY, items: { type: Type.STRING } },
        testNext: { type: Type.ARRAY, items: { type: Type.STRING } },
        biggestBottleneck: { type: Type.STRING },
        highestLeverageFix: { type: Type.STRING }
      },
      required: ["keepDoing", "stopDoing", "improveFirst", "testNext", "biggestBottleneck", "highestLeverageFix"]
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING },
        platform: { type: Type.STRING },
        dataConfidence: { type: Type.STRING },
        isEstimated: { type: Type.BOOLEAN }
      },
      required: ["language", "platform", "dataConfidence", "isEstimated"]
    }
  },
  required: [
    "mode", "title", "summary", "scores", "structure", "strengths", "weaknesses", "missingElements",
    "recommendedFixes", "improvedVersion", "shorterVersion", "punchierVersion", "creatorDNAUpdate",
    "strategy", "metadata"
  ]
};

const creatorIntelligenceSchema = {
  type: Type.OBJECT,
  properties: {
    workspace: { type: Type.STRING },
    account: {
      type: Type.OBJECT,
      properties: {
        platform: { type: Type.STRING },
        username: { type: Type.STRING },
        profileUrl: { type: Type.STRING },
        niche: { type: Type.STRING },
        audienceType: { type: Type.STRING },
        contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } },
        toneOfVoice: { type: Type.STRING },
        visualStyle: { type: Type.STRING },
        postingFrequency: { type: Type.STRING },
        consistencyScore: { type: Type.INTEGER },
        dataConfidence: { type: Type.INTEGER }
      },
      required: [
        "platform", "username", "profileUrl", "niche", "audienceType",
        "contentPillars", "toneOfVoice", "visualStyle", "postingFrequency",
        "consistencyScore", "dataConfidence"
      ]
    },
    creatorDNA: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        bestFormat: { type: Type.STRING },
        bestHookType: { type: Type.STRING },
        bestCtaType: { type: Type.STRING },
        bestLengthRange: { type: Type.STRING },
        mainBottleneck: { type: Type.STRING },
        biggestOpportunity: { type: Type.STRING },
        nextFocusArea: { type: Type.STRING }
      },
      required: [
        "summary", "bestFormat", "bestHookType", "bestCtaType",
        "bestLengthRange", "mainBottleneck", "biggestOpportunity", "nextFocusArea"
      ]
    },
    performanceScores: {
      type: Type.OBJECT,
      properties: {
        hookStrength: scoreItemSchema,
        retentionPotential: scoreItemSchema,
        flowClarity: scoreItemSchema,
        emotionalPull: scoreItemSchema,
        ctaStrength: scoreItemSchema,
        packagingStrength: scoreItemSchema,
        audienceMatch: scoreItemSchema,
        overallQuality: scoreItemSchema
      },
      required: [
        "hookStrength", "retentionPotential", "flowClarity", "emotionalPull",
        "ctaStrength", "packagingStrength", "audienceMatch", "overallQuality"
      ]
    },
    winnerAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          postId: { type: Type.STRING },
          title: { type: Type.STRING },
          views: { type: Type.INTEGER },
          likes: { type: Type.INTEGER },
          comments: { type: Type.INTEGER },
          shares: { type: Type.INTEGER },
          saves: { type: Type.INTEGER },
          score: { type: Type.INTEGER },
          whyItWorked: { type: Type.STRING },
          hookType: { type: Type.STRING },
          emotionalTrigger: { type: Type.STRING },
          retentionDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
          ctaType: { type: Type.STRING },
          patternTags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: [
          "postId", "title", "views", "likes", "comments", "shares", "saves",
          "score", "whyItWorked", "hookType", "emotionalTrigger", "retentionDrivers",
          "ctaType", "patternTags"
        ]
      }
    },
    failureAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          postId: { type: Type.STRING },
          title: { type: Type.STRING },
          views: { type: Type.INTEGER },
          likes: { type: Type.INTEGER },
          comments: { type: Type.INTEGER },
          shares: { type: Type.INTEGER },
          saves: { type: Type.INTEGER },
          score: { type: Type.INTEGER },
          whyItUnderperformed: { type: Type.STRING },
          problemAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          fixSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          betterVersionDirection: { type: Type.STRING }
        },
        required: [
          "postId", "title", "views", "likes", "comments", "shares", "saves",
          "score", "whyItUnderperformed", "problemAreas", "fixSuggestions",
          "betterVersionDirection"
        ]
      }
    },
    scriptBreakdown: {
      type: Type.OBJECT,
      properties: {
        hook: scriptBreakdownItemSchema,
        setup: scriptBreakdownItemSchema,
        problem: scriptBreakdownItemSchema,
        curiosityGap: scriptBreakdownItemSchema,
        proof: scriptBreakdownItemSchema,
        value: scriptBreakdownItemSchema,
        story: scriptBreakdownItemSchema,
        transition: scriptBreakdownItemSchema,
        cta: scriptBreakdownItemSchema,
        closing: scriptBreakdownItemSchema
      },
      required: [
        "hook", "setup", "problem", "curiosityGap", "proof", "value",
        "story", "transition", "cta", "closing"
      ]
    },
    growthCoach: {
      type: Type.OBJECT,
      properties: {
        keepDoing: { type: Type.ARRAY, items: { type: Type.STRING } },
        stopDoing: { type: Type.ARRAY, items: { type: Type.STRING } },
        improveFirst: { type: Type.ARRAY, items: { type: Type.STRING } },
        testNext: { type: Type.ARRAY, items: { type: Type.STRING } },
        bottleneck: { type: Type.STRING },
        highestLeverageFix: { type: Type.STRING },
        nextImprovementLayer: { type: Type.STRING }
      },
      required: [
        "keepDoing", "stopDoing", "improveFirst", "testNext",
        "bottleneck", "highestLeverageFix", "nextImprovementLayer"
      ]
    },
    contentStrategy: {
      type: Type.OBJECT,
      properties: {
        nextTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
        anglesToTry: { type: Type.ARRAY, items: { type: Type.STRING } },
        formatsToTry: { type: Type.ARRAY, items: { type: Type.STRING } },
        formatsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
        contentGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: [
        "nextTopics", "anglesToTry", "formatsToTry", "formatsToAvoid", "contentGaps", "opportunities"
      ]
    },
    scriptDoctor: {
      type: Type.OBJECT,
      properties: {
        originalScript: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        rewrite: { type: Type.STRING },
        shortRewrite: { type: Type.STRING },
        hookOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        ctaOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        notes: { type: Type.STRING }
      },
      required: [
        "originalScript", "strengths", "weaknesses", "rewrite", "shortRewrite",
        "hookOptions", "ctaOptions", "notes"
      ]
    },
    history: {
      type: Type.OBJECT,
      properties: {
        reportId: { type: Type.STRING },
        createdAt: { type: Type.STRING },
        saved: { type: Type.BOOLEAN }
      },
      required: ["reportId", "createdAt", "saved"]
    },
    confidence: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.INTEGER },
        notes: { type: Type.STRING }
      },
      required: ["overall", "notes"]
    }
  },
  required: [
    "workspace", "account", "creatorDNA", "performanceScores", "winnerAnalysis",
    "failureAnalysis", "scriptBreakdown", "growthCoach", "contentStrategy",
    "scriptDoctor", "history", "confidence"
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // API Route for Creator Intelligence Analytical Modes (Mode-Router Architecture)
  app.post("/api/creator-intelligence/analyze", async (req, res) => {
    try {
      const {
        mode,
        inputData,
        // Keep fallback parameters support in case of generic calls
        username,
        profileUrl,
        manualReels,
        scriptText,
        captionText,
        engagementMetrics,
        postNotes,
        profileMemory
      } = req.body;

      const activeMode = mode || "script_doctor";
      let normalizedInput = inputData;

      // Map old parameters to normalizedInput if activeMode is used with legacy payload
      if (!normalizedInput) {
        if (activeMode === "script_doctor") {
          normalizedInput = {
            scriptTitle: "Untitled Analysis",
            platform: "instagram",
            language: "english",
            contentGoal: "retention",
            audience: profileMemory?.style || "creators",
            scriptText: scriptText || "",
            notes: postNotes || ""
          };
        } else {
          normalizedInput = {
            username: username || "Not connected",
            profileUrl: profileUrl || "None",
            manualReels: manualReels || [],
            scriptText: scriptText || "",
            captionText: captionText || "",
            engagementMetrics: engagementMetrics || null,
            postNotes: postNotes || "",
            profileMemory: profileMemory || null
          };
        }
      }

      // Initialize API client safely
      const ai = getGeminiClient();

      const systemInstruction = `You are Creator Intelligence (CI), the elite creator-specific performance learning engine and content diagnostic system inside CreatorOS AI.
Your ultimate goal is to compute CI scores, map creator-specific formulas, and generate highly modular strategist reports that help creators make content that performs better by learning from their own content patterns.

Primary analytical principles:
- Why did this piece perform well or fail? What is the strongest hook pattern, weakest structural point, and optimal adjustment plan?
- Do NOT promise guaranteed virality or claim every script goes viral.
- Do NOT fabricate live Instagram data unless provided in the metrics.
- Keep the tone elite, professional, objective, high-octane, and constructive.

Every generation must follow this strict 5-Stage intelligence process:
STAGE A — INPUT PARSING: Extract content type, platform, language, goal, available/missing data, and input format.
STAGE B — STRUCTURAL ANALYSIS: Dissect components (Hook, Setup, Problem, Curiosity Gap, Proof, Value, Story, Transition, CTA, Closing) and evaluate existence & strength.
STAGE C — DIAGNOSTIC ANALYSIS: Diagnose pacing bottlenecks, dropoffs, retention triggers, and engagement quality.
STAGE D — RECOMMENDATIONS: Provide targeted fixes, rewrite alternatives, strategy blueprints, and test next.
STAGE E — NORMALIZE: Return strictly valid JSON according to the response contract schema. Ensure scores (hook, retention, flow, story, emotion, cta, packaging, audienceMatch, overall) are 0-100 and interpret them with the proper label (weak / moderate / strong / excellent).

Provide mode-specific analysis targeting the active mode: "${activeMode}".
1. script_doctor: Focus on structural pacing, hook, retention arc, CTA position, rewrite alternatives (improved, shorter, punchier).
2. performance_analyzer: Focus on metrics interpretation, save-worthiness, shareability, engagement drivers, bottleneck.
3. creator_dna_builder: Focus on niche, audience mapping, strongest formats, tone patterns, LENGTH preferences, biggest bottlenecks, recurring vectors.
4. winner_loser_comparison: Direct side-by-side diagnostic contrasts, lessons to double down vs copy vs avoid entirely.
5. competitor_analysis: reference vs user sample differentiation, stylistic structural tactical gap.
6. multi_pattern_analysis: batch patterns, duplicated strengths, repeated loop failures, common CTA formats.
7. full_content_audit: Executive health check roadmap, prioritizations, structural system overhaul.
8. strategy_engine: content ideas list, exact hooks, CTA variations, trend context, bottleneck tests.`;

      const promptMsg = `Perform a comprehensive high-octane Creator Intelligence analysis of type: "${activeMode}" using these inputs:
---
Input Dataset JSON:
${JSON.stringify(normalizedInput || {}, null, 2)}
---
Compile the report matching the target responseSchema precisely. Provide genuine, creative copy and professional diagnosis.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.75,
          responseMimeType: "application/json",
          responseSchema: creatorIntelligenceResponseSchema
        }
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("No response from Gemini Creator Intelligence model.");
      }

      const parsedData = JSON.parse(rawText.trim());
      return res.json({ success: true, data: parsedData });

    } catch (err: any) {
      console.error("Creator Intelligence Error:", err);
      return res.status(500).json({
        error: err.message || "An error occurred during Creator Intelligence processing. Please ensure your GEMINI_API_KEY is configured in your Secrets Panel in AI Studio.",
        details: err.stack ? err.stack.toString() : ""
      });
    }
  });

  // API Route for complete transformation
  app.post("/api/transform", async (req, res) => {
    try {
      const {
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
      } = req.body;

      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Input content (topic, rough script, or script) is required." });
      }

      // Initialize API client safely
      const ai = getGeminiClient();

      const systemInstruction = `You are an elite YouTube and Instagram Shorts viral scriptwriter, senior editor, and audience psychotherapist.
Your objective is to ingest the creator's rough ideation or script, analyze its essence, retain its raw wisdom/truth, and transform it into an elite, highly addictive personal-use creator asset package with the specified preferences.

Inputs provided:
- Topic / Draft content: "${text}"
- Input type: "${contentType}"
- Desired Output Language: "${language}"
- Niche Focus: "${niche}"
- Key Tone: "${tone}"
- Target Platform: "${platform}"
- Rewrite Strength: "${rewriteStrength}"
- Ultimate Goal of this video: "${goal}"
- Secondary Creator Style profile: "${style}"
- Custom User profile guidelines: ${JSON.stringify(profileMemory || {})}

CRITICAL RULES DEFERRED FOR THE CREATION ENGINE:
- Use natural conversation rhythms. Hinglish should sound like actual spoken conversational Hindi-English used by modern developers and visual content creators in India, never robotic or translated literally. English must sound clean, authentic, and high-impact.
- Ensure original context is intact. Do not lose the core factual elements.
- Inject strong 'Visual B-Roll hooks' and speech emphasis notations where necessary (e.g., using [brackets]).
- Keep hook-first versions brutally clean. No generic intro 'Hey guys' or 'Today I am talking about'. Start mid-thought or mid-shock.
- Keep the response perfectly structured inside the JSON schema. Ensure all fields are rich, useful, and fully generated without placeholders. Do not return empty arrays list entries.`;

      const promptMsg = `Refactor this creator concept into the comprehensive CreatorOS content package:
---
${text}
---
Please fill out all schema properties with genuine, high-scoring creative copy, detailed analyses, and ready-to-publish script variants. Provide a multi-dimensional treatment including original cleaned, professional improved, hyper-viral loop, immersive storytelling, ultra-fast concise, 60s expository, and no-filler hook-first formats. Provide 4 fully self-contained creator packages (conservative, viral, storytelling, concise) featuring title, script, caption, and hook. Do not use generic placeholders.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: contentPackageSchema
        }
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error("Empty response received from Gemini AI model.");
      }

      // Safely parse JSON
      const parsedData = JSON.parse(rawText.trim());
      return res.json({ success: true, data: parsedData });

    } catch (err: any) {
      console.error("Gemini Generation Error:", err);
      return res.status(500).json({
        error: err.message || "An error occurred during Gemini AI processing. Please check your API credentials.",
        details: err.stack ? err.stack.toString() : ""
      });
    }
  });

  // API Route for regenerating a Single Module selectively to save tokens or tweak output
  app.post("/api/regenerate-module", async (req, res) => {
    try {
      const {
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
        currentValue,
        profileMemory
      } = req.body;

      if (!text || !moduleKey) {
        return res.status(400).json({ error: "Text prompt and the target moduleKey are required for targeted regeneration." });
      }

      const ai = getGeminiClient();

      let targetModuleSchema: any = {};
      let descExample = "";

      // Match the partial schema based on key
      if (moduleKey === "scripts") {
        targetModuleSchema = contentPackageSchema.properties.scripts;
        descExample = "Return updated variations (originalCleaned, improved, viral, storytelling, short, longer, hookFirst).";
      } else if (moduleKey === "hooks") {
        targetModuleSchema = contentPackageSchema.properties.hooks;
        descExample = "Return high-impact curiosity, shock, negative, story, question, contrarian, and scrollStopper lists.";
      } else if (moduleKey === "ctas") {
        targetModuleSchema = contentPackageSchema.properties.ctas;
        descExample = "Return a set of strategic CTAs (follow, comment, save, share, part2, dm).";
      } else if (moduleKey === "captions") {
        targetModuleSchema = contentPackageSchema.properties.captions;
        descExample = "Return updated creative captions (shortFormat, viralFormat, emotionalFormat, seoFriendly, storytelling).";
      } else if (moduleKey === "hashtags") {
        targetModuleSchema = contentPackageSchema.properties.hashtags;
        descExample = "Return categorized hashtags lists and ready platform-friendly sets.";
      } else if (moduleKey === "keywords") {
        targetModuleSchema = contentPackageSchema.properties.keywords;
        descExample = "Return keywords categories.";
      } else if (moduleKey === "titles") {
        targetModuleSchema = contentPackageSchema.properties.titles;
        descExample = "Return fresh click-grabbing titles.";
      } else if (moduleKey === "thumbnailText") {
        targetModuleSchema = contentPackageSchema.properties.thumbnailText;
        descExample = "Return short, punchy, or curiosity-based text lines for thumbnail graphical canvas overlay.";
      } else if (moduleKey === "viralScore") {
        targetModuleSchema = contentPackageSchema.properties.viralScore;
        descExample = "Return a detailed score analyzer structure.";
      } else if (moduleKey === "retentionAnalysis") {
        targetModuleSchema = contentPackageSchema.properties.retentionAnalysis;
        descExample = "Return detailed funnel analysis structures.";
      } else if (moduleKey === "styleNotes") {
        targetModuleSchema = contentPackageSchema.properties.styleNotes;
        descExample = "Return the detailed creator physical instruction card.";
      } else if (moduleKey === "fullVersions") {
        targetModuleSchema = contentPackageSchema.properties.fullVersions;
        descExample = "Return the 4 full self-contained production variants (conservative, viral, storytelling, concise).";
      } else {
        return res.status(400).json({ error: `Regeneration is not supported for module key: ${moduleKey}` });
      }

      const systemInstruction = `You are a specialist creator consultant focusing specifically on the "${moduleKey}" section.
Your task is to regenerate ONLY the structure for "${moduleKey}" based on the creator's raw details and targeted style configurations.

Inputs:
- Draft Content: "${text}"
- Content Type: "${contentType}"
- Language: "${language}"
- Niche: "${niche}"
- Tone: "${tone}"
- Target Platform: "${platform}"
- Rewrite Strength: "${rewriteStrength}"
- Ultimate Goal of video: "${goal}"
- Custom user instructions: ${JSON.stringify(profileMemory || {})}

Original value was: ${JSON.stringify(currentValue || {})}

Make the new version 100% better, punchier, and fully realized.`;

      const promptMsg = `Regenerate the complete structured properties for "${moduleKey}". ${descExample}. Do not skip any mandatory fields inside this module. Return the JSON matching the required schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.9,
          responseMimeType: "application/json",
          responseSchema: targetModuleSchema
        }
      });

      const rawText = response.text;
      if (!rawText) throw new Error("Empty response received from module regenerator.");

      const parsedModule = JSON.parse(rawText.trim());
      return res.json({ success: true, data: parsedModule });

    } catch (err: any) {
      console.error("Gemini Module Regeneration Error:", err);
      return res.status(500).json({ error: err.message || "An error occurred during module regeneration." });
    }
  });

  // DB integration status endpoint
  app.get("/api/db-status", async (req, res) => {
    const rawUrl = cleanEnvValue(process.env.SUPABASE_URL);
    const rawKey = cleanEnvValue(process.env.SUPABASE_ANON_KEY);
    const client = getSupabaseClient();
    const isConfigured = client !== null;
    let isReachable = false;
    let detail = "NOT_CONFIGURED";
    let count = 0;

    if (isConfigured && client) {
      try {
        const { data, error, status } = await client
          .from("creatoros_projects")
          .select("id")
          .limit(1);

        if (error) {
          console.error("Supabase probe select error:", error);
          if (error.code === "PGRST116" || error.message.includes("does not exist") || status === 404) {
            isReachable = true; // Reachable, but table hasn't been created yet
            detail = "TABLE_NOT_FOUND";
          } else {
            detail = `API_ERROR: ${error.message}`;
          }
        } else {
          isReachable = true;
          detail = "CONNECTED";
          count = data ? data.length : 0;
        }
      } catch (err: any) {
        console.error("Supabase connection exception:", err);
        detail = `EXCEPTION: ${err.message || err}`;
      }
    }

    res.json({
      configured: isConfigured,
      reachable: isReachable,
      status: detail,
      url: rawUrl,
      setupSql: `-- CREATE THE DATABASE TABLE IN YOUR SUPABASE SQL EDITOR:
CREATE TABLE IF NOT EXISTS creatoros_projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "inputText" TEXT NOT NULL,
  config JSONB NOT NULL,
  "packageData" JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OPTIONAL: Add Row Level Security (RLS) bypass or policy to public
ALTER TABLE creatoros_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON creatoros_projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON creatoros_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON creatoros_projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON creatoros_projects FOR DELETE USING (true);
`
    });
  });

  // GET all projects from Supabase (with automatic local storage fallback on the client)
  app.get("/api/projects", async (req, res) => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return res.json({ success: true, source: "localStorage", data: [] });
      }

      const { data, error } = await client
        .from("creatoros_projects")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        if (error.code === "PGRST116" || error.message.includes("does not exist")) {
          return res.status(404).json({
            success: false,
            error: "Table 'creatoros_projects' does not exist in Supabase.",
            code: "TABLE_NOT_FOUND"
          });
        }
        throw error;
      }

      return res.json({ success: true, source: "supabase", data });
    } catch (err: any) {
      console.error("Supabase GET error:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to load projects from Supabase." });
    }
  });

  // POST save / update a project in Supabase
  app.post("/api/projects", async (req, res) => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return res.status(400).json({ success: false, error: "Supabase credentials are not configured on the server." });
      }

      const { id, name, timestamp, inputText, config, packageData } = req.body;
      if (!id || !name || !inputText) {
        return res.status(400).json({ success: false, error: "id, name, and inputText are required parameters." });
      }

      const { error } = await client
        .from("creatoros_projects")
        .upsert({
          id,
          name,
          timestamp: timestamp || new Date().toISOString(),
          inputText,
          config,
          packageData,
        });

      if (error) {
        throw error;
      }

      return res.json({ success: true, message: "Project successfully saved to Supabase." });
    } catch (err: any) {
      console.error("Supabase POST error:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to save project to Supabase." });
    }
  });

  // DELETE a project from Supabase
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return res.status(400).json({ success: false, error: "Supabase credentials are not configured on the server." });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, error: "Project ID is required." });
      }

      const { error } = await client
        .from("creatoros_projects")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return res.json({ success: true, message: "Project deleted from Supabase." });
    } catch (err: any) {
      console.error("Supabase DELETE error:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to delete project from Supabase." });
    }
  });

  // Serve static assets in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CreatorOS Personal backend listening on port ${PORT}`);
  });
}

startServer();
