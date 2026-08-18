import { useState } from "react";
import { HelpCircle, Code, CheckCircle, Cpu, BookOpen } from "lucide-react";
import { pepTopics } from "./DSAChecklist";

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface VivaTopicDetail {
  id: string;
  topicNumber: number;
  name: string;
  definition: string;
  whyUseIt: string;
  projectApplication: string;
  timeComplexity: string;
  spaceComplexity: string;
  vivaQuestions: VivaQuestion[];
  codeSnippet: string;
}

export const vivaDetails: Record<string, VivaTopicDetail> = {
  array: {
    id: "array",
    topicNumber: 2,
    name: "Arrays & Vectors",
    definition: "A contiguous block of memory storing elements of the same type, indexed from 0 to N-1.",
    whyUseIt: "Provides instant O(1) random access by index.",
    projectApplication: "Used inside algorithms like Kadane's max sum, Two Sum index lookup, and temporary trace rendering.",
    timeComplexity: "Access: O(1), Search: O(n), Insertion/Deletion: O(n)",
    spaceComplexity: "O(n)",
    vivaQuestions: [
      { question: "What is Kadane's Algorithm?", answer: "Kadane's algorithm finds the maximum subarray sum in O(n) time by maintaining currentSum = max(arr[i], currentSum + arr[i])." },
      { question: "Why is array insertion O(n)?", answer: "Inserting an element at index i requires shifting all subsequent elements from i to N-1 to the right by one position." }
    ],
    codeSnippet: `export function kadane(arr: number[]): { maxSum: number } {\n  let maxSum = arr[0], currentSum = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    currentSum = Math.max(arr[i], currentSum + arr[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return { maxSum };\n}`
  },
  linkedlist: {
    id: "linkedlist",
    topicNumber: 12,
    name: "Singly Linked List",
    definition: "A linear data structure of nodes where each node stores data and a pointer ('next') to the next node.",
    whyUseIt: "Provides O(1) head insertion/deletion without needing contiguous memory allocation or array resizing.",
    projectApplication: "Serves as the primary data storage engine (CaseLinkedList) for all investigation cases in DCIS.",
    timeComplexity: "Head Insert: O(1), Search/Delete: O(n), Merge Sort: O(n log n)",
    spaceComplexity: "O(n)",
    vivaQuestions: [
      { question: "How does Merge Sort work on a Linked List?", answer: "It splits the linked list into two halves using slow/fast pointers, recursively sorts both halves, and merges them using pointer re-linking." },
      { question: "How do slow and fast pointers find the middle node?", answer: "Slow moves 1 step while Fast moves 2 steps. When Fast reaches the end, Slow is at the middle node." }
    ],
    codeSnippet: `export class CaseNode {\n  data: CaseData;\n  next: CaseNode | null = null;\n  constructor(data: CaseData) {\n    this.data = data;\n  }\n}`
  },
  graph: {
    id: "graph",
    topicNumber: 25,
    name: "Graph (Adjacency List)",
    definition: "A non-linear data structure consisting of vertices (V) connected by edges (E), represented via Adjacency List Map.",
    whyUseIt: "Models complex many-to-many relationships naturally.",
    projectApplication: "Powers the Case Chain Relationship Network — Vertices are Cases, Edges are shared suspect connections.",
    timeComplexity: "BFS / DFS Traversal: O(V + E), Add Edge: O(1)",
    spaceComplexity: "O(V + E)",
    vivaQuestions: [
      { question: "What is the difference between BFS and DFS?", answer: "BFS uses a Queue to explore graph nodes level-by-level (finds shortest path in unweighted graphs). DFS uses a Stack/Recursion to explore as deep as possible before backtracking." },
      { question: "Why is Adjacency List preferred over Adjacency Matrix for sparse graphs?", answer: "Adjacency List uses O(V + E) memory instead of O(V²), making it far more efficient when E << V²." }
    ],
    codeSnippet: `export class Graph {\n  private adjList: Map<string, Set<string>> = new Map();\n  addVertex(v: string) { if (!this.adjList.has(v)) this.adjList.set(v, new Set()); }\n  addEdge(u: string, v: string) { this.addVertex(u); this.addVertex(v); this.adjList.get(u)!.add(v); }\n}`
  },
  trie: {
    id: "trie",
    topicNumber: 27,
    name: "Trie (Prefix Tree)",
    definition: "A tree-like data structure used to store a dynamic set of strings, where keys are usually strings represented by paths.",
    whyUseIt: "Enables fast O(L) prefix search and autocomplete where L is length of prefix.",
    projectApplication: "Powers live suspect name and case title search autocomplete in Case Search.",
    timeComplexity: "Insert: O(L), Search/Autocomplete: O(L)",
    spaceComplexity: "O(Alphabet_Size * L * N)",
    vivaQuestions: [
      { question: "Why is Trie faster than HashMap for autocomplete?", answer: "HashMap requires checking all N keys or pattern matching O(N*L), whereas Trie traverses only L nodes directly down the tree prefix path." }
    ],
    codeSnippet: `export class Trie {\n  root = new TrieNode();\n  insert(word: string) {\n    let curr = this.root;\n    for (const ch of word.toLowerCase()) {\n      if (!curr.children.has(ch)) curr.children.set(ch, new TrieNode());\n      curr = curr.children.get(ch)!;\n    }\n    curr.isEndOfWord = true;\n  }\n}`
  }
};

