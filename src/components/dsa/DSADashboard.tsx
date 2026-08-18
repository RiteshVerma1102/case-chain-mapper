import { Cpu, CheckCircle2, Layers, ArrowUpDown, Search, Network, GitBranch, ShieldCheck, ArrowRight } from "lucide-react";

export default function DSADashboard({ onSelectTopic }: { onSelectTopic: (topicId: string) => void }) {
  const stats = [
    { label: "PEP Topics", value: "30" },
    { label: "Algorithms", value: "50+" },
    { label: "Data Structures", value: "14" },
    { label: "Sorting", value: "6" },
    { label: "Searching", value: "6" },
    { label: "Graph & Trees", value: "5" },
  ];

  const categories = [
    { id: "array", name: "Arrays & Two Pointers", desc: "Traversals, Kadane's max sum, Two Sum index lookup.", icon: Layers },
    { id: "hashing", name: "Hashing & Maps", desc: "O(1) chaining hash table, frequency maps, fast lookup.", icon: Cpu },
    { id: "sorting", name: "Sorting Lab", desc: "Merge, Quick, Heap, Bubble, Selection, Insertion benchmarks.", icon: ArrowUpDown },
    { id: "linkedlist", name: "Singly Linked List", desc: "Primary case chain engine, merge sort, cycle detection.", icon: GitBranch },
    { id: "graph", name: "Graph & BFS/DFS", desc: "Adjacency list relationship network, BFS/DFS traversal.", icon: Network },
    { id: "testcenter", name: "Automated Test Center", desc: "Automated test suite verifying 30 PEP DSA topics.", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto font-sans pb-16">
      {/* Editorial Hero */}
      <div className="text-center py-6 space-y-4">
        <h1 className="font-display text-5xl font-bold tracking-tight text-[#1D1D1F]">
          DSA LAB
        </h1>
        <p className="text-xl text-[#6E6E73] max-w-xl mx-auto">
          See algorithms in action. Understand data structures through interactive execution.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-6 rounded-3xl bg-white border border-black/5 text-center shadow-sm space-y-1">
            <p className="font-display text-3xl font-bold text-[#1D1D1F]">{s.value}</p>
            <p className="text-xs text-[#6E6E73] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Cards */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">Interactive DSA Modules</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectTopic(cat.id)}
              className="group rounded-3xl bg-white border border-black/5 p-8 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                  <cat.icon size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <span className="text-xs text-[#0071E3] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-2">
                Explore Module <ArrowRight size={13} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
