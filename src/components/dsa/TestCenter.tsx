import { useState, useEffect } from "react";
import { insertElement, kadane, twoSum } from "@/dsa/arrays/ArrayAlgorithms";
import { HashTable } from "@/dsa/hashing/HashTable";
import { pairSum, isPalindrome } from "@/dsa/twopointers/TwoPointers";
import { mergeSort, quickSort } from "@/dsa/sorting/SortingAlgorithms";
import { binarySearch } from "@/dsa/searching/BinarySearch";
import { isStringPalindrome, isAnagram } from "@/dsa/strings/StringAlgorithms";
import { generateSieve } from "@/dsa/sieve/Sieve";
import { PrefixSum } from "@/dsa/prefixsum/PrefixSum";
import { validateParentheses } from "@/dsa/stack/Stack";
import { nextGreaterElement } from "@/dsa/monotonicstack/MonotonicStack";
import { maxSumSubarrayK } from "@/dsa/slidingwindow/SlidingWindow";
import { generateSubsets } from "@/dsa/backtracking/Backtracking";
import { isEvenBit } from "@/dsa/bitmanipulation/BitManipulation";
import { evaluateNimGame } from "@/dsa/gametheory/GameTheory";
import { gcdEuclidean } from "@/dsa/numbertheory/NumberTheory";
import { MaxHeap } from "@/dsa/heap/Heap";
import { BinarySearchTree } from "@/dsa/bst/BST";
import { Graph } from "@/dsa/graph/Graph";
import { fibonacciDP } from "@/dsa/dp/DP";
import { Trie } from "@/dsa/trie/Trie";
import { CheckCircle2, XCircle, RefreshCw, ShieldCheck } from "lucide-react";

