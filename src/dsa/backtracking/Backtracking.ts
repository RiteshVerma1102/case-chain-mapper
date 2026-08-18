/**
 * ============================================================
 * BACKTRACKING MODULE
 * ============================================================
 * Real Backtracking implementations:
 * 1. Subsets / Power Set
 * 2. Permutations
 * 3. N-Queens Problem
 */

export interface BacktrackStep {
  action: "choose" | "explore" | "backtrack" | "solution";
  currentPath: unknown;
  description: string;
}

// ─── SUBSETS ────────────────────────────────────────────────
export function generateSubsets(nums: number[]): { subsets: number[][]; steps: BacktrackStep[] } {
  const subsets: number[][] = [];
  const steps: BacktrackStep[] = [];

  function backtrack(start: number, path: number[]) {
    subsets.push([...path]);
    steps.push({ action: "solution", currentPath: [...path], description: `Found subset: [${path.join(", ")}]` });

    for (let i = start; i < nums.length; i++) {
      steps.push({ action: "choose", currentPath: [...path, nums[i]], description: `Choose ${nums[i]}` });
      path.push(nums[i]);
      backtrack(i + 1, path);
      steps.push({ action: "backtrack", currentPath: [...path], description: `Backtrack from ${nums[i]}` });
      path.pop();
    }
  }

  backtrack(0, []);
  return { subsets, steps };
}

// ─── PERMUTATIONS ───────────────────────────────────────────
export function generatePermutations(nums: number[]): { permutations: number[][]; steps: BacktrackStep[] } {
  const permutations: number[][] = [];
  const steps: BacktrackStep[] = [];

  function backtrack(path: number[], used: boolean[]) {
    if (path.length === nums.length) {
      permutations.push([...path]);
      steps.push({ action: "solution", currentPath: [...path], description: `Found permutation: [${path.join(", ")}]` });
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      steps.push({ action: "choose", currentPath: [...path], description: `Choose ${nums[i]}` });

      backtrack(path, used);

      path.pop();
      used[i] = false;
      steps.push({ action: "backtrack", currentPath: [...path], description: `Backtrack from ${nums[i]}` });
    }
  }

  backtrack([], new Array(nums.length).fill(false));
  return { permutations, steps };
}

// ─── N-QUEENS ───────────────────────────────────────────────
export function solveNQueens(n: number): { solutions: number[][][]; steps: BacktrackStep[] } {
  const solutions: number[][][] = [];
  const steps: BacktrackStep[] = [];
  const board: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  const cols = new Set<number>();
  const diag1 = new Set<number>();
  const diag2 = new Set<number>();

  function backtrack(row: number) {
    if (row === n) {
      solutions.push(board.map(r => [...r]));
      steps.push({ action: "solution", currentPath: `N-Queens Solution Found!`, description: `Placed ${n} queens successfully` });
      return;
    }

    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;

      board[row][col] = 1;
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      steps.push({ action: "choose", currentPath: `Place Q at (${row}, ${col})`, description: `Row ${row}, Col ${col}` });

      backtrack(row + 1);

      board[row][col] = 0;
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
      steps.push({ action: "backtrack", currentPath: `Remove Q from (${row}, ${col})`, description: `Backtracking from (${row}, ${col})` });
    }
  }

  backtrack(0);
  return { solutions, steps };
}
