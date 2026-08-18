import { CheckCircle2, ArrowUpRight } from "lucide-react";

export interface TopicCheckitem {
  id: string;
  topicNumber: number;
  name: string;
  dataStructure: string;
  keyAlgorithm: string;
}

export const pepTopics: TopicCheckitem[] = [
  { id: "array", topicNumber: 1, name: "Basics & Fundamentals", dataStructure: "Primitives", keyAlgorithm: "Execution Traces" },
  { id: "array", topicNumber: 2, name: "Arrays", dataStructure: "Array / Vector", keyAlgorithm: "Kadane's, Two Sum, Linear Search" },
  { id: "hashing", topicNumber: 3, name: "Hashing", dataStructure: "Hash Table / Map / Set", keyAlgorithm: "Chaining Collision Resolution" },
  { id: "twopointers", topicNumber: 4, name: "Two Pointers", dataStructure: "Array / String", keyAlgorithm: "Pair Sum, Palindrome, Container" },
  { id: "sorting", topicNumber: 5, name: "Sorting Based Problems", dataStructure: "Array", keyAlgorithm: "Bubble, Selection, Insertion, Merge, Quick, Heap" },
  { id: "bs", topicNumber: 6, name: "Binary Search", dataStructure: "Sorted Array", keyAlgorithm: "First/Last Occ, Lower/Upper Bound" },
  { id: "bsanswer", topicNumber: 7, name: "Binary Search on Answers", dataStructure: "Search Space", keyAlgorithm: "Book Allocation, Aggressive Cows" },
  { id: "strings", topicNumber: 8, name: "Strings", dataStructure: "String", keyAlgorithm: "Anagrams, Longest Substring" },
  { id: "sieve", topicNumber: 9, name: "Sieve of Eratosthenes", dataStructure: "Boolean Array", keyAlgorithm: "Prime Generation O(n log log n)" },
  { id: "prefixsum", topicNumber: 10, name: "Prefix Sum", dataStructure: "Prefix Array", keyAlgorithm: "Range Sum Query O(1)" },
  { id: "recursion", topicNumber: 11, name: "Recursion", dataStructure: "Call Stack", keyAlgorithm: "Factorial, Fibonacci, Depth Trace" },
  { id: "linkedlist", topicNumber: 12, name: "Linked List", dataStructure: "Singly Linked List", keyAlgorithm: "Merge Sort, Cycle Detect, Pointers" },
  { id: "stack", topicNumber: 13, name: "Stack", dataStructure: "Stack (LIFO)", keyAlgorithm: "Parentheses, Postfix Evaluation" },
  { id: "queue", topicNumber: 14, name: "Queue", dataStructure: "Queue (FIFO)", keyAlgorithm: "Case Processing Queue" },
  { id: "monotonicstack", topicNumber: 15, name: "Monotonic Stack", dataStructure: "Monotonic Stack", keyAlgorithm: "Next Greater Element, Daily Temps" },
  { id: "slidingwindow", topicNumber: 16, name: "Sliding Window", dataStructure: "Subarray / Substring", keyAlgorithm: "Max Sum Subarray, Min Window" },
  { id: "backtracking", topicNumber: 17, name: "Backtracking", dataStructure: "Decision Tree", keyAlgorithm: "Subsets, Permutations, N-Queens" },
  { id: "greedy", topicNumber: 18, name: "Greedy", dataStructure: "Sorted Items", keyAlgorithm: "Activity Selection, Knapsack" },
  { id: "bit", topicNumber: 19, name: "Bit Manipulation", dataStructure: "Bitmask / Int", keyAlgorithm: "Kernighan's, Single Unique XOR" },
  { id: "gametheory", topicNumber: 20, name: "Game Theory", dataStructure: "Nim Piles", keyAlgorithm: "Bouton's Theorem, XOR Nim-Sum" },
  { id: "numbertheory", topicNumber: 21, name: "Number Theory", dataStructure: "Integers", keyAlgorithm: "Euclidean GCD, Fast Mod Exponentiation" },
  { id: "heap", topicNumber: 22, name: "Priority Queue / Heap", dataStructure: "Min/Max Heap", keyAlgorithm: "Heapify, Extract Max, Case Priority" },
  { id: "tree", topicNumber: 23, name: "Binary Tree", dataStructure: "Binary Tree", keyAlgorithm: "Preorder, Inorder, Postorder, Level Order" },
  { id: "bst", topicNumber: 24, name: "Binary Search Tree", dataStructure: "BST", keyAlgorithm: "O(log n) Insert, Delete, Search" },
  { id: "graph", topicNumber: 25, name: "Graph", dataStructure: "Adjacency List", keyAlgorithm: "BFS, DFS, Shortest Path" },
  { id: "dp", topicNumber: 26, name: "Dynamic Programming", dataStructure: "DP Table / Memo", keyAlgorithm: "Knapsack, LCS, Coin Change" },
  { id: "trie", topicNumber: 27, name: "Tries", dataStructure: "Trie (Prefix Tree)", keyAlgorithm: "Live Case/Suspect Autocomplete" },
  { id: "misc", topicNumber: 28, name: "General Problem Solving", dataStructure: "Misc", keyAlgorithm: "Boyer-Moore, Trapping Rain Water" },
];

export default function DSAChecklist({ onSelectTopic }: { onSelectTopic: (topicId: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">PEP DSA Topic Verification Checklist</h3>
        <p className="text-xs text-muted-foreground">28 / 28 Required Topics Implemented with Real Algorithms & Data Structures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {pepTopics.map((topic) => (
          <div
            key={topic.topicNumber}
            onClick={() => onSelectTopic(topic.id)}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-secondary/40 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald/15 text-emerald font-bold text-xs font-mono">
                ✓
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm flex items-center gap-2">
                  <span>#{topic.topicNumber}. {topic.name}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="text-primary font-mono">{topic.dataStructure}</span> • {topic.keyAlgorithm}
                </p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
