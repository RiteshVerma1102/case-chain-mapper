import { useState } from "react";
import { Graph } from "@/dsa/graph/Graph";
import { useCases } from "@/context/CaseContext";
import { Network } from "lucide-react";

export default function GraphModule() {
  const { cases } = useCases();
  const [graph] = useState(() => {
    const g = new Graph();
    // Build adjacency list graph from case suspect relationships
    const suspectMap = new Map<string, string[]>();
    cases.forEach(c => {
      if (!suspectMap.has(c.suspectName)) suspectMap.set(c.suspectName, []);
      suspectMap.get(c.suspectName)!.push(c.caseId);
    });

    cases.forEach(c => g.addVertex(c.caseId));

    suspectMap.forEach((cList) => {
      for (let i = 0; i < cList.length; i++) {
        for (let j = i + 1; j < cList.length; j++) {
          g.addEdge(cList[i], cList[j]);
        }
      }
    });

    return g;
  });

  const vertices = graph.getVertices();
  const [startNode, setStartNode] = useState(vertices[0] || "CASE-001");
  const [targetNode, setTargetNode] = useState(vertices[vertices.length - 1] || "CASE-004");
  const [algo, setAlgo] = useState<"bfs" | "dfs" | "shortest">("bfs");

  const bfsRes = graph.bfs(startNode);
  const dfsRes = graph.dfs(startNode);
  const pathRes = graph.shortestPath(startNode, targetNode);
  const components = graph.getConnectedComponents();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Graph Module (Adjacency List & BFS/DFS)</h3>
        <p className="text-xs text-muted-foreground">Case Relationship Graph • BFS Traversal • DFS Traversal • Shortest Path • Connected Components</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setAlgo("bfs")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "bfs" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          BFS Traversal (Level Order)
        </button>
        <button
          onClick={() => setAlgo("dfs")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "dfs" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          DFS Traversal (Depth First)
        </button>
        <button
          onClick={() => setAlgo("shortest")}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
            algo === "shortest" ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          Shortest Path Search
        </button>
      </div>

      <div className="glass-card p-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Start Node (Case ID)</label>
          <select value={startNode} onChange={(e) => setStartNode(e.target.value)} className="intel-input">
            {vertices.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Target Node (Case ID)</label>
          <select value={targetNode} onChange={(e) => setTargetNode(e.target.value)} className="intel-input">
            {vertices.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Traversal Output */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 font-mono text-xs">
        {algo === "bfs" && (
          <div>
            <span className="text-primary font-bold block text-sm mb-1">BFS Order: [{bfsRes.order.join(" → ")}]</span>
            <div className="space-y-1 max-h-48 overflow-y-auto pt-2 border-t border-border">
              {bfsRes.steps.map((st, i) => (
                <div key={i} className="text-foreground">[{i + 1}] {st.description}</div>
              ))}
            </div>
          </div>
        )}

        {algo === "dfs" && (
          <div>
            <span className="text-accent font-bold block text-sm mb-1">DFS Order: [{dfsRes.order.join(" → ")}]</span>
            <div className="space-y-1 max-h-48 overflow-y-auto pt-2 border-t border-border">
              {dfsRes.steps.map((st, i) => (
                <div key={i} className="text-foreground">[{i + 1}] {st.description}</div>
              ))}
            </div>
          </div>
        )}

        {algo === "shortest" && (
          <div>
            <span className="text-emerald font-bold block text-sm mb-1">
              Shortest Path: {pathRes.path.length > 0 ? `[${pathRes.path.join(" → ")}] (Dist: ${pathRes.distance})` : "No path exists"}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-3">
          <span className="text-muted-foreground block mb-1">Connected Graph Components:</span>
          <div className="space-y-1 text-emerald font-bold">
            {components.map((comp, i) => (
              <div key={i}>Component #{i + 1}: [{comp.join(", ")}]</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
