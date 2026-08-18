import { useState } from "react";
import { fibonacciDP, knapsack01, lcs, coinChangeMin, climbingStairs } from "@/dsa/dp/DP";

export default function DPModule() {
  const [algo, setAlgo] = useState("fib");
  const [nVal, setNVal] = useState("6");
  const [str1, setStr1] = useState("abcde");
  const [str2, setStr2] = useState("ace");
  const [amountVal, setAmountVal] = useState("11");

  const runAlgo = () => {
    switch (algo) {
      case "fib": return fibonacciDP(parseInt(nVal) || 5);
      case "knapsack": return knapsack01([10, 20, 30], [60, 100, 120], 50);
      case "lcs": return lcs(str1, str2);
      case "coin": return coinChangeMin([1, 2, 5], parseInt(amountVal) || 11);
      case "climb": return climbingStairs(parseInt(nVal) || 5);
      default: return fibonacciDP(5);
    }
  };

  const output = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Dynamic Programming (DP) Module</h3>
        <p className="text-xs text-muted-foreground">Memoization & Tabulation • Overlapping Subproblems • DP Table Visualizer</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {[
          { id: "fib", label: "Fibonacci DP" },
          { id: "knapsack", label: "0/1 Knapsack" },
          { id: "lcs", label: "Longest Common Subsequence" },
          { id: "coin", label: "Coin Change" },
          { id: "climb", label: "Climbing Stairs" },
        ].map((b) => (
          <button
            key={b.id}
            onClick={() => setAlgo(b.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              algo === b.id ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-4">
        {algo === "lcs" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">String 1</label>
              <input type="text" value={str1} onChange={(e) => setStr1(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">String 2</label>
              <input type="text" value={str2} onChange={(e) => setStr2(e.target.value)} className="intel-input" />
            </div>
          </div>
        ) : algo === "coin" ? (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Target Amount (Coins: [1, 2, 5])</label>
            <input type="number" value={amountVal} onChange={(e) => setAmountVal(e.target.value)} className="intel-input w-36" />
          </div>
        ) : (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">N Value</label>
            <input type="number" value={nVal} onChange={(e) => setNVal(e.target.value)} className="intel-input w-36" />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <div>
            <span className="text-muted-foreground block text-[10px]">DP OPTIMAL RESULT</span>
            <span className="font-bold text-lg text-primary">{String(output.result)}</span>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="text-accent font-bold">Time: {output.timeComplexity}</span>
            <span className="text-emerald font-bold">Space: {output.spaceComplexity}</span>
          </div>
        </div>

        <p className="text-foreground font-sans text-xs">{output.explanation}</p>

        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase">DP State Table</p>
          <pre className="p-3 bg-secondary rounded border border-border overflow-x-auto text-primary">
            {JSON.stringify(output.dpTable, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
