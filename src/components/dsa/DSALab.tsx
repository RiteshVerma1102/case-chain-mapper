import { useState } from "react";
import DSADashboard from "./DSADashboard";
import ArrayModule from "./ArrayModule";
import HashingModule from "./HashingModule";
import TwoPointersModule from "./TwoPointersModule";
import SortingModule from "./SortingModule";
import BinarySearchModule from "./BinarySearchModule";
import BinarySearchOnAnswerModule from "./BinarySearchOnAnswerModule";
import StringsModule from "./StringsModule";
import SieveModule from "./SieveModule";
import PrefixSumModule from "./PrefixSumModule";
import RecursionModule from "./RecursionModule";
import LinkedListModule from "./LinkedListModule";
import StackModule from "./StackModule";
import QueueModule from "./QueueModule";
import MonotonicStackModule from "./MonotonicStackModule";
import SlidingWindowModule from "./SlidingWindowModule";
import BacktrackingModule from "./BacktrackingModule";
import GreedyModule from "./GreedyModule";
import BitManipulationModule from "./BitManipulationModule";
import GameTheoryModule from "./GameTheoryModule";
import NumberTheoryModule from "./NumberTheoryModule";
import HeapModule from "./HeapModule";
import BinaryTreeModule from "./BinaryTreeModule";
import BSTModule from "./BSTModule";
import GraphModule from "./GraphModule";
import DPModule from "./DPModule";
import TrieModule from "./TrieModule";
import MiscModule from "./MiscModule";
import DSAChecklist from "./DSAChecklist";
import TestCenter from "./TestCenter";
import VivaMode from "./VivaMode";
import AlgorithmComparison from "./AlgorithmComparison";
import TestDataGenerator from "./TestDataGenerator";

export type DSATopic =
  | "dashboard"
  | "viva"
  | "compare"
  | "generator"
  | "checklist"
  | "testcenter"
  | "array"
  | "hashing"
  | "twopointers"
  | "sorting"
  | "bs"
  | "bsanswer"
  | "strings"
  | "sieve"
  | "prefixsum"
  | "recursion"
  | "linkedlist"
  | "stack"
  | "queue"
  | "monotonicstack"
  | "slidingwindow"
  | "backtracking"
  | "greedy"
  | "bit"
  | "gametheory"
  | "numbertheory"
  | "heap"
  | "tree"
  | "bst"
  | "graph"
  | "dp"
  | "trie"
  | "misc";

interface DSALabProps {
  defaultTopic?: DSATopic;
}

export default function DSALab({ defaultTopic = "dashboard" }: DSALabProps) {
  const [activeTopic, setActiveTopic] = useState<DSATopic>(defaultTopic);

  const topicTabs: { id: DSATopic; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "viva", label: "PEP Viva Mode" },
    { id: "compare", label: "Algorithm Comparison" },
    { id: "generator", label: "Test Data Generator" },
    { id: "checklist", label: "PEP Checklist (30)" },
    { id: "testcenter", label: "Test Center" },
    { id: "array", label: "Arrays" },
    { id: "hashing", label: "Hashing" },
    { id: "twopointers", label: "Two Pointers" },
    { id: "sorting", label: "Sorting" },
    { id: "bs", label: "Binary Search" },
    { id: "bsanswer", label: "BS on Answer" },
    { id: "strings", label: "Strings" },
    { id: "sieve", label: "Sieve" },
    { id: "prefixsum", label: "Prefix Sum" },
    { id: "recursion", label: "Recursion" },
    { id: "linkedlist", label: "Linked List" },
    { id: "stack", label: "Stack" },
    { id: "queue", label: "Queue" },
    { id: "monotonicstack", label: "Monotonic Stack" },
    { id: "slidingwindow", label: "Sliding Window" },
    { id: "backtracking", label: "Backtracking" },
    { id: "greedy", label: "Greedy" },
    { id: "bit", label: "Bit Manipulation" },
    { id: "gametheory", label: "Game Theory" },
    { id: "numbertheory", label: "Number Theory" },
    { id: "heap", label: "Priority Queue" },
    { id: "tree", label: "Binary Tree" },
    { id: "bst", label: "BST" },
    { id: "graph", label: "Graph" },
    { id: "dp", label: "Dynamic Programming" },
    { id: "trie", label: "Trie" },
    { id: "misc", label: "General Problems" },
  ];

  const renderActiveModule = () => {
    switch (activeTopic) {
      case "dashboard": return <DSADashboard onSelectTopic={(id) => setActiveTopic(id as DSATopic)} />;
      case "viva": return <VivaMode />;
      case "compare": return <AlgorithmComparison />;
      case "generator": return <TestDataGenerator />;
      case "checklist": return <DSAChecklist onSelectTopic={(id) => setActiveTopic(id as DSATopic)} />;
      case "testcenter": return <TestCenter />;
      case "array": return <ArrayModule />;
      case "hashing": return <HashingModule />;
      case "twopointers": return <TwoPointersModule />;
      case "sorting": return <SortingModule />;
      case "bs": return <BinarySearchModule />;
      case "bsanswer": return <BinarySearchOnAnswerModule />;
      case "strings": return <StringsModule />;
      case "sieve": return <SieveModule />;
      case "prefixsum": return <PrefixSumModule />;
      case "recursion": return <RecursionModule />;
      case "linkedlist": return <LinkedListModule />;
      case "stack": return <StackModule />;
      case "queue": return <QueueModule />;
      case "monotonicstack": return <MonotonicStackModule />;
      case "slidingwindow": return <SlidingWindowModule />;
      case "backtracking": return <BacktrackingModule />;
      case "greedy": return <GreedyModule />;
      case "bit": return <BitManipulationModule />;
      case "gametheory": return <GameTheoryModule />;
      case "numbertheory": return <NumberTheoryModule />;
      case "heap": return <HeapModule />;
      case "tree": return <BinaryTreeModule />;
      case "bst": return <BSTModule />;
      case "graph": return <GraphModule />;
      case "dp": return <DPModule />;
      case "trie": return <TrieModule />;
      case "misc": return <MiscModule />;
      default: return <DSADashboard onSelectTopic={(id) => setActiveTopic(id as DSATopic)} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Subnav horizontal scroll bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border text-xs scrollbar-thin">
        {topicTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id)}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTopic === t.id
                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Module Container */}
      <div>{renderActiveModule()}</div>
    </div>
  );
}
