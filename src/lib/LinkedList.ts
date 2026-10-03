/**
 * ============================================================
 * LINKED LIST DATA STRUCTURE FOR CASECHAIN INVESTIGATION
 * ============================================================
 * 
 * Singly Linked List data structure to store and analyze cases.
 * Provides:
 * - O(1) insertion at head
 * - Recursive Search (find by ID, find by suspect)
 * - Merge Sort on Linked List (O(n log n)) for date and priority
 * - Pattern Analysis & Cross-case entity detection via traversal
 */

export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Status = "New" | "Under Investigation" | "On Hold" | "Resolved" | "Closed" | "Open";

export interface CaseData {
  caseId: string;
  title: string;
  caseName?: string;
  description: string;
  priority: Priority;
  status: Status;
  suspectName: string;
  date: string; // ISO date string or YYYY-MM-DD
  category?: string;
  investigator?: string;
  deadline?: string;
  progress?: number;
  location?: string;
  tags?: string[];
  _id?: string;
}

export class CaseNode {
  data: CaseData;
  next: CaseNode | null;

  constructor(data: CaseData) {
    this.data = data;
    this.next = null;
  }
}

export interface PatternAnalysis {
  totalCases: number;
  suspectFrequency: Record<string, number>;
  topKeywords: [string, number][];
  priorityCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  mostFrequentSuspect: { name: string; count: number } | null;
  insights: string[];
}

export interface CaseConnection {
  from: string;
  to: string;
  suspect: string;
  strength: "strong" | "moderate";
}

export interface RelationshipGraph {
  suspectMap: Map<string, CaseData[]>;
  connections: CaseConnection[];
}

export interface Alert {
  alertId?: string;
  type: "critical" | "warning" | "info" | "high";
  title: string;
  message: string;
  relatedCases?: CaseData[] | string[];
  caseId?: string;
  category?: string;
  isRead?: boolean;
}

export interface SearchFilters {
  keyword?: string;
  priority?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Comparators for sorting
export const compareByPriority = (a: CaseData, b: CaseData): number => {
  const rank: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  return (rank[b.priority] || 0) - (rank[a.priority] || 0);
};

export const compareByDate = (a: CaseData, b: CaseData): number => {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
};

export class CaseLinkedList {
  head: CaseNode | null;
  private _size: number;

  constructor() {
    this.head = null;
    this._size = 0;
  }

  get size(): number {
    return this._size;
  }

  insert(data: CaseData): void {
    const newNode = new CaseNode(data);
    newNode.next = this.head;
    this.head = newNode;
    this._size++;
  }

