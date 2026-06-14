import React from "react";
import { SavedProject } from "../types";
import { FolderOpen, Trash2, Calendar, FileText, ChevronRight, HardDrive } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectHistoryProps {
  projects: SavedProject[];
  onSelect: (project: SavedProject) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export default function ProjectHistory({ projects, onSelect, onDelete, selectedId }: ProjectHistoryProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-gray-150/5 dark:bg-gray-900/40 border border-gray-800 rounded-2xl p-6 text-center">
        <HardDrive className="w-8 h-8 text-gray-500 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-gray-300">No Saved Packages Yet</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          Save your generated transforms inside the project builder. They are stored locally in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {projects.map((project) => {
          const isSelected = selectedId === project.id;
          const formattedDate = new Date(project.timestamp).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? "bg-indigo-600/25 border-indigo-500 shadow-lg shadow-indigo-600/5"
                  : "bg-gray-900/60 hover:bg-gray-800/60 border-gray-800"
              }`}
            >
              <button
                onClick={() => onSelect(project)}
                className="flex-1 text-left flex items-start gap-3 focus:outline-none"
              >
                <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-800 text-gray-400 group-hover:text-gray-200"} transition`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-gray-200 truncate group-hover:text-white transition">
                    {project.name || "Untitled Transform"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {formattedDate}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="inline-flex items-center text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                      {project.config.niche}
                    </span>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2 pl-3">
                <button
                  onClick={() => onSelect(project)}
                  className={`p-1.5 rounded-lg border transition ${
                    isSelected
                      ? "bg-indigo-500 hover:bg-indigo-400 text-white border-indigo-400"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 border-gray-700/80"
                  }`}
                  title="Open transform package"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-1.5 rounded-lg bg-gray-850 hover:bg-red-950/40 text-gray-500 hover:text-red-400 border border-transparent hover:border-red-900/50 transition"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
