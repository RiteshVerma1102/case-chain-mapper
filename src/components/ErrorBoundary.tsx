import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary exception:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 text-foreground font-sans">
          <div className="max-w-md w-full p-8 rounded-2xl border border-destructive/30 bg-card shadow-2xl space-y-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight">Something went wrong</h2>
            <p className="text-xs text-muted-foreground">
              An unexpected application error occurred. The Error Boundary caught the failure to prevent a system crash.
            </p>
            {this.state.error && (
              <div className="p-3 bg-secondary rounded-lg border border-border text-[11px] font-mono text-destructive text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full intel-btn-primary justify-center text-xs py-2.5"
            >
              <RefreshCw size={14} className="mr-1.5" /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