export default function VivaMode() {
  const [selectedTopicId, setSelectedTopicId] = useState("linkedlist");
  const [activeTab, setActiveTab] = useState<"viva" | "code">("viva");

  const topic = vivaDetails[selectedTopicId] || vivaDetails["linkedlist"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">PEP Viva & Concept Preparation Mode</h3>
        <p className="text-xs text-muted-foreground">Comprehensive DSA Viva Q&A • Real Code Inspection • Complexity Explanations</p>
      </div>

      {/* Select Topic */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {Object.values(vivaDetails).map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopicId(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedTopicId === t.id ? "bg-primary text-primary-foreground font-bold" : "bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            #{t.topicNumber}. {t.name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("viva")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === "viva" ? "bg-secondary text-primary font-bold border border-primary/30" : "bg-card text-muted-foreground"
          }`}
        >
          <BookOpen size={14} className="inline mr-1.5" /> Concept & Viva Q&A
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            activeTab === "code" ? "bg-secondary text-emerald font-bold border border-emerald/30" : "bg-card text-muted-foreground"
          }`}
        >
          <Code size={14} className="inline mr-1.5" /> Open Source Code Implementation
        </button>
      </div>

      {activeTab === "viva" ? (
        <div className="space-y-4 font-sans text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <p className="font-bold text-primary text-sm font-display">1. What is {topic.name}?</p>
              <p className="text-foreground/90">{topic.definition}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <p className="font-bold text-accent text-sm font-display">2. Why is it used?</p>
              <p className="text-foreground/90">{topic.whyUseIt}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <p className="font-bold text-emerald text-sm font-display">3. Project Integration (Case Chain Mapper):</p>
            <p className="text-foreground/90">{topic.projectApplication}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center font-mono">
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <span className="text-muted-foreground block text-[10px]">TIME COMPLEXITY</span>
              <span className="font-bold text-primary text-xs">{topic.timeComplexity}</span>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <span className="text-muted-foreground block text-[10px]">SPACE COMPLEXITY</span>
              <span className="font-bold text-accent text-xs">{topic.spaceComplexity}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <p className="font-display text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={16} className="text-primary" /> Top Viva Questions & Answers
            </p>
            <div className="space-y-3 pt-2">
              {topic.vivaQuestions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-secondary/40 border border-border space-y-1">
                  <p className="font-bold text-primary">Q{idx + 1}: {q.question}</p>
                  <p className="text-foreground/90 text-xs">{q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 font-mono text-xs">
          <p className="text-muted-foreground text-xs">Actual Source Implementation (`src/dsa/${topic.id}/`):</p>
          <pre className="p-4 rounded-lg bg-secondary border border-border text-emerald overflow-x-auto">
            {topic.codeSnippet}
          </pre>
        </div>
      )}
    </div>
  );
}
