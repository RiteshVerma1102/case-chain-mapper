/**
 * ============================================================
 * UNDO / REDO HISTORY STACK MODULE
 * ============================================================
 * Stack-based history snapshot manager for case modifications.
 */

import { Stack } from "@/dsa/stack/Stack";
import { CaseData } from "./LinkedList";

export class HistoryManager {
  private undoStack = new Stack<CaseData[]>();
  private redoStack = new Stack<CaseData[]>();

  pushSnapshot(currentCases: CaseData[]): void {
    this.undoStack.push(JSON.parse(JSON.stringify(currentCases)));
    this.redoStack.clear();
  }

  undo(currentCases: CaseData[]): CaseData[] | null {
    if (this.undoStack.isEmpty()) return null;

    this.redoStack.push(JSON.parse(JSON.stringify(currentCases)));
    return this.undoStack.pop() ?? null;
  }

  redo(currentCases: CaseData[]): CaseData[] | null {
    if (this.redoStack.isEmpty()) return null;

    this.undoStack.push(JSON.parse(JSON.stringify(currentCases)));
    return this.redoStack.pop() ?? null;
  }

  canUndo(): boolean {
    return !this.undoStack.isEmpty();
  }

  canRedo(): boolean {
    return !this.redoStack.isEmpty();
  }

  getUndoCount(): number {
    return this.undoStack.size();
  }

  getRedoCount(): number {
    return this.redoStack.size();
  }
}
