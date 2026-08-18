import { useState } from "react";
import { generateSubsets, generatePermutations, solveNQueens } from "@/dsa/backtracking/Backtracking";

export default function BacktrackingModule() {
  const [arrayInput, setArrayInput] = useState("1, 2, 3");
  const [nQueensVal, setNQueensVal] = useState("4");
  const [algo, setAlgo] = useState("subsets");

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const runAlgo = () => {
    if (algo === "subsets") return generateSubsets(getNums());
    if (algo === "perms") return generatePermutations(getNums());
    return solveNQueens(Math.min(6, Math.max(1, parseInt(nQueensVal) || 4)));
  };

  const output: any = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Backtracking Module</h3>
        <p className="text-xs text-muted-foreground">Choose → Explore → Backtrack • Subsets • Permutations • N-Queens</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setAlgo("subsets")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "subsets" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Subsets / Power Set
        </button>
        <button
          onClick={() => setAlgo("perms")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "perms" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Permutations
        </button>
        <button
          onClick={() => setAlgo("nqueens")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "nqueens" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          N-Queens Problem
        </button>
      </div>

      <div className="glass-card p-4">
        {algo === "nqueens" ? (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Board Size N (1-6)</label>
            <input type="number" value={nQueensVal} onChange={(e) => setNQueensVal(e.target.value)} className="intel-input w-36" />
          </div>
        ) : (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Input Array</label>
            <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4 font-mono text-xs">
        <div className="border-b border-border pb-3">
          <p className="text-muted-foreground">Solutions Count: {output.subsets?.length || output.permutations?.length || output.solutions?.length}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Choose → Explore → Backtrack Trace</p>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {output.steps?.map((st: any, i: number) => (
              <div key={i} className="p-2.5 rounded bg-secondary/40 border border-border/50 flex items-center justify-between">
                <span>[{i + 1}] {st.description}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  st.action === "solution" ? "bg-emerald/20 text-emerald" : st.action === "backtrack" ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"
                }`}>
                  {st.action.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
