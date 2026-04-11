import { useMemo, useState } from "react";
import { useCases } from "@/context/CaseContext";
import { Network, ChevronDown, ChevronUp } from "lucide-react";
import CaseDetailModal from "./CaseDetailModal";
import { CaseData } from "@/lib/LinkedList";

export default function CaseNetworkView() {
  const { cases } = useCases();
  const [expandedSuspect, setExpandedSuspect] = useState<string | null>(null);
  const [modalCase, setModalCase] = useState<CaseData | null>(null);

  const suspectGroups = useMemo(() => {
    const map = new Map<string, typeof cases>();
    for (const c of cases) {
      const key = c.suspectName.toLowerCase().trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [cases]);

  const priorityDot: Record<string, string> = { High: "bg-destructive", Medium: "bg-primary", Low: "bg-intel-emerald" };
  const priorityBorder: Record<string, string> = { High: "border-destructive/20", Medium: "border-primary/20", Low: "border-intel-emerald/20" };
  const totalConnections = suspectGroups.reduce((sum, [, g]) => sum + (g.length > 1 ? g.length : 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Case Network</h2>
        <p className="text-sm text-muted-foreground mt-1">Suspect-case topology • {totalConnections} connections mapped</p>
      </div>

      {/* Network chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {suspectGroups.map(([suspect, group]) => (
          <button key={suspect} onClick={() => setExpandedSuspect(expandedSuspect === suspect ? null : suspect)}
            className={`flex-shrink-0 rounded-xl px-4 py-2.5 transition-all border ${
              expandedSuspect === suspect ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:bg-muted"
            }`}>
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase ${
                group.length > 2 ? "bg-destructive/10 text-destructive border border-destructive/20" :
                group.length > 1 ? "bg-primary/10 text-primary border border-primary/20" :
                "bg-secondary text-muted-foreground border border-border"
              }`}>{suspect[0]}</div>
              <div className="text-left">
                <p className="text-xs text-foreground capitalize leading-none">{suspect}</p>
                <p className="text-[10px] text-muted-foreground">{group.length} case{group.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Network graph */}
      <div className="space-y-4">
        {suspectGroups.map(([suspect, group], gi) => {
          const isExpanded = expandedSuspect === suspect || expandedSuspect === null;
          const threatLevel = group.length >= 3 ? "High" : group.length >= 2 ? "Moderate" : "Low";
          const threatColor = group.length >= 3 ? "text-destructive" : group.length >= 2 ? "text-primary" : "text-emerald";

          return (
            <div key={suspect} className={`rounded-xl border border-border bg-card overflow-hidden animate-fade-in transition-all ${!isExpanded ? "opacity-40" : ""}`} style={{ animationDelay: `${gi * 60}ms` }}>
              <button className="w-full flex items-center gap-3 bg-secondary/30 px-5 py-4 hover:bg-secondary/50 transition-colors"
                onClick={() => setExpandedSuspect(expandedSuspect === suspect ? null : suspect)}>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold uppercase ${
                  group.length > 2 ? "bg-destructive/10 text-destructive border border-destructive/20" :
                  group.length > 1 ? "bg-primary/10 text-primary border border-primary/20" :
                  "bg-secondary text-muted-foreground border border-border"
                }`}>
                  {suspect[0]}
                  {group.length > 1 && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-card border border-border flex items-center justify-center text-[8px] text-foreground">{group.length}</span>
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-foreground capitalize">{suspect}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={threatColor}>Threat: {threatLevel}</span>
                    <span className="text-muted-foreground">• {group.length} node{group.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                {group.length > 1 && <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary border border-primary/15">Pattern</span>}
                {expandedSuspect === suspect ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </button>

              {isExpanded && (
                <div className="p-5">
                  <div className="relative ml-5 border-l-2 border-border pl-6 space-y-3">
                    {group.map((c, ci) => (
                      <div key={c.caseId} className="relative animate-slide-in cursor-pointer" style={{ animationDelay: `${ci * 80}ms`, opacity: 0 }}
                        onClick={() => setModalCase(c)}>
                        <div className={`absolute -left-[29px] top-3 h-3 w-3 rounded-full ${priorityDot[c.priority]} border-2 border-card`} />
                        <div className="absolute -left-[14px] top-[15px] w-3 h-px bg-border" />
                        <div className={`rounded-xl border ${priorityBorder[c.priority]} bg-secondary/30 p-4 hover:bg-secondary/50 transition-all`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-muted-foreground">{c.caseId}</span>
                              <div className="flex items-center gap-1">
                                <div className={`h-1.5 w-1.5 rounded-full ${priorityDot[c.priority]}`} />
                                <span className={`text-[10px] font-medium ${c.priority === "High" ? "text-destructive" : c.priority === "Medium" ? "text-primary" : "text-emerald"}`}>{c.priority}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-medium ${c.status === "Open" ? "text-accent" : "text-muted-foreground"}`}>
                              {c.status === "Open" ? "● Open" : "○ Closed"}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">{c.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {group.length > 1 && (
                    <div className="border-t border-border mt-4 pt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>High: {group.filter(c => c.priority === "High").length}</span>
                      <span>Open: {group.filter(c => c.status === "Open").length}</span>
                      <span>Span: {(() => { const dates = group.map(c => new Date(c.date).getTime()); return `${Math.round((Math.max(...dates) - Math.min(...dates)) / 86400000)} days`; })()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CaseDetailModal caseData={modalCase} open={!!modalCase} onClose={() => setModalCase(null)} />
    </div>
  );
}
