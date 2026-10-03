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
import { Graph } from "@/lib/Graph";
import { HistoryManager } from "@/lib/historyStack";
import { sampleCases, sampleEntities, sampleRelationships, sampleTimeline, sampleEvidence, sampleAlerts } from "@/lib/sampleData";
import { api } from "@/lib/api";
import { toast } from "sonner";

export interface EntityItem {
  entityId: string;
  name: string;
  type: string;
  description: string;
  metadata?: any;
  riskLevel?: string;
  relatedCases?: string[];
  tags?: string[];
  _id?: string;
}

export interface RelationshipItem {
  relationshipId: string;
  sourceEntity: string;
  targetEntity: string;
  type: string;
  strength: "strong" | "moderate" | "weak";
  caseId?: string;
  details?: string;
  direction?: string;
  _id?: string;
}

export interface EvidenceItem {
  evidenceId: string;
  name: string;
  type: string;
  description: string;
  caseId: string;
  uploadedBy?: string;
  status: "Collected" | "In Analysis" | "Verified" | "Archived";
  relatedEntities?: string[];
  relatedTimelineEvents?: string[];
  createdAt?: string;
  _id?: string;
}

export interface TimelineEventItem {
  eventId: string;
  caseId: string;
  title?: string;
  date: string;
  time: string;
  eventType: string;
  category?: string;
  significance?: string;
  description: string;
  relatedEntity?: string;
  relatedEvidence?: string;
  entitiesInvolved?: string[];
  location?: string;
  createdBy?: string;
  _id?: string;
}

interface CaseContextType {
  cases: CaseData[];
  entities: EntityItem[];
  relationships: RelationshipItem[];
  timeline: TimelineEventItem[];
  evidence: EvidenceItem[];
  alerts: Alert[];
  unreadAlertCount: number;
  listSize: number;
  loading: boolean;
  isBackendConnected: boolean;

  // Case Actions
  addCase: (data: Partial<CaseData>) => Promise<CaseData | null>;
  deleteCase: (id: string) => Promise<boolean>;
  updateCase: (id: string, updates: Partial<CaseData>) => Promise<boolean>;
  findById: (id: string) => CaseData | null;
  findBySuspect: (name: string) => CaseData[];
  searchByKeyword: (keyword: string) => CaseData[];
  sortByPriority: () => void;
  sortByDate: () => void;
  advancedSearch: (filters: SearchFilters) => CaseData[];
  findRelatedCases: (caseId: string) => CaseData[];
  analyzePatterns: () => PatternAnalysis;
  buildRelationshipGraph: () => RelationshipGraph;
  buildEntityGraph: () => Graph;
  getTimeline: () => CaseData[];

  // Entity Actions
  addEntity: (data: Partial<EntityItem>) => Promise<EntityItem | null>;
  deleteEntity: (id: string) => Promise<boolean>;

  // Relationship Actions
  addRelationship: (data: Partial<RelationshipItem>) => Promise<RelationshipItem | null>;
  deleteRelationship: (id: string) => Promise<boolean>;

  // Evidence Actions
  addEvidence: (data: Partial<EvidenceItem>) => Promise<EvidenceItem | null>;
  deleteEvidence: (id: string) => Promise<boolean>;

  // Timeline Actions
  addTimelineEvent: (data: Partial<TimelineEventItem>) => Promise<TimelineEventItem | null>;
  deleteTimelineEvent: (id: string) => Promise<boolean>;

  // Alert Actions
  markAlertRead: (id: string) => Promise<void>;
  markAllAlertsRead: () => Promise<void>;

  // History Stack (Undo/Redo)
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Data Controls
  resetData: () => Promise<void>;
  exportJSON: () => void;
  exportCSV: () => void;
  importJSON: (content: string) => boolean;
  refresh: () => Promise<void>;
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

