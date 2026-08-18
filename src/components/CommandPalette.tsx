import { useState, useEffect } from "react";
import { useCases } from "@/context/CaseContext";
import { View } from "./InvestigationSidebar";
import { Search, Cpu, FileText, X } from "lucide-react";
import { pepTopics } from "./dsa/DSAChecklist";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

export default function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const { cases } = useCases();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!open) return null;

  const q = query.toLowerCase().trim();

  // Filter cases
  const matchingCases = cases.filter(c =>
    c.caseId.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.suspectName.toLowerCase().includes(q)
  ).slice(0, 4);

  // Filter pages
  const pages: { view: View; title: string; category: string }[] = [
    { view: "dashboard", title: "Dashboard", category: "Case Management" },
    { view: "addCase", title: "New Case Form", category: "Case Management" },
    { view: "search", title: "Advanced Search", category: "Case Management" },
    { view: "investigate", title: "Investigate Suspects", category: "Case Management" },
    { view: "analytics", title: "Analytics & Metrics", category: "Case Management" },
    { view: "network", title: "Case Relationship Network", category: "Case Management" },
    { view: "timeline", title: "Investigation Timeline", category: "Case Management" },
    { view: "alerts", title: "Critical Alerts", category: "Case Management" },
    { view: "dsaLab", title: "DSA Intelligence Lab", category: "DSA Platform" },
    { view: "dsaChecklist", title: "PEP Syllabus Checklist (30 Topics)", category: "DSA Platform" },
    { view: "testCenter", title: "Automated Test Center", category: "Verification" },
  ];

  const matchingPages = pages.filter(p => p.title.toLowerCase().includes(q));

  // Filter DSA Topics
  const matchingTopics = pepTopics.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.dataStructure.toLowerCase().includes(q) ||
    t.keyAlgorithm.toLowerCase().includes(q)
  ).slice(0, 5);

  const totalResults = matchingPages.length + matchingCases.length + matchingTopics.length;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
          <Search size={18} className="text-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, case ID, suspect name, or DSA topic..."
            className="flex-1 bg-transparent text-foreground text-sm font-sans focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-4 text-xs font-sans">
          {/* Pages */}
          {matchingPages.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase px-2 mb-1 tracking-wider">Navigation & Views</p>
              <div className="space-y-0.5">
                {matchingPages.map((p) => (
                  <div
                    key={p.view}
                    onClick={() => { onNavigate(p.view); onClose(); }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-primary" />
                      <span className="font-semibold text-foreground">{p.title}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{p.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cases */}
          {matchingCases.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase px-2 mb-1 tracking-wider">Investigation Cases</p>
              <div className="space-y-0.5">
                {matchingCases.map((c) => (
                  <div
                    key={c.caseId}
                    onClick={() => { onNavigate("search"); onClose(); }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-mono text-primary font-bold mr-2">{c.caseId}</span>
                      <span className="font-semibold text-foreground">{c.title}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Suspect: {c.suspectName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DSA Topics */}
          {matchingTopics.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase px-2 mb-1 tracking-wider">DSA Topics & Algorithms</p>
              <div className="space-y-0.5">
                {matchingTopics.map((t) => (
                  <div
                    key={t.topicNumber}
                    onClick={() => { onNavigate("dsaLab"); onClose(); }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-emerald" />
                      <span className="font-semibold text-foreground">#{t.topicNumber}. {t.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-accent">{t.dataStructure}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-12 text-center text-muted-foreground text-xs italic">
              No matching commands or investigation data found for "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-secondary/50 border-t border-border flex justify-between text-[11px] text-muted-foreground font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 bg-card border rounded text-foreground">Esc</kbd> to exit</span>
          <span><kbd className="px-1.5 py-0.5 bg-card border rounded text-foreground">Ctrl+K</kbd> Command Palette</span>
        </div>
      </div>
    </div>
  );
}
