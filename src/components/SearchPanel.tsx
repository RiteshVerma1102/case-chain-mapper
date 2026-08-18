import { useState, useEffect } from "react";
import { useCases } from "@/context/CaseContext";
import { Search, Loader2, X, Filter } from "lucide-react";
import CaseCard from "./CaseCard";
import CaseDetailModal from "./CaseDetailModal";
import { CaseData, Priority, Status } from "@/lib/LinkedList";

export default function SearchPanel() {
  const { cases, advancedSearch, deleteCase } = useCases();
  const [keyword, setKeyword] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [status, setStatus] = useState<Status | "">("");
  const [results, setResults] = useState<CaseData[]>(cases);
  const [searching, setSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);

  useEffect(() => {
    setResults(cases);
  }, [cases]);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      if (!keyword.trim() && !priority && !status) {
        setResults(cases);
      } else {
        setResults(advancedSearch({ keyword: keyword.trim() || undefined, priority: priority || undefined, status: status || undefined }));
      }
      setSearching(false);
    }, 200);
  };

  const clearFilters = () => {
    setKeyword("");
    setPriority("");
    setStatus("");
    setResults(cases);
  };

  const hasFilters = keyword || priority || status;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8 font-sans pb-16">
      {/* Editorial Header */}
      <div>
        <h2 className="font-display text-4xl font-bold tracking-tight text-[#1D1D1F]">Cases</h2>
        <p className="text-lg text-[#6E6E73] mt-1">Every investigation. One clear view.</p>
      </div>

      {/* Search Input Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E73]" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by case ID, title, keyword, or suspect name..."
            className="intel-input pl-11 text-base shadow-sm"
          />
        </div>
        <button onClick={handleSearch} disabled={searching} className="intel-btn-primary px-6 text-sm">
          {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-black/5 p-4 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#6E6E73] uppercase tracking-wider flex items-center gap-1.5">
            <Filter size={13} className="text-[#0071E3]" /> Filter Priority:
          </span>
          <div className="flex rounded-full bg-[#F5F5F7] p-1 border border-black/5 text-xs">
            {(["", "High", "Medium", "Low"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p as Priority | "")}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  priority === p ? "bg-[#0071E3] text-white font-semibold shadow-sm" : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                {p || "All"}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-black/10 hidden sm:block" />

          <span className="text-xs font-bold text-[#6E6E73] uppercase tracking-wider hidden sm:inline">Status:</span>
          <div className="flex rounded-full bg-[#F5F5F7] p-1 border border-black/5 text-xs">
            {(["", "Open", "Closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s as Status | "")}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  status === s ? "bg-[#0071E3] text-white font-semibold shadow-sm" : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-[#E53935] font-semibold hover:underline flex items-center gap-1">
            <X size={13} /> Reset Filters
          </button>
        )}
      </div>

      {/* Case Grid */}
      <div className="space-y-4">
        <p className="text-xs text-[#6E6E73] font-mono">Showing {results.length} investigation file{results.length !== 1 ? "s" : ""}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((c, i) => (
            <CaseCard key={c.caseId} caseData={c} index={i} onDelete={deleteCase} onSelect={setSelectedCase} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="rounded-3xl bg-white border border-black/5 p-16 text-center space-y-2">
            <Search size={32} className="mx-auto text-[#6E6E73]" />
            <p className="text-base font-semibold text-[#1D1D1F]">No cases found matching your search</p>
            <p className="text-xs text-[#6E6E73]">Try searching with a different keyword or resetting filters.</p>
          </div>
        )}
      </div>

      <CaseDetailModal caseData={selectedCase} open={!!selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
