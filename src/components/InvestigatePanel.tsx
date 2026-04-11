import { useState, useMemo } from "react";
import { useCases } from "@/context/CaseContext";
import { UserSearch, Link2, Fingerprint, ArrowRight, Layers, GitBranch, Loader2 } from "lucide-react";
import CaseCard from "./CaseCard";
import CaseDetailModal from "./CaseDetailModal";
import { CaseData } from "@/lib/LinkedList";

export default function InvestigatePanel() {
  const { findBySuspect, findRelatedCases, buildRelationshipGraph } = useCases();
  const [suspect, setSuspect] = useState("");
  const [chain, setChain] = useState<CaseData[]>([]);
  const [searched, setSearched] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [modalCase, setModalCase] = useState<CaseData | null>(null);

  const investigate = () => {
    if (!suspect.trim()) return;
    setScanning(true);
    setSearched(false);
    setSelectedCaseId(null);
    setTimeout(() => {
      setChain(findBySuspect(suspect.trim()));
      setSearched(true);
      setScanning(false);
    }, 500);
  };

  const related = useMemo(() => {
    if (!selectedCaseId) return [];
    return findRelatedCases(selectedCaseId);
  }, [selectedCaseId, findRelatedCases]);

  const graph = useMemo(() => buildRelationshipGraph(), [buildRelationshipGraph]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Investigate</h2>
        <p className="text-sm text-muted-foreground mt-1">Recursive suspect traversal • Case linking engine</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <UserSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={suspect} onChange={(e) => setSuspect(e.target.value)} onKeyDown={(e) => e.key === "Enter" && investigate()} placeholder="Enter suspect name (e.g. Marcus Webb)..." className="intel-input pl-10" />
        </div>
        <button onClick={investigate} disabled={scanning}
          className="intel-btn-primary text-sm"
          style={{ borderColor: 'hsl(var(--violet) / 0.3)', background: 'hsl(var(--violet) / 0.1)', color: 'hsl(var(--violet))' }}
        >
          {scanning ? <Loader2 size={14} className="animate-spin" /> : <Fingerprint size={14} />}
          {scanning ? "Scanning..." : "Investigate"}
        </button>
      </div>

      {/* Scanning state */}
      {scanning && (
        <div className="rounded-xl border border-border bg-card p-12 text-center animate-fade-in">
          <Loader2 size={28} className="mx-auto text-violet animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Scanning linked list nodes...</p>
        </div>
      )}

      {searched && chain.length > 0 && (
        <div className="animate-fade-in space-y-5">
          <div className="flex items-center gap-2">
            <Link2 size={15} className="text-violet" />
            <span className="text-sm font-semibold text-violet">{chain.length} linked case{chain.length !== 1 ? "s" : ""} detected</span>
          </div>

          {/* Chain visualization */}
          <div className="space-y-0">
            {chain.map((c, i) => (
              <div key={c.caseId}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 w-6 rounded-lg bg-violet/10 border border-violet/20 flex items-center justify-center">
                    <span className="text-[10px] text-violet font-bold">{i + 1}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Node [{i}] → {c.caseId}</span>
                  <button
                    onClick={() => setSelectedCaseId(selectedCaseId === c.caseId ? null : c.caseId)}
                    className={`ml-auto text-xs px-3 py-1.5 rounded-lg transition-all ${
                      selectedCaseId === c.caseId
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent"
                    }`}
                  >
                    <Layers size={10} className="inline mr-1" /> Related
                  </button>
                </div>

                <div className="animate-chain-reveal" style={{ animationDelay: `${i * 200}ms`, opacity: 0 }}>
                  <CaseCard caseData={c} index={0} showDelete={false} onSelect={setModalCase} />
                </div>

                {/* Related cases inline */}
                {selectedCaseId === c.caseId && related.length > 0 && (
                  <div className="mt-3 ml-6 p-4 rounded-xl border border-primary/15 bg-primary/5 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <GitBranch size={13} className="text-primary" />
                      <span className="text-xs font-semibold text-primary">Smart Recommendations ({related.length})</span>
                    </div>
                    <div className="space-y-2">
                      {related.map(r => (
                        <div key={r.caseId} className="flex items-center gap-3 rounded-lg bg-card px-3 py-2.5 border border-border cursor-pointer hover:border-primary/20 transition-colors"
                          onClick={() => setModalCase(r)}>
                          <div className={`h-2 w-2 rounded-full ${r.priority === "High" ? "bg-destructive" : r.priority === "Medium" ? "bg-primary" : "bg-intel-emerald"}`} />
                          <span className="font-mono text-[11px] text-muted-foreground">{r.caseId}</span>
                          <span className="text-sm text-foreground flex-1 truncate">{r.title}</span>
                          <span className="text-xs text-muted-foreground">{r.suspectName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {i < chain.length - 1 && (
                  <div className="flex items-center justify-center py-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-4 w-px bg-violet/20" />
                      <Link2 size={12} className="text-violet/40" />
                      <div className="h-4 w-px bg-violet/20" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="bg-secondary/50 px-5 py-3 border-b border-border flex items-center gap-2">
              <Fingerprint size={14} className="text-violet" />
              <span className="text-sm font-semibold text-foreground">Investigation Report</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{chain.length}</p>
                  <p className="text-xs text-muted-foreground">Linked Cases</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-destructive">{chain.filter(c => c.priority === "High").length}</p>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-accent">{chain.filter(c => c.status === "Open").length}</p>
                  <p className="text-xs text-muted-foreground">Open Cases</p>
                </div>
              </div>
              {chain.length >= 3 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-primary flex items-center gap-2">
                    <ArrowRight size={12} /> Pattern Alert: Suspect linked to {chain.length}+ cases — recommend escalation
                  </p>
                </div>
              )}
              {graph.connections.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch size={13} className="text-violet" />
                    <span className="text-xs text-muted-foreground">{graph.connections.length} connections mapped</span>
                  </div>
                  <div className="space-y-1.5">
                    {graph.connections.slice(0, 5).map((conn, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="text-primary font-mono">{conn.from}</span>
                        <span className={conn.strength === "strong" ? "text-destructive" : "text-primary"}>
                          ——{conn.strength === "strong" ? "▶▶" : "—▶"}——
                        </span>
                        <span className="text-primary font-mono">{conn.to}</span>
                        <span className="text-muted-foreground/50 ml-auto">via {conn.suspect}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {searched && chain.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center animate-fade-in">
          <UserSearch size={24} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No cases linked to this suspect</p>
        </div>
      )}

      <CaseDetailModal caseData={modalCase} open={!!modalCase} onClose={() => setModalCase(null)} />
    </div>
  );
}
