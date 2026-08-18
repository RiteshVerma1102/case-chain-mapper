import { useState } from "react";
import {
  insertElement,
  deleteElement,
  traverseArray,
  linearSearch,
  findMaxMin,
  reverseArray,
  frequencyCount,
  findDuplicates,
  kadane,
  twoSum,
  AlgoResult,
} from "@/dsa/arrays/ArrayAlgorithms";
import { Play, RotateCcw } from "lucide-react";

export default function ArrayModule() {
  const [arrayInput, setArrayInput] = useState("10, 20, -5, 15, 30, -10, 25");
  const [targetInput, setTargetInput] = useState("15");
  const [indexInput, setIndexInput] = useState("2");
  const [valInput, setValInput] = useState("99");
  const [activeAlgo, setActiveAlgo] = useState("kadane");

  const [output, setOutput] = useState<AlgoResult<unknown> | null>(null);

  const getNumbers = () =>
    arrayInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));

  const runAlgorithm = (algo: string) => {
    setActiveAlgo(algo);
    const nums = getNumbers();
    const target = parseInt(targetInput) || 0;
    const idx = parseInt(indexInput) || 0;
    const val = parseInt(valInput) || 0;

    switch (algo) {
      case "insert":
        setOutput(insertElement(nums, idx, val));
        break;
      case "delete":
        setOutput(deleteElement(nums, idx));
        break;
      case "traverse":
        setOutput(traverseArray(nums));
        break;
      case "search":
        setOutput(linearSearch(nums, target));
        break;
      case "maxmin":
        setOutput(findMaxMin(nums));
        break;
      case "reverse":
        setOutput(reverseArray(nums));
        break;
      case "frequency":
        setOutput(frequencyCount(nums));
        break;
      case "duplicates":
        setOutput(findDuplicates(nums));
        break;
      case "kadane":
        setOutput(kadane(nums));
        break;
      case "twosum":
        setOutput(twoSum(nums, target));
        break;
      default:
        break;
    }
  };

  const nums = getNumbers();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">Interactive Array Module</h3>
          <p className="text-xs text-muted-foreground">Insertion, Deletion, Search, Kadane's, Two Sum & Frequency</p>
        </div>
      </div>

      {/* Input controls */}
      <div className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Array Input (comma separated)</label>
            <input
              type="text"
              value={arrayInput}
              onChange={(e) => setArrayInput(e.target.value)}
              className="intel-input"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Target / Value</label>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => { setTargetInput(e.target.value); setValInput(e.target.value); }}
              className="intel-input"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Index (for Ins/Del)</label>
            <input
              type="number"
              value={indexInput}
              onChange={(e) => setIndexInput(e.target.value)}
              className="intel-input"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {[
            { id: "traverse", label: "Traversal" },
            { id: "search", label: "Linear Search" },
            { id: "insert", label: "Insert" },
            { id: "delete", label: "Delete" },
            { id: "maxmin", label: "Max / Min" },
            { id: "reverse", label: "Reverse Array" },
            { id: "frequency", label: "Frequency Count" },
            { id: "duplicates", label: "Duplicates" },
            { id: "kadane", label: "Kadane's Algo" },
            { id: "twosum", label: "Two Sum" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => runAlgorithm(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeAlgo === btn.id ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              <Play size={10} className="inline mr-1" /> {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Array Representation */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Current Array Elements</p>
        <div className="flex flex-wrap gap-2">
          {nums.map((num, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center font-mono font-bold text-foreground">
                {num}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">idx {i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Trace & Output */}
      {output && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="font-display font-semibold text-foreground">Execution Results</h4>
            <div className="flex gap-4 text-xs font-mono">
              <span className="text-primary">Time: {output.timeComplexity}</span>
              <span className="text-accent">Space: {output.spaceComplexity}</span>
              <span className="text-muted-foreground">Comparisons: {output.comparisons}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">Final Result:</p>
            <pre className="font-mono text-sm bg-secondary p-3 rounded-lg border border-border overflow-x-auto text-primary">
              {JSON.stringify(output.result, (key, value) => value instanceof Map ? Object.fromEntries(value) : value, 2)}
            </pre>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Step-by-Step Execution Trace:</p>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
              {output.steps.map((step, idx) => (
                <div key={idx} className="text-xs font-mono p-2 rounded bg-secondary/40 border border-border/50 text-foreground/90">
                  <span className="text-muted-foreground mr-2">[{idx + 1}]</span>
                  {step.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
