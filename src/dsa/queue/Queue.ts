/**
 * ============================================================
 * QUEUE MODULE
 * ============================================================
 * Real Queue implementation + Investigation Processing Queue application.
 */

export class Queue<T> {
  private items: T[] = [];

  enqueue(element: T): void {
    this.items.push(element);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  rear(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}

// ─── CASE PROCESSING QUEUE ─────────────────────────────────
export interface ProcessedCaseStep {
  action: "enqueue" | "dequeue" | "process";
  caseId: string;
  queueState: string[];
  description: string;
}

export class CaseProcessingQueue {
  private queue = new Queue<{ id: string; title: string }>();
  public steps: ProcessedCaseStep[] = [];

  addCaseToQueue(id: string, title: string) {
    this.queue.enqueue({ id, title });
    this.steps.push({
      action: "enqueue",
      caseId: id,
      queueState: this.queue.toArray().map(c => c.id),
      description: `Case ${id} enqueued at Rear`
    });
  }

  processNextCase(): { id: string; title: string } | undefined {
    const item = this.queue.dequeue();
    if (item) {
      this.steps.push({
        action: "dequeue",
        caseId: item.id,
        queueState: this.queue.toArray().map(c => c.id),
        description: `Case ${item.id} dequeued from Front for processing`
      });
    }
    return item;
  }

  getQueueState() {
    return this.queue.toArray();
  }
}
