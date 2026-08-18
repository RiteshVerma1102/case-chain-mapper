import { useState } from "react";
import { activitySelection, fractionalKnapsack, Activity, Item } from "@/dsa/greedy/Greedy";

export default function GreedyModule() {
  const [algo, setAlgo] = useState("activity");

  const sampleActivities: Activity[] = [
    { id: "A1", start: 1, finish: 4 },
    { id: "A2", start: 3, finish: 5 },
    { id: "A3", start: 0, finish: 6 },
    { id: "A4", start: 5, finish: 7 },
    { id: "A5", start: 8, finish: 9 },
    { id: "A6", start: 5, finish: 9 },
  ];

  const sampleItems: Item[] = [
    { id: "Item 1", weight: 10, value: 60 },
    { id: "Item 2", weight: 20, value: 100 },
    { id: "Item 3", weight: 30, value: 120 },
  ];

  const runAlgo = () => {
    if (algo === "activity") return activitySelection(sampleActivities);
    return fractionalKnapsack(sampleItems, 50);
  };

  const output: any = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Greedy Algorithms Module</h3>
        <p className="text-xs text-muted-foreground">Local Optimal Choices • Activity Selection • Fractional Knapsack</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setAlgo("activity")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "activity" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Activity Selection
        </button>
        <button
          onClick={() => setAlgo("knapsack")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "knapsack" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Fractional Knapsack
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4 font-mono text-xs">
        <div className="border-b border-border pb-3">
          <p className="text-muted-foreground">Greedy Decision Result:</p>
          <pre className="font-bold text-primary text-sm">{JSON.stringify(output.selected || output.totalValue, null, 2)}</pre>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Greedy Choices Step-by-Step</p>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {output.steps?.map((st: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/40 border border-border/50 space-y-1">
                <div className="font-bold text-primary">[{i + 1}] {st.choice}</div>
                <div className="text-muted-foreground text-[11px]">{st.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
