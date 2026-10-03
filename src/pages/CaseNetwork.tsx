import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Filter,
  Layers,
  ArrowRight,
  GitBranch,
  Shield,
  User,
  Building2,
  MapPin,
  Car,
  Phone,
  CreditCard,
  FileText,
  Plus,
  Play,
  X,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { useCases } from "@/context/CaseContext";
import { Graph } from "@/lib/Graph";
import { toast } from "sonner";

interface NodePosition {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  riskLevel: string;
}

export default function CaseNetwork() {
  const navigate = useNavigate();
  const { entities, relationships, cases, buildEntityGraph, addRelationship, addEntity } = useCases();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedNode, setSelectedNode] = useState<string | null>("Marcus Webb");
  const [activeAlgorithm, setActiveAlgorithm] = useState<"none" | "bfs" | "dfs" | "shortest">("none");
  const [traversalPath, setTraversalPath] = useState<string[]>([]);
  const [traversalSteps, setTraversalSteps] = useState<string[]>([]);
  const [targetNodeForPath, setTargetNodeForPath] = useState<string>("Elena Vasquez");

  // Canvas zoom & pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  // Modals
  const [addRelModalOpen, setAddRelModalOpen] = useState(false);
  const [addNodeModalOpen, setAddNodeModalOpen] = useState(false);
  const [relSource, setRelSource] = useState("");
  const [relTarget, setRelTarget] = useState("");
  const [relType, setRelType] = useState("Associated with");

  const canvasRef = useRef<HTMLDivElement>(null);

  // Colors based on Entity Type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Person": return "#a78bfa"; // Violet
      case "Organization": return "#60a5fa"; // Blue
      case "Location": return "#34d399"; // Emerald
      case "Vehicle": return "#f87171"; // Rose
      case "Phone": return "#c084fc"; // Purple
      case "Transaction": return "#22d3ee"; // Cyan
      case "Document":
      case "Evidence": return "#fbbf24"; // Amber
      default: return "#94a3b8"; // Slate
    }
  };

  // Build simulation nodes with circular layout
  const [nodes, setNodes] = useState<NodePosition[]>([]);

  useEffect(() => {
    const width = 900;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38;

    const initialNodes: NodePosition[] = entities.map((ent, i) => {
      const angle = (i / Math.max(entities.length, 1)) * 2 * Math.PI;
      // Stagger slightly for organic feel
      const r = radius * (0.7 + (i % 3) * 0.15);
      return {
        id: ent.entityId,
        name: ent.name,
        type: ent.type,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
        vx: 0,
        vy: 0,
        color: getTypeColor(ent.type),
        riskLevel: ent.riskLevel || "Medium",
      };
    });

    setNodes(initialNodes);
  }, [entities]);

  // Graph instance
  const graph = useMemo(() => buildEntityGraph(), [buildEntityGraph]);

  // Filter nodes for search and type
  const visibleNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (selectedType !== "All" && n.type !== selectedType) return false;
      if (searchQuery.trim() && !n.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [nodes, selectedType, searchQuery]);

  const visibleNodeNames = useMemo(() => new Set(visibleNodes.map((n) => n.name)), [visibleNodes]);

  // Filter visible edges
  const visibleEdges = useMemo(() => {
    return relationships.filter(
      (r) => visibleNodeNames.has(r.sourceEntity) && visibleNodeNames.has(r.targetEntity)
    );
  }, [relationships, visibleNodeNames]);

  // Node map for fast coordinate lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, NodePosition>();
    nodes.forEach((n) => map.set(n.name, n));
    return map;
  }, [nodes]);

  // Selected Entity object
  const inspectedEntity = useMemo(() => {
    if (!selectedNode) return null;
    return entities.find((e) => e.name === selectedNode) || null;
  }, [entities, selectedNode]);

  // Neighbors of selected entity
  const connectedNeighbors = useMemo(() => {
    if (!selectedNode) return [];
    return graph.getNeighbors(selectedNode);
  }, [graph, selectedNode]);

  // Connected cases for selected node
  const linkedCases = useMemo(() => {
    if (!inspectedEntity) return [];
    return cases.filter(
      (c) =>
        inspectedEntity.relatedCases?.includes(c.caseId) ||
        c.suspectName.toLowerCase() === inspectedEntity.name.toLowerCase()
    );
  }, [cases, inspectedEntity]);

  // ============================================================
  // DSA GRAPH ALGORITHMS (BFS, DFS, SHORTEST PATH)
  // ============================================================
  const runBFS = () => {
    if (!selectedNode) {
      toast.error("Please select a starting node first");
      return;
    }
    const res = graph.bfs(selectedNode);
    setActiveAlgorithm("bfs");
    setTraversalPath(res.order);
    setTraversalSteps(res.steps.map((s) => s.description));
    toast.success(`BFS explored ${res.order.length} connected entities`);
  };

  const runDFS = () => {
    if (!selectedNode) {
      toast.error("Please select a starting node first");
      return;
    }
    const res = graph.dfs(selectedNode);
    setActiveAlgorithm("dfs");
    setTraversalPath(res.order);
    setTraversalSteps(res.steps.map((s) => s.description));
    toast.success(`DFS traced deep path across ${res.order.length} entities`);
  };

  const runShortestPath = () => {
    if (!selectedNode || !targetNodeForPath) {
      toast.error("Select both start and target nodes");
      return;
    }
    const res = graph.shortestPath(selectedNode, targetNodeForPath);
    if (res.distance === -1) {
      toast.error(`No path exists between "${selectedNode}" and "${targetNodeForPath}"`);
      setTraversalPath([]);
      return;
    }
    setActiveAlgorithm("shortest");
    setTraversalPath(res.path);
    setTraversalSteps([
      `Shortest link found (${res.distance} step${res.distance !== 1 ? "s" : ""}): ${res.path.join(" → ")}`,
    ]);
    toast.success(`Found path: ${res.path.join(" → ")}`);
  };

  const clearAlgorithm = () => {
    setActiveAlgorithm("none");
    setTraversalPath([]);
    setTraversalSteps([]);
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "circle" || (e.target as HTMLElement).tagName === "text") {
      return;
    }
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      // Dragging node
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setNodes((prev) =>
        prev.map((n) => (n.name === draggedNode ? { ...n, x, y } : n))
      );
    } else if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
  };

  // Node Drag
  const handleNodeMouseDown = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(name);
    setDraggedNode(name);
  };

  // Add Relationship submit
  const handleAddRelationshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relSource || !relTarget) {
      toast.error("Both entities must be selected");
      return;
    }
    await addRelationship({
      sourceEntity: relSource,
      targetEntity: relTarget,
      type: relType,
      strength: "strong",
      details: "User-defined relationship vector",
    });
    setAddRelModalOpen(false);
  };

  const isHighlighted = (name: string) => {
    if (activeAlgorithm !== "none") {
      return traversalPath.includes(name);
    }
    if (selectedNode) {
      return name === selectedNode || connectedNeighbors.includes(name);
    }
    return true;
  };

  const isEdgeHighlighted = (u: string, v: string) => {
    if (activeAlgorithm !== "none" && traversalPath.length > 1) {
      for (let i = 0; i < traversalPath.length - 1; i++) {
        if (
          (traversalPath[i] === u && traversalPath[i + 1] === v) ||
          (traversalPath[i] === v && traversalPath[i + 1] === u)
        ) {
          return true;
        }
      }
      return false;
    }
    if (selectedNode) {
      return u === selectedNode || v === selectedNode;
    }
    return false;
  };

  return (
    <div className="space-y-4 pb-12 select-none">
      {/* Network Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/6 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30 uppercase tracking-wider font-mono">
              Intelligence Topology Graph
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {nodes.length} Nodes • {relationships.length} Vectors
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Case Network Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time adjacency list graph • Interactive relationship mapping • BFS/DFS pathfinding
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setRelSource(selectedNode || entities[0]?.name || "");
              setRelTarget(entities[1]?.name || "");
              setAddRelModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-lg shadow-violet-600/20"
          >
            <Plus size={14} />
            <span>Create Vector</span>
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2.5))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
            title="Reset Pan & Zoom"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Traversal & Algorithm Command Bar */}
      <div className="p-3 rounded-2xl border border-white/6 bg-gradient-to-r from-violet-950/30 via-black/40 to-transparent flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5 font-mono uppercase">
            <GitBranch size={14} />
            <span>Graph Algorithms:</span>
          </span>

          <button
            onClick={runBFS}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeAlgorithm === "bfs"
                ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/20"
                : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
            }`}
            title="Explore adjacent entities using Breadth-First Search"
          >
            BFS Explorer
          </button>

          <button
            onClick={runDFS}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeAlgorithm === "dfs"
                ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20"
                : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
            }`}
            title="Trace deep serial path using Depth-First Search"
          >
            DFS Deep Trace
          </button>

          {activeAlgorithm !== "none" && (
            <button
              onClick={clearAlgorithm}
              className="px-2.5 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20"
            >
              Clear Traversal
            </button>
          )}
        </div>

        {/* Shortest Path controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Trace to:</span>
          <select
            value={targetNodeForPath}
            onChange={(e) => setTargetNodeForPath(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 outline-none"
          >
            {entities
              .filter((e) => e.name !== selectedNode)
              .map((e) => (
                <option key={e.entityId} value={e.name}>
                  {e.name}
                </option>
              ))}
          </select>
          <button
            onClick={runShortestPath}
            className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
          >
            Find Path
          </button>
        </div>
      </div>

      {/* Traversal Step Output Display */}
      {traversalSteps.length > 0 && (
        <div className="p-3.5 rounded-xl border border-violet-500/30 bg-violet-950/20 text-xs space-y-1 animate-fade-in">
          <div className="flex items-center justify-between text-violet-300 font-bold font-mono">
            <span>Algorithmic Traversal Path:</span>
            <span>{traversalPath.length} Nodes</span>
          </div>
          <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
            {traversalPath.join("  →  ")}
          </p>
        </div>
      )}

      {/* Graph Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* SVG Interactive Canvas */}
        <div
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-3 h-[580px] rounded-2xl border border-white/8 bg-gradient-to-b from-[#090818] to-[#0d0b20] relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        >
          {/* Node Type Filter Pills */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-lg">
            {["All", "Person", "Organization", "Location", "Vehicle", "Phone", "Transaction", "Evidence"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  selectedType === t
                    ? "bg-violet-600 text-white border-violet-500"
                    : "bg-black/50 text-muted-foreground hover:text-white border-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Quick Node Search */}
          <div className="absolute top-3 right-3 z-10 w-48">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="w-full pl-7 pr-2 py-1 rounded-lg bg-black/60 border border-white/10 text-white text-[11px] outline-none"
              />
            </div>
          </div>

          {/* SVG Canvas for Edges and Nodes */}
          <svg
            className="w-full h-full pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isPanning || draggedNode ? "none" : "transform 0.1s ease-out",
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#8b5cf6" />
              </marker>
              <marker
                id="arrowhead-highlight"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Render Edges */}
            {visibleEdges.map((edge) => {
              const u = nodeMap.get(edge.sourceEntity);
              const v = nodeMap.get(edge.targetEntity);
              if (!u || !v) return null;

              const highlighted = isEdgeHighlighted(edge.sourceEntity, edge.targetEntity);

              return (
                <g key={edge.relationshipId}>
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={highlighted ? "#38bdf8" : "rgba(255, 255, 255, 0.15)"}
                    strokeWidth={highlighted ? 2.5 : 1.2}
                    strokeDasharray={edge.strength === "weak" ? "4,4" : undefined}
                    opacity={highlighted ? 1 : 0.6}
                  />
                  {/* Midpoint Label for highlighted vectors */}
                  {highlighted && (
                    <text
                      x={(u.x + v.x) / 2}
                      y={(u.y + v.y) / 2 - 4}
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none font-bold"
                    >
                      {edge.type}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {visibleNodes.map((n) => {
              const isSelected = selectedNode === n.name;
              const highlighted = isHighlighted(n.name);

              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  className="pointer-events-auto cursor-pointer"
                  onMouseDown={(e) => handleNodeMouseDown(n.name, e)}
                  onClick={() => setSelectedNode(n.name)}
                >
                  {/* Glow circle if selected */}
                  {isSelected && (
                    <circle
                      r="22"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: "8s" }}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={isSelected ? 16 : 13}
                    fill={n.color}
                    fillOpacity={highlighted ? 0.9 : 0.3}
                    stroke={isSelected ? "#ffffff" : "rgba(0, 0, 0, 0.4)"}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={isSelected ? "drop-shadow(0px 0px 8px #a78bfa)" : undefined}
                  />

                  {/* Node Initial */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#0f172a"
                    fontSize={isSelected ? "11" : "9"}
                    fontWeight="bold"
                    className="select-none font-mono"
                  >
                    {n.name[0]}
                  </text>

                  {/* Label */}
                  <text
                    textAnchor="middle"
                    dy={isSelected ? "28" : "24"}
                    fill={highlighted ? "#ffffff" : "#64748b"}
                    fontSize={isSelected ? "11" : "9.5"}
                    fontWeight={isSelected ? "700" : "500"}
                    className="select-none"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {n.name.length > 18 ? `${n.name.slice(0, 16)}…` : n.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Help Badge */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] text-muted-foreground font-mono">
            <Info size={11} />
            <span>Click to inspect • Drag node to move • Drag background to pan</span>
          </div>
        </div>

        {/* Sliding Node Detail Inspector Panel */}
        <div className="p-4 rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent space-y-4 flex flex-col justify-between">
          {inspectedEntity ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <span className="font-mono text-xs font-bold text-violet-400">
                  {inspectedEntity.entityId}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{
                    backgroundColor: `${getTypeColor(inspectedEntity.type)}20`,
                    borderColor: `${getTypeColor(inspectedEntity.type)}60`,
                    color: getTypeColor(inspectedEntity.type),
                  }}
                >
                  {inspectedEntity.type}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {inspectedEntity.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {inspectedEntity.description || "Intelligence entity record catalogued in network."}
                </p>
              </div>

              {/* Direct Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={runBFS}
                  className="py-1.5 px-2 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-[11px] font-semibold transition-all"
                >
                  BFS Neighbors
                </button>
                <button
                  onClick={runDFS}
                  className="py-1.5 px-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-semibold transition-all"
                >
                  DFS Deep Path
                </button>
              </div>

              {/* Connected Neighbors List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Adjacency Connections</span>
                  <span>{connectedNeighbors.length} nodes</span>
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {connectedNeighbors.length === 0 ? (
                    <span className="text-xs text-muted-foreground">No direct connections.</span>
                  ) : (
                    connectedNeighbors.map((nb) => (
                      <div
                        key={nb}
                        onClick={() => setSelectedNode(nb)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">{nb}</span>
                        <ChevronRight size={12} className="text-muted-foreground" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Connected Cases */}
              <div className="space-y-1.5 pt-2 border-t border-white/6">
                <span className="text-[11px] text-muted-foreground font-mono">Connected Cases ({linkedCases.length})</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {linkedCases.map((c) => (
                    <div
                      key={c.caseId}
                      onClick={() => navigate(`/cases/${c.caseId}`)}
                      className="p-2 rounded-lg bg-black/40 border border-white/6 hover:border-violet-500/40 cursor-pointer text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-violet-400 font-bold text-[10px]">{c.caseId}</span>
                        <span className="text-[9px] text-muted-foreground">{c.priority}</span>
                      </div>
                      <p className="font-semibold text-white truncate text-[11px]">{c.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground text-xs">
              Select a node in the graph to view intelligence dossiers.
            </div>
          )}

          {/* Quick Create Vector trigger */}
          <button
            onClick={() => {
              setRelSource(selectedNode || entities[0]?.name || "");
              setRelTarget(entities[1]?.name || "");
              setAddRelModalOpen(true);
            }}
            className="w-full py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <Plus size={13} />
            <span>Link Relationship</span>
          </button>
        </div>
      </div>

      {/* CREATE RELATIONSHIP MODAL */}
      {addRelModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5, 5, 15, 0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setAddRelModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-4 shadow-2xl"
            style={{
              background: "linear-gradient(180deg, rgba(20, 18, 42, 0.98), rgba(12, 10, 28, 0.98))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <h3 className="text-base font-bold text-white">Create Relationship Vector</h3>
              <button onClick={() => setAddRelModalOpen(false)} className="text-muted-foreground hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRelationshipSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Source Entity</label>
                <select
                  value={relSource}
                  onChange={(e) => setRelSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                >
                  {entities.map((e) => (
                    <option key={e.entityId} value={e.name}>
                      {e.name} ({e.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vector Relationship Type</label>
                <select
                  value={relType}
                  onChange={(e) => setRelType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                >
                  <option value="Associated with">Associated with</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Owned by">Owned by</option>
                  <option value="Located at">Located at</option>
                  <option value="Related to">Related to</option>
                  <option value="Transferred to">Transferred to</option>
                  <option value="Mentioned in">Mentioned in</option>
                  <option value="Connected through">Connected through</option>
                  <option value="Evidence of">Evidence of</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Entity</label>
                <select
                  value={relTarget}
                  onChange={(e) => setRelTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-violet-500"
                >
                  {entities.map((e) => (
                    <option key={e.entityId} value={e.name}>
                      {e.name} ({e.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => setAddRelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
                >
                  Save Vector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
