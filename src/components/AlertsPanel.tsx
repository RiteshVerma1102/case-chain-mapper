import { useMemo } from "react";
import { useCases } from "@/context/CaseContext";
import { AlertTriangle, ShieldAlert, Info, Bell, ChevronRight, Siren } from "lucide-react";

export default function AlertsPanel() {
  const { generateAlerts, cases } = useCases();
  const alerts = useMemo(() => generateAlerts(), [generateAlerts, cases]);

  const typeConfig = {
    critical: { icon: Siren, border: "border-destructive/25", bg: "bg-destructive/5", headerBg: "bg-destructive/8", text: "text-destructive", dot: "bg-destructive", label: "Critical" },
    warning: { icon: AlertTriangle, border: "border-primary/25", bg: "bg-primary/5", headerBg: "bg-primary/8", text: "text-primary", dot: "bg-primary", label: "Warning" },
    info: { icon: Info, border: "border-accent/25", bg: "bg-accent/5", headerBg: "bg-accent/8", text: "text-accent", dot: "bg-accent", label: "Info" },
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Alert Center</h2>
          {alerts.length > 0 && (
            <span className="text-xs font-medium bg-destructive/10 text-destructive px-2.5 py-1 rounded-lg border border-destructive/20">
              {alerts.length} active
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Intelligent threat detection • Linked list analysis</p>
      </div>

      {alerts.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <ShieldAlert size={28} className="mx-auto text-emerald mb-3" />
          <p className="text-sm font-medium text-emerald">All Clear</p>
          <p className="text-xs text-muted-foreground mt-1">No active alerts detected</p>
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((alert, i) => {
          const cfg = typeConfig[alert.type];
          const Icon = cfg.icon;
          return (
            <div key={i} className={`rounded-xl border ${cfg.border} overflow-hidden animate-fade-in`} style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
              <div className={`${cfg.headerBg} px-5 py-4 flex items-center gap-3`}>
                <Icon size={18} className={cfg.text} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold tracking-wide ${cfg.text}`}>{cfg.label}</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${cfg.dot} animate-pulse-glow`} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                </div>
              </div>
              <div className={`${cfg.bg} px-5 py-4`}>
                <p className="text-sm text-foreground/80 mb-3">{alert.message}</p>
                {alert.relatedCases.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-medium">Related Cases:</span>
                    {alert.relatedCases.map(c => (
                      <div key={c.caseId} className="flex items-center gap-3 rounded-lg bg-card px-3 py-2.5 border border-border">
                        <ChevronRight size={11} className={cfg.text} />
                        <span className="font-mono text-xs text-muted-foreground">{c.caseId}</span>
                        <span className="text-sm text-foreground flex-1 truncate">{c.title}</span>
                        <span className="text-xs text-muted-foreground">{c.suspectName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
