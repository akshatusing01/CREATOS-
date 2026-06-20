import React from "react";
import { History, ChevronRight, FileText, Download, Copy, Calendar, Sparkles, Trash2 } from "lucide-react";
import { CreatorIntelligenceReport } from "../../types";
import { soundManager } from "../../utils/sound";

interface HistoryVaultProps {
  history: CreatorIntelligenceReport[];
  activeReportId?: string;
  onSelectReport: (report: CreatorIntelligenceReport) => void;
  onExportMarkdown: (report: CreatorIntelligenceReport) => void;
  onDeleteReport: (id: string) => void;
}

export const HistoryVault: React.FC<HistoryVaultProps> = ({
  history = [],
  activeReportId,
  onSelectReport,
  onExportMarkdown,
  onDeleteReport
}) => {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  if (history.length === 0) return null;

  return (
    <div id="HistoricVaultAccordion" className="bg-[#0b0a0c]/40 border border-[#1b1a1c] rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-[#1b1a1c]">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#cca972] opacity-75" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#cca972] font-display">Archived Strategy Vault</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Retrace past dynamic diagnoses, structural grades, and script versions.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {history.map((report) => {
          const isActive = report.id === activeReportId;
          const formattedDate = new Date(report.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <div
              key={report.id}
              className={`p-3 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#cca972]/5 border-[#cca972]/30 hover:border-[#cca972]/40"
                  : "bg-[#141416]/45 border-[#232225] hover:border-[#3a393d]"
              }`}
              onClick={() => {
                soundManager.playClick();
                onSelectReport(report);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isActive ? "bg-[#cca972]/15 text-[#cca972]" : "bg-[#1b1a1c] text-slate-500"}`}>
                  <FileText className="w-4 h-4" />
                </div>
                
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-sans">{report.title || "Evaluation Diagnostics"}</span>
                    <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-black/40 text-[#cca972] border border-[#302e32] font-sans">
                      {report.mode.replace(/_/g, " ")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 opacity-70" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span>Score: <span className="text-slate-350 font-bold font-mono">{report.scores.overall.score}%</span></span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center" onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onExportMarkdown(report);
                  }}
                  className="flex items-center gap-1 text-[9px] uppercase font-semibold text-slate-400 hover:text-[#cca972] px-2.5 py-1.5 rounded bg-black/20 hover:bg-[#1b1a1c] border border-[#232225] transition duration-200 cursor-pointer"
                  title="Export Report to Markdown file"
                >
                  <Download className="w-3 h-3" />
                  <span>MD</span>
                </button>

                {deletingId === report.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playSparkle();
                        onDeleteReport(report.id);
                        setDeletingId(null);
                      }}
                      className="text-[10px] text-white bg-rose-600 hover:bg-rose-500 font-bold px-2 py-1 rounded cursor-pointer transition duration-150"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClick();
                        setDeletingId(null);
                      }}
                      className="text-[10px] text-slate-400 bg-slate-800 hover:bg-slate-700 font-bold px-2 py-1 rounded cursor-pointer transition duration-150"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      setDeletingId(report.id);
                    }}
                    className="flex items-center justify-center p-1.5 rounded text-rose-400 hover:text-rose-300 bg-rose-950/10 hover:bg-rose-950/35 border border-rose-900/30 hover:border-rose-900/50 transition duration-200 cursor-pointer"
                    title="Delete this report"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectReport(report);
                  }}
                  className={`p-1.5 rounded transition duration-200 cursor-pointer ${
                    isActive ? "text-[#cca972] bg-[#cca972]/10" : "text-slate-500 hover:text-white bg-black/15"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
