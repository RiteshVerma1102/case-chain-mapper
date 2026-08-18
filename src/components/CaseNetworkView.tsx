import { useMemo, useState } from "react";
import { useCases } from "@/context/CaseContext";
import { Network, ChevronDown, ChevronUp, GitBranch } from "lucide-react";
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

  const totalConnections = suspectGroups.reduce((sum, [, g]) => sum + (g.length > 1 ? g.length : 0), 0);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8 font-sans pb-16">
      {/* Editorial Header */}
      <div>
        <h2 className="font-display text-4xl font-bold tracking-tight text-[#1D1D1F]">Case Network</h2>
        <p className="text-lg text-[#6E6E73] mt-1">See how investigations connect. {totalConnections} relationships mapped.</p>
      </div>

      {/* Suspect Node Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {suspectGroups.map(([suspect, group]) => (
          <button
            key={suspect}
            onClick={() => setExpandedSuspect(expandedSuspect === suspect ? null : suspect)}
            className={`flex-shrink-0 rounded-2xl px-4 py-3 transition-all border ${
              expandedSuspect === suspect
                ? "border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3] font-semibold"
                : "border-black/5 bg-white text-[#1D1D1F] hover:bg-[#F5F5F7]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-xs capitalize">
                {suspect[0]}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold capitalize leading-none">{suspect}</p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">{group.length} connected case{group.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Suspect Topology List */}
      <div className="space-y-4">
        {suspectGroups.map(([suspect, group], gi) => {
          const isExpanded = expandedSuspect === suspect || expandedSuspect === null;

          return (
            <div
              key={suspect}
              className={`rounded-3xl bg-white border border-black/5 overflow-hidden transition-all shadow-sm ${!isExpanded ? "opacity-40" : ""}`}
            >
              <button
                className="w-full flex items-center gap-4 px-6 py-5 bg-white hover:bg-[#F5F5F7] transition-colors"
                onClick={() => setExpandedSuspect(expandedSuspect === suspect ? null : suspect)}
              >
                <div className="h-10 w-10 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-sm uppercase">
                  {suspect[0]}
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-[#1D1D1F] capitalize">{suspect}</h3>
                  <p className="text-xs text-[#6E6E73]">{group.length} investigation node{group.length !== 1 ? "s" : ""}</p>
                </div>
                {group.length > 1 && (
                  <span className="rounded-full bg-[#0071E3]/10 px-3 py-1 text-xs font-semibold text-[#0071E3]">
                    Connected Pattern ({group.length})
                  </span>
                )}
                {expandedSuspect === suspect ? <ChevronUp size={18} className="text-[#6E6E73]" /> : <ChevronDown size={18} className="text-[#6E6E73]" />}
              </button>

              {isExpanded && (
                <div className="p-6 pt-2 border-t border-black/5 bg-[#F5F5F7]/50">
                  <div className="relative ml-4 border-l-2 border-[#0071E3]/30 pl-6 space-y-4">
                    {group.map((c) => (
                      <div
                        key={c.caseId}
                        className="relative cursor-pointer rounded-2xl bg-white border border-black/5 p-4 hover:shadow-md transition-all space-y-1"
                        onClick={() => setModalCase(c)}
                      >
                        <div className="absolute -left-[31px] top-4 h-3 w-3 rounded-full bg-[#0071E3] border-2 border-white" />
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-[#0071E3] font-bold">{c.caseId}</span>
                          <span className="text-xs font-semibold text-[#6E6E73]">{c.priority} Priority</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#1D1D1F]">{c.title}</h4>
                        <p className="text-xs text-[#6E6E73] line-clamp-1">{c.description}</p>
                      </div>
                    ))}
                  </div>
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
