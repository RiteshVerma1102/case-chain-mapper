import { useState } from "react";
import { useCases } from "@/context/CaseContext";
import { Search, Loader2, X } from "lucide-react";
import CaseCard from "./CaseCard";
import CaseDetailModal from "./CaseDetailModal";
import { CaseData, Priority, Status } from "@/lib/LinkedList";

export default function SearchPanel() {
  const { advancedSearch, deleteCase } = useCases();
  const [keyword, setKeyword] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [status, setStatus] = useState<Status | "">("");
  const [results, setResults] = useState<CaseData[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);

  const handleSearch = () => {
    if (!keyword.trim() && !priority && !status) return;
    setSearching(true);
    setTimeout(() => {
      setResults(advancedSearch({ keyword: keyword.trim() || undefined, priority: priority || undefined, status: status || undefined }));
      setSearched(true);
      setSearching(false);
    }, 300);
  };

  const clearFilters = () => { setKeyword(""); setPriority(""); setStatus(""); setResults([]); setSearched(false); };
  const hasFilters = keyword || priority || status;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Advanced Search</h2>
        <p className="text-sm text-muted-foreground mt-1">Recursive multi-criteria traversal • Combined filtering</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search by keyword, suspect, or case title..." className="intel-input pl-10" />
        </div>
        <button onClick={handleSearch} disabled={searching || !hasFilters} className="intel-btn-primary text-sm disabled:opacity-40">
          {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-xs text-muted-foreground">Filters:</span>

        <div className="flex rounded-xl overflow-hidden border border-border">
          {(["", "High", "Medium", "Low"] as const).map((p) => (
            <button key={p} onClick={() => setPriority(p as Priority | "")}
              className={`px-3 py-2 text-xs font-medium transition-all ${
                priority === p
                  ? p === "High" ? "bg-destructive/10 text-destructive" : p === "Medium" ? "bg-primary/10 text-primary" : p === "Low" ? "bg-intel-emerald/10 text-emerald" : "bg-primary/10 text-primary"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {p || "All"}
            </button>
          ))}
        </div>

        <div className="flex rounded-xl overflow-hidden border border-border">
          {(["", "Open", "Closed"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s as Status | "")}
              className={`px-3 py-2 text-xs font-medium transition-all ${
                status === s ? "bg-primary/10 text-primary" : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {searched && (
        <div className="animate-fade-in">
          <p className="text-sm text-muted-foreground mb-4">{results.length} match{results.length !== 1 ? "es" : ""} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((c, i) => (
              <CaseCard key={c.caseId} caseData={c} index={i} onDelete={deleteCase} onSelect={setSelectedCase} />
            ))}
          </div>
          {results.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <Search size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No cases match the search criteria</p>
            </div>
          )}
        </div>
      )}

      <CaseDetailModal caseData={selectedCase} open={!!selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}
