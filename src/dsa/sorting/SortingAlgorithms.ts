/**
 * ============================================================
 * SORTING ALGORITHMS MODULE
 * ============================================================
 * Real implementations of:
 * - Bubble Sort
 * - Selection Sort
 * - Insertion Sort
 * - Merge Sort
 * - Quick Sort
 * - Heap Sort
 * 
 * Returns comparisons, swaps, time/space complexity, and steps.
 */

export interface SortStep {
  description: string;
  array: number[];
  comparing?: [number, number];
  swapped?: [number, number];
}

export interface SortResult {
  sortedArray: number[];
  steps: SortStep[];
  comparisons: number;
  swaps: number;
  timeComplexity: { best: string; avg: string; worst: string };
  spaceComplexity: string;
}

// ─── BUBBLE SORT ───────────────────────────────────────────
export function bubbleSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const copy = [...arr];
  let comparisons = 0, swaps = 0;
  const n = copy.length;

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({ description: `Comparing index ${j} (${copy[j]}) and ${j+1} (${copy[j+1]})`, array: [...copy], comparing: [j, j+1] });
      if (copy[j] > copy[j+1]) {
        [copy[j], copy[j+1]] = [copy[j+1], copy[j]];
        swaps++;
        swappedInPass = true;
        steps.push({ description: `Swapped index ${j} and ${j+1}`, array: [...copy], swapped: [j, j+1] });
      }
    }
    if (!swappedInPass) break;
  }

  return {
    sortedArray: copy, steps, comparisons, swaps,
    timeComplexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)"
  };
}

// ─── SELECTION SORT ────────────────────────────────────────
export function selectionSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const copy = [...arr];
  let comparisons = 0, swaps = 0;
  const n = copy.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({ description: `Comparing arr[${j}] (${copy[j]}) with min arr[${minIdx}] (${copy[minIdx]})`, array: [...copy], comparing: [j, minIdx] });
      if (copy[j] < copy[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [copy[i], copy[minIdx]] = [copy[minIdx], copy[i]];
      swaps++;
      steps.push({ description: `Swapped minimum element at ${minIdx} to position ${i}`, array: [...copy], swapped: [i, minIdx] });
    }
  }

  return {
    sortedArray: copy, steps, comparisons, swaps,
    timeComplexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)"
  };
}

// ─── INSERTION SORT ────────────────────────────────────────
export function insertionSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const copy = [...arr];
  let comparisons = 0, swaps = 0;
  const n = copy.length;

  for (let i = 1; i < n; i++) {
    const key = copy[i];
    let j = i - 1;
    steps.push({ description: `Inserting key ${key} at index ${i}`, array: [...copy], comparing: [i, j] });
    while (j >= 0) {
      comparisons++;
      if (copy[j] > key) {
        copy[j + 1] = copy[j];
        swaps++;
        steps.push({ description: `Shifted ${copy[j]} from ${j} to ${j+1}`, array: [...copy], swapped: [j, j+1] });
        j--;
      } else {
        break;
      }
    }
    copy[j + 1] = key;
  }

  return {
    sortedArray: copy, steps, comparisons, swaps,
    timeComplexity: { best: "O(n)", avg: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)"
  };
}

// ─── MERGE SORT ────────────────────────────────────────────
export function mergeSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const copy = [...arr];
  let comparisons = 0, swaps = 0;

  function merge(left: number, mid: number, right: number) {
    const temp: number[] = [];
    let i = left, j = mid + 1;

    while (i <= mid && j <= right) {
      comparisons++;
      steps.push({ description: `Comparing left element ${copy[i]} and right element ${copy[j]}`, array: [...copy], comparing: [i, j] });
      if (copy[i] <= copy[j]) {
        temp.push(copy[i++]);
      } else {
        temp.push(copy[j++]);
      }
    }
    while (i <= mid) temp.push(copy[i++]);
    while (j <= right) temp.push(copy[j++]);

    for (let k = 0; k < temp.length; k++) {
      if (copy[left + k] !== temp[k]) swaps++;
      copy[left + k] = temp[k];
    }
    steps.push({ description: `Merged subarray range [${left}..${right}]`, array: [...copy] });
  }

  function sort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, copy.length - 1);

  return {
    sortedArray: copy, steps, comparisons, swaps,
    timeComplexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)"
  };
}

// ─── QUICK SORT ────────────────────────────────────────────
export function quickSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const copy = [...arr];
  let comparisons = 0, swaps = 0;

  function partition(low: number, high: number): number {
    const pivot = copy[high];
    let i = low - 1;
    steps.push({ description: `Pivot chosen: ${pivot} at index ${high}`, array: [...copy] });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({ description: `Comparing arr[${j}] (${copy[j]}) with pivot (${pivot})`, array: [...copy], comparing: [j, high] });
      if (copy[j] < pivot) {
        i++;
        [copy[i], copy[j]] = [copy[j], copy[i]];
        swaps++;
        steps.push({ description: `Swapped element at ${j} to partition position ${i}`, array: [...copy], swapped: [i, j] });
      }
    }
    [copy[i + 1], copy[high]] = [copy[high], copy[i + 1]];
    swaps++;
    steps.push({ description: `Placed pivot ${pivot} at final position ${i + 1}`, array: [...copy], swapped: [i + 1, high] });
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, copy.length - 1);

  return {
    sortedArray: copy, steps, comparisons, swaps,
    timeComplexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)"
  };
}

// ─── HEAP SORT ─────────────────────────────────────────────
export function heapSort(arr: number[]): SortResult {
  const steps: SortStep[] = [];
  const copy = [...arr];
  let comparisons = 0, swaps = 0;
  const n = copy.length;

  function heapify(n: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      comparisons++;
      if (copy[left] > copy[largest]) largest = left;
    }
    if (right < n) {
      comparisons++;
      if (copy[right] > copy[largest]) largest = right;
    }

    if (largest !== i) {
      [copy[i], copy[largest]] = [copy[largest], copy[i]];
      swaps++;
      steps.push({ description: `Heapify swap: arr[${i}] and arr[${largest}]`, array: [...copy], swapped: [i, largest] });
      heapify(n, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract from heap
  for (let i = n - 1; i > 0; i--) {
    [copy[0], copy[i]] = [copy[i], copy[0]];
    swaps++;
    steps.push({ description: `Extracted max ${copy[i]} to index ${i}`, array: [...copy], swapped: [0, i] });
    heapify(i, 0);
  }

  return {
    sortedArray: copy, steps, comparisons, swaps,
    timeComplexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(1)"
  };
}
