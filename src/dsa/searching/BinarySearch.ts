/**
 * ============================================================
 * BINARY SEARCH MODULE
 * ============================================================
 * Implementations of:
 * - Standard Binary Search
 * - First Occurrence
 * - Last Occurrence
 * - Lower Bound
 * - Upper Bound
 * - Search in Rotated Sorted Array
 */

export interface BSStep {
  low: number;
  mid: number;
  high: number;
  description: string;
  action?: "found" | "left" | "right" | "check";
  foundIndex?: number;
}

export interface BSResult {
  resultIndex: number;
  steps: BSStep[];
  comparisons: number;
  timeComplexity: string;
  spaceComplexity: string;
}

// ─── STANDARD BINARY SEARCH ─────────────────────────────────
export function binarySearch(arr: number[], target: number): BSResult {
  const steps: BSStep[] = [];
  let low = 0, high = arr.length - 1;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    steps.push({
      low, mid, high,
      description: `Checking mid index ${mid} (val: ${arr[mid]}) vs target (${target})`,
      action: "check",
    });

    if (arr[mid] === target) {
      steps.push({ low, mid, high, description: `Target ${target} found at index ${mid}!`, action: "found", foundIndex: mid });
      return { resultIndex: mid, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
    } else if (arr[mid] < target) {
      steps.push({ low, mid, high, description: `${arr[mid]} < ${target} → move search space to right [${mid + 1}..${high}]`, action: "right" });
      low = mid + 1;
    } else {
      steps.push({ low, mid, high, description: `${arr[mid]} > ${target} → move search space to left [${low}..${mid - 1}]`, action: "left" });
      high = mid - 1;
    }
  }

  steps.push({ low, mid: -1, high, description: `Target ${target} not found in array.` });
  return { resultIndex: -1, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
}

// ─── FIRST OCCURRENCE ───────────────────────────────────────
export function firstOccurrence(arr: number[], target: number): BSResult {
  const steps: BSStep[] = [];
  let low = 0, high = arr.length - 1;
  let resultIndex = -1;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    steps.push({ low, mid, high, description: `Checking mid index ${mid} (val: ${arr[mid]})`, action: "check" });

    if (arr[mid] === target) {
      resultIndex = mid;
      steps.push({ low, mid, high, description: `Target found at ${mid}, searching left for earlier occurrence`, action: "left", foundIndex: mid });
      high = mid - 1;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return { resultIndex, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
}

// ─── LAST OCCURRENCE ────────────────────────────────────────
export function lastOccurrence(arr: number[], target: number): BSResult {
  const steps: BSStep[] = [];
  let low = 0, high = arr.length - 1;
  let resultIndex = -1;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    steps.push({ low, mid, high, description: `Checking mid index ${mid} (val: ${arr[mid]})`, action: "check" });

    if (arr[mid] === target) {
      resultIndex = mid;
      steps.push({ low, mid, high, description: `Target found at ${mid}, searching right for later occurrence`, action: "right", foundIndex: mid });
      low = mid + 1;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return { resultIndex, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
}

// ─── LOWER BOUND ────────────────────────────────────────────
export function lowerBound(arr: number[], target: number): BSResult {
  const steps: BSStep[] = [];
  let low = 0, high = arr.length - 1;
  let resultIndex = arr.length;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    steps.push({ low, mid, high, description: `Checking mid index ${mid} (val: ${arr[mid]}) for lower bound (val >= ${target})`, action: "check" });

    if (arr[mid] >= target) {
      resultIndex = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return { resultIndex, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
}

// ─── UPPER BOUND ────────────────────────────────────────────
export function upperBound(arr: number[], target: number): BSResult {
  const steps: BSStep[] = [];
  let low = 0, high = arr.length - 1;
  let resultIndex = arr.length;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    steps.push({ low, mid, high, description: `Checking mid index ${mid} (val: ${arr[mid]}) for upper bound (val > ${target})`, action: "check" });

    if (arr[mid] > target) {
      resultIndex = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return { resultIndex, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
}

// ─── SEARCH IN ROTATED SORTED ARRAY ────────────────────────
export function searchRotated(arr: number[], target: number): BSResult {
  const steps: BSStep[] = [];
  let low = 0, high = arr.length - 1;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    steps.push({ low, mid, high, description: `Checking mid index ${mid} (val: ${arr[mid]}) in rotated array`, action: "check" });

    if (arr[mid] === target) {
      steps.push({ low, mid, high, description: `Target found at index ${mid}!`, action: "found", foundIndex: mid });
      return { resultIndex: mid, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
    }

    // Check if left half is sorted
    if (arr[low] <= arr[mid]) {
      if (arr[low] <= target && target < arr[mid]) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      // Right half is sorted
      if (arr[mid] < target && target <= arr[high]) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return { resultIndex: -1, steps, comparisons, timeComplexity: "O(log n)", spaceComplexity: "O(1)" };
}
