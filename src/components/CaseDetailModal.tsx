import { CaseData } from "@/lib/LinkedList";
import { useCases } from "@/context/CaseContext";
import { useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertTriangle, CheckCircle, User, Calendar, FileText, Link2,
  Shield, Clock, Tag, Activity, ChevronRight, Download, Loader2, FileSpreadsheet,
} from "lucide-react";
import { generateInvestigationReportPDF } from "@/lib/pdfExporter";
import { toast } from "sonner";

interface CaseDetailModalProps {
  caseData: CaseData | null;
  open: boolean;
  onClose: () => void;
  onOpenReport?: (caseData: CaseData) => void;
}

type Tab = "overview" | "related" | "timeline";

const priorityColors: Record<string, { dot: string; text: string; bg: string }> = {
  High: { dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10" },
  Medium: { dot: "bg-primary", text: "text-primary", bg: "bg-primary/10" },
  Low: { dot: "bg-intel-emerald", text: "text-emerald", bg: "bg-intel-emerald/10" },
};

export default function CaseDetailModal({ caseData, open, onClose, onOpenReport }: CaseDetailModalProps) {
  const { findRelatedCases, updateCase, cases } = useCases();
  const [tab, setTab] = useState<Tab>("overview");
  const [isExporting, setIsExporting] = useState(false);

  const related = useMemo(() => {
    if (!caseData) return [];
    return findRelatedCases(caseData.caseId);
  }, [caseData, findRelatedCases, cases]);

  if (!caseData) return null;

  const { caseId, title, description, priority, status, suspectName, date } = caseData;
  const pCfg = priorityColors[priority];
  const dateFormatted = new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "related", label: "Related Cases", count: related.length },
    { key: "timeline", label: "Activity" },
  ];

  const toggleStatus = () => {
    updateCase(caseId, { status: status === "Open" ? "Closed" : "Open" });
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await generateInvestigationReportPDF({
        caseData,
        relatedCases: related,
        includeTimeline: true,
      });
      toast.success(`Investigation report exported successfully!`);
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export investigation report");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenFullReport = () => {
    onClose();
    if (onOpenReport) onOpenReport(caseData);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-card border-border overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-muted-foreground">{caseId}</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${pCfg.bg} ${pCfg.text} border-current/20`}>
                {priority === "High" && <AlertTriangle size={9} />}
                {priority === "High" ? "Critical" : priority === "Medium" ? "Moderate" : "Low Risk"}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-md ${
                status === "Open"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}>
                {status === "Open" ? <span className="h-1.5 w-1.5 rounded-full bg-accent" /> : <CheckCircle size={9} />}
                {status}
              </span>
            </div>
            <DialogTitle className="font-display text-lg font-semibold tracking-tight pr-8">{title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">{description}</DialogDescription>
          </DialogHeader>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">{t.count}</span>
              )}
              {tab === t.key && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-6 py-5 overflow-y-auto max-h-[50vh]">
          {tab === "overview" && (
            <div className="space-y-5">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoField icon={User} label="Suspect" value={suspectName} />
                <InfoField icon={Calendar} label="Date Filed" value={dateFormatted} />
                <InfoField icon={Tag} label="Priority Level" value={priority === "High" ? "Critical" : priority === "Medium" ? "Moderate" : "Low Risk"} valueClass={pCfg.text} />
                <InfoField icon={Activity} label="Status" value={status === "Open" ? "Active Investigation" : "Case Resolved"} valueClass={status === "Open" ? "text-accent" : "text-muted-foreground"} />
              </div>

              {/* Evidence summary */}
              <div className="rounded-xl border border-border bg-secondary/30 p-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <FileText size={14} className="text-primary" />
                  Case Summary
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield size={11} /> Classification: {priority}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> Filed: {new Date(date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={toggleStatus} className="intel-btn-primary flex-1 justify-center">
                  {status === "Open" ? (
                    <><CheckCircle size={14} /> Mark as Resolved</>
                  ) : (
                    <><Activity size={14} /> Reopen Case</>
                  )}
                </button>
                <button 
                  onClick={handleOpenFullReport}
                  className="intel-btn flex-1 justify-center bg-primary text-primary-foreground font-semibold"
                >
                  <FileSpreadsheet size={14} /> Generate Case Report
                </button>
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="intel-btn flex-1 justify-center"
                >
                  {isExporting ? (
                    <><Loader2 size={14} className="animate-spin" /> Exporting...</>
                  ) : (
                    <><Download size={14} /> Download PDF</>
                  )}
                </button>
              </div>
            </div>
          )}

          {tab === "related" && (
            <div className="space-y-3">
              {related.length === 0 ? (
                <div className="text-center py-8">
                  <Link2 size={24} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No related cases found</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">The recursive search returned no linked nodes</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Found {related.length} case{related.length !== 1 ? "s" : ""} connected via suspect or keyword analysis
                  </p>
                  {related.map((r, i) => {
                    const rCfg = priorityColors[r.priority];
                    return (
                      <div
                        key={r.caseId}
                        className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3.5 hover:border-primary/20 transition-colors animate-fade-in"
                        style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                      >
                        <div className={`h-2 w-2 rounded-full ${rCfg.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[11px] text-muted-foreground">{r.caseId}</span>
                            <span className={`text-[10px] font-medium ${rCfg.text}`}>{r.priority}</span>
                          </div>
                          <p className="text-sm text-foreground truncate">{r.title}</p>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{r.suspectName}</span>
                        <ChevronRight size={14} className="text-muted-foreground/40" />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {tab === "timeline" && (
            <div className="space-y-4">
              <div className="relative ml-3 border-l-2 border-border pl-6 space-y-6">
                <TimelineEntry
                  time={dateFormatted}
                  title="Case Filed"
                  description={`Case ${caseId} was created and assigned priority level: ${priority}`}
                  dot="bg-primary"
                />
                <TimelineEntry
                  time={dateFormatted}
                  title="Suspect Identified"
                  description={`Primary suspect "${suspectName}" linked to this investigation`}
                  dot="bg-intel-amber"
                />
                {status === "Closed" && (
                  <TimelineEntry
                    time="Recent"
                    title="Case Resolved"
                    description="Investigation concluded — case marked as closed"
                    dot="bg-intel-emerald"
                  />
                )}
                <TimelineEntry
                  time="Now"
                  title="Under Review"
                  description={`Case currently ${status === "Open" ? "under active investigation" : "archived in system"}`}
                  dot={status === "Open" ? "bg-accent" : "bg-muted-foreground"}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoField({ icon: Icon, label, value, valueClass }: { icon: React.ElementType; label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={12} className="text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <p className={`text-sm font-medium ${valueClass || "text-foreground"}`}>{value}</p>
    </div>
  );
}

function TimelineEntry({ time, title, description, dot }: { time: string; title: string; description: string; dot: string }) {
  return (
    <div className="relative">
      <div className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ${dot} border-2 border-card`} />
      <p className="text-[11px] text-muted-foreground mb-0.5">{time}</p>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}
