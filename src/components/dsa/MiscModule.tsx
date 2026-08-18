import { useState } from "react";
import { majorityElementBoyerMoore, trapRainWater, rotateArrayK } from "@/dsa/misc/MiscProblems";

export default function MiscModule() {
  const [algo, setAlgo] = useState("boyer");
  const [arrayInput, setArrayInput] = useState("2, 2, 1, 1, 1, 2, 2");
  const [heightsInput, setHeightsInput] = useState("0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1");
  const [kVal, setKVal] = useState("3");

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const getHeights = () => heightsInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const runAlgo = () => {
    switch (algo) {
      case "boyer": return majorityElementBoyerMoore(getNums());
      case "rain": return trapRainWater(getHeights());
      case "rotate": return rotateArrayK(getNums(), parseInt(kVal) || 1);
      default: return majorityElementBoyerMoore(getNums());
    }
  };

  const output: any = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">General Problem Solving & Misc Algorithms</h3>
        <p className="text-xs text-muted-foreground">Boyer-Moore Majority Voting • Trapping Rain Water • 3-Step Array Rotation</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: "boyer", label: "Boyer-Moore Majority Vote" },
          { id: "rain", label: "Trapping Rain Water" },
          { id: "rotate", label: "Rotate Array by K" },
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
        {algo === "rain" ? (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Elevation Map Array</label>
            <input type="text" value={heightsInput} onChange={(e) => setHeightsInput(e.target.value)} className="intel-input" />
          </div>
        ) : algo === "rotate" ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground block mb-1">Array Input</label>
              <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">K Rotations</label>
              <input type="number" value={kVal} onChange={(e) => setKVal(e.target.value)} className="intel-input" />
            </div>
          </div>
        ) : (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Array Input</label>
            <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4 font-mono text-xs">
        <div className="border-b border-border pb-3">
          <span className="text-muted-foreground block">Algorithm Result:</span>
          <p className="font-bold text-primary text-sm">{JSON.stringify(output.candidate ?? output.totalWater ?? output.rotated)}</p>
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {output.steps?.map((st: string, i: number) => (
            <div key={i} className="p-2 rounded bg-secondary/40 border border-border/50 text-foreground">
              [{i + 1}] {st}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
