import { useMemo, useState } from "react";
import { useCases } from "@/context/CaseContext";
import { Calendar, Clock, ChevronDown, ChevronUp, Layers } from "lucide-react";
import CaseDetailModal from "./CaseDetailModal";
import { CaseData } from "@/lib/LinkedList";

export default function TimelineView() {
  const { getTimeline, findRelatedCases } = useCases();
  const timeline = useMemo(() => getTimeline(), [getTimeline]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalCase, setModalCase] = useState<CaseData | null>(null);

  const priorityDot: Record<string, string> = { High: "bg-destructive", Medium: "bg-primary", Low: "bg-intel-emerald" };
  const priorityText: Record<string, string> = { High: "text-destructive", Medium: "text-primary", Low: "text-emerald" };

  const related = useMemo(() => {
    if (!expandedId) return [];
    return findRelatedCases(expandedId);
  }, [expandedId, findRelatedCases]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Case Timeline</h2>
        <p className="text-sm text-muted-foreground mt-1">Chronological view • Merge sort by date • {timeline.length} nodes</p>
      </div>

      <div className="relative ml-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-border to-transparent rounded-full" />

        <div className="space-y-2">
          {timeline.map((c, i) => {
            const isExpanded = expandedId === c.caseId;
            const dateStr = new Date(c.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

            return (
              <div key={c.caseId} className="relative pl-8 animate-fade-in" style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
                <div className={`absolute left-[-5px] top-5 h-3 w-3 rounded-full border-2 border-card ${priorityDot[c.priority]}`} />
                <div className="absolute left-[8px] top-[22px] w-4 h-px bg-border" />

                <button
                  onClick={() => setExpandedId(isExpanded ? null : c.caseId)}
                  className={`w-full text-left rounded-xl border p-4 transition-all hover:translate-x-1 ${
                    isExpanded ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{c.caseId}</span>
                      {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground mb-1">{c.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${priorityDot[c.priority]}`} />
                        <span className={`text-[10px] font-medium ${priorityText[c.priority]}`}>{c.priority}</span>
                      </div>
                      <span className={`text-[10px] font-medium ${c.status === "Open" ? "text-accent" : "text-muted-foreground"}`}>
                        {c.status === "Open" ? "● Open" : "○ Closed"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                    <span className="text-xs text-foreground/70">Suspect: {c.suspectName}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    <button onClick={() => setModalCase(c)} className="w-full text-left intel-btn-primary text-xs justify-center">
                      View Full Report
                    </button>
                    {related.length > 0 && (
                      <div className="ml-4 p-4 rounded-xl border border-primary/15 bg-primary/5 animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers size={12} className="text-primary" />
                          <span className="text-xs font-semibold text-primary">Related Cases</span>
                        </div>
                        <div className="space-y-2">
                          {related.map(r => (
                            <div key={r.caseId} className="flex items-center gap-3 rounded-lg bg-card px-3 py-2.5 border border-border cursor-pointer hover:border-primary/20 transition-colors"
                              onClick={() => setModalCase(r)}>
                              <div className={`h-2 w-2 rounded-full ${priorityDot[r.priority]}`} />
                              <span className="font-mono text-xs text-muted-foreground">{r.caseId}</span>
                              <span className="text-sm text-foreground flex-1">{r.title}</span>
                              <span className="text-xs text-muted-foreground">{r.suspectName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CaseDetailModal caseData={modalCase} open={!!modalCase} onClose={() => setModalCase(null)} />
    </div>
  );
}
