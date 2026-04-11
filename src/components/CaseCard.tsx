import { CaseData } from "@/lib/LinkedList";
import { Trash2, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";

interface CaseCardProps {
  caseData: CaseData;
  onDelete?: (id: string) => void;
  onSelect?: (c: CaseData) => void;
  index?: number;
  showDelete?: boolean;
}

const priorityConfig: Record<string, { bar: string; badge: string; badgeText: string; label: string }> = {
  High: {
    bar: "bg-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    badgeText: "text-destructive",
    label: "Critical",
  },
  Medium: {
    bar: "bg-primary",
    badge: "bg-primary/10 text-primary border-primary/20",
    badgeText: "text-primary",
    label: "Moderate",
  },
  Low: {
    bar: "bg-intel-emerald",
    badge: "bg-intel-emerald/10 text-emerald border-intel-emerald/20",
    badgeText: "text-emerald",
    label: "Low Risk",
  },
};

export default function CaseCard({ caseData, onDelete, onSelect, index = 0, showDelete = true }: CaseCardProps) {
  const { caseId, title, description, priority, status, suspectName, date } = caseData;
  const config = priorityConfig[priority];

  return (
    <div
      className="group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
      onClick={() => onSelect?.(caseData)}
    >
      {/* Priority bar */}
      <div className={`priority-bar ${config.bar}`} />

      <div className="pl-5 pr-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-muted-foreground">{caseId}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${config.badge}`}>
              {priority === "High" && <AlertTriangle size={9} />}
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-md ${
              status === "Open"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "bg-muted text-muted-foreground border border-border"
            }`}>
              {status === "Open" ? (
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
              ) : (
                <CheckCircle size={9} />
              )}
              {status}
            </span>
            {showDelete && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(caseId); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground leading-tight mb-1.5">{title}</h3>

        {/* Description */}
        <p className="text-[12px] text-muted-foreground leading-relaxed mb-4 line-clamp-2">{description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center">
              <User size={11} className="text-muted-foreground" />
            </div>
            <span className="text-[12px] text-foreground/80">{suspectName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={11} />
            <span className="text-[11px]">
              {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
