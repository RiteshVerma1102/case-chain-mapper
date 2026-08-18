import { useState } from "react";
import { allocateBooks, aggressiveCows } from "@/dsa/searching/BinarySearchOnAnswer";

export default function BinarySearchOnAnswerModule() {
  const [pagesInput, setPagesInput] = useState("12, 34, 67, 90");
  const [kStudents, setKStudents] = useState("2");
  const [stallsInput, setStallsInput] = useState("1, 2, 8, 4, 9");
  const [kCows, setKCows] = useState("3");
  const [problem, setProblem] = useState<"books" | "cows">("books");

  const runAlgo = () => {
    if (problem === "books") {
      const pages = pagesInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      return allocateBooks(pages, parseInt(kStudents) || 1);
    } else {
      const stalls = stallsInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      return aggressiveCows(stalls, parseInt(kCows) || 1);
    }
  };

  const output = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Binary Search on Answer</h3>
        <p className="text-xs text-muted-foreground">Book Allocation Problem • Aggressive Cows • Feasibility Functions</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setProblem("books")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            problem === "books" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Book Allocation (Min Max Capacity)
        </button>
        <button
          onClick={() => setProblem("cows")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            problem === "cows" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Aggressive Cows (Max Min Distance)
        </button>
      </div>

      <div className="glass-card p-4 space-y-3">
        {problem === "books" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1">Book Pages Array</label>
              <input type="text" value={pagesInput} onChange={(e) => setPagesInput(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Number of Students (K)</label>
              <input type="number" value={kStudents} onChange={(e) => setKStudents(e.target.value)} className="intel-input" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground block mb-1">Stall Positions Array</label>
              <input type="text" value={stallsInput} onChange={(e) => setStallsInput(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Number of Cows (K)</label>
              <input type="number" value={kCows} onChange={(e) => setKCows(e.target.value)} className="intel-input" />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h4 className="font-display text-lg font-bold text-primary">Final Optimal Answer: {output.answer}</h4>
          <span className="text-xs font-mono text-muted-foreground">Search Space Monotonicity Verified</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Feasibility Check Traces</p>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {output.steps.map((st, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground mr-2">[{i + 1}]</span>
                  <span className="text-foreground font-semibold mr-2">{st.description}</span>
                  <span className="text-muted-foreground block mt-0.5">{st.feasibilityDetail}</span>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${st.isPossible ? "bg-emerald/15 text-emerald" : "bg-destructive/15 text-destructive"}`}>
                  {st.isPossible ? "FEASIBLE" : "INFEASIBLE"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
