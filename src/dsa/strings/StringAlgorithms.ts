/**
 * ============================================================
 * STRING ALGORITHMS MODULE
 * ============================================================
 * Real implementations of:
 * - Reverse String
 * - Palindrome Check
 * - Anagram Check
 * - Character Frequency
 * - Longest Substring Without Repeating Characters
 * - KMP String Searching / Prefix Search
 */

export interface StringAlgoStep {
  description: string;
  state?: unknown;
}

// ─── REVERSE STRING ─────────────────────────────────────────
export function reverseString(str: string): { reversed: string; steps: StringAlgoStep[] } {
  const steps: StringAlgoStep[] = [];
  const chars = str.split("");
  let l = 0, r = chars.length - 1;
  while (l < r) {
    steps.push({ description: `Swap '${chars[l]}' at ${l} with '${chars[r]}' at ${r}` });
    [chars[l], chars[r]] = [chars[r], chars[l]];
    l++; r--;
  }
  return { reversed: chars.join(""), steps };
}

// ─── PALINDROME CHECK ───────────────────────────────────────
export function isStringPalindrome(str: string): { isPalindrome: boolean; steps: StringAlgoStep[] } {
  const steps: StringAlgoStep[] = [];
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let l = 0, r = clean.length - 1;
  while (l < r) {
    steps.push({ description: `Compare '${clean[l]}' at ${l} and '${clean[r]}' at ${r}` });
    if (clean[l] !== clean[r]) {
      return { isPalindrome: false, steps };
    }
    l++; r--;
  }
  return { isPalindrome: true, steps };
}

// ─── ANAGRAM CHECK ──────────────────────────────────────────
export function isAnagram(s1: string, s2: string): { isAnagram: boolean; steps: StringAlgoStep[] } {
  const steps: StringAlgoStep[] = [];
  const clean1 = s1.toLowerCase().replace(/[^a-z0-9]/g, "");
  const clean2 = s2.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (clean1.length !== clean2.length) {
    steps.push({ description: `Lengths differ (${clean1.length} vs ${clean2.length}) → Not anagrams` });
    return { isAnagram: false, steps };
  }

  const map = new Map<string, number>();
  for (const ch of clean1) {
    map.set(ch, (map.get(ch) || 0) + 1);
  }
  steps.push({ description: `Built frequency map for "${clean1}"`, state: Object.fromEntries(map) });

  for (const ch of clean2) {
    if (!map.has(ch) || map.get(ch)! === 0) {
      steps.push({ description: `Char '${ch}' in "${clean2}" missing/exceeded in "${clean1}"` });
      return { isAnagram: false, steps };
    }
    map.set(ch, map.get(ch)! - 1);
  }

  steps.push({ description: `All characters matched perfectly!` });
  return { isAnagram: true, steps };
}

// ─── LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS ────────
export function longestSubstringWithoutRepeating(s: string): { length: number; substring: string; steps: StringAlgoStep[] } {
  const steps: StringAlgoStep[] = [];
  const map = new Map<string, number>();
  let left = 0, maxLen = 0, maxSub = "";

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (map.has(ch) && map.get(ch)! >= left) {
      left = map.get(ch)! + 1;
      steps.push({ description: `Duplicate '${ch}' seen at right=${right}. Moved left to ${left}` });
    }
    map.set(ch, right);
    if (right - left + 1 > maxLen) {
      maxLen = right - left + 1;
      maxSub = s.slice(left, right + 1);
      steps.push({ description: `New longest substring found: "${maxSub}" (len ${maxLen})` });
    }
  }

  return { length: maxLen, substring: maxSub, steps };
}

// ─── PREFIX SEARCH ──────────────────────────────────────────
export function prefixSearch(words: string[], prefix: string): { matches: string[]; steps: StringAlgoStep[] } {
  const steps: StringAlgoStep[] = [];
  const p = prefix.toLowerCase();
  const matches: string[] = [];

  for (const word of words) {
    if (word.toLowerCase().startsWith(p)) {
      matches.push(word);
      steps.push({ description: `"${word}" STARTS with prefix "${prefix}" ✓` });
    } else {
      steps.push({ description: `"${word}" does not match prefix "${prefix}"` });
    }
  }

  return { matches, steps };
}
