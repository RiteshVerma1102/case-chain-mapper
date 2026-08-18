import { useState } from "react";
import { maxSumSubarrayK, minWindowSubstring } from "@/dsa/slidingwindow/SlidingWindow";

export default function SlidingWindowModule() {
  const [arrayInput, setArrayInput] = useState("2, 1, 5, 1, 3, 2");
  const [kVal, setKVal] = useState("3");
  const [sInput, setSInput] = useState("ADOBECODEBANC");
  const [tInput, setTInput] = useState("ABC");
  const [algo, setAlgo] = useState("maxSum");

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const runAlgo = () => {
    if (algo === "maxSum") return maxSumSubarrayK(getNums(), parseInt(kVal) || 1);
    return minWindowSubstring(sInput, tInput);
  };

  const output: any = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Sliding Window Module</h3>
        <p className="text-xs text-muted-foreground">Fixed & Variable Window • Max Sum Subarray • Minimum Window Substring</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setAlgo("maxSum")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "maxSum" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Max Sum Subarray (Size K)
        </button>
        <button
          onClick={() => setAlgo("minWindow")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "minWindow" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Minimum Window Substring
        </button>
      </div>

      <div className="glass-card p-4">
        {algo === "maxSum" ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground block mb-1">Array Input</label>
              <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Window Size K</label>
              <input type="number" value={kVal} onChange={(e) => setKVal(e.target.value)} className="intel-input" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">String S</label>
              <input type="text" value={sInput} onChange={(e) => setSInput(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Pattern T</label>
              <input type="text" value={tInput} onChange={(e) => setTInput(e.target.value)} className="intel-input" />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="border-b border-border pb-3">
          <span className="text-xs text-muted-foreground">Optimal Result:</span>
          <p className="font-bold text-lg text-primary">{algo === "maxSum" ? `Max Sum: ${output.maxSum} (Window: [${output.bestWindow?.join(", ")}])` : `Min Window: "${output.window}"`}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Sliding Window Execution Trace</p>
          <div className="space-y-1.5 max-h-60 overflow-y-auto font-mono text-xs">
            {output.steps?.map((st: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/40 border border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground mr-2">[{i + 1}]</span>
                  <span className="text-foreground">{st.description}</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">L: {st.left}</span>
                  <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-bold">R: {st.right}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
