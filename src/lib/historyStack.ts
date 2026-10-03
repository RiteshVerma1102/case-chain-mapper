/**
 * ============================================================
 * STACK-BASED HISTORY MANAGER (UNDO / REDO)
 * ============================================================
 * 
 * Implements undo/redo using two stacks (HistoryStack and RedoStack).
 */

export class HistoryManager<T = any> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];
  private maxDepth: number;

  constructor(maxDepth: number = 30) {
    this.maxDepth = maxDepth;
  }

  pushSnapshot(state: T): void {
    const clone = JSON.parse(JSON.stringify(state));
    this.undoStack.push(clone);
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift();
    }
    // Any new action clears the redo stack
    this.redoStack = [];
  }

  undo(currentState: T): T | null {
    if (this.undoStack.length === 0) return null;
    const previous = this.undoStack.pop()!;
    this.redoStack.push(JSON.parse(JSON.stringify(currentState)));
    return previous;
  }

  redo(currentState: T): T | null {
    if (this.redoStack.length === 0) return null;
    const next = this.redoStack.pop()!;
    this.undoStack.push(JSON.parse(JSON.stringify(currentState)));
    return next;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
