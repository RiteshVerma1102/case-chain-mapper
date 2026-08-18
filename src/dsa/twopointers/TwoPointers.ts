/**
 * ============================================================
 * TWO POINTERS MODULE
 * ============================================================
 * All problems solved using the two-pointer technique.
 * Step-by-step execution trace for visualization.
 */

export interface PointerStep {
  left: number;
  right: number;
  description: string;
  action?: 'move_left' | 'move_right' | 'both' | 'found' | 'skip';
  comparison?: string;
  result?: unknown;
}

// ─── PAIR SUM (sorted array) ────────────────────────────────
export interface PairSumResult {
  pairs: [number, number][];
  steps: PointerStep[];
}

export function pairSum(sortedArr: number[], target: number): PairSumResult {
  const steps: PointerStep[] = [];
  const pairs: [number, number][] = [];
  let left = 0, right = sortedArr.length - 1;

  while (left < right) {
    const sum = sortedArr[left] + sortedArr[right];
    const cmp = `arr[${left}](${sortedArr[left]}) + arr[${right}](${sortedArr[right]}) = ${sum}`;
    if (sum === target) {
      steps.push({ left, right, description: `${cmp} = target ${target} ✓`, action: 'found' });
      pairs.push([left, right]);
      left++; right--;
    } else if (sum < target) {
      steps.push({ left, right, description: `${cmp} < ${target}, move left →`, action: 'move_left', comparison: cmp });
      left++;
    } else {
      steps.push({ left, right, description: `${cmp} > ${target}, move right ←`, action: 'move_right', comparison: cmp });
      right--;
    }
  }
  return { pairs, steps };
}

// ─── REMOVE DUPLICATES FROM SORTED ARRAY ──────────────────
export function removeDuplicatesSorted(arr: number[]): { result: number[]; steps: PointerStep[]; count: number } {
  const steps: PointerStep[] = [];
  if (arr.length === 0) return { result: [], steps, count: 0 };
  const copy = [...arr];
  let slow = 0;

  for (let fast = 1; fast < copy.length; fast++) {
    steps.push({ left: slow, right: fast, description: `Compare arr[slow=${slow}]=${copy[slow]} with arr[fast=${fast}]=${copy[fast]}` });
    if (copy[fast] !== copy[slow]) {
      slow++;
      copy[slow] = copy[fast];
      steps.push({ left: slow, right: fast, description: `Different! slow++ → arr[${slow}]=${copy[slow]}`, action: 'move_left' });
    } else {
      steps.push({ left: slow, right: fast, description: `Duplicate ${copy[fast]}, advance fast only`, action: 'move_right' });
    }
  }
  return { result: copy.slice(0, slow + 1), steps, count: slow + 1 };
}

// ─── REVERSE ARRAY WITH TWO POINTERS ──────────────────────
export function reverseWithTwoPointers(arr: number[]): { result: number[]; steps: PointerStep[] } {
  const steps: PointerStep[] = [];
  const copy = [...arr];
  let left = 0, right = copy.length - 1;

  while (left < right) {
    steps.push({ left, right, description: `Swap arr[${left}]=${copy[left]} ↔ arr[${right}]=${copy[right]}`, action: 'both' });
    [copy[left], copy[right]] = [copy[right], copy[left]];
    steps.push({ left, right, description: `After swap: [${copy.join(', ')}]`, result: [...copy] });
    left++; right--;
  }
  return { result: copy, steps };
}

// ─── PALINDROME CHECK ───────────────────────────────────────
export function isPalindrome(str: string): { result: boolean; steps: PointerStep[] } {
  const steps: PointerStep[] = [];
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = s.length - 1;

  while (left <= right) {
    steps.push({
      left, right,
      description: `Compare s[${left}]='${s[left]}' with s[${right}]='${s[right]}'`,
      comparison: `'${s[left]}' === '${s[right]}'`
    });
    if (s[left] !== s[right]) {
      steps.push({ left, right, description: `Mismatch! Not a palindrome`, action: 'found', result: false });
      return { result: false, steps };
    }
    steps.push({ left, right, description: `Match! Move both pointers inward`, action: 'both' });
    left++; right--;
  }
  steps.push({ left, right, description: `All chars matched — it IS a palindrome!`, action: 'found', result: true });
  return { result: true, steps };
}

// ─── CONTAINER WITH MOST WATER ─────────────────────────────
export function containerWithMostWater(heights: number[]): { maxWater: number; steps: PointerStep[] } {
  const steps: PointerStep[] = [];
  let left = 0, right = heights.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(heights[left], heights[right]);
    const water = width * h;
    steps.push({
      left, right,
      description: `width=${width}, h=min(${heights[left]},${heights[right]})=${h}, water=${water}${water > maxWater ? ' NEW MAX!' : ''}`,
    });
    maxWater = Math.max(maxWater, water);
    if (heights[left] < heights[right]) {
      steps.push({ left, right, description: `Left height smaller, move left →`, action: 'move_left' });
      left++;
    } else {
      steps.push({ left, right, description: `Right height smaller/equal, move right ←`, action: 'move_right' });
      right--;
    }
  }
  return { maxWater, steps };
}
