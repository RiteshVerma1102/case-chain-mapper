import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  FolderArchive,
  Fingerprint,
  Users,
  Network,
  CalendarClock,
  FileText,
  Bell,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LogOut,
  Command,
  X,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  action: () => void;
  icon: any;
  keywords: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const commands: CommandItem[] = useMemo(() => [
    {
      id: "dashboard",
      label: "Open Dashboard",
      description: "Overview metrics, active alerts, and case pipeline",
      action: () => navigate("/"),
      icon: LayoutDashboard,
      keywords: ["dashboard", "home", "metrics", "overview"],
    },
    {
      id: "new-case",
      label: "Create New Case",
      description: "Initialize an investigation record with unique ID",
      action: () => navigate("/cases?action=new"),
      icon: PlusCircle,
      keywords: ["new", "create", "case", "investigation", "add"],
    },
    {
      id: "cases",
      label: "Browse Cases",
      description: "Case management catalog, filters, and priority sorts",
      action: () => navigate("/cases"),
      icon: FolderArchive,
      keywords: ["cases", "search", "filter", "sort", "merge sort"],
    },
    {
      id: "investigations",
      label: "Investigation Workspace",
      description: "Recursive suspect traversal and hypothesis testing",
      action: () => navigate("/investigations"),
      icon: Fingerprint,
      keywords: ["investigations", "suspect", "chain", "traversal", "findings"],
    },
    {
      id: "network",
      label: "Case Network Visualization",
      description: "Interactive relationship graph, BFS exploration & DFS tracing",
      action: () => navigate("/network"),
      icon: Network,
      keywords: ["network", "graph", "bfs", "dfs", "adjacency", "nodes", "relationships"],
    },
    {
      id: "entities",
      label: "Entity Intelligence Directory",
      description: "Persons, organizations, vehicles, phones, locations",
      action: () => navigate("/entities"),
      icon: Users,
      keywords: ["entities", "person", "organization", "phone", "vehicle", "location"],
    },
    {
      id: "timeline",
      label: "Chronological Timeline",
      description: "Timestamped event logs with case and entity linkage",
      action: () => navigate("/timeline"),
      icon: CalendarClock,
      keywords: ["timeline", "events", "time", "chronology", "history"],
    },
    {
      id: "evidence",
      label: "Evidence Management Locker",
      description: "Digital forensic files, physical exhibits, and custody chains",
      action: () => navigate("/evidence"),
      icon: FileText,
      keywords: ["evidence", "forensics", "custody", "files", "exhibits"],
    },
    {
      id: "alerts",
      label: "Intelligence Alerts",
      description: "Critical repeat suspects, backlog warnings, and flags",
      action: () => navigate("/alerts"),
      icon: Bell,
      keywords: ["alerts", "notifications", "warnings", "critical"],
    },
    {
      id: "analytics",
      label: "Analytics & Pattern Detection",
      description: "Charts, frequency graphs, and cross-case intelligence",
      action: () => navigate("/analytics"),
      icon: BarChart3,
      keywords: ["analytics", "charts", "patterns", "statistics", "recharts"],
    },
    {
      id: "reports",
      label: "Generate Case Report (PDF)",
      description: "Export formal intelligence brief with tables and signoff",
      action: () => navigate("/reports"),
      icon: FileSpreadsheet,
      keywords: ["report", "pdf", "export", "print", "document"],
    },
    {
      id: "settings",
      label: "Platform Settings & Data Controls",
      description: "Export/Import JSON/CSV, demo reset, and academic DSA lab",
      action: () => navigate("/settings"),
      icon: Settings,
      keywords: ["settings", "export", "import", "dsa lab", "reset"],
    },
    {
      id: "sign-out",
      label: "Sign Out",
      description: "Securely terminate current authenticated session",
      action: async () => {
        await signOut();
        navigate("/login");
      },
      icon: LogOut,
      keywords: ["logout", "exit", "sign out"],
    },
  ], [navigate, signOut]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.keywords.some((k) => k.includes(q))
    );
  }, [query, commands]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx((i) => Math.min(i, Math.max(filtered.length - 1, 0)));
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filtered[activeIdx];
        if (selected) {
          selected.action();
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, activeIdx, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      style={{ background: "rgba(5, 5, 15, 0.75)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10"
        style={{
          background: "linear-gradient(180deg, rgba(18, 16, 38, 0.98), rgba(12, 10, 28, 0.98))",
          boxShadow: "0 32px 80px rgba(0, 0, 0, 0.5), 0 0 30px rgba(124, 58, 237, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <Search size={18} className="text-violet-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            placeholder="Type a command or search CaseChain..."
            className="flex-1 text-sm text-white placeholder:text-muted-foreground bg-transparent outline-none"
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <kbd className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-muted-foreground font-mono">
              <Command size={10} />K
            </kbd>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div ref={listRef} className="overflow-y-auto max-h-[380px] p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No CaseChain commands found for <span className="text-white font-medium">"{query}"</span>
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const active = idx === activeIdx;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    active
                      ? "bg-violet-600/20 border border-violet-500/40 text-white"
                      : "text-muted-foreground hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${
                      active
                        ? "bg-violet-600/30 border-violet-500/50 text-violet-300"
                        : "bg-white/5 border-white/5 text-muted-foreground"
                    }`}
                  >
                    <Icon size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${active ? "text-white font-semibold" : "text-slate-200"}`}>
                      {cmd.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate leading-snug">
                      {cmd.description}
                    </p>
                  </div>
                  {active && (
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-muted-foreground font-mono">
                      ↵
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/6 px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground bg-black/20">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white/5 px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-white/5 px-1 rounded">↵</kbd> Select</span>
            <span><kbd className="font-mono bg-white/5 px-1 rounded">Esc</kbd> Close</span>
          </div>
          <span className="text-violet-400 font-medium">CaseChain v2.4</span>
        </div>
      </div>
    </div>
  );
}