  const [cases, setCases] = useState<CaseData[]>(() => sampleCases.map(c => ({ ...c, caseName: c.caseName || c.title })));
  const [entities, setEntities] = useState<EntityItem[]>(sampleEntities);
  const [relationships, setRelationships] = useState<RelationshipItem[]>(sampleRelationships);
  const [timeline, setTimeline] = useState<TimelineEventItem[]>(sampleTimeline);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(sampleEvidence);
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false });

  // Sync state to DSA Linked List
  const syncList = (arr: CaseData[]) => {
    const list = new CaseLinkedList();
    for (let i = arr.length - 1; i >= 0; i--) {
      const item = {
        ...arr[i],
        title: arr[i].title || (arr[i] as any).caseName || "Investigation Case",
        caseName: (arr[i] as any).caseName || arr[i].title || "Investigation Case",
      };
      list.insert(item);
    }
    listRef.current = list;
    const finalArr = list.toArray();
    setCases(finalArr);
    try {
      localStorage.setItem('casechain_cases', JSON.stringify(finalArr));
    } catch {}
    setHistoryState({
      canUndo: historyRef.current.canUndo(),
      canRedo: historyRef.current.canRedo(),
    });
  };

  // Load from backend API with fallback to localStorage or sampleData
  const loadAllData = useCallback(async () => {
    setLoading(true);
    let loadedFromApi = false;

    try {
      const [casesRes, entitiesRes, relsRes, timeRes, evRes, alertsRes] = await Promise.allSettled([
        api.get('/cases'),
        api.get('/entities'),
        api.get('/relationships'),
        api.get('/timeline'),
        api.get('/evidence'),
        api.get('/alerts'),
      ]);

      if (casesRes.status === 'fulfilled' && casesRes.value.cases && casesRes.value.cases.length > 0) {
        const fetchedCases: CaseData[] = casesRes.value.cases.map((c: any) => ({
          ...c,
          date: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '2026-04-01',
        }));

        // Merge any locally logged cases from localStorage for persistence
        const saved = localStorage.getItem('casechain_cases');
        if (saved) {
          try {
            const parsed: CaseData[] = JSON.parse(saved);
            parsed.forEach((sc) => {
              if (!fetchedCases.some((fc) => fc.caseId === sc.caseId)) {
                fetchedCases.push(sc);
              }
            });
          } catch {}
        }

        syncList(fetchedCases);
        loadedFromApi = true;
      }

      if (entitiesRes.status === 'fulfilled' && entitiesRes.value.entities) {
        setEntities(entitiesRes.value.entities);
      }
      if (relsRes.status === 'fulfilled' && relsRes.value.relationships) {
        setRelationships(relsRes.value.relationships);
      }
      if (timeRes.status === 'fulfilled' && timeRes.value.events) {
        setTimeline(timeRes.value.events);
      }
      if (evRes.status === 'fulfilled' && evRes.value.evidence) {
        setEvidence(evRes.value.evidence);
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value.alerts) {
        setAlerts(alertsRes.value.alerts);
      }

      if (loadedFromApi) {
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.warn('Backend unavailable, using local persistence / sample intelligence:', err);
    }

    if (!loadedFromApi) {
      // Check localStorage for offline persistence
      const saved = localStorage.getItem('casechain_cases');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            syncList(parsed);
          } else {
            syncList(sampleCases);
          }
        } catch {
          syncList(sampleCases);
        }
      } else {
        syncList(sampleCases);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Save to local storage for offline continuity
  useEffect(() => {
    if (cases.length > 0) {
      localStorage.setItem('casechain_cases', JSON.stringify(cases));
    }
  }, [cases]);

  // ============================================================
  // CASE ACTIONS
  // ============================================================
  const addCase = useCallback(async (data: Partial<CaseData>): Promise<CaseData | null> => {
    historyRef.current.pushSnapshot(cases);

    const year = new Date().getFullYear();
    const caseId = data.caseId || `CC-${year}-${(cases.length + 1).toString().padStart(3, '0')}`;
    const newCase: CaseData = {
      caseId,
      title: data.title || "Untitled Investigation",
      description: data.description || "",
      priority: data.priority || "Medium",
      status: data.status || "Under Investigation",
      suspectName: data.suspectName || "Unknown",
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || "Investigation",
      investigator: data.investigator || "Lead Investigator",
      progress: data.progress || 15,
      location: data.location || "Metro District",
      tags: data.tags || [],
    };

    // Optimistic UI update
    listRef.current.insert(newCase);
    const updated = listRef.current.toArray();
    syncList(updated);

    // Persist to backend if available
    try {
      const res = await api.post('/cases', newCase);
      if (res?.case) {
        toast.success(`Case ${caseId} created and synced to MongoDB`);
        return res.case;
      }
    } catch (err) {
      // Offline mode
      toast.success(`Case ${caseId} recorded in Linked List (Local)`);
    }

    return newCase;
  }, [cases]);

  const updateCase = useCallback(async (id: string, updates: Partial<CaseData>): Promise<boolean> => {
    historyRef.current.pushSnapshot(cases);

    const updated = listRef.current.updateCase(id, updates);
    if (updated) {
      syncList(listRef.current.toArray());
      try {
        await api.put(`/cases/${id}`, updates);
        toast.success(`Case ${id} updated in database`);
      } catch {
        toast.success(`Case ${id} updated`);
      }
      return true;
    }
    return false;
  }, [cases]);

  const deleteCase = useCallback(async (id: string): Promise<boolean> => {
    historyRef.current.pushSnapshot(cases);

    const deleted = listRef.current.deleteById(id);
    if (deleted) {
      syncList(listRef.current.toArray());
      try {
        await api.delete(`/cases/${id}`);
        toast.success(`Case ${id} deleted`);
      } catch {
        toast.success(`Case ${id} removed`);
      }
      return true;
    }
    return false;
  }, [cases]);

  const findById = useCallback((id: string) => listRef.current.findById(id), []);
  const findBySuspect = useCallback((name: string) => listRef.current.findBySuspect(name), []);
  const searchByKeyword = useCallback((keyword: string) => listRef.current.searchByKeyword(keyword), []);

  const sortByPriority = useCallback(() => {
    listRef.current.sort(compareByPriority);
    setCases(listRef.current.toArray());
    toast.info("Cases sorted by Priority (Merge Sort O(n log n))");
  }, []);

  const sortByDate = useCallback(() => {
    listRef.current.sort(compareByDate);
    setCases(listRef.current.toArray());
    toast.info("Cases sorted by Date (Merge Sort O(n log n))");
  }, []);

  const advancedSearch = useCallback((filters: SearchFilters) => listRef.current.advancedSearch(filters), []);
  const findRelatedCases = useCallback((caseId: string) => listRef.current.findRelatedCases(caseId), []);
  const analyzePatterns = useCallback(() => listRef.current.analyzePatterns(), []);
  const buildRelationshipGraph = useCallback(() => listRef.current.buildRelationshipGraph(), []);
  const getTimeline = useCallback(() => listRef.current.getTimeline(), []);

  // Build full Adjacency List Entity Graph
  const buildEntityGraph = useCallback((): Graph => {
    const g = new Graph();
    // Add all entities
    entities.forEach(e => g.addVertex(e.name));
    // Add all relationships
    relationships.forEach(r => {
      g.addEdge(r.sourceEntity, r.targetEntity, true, {
        type: r.type,
        strength: r.strength,
        details: r.details || "",
      });
    });
    return g;
  }, [entities, relationships]);

  // ============================================================
  // ENTITY ACTIONS
  // ============================================================
  const addEntity = useCallback(async (data: Partial<EntityItem>): Promise<EntityItem | null> => {
    const entityId = data.entityId || `ENT-${(entities.length + 1).toString().padStart(3, '0')}`;
    const newEnt: EntityItem = {
      entityId,
      name: data.name || "Unnamed Entity",
      type: data.type || "Person",
      description: data.description || "",
      metadata: data.metadata || {},
      riskLevel: data.riskLevel || "Medium",
      relatedCases: data.relatedCases || [],
      tags: data.tags || [],
    };

    setEntities(prev => [newEnt, ...prev]);

    try {
      const res = await api.post('/entities', newEnt);
      if (res?.entity) {
        toast.success(`Entity "${newEnt.name}" catalogued in database`);
        return res.entity;
      }
    } catch {
      toast.success(`Entity "${newEnt.name}" added`);
    }
    return newEnt;
  }, [entities]);

  const deleteEntity = useCallback(async (id: string): Promise<boolean> => {
    setEntities(prev => prev.filter(e => e.entityId !== id && e._id !== id));
    try {
      await api.delete(`/entities/${id}`);
      toast.success("Entity deleted");
    } catch {
      toast.success("Entity removed");
    }
    return true;
  }, []);

  // ============================================================
  // RELATIONSHIP ACTIONS
  // ============================================================
  const addRelationship = useCallback(async (data: Partial<RelationshipItem>): Promise<RelationshipItem | null> => {
    const relId = data.relationshipId || `REL-${(relationships.length + 1).toString().padStart(3, '0')}`;
    const newRel: RelationshipItem = {
      relationshipId: relId,
      sourceEntity: data.sourceEntity || "",
      targetEntity: data.targetEntity || "",
      type: data.type || "Associated with",
      strength: data.strength || "strong",
      caseId: data.caseId || "",
      details: data.details || "",
    };

    setRelationships(prev => [newRel, ...prev]);

    try {
      const res = await api.post('/relationships', newRel);
      if (res?.relationship) {
        toast.success(`Vector linked: ${newRel.sourceEntity} → ${newRel.targetEntity}`);
        return res.relationship;
      }
    } catch {
      toast.success(`Linked: ${newRel.sourceEntity} → ${newRel.targetEntity}`);
    }
    return newRel;
  }, [relationships]);

  const deleteRelationship = useCallback(async (id: string): Promise<boolean> => {
    setRelationships(prev => prev.filter(r => r.relationshipId !== id && r._id !== id));
    try {
      await api.delete(`/relationships/${id}`);
      toast.success("Relationship vector removed");
    } catch {
      toast.success("Relationship removed");
    }
    return true;
  }, []);

  // ============================================================
  // EVIDENCE ACTIONS
  // ============================================================
  const addEvidence = useCallback(async (data: Partial<EvidenceItem>): Promise<EvidenceItem | null> => {
    const evidenceId = data.evidenceId || `EVD-${(evidence.length + 1).toString().padStart(3, '0')}`;
    const newEv: EvidenceItem = {
      evidenceId,
      name: data.name || "Exhibit",
      type: data.type || "Digital Record",
      description: data.description || "",
      caseId: data.caseId || cases[0]?.caseId || "CASE-001",
      uploadedBy: data.uploadedBy || "Forensics Specialist",
      status: data.status || "Collected",
      relatedEntities: data.relatedEntities || [],
      createdAt: new Date().toISOString(),
    };

    setEvidence(prev => [newEv, ...prev]);

    try {
      const res = await api.post('/evidence', newEv);
      if (res?.evidence) {
        toast.success(`Evidence ${evidenceId} secured in database`);
        return res.evidence;
      }
    } catch {
      toast.success(`Evidence ${evidenceId} logged`);
    }
    return newEv;
  }, [evidence, cases]);

  const deleteEvidence = useCallback(async (id: string): Promise<boolean> => {
    setEvidence(prev => prev.filter(e => e.evidenceId !== id && e._id !== id));
    try {
      await api.delete(`/evidence/${id}`);
      toast.success("Evidence exhibit removed");
    } catch {
      toast.success("Evidence removed");
    }
    return true;
  }, []);

  // ============================================================
  // TIMELINE ACTIONS
  // ============================================================
  const addTimelineEvent = useCallback(async (data: Partial<TimelineEventItem>): Promise<TimelineEventItem | null> => {
    const eventId = data.eventId || `EVT-${(timeline.length + 1).toString().padStart(3, '0')}`;
    const newEvt: TimelineEventItem = {
      eventId,
      caseId: data.caseId || cases[0]?.caseId || "CASE-001",
      title: data.title || data.description || "Investigation Event",
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || "12:00 PM",
      eventType: data.eventType || data.category || "Incident",
      category: data.category || data.eventType || "Incident",
      significance: data.significance || "High",
      description: data.description || "",
      relatedEntity: data.relatedEntity || "",
      relatedEvidence: data.relatedEvidence || "",
      entitiesInvolved: data.entitiesInvolved || [],
      location: data.location || "Metro District",
    };

    setTimeline(prev => [newEvt, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    try {
      const res = await api.post('/timeline', newEvt);
      if (res?.event) {
        toast.success(`Timeline event ${eventId} saved`);
        return res.event;
      }
    } catch {
      toast.success(`Timeline event ${eventId} logged`);
    }
    return newEvt;
  }, [timeline, cases]);

  const deleteTimelineEvent = useCallback(async (id: string): Promise<boolean> => {
    setTimeline(prev => prev.filter(t => t.eventId !== id && t._id !== id));
    try {
      await api.delete(`/timeline/${id}`);
      toast.success("Event removed from timeline");
    } catch {
      toast.success("Event removed");
    }
    return true;
  }, []);

  // ============================================================
  // ALERT ACTIONS
  // ============================================================
  const markAlertRead = useCallback(async (id: string) => {
    setAlerts(prev => prev.map(a => (a.alertId === id ? { ...a, isRead: true } : a)));
    try {
      await api.put(`/alerts/${id}/read`);
    } catch {}
  }, []);

  const markAllAlertsRead = useCallback(async () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    try {
      await api.put('/alerts/mark-all-read');
      toast.success("All alerts marked as read");
    } catch {}
  }, []);

  const unreadAlertCount = alerts.filter(a => !a.isRead).length;

  // ============================================================
  // UNDO / REDO (STACK DSA)
  // ============================================================
  const undo = useCallback(() => {
    const previous = historyRef.current.undo(cases);
    if (previous) {
      syncList(previous);
      toast.info("Reverted to previous state (Stack Undo Ctrl+Z)");
    }
  }, [cases]);

  const redo = useCallback(() => {
    const next = historyRef.current.redo(cases);
    if (next) {
      syncList(next);
      toast.info("Restored state (Stack Redo Ctrl+Y)");
    }
  }, [cases]);

  // ============================================================
  // DATA MANAGEMENT & EXPORT/IMPORT
  // ============================================================
  const resetData = useCallback(async () => {
    historyRef.current.pushSnapshot(cases);
    setLoading(true);

    try {
      // Trigger backend database seeding if available
      await api.post('/seed');
      await loadAllData();
      toast.success("Demo dataset fully restored from database!");
    } catch {
      syncList(sampleCases);
      setEntities(sampleEntities);
      setRelationships(sampleRelationships);
      setTimeline(sampleTimeline);
      setEvidence(sampleEvidence);
      setAlerts(sampleAlerts);
      localStorage.removeItem('casechain_cases');
      toast.success("Demo intelligence dataset restored (Offline)");
    } finally {
      setLoading(false);
    }
  }, [cases, loadAllData]);

  const exportJSON = useCallback(() => {
    const exportData = {
      cases,
      entities,
      relationships,
      timeline,
      evidence,
      exportedAt: new Date().toISOString(),
      platform: "CaseChain",
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `casechain_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CaseChain intelligence dataset exported (JSON)");
  }, [cases, entities, relationships, timeline, evidence]);

  const exportCSV = useCallback(() => {
    const headers = ["Case ID", "Title", "Category", "Priority", "Status", "Suspect", "Investigator", "Date", "Location"];
    const rows = cases.map(c => [
      `"${c.caseId}"`,
      `"${(c.title || "").replace(/"/g, '""')}"`,
      `"${c.category || ""}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${(c.suspectName || "").replace(/"/g, '""')}"`,
      `"${(c.investigator || "").replace(/"/g, '""')}"`,
      `"${c.date}"`,
      `"${(c.location || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `casechain_cases_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Case records exported to CSV");
  }, [cases]);

  const importJSON = useCallback((content: string): boolean => {
    try {
      const data = JSON.parse(content);
      const importedCases = data.cases || (Array.isArray(data) ? data : null);

      if (!importedCases || !Array.isArray(importedCases) || importedCases.length === 0) {
        toast.error("Invalid CaseChain JSON format: No cases array found");
        return false;
      }

      historyRef.current.pushSnapshot(cases);
      syncList(importedCases);
      if (data.entities && Array.isArray(data.entities)) setEntities(data.entities);
      if (data.relationships && Array.isArray(data.relationships)) setRelationships(data.relationships);
      if (data.timeline && Array.isArray(data.timeline)) setTimeline(data.timeline);
      if (data.evidence && Array.isArray(data.evidence)) setEvidence(data.evidence);

      toast.success(`Successfully imported ${importedCases.length} cases into CaseChain!`);
      return true;
    } catch (err: any) {
      toast.error(`Import failed: ${err.message || 'JSON parse error'}`);
      return false;
    }
  }, [cases]);

  return (
    <CaseContext.Provider
      value={{
        cases,
        entities,
        relationships,
        timeline,
        evidence,
        alerts,
        unreadAlertCount,
        listSize: listRef.current.size,
        loading,
        isBackendConnected,
        addCase,
        deleteCase,
        updateCase,
        findById,
        findBySuspect,
        searchByKeyword,
        sortByPriority,
        sortByDate,
        advancedSearch,
        findRelatedCases,
        analyzePatterns,
        buildRelationshipGraph,
        buildEntityGraph,
        getTimeline,
        addEntity,
        deleteEntity,
        addRelationship,
        deleteRelationship,
        addEvidence,
        deleteEvidence,
        addTimelineEvent,
        deleteTimelineEvent,
        markAlertRead,
        markAllAlertsRead,
        undo,
        redo,
        canUndo: historyState.canUndo,
        canRedo: historyState.canRedo,
        resetData,
        exportJSON,
        exportCSV,
        importJSON,
        refresh: loadAllData,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}
