import { useCases } from "@/context/CaseContext";
import CaseCard from "./CaseCard";
import CaseDetailModal from "./CaseDetailModal";
import { AlertTriangle, Clock, ArrowUpDown, Shield, Activity, Layers, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { CaseData } from "@/lib/LinkedList";

export default function DashboardView() {
  const { cases, deleteCase, sortByPriority, sortByDate, listSize, analyzePatterns } = useCases();
  const [filter, setFilter] = useState<"all" | "Open" | "Closed">("all");
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const analysis = useMemo(() => analyzePatterns(), [analyzePatterns, cases]);

  const filtered = filter === "all" ? cases : cases.filter((c) => c.status === filter);
  const critical = cases.find((c) => c.priority === "High" && c.status === "Open");

  const stats = [
    { label: "Total Cases", value: listSize, color: "text-primary", icon: Layers, accent: "border-primary/20" },
    { label: "Active", value: analysis.statusCounts.Open, color: "text-accent", icon: Eye, accent: "border-accent/20" },
    { label: "Critical", value: analysis.priorityCounts.High, color: "text-destructive", icon: AlertTriangle, accent: "border-destructive/20" },
    { label: "Resolved", value: analysis.statusCounts.Closed, color: "text-emerald", icon: Shield, accent: "border-intel-emerald/20" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Case Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Linked List Storage • {listSize} node{listSize !== 1 ? "s" : ""} active
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`metric-card ${s.accent} animate-fade-in`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} className={s.color} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Critical alert */}
      {critical && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 flex items-center gap-4 animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle size={18} className="text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-destructive mb-0.5">Critical Case Detected</p>
            <p className="text-sm text-muted-foreground truncate">
              {critical.caseId}: {critical.title} — {critical.suspectName}
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={sortByPriority} className="intel-btn text-xs">
          <ArrowUpDown size={13} /> Sort: Priority
        </button>
        <button onClick={sortByDate} className="intel-btn text-xs">
          <Clock size={13} /> Sort: Date
        </button>

        <div className="ml-auto flex rounded-xl overflow-hidden border border-border">
          {(["all", "Open", "Closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-medium transition-all ${
                filter === f
                  ? "bg-primary/10 text-primary"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Case grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <CaseCard key={c.caseId} caseData={c} index={i} onDelete={deleteCase} onSelect={setSelectedCase} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No cases match the current filter</p>
        </div>
      )}

      <CaseDetailModal caseData={selectedCase} open={!!selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
