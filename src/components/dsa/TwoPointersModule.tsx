import { useState } from "react";
import { pairSum, removeDuplicatesSorted, reverseWithTwoPointers, isPalindrome, containerWithMostWater } from "@/dsa/twopointers/TwoPointers";
import { Play } from "lucide-react";

export default function TwoPointersModule() {
  const [arrayInput, setArrayInput] = useState("1, 2, 3, 4, 6, 8, 11");
  const [targetInput, setTargetInput] = useState("10");
  const [strInput, setStrInput] = useState("A man, a plan, a canal: Panama");
  const [heightsInput, setHeightsInput] = useState("1, 8, 6, 2, 5, 4, 8, 3, 7");
  const [algo, setAlgo] = useState("pairSum");

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const getHeights = () => heightsInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const runAlgo = () => {
    switch (algo) {
      case "pairSum": return pairSum(getNums(), parseInt(targetInput) || 0);
      case "removeDups": return removeDuplicatesSorted(getNums());
      case "reverse": return reverseWithTwoPointers(getNums());
      case "palindrome": return isPalindrome(strInput);
      case "container": return containerWithMostWater(getHeights());
      default: return null;
    }
  };

  const output: any = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Two Pointers Module</h3>
        <p className="text-xs text-muted-foreground">Left & Right Pointer Movements • Palindromes • Pair Sum • Container With Most Water</p>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "pairSum", label: "Pair Sum (Sorted)" },
            { id: "removeDups", label: "Remove Duplicates" },
            { id: "reverse", label: "Reverse Array" },
            { id: "palindrome", label: "Palindrome Check" },
            { id: "container", label: "Container With Most Water" },
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setAlgo(b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algo === b.id ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-border">
          {algo === "palindrome" ? (
            <div className="md:col-span-3">
              <label className="text-xs text-muted-foreground block mb-1">Input String</label>
              <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} className="intel-input" />
            </div>
          ) : algo === "container" ? (
            <div className="md:col-span-3">
              <label className="text-xs text-muted-foreground block mb-1">Heights Array</label>
              <input type="text" value={heightsInput} onChange={(e) => setHeightsInput(e.target.value)} className="intel-input" />
            </div>
          ) : (
            <>
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground block mb-1">Sorted Array</label>
                <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Target</label>
                <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="intel-input" />
              </div>
            </>
          )}
        </div>
      </div>

      {output && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h4 className="font-display font-semibold text-foreground">Step-by-Step Pointer Execution</h4>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {output.steps?.map((step: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-secondary/40 border border-border/50 text-xs font-mono flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground mr-2">[{idx + 1}]</span>
                  <span className="text-foreground">{step.description}</span>
                </div>
                <div className="flex gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">L: {step.left}</span>
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-bold">R: {step.right}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
