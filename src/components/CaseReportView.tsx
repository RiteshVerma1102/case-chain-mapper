import { useState } from "react";
import { CaseData } from "@/lib/LinkedList";
import { useCases } from "@/context/CaseContext";
import { generateCaseReportPDF, ReportType } from "@/lib/pdfReportGenerator";
import { ArrowLeft, Download, Printer, Share2, Cpu, GitBranch, Shield, Users, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Graph } from "@/dsa/graph/Graph";
import { useToast } from "@/hooks/use-toast";

interface CaseReportViewProps {
  caseData: CaseData;
  onBack: () => void;
  onSelectCase?: (caseId: string) => void;
}

export default function CaseReportView({ caseData, onBack, onSelectCase }: CaseReportViewProps) {
  const { cases, findRelatedCases } = useCases();
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType>("full");

  const related = findRelatedCases(caseData.caseId);

  // Build Adjacency List Graph for live traversal
  const graph = new Graph();
  cases.forEach((c) => graph.addVertex(c.caseId));
  cases.forEach((c) => {
    const rels = findRelatedCases(c.caseId);
    rels.forEach((rc) => graph.addEdge(c.caseId, rc.caseId));
  });

  const bfsOrder = graph.bfs(caseData.caseId);
  const dfsOrder = graph.dfs(caseData.caseId);

  const handleDownloadPDF = () => {
    generateCaseReportPDF({
      caseData,
      relatedCases: related,
      reportType,
      bfsTraversal: bfsOrder,
      dfsTraversal: dfsOrder,
    });
    toast({ title: "PDF Generated", description: `Downloaded Case_Report_${caseData.caseId}.pdf` });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const summary = `Case Report ${caseData.caseId}: ${caseData.title} | Suspect: ${caseData.suspectName} | Priority: ${caseData.priority} | Status: ${caseData.status}`;
    navigator.clipboard.writeText(summary);
    toast({ title: "Summary Copied", description: "Report text copied to clipboard" });
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans pb-16 print:p-0 print:space-y-6">
      {/* Top Action Bar (Hidden during Print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 print:hidden">
        <button onClick={onBack} className="intel-btn text-xs flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back to Case Details
        </button>

        <div className="flex items-center gap-2">
          {/* Report Scope Selector */}
          <div className="flex bg-secondary p-1 rounded-lg border border-border text-xs">
            <button
              onClick={() => setReportType("quick")}
              className={`px-3 py-1 rounded-md transition-all ${reportType === "quick" ? "bg-card text-foreground font-bold shadow-sm" : "text-muted-foreground"}`}
            >
              Quick
            </button>
            <button
              onClick={() => setReportType("full")}
              className={`px-3 py-1 rounded-md transition-all ${reportType === "full" ? "bg-card text-foreground font-bold shadow-sm" : "text-muted-foreground"}`}
            >
              Full Report
            </button>
            <button
              onClick={() => setReportType("dsa")}
              className={`px-3 py-1 rounded-md transition-all ${reportType === "dsa" ? "bg-card text-foreground font-bold shadow-sm" : "text-muted-foreground"}`}
            >
              DSA Analysis
            </button>
          </div>

          <button onClick={handleDownloadPDF} className="intel-btn-primary text-xs flex items-center gap-1.5">
            <Download size={14} /> Download PDF
          </button>
          <button onClick={handlePrint} className="intel-btn text-xs flex items-center gap-1.5">
            <Printer size={14} /> Print
          </button>
          <button onClick={handleShare} className="intel-btn text-xs flex items-center gap-1.5">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 pt-4 border-b border-border pb-8">
        <div className="flex items-center gap-2 font-mono text-xs text-primary font-semibold tracking-wider uppercase">
          <Shield size={14} /> Official Investigation Record • {reportType.toUpperCase()} MODE
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {caseData.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Case ID: <span className="font-mono font-bold text-foreground">{caseData.caseId}</span> • A connected investigation overview across cases, persons of interest, timeline events, and network algorithms.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs flex items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-semibold text-foreground">{caseData.status}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs flex items-center gap-2">
            <span className="text-muted-foreground">Priority:</span>
            <span className={`font-bold ${caseData.priority === "High" ? "text-destructive" : caseData.priority === "Medium" ? "text-amber-accent" : "text-emerald"}`}>
              {caseData.priority}
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs flex items-center gap-2">
            <span className="text-muted-foreground">Suspect:</span>
            <span className="font-semibold text-primary">{caseData.suspectName}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs flex items-center gap-2">
            <span className="text-muted-foreground">Connections:</span>
            <span className="font-mono font-bold text-emerald">{related.length} Linked Cases</span>
          </div>
        </div>
      </div>

      {/* 1. Case Overview & Executive Summary */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <FileText size={20} className="text-primary" /> Case Overview & Executive Summary
        </h2>
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3 leading-relaxed text-sm text-foreground/90">
          <p>
            Case <span className="font-mono font-bold text-primary">{caseData.caseId}</span> titled "{caseData.title}" was opened on <span className="font-mono">{caseData.date}</span> and is currently classified with <span className="font-bold">{caseData.priority}</span> priority.
          </p>
          <p className="text-muted-foreground">
            {caseData.description || "No additional text summary recorded for this investigation file."}
          </p>
          <p>
            Primary suspect of interest is identified as <span className="font-semibold text-accent">{caseData.suspectName}</span>. Investigation network mapping reveals <span className="font-semibold text-emerald">{related.length} direct related case connections</span> within the database.
          </p>
        </div>
      </div>

      {/* 2. People & Suspects */}
      {reportType !== "quick" && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Users size={20} className="text-accent" /> People & Suspect Identification
          </h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">Suspect Name</th>
                  <th className="p-3.5">Investigation Role</th>
                  <th className="p-3.5">Associated Case</th>
                  <th className="p-3.5">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                <tr className="bg-primary/5">
                  <td className="p-3.5 font-bold text-primary">{caseData.suspectName}</td>
                  <td className="p-3.5">Primary Target</td>
                  <td className="p-3.5 font-mono">{caseData.caseId}</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px]">{caseData.status}</span></td>
                </tr>
                {related.map((rc) => (
                  <tr key={rc.caseId}>
                    <td className="p-3.5 font-bold text-foreground">{rc.suspectName}</td>
                    <td className="p-3.5 text-muted-foreground">Associated Network Node</td>
                    <td className="p-3.5 font-mono text-accent">{rc.caseId}</td>
                    <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-[10px]">{rc.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Investigation Timeline */}
      {reportType !== "quick" && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Clock size={20} className="text-emerald" /> Investigation Timeline
          </h2>
          <div className="p-6 rounded-2xl border border-border bg-card space-y-6">
            <div className="relative border-l-2 border-primary/30 pl-6 space-y-6">
              <div className="relative">
                <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-card" />
                <p className="font-mono text-xs text-primary font-bold">{caseData.date}</p>
                <p className="font-bold text-sm text-foreground">Case File Created</p>
                <p className="text-xs text-muted-foreground">Case {caseData.caseId} filed into Singly Linked List data structure.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-accent border-4 border-card" />
                <p className="font-mono text-xs text-accent font-bold">{caseData.date}</p>
                <p className="font-bold text-sm text-foreground">Suspect Associated</p>
                <p className="text-xs text-muted-foreground">Primary suspect "{caseData.suspectName}" logged and indexed in Trie TrieNode dictionary.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald border-4 border-card" />
                <p className="font-mono text-xs text-emerald font-bold">Live Graph Engine</p>
                <p className="font-bold text-sm text-foreground">Relationship Mapping</p>
                <p className="text-xs text-muted-foreground">{related.length} direct related cases linked via Adjacency List graph edges.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Case Connections & Graph Traversal */}
      {(reportType === "full" || reportType === "dsa") && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <GitBranch size={20} className="text-primary" /> Case Connections & Network Graph Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3 font-mono text-xs">
              <p className="font-bold text-primary text-sm font-display">Breadth-First Search (BFS)</p>
              <p className="text-muted-foreground">Level-by-level traversal order starting at root Case {caseData.caseId}:</p>
              <div className="p-3 bg-secondary rounded-lg border border-border text-foreground font-bold text-xs break-all">
                {bfsOrder.length > 0 ? bfsOrder.join(" → ") : "No connected nodes"}
              </div>
              <p className="text-[11px] text-muted-foreground">Time Complexity: O(V + E) • Queue-based exploration</p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3 font-mono text-xs">
              <p className="font-bold text-accent text-sm font-display">Depth-First Search (DFS)</p>
              <p className="text-muted-foreground">Deep branch traversal order starting at root Case {caseData.caseId}:</p>
              <div className="p-3 bg-secondary rounded-lg border border-border text-foreground font-bold text-xs break-all">
                {dfsOrder.length > 0 ? dfsOrder.join(" → ") : "No connected nodes"}
              </div>
              <p className="text-[11px] text-muted-foreground">Time Complexity: O(V + E) • Stack/Recursive exploration</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. DSA Behind the Investigation */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Cpu size={20} className="text-emerald" /> Data Structures & Algorithms Behind Investigation
        </h2>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-secondary/60 text-muted-foreground border-b border-border uppercase tracking-wider font-mono">
              <tr>
                <th className="p-3.5">Data Structure / Algorithm</th>
                <th className="p-3.5">Investigation Purpose</th>
                <th className="p-3.5 font-mono">Time Complexity</th>
                <th className="p-3.5 font-mono">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              <tr>
                <td className="p-3.5 font-bold text-primary">Singly Linked List</td>
                <td className="p-3.5">Sequential storage & traversal of investigation case chain</td>
                <td className="p-3.5 font-mono text-emerald">O(1) Insert / O(n) Search</td>
                <td className="p-3.5 font-mono text-muted-foreground">O(n)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-accent">Adjacency List Graph</td>
                <td className="p-3.5">Models case-to-case relationship network</td>
                <td className="p-3.5 font-mono text-emerald">O(V + E)</td>
                <td className="p-3.5 font-mono text-muted-foreground">O(V + E)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-emerald">Breadth-First Search (BFS)</td>
                <td className="p-3.5">Explores closest related cases in network</td>
                <td className="p-3.5 font-mono text-emerald">O(V + E)</td>
                <td className="p-3.5 font-mono text-muted-foreground">O(V)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-amber-accent">Trie (Prefix Tree)</td>
                <td className="p-3.5">Live suspect & case title search autocomplete</td>
                <td className="p-3.5 font-mono text-emerald">O(L) per search</td>
                <td className="p-3.5 font-mono text-muted-foreground">O(Alphabet * N)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Key Findings & Final Summary */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 size={18} className="text-primary" /> Key Findings & Conclusion
        </h2>
        <ul className="space-y-2 text-xs text-foreground/90 font-sans list-disc list-inside">
          <li>Case {caseData.caseId} maintains <span className="font-bold">{related.length} verified connections</span> in the relationship graph.</li>
          <li>Primary suspect <span className="font-bold">{caseData.suspectName}</span> is actively indexed across investigation nodes.</li>
          <li>Algorithm traversal confirms network depth of <span className="font-mono font-bold text-primary">{bfsOrder.length} reachable nodes</span>.</li>
        </ul>
      </div>
    </div>
  );
}
