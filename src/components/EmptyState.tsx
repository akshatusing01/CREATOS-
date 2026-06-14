import React from "react";
import { Sparkles, ClipboardList, PenTool, BrainCircuit } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  type: "no-input" | "no-saved" | "no-profile";
  onAction?: () => void;
  actionText?: string;
}

export default function EmptyState({ type, onAction, actionText }: EmptyStateProps) {
  const content = {
    "no-input": {
      title: "No Content Processed Yet",
      description: "Paste a raw script, rough idea, or simple topic in the control deck to activate CreatorOS Refactoring Engine.",
      icon: PenTool,
      accent: "from-blue-500 to-indigo-500",
    },
    "no-saved": {
      title: "No Saved Projects Found",
      description: "Your transformed content packages will appear here once you click \"Save Project\" in the result deck.",
      icon: ClipboardList,
      accent: "from-purple-500 to-pink-500",
    },
    "no-profile": {
      title: "Profile Memory Is Empty",
      description: "Configure your unique Creator Blueprint so CreatorOS can permanently tailor every script rewrite to your natural speaking voice.",
      icon: BrainCircuit,
      accent: "from-amber-400 to-orange-500",
    },
  };

  const current = content[type];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800/80 max-w-lg mx-auto"
    >
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${current.accent} bg-opacity-10 text-white mb-4 shadow-lg shadow-indigo-500/10`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-100 mb-2">{current.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6">{current.description}</p>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
