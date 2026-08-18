import { useState } from "react";
import { MaxHeap, MinHeap } from "@/dsa/heap/Heap";
import { useCases } from "@/context/CaseContext";
import { Layers } from "lucide-react";

export default function HeapModule() {
  const { cases } = useCases();
  const [heap] = useState(() => {
    const h = new MaxHeap<string>();
    cases.forEach((c) => {
      const priorityVal = c.priority === "High" ? 3 : c.priority === "Medium" ? 2 : 1;
      h.insert(priorityVal, `${c.caseId}: ${c.title}`);
    });
    return h;
  });

  const [, setTick] = useState(0);

  const handleExtract = () => {
    heap.extractMax();
    setTick((t) => t + 1);
  };

  const heapArray = heap.toArray();
  const topMax = heap.peekMax();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Priority Queue & Heap Module</h3>
        <p className="text-xs text-muted-foreground">Binary Heap Array • Priority Management • O(1) Peek Max • O(log n) Extract</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Heap Size</span>
          <span className="font-bold text-2xl text-primary font-display">{heap.size()}</span>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Highest Priority Root</span>
          <span className="font-bold text-sm text-emerald font-mono truncate block">{topMax ? topMax.data : "Empty"}</span>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border flex items-center">
          <button onClick={handleExtract} className="intel-btn-primary text-xs w-full">Extract Highest Priority (O(log n))</button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Heap Binary Tree Array Representation</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {heapArray.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-secondary border border-border space-y-1">
              <div className="flex justify-between items-center text-primary font-bold">
                <span>Node [{idx}]</span>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-[10px]">Priority Weight: {item.key}</span>
              </div>
              <p className="text-foreground truncate font-sans text-xs">{item.data}</p>
              <div className="text-[10px] text-muted-foreground flex justify-between pt-1 border-t border-border">
                <span>Left: {2 * idx + 1 < heapArray.length ? `[${2 * idx + 1}]` : "null"}</span>
                <span>Right: {2 * idx + 2 < heapArray.length ? `[${2 * idx + 2}]` : "null"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
