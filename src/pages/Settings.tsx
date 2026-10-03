import { useState } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Download,
  Upload,
  RotateCcw,
  Database,
  Cpu,
  Binary,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Search,
  ArrowRight,
  GitBranch,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/lib/auth";
import { useCases } from "@/context/CaseContext";
import { toast } from "sonner";

export default function Settings() {
  const { user, role } = useAuth();
  const {
    cases,
    entities,
    relationships,
    listSize,
    isBackendConnected,
    resetData,
    exportJSON,
    exportCSV,
    importJSON,
    refresh,
    sortByPriority,
    sortByDate,
    buildEntityGraph,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useCases();

  // Tab state
  const [activeTab, setActiveTab] = useState<"general" | "data" | "dsa">("general");

  // Profile Form
  const [badgeNumber, setBadgeNumber] = useState("INV-7742-A");
  const [agency, setAgency] = useState("Federal Criminal Investigation Bureau");
  const [clearance, setClearance] = useState("Level 3 — Top Secret");

  // DSA Lab State
  const [bfsStart, setBfsStart] = useState<string>(entities[0]?.name || "Viktor Vance");
  const [dfsStart, setDfsStart] = useState<string>(entities[0]?.name || "Viktor Vance");
  const [bfsResult, setBfsResult] = useState<string[]>([]);
  const [dfsResult, setDfsResult] = useState<string[]>([]);
  const [shortestFrom, setShortestFrom] = useState<string>(entities[0]?.name || "Viktor Vance");
  const [shortestTo, setShortestTo] = useState<string>(entities[1]?.name || "Elena Rostova");
  const [shortestPathResult, setShortestPathResult] = useState<string[] | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Investigator credentials updated successfully");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const ok = importJSON(text);
        if (ok) {
          toast.success("Platform state successfully imported from backup");
        } else {
          toast.error("Invalid JSON format or corrupted backup file");
        }
      } catch (err) {
        toast.error("Failed to parse imported file");
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = async () => {
    if (confirm("Reset all cases, entities, and evidence to default high-fidelity seed data? This will overwrite local modifications.")) {
      await resetData();
      toast.success("Platform restored to default intelligence seed data");
    }
  };

  // Run BFS in DSA Lab
  const handleRunBFS = () => {
    try {
      const g = buildEntityGraph();
      const res = g.bfs(bfsStart);
      setBfsResult(res.order);
      toast.success(`BFS Traversal explored ${res.order.length} nodes from "${bfsStart}"`);
    } catch (err) {
      toast.error("Error executing BFS traversal");
    }
  };

  // Run DFS in DSA Lab
  const handleRunDFS = () => {
    try {
      const g = buildEntityGraph();
      const res = g.dfs(dfsStart);
      setDfsResult(res.order);
      toast.success(`DFS Traversal explored ${res.order.length} nodes from "${dfsStart}"`);
    } catch (err) {
      toast.error("Error executing DFS traversal");
    }
  };

  // Run Shortest Path
  const handleRunShortestPath = () => {
    try {
      const g = buildEntityGraph();
      const path = g.shortestPath(shortestFrom, shortestTo);
      setShortestPathResult(path);
      if (path) {
        toast.success(`Shortest path found (${path.length - 1} hops)`);
      } else {
        toast.info(`No connected path between "${shortestFrom}" and "${shortestTo}"`);
      }
    } catch (err) {
      toast.error("Error calculating shortest path");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Settings & Academic DSA Controls"
        subtitle="Manage investigator credentials, data synchronization, and explore algorithmic data structures in real-time"
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "general"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <Shield size={14} />
          <span>Investigator Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("data")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "data"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <Database size={14} />
          <span>Data & Sync Management</span>
        </button>

        <button
          onClick={() => setActiveTab("dsa")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "dsa"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          }`}
        >
          <Binary size={14} className="text-cyan-400" />
          <span>DSA Academic Lab</span>
        </button>
      </div>

      {/* TAB 1: General & Profile */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-1">Investigator Identity & Credentials</h3>
            <p className="text-xs text-muted-foreground mb-5">
              These details are stamped on official PDF dossiers and intelligence attestation logs.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.name || user?.email?.split("@")[0] || "Special Agent"}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || "agent@casechain.internal"}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Badge Number / Operative ID
                  </label>
                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    System Role
                  </label>
                  <input
                    type="text"
                    disabled
                    value={role || "Investigator"}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-violet-400 font-semibold text-sm cursor-not-allowed uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Department / Agency Unit
                </label>
                <input
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Security Clearance
                </label>
                <select
                  value={clearance}
                  onChange={(e) => setClearance(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="Level 1 — Law Enforcement Only" className="bg-slate-900">Level 1 — Law Enforcement Only</option>
                  <option value="Level 2 — Secret" className="bg-slate-900">Level 2 — Secret</option>
                  <option value="Level 3 — Top Secret" className="bg-slate-900">Level 3 — Top Secret</option>
                  <option value="Level 4 — SCI / Compartmented" className="bg-slate-900">Level 4 — SCI / Compartmented</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30 transition-all cursor-pointer"
                >
                  Save Profile Updates
                </button>
              </div>
            </form>
          </div>

          {/* Quick System Status Card */}
          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white">System Architecture</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-muted-foreground">Backend API</span>
                <span className={`font-semibold flex items-center gap-1.5 ${isBackendConnected ? "text-emerald-400" : "text-amber-400"}`}>
                  <span className={`w-2 h-2 rounded-full ${isBackendConnected ? "bg-emerald-400" : "bg-amber-400"}`} />
                  {isBackendConnected ? "Connected (REST/Mongo)" : "Local In-Memory Cache"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-muted-foreground">Linked List Nodes</span>
                <span className="font-mono font-bold text-violet-400">{listSize} Cases</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-muted-foreground">Undo / Redo Stack</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className="px-2 py-0.5 rounded bg-white/10 text-white disabled:opacity-40 text-[11px]"
                  >
                    Undo
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className="px-2 py-0.5 rounded bg-white/10 text-white disabled:opacity-40 text-[11px]"
                  >
                    Redo
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-muted-foreground">Graph Vertices</span>
                <span className="font-mono text-cyan-400">{entities.length} Entities</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-muted-foreground">Graph Edges</span>
                <span className="font-mono text-indigo-400">{relationships.length} Edges</span>
              </div>
            </div>

            <button
              onClick={refresh}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Resync Database</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Data & Sync */}
      {activeTab === "data" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup & Export */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Export & Backup</h3>
                  <p className="text-xs text-muted-foreground">Save full platform state to disk</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Export all active cases, entities, graph relationships, chronological timelines, and evidence lockers into portable standard formats.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={exportJSON}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30 transition-all cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Backup JSON</span>
                </button>

                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet size={14} className="text-emerald-400" />
                  <span>Export Cases CSV</span>
                </button>
              </div>
            </div>

            {/* Restore & Import */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                  <Upload size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Restore from Backup</h3>
                  <p className="text-xs text-muted-foreground">Load previously exported JSON</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Restore full investigation cases, entities, and relationship records from a valid JSON backup file.
              </p>

              <div className="pt-2">
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all cursor-pointer">
                  <Upload size={14} className="text-cyan-400" />
                  <span>Select JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Reset to Seed Data */}
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/20 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>Reset to Default Seed Data</span>
              </h4>
              <p className="text-xs text-red-200/70 mt-1 max-w-xl">
                Restores the standard 10 multi-jurisdictional crime cases, 22 entities, 26 relationships, timeline events, and evidence lockers.
              </p>
            </div>

            <button
              onClick={handleResetData}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 transition-all shrink-0 cursor-pointer"
            >
              Reset Seed Data
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Academic Data Structures Laboratory */}
      {activeTab === "dsa" && (
        <div className="space-y-6 animate-fade-in">
          {/* Linked List & Sorting */}
          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wider">
                  <Layers size={16} />
                  <span>Singly Linked List Implementation</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Case Records Linked List & Merge Sort (O(n log n))
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Demonstrates pointer manipulation, divide-and-conquer merge sort, and linear traversal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={sortByPriority}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors"
                >
                  Merge Sort by Priority
                </button>
                <button
                  onClick={sortByDate}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                >
                  Merge Sort by Date
                </button>
              </div>
            </div>

            {/* Visual Pointer Chain */}
            <div className="overflow-x-auto pb-3 pt-2">
              <div className="flex items-center gap-2 min-w-max">
                {cases.slice(0, 7).map((c, i) => (
                  <div key={c.caseId} className="flex items-center gap-2">
                    <div className="p-3 rounded-xl border border-violet-500/30 bg-slate-900/90 text-xs w-48">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>Node #{i + 1}</span>
                        <span className="text-violet-400">{c.caseId}</span>
                      </div>
                      <div className="font-bold text-white mt-1 truncate">{c.caseName}</div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[10px]">
                        <span className="text-amber-400 font-semibold">{c.priority}</span>
                        <span className="text-slate-400">{c.date}</span>
                      </div>
                    </div>
                    {i < Math.min(6, cases.length - 1) && (
                      <ArrowRight size={18} className="text-violet-500 shrink-0" />
                    )}
                  </div>
                ))}
                {cases.length > 7 && (
                  <div className="text-xs text-muted-foreground italic px-2">
                    +{cases.length - 7} more nodes in chain → null
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Graph Adjacency List & Traversals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BFS Traversal */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                    Breadth-First Search (BFS)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Level-by-level queue traversal across relationship graph
                  </p>
                </div>
                <button
                  onClick={handleRunBFS}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                >
                  Run BFS
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Start Vertex (Entity)
                </label>
                <select
                  value={bfsStart}
                  onChange={(e) => setBfsStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  {entities.map((e) => (
                    <option key={e.entityId} value={e.name} className="bg-slate-900">
                      {e.name} ({e.type})
                    </option>
                  ))}
                </select>
              </div>

              {bfsResult.length > 0 && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-slate-300 mb-2">
                    BFS Sequence ({bfsResult.length} Vertices Discovered):
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {bfsResult.map((node, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px]"
                      >
                        {idx + 1}. {node}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DFS Traversal */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-violet-400 uppercase tracking-wider">
                    Depth-First Search (DFS)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Recursive / stack backtrack exploration to deep nodes
                  </p>
                </div>
                <button
                  onClick={handleRunDFS}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
                >
                  Run DFS
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Start Vertex (Entity)
                </label>
                <select
                  value={dfsStart}
                  onChange={(e) => setDfsStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  {entities.map((e) => (
                    <option key={e.entityId} value={e.name} className="bg-slate-900">
                      {e.name} ({e.type})
                    </option>
                  ))}
                </select>
              </div>

              {dfsResult.length > 0 && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-slate-300 mb-2">
                    DFS Sequence ({dfsResult.length} Vertices Explored):
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {dfsResult.map((node, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px]"
                      >
                        {idx + 1}. {node}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shortest Path (Dijkstra / BFS Unweighted) */}
          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Shortest Investigation Path (Hop Distance)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Computes minimum degrees of separation between two target persons or organizations
                </p>
              </div>
              <button
                onClick={handleRunShortestPath}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              >
                Find Path
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Source Entity
                </label>
                <select
                  value={shortestFrom}
                  onChange={(e) => setShortestFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {entities.map((e) => (
                    <option key={e.entityId} value={e.name} className="bg-slate-900">
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Target Entity
                </label>
                <select
                  value={shortestTo}
                  onChange={(e) => setShortestTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {entities.map((e) => (
                    <option key={e.entityId} value={e.name} className="bg-slate-900">
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {shortestPathResult !== null && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                {shortestPathResult.length > 0 ? (
                  <div>
                    <div className="text-xs font-bold text-emerald-300 mb-2">
                      Path Found ({shortestPathResult.length - 1} Degrees of Separation):
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {shortestPathResult.map((node, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 font-semibold text-xs">
                            {node}
                          </span>
                          {i < shortestPathResult.length - 1 && (
                            <ArrowRight size={14} className="text-emerald-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-300">
                    No direct or indirect relationship connects these two entities in the current graph.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
