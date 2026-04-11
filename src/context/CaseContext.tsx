import React, { createContext, useContext, useState, useCallback, useRef } from "react";
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
import { sampleCases } from "@/lib/sampleData";

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
}

const CaseContext = createContext<CaseContextType | null>(null);

export function useCases() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCases must be used within CaseProvider");
  return ctx;
}

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const listRef = useRef<CaseLinkedList>(new CaseLinkedList());
  const [cases, setCases] = useState<CaseData[]>([]);
  const [initialized, setInitialized] = useState(false);

  if (!initialized) {
    const list = listRef.current;
    for (let i = sampleCases.length - 1; i >= 0; i--) {
      list.insert(sampleCases[i]);
    }
    setCases(list.toArray());
    setInitialized(true);
  }

  const refresh = useCallback(() => { setCases(listRef.current.toArray()); }, []);
  const addCase = useCallback((data: CaseData) => { listRef.current.insert(data); setCases(listRef.current.toArray()); }, []);
  const deleteCase = useCallback((id: string) => { listRef.current.deleteById(id); setCases(listRef.current.toArray()); }, []);
  const updateCase = useCallback((id: string, updates: Partial<CaseData>) => { listRef.current.updateCase(id, updates); setCases(listRef.current.toArray()); }, []);
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
        cases, listSize: listRef.current.size,
        addCase, deleteCase, updateCase, findById, findBySuspect, searchByKeyword,
        sortByPriority, sortByDate, analyzePatterns, findRelatedCases,
        buildRelationshipGraph, getTimeline, generateAlerts, advancedSearch, refresh,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}
