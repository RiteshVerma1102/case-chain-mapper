import { useState } from "react";
import { mergeSort, quickSort, heapSort } from "@/dsa/sorting/SortingAlgorithms";
import { linearSearch } from "@/dsa/arrays/ArrayAlgorithms";
import { binarySearch } from "@/dsa/searching/BinarySearch";
import { recursiveFibonacci } from "@/dsa/recursion/Recursion";
import { fibonacciDP } from "@/dsa/dp/DP";
import { Play } from "lucide-react";

export default function AlgorithmComparison() {
  const [arrayInput, setArrayInput] = useState("45, 12, 89, 34, 67, 23, 90, 11, 56, 78, 2, 99");
  const [targetInput, setTargetInput] = useState("67");
  const [nVal, setNVal] = useState("10");

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  const nums = getNums();
  const sortedNums = [...nums].sort((a, b) => a - b);
  const target = parseInt(targetInput) || 67;
  const n = parseInt(nVal) || 10;

  // Run Sorting Comparisons
  const mergeRes = mergeSort(nums);
  const quickRes = quickSort(nums);
  const heapRes = heapSort(nums);

  // Search Comparisons
  const linearRes = linearSearch(sortedNums, target);
  const binaryRes = binarySearch(sortedNums, target);

  // Recursion vs DP
  const recFib = recursiveFibonacci(Math.min(12, n));
  const dpFib = fibonacciDP(Math.min(12, n));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Algorithm Head-to-Head Comparison Runner</h3>
        <p className="text-xs text-muted-foreground">Live Execution Comparison • Operation Counts • Time & Space Complexity Benchmark</p>
      </div>

      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="text-xs text-muted-foreground block mb-1">Test Array Input</label>
          <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Target Element / N</label>
          <div className="flex gap-2">
            <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="intel-input" placeholder="Target" />
            <input type="number" value={nVal} onChange={(e) => setNVal(e.target.value)} className="intel-input" placeholder="N" />
          </div>
        </div>
      </div>

      {/* Comparison 1: Sorting */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 font-mono text-xs">
        <p className="font-bold font-display text-sm text-primary uppercase tracking-wider">1. Sorting Benchmark (Merge vs Quick vs Heap Sort)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-secondary rounded-lg border border-border space-y-1">
            <span className="font-bold text-accent">Merge Sort</span>
            <p>Comparisons: {mergeRes.comparisons}</p>
            <p>Swaps/Shifts: {mergeRes.swaps}</p>
            <p className="text-primary font-bold">Avg: O(n log n)</p>
            <p className="text-muted-foreground">Space: O(n)</p>
          </div>
          <div className="p-3 bg-secondary rounded-lg border border-border space-y-1">
            <span className="font-bold text-emerald">Quick Sort</span>
            <p>Comparisons: {quickRes.comparisons}</p>
            <p>Swaps/Shifts: {quickRes.swaps}</p>
            <p className="text-primary font-bold">Avg: O(n log n)</p>
            <p className="text-muted-foreground">Space: O(log n)</p>
          </div>
          <div className="p-3 bg-secondary rounded-lg border border-border space-y-1">
            <span className="font-bold text-amber-accent">Heap Sort</span>
            <p>Comparisons: {heapRes.comparisons}</p>
            <p>Swaps/Shifts: {heapRes.swaps}</p>
            <p className="text-primary font-bold">Avg: O(n log n)</p>
            <p className="text-muted-foreground">Space: O(1)</p>
          </div>
        </div>
      </div>

      {/* Comparison 2: Search */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 font-mono text-xs">
        <p className="font-bold font-display text-sm text-accent uppercase tracking-wider">2. Search Benchmark (Linear Search vs Binary Search)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-secondary rounded-lg border border-border space-y-1">
            <span className="font-bold text-destructive">Linear Search</span>
            <p>Comparisons: {linearRes.comparisons}</p>
            <p>Result Index: {linearRes.result}</p>
            <p className="text-primary font-bold">Time: O(n)</p>
          </div>
          <div className="p-3 bg-secondary rounded-lg border border-border space-y-1">
            <span className="font-bold text-emerald">Binary Search</span>
            <p>Comparisons: {binaryRes.comparisons}</p>
            <p>Result Index: {binaryRes.resultIndex}</p>
            <p className="text-primary font-bold">Time: O(log n)</p>
          </div>
        </div>
      </div>

      {/* Comparison 3: Recursion vs DP */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 font-mono text-xs">
        <p className="font-bold font-display text-sm text-emerald uppercase tracking-wider">3. Recursion vs Dynamic Programming (Fibonacci N={Math.min(12, n)})</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-secondary rounded-lg border border-border space-y-1">
            <span className="font-bold text-accent">Naive Recursion</span>
            <p>Call Frames: {recFib.callStack.length}</p>
            <p>Result: {recFib.result}</p>
            <p className="text-destructive font-bold">Time: O(2^n)</p>
          </div>
          <div className="p-3 bg-secondary rounded-lg border border-border space-y-1">
            <span className="font-bold text-emerald">DP Tabulation</span>
            <p>DP Steps: {n + 1}</p>
            <p>Result: {dpFib.result}</p>
            <p className="text-emerald font-bold">Time: O(n)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
