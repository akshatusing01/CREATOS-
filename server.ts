import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

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
