import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Fingerprint,
  UserSearch,
  Link2,
  ArrowRight,
  Layers,
  Loader2,
  ExternalLink,
  Shield,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileText,
  Network,
} from "lucide-react";
import { useCases } from "@/context/CaseContext";
import { CaseData } from "@/lib/LinkedList";

export default function Investigations() {
  const navigate = useNavigate();
  const { cases, findBySuspect, findRelatedCases } = useCases();

  const [suspectInput, setSuspectInput] = useState("Marcus Webb");
  const [chain, setChain] = useState<CaseData[]>([]);
  const [searched, setSearched] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const runInvestigation = () => {
    if (!suspectInput.trim()) return;
    setScanning(true);
    setSearched(false);
    setSelectedCaseId(null);

    setTimeout(() => {
      const results = findBySuspect(suspectInput.trim());
      setChain(results);
      setSearched(true);
      setScanning(false);
    }, 400);
  };

  const related = useMemo(() => {
    if (!selectedCaseId) return [];
    return findRelatedCases(selectedCaseId);
  }, [selectedCaseId, findRelatedCases]);

  // Initial trigger for demonstration
  useState(() => {
    runInvestigation();
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "Critical":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "High":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "Medium":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/6 pb-5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30 uppercase tracking-wider font-mono">
            Recursive Suspect Traversal Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
          Investigation Workspace
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Deep-dive analysis • Case chain link discovery • Algorithmic suspect scoring
        </p>
      </div>

      {/* Suspect Search Panel */}
      <div className="p-4 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.04] to-transparent space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <UserSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={suspectInput}
              onChange={(e) => setSuspectInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runInvestigation()}
              placeholder="Enter suspect name (e.g. Marcus Webb, Elena Vasquez, Jordan Blake)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-muted-foreground text-xs outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <button
            onClick={runInvestigation}
            disabled={scanning}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/20 flex-shrink-0"
          >
            {scanning ? <Loader2 size={15} className="animate-spin" /> : <Fingerprint size={15} />}
            <span>{scanning ? "Traversing..." : "Investigate Suspect"}</span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground text-[11px]">Repeat Suspects:</span>
          {["Marcus Webb", "Elena Vasquez", "Jordan Blake", "Kaelen Cross"].map((name) => (
            <button
              key={name}
              onClick={() => {
                setSuspectInput(name);
                setTimeout(() => runInvestigation(), 50);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Scanning State */}
      {scanning && (
        <div className="py-16 text-center rounded-2xl border border-white/6 bg-white/[0.02] space-y-3">
          <Loader2 size={32} className="mx-auto text-violet-400 animate-spin" />
          <h4 className="text-sm font-bold text-white">Traversing Linked List & Graph Nodes...</h4>
          <p className="text-xs text-muted-foreground">Scoring cross-case relationship vectors</p>
        </div>
      )}

      {/* Results / Case Chain Stream */}
      {!scanning && searched && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Link2 size={16} className="text-violet-400" />
              <span>
                {chain.length} Linked Case{chain.length !== 1 ? "s" : ""} Identified for "{suspectInput}"
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              O(n) Recursive Traversal
            </span>
          </div>

          {chain.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-white/6 bg-white/[0.02]">
              <p className="text-xs text-muted-foreground">
                No active cases found connected to "{suspectInput}".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chain.map((c, idx) => (
                <div
                  key={c.caseId}
                  className="rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent p-5 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center font-mono font-bold text-xs text-violet-300">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-violet-400">{c.caseId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(c.priority)}`}>
                            {c.priority}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">{c.category || "Investigation"}</span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">{c.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCaseId(selectedCaseId === c.caseId ? null : c.caseId)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedCaseId === c.caseId
                            ? "bg-violet-600 text-white border-violet-500"
                            : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                        }`}
                      >
                        <Layers size={13} className="inline mr-1 text-violet-400" />
                        <span>Related Cases</span>
                      </button>
                      <button
                        onClick={() => navigate(`/cases/${c.caseId}`)}
                        className="px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <span>Open Case</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-11">
                    {c.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-white/6 pl-11">
                    <div className="flex items-center gap-3">
                      <span>Investigator: <strong className="text-slate-300">{c.investigator || "Senior Inv."}</strong></span>
                      <span>•</span>
                      <span>Location: {c.location || "Metro District"}</span>
                    </div>
                    <span className="font-mono">{c.date}</span>
                  </div>

                  {/* Related Cases Injected View */}
                  {selectedCaseId === c.caseId && related.length > 0 && (
                    <div className="ml-11 mt-3 p-4 rounded-xl border border-violet-500/25 bg-violet-950/20 space-y-2 animate-fade-in">
                      <div className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                        <Layers size={13} />
                        <span>Cases Correlated with {c.caseId}:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {related.map((rc) => (
                          <div
                            key={rc.caseId}
                            onClick={() => navigate(`/cases/${rc.caseId}`)}
                            className="p-2.5 rounded-lg bg-black/40 border border-white/8 hover:border-violet-500/40 cursor-pointer space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-mono text-violet-400 font-bold">{rc.caseId}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getPriorityBadge(rc.priority)}`}>
                                {rc.priority}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-white truncate">{rc.title}</p>
                            <span className="text-[10px] text-muted-foreground block">Subject: {rc.suspectName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
