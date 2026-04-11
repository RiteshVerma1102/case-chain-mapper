import { useState } from "react";
import { CaseProvider } from "@/context/CaseContext";
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

const viewComponents: Record<View, React.ComponentType> = {
  dashboard: DashboardView,
  addCase: AddCaseForm,
  search: SearchPanel,
  investigate: InvestigatePanel,
  analytics: AnalyticsPanel,
  network: CaseNetworkView,
  timeline: TimelineView,
  alerts: AlertsPanel,
};

export default function Index() {
  const [view, setView] = useState<View>("dashboard");
  const ActiveView = viewComponents[view];

  return (
    <CaseProvider>
      <div className="flex min-h-screen w-full bg-background bg-dots relative">
        <InvestigationSidebar activeView={view} onViewChange={setView} />

        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <SystemHeader />
          <main className="flex-1 overflow-auto">
            <div className="p-6 md:p-8 max-w-7xl">
              <ActiveView />
            </div>
          </main>
        </div>
      </div>
    </CaseProvider>
  );
}
