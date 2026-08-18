import { useState, useEffect } from "react";
import { CaseProvider, useCases } from "@/context/CaseContext";
import { CaseData } from "@/lib/LinkedList";
import InvestigationSidebar, { View } from "@/components/InvestigationSidebar";
import DashboardView from "@/components/DashboardView";
import AddCaseForm from "@/components/AddCaseForm";
import SearchPanel from "@/components/SearchPanel";
import InvestigatePanel from "@/components/InvestigatePanel";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import CaseNetworkView from "@/components/CaseNetworkView";
import TimelineView from "@/components/TimelineView";
import AlertsPanel from "@/components/AlertsPanel";
import SystemHeader from "@/components/SystemHeader";
import DSALab from "@/components/dsa/DSALab";
import CommandPalette from "@/components/CommandPalette";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import CaseReportView from "@/components/CaseReportView";

function MainApp() {
  const [view, setView] = useState<View>("dashboard");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [selectedReportCase, setSelectedReportCase] = useState<CaseData | null>(null);

  const { cases, undo, redo } = useCases();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      // Ctrl+Z Undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y or Ctrl+Shift+Z Redo
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault();
        redo();
      }
      // ? Keyboard Shortcuts Help
      if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const activeReportCase = selectedReportCase || cases[0];

  const handleOpenReport = (caseItem: CaseData) => {
    setSelectedReportCase(caseItem);
    setView("report");
  };

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardView />;
      case "addCase": return <AddCaseForm />;
      case "search": return <SearchPanel />;
      case "investigate": return <InvestigatePanel />;
      case "analytics": return <AnalyticsPanel />;
      case "network": return <CaseNetworkView />;
      case "timeline": return <TimelineView />;
      case "alerts": return <AlertsPanel />;
      case "report": return activeReportCase ? <CaseReportView caseData={activeReportCase} onBack={() => setView("search")} /> : <DashboardView />;
      case "dsaLab": return <DSALab defaultTopic="dashboard" />;
      case "dsaChecklist": return <DSALab defaultTopic="checklist" />;
      case "testCenter": return <DSALab defaultTopic="testcenter" />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background bg-dots relative">
      <InvestigationSidebar activeView={view} onViewChange={setView} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <SystemHeader
          onOpenCommandPalette={() => setCmdOpen(true)}
          onOpenShortcutsModal={() => setShortcutsOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={setView} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}

export default function Index() {
  return (
    <ErrorBoundary>
      <CaseProvider>
        <MainApp />
      </CaseProvider>
    </ErrorBoundary>
  );
}