  deleteById(caseId: string): boolean {
    if (!this.head) return false;

    if (this.head.data.caseId === caseId) {
      this.head = this.head.next;
      this._size--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data.caseId === caseId) {
        current.next = current.next.next;
        this._size--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  updateCase(caseId: string, updates: Partial<CaseData>): boolean {
    const node = this._findNodeById(this.head, caseId);
    if (node) {
      node.data = { ...node.data, ...updates };
      return true;
    }
    return false;
  }

  findById(caseId: string): CaseData | null {
    const node = this._findNodeById(this.head, caseId);
    return node ? node.data : null;
  }

  private _findNodeById(node: CaseNode | null, caseId: string): CaseNode | null {
    if (!node) return null;
    if (node.data.caseId.toLowerCase() === caseId.toLowerCase()) return node;
    return this._findNodeById(node.next, caseId);
  }

  findBySuspect(suspectName: string): CaseData[] {
    const results: CaseData[] = [];
    this._findBySuspectRecursive(this.head, suspectName.toLowerCase().trim(), results);
    return results;
  }

  private _findBySuspectRecursive(node: CaseNode | null, suspect: string, results: CaseData[]): void {
    if (!node) return;
    if (node.data.suspectName.toLowerCase().trim().includes(suspect)) {
      results.push(node.data);
    }
    this._findBySuspectRecursive(node.next, suspect, results);
  }

  searchByKeyword(keyword: string): CaseData[] {
    const results: CaseData[] = [];
    const term = keyword.toLowerCase().trim();
    if (!term) return this.toArray();

    let current = this.head;
    while (current) {
      const c = current.data;
      if (
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.caseId.toLowerCase().includes(term) ||
        c.suspectName.toLowerCase().includes(term)
      ) {
        results.push(c);
      }
      current = current.next;
    }
    return results;
  }

  toArray(): CaseData[] {
    const arr: CaseData[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  // MERGE SORT ON LINKED LIST (O(n log n))
  sort(comparator: (a: CaseData, b: CaseData) => number): void {
    if (!this.head || !this.head.next) return;
    this.head = this._mergeSort(this.head, comparator);
  }

  private _mergeSort(head: CaseNode | null, cmp: (a: CaseData, b: CaseData) => number): CaseNode | null {
    if (!head || !head.next) return head;

    const middle = this._getMiddle(head);
    const nextOfMiddle = middle.next;
    middle.next = null;

    const left = this._mergeSort(head, cmp);
    const right = this._mergeSort(nextOfMiddle, cmp);

    return this._sortedMerge(left, right, cmp);
  }

  private _getMiddle(head: CaseNode): CaseNode {
    let slow: CaseNode = head;
    let fast: CaseNode | null = head.next;
    while (fast && fast.next) {
      slow = slow.next!;
      fast = fast.next.next;
    }
    return slow;
  }

  private _sortedMerge(
    a: CaseNode | null,
    b: CaseNode | null,
    cmp: (a: CaseData, b: CaseData) => number
  ): CaseNode | null {
    if (!a) return b;
    if (!b) return a;

    let result: CaseNode;
    if (cmp(a.data, b.data) <= 0) {
      result = a;
      result.next = this._sortedMerge(a.next, b, cmp);
    } else {
      result = b;
      result.next = this._sortedMerge(a, b.next, cmp);
    }
    return result;
  }

  // PATTERN ANALYSIS
  analyzePatterns(): PatternAnalysis {
    let totalCases = 0;
    const suspectFrequency: Record<string, number> = {};
    const keywordFrequency: Record<string, number> = {};
    const priorityCounts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    const statusCounts: Record<string, number> = {
      New: 0,
      'Under Investigation': 0,
      'On Hold': 0,
      Resolved: 0,
      Closed: 0,
      Open: 0,
    };

    let current = this.head;
    while (current) {
      totalCases++;
      const c = current.data;

      // Suspect frequency
      if (c.suspectName && c.suspectName !== 'Unknown') {
        const key = c.suspectName.trim();
        suspectFrequency[key] = (suspectFrequency[key] || 0) + 1;
      }

      // Keyword frequency
      const words = `${c.title} ${c.description}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);
      for (const word of words) {
        keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
      }

      if (priorityCounts[c.priority] !== undefined) priorityCounts[c.priority]++;
      if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;

      current = current.next;
    }

    let mostFrequentSuspect = "";
    let maxFreq = 0;
    for (const [suspect, count] of Object.entries(suspectFrequency)) {
      if (count > maxFreq) {
        maxFreq = count;
        mostFrequentSuspect = suspect;
      }
    }

    const commonWords = new Set(["this", "that", "with", "from", "have", "been", "were", "they", "their", "case", "the", "into"]);
    const topKeywords: [string, number][] = Object.entries(keywordFrequency)
      .filter(([word]) => !commonWords.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) as [string, number][];

    const insights: string[] = [];
    if (mostFrequentSuspect && maxFreq > 1) {
      insights.push(`Cross-Case Pattern: Suspect "${mostFrequentSuspect}" is connected to ${maxFreq} active cases.`);
    }
    if ((priorityCounts.Critical + priorityCounts.High) > totalCases * 0.4 && totalCases > 2) {
      insights.push("High/Critical-priority investigations are dominating the active caseload.");
    }
    const openCount = (statusCounts['Under Investigation'] || 0) + (statusCounts.New || 0) + (statusCounts.Open || 0);
    if (openCount > 3) {
      insights.push(`Active Velocity: ${openCount} investigations currently active in the intelligence pipeline.`);
    }

    return {
      totalCases,
      suspectFrequency,
      topKeywords,
      priorityCounts,
      statusCounts,
      mostFrequentSuspect: mostFrequentSuspect ? { name: mostFrequentSuspect, count: maxFreq } : null,
      insights,
    };
  }

  // SMART CASE RECOMMENDATIONS / RELATED CASES
  findRelatedCases(caseId: string, maxResults: number = 5): CaseData[] {
    const targetNode = this._findNodeById(this.head, caseId);
    if (!targetNode) return [];

    const target = targetNode.data;
    const targetWords = new Set(
      `${target.title} ${target.description}`.toLowerCase()
        .replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3)
    );

    const scored: { data: CaseData; score: number }[] = [];
    this._scoreRelatedRecursive(this.head, target, targetWords, scored);

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxResults).map(s => s.data);
  }

  private _scoreRelatedRecursive(
    node: CaseNode | null,
    target: CaseData,
    targetWords: Set<string>,
    results: { data: CaseData; score: number }[]
  ): void {
    if (!node) return;
    if (node.data.caseId !== target.caseId) {
      let score = 0;
      if (node.data.suspectName && target.suspectName && node.data.suspectName.toLowerCase().trim() === target.suspectName.toLowerCase().trim()) {
        score += 10;
      }
      if (node.data.category && target.category && node.data.category === target.category) {
        score += 4;
      }
      if (node.data.priority === target.priority) {
        score += 2;
      }
      const words = `${node.data.title} ${node.data.description}`.toLowerCase()
        .replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3);
      for (const w of words) {
        if (targetWords.has(w)) score += 3;
      }
      if (score > 0) results.push({ data: node.data, score });
    }
    this._scoreRelatedRecursive(node.next, target, targetWords, results);
  }

  buildRelationshipGraph(): RelationshipGraph {
    const suspectMap = new Map<string, CaseData[]>();
    const connections: CaseConnection[] = [];

    let current = this.head;
    while (current) {
      const key = current.data.suspectName.toLowerCase().trim();
      if (key && key !== 'unknown') {
        if (!suspectMap.has(key)) suspectMap.set(key, []);
        suspectMap.get(key)!.push(current.data);
      }
      current = current.next;
    }

    for (const [suspect, group] of suspectMap.entries()) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          connections.push({
            from: group[i].caseId,
            to: group[j].caseId,
            suspect,
            strength: group.length >= 3 ? "strong" : "moderate",
          });
        }
      }
    }

    return { suspectMap, connections };
  }

  getTimeline(): CaseData[] {
    const clone = new CaseLinkedList();
    const arr = this.toArray();
    for (let i = arr.length - 1; i >= 0; i--) clone.insert(arr[i]);
    clone.sort(compareByDate);
    return clone.toArray();
  }

  generateAlerts(): Alert[] {
    const alerts: Alert[] = [];
    const analysis = this.analyzePatterns();

    if ((analysis.priorityCounts.Critical || 0) + (analysis.priorityCounts.High || 0) >= 2) {
      alerts.push({
        type: "critical",
        title: "Multiple High/Critical Cases Active",
        message: `${(analysis.priorityCounts.Critical || 0) + (analysis.priorityCounts.High || 0)} priority investigations require active coordination.`,
        relatedCases: this._collectByPriority(this.head, "High", []),
      });
    }

    for (const [suspect, count] of Object.entries(analysis.suspectFrequency)) {
      if (count >= 2) {
        alerts.push({
          type: "warning",
          title: `Repeat Person of Interest: ${suspect}`,
          message: `"${suspect}" is linked to ${count} distinct cases. Cross-case nexus identified.`,
          relatedCases: this.findBySuspect(suspect),
        });
      }
    }

    return alerts;
  }

  private _collectByPriority(node: CaseNode | null, priority: Priority, results: CaseData[]): CaseData[] {
    if (!node) return results;
    if (node.data.priority === priority || (priority === 'High' && node.data.priority === 'Critical')) {
      results.push(node.data);
    }
    return this._collectByPriority(node.next, priority, results);
  }

  advancedSearch(filters: SearchFilters): CaseData[] {
    const results: CaseData[] = [];
    let current = this.head;
    while (current) {
      const c = current.data;
      let match = true;

      if (filters.keyword && filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase().trim();
        const text = `${c.caseId} ${c.title} ${c.description} ${c.suspectName}`.toLowerCase();
        if (!text.includes(kw)) match = false;
      }

      if (filters.priority && filters.priority !== 'All' && c.priority !== filters.priority) {
        match = false;
      }

      if (filters.status && filters.status !== 'All' && c.status !== filters.status) {
        match = false;
      }

      if (filters.category && filters.category !== 'All' && c.category !== filters.category) {
        match = false;
      }

      if (match) results.push(c);
      current = current.next;
    }
    return results;
  }
}
