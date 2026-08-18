/**
 * ============================================================
 * ARRAY ALGORITHMS MODULE
 * ============================================================
 * Real implementations of fundamental array operations and algorithms.
 * Each function returns both the result and step-by-step execution trace.
 */

export interface AlgoStep {
  description: string;
  highlight?: number[]; // indices being examined
  swapped?: [number, number];
  found?: number;
  value?: number | number[];
}

export interface AlgoResult<T> {
  result: T;
  steps: AlgoStep[];
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
}

// ─── INSERT ────────────────────────────────────────────────
export function insertElement(arr: number[], index: number, value: number): AlgoResult<number[]> {
  const steps: AlgoStep[] = [];
  const copy = [...arr];
  steps.push({ description: `Inserting ${value} at index ${index}`, highlight: [index] });
  copy.splice(index, 0, value);
  steps.push({ description: `Array after insertion`, value: [...copy] });
  return { result: copy, steps, comparisons: 0, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

// ─── DELETE ────────────────────────────────────────────────
export function deleteElement(arr: number[], index: number): AlgoResult<number[]> {
  const steps: AlgoStep[] = [];
  const copy = [...arr];
  steps.push({ description: `Deleting element at index ${index} (value: ${copy[index]})`, highlight: [index] });
  copy.splice(index, 1);
  steps.push({ description: `Array after deletion`, value: [...copy] });
  return { result: copy, steps, comparisons: 0, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

// ─── TRAVERSAL ─────────────────────────────────────────────
export function traverseArray(arr: number[]): AlgoResult<number[]> {
  const steps: AlgoStep[] = [];
  arr.forEach((val, i) => {
    steps.push({ description: `Visiting index ${i} → value: ${val}`, highlight: [i], value: val });
  });
  return { result: [...arr], steps, comparisons: arr.length, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

// ─── LINEAR SEARCH ─────────────────────────────────────────
export function linearSearch(arr: number[], target: number): AlgoResult<number> {
  const steps: AlgoStep[] = [];
  let comparisons = 0;
  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    steps.push({ description: `Checking index ${i}: arr[${i}] = ${arr[i]} vs target ${target}`, highlight: [i] });
    if (arr[i] === target) {
      steps.push({ description: `Found ${target} at index ${i}!`, highlight: [i], found: i });
      return { result: i, steps, comparisons, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
    }
  }
  steps.push({ description: `${target} not found in array` });
  return { result: -1, steps, comparisons, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

// ─── MAX / MIN ──────────────────────────────────────────────
export function findMaxMin(arr: number[]): AlgoResult<{ max: number; min: number; maxIdx: number; minIdx: number }> {
  const steps: AlgoStep[] = [];
  let max = arr[0], min = arr[0], maxIdx = 0, minIdx = 0;
  steps.push({ description: `Initialize max=min=${arr[0]} at index 0`, highlight: [0] });
  for (let i = 1; i < arr.length; i++) {
    steps.push({ description: `Comparing arr[${i}]=${arr[i]} with current max=${max}, min=${min}`, highlight: [i] });
    if (arr[i] > max) { max = arr[i]; maxIdx = i; steps.push({ description: `New max found: ${max} at index ${i}` }); }
    if (arr[i] < min) { min = arr[i]; minIdx = i; steps.push({ description: `New min found: ${min} at index ${i}` }); }
  }
  return { result: { max, min, maxIdx, minIdx }, steps, comparisons: arr.length - 1, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

// ─── REVERSE ARRAY ─────────────────────────────────────────
export function reverseArray(arr: number[]): AlgoResult<number[]> {
  const steps: AlgoStep[] = [];
  const copy = [...arr];
  let left = 0, right = copy.length - 1;
  let swaps = 0;
  while (left < right) {
    steps.push({ description: `Swapping index ${left} (${copy[left]}) ↔ index ${right} (${copy[right]})`, highlight: [left, right] });
    [copy[left], copy[right]] = [copy[right], copy[left]];
    swaps++;
    steps.push({ description: `After swap: [${copy.join(', ')}]`, value: [...copy] });
    left++; right--;
  }
  return { result: copy, steps, comparisons: 0, swaps, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

// ─── FREQUENCY COUNT ───────────────────────────────────────
export function frequencyCount(arr: number[]): AlgoResult<Map<number, number>> {
  const steps: AlgoStep[] = [];
  const freq = new Map<number, number>();
  arr.forEach((val, i) => {
    const count = (freq.get(val) || 0) + 1;
    freq.set(val, count);
    steps.push({ description: `arr[${i}]=${val} → freq[${val}]=${count}`, highlight: [i] });
  });
  return { result: freq, steps, comparisons: arr.length, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' };
}

// ─── DUPLICATE DETECTION ───────────────────────────────────
export function findDuplicates(arr: number[]): AlgoResult<number[]> {
  const steps: AlgoStep[] = [];
  const seen = new Set<number>();
  const duplicates: number[] = [];
  arr.forEach((val, i) => {
    steps.push({ description: `Check arr[${i}]=${val} in HashSet`, highlight: [i] });
    if (seen.has(val)) {
      duplicates.push(val);
      steps.push({ description: `Duplicate found: ${val}` });
    } else {
      seen.add(val);
      steps.push({ description: `Added ${val} to HashSet` });
    }
  });
  return { result: duplicates, steps, comparisons: arr.length, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' };
}

// ─── KADANE'S ALGORITHM ────────────────────────────────────
export function kadane(arr: number[]): AlgoResult<{ maxSum: number; start: number; end: number }> {
  const steps: AlgoStep[] = [];
  let maxSum = arr[0], currentSum = arr[0];
  let start = 0, end = 0, tempStart = 0;
  let comparisons = 0;
  steps.push({ description: `Init: maxSum=${maxSum}, currentSum=${arr[0]}`, highlight: [0] });
  for (let i = 1; i < arr.length; i++) {
    comparisons++;
    if (arr[i] > currentSum + arr[i]) {
      currentSum = arr[i];
      tempStart = i;
      steps.push({ description: `Reset subarray at index ${i}: arr[${i}]=${arr[i]} alone is better`, highlight: [i] });
    } else {
      currentSum += arr[i];
      steps.push({ description: `Extend subarray: currentSum=${currentSum}`, highlight: [i] });
    }
    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
      steps.push({ description: `New max sum=${maxSum} (indices ${start} to ${end})` });
    }
  }
  return { result: { maxSum, start, end }, steps, comparisons, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(1)' };
}

// ─── TWO SUM ────────────────────────────────────────────────
export function twoSum(arr: number[], target: number): AlgoResult<[number, number] | null> {
  const steps: AlgoStep[] = [];
  const map = new Map<number, number>();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    steps.push({ description: `Index ${i}: need ${target}-${arr[i]}=${complement}`, highlight: [i] });
    if (map.has(complement)) {
      const j = map.get(complement)!;
      steps.push({ description: `Found! arr[${j}]=${complement} + arr[${i}]=${arr[i]} = ${target}`, highlight: [j, i] });
      return { result: [j, i], steps, comparisons: i + 1, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' };
    }
    map.set(arr[i], i);
    steps.push({ description: `Stored arr[${i}]=${arr[i]} in hashmap` });
  }
  steps.push({ description: 'No two sum pair found' });
  return { result: null, steps, comparisons: arr.length, swaps: 0, timeComplexity: 'O(n)', spaceComplexity: 'O(n)' };
}