export interface TestCaseResult {
  moduleName: string;
  testName: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

export default function TestCenter() {
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [running, setRunning] = useState(false);

  const runAllTests = () => {
    setRunning(true);
    const results: TestCaseResult[] = [];

    // Helper to record test
    const assert = (moduleName: string, testName: string, input: string, expected: string, actual: string, condition: boolean) => {
      results.push({ moduleName, testName, input, expected, actual, passed: condition });
    };

    try {
      // 1. Array Test
      const kRes = kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
      assert("Array", "Kadane's Algorithm", "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", "6", String(kRes.result.maxSum), kRes.result.maxSum === 6);

      // 2. Hash Table Test
      const ht = new HashTable<string, number>(4);
      ht.set("A", 100);
      const htVal = ht.get("A");
      assert("Hashing", "Hash Table O(1) Get", "Key 'A'", "100", String(htVal), htVal === 100);

      // 3. Two Pointers Test
      const ps = pairSum([1, 2, 4, 6, 10], 10);
      assert("Two Pointers", "Pair Sum", "arr=[1,2,4,6,10], target=10", "Found pair", JSON.stringify(ps.pairs), ps.pairs.length > 0);

      // 4. Sorting Test
      const ms = mergeSort([5, 2, 9, 1, 5, 6]);
      assert("Sorting", "Merge Sort", "[5,2,9,1,5,6]", "[1,2,5,5,6,9]", JSON.stringify(ms.sortedArray), JSON.stringify(ms.sortedArray) === "[1,2,5,5,6,9]");

      // 5. Binary Search Test
      const bs = binarySearch([10, 20, 30, 40, 50], 30);
      assert("Binary Search", "Standard Binary Search", "arr=[10,20,30,40,50], target=30", "Index 2", String(bs.resultIndex), bs.resultIndex === 2);

      // 6. String Anagram Test
      const anagram = isAnagram("listen", "silent");
      assert("Strings", "Anagram Check", "'listen', 'silent'", "true", String(anagram.isAnagram), anagram.isAnagram === true);

      // 7. Sieve Test
      const sieve = generateSieve(20);
      assert("Sieve", "Primes Up To 20", "N=20", "[2,3,5,7,11,13,17,19]", JSON.stringify(sieve.primes), JSON.stringify(sieve.primes) === "[2,3,5,7,11,13,17,19]");

      // 8. Prefix Sum Test
      const prefix = new PrefixSum([2, 4, 1, 5, 3]);
      const pQuery = prefix.query(1, 3);
      assert("Prefix Sum", "Range Sum Query L=1 R=3", "[2,4,1,5,3]", "10", String(pQuery.result), pQuery.result === 10);

      // 9. Stack Test
      const paren = validateParentheses("{[()]}");
      assert("Stack", "Parentheses Validation", "'{[()]}'", "true", String(paren.isValid), paren.isValid === true);

      // 10. Monotonic Stack Test
      const nge = nextGreaterElement([4, 5, 2, 25]);
      assert("Monotonic Stack", "Next Greater Element", "[4, 5, 2, 25]", "[5, 25, 25, -1]", JSON.stringify(nge.result), JSON.stringify(nge.result) === "[5,25,25,-1]");

      // 11. Sliding Window Test
      const sw = maxSumSubarrayK([2, 1, 5, 1, 3, 2], 3);
      assert("Sliding Window", "Max Sum Subarray K=3", "[2,1,5,1,3,2]", "9", String(sw.maxSum), sw.maxSum === 9);

      // 12. Backtracking Test
      const sub = generateSubsets([1, 2]);
      assert("Backtracking", "Subsets Generation", "[1,2]", "4 subsets", String(sub.subsets.length), sub.subsets.length === 4);

      // 13. Bit Manipulation Test
      const bit = isEvenBit(4);
      assert("Bit Manipulation", "Even Bit Check", "N=4", "true", String(bit.isEven), bit.isEven === true);

      // 14. Game Theory Test
      const nim = evaluateNimGame([3, 4, 5]);
      assert("Game Theory", "Nim Game Winning Position", "[3,4,5]", "true", String(nim.isWinningPosition), nim.isWinningPosition === true);

      // 15. Number Theory Test
      const gcd = gcdEuclidean(48, 18);
      assert("Number Theory", "Euclidean GCD", "48, 18", "6", String(gcd.gcd), gcd.gcd === 6);

      // 16. Heap Test
      const heap = new MaxHeap<string>();
      heap.insert(10, "A");
      heap.insert(50, "B");
      const peek = heap.peekMax();
      assert("Priority Queue", "Max Heap Peek", "Insert 10, 50", "Key 50", String(peek?.key), peek?.key === 50);

      // 17. BST Test
      const bst = new BinarySearchTree();
      bst.insert(50); bst.insert(30); bst.insert(70);
      assert("BST", "BST Inorder Property", "Insert 50, 30, 70", "[30,50,70]", JSON.stringify(bst.inorder()), JSON.stringify(bst.inorder()) === "[30,50,70]");

      // 18. Graph Test
      const g = new Graph();
      g.addEdge("A", "B");
      const bfs = g.bfs("A");
      assert("Graph", "BFS Connected Traversal", "Edge A-B", "[A, B]", JSON.stringify(bfs.order), JSON.stringify(bfs.order) === '["A","B"]');

      // 19. DP Test
      const fib = fibonacciDP(6);
      assert("Dynamic Programming", "Fibonacci DP(6)", "N=6", "8", String(fib.result), fib.result === 8);

      // 20. Trie Test
      const trie = new Trie();
      trie.insert("Rahul");
      const auto = trie.getAutocompleteSuggestions("Rah");
      assert("Trie", "Autocomplete Suggestions", "Prefix 'Rah'", "['Rahul']", JSON.stringify(auto), JSON.stringify(auto) === '["Rahul"]');

    } catch (err: any) {
      console.error(err);
    }

    setTestResults(results);
    setRunning(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const total = testResults.length;
  const passed = testResults.filter((r) => r.passed).length;
  const failed = total - passed;
  const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">DSA Automated Test Center</h3>
          <p className="text-xs text-muted-foreground">Real Unit Test Verification Across All Implemented Data Structures & Algorithms</p>
        </div>
        <button onClick={runAllTests} disabled={running} className="intel-btn-primary text-xs">
          <RefreshCw size={14} className={`mr-1 ${running ? "animate-spin" : ""}`} /> Run All Automated Tests
        </button>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Total Automated Tests</span>
          <span className="font-bold text-2xl font-display text-foreground">{total}</span>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Passed Tests</span>
          <span className="font-bold text-2xl font-display text-emerald flex items-center gap-2">
            <CheckCircle2 size={20} /> {passed}
          </span>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Failed Tests</span>
          <span className="font-bold text-2xl font-display text-destructive flex items-center gap-2">
            <XCircle size={20} /> {failed}
          </span>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-border">
          <span className="text-xs text-muted-foreground block">Success Rate</span>
          <span className="font-bold text-2xl font-display text-primary">{successRate}%</span>
        </div>
      </div>

      {/* Detailed Test Results Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <span className="font-display font-semibold text-xs text-foreground uppercase">Automated Verification Log</span>
          <span className="text-xs font-mono text-emerald font-bold">ALL TESTS EXECUTING IN-MEMORY</span>
        </div>

        <div className="divide-y divide-border/60 font-mono text-xs max-h-[450px] overflow-y-auto">
          {testResults.map((t, idx) => (
            <div key={idx} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-secondary/20 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-sans">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">{t.moduleName}</span>
                  <span className="font-semibold text-foreground">{t.testName}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Input: <span className="text-foreground">{t.input}</span> | Expected: <span className="text-emerald">{t.expected}</span> | Actual: <span className="text-accent">{t.actual}</span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-lg text-xs font-bold font-sans self-start md:self-center ${t.passed ? "bg-emerald/15 text-emerald border border-emerald/30" : "bg-destructive/15 text-destructive border border-destructive/30"}`}>
                {t.passed ? "✓ PASS" : "✗ FAIL"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
