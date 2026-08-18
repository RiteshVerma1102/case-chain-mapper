/**
 * ============================================================
 * GRAPH MODULE (ADJACENCY LIST)
 * ============================================================
 * Real Graph implementation:
 * - addVertex / addEdge / removeEdge / getNeighbors
 * - BFS Traversal
 * - DFS Traversal
 * - Connected Components
 * - Path Existence
 * - Shortest Path in Unweighted Graph
 */

export interface GraphStep {
  currentVertex: string;
  visited: string[];
  queueOrStack: string[];
  description: string;
}

export class Graph {
  private adjList: Map<string, Set<string>> = new Map();

  addVertex(v: string): void {
    if (!this.adjList.has(v)) {
      this.adjList.set(v, new Set());
    }
  }

  addEdge(u: string, v: string, bidirectional: boolean = true): void {
    this.addVertex(u);
    this.addVertex(v);
    this.adjList.get(u)!.add(v);
    if (bidirectional) {
      this.adjList.get(v)!.add(u);
    }
  }

  removeEdge(u: string, v: string, bidirectional: boolean = true): void {
    if (this.adjList.has(u)) this.adjList.get(u)!.delete(v);
    if (bidirectional && this.adjList.has(v)) this.adjList.get(v)!.delete(u);
  }

  getNeighbors(v: string): string[] {
    return Array.from(this.adjList.get(v) || []);
  }

  getVertices(): string[] {
    return Array.from(this.adjList.keys());
  }

  // ─── BFS ──────────────────────────────────────────────────
  bfs(start: string): { order: string[]; steps: GraphStep[] } {
    const order: string[] = [];
    const steps: GraphStep[] = [];
    if (!this.adjList.has(start)) return { order, steps };

    const visited = new Set<string>();
    const queue: string[] = [start];
    visited.add(start);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push(curr);

      steps.push({
        currentVertex: curr,
        visited: Array.from(visited),
        queueOrStack: [...queue],
        description: `BFS visiting node ${curr}. Adding unvisited neighbors to Queue.`
      });

      const neighbors = this.getNeighbors(curr);
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }

    return { order, steps };
  }

  // ─── DFS ──────────────────────────────────────────────────
  dfs(start: string): { order: string[]; steps: GraphStep[] } {
    const order: string[] = [];
    const steps: GraphStep[] = [];
    if (!this.adjList.has(start)) return { order, steps };

    const visited = new Set<string>();

    const traverse = (v: string) => {
      visited.add(v);
      order.push(v);

      steps.push({
        currentVertex: v,
        visited: Array.from(visited),
        queueOrStack: [],
        description: `DFS visiting node ${v} (exploring deeper).`
      });

      for (const neighbor of this.getNeighbors(v)) {
        if (!visited.has(neighbor)) {
          traverse(neighbor);
        }
      }
    };

    traverse(start);
    return { order, steps };
  }

  // ─── SHORTEST PATH (BFS) ──────────────────────────────────
  shortestPath(start: string, target: string): { path: string[]; distance: number } {
    if (!this.adjList.has(start) || !this.adjList.has(target)) return { path: [], distance: -1 };
    if (start === target) return { path: [start], distance: 0 };

    const visited = new Set<string>([start]);
    const parent = new Map<string, string>();
    const queue: string[] = [start];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === target) break;

      for (const neighbor of this.getNeighbors(curr)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, curr);
          queue.push(neighbor);
        }
      }
    }

    if (!parent.has(target) && start !== target) return { path: [], distance: -1 };

    const path: string[] = [];
    let curr: string | undefined = target;
    while (curr) {
      path.unshift(curr);
      curr = parent.get(curr);
    }

    return { path, distance: path.length - 1 };
  }

  // ─── CONNECTED COMPONENTS ─────────────────────────────────
  getConnectedComponents(): string[][] {
    const visited = new Set<string>();
    const components: string[][] = [];

    for (const v of this.getVertices()) {
      if (!visited.has(v)) {
        const comp = this.bfs(v).order;
        comp.forEach(x => visited.add(x));
        components.push(comp);
      }
    }

    return components;
  }
}
