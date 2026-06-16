import React from "react";
import { SavedProject } from "../types";
import { FolderOpen, Trash2, Calendar, FileText, ChevronRight, HardDrive } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { soundManager } from "../utils/sound";

interface ProjectHistoryProps {
  projects: SavedProject[];
  onSelect: (project: SavedProject) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export default function ProjectHistory({ projects, onSelect, onDelete, selectedId }: ProjectHistoryProps) {
  if (projects.length === 0) {
    return (
      <div className="bg-[#141416]/95 border border-[#232225] rounded-2xl p-6 text-center shadow-inner">
        <HardDrive className="w-8 h-8 text-[#9ca69b] mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-[#e8dfd8]">No Saved Packages Yet</h4>
        <p className="text-xs text-[#9ca69b] mt-1 max-w-xs mx-auto leading-relaxed">
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
                  ? "bg-[#cf7051]/20 border-[#cf7051] shadow-lg shadow-[#cf7051]/5"
                  : "bg-[#141416]/95 hover:bg-[#1c1b1e] border-[#232225]"
              }`}
            >
              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelect(project);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className="flex-1 text-left flex items-start gap-3 focus:outline-none cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${isSelected ? "bg-[#cf7051] text-white" : "bg-[#202022] text-[#9ca69b] group-hover:text-white"} transition`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-[#e8dfd8] truncate group-hover:text-white transition">
                    {project.name || "Untitled Transform"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[9px] text-[#9ca69b] font-mono">
                      <Calendar className="w-3 h-3 text-[#9ca69b]" />
                      {formattedDate}
                    </span>
                    <span className="text-gray-800">•</span>
                    <span className="inline-flex items-center text-[9px] text-[#cca972] font-semibold uppercase tracking-wider">
                      {project.config.niche}
                    </span>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2 pl-3">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onSelect(project);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? "bg-[#cf7051] hover:bg-[#c06041] text-white border-[#cf7051]"
                      : "bg-[#202022] hover:bg-[#2c2c2f] text-[#cca972] hover:text-white border-[#2e2c2a]"
                  }`}
                  title="Open transform package"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onDelete(project.id);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className="p-1.5 rounded-lg bg-[#202022] hover:bg-red-950/40 text-gray-500 hover:text-red-400 border border-transparent hover:border-red-900/40 transition cursor-pointer"
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
