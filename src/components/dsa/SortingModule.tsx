import { useState } from "react";
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, SortResult } from "@/dsa/sorting/SortingAlgorithms";
import { ArrowUpDown, Play } from "lucide-react";

export default function SortingModule() {
  const [arrayInput, setArrayInput] = useState("64, 34, 25, 12, 22, 11, 90");
  const [activeSort, setActiveSort] = useState("quick");

  const getNums = () => arrayInput.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));

  const runSort = (name: string): SortResult => {
    const nums = getNums();
    switch (name) {
      case "bubble": return bubbleSort(nums);
      case "selection": return selectionSort(nums);
      case "insertion": return insertionSort(nums);
      case "merge": return mergeSort(nums);
      case "quick": return quickSort(nums);
      case "heap": return heapSort(nums);
      default: return quickSort(nums);
    }
  };

  const result = runSort(activeSort);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Sorting Lab & Algorithm Comparison</h3>
        <p className="text-xs text-muted-foreground">Bubble • Selection • Insertion • Merge • Quick • Heap Sort (Real Swaps & Comparisons)</p>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Array to Sort</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {[
            { id: "bubble", name: "Bubble Sort" },
            { id: "selection", name: "Selection Sort" },
            { id: "insertion", name: "Insertion Sort" },
            { id: "merge", name: "Merge Sort" },
            { id: "quick", name: "Quick Sort" },
            { id: "heap", name: "Heap Sort" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSort(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSort === s.id ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-xs text-muted-foreground block">Comparisons</span>
          <span className="font-bold text-primary font-mono text-lg">{result.comparisons}</span>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-xs text-muted-foreground block">Swaps / Shifts</span>
          <span className="font-bold text-accent font-mono text-lg">{result.swaps}</span>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-xs text-muted-foreground block">Time Complexity (Avg)</span>
          <span className="font-bold text-amber-accent font-mono text-lg">{result.timeComplexity.avg}</span>
        </div>
        <div className="p-3 bg-secondary rounded-lg border border-border">
          <span className="text-xs text-muted-foreground block">Space Complexity</span>
          <span className="font-bold text-emerald font-mono text-lg">{result.spaceComplexity}</span>
        </div>
      </div>

      {/* Array Bars Visualization */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Sorted Result Array</p>
        <div className="flex items-end gap-2 h-36 pt-4 border-b border-border">
          {result.sortedArray.map((val, idx) => {
            const maxVal = Math.max(...result.sortedArray, 1);
            const heightPercent = Math.max(15, Math.min(100, (val / maxVal) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                <span className="text-[10px] font-mono text-foreground mb-1">{val}</span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t border-t border-primary/50 transition-all duration-300"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Trace */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Step Trace ({result.steps.length} steps)</p>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {result.steps.map((st, i) => (
            <div key={i} className="p-2 rounded bg-secondary/40 border border-border/50 text-xs font-mono text-foreground/90">
              <span className="text-muted-foreground mr-2">[{i + 1}]</span>
              {st.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
