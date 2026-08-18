import { useState } from "react";
import { nextGreaterElement, nextSmallerElement, dailyTemperatures } from "@/dsa/monotonicstack/MonotonicStack";

export default function MonotonicStackModule() {
  const [arrayInput, setArrayInput] = useState("4, 5, 2, 25, 7, 18");
  const [tempInput, setTempInput] = useState("73, 74, 75, 71, 69, 72, 76, 73");
  const [algo, setAlgo] = useState("nextGreater");

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const getTemps = () => tempInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const runAlgo = () => {
    switch (algo) {
      case "nextGreater": return nextGreaterElement(getNums());
      case "nextSmaller": return nextSmallerElement(getNums());
      case "dailyTemp": return dailyTemperatures(getTemps());
      default: return nextGreaterElement(getNums());
    }
  };

  const output = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Monotonic Stack Module</h3>
        <p className="text-xs text-muted-foreground">Next Greater Element • Next Smaller Element • Daily Temperatures • Monotonic Stack Trace</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: "nextGreater", label: "Next Greater Element" },
          { id: "nextSmaller", label: "Next Smaller Element" },
          { id: "dailyTemp", label: "Daily Temperatures" },
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
        {algo === "dailyTemp" ? (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Temperatures Array</label>
            <input type="text" value={tempInput} onChange={(e) => setTempInput(e.target.value)} className="intel-input" />
          </div>
        ) : (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Array Input</label>
            <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="border-b border-border pb-3">
          <p className="text-xs text-muted-foreground">Result Array:</p>
          <pre className="font-mono text-sm text-primary font-bold">{JSON.stringify(output.result)}</pre>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Step-by-Step Monotonic Stack Trace</p>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {output.steps.map((st, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground mr-2">[{i + 1}]</span>
                  <span className="text-foreground">{st.description}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-accent/15 text-accent font-bold">Stack: [{st.stackContents.join(", ")}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
