import { useCases } from "@/context/CaseContext";
import { ArrowRight, GitBranch, ShieldAlert } from "lucide-react";

export default function LinkedListModule() {
  const { cases, listSize, sortByPriority, sortByDate } = useCases();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Singly Linked List Engine</h3>
        <p className="text-xs text-muted-foreground">Main Case Storage • Merge Sort on Linked List • Head & Next Pointers • O(1) Head Insert</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Total Linked Nodes</span>
          <span className="font-display font-bold text-2xl text-primary">{listSize}</span>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Primary Sorting Algo</span>
          <span className="font-display font-bold text-lg text-accent">Merge Sort O(n log n)</span>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border flex items-center gap-2">
          <button onClick={sortByPriority} className="intel-btn-primary text-xs flex-1">MergeSort: Priority</button>
          <button onClick={sortByDate} className="intel-btn text-xs flex-1">MergeSort: Date</button>
        </div>
      </div>

      {/* Interactive Visual Linked List Nodes */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase">
          <GitBranch size={16} /> Linked List Node Pointer Visualizer (Head → Node → Null)
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2">
          {cases.map((c, i) => (
            <div key={c.caseId} className="flex items-center gap-3 flex-shrink-0">
              <div className="w-56 p-4 rounded-xl bg-secondary border border-border space-y-2 relative">
                {i === 0 && (
                  <span className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold">
                    HEAD POINTER
                  </span>
                )}
                <div className="flex justify-between items-center text-xs font-mono font-bold text-primary">
                  <span>{c.caseId}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] ${c.priority === "High" ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {c.priority}
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground truncate">{c.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">Suspect: {c.suspectName}</p>
                <div className="text-[10px] font-mono text-muted-foreground pt-1 border-t border-border flex justify-between">
                  <span>Next: {i === cases.length - 1 ? "NULL" : "0xNode"}</span>
                  <span>Data Node #{i + 1}</span>
                </div>
              </div>

              {i < cases.length - 1 ? (
                <ArrowRight size={20} className="text-primary flex-shrink-0" />
              ) : (
                <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono font-bold">
                  NULL
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
