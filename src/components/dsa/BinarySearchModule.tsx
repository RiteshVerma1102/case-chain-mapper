import { useState } from "react";
import { binarySearch, firstOccurrence, lastOccurrence, lowerBound, upperBound, searchRotated } from "@/dsa/searching/BinarySearch";
import { Search } from "lucide-react";

export default function BinarySearchModule() {
  const [arrayInput, setArrayInput] = useState("2, 5, 8, 12, 16, 23, 38, 56, 72, 91");
  const [targetInput, setTargetInput] = useState("23");
  const [algo, setAlgo] = useState("bs");

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const target = parseInt(targetInput) || 0;

  const runAlgo = () => {
    const nums = getNums();
    switch (algo) {
      case "bs": return binarySearch(nums, target);
      case "first": return firstOccurrence(nums, target);
      case "last": return lastOccurrence(nums, target);
      case "lower": return lowerBound(nums, target);
      case "upper": return upperBound(nums, target);
      case "rotated": return searchRotated(nums, target);
      default: return binarySearch(nums, target);
    }
  };

  const output = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Binary Search Module</h3>
        <p className="text-xs text-muted-foreground">O(log n) Search • Low / Mid / High Visualization • First/Last Occurrence • Rotated Search</p>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs text-muted-foreground block mb-1">Sorted Array</label>
            <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Target Element</label>
            <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="intel-input" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {[
            { id: "bs", label: "Standard BS" },
            { id: "first", label: "First Occurrence" },
            { id: "last", label: "Last Occurrence" },
            { id: "lower", label: "Lower Bound (>=)" },
            { id: "upper", label: "Upper Bound (>)" },
            { id: "rotated", label: "Rotated Array Search" },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setAlgo(b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algo === b.id ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h4 className="font-display font-semibold text-foreground">Result Index: {output.resultIndex}</h4>
          <span className="text-xs font-mono text-primary">Comparisons: {output.comparisons}</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Low / Mid / High Execution Trace</p>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {output.steps.map((st, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground mr-2">[{i + 1}]</span>
                  <span className="text-foreground">{st.description}</span>
                </div>
                <div className="flex gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">L: {st.low}</span>
                  <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-bold">M: {st.mid}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald/10 text-emerald font-bold">H: {st.high}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
