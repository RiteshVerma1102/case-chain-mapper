/**
 * ============================================================
 * GRAPH MODULE (ADJACENCY LIST & GRAPH TRAVERSALS)
 * ============================================================
 * 
 * Provides relationship mapping and network exploration:
 * - addVertex / addEdge / getNeighbors / getVertices
 * - BFS Traversal (Queue-based, step-by-step trace)
 * - DFS Traversal (Stack/Recursive, step-by-step trace)
 * - Shortest Path between any two entities
 * - Connected Components detection
 */

export interface GraphStep {
  currentVertex: string;
  visited: string[];
  queueOrStack: string[];
  description: string;
}

export class Graph {
  private adjList: Map<string, Set<string>> = new Map();
  private edgeData: Map<string, { type: string; strength: string; details: string }> = new Map();

  addVertex(v: string): void {
    if (!this.adjList.has(v)) {
      this.adjList.set(v, new Set());
    }
  }

  addEdge(u: string, v: string, bidirectional: boolean = true, meta?: { type: string; strength: string; details: string }): void {
    this.addVertex(u);
    this.addVertex(v);
    this.adjList.get(u)!.add(v);
    if (meta) {
      this.edgeData.set(`${u}-->${v}`, meta);
    }
    if (bidirectional) {
      this.adjList.get(v)!.add(u);
      if (meta) {
        this.edgeData.set(`${v}-->${u}`, meta);
      }
    }
  }

  getEdgeMeta(u: string, v: string) {
    return this.edgeData.get(`${u}-->${v}`) || this.edgeData.get(`${v}-->${u}`);
  }

  getNeighbors(v: string): string[] {
    return Array.from(this.adjList.get(v) || []);
  }

  getVertices(): string[] {
    return Array.from(this.adjList.keys());
  }

  hasVertex(v: string): boolean {
    return this.adjList.has(v);
  }

  // BFS TRAVERSAL
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
        description: `BFS visiting "${curr}". Queueing adjacent connections.`,
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

  // DFS TRAVERSAL
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
        description: `DFS deep trace visiting node "${v}".`,
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

  // SHORTEST PATH (BFS)
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

  // CONNECTED COMPONENTS
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
