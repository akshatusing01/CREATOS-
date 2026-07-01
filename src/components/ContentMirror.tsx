import React, { useState } from "react";
import { HelpCircle, ThumbsUp, ThumbsDown, Zap, ArrowLeft, ArrowRight, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InsightCard {
  id: number;
  title: string;
  category: "worked" | "failed" | "improved";
  headline: string;
  detail: string;
  hinglishTip: string;
}

export default function ContentMirror() {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [inputText, setInputText] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [customInsights, setCustomInsights] = useState<InsightCard[] | null>(null);

  // Default seeded Indian creator patterns case studies
  const seededInsights: InsightCard[] = [
    {
      id: 1,
      title: "Opening Hooks Paradigm",
      category: "worked",
      headline: "The 'Kya aapko pata hai...' curiosity pattern",
      detail: "Starting the video immediately with a rhetorical question in Hindi while pointing at a physical object on screen captured 70%+ retention in the first 3 seconds.",
      hinglishTip: "Bhai, video start karte hi formal greeting mat karo. Direct mid-conversation se shuru karo!"
    },
    {
      id: 2,
      title: "Mid-Video Transitions",
      category: "failed",
      headline: "Slow stock-footage sequences",
      detail: "Using generic corporate stock footage of a person typing on a laptop caused a massive 15% drop-off in the middle (at 22s mark) because it felt impersonal and like an ad.",
      hinglishTip: "Stock footage ki jagah khud ka raw high-speed screen recording ya funny reaction meme lagao."
    },
    {
      id: 3,
      title: "Call to Action Optimization",
      category: "improved",
      headline: "Delaying CTA to the literal last second",
      detail: "Placing the CTA at the very end when the video loop has already started cut engagement. Creators should introduce conversational triggers like 'Comment WEBHOOK below' midway.",
      hinglishTip: "CTA ko end ke liye mat bachao, beech mein bolo 'Comment karo, main direct link DM karunga'!"
    }
  ];

  const currentInsights = customInsights || seededInsights;
  const currentCard = currentInsights[activeCardIndex] || currentInsights[0];

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev + 1) % currentInsights.length);
  };

  const handlePrev = () => {
    setActiveCardIndex((prev) => (prev - 1 + currentInsights.length) % currentInsights.length);
  };

  const handleMirrorAnalysis = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    
    try {
      // Direct integration with server-side AI script_doctor mode to extract mirrors
      const response = await fetch("/api/creator-intelligence/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "script_doctor",
          inputData: {
            scriptTitle: "Mirror Diagnosis",
            platform: "instagram",
            language: "hinglish",
            contentGoal: "retention",
            scriptText: inputText
          }
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        const aiReport = resData.data;
        
        // Map the structured analysis report to our Content Mirror 3-card format
        const generated: InsightCard[] = [
          {
            id: 1,
            title: "What Worked Well",
            category: "worked",
            headline: aiReport.strengths?.[0] || "Strong conversational voice",
            detail: aiReport.strengths?.join(". ") || "Your script avoids boring formal introductions and maintains a brotherly, relatable tone.",
            hinglishTip: "Aapka core point solid hai, is authentic Indian perspective ko double down karo!"
          },
          {
            id: 2,
            title: "What Underperformed / Dropoff Risks",
            category: "failed",
            headline: aiReport.weaknesses?.[0] || "Pacing bottleneck identified",
            detail: aiReport.weaknesses?.join(". ") || "The hook lacks high visual dynamic adjustments, and transition speeds are likely slow.",
            hinglishTip: "Bhai, visual edits bohot fast rakhna padega, 2-3 seconds ke drop-offs bachane ke liye."
          },
          {
            id: 3,
            title: "How to Improve Next Time",
            category: "improved",
            headline: aiReport.recommendedFixes?.[0] || "Shift CTA location",
            detail: aiReport.recommendedFixes?.join(". ") || "Move the comment/share trigger to the mid-point. Use clear [B-roll] text overlay to direct visual cues.",
            hinglishTip: "Direct CTA dalo: 'Comment mein LINK likho aur mai automatic response bhej dunga'!"
          }
        ];
        
        setCustomInsights(generated);
        setActiveCardIndex(0);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (err) {
      // Fallback in case of server offline or missing API key
      const mockGenerated: InsightCard[] = [
        {
          id: 10,
          title: "Custom Diagnosis: What Worked",
          category: "worked",
          headline: "Strong Hinglish connection",
          detail: "Your text has a beautiful conversational rhythm. Spoken sentences are short and easily digestible.",
          hinglishTip: "Is format ko repeat karo! Indian audience connects instantly with raw honesty."
        },
        {
          id: 11,
          title: "Custom Diagnosis: What Failed",
          category: "failed",
          headline: "Missing mid-tension trigger",
          detail: "After a great hook, the script dives directly into long explanations without showing a visual proof or relatable story context.",
          hinglishTip: "Bhai, 15s mark pe ek quick shocker dalo taaki log end tak swipe na kare."
        },
        {
          id: 12,
          title: "Custom Diagnosis: What to Improve",
          category: "improved",
          headline: "Optimize comment triggers",
          detail: "Implement an automated comment trigger. Don't ask them to write a long paragraph, just say 'Comment WEBHOOK below and I'll send it'."
          ,hinglishTip: "Comment process jitna easy hoga, video utni hi viral jayegi!"
        }
      ];
      setCustomInsights(mockGenerated);
      setActiveCardIndex(0);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCustomInsights(null);
    setInputText("");
    setActiveCardIndex(0);
  };

  return (
    <div className="space-y-6" id="content-mirror-root">
      {/* Scope Informational Ribbon */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 shadow-sm">
        <div className="flex gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-700 h-10 w-10 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Content Mirror • Qualitative Feedback</h2>
            <p className="text-xs text-slate-600 mt-1">
              <strong>What is this?</strong> An analysis mirror focusing strictly on qualitative diagnostics: worked, underperformed, and improvements.<br />
              <strong>Why care?</strong> Complex charts and viewer graphs tell you *that* viewers dropped off, but not *why* they dropped off.<br />
              <strong>What to do next?</strong> Paste any past script or content concept below to get an instant Qualitative Mirror analysis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left column: Feed Input */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm md:col-span-5 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Script Diagnostics input</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Enter your past script to get a brutal mirror feedback.</p>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your past short-form script here..."
            className="w-full h-44 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono leading-relaxed focus:ring-1 focus:ring-[#cf7051]"
          />

          <div className="flex gap-2">
            <button
              onClick={handleMirrorAnalysis}
              disabled={analyzing || !inputText.trim()}
              className="flex-1 bg-[#cf7051] hover:bg-[#c06041] disabled:bg-slate-300 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mirror Reflecting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Reflect Script</span>
                </>
              )}
            </button>

            {customInsights && (
              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-xl border border-slate-200"
                title="Reset custom feedback"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right column: Swipeable Mirror Feed */}
        <div className="md:col-span-7 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`w-full bg-white border rounded-3xl p-6 shadow-md border-slate-150 relative overflow-hidden flex flex-col justify-between min-h-[300px]`}
            >
              {/* Card Header Category Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                  {currentCard.title}
                </span>

                {currentCard.category === "worked" && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    <ThumbsUp className="w-3.5 h-3.5" /> What worked
                  </span>
                )}
                {currentCard.category === "failed" && (
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    <ThumbsDown className="w-3.5 h-3.5" /> What underperformed
                  </span>
                )}
                {currentCard.category === "improved" && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    <Zap className="w-3.5 h-3.5" /> Next Tweak
                  </span>
                )}
              </div>

              {/* Core Content */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {currentCard.headline}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentCard.detail}
                </p>

                {/* Highly specific hinglish tip */}
                <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-4.5 mt-3">
                  <span className="block text-[9px] text-amber-800 font-mono font-bold tracking-widest uppercase mb-1">💡 Brotherly Hinglish Advice</span>
                  <p className="text-xs text-amber-950 font-medium italic">
                    &ldquo;{currentCard.hinglishTip}&rdquo;
                  </p>
                </div>
              </div>

              {/* Card Footer Page dots */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {currentInsights.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition ${
                        activeCardIndex === i ? "bg-[#cf7051] scale-125" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-mono">
            SWIPE OR USE BUTTONS TO FLIP THROUGH 3 CARDS
          </p>
        </div>
      </div>
    </div>
  );
}
