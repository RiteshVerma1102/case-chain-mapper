/**
 * ============================================================
 * BINARY SEARCH ON ANSWER MODULE
 * ============================================================
 * Real problems:
 * 1. Book Allocation Problem (Minimum Max Capacity)
 * 2. Aggressive Cows (Maximum Minimum Distance)
 */

export interface BSAnswerStep {
  low: number;
  mid: number;
  high: number;
  isPossible: boolean;
  description: string;
  feasibilityDetail: string;
}

export interface BSAnswerResult {
  answer: number;
  steps: BSAnswerStep[];
  timeComplexity: string;
  spaceComplexity: string;
}

// ─── 1. BOOK ALLOCATION (Minimum Max Pages) ───────────────
export function allocateBooks(pages: number[], k: number): BSAnswerResult {
  const steps: BSAnswerStep[] = [];
  if (k > pages.length) {
    return { answer: -1, steps: [], timeComplexity: "O(n log(sum))", spaceComplexity: "O(1)" };
  }

  let low = Math.max(...pages);
  let high = pages.reduce((a, b) => a + b, 0);
  let answer = high;

  function isPossible(maxPages: number): { possible: boolean; studentsNeeded: number } {
    let studentsNeeded = 1;
    let currentSum = 0;
    for (const p of pages) {
      if (currentSum + p > maxPages) {
        studentsNeeded++;
        currentSum = p;
      } else {
        currentSum += p;
      }
    }
    return { possible: studentsNeeded <= k, studentsNeeded };
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { possible, studentsNeeded } = isPossible(mid);

    steps.push({
      low, mid, high,
      isPossible: possible,
      description: `Testing capacity mid = ${mid}`,
      feasibilityDetail: `Requires ${studentsNeeded} student(s) for max capacity ${mid}. Target students: ${k}. Feasible? ${possible ? "YES" : "NO"}`
    });

    if (possible) {
      answer = mid;
      high = mid - 1; // Try smaller capacity
    } else {
      low = mid + 1; // Increase capacity
    }
  }

  return { answer, steps, timeComplexity: "O(n log(sum-max))", spaceComplexity: "O(1)" };
}

// ─── 2. AGGRESSIVE COWS (Max Minimum Distance) ─────────────
export function aggressiveCows(stalls: number[], k: number): BSAnswerResult {
  const steps: BSAnswerStep[] = [];
  const sortedStalls = [...stalls].sort((a, b) => a - b);

  let low = 1;
  let high = sortedStalls[sortedStalls.length - 1] - sortedStalls[0];
  let answer = 0;

  function canPlaceCows(dist: number): { possible: boolean; placed: number } {
    let count = 1;
    let lastPos = sortedStalls[0];
    for (let i = 1; i < sortedStalls.length; i++) {
      if (sortedStalls[i] - lastPos >= dist) {
        count++;
        lastPos = sortedStalls[i];
      }
    }
    return { possible: count >= k, placed: count };
  }

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const { possible, placed } = canPlaceCows(mid);

    steps.push({
      low, mid, high,
      isPossible: possible,
      description: `Testing min distance mid = ${mid}`,
      feasibilityDetail: `Can place ${placed} cow(s) with dist >= ${mid}. Target cows: ${k}. Feasible? ${possible ? "YES" : "NO"}`
    });

    if (possible) {
      answer = mid;
      low = mid + 1; // Try larger min distance
    } else {
      high = mid - 1; // Decrease distance
    }
  }

  return { answer, steps, timeComplexity: "O(n log(max-min))", spaceComplexity: "O(1)" };
}
