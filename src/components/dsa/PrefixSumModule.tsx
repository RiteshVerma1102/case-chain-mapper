import { useState } from "react";
import { PrefixSum } from "@/dsa/prefixsum/PrefixSum";

export default function PrefixSumModule() {
  const [arrayInput, setArrayInput] = useState("2, 4, 1, 5, 3");
  const [leftInput, setLeftInput] = useState("1");
  const [rightInput, setRightInput] = useState("3");

  const nums = arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const ps = new PrefixSum(nums);
  const details = ps.getDetails();

  const l = parseInt(leftInput) || 0;
  const r = parseInt(rightInput) || 0;
  const queryResult = ps.query(l, r);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Prefix Sum Array Module</h3>
        <p className="text-xs text-muted-foreground">O(n) Preprocessing • O(1) Range Sum Queries</p>
      </div>

      <div className="glass-card p-4 space-y-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Array Input</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Query Left Index (L)</label>
            <input type="number" value={leftInput} onChange={(e) => setLeftInput(e.target.value)} className="intel-input" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Query Right Index (R)</label>
            <input type="number" value={rightInput} onChange={(e) => setRightInput(e.target.value)} className="intel-input" />
          </div>
        </div>
      </div>

      {/* Arrays Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Original Array (A)</p>
          <div className="flex gap-2 font-mono text-xs overflow-x-auto pb-1">
            {details.originalArray.map((val, idx) => (
              <div key={idx} className={`p-2.5 rounded border text-center min-w-[40px] ${idx >= l && idx <= r ? "bg-primary/20 border-primary font-bold text-primary" : "bg-secondary border-border"}`}>
                <span className="block text-[10px] text-muted-foreground">idx {idx}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Prefix Sum Array (P)</p>
          <div className="flex gap-2 font-mono text-xs overflow-x-auto pb-1">
            {details.prefixArray.map((val, idx) => (
              <div key={idx} className="p-2.5 rounded border border-accent/30 bg-accent/10 text-center min-w-[40px] text-accent font-bold">
                <span className="block text-[10px] text-muted-foreground">P[{idx}]</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query Result */}
      <div className="rounded-xl border border-border bg-card p-5 font-mono text-xs space-y-2">
        <p className="text-muted-foreground">Query Execution (L={l}, R={r}):</p>
        <p className="text-xl font-bold text-emerald">{queryResult.formula}</p>
      </div>
    </div>
  );
}
