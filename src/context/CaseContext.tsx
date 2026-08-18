import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import {
  CaseLinkedList,
  CaseData,
  PatternAnalysis,
  Alert,
  SearchFilters,
  RelationshipGraph,
  compareByPriority,
  compareByDate,
} from "@/lib/LinkedList";
import {
  loadCasesFromStorage,
  saveCasesToStorage,
  resetDemoData,
  exportCasesToJSON,
  exportCasesToCSV,
  importCasesFromJSON,
} from "@/lib/persistence";
import { HistoryManager } from "@/lib/historyStack";
import { useToast } from "@/hooks/use-toast";

interface CaseContextType {
  cases: CaseData[];
  listSize: number;
  addCase: (data: CaseData) => void;
  deleteCase: (id: string) => void;
  updateCase: (id: string, updates: Partial<CaseData>) => void;
  findById: (id: string) => CaseData | null;
  findBySuspect: (name: string) => CaseData[];
  searchByKeyword: (keyword: string) => CaseData[];
  sortByPriority: () => void;
  sortByDate: () => void;
  analyzePatterns: () => PatternAnalysis;
  findRelatedCases: (caseId: string) => CaseData[];
  buildRelationshipGraph: () => RelationshipGraph;
  getTimeline: () => CaseData[];
  generateAlerts: () => Alert[];
  advancedSearch: (filters: SearchFilters) => CaseData[];
  refresh: () => void;

  // History Stack (Undo/Redo)
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Persistence & Data Controls
  resetData: () => void;
  exportJSON: () => void;
  exportCSV: () => void;
  importJSON: (content: string) => boolean;
}

const CaseContext = createContext<CaseContextType | null>(null);

export function useCases() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCases must be used within CaseProvider");
  return ctx;
}

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const listRef = useRef<CaseLinkedList>(new CaseLinkedList());
  const historyRef = useRef<HistoryManager>(new HistoryManager());
  const { toast } = useToast();

  const [cases, setCases] = useState<CaseData[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  const syncListWithArray = (arr: CaseData[]) => {
    const list = new CaseLinkedList();
    for (let i = arr.length - 1; i >= 0; i--) {
      list.insert(arr[i]);
    }
    listRef.current = list;
    const currentArray = list.toArray();
    setCases(currentArray);
    saveCasesToStorage(currentArray);
    setHistoryState({
      canUndo: historyRef.current.canUndo(),
      canRedo: historyRef.current.canRedo(),
    });
  };

  useEffect(() => {
    if (!initialized) {
      const initial = loadCasesFromStorage();
      syncListWithArray(initial);
      setInitialized(true);
    }
  }, [initialized]);

  const refresh = useCallback(() => {
    setCases(listRef.current.toArray());
  }, []);

  const addCase = useCallback((data: CaseData) => {
    historyRef.current.pushSnapshot(listRef.current.toArray());
    listRef.current.insert(data);
    syncListWithArray(listRef.current.toArray());
    toast({ title: "Case Added", description: `${data.caseId} stored in Linked List` });
  }, [toast]);

  const deleteCase = useCallback((id: string) => {
    historyRef.current.pushSnapshot(listRef.current.toArray());
    const deleted = listRef.current.deleteById(id);
    if (deleted) {
      syncListWithArray(listRef.current.toArray());
      toast({ title: "Case Deleted", description: `Case ${id} removed from list` });
    }
  }, [toast]);

  const updateCase = useCallback((id: string, updates: Partial<CaseData>) => {
    historyRef.current.pushSnapshot(listRef.current.toArray());
    const updated = listRef.current.updateCase(id, updates);
    if (updated) {
      syncListWithArray(listRef.current.toArray());
      toast({ title: "Case Updated", description: `Case ${id} updated` });
    }
  }, [toast]);

  const undo = useCallback(() => {
    const previous = historyRef.current.undo(listRef.current.toArray());
    if (previous) {
      syncListWithArray(previous);
      toast({ title: "Undo Action", description: "Reverted to previous state" });
    }
  }, [toast]);

  const redo = useCallback(() => {
    const next = historyRef.current.redo(listRef.current.toArray());
    if (next) {
      syncListWithArray(next);
      toast({ title: "Redo Action", description: "Restored state" });
    }
  }, [toast]);

  const resetData = useCallback(() => {
    historyRef.current.pushSnapshot(listRef.current.toArray());
    const resetList = resetDemoData();
    syncListWithArray(resetList);
    toast({ title: "Demo Data Restored", description: "Sample cases reloaded" });
  }, [toast]);

  const exportJSON = useCallback(() => {
    exportCasesToJSON(cases);
    toast({ title: "Export Complete", description: "Downloaded case_chain_export.json" });
  }, [cases, toast]);

  const exportCSV = useCallback(() => {
    exportCasesToCSV(cases);
    toast({ title: "Export Complete", description: "Downloaded case_chain_export.csv" });
  }, [cases, toast]);

  const importJSON = useCallback((content: string): boolean => {
    const res = importCasesFromJSON(content);
    if (res.success && res.cases) {
      historyRef.current.pushSnapshot(listRef.current.toArray());
      syncListWithArray(res.cases);
      toast({ title: "Import Successful", description: `Loaded ${res.cases.length} cases` });
      return true;
    } else {
      toast({ variant: "destructive", title: "Import Failed", description: res.error || "Invalid file" });
      return false;
    }
  }, [toast]);

  const findById = useCallback((id: string) => listRef.current.findById(id), []);
  const findBySuspect = useCallback((name: string) => listRef.current.findBySuspect(name), []);
  const searchByKeyword = useCallback((keyword: string) => listRef.current.searchByKeyword(keyword), []);
  const sortByPriority = useCallback(() => { listRef.current.sort(compareByPriority); setCases(listRef.current.toArray()); }, []);
  const sortByDate = useCallback(() => { listRef.current.sort(compareByDate); setCases(listRef.current.toArray()); }, []);
  const analyzePatterns = useCallback(() => listRef.current.analyzePatterns(), []);
  const findRelatedCases = useCallback((caseId: string) => listRef.current.findRelatedCases(caseId), []);
  const buildRelationshipGraph = useCallback(() => listRef.current.buildRelationshipGraph(), []);
  const getTimeline = useCallback(() => listRef.current.getTimeline(), []);
  const generateAlerts = useCallback(() => listRef.current.generateAlerts(), []);
  const advancedSearch = useCallback((filters: SearchFilters) => listRef.current.advancedSearch(filters), []);

  return (
    <CaseContext.Provider
      value={{
        cases,
        listSize: listRef.current.size,
        addCase,
        deleteCase,
        updateCase,
        findById,
        findBySuspect,
        searchByKeyword,
        sortByPriority,
        sortByDate,
        analyzePatterns,
        findRelatedCases,
        buildRelationshipGraph,
        getTimeline,
        generateAlerts,
        advancedSearch,
        refresh,
        undo,
        redo,
        canUndo: historyState.canUndo,
        canRedo: historyState.canRedo,
        resetData,
        exportJSON,
        exportCSV,
        importJSON,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}
