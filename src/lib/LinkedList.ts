/**
 * ============================================================
 * LINKED LIST DATA STRUCTURE FOR CASE MANAGEMENT
 * ============================================================
 * 
 * This module implements a custom Singly Linked List to store
 * investigation cases. Arrays are NOT used for primary storage.
 * 
 * KEY DSA CONCEPTS DEMONSTRATED:
 * - Linked List: insert, delete, traverse, search
 * - Merge Sort on Linked List (O(n log n))
 * - Recursive Search (find by ID, find by suspect)
 * - Pattern Analysis via traversal
 */

// ─── Types ───────────────────────────────────────────────────

export type Priority = "High" | "Medium" | "Low";
export type Status = "Open" | "Closed";

export interface CaseData {
  caseId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  suspectName: string;
  date: string; // ISO date string
}

/**
 * Node class for the Singly Linked List.
 * Each node holds one investigation case and a pointer to the next node.
 */
export class CaseNode {
  data: CaseData;
  next: CaseNode | null;

  constructor(data: CaseData) {
    this.data = data;
    this.next = null;
  }
}

/**
 * Singly Linked List for storing investigation cases.
 * Provides O(1) insertion at head, O(n) search/delete.
 */
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

  // ─── INSERT ──────────────────────────────────────────────

  /**
   * Insert a new case at the head of the linked list.
   * Time Complexity: O(1)
   */
  insert(data: CaseData): void {
    const newNode = new CaseNode(data);
    newNode.next = this.head;
    this.head = newNode;
    this._size++;
  }

  // ─── DELETE ──────────────────────────────────────────────

  /**
   * Delete a case by its ID.
   * Time Complexity: O(n) — must traverse to find the node.
   */
  deleteById(caseId: string): boolean {
    if (!this.head) return false;

    // Special case: deleting the head
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

  // ─── UPDATE ──────────────────────────────────────────────

  updateCase(caseId: string, updates: Partial<CaseData>): boolean {
    const node = this._findNodeById(this.head, caseId);
    if (node) {
      node.data = { ...node.data, ...updates };
      return true;
    }
    return false;
  }

  // ─── RECURSIVE SEARCH ────────────────────────────────────

  /**
   * RECURSION: Search for a case by ID using recursive traversal.
   * Base case: node is null (not found) or node matches.
   * Recursive case: search the next node.
   */
  findById(caseId: string): CaseData | null {
    const node = this._findNodeById(this.head, caseId);
    return node ? node.data : null;
  }

  private _findNodeById(node: CaseNode | null, caseId: string): CaseNode | null {
    // Base case: end of list
    if (!node) return null;
    // Base case: found
    if (node.data.caseId === caseId) return node;
    // Recursive case: check next node
    return this._findNodeById(node.next, caseId);
  }

  /**
   * RECURSION: Find ALL cases linked to a specific suspect.
   * Recursively traverses the entire list, collecting matches.
   */
  findBySuspect(suspectName: string): CaseData[] {
    const results: CaseData[] = [];
    this._findBySuspectRecursive(this.head, suspectName.toLowerCase(), results);
    return results;
  }

  private _findBySuspectRecursive(
    node: CaseNode | null,
    suspect: string,
    results: CaseData[]
  ): void {
    // Base case: end of list
    if (!node) return;
    // Check if this node's suspect matches
    if (node.data.suspectName.toLowerCase().includes(suspect)) {
      results.push(node.data);
    }
    // Recursive case: continue to next node
    this._findBySuspectRecursive(node.next, suspect, results);
  }

  /**
   * RECURSION: Search cases by keyword in title or description.
   */
  searchByKeyword(keyword: string): CaseData[] {
    const results: CaseData[] = [];
    this._searchKeywordRecursive(this.head, keyword.toLowerCase(), results);
    return results;
  }

  private _searchKeywordRecursive(
    node: CaseNode | null,
    keyword: string,
    results: CaseData[]
  ): void {
    if (!node) return;
    const { title, description } = node.data;
    if (
      title.toLowerCase().includes(keyword) ||
      description.toLowerCase().includes(keyword)
    ) {
      results.push(node.data);
    }
    this._searchKeywordRecursive(node.next, keyword, results);
  }

  // ─── CONVERT TO ARRAY (for rendering only) ──────────────

  /**
   * Convert linked list to array for React rendering.
   * The linked list remains the source of truth.
   */
  toArray(): CaseData[] {
    const arr: CaseData[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.data);
      current = current.next;
    }
    return arr;
  }

  // ─── MERGE SORT ON LINKED LIST ───────────────────────────

  /**
   * MERGE SORT: Sort the linked list in-place.
   * Time Complexity: O(n log n)
   * Space Complexity: O(log n) for recursion stack
   * 
   * This is a proper linked list merge sort — it splits the list
   * using the slow/fast pointer technique, recursively sorts both
   * halves, and merges them back together.
   */
  sort(compareFn: (a: CaseData, b: CaseData) => number): void {
    this.head = this._mergeSort(this.head, compareFn);
  }

  private _mergeSort(
    head: CaseNode | null,
    compareFn: (a: CaseData, b: CaseData) => number
  ): CaseNode | null {
    // Base case: 0 or 1 elements — already sorted
    if (!head || !head.next) return head;

    // Split the list into two halves using slow/fast pointers
    const mid = this._getMiddle(head);
    const secondHalf = mid.next;
    mid.next = null; // Cut the list

    // Recursively sort both halves
    const left = this._mergeSort(head, compareFn);
    const right = this._mergeSort(secondHalf, compareFn);

    // Merge the sorted halves
    return this._merge(left, right, compareFn);
  }

  /**
   * Find the middle node using the slow/fast pointer technique.
   * Slow moves 1 step, fast moves 2 steps.
   */
  private _getMiddle(head: CaseNode): CaseNode {
    let slow = head;
    let fast = head.next;
    while (fast && fast.next) {
      slow = slow.next!;
      fast = fast.next.next;
    }
    return slow;
  }

  /**
   * Merge two sorted linked lists into one sorted list.
   */
  private _merge(
    left: CaseNode | null,
    right: CaseNode | null,
    compareFn: (a: CaseData, b: CaseData) => number
  ): CaseNode | null {
    // Create a dummy head to simplify merging
    const dummy = new CaseNode({} as CaseData);
    let tail = dummy;

    while (left && right) {
      if (compareFn(left.data, right.data) <= 0) {
        tail.next = left;
        left = left.next;
      } else {
        tail.next = right;
        right = right.next;
      }
      tail = tail.next;
    }

    // Append remaining nodes
    tail.next = left || right;
    return dummy.next;
  }

  // ─── PATTERN ANALYSIS ────────────────────────────────────

  /**
   * Analyze patterns across all cases.
   * Uses traversal to compute frequency maps and insights.
   */
  analyzePatterns(): PatternAnalysis {
    const suspectFrequency: Record<string, number> = {};
    const keywordFrequency: Record<string, number> = {};
    const priorityCounts = { High: 0, Medium: 0, Low: 0 };
    const statusCounts = { Open: 0, Closed: 0 };
    let totalCases = 0;

    let current = this.head;
    while (current) {
      const c = current.data;
      totalCases++;

      // Count suspect appearances
      const suspect = c.suspectName.toLowerCase().trim();
      if (suspect) {
        suspectFrequency[suspect] = (suspectFrequency[suspect] || 0) + 1;
      }

      // Extract keywords from title & description
      const words = `${c.title} ${c.description}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);
      for (const word of words) {
        keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
      }

      priorityCounts[c.priority]++;
      statusCounts[c.status]++;

      current = current.next;
    }

    // Find most frequent suspect
    let mostFrequentSuspect = "";
    let maxFreq = 0;
    for (const [suspect, count] of Object.entries(suspectFrequency)) {
      if (count > maxFreq) {
        maxFreq = count;
        mostFrequentSuspect = suspect;
      }
    }

    // Top keywords (filter common words)
    const commonWords = new Set(["this", "that", "with", "from", "have", "been", "were", "they", "their", "case", "the"]);
    const topKeywords = Object.entries(keywordFrequency)
      .filter(([word]) => !commonWords.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Generate insights
    const insights: string[] = [];
    if (mostFrequentSuspect && maxFreq > 1) {
      insights.push(
        `Suspect "${mostFrequentSuspect}" appears in ${maxFreq} linked cases`
      );
    }
    if (priorityCounts.High > totalCases * 0.4 && totalCases > 2) {
      insights.push("High-priority cases are dominating the caseload");
    }
    if (statusCounts.Open > statusCounts.Closed && totalCases > 2) {
      insights.push(
        `${statusCounts.Open} cases remain open — investigation backlog detected`
      );
    }
    if (topKeywords.length > 0 && topKeywords[0][1] > 2) {
      insights.push(`Recurring keyword pattern: "${topKeywords[0][0]}" appears ${topKeywords[0][1]} times`);
    }

    return {
      totalCases,
      suspectFrequency,
      topKeywords,
      priorityCounts,
      statusCounts,
      mostFrequentSuspect: mostFrequentSuspect
        ? { name: mostFrequentSuspect, count: maxFreq }
        : null,
      insights,
    };
  }

  // ─── SMART CASE RECOMMENDATIONS ──────────────────────────

  /**
   * RECURSION: Find cases related to a given case by shared suspect or keywords.
   * Scores each node recursively and sorts by relevance.
   */
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

    // Insertion sort for DSA demonstration
    for (let i = 1; i < scored.length; i++) {
      const key = scored[i];
      let j = i - 1;
      while (j >= 0 && scored[j].score < key.score) {
        scored[j + 1] = scored[j];
        j--;
      }
      scored[j + 1] = key;
    }

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
      if (node.data.suspectName.toLowerCase().trim() === target.suspectName.toLowerCase().trim()) score += 10;
      if (node.data.priority === target.priority) score += 2;
      const words = `${node.data.title} ${node.data.description}`.toLowerCase()
        .replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 3);
      for (const w of words) {
        if (targetWords.has(w)) score += 3;
      }
      if (score > 0) results.push({ data: node.data, score });
    }
    this._scoreRelatedRecursive(node.next, target, targetWords, results);
  }

  // ─── RELATIONSHIP GRAPH ──────────────────────────────────

  buildRelationshipGraph(): RelationshipGraph {
    const suspectMap = new Map<string, CaseData[]>();
    const connections: CaseConnection[] = [];

    let current = this.head;
    while (current) {
      const key = current.data.suspectName.toLowerCase().trim();
      if (!suspectMap.has(key)) suspectMap.set(key, []);
      suspectMap.get(key)!.push(current.data);
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

  // ─── TIMELINE ────────────────────────────────────────────

  getTimeline(): CaseData[] {
    const clone = new CaseLinkedList();
    const arr = this.toArray();
    for (let i = arr.length - 1; i >= 0; i--) clone.insert(arr[i]);
    clone.sort(compareByDate);
    return clone.toArray();
  }

  // ─── ALERT GENERATION ────────────────────────────────────

  generateAlerts(): Alert[] {
    const alerts: Alert[] = [];
    const analysis = this.analyzePatterns();

    if (analysis.priorityCounts.High >= 2) {
      alerts.push({
        type: "critical",
        title: "Multiple Critical Cases Active",
        message: `${analysis.priorityCounts.High} high-priority cases require immediate attention`,
        relatedCases: this._collectByPriorityRecursive(this.head, "High", []),
      });
    }

    for (const [suspect, count] of Object.entries(analysis.suspectFrequency)) {
      if (count >= 2) {
        alerts.push({
          type: "warning",
          title: `Repeat Suspect: ${suspect}`,
          message: `"${suspect}" appears in ${count} cases — possible serial pattern`,
          relatedCases: this.findBySuspect(suspect),
        });
      }
    }

    if (analysis.statusCounts.Open > analysis.statusCounts.Closed * 2 && analysis.totalCases > 3) {
      alerts.push({
        type: "info",
        title: "Investigation Backlog",
        message: `${analysis.statusCounts.Open} open vs ${analysis.statusCounts.Closed} closed — resources may need reallocation`,
        relatedCases: [],
      });
    }

    return alerts;
  }

  private _collectByPriorityRecursive(node: CaseNode | null, priority: Priority, results: CaseData[]): CaseData[] {
    if (!node) return results;
    if (node.data.priority === priority) results.push(node.data);
    return this._collectByPriorityRecursive(node.next, priority, results);
  }

  // ─── ADVANCED SEARCH ─────────────────────────────────────

  advancedSearch(filters: SearchFilters): CaseData[] {
    const results: CaseData[] = [];
    this._advancedSearchRecursive(this.head, filters, results);
    return results;
  }

  private _advancedSearchRecursive(
    node: CaseNode | null,
    filters: SearchFilters,
    results: CaseData[]
  ): void {
    if (!node) return;
    let match = true;
    const c = node.data;

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      if (!c.title.toLowerCase().includes(kw) && !c.description.toLowerCase().includes(kw) && !c.suspectName.toLowerCase().includes(kw))
        match = false;
    }
    if (filters.priority && c.priority !== filters.priority) match = false;
    if (filters.status && c.status !== filters.status) match = false;

    if (match) results.push(c);
    this._advancedSearchRecursive(node.next, filters, results);
  }
}

// ─── TYPES ──────────────────────────────────────────────────

export interface PatternAnalysis {
  totalCases: number;
  suspectFrequency: Record<string, number>;
  topKeywords: [string, number][];
  priorityCounts: { High: number; Medium: number; Low: number };
  statusCounts: { Open: number; Closed: number };
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
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  relatedCases: CaseData[];
}

export interface SearchFilters {
  keyword?: string;
  priority?: Priority;
  status?: Status;
}

// ─── COMPARATOR FUNCTIONS FOR SORTING ────────────────────

const PRIORITY_WEIGHT: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

export function compareByPriority(a: CaseData, b: CaseData): number {
  return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
}

export function compareByDate(a: CaseData, b: CaseData): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
