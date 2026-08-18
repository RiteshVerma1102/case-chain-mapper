import { useState } from "react";
import { recursiveFactorial, recursiveFibonacci, recursiveBinarySearch } from "@/dsa/recursion/Recursion";

export default function RecursionModule() {
  const [nVal, setNVal] = useState("5");
  const [algo, setAlgo] = useState<"fact" | "fib" | "bs">("fact");

  const num = parseInt(nVal) || 5;

  const runAlgo = () => {
    if (algo === "fact") return recursiveFactorial(Math.min(12, Math.max(0, num)));
    if (algo === "fib") return recursiveFibonacci(Math.min(12, Math.max(0, num)));
    return recursiveBinarySearch([2, 5, 8, 12, 16, 23, 38], 12);
  };

  const output: any = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Recursion Module</h3>
        <p className="text-xs text-muted-foreground">Call Stack Depth • Base Cases • Recursive Step Call Sequence</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setAlgo("fact")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "fact" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Factorial
        </button>
        <button
          onClick={() => setAlgo("fib")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "fib" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Fibonacci
        </button>
        <button
          onClick={() => setAlgo("bs")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "bs" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Recursive Binary Search
        </button>
      </div>

      <div className="glass-card p-4">
        <label className="text-xs text-muted-foreground block mb-1">N Input Value</label>
        <input type="number" value={nVal} onChange={(e) => setNVal(e.target.value)} className="intel-input w-36" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h4 className="font-display font-semibold text-foreground text-sm">Return Result: {output.result ?? output.resultIndex}</h4>
          <span className="text-xs font-mono text-primary">Call Frames: {output.callStack.length}</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Call Stack Trace (Indented by Recursion Depth)</p>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {output.callStack.map((frame: any, i: number) => (
              <div
                key={i}
                style={{ paddingLeft: `${frame.depth * 16}px` }}
                className="text-xs font-mono py-1.5 px-3 rounded bg-secondary/30 border border-border/40 text-foreground flex items-center gap-2"
              >
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">Depth {frame.depth}</span>
                <span>{frame.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
