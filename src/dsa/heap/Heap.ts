/**
 * ============================================================
 * PRIORITY QUEUE / HEAP MODULE
 * ============================================================
 * Real Min-Heap and Max-Heap implementations.
 * Used for Case Priority Management.
 */

export class MinHeap<T> {
  private heap: { key: number; data: T }[] = [];

  insert(key: number, data: T): void {
    this.heap.push({ key, data });
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): { key: number; data: T } | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.sinkDown(0);
    return min;
  }

  peekMin(): { key: number; data: T } | undefined {
    return this.heap[0];
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[idx].key >= this.heap[parentIdx].key) break;
      [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
      idx = parentIdx;
    }
  }

  private sinkDown(idx: number): void {
    const length = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < length && this.heap[left].key < this.heap[smallest].key) smallest = left;
      if (right < length && this.heap[right].key < this.heap[smallest].key) smallest = right;

      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }

  toArray(): { key: number; data: T }[] {
    return [...this.heap];
  }

  size(): number {
    return this.heap.length;
  }
}

export class MaxHeap<T> {
  private heap: { key: number; data: T }[] = [];

  insert(key: number, data: T): void {
    this.heap.push({ key, data });
    this.bubbleUp(this.heap.length - 1);
  }

  extractMax(): { key: number; data: T } | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.sinkDown(0);
    return max;
  }

  peekMax(): { key: number; data: T } | undefined {
    return this.heap[0];
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[idx].key <= this.heap[parentIdx].key) break;
      [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
      idx = parentIdx;
    }
  }

  private sinkDown(idx: number): void {
    const length = this.heap.length;
    while (true) {
      let largest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < length && this.heap[left].key > this.heap[largest].key) largest = left;
      if (right < length && this.heap[right].key > this.heap[largest].key) largest = right;

      if (largest === idx) break;
      [this.heap[idx], this.heap[largest]] = [this.heap[largest], this.heap[idx]];
      idx = largest;
    }
  }

  toArray(): { key: number; data: T }[] {
    return [...this.heap];
  }

  size(): number {
    return this.heap.length;
  }
}
