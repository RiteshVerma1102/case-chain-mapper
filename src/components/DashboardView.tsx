import { useCases } from "@/context/CaseContext";
import CaseCard from "./CaseCard";
import CaseDetailModal from "./CaseDetailModal";
import { ArrowRight, Clock, ArrowUpDown, Shield, AlertTriangle, Layers, Cpu, Network, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { CaseData } from "@/lib/LinkedList";

export default function DashboardView() {
  const { cases, deleteCase, sortByPriority, sortByDate, listSize, analyzePatterns } = useCases();
  const [filter, setFilter] = useState<"all" | "Open" | "Closed">("all");
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const analysis = useMemo(() => analyzePatterns(), [analyzePatterns, cases]);

  const filtered = filter === "all" ? cases : cases.filter((c) => c.status === filter);
  const critical = cases.find((c) => c.priority === "High" && c.status === "Open");

  return (
    <div className="animate-fade-in space-y-16 max-w-6xl mx-auto font-sans pb-16">
      {/* SECTION 1: EDITORIAL HERO */}
      <div className="text-center py-12 space-y-6">
        <span className="font-mono text-xs font-semibold text-[#0071E3] tracking-widest uppercase bg-[#0071E3]/10 px-3 py-1 rounded-full">
          Digital Case Intelligence System
        </span>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1D1D1F] max-w-4xl mx-auto leading-[1.08]">
          Understand every connection.
        </h1>
        <p className="text-xl sm:text-2xl text-[#6E6E73] max-w-2xl mx-auto font-normal leading-relaxed">
          Everything connected to the case. In one place. Track suspects, map relationships, and solve cases with data structures.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="#cases-section"
            className="intel-btn-primary px-6 py-3.5 text-base rounded-full font-medium shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Explore Cases <ArrowRight size={16} />
          </a>
          <button
            onClick={() => sortByPriority()}
            className="px-6 py-3.5 text-base rounded-full font-medium bg-white text-[#1D1D1F] border border-black/10 hover:bg-[#F5F5F7] transition-all flex items-center gap-2"
          >
            <ArrowUpDown size={16} className="text-[#0071E3]" /> Sort by Priority
          </button>
        </div>
      </div>

      {/* STATS HIGHLIGHT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm text-center space-y-1">
          <p className="text-xs text-[#6E6E73] font-semibold uppercase tracking-wider">Active Nodes</p>
          <p className="font-display text-4xl font-bold text-[#1D1D1F]">{listSize}</p>
          <p className="text-xs text-[#6E6E73]">Singly Linked List</p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm text-center space-y-1">
          <p className="text-xs text-[#6E6E73] font-semibold uppercase tracking-wider">Under Investigation</p>
          <p className="font-display text-4xl font-bold text-[#0071E3]">{analysis.statusCounts.Open}</p>
          <p className="text-xs text-[#6E6E73]">Active Cases</p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm text-center space-y-1">
          <p className="text-xs text-[#6E6E73] font-semibold uppercase tracking-wider">Critical Priority</p>
          <p className="font-display text-4xl font-bold text-[#E53935]">{analysis.priorityCounts.High}</p>
          <p className="text-xs text-[#6E6E73]">High Priority</p>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm text-center space-y-1">
          <p className="text-xs text-[#6E6E73] font-semibold uppercase tracking-wider">Cases Resolved</p>
          <p className="font-display text-4xl font-bold text-[#2E7D32]">{analysis.statusCounts.Closed}</p>
          <p className="text-xs text-[#6E6E73]">Archived</p>
        </div>
      </div>

      {/* CRITICAL ALERT RESTRAINED */}
      {critical && (
        <div className="rounded-2xl bg-white border border-[#E53935]/30 p-5 flex items-center gap-4 shadow-sm">
          <div className="h-3 w-3 rounded-full bg-[#E53935] shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#E53935] uppercase tracking-wider">Critical Focus Case</p>
            <p className="text-sm font-semibold text-[#1D1D1F] truncate">
              {critical.caseId}: {critical.title} — Primary Suspect: {critical.suspectName}
            </p>
          </div>
          <button
            onClick={() => setSelectedCase(critical)}
            className="text-xs text-[#0071E3] font-semibold hover:underline"
          >
            Review Case →
          </button>
        </div>
      )}

      {/* SECTION 2: CASES SECTION */}
      <div id="cases-section" className="space-y-6 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/5 pb-4">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#1D1D1F]">
              Every investigation, organized.
            </h2>
            <p className="text-base text-[#6E6E73] mt-1">
              Filter by status or sort by date and priority.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={sortByDate} className="px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-xs font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] flex items-center gap-1.5">
              <Clock size={13} className="text-[#0071E3]" /> Sort by Date
            </button>
            <div className="flex rounded-full bg-white border border-black/10 p-1">
              {(["all", "Open", "Closed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all ${
                    filter === f ? "bg-[#0071E3] text-white font-semibold shadow-sm" : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                >
                  {f === "all" ? "All Cases" : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Case grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c, i) => (
            <CaseCard key={c.caseId} caseData={c} index={i} onDelete={deleteCase} onSelect={setSelectedCase} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl bg-white border border-black/5 p-12 text-center">
            <p className="text-base text-[#6E6E73]">No cases match the selected filter criteria.</p>
          </div>
        )}
      </div>

      {/* SECTION 3: DSA INTELLIGENCE OVERVIEW */}
      <div className="rounded-3xl bg-white border border-black/5 p-10 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[#0071E3]">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-[#1D1D1F]">Algorithms behind the investigation.</h3>
            <p className="text-sm text-[#6E6E73]">Core Data Structures & Algorithms executing live on case data.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/5 space-y-1">
            <span className="font-bold text-[#0071E3]">Singly Linked List</span>
            <p className="text-[#1D1D1F]">Primary case chain storage engine with merge sort.</p>
            <span className="font-mono text-[#6E6E73] block text-[11px]">Insertion O(1) • Sort O(n log n)</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/5 space-y-1">
            <span className="font-bold text-[#0071E3]">Adjacency Graph</span>
            <p className="text-[#1D1D1F]">Maps relationships between suspect networks.</p>
            <span className="font-mono text-[#6E6E73] block text-[11px]">BFS / DFS Traversal O(V + E)</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/5 space-y-1">
            <span className="font-bold text-[#0071E3]">Trie TrieNode</span>
            <p className="text-[#1D1D1F]">Live prefix search and autocomplete.</p>
            <span className="font-mono text-[#6E6E73] block text-[11px]">Search O(L)</span>
          </div>
        </div>
      </div>

      <CaseDetailModal caseData={selectedCase} open={!!selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
