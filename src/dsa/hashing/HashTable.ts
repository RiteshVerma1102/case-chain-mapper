/**
 * ============================================================
 * HASH TABLE MODULE
 * ============================================================
 * Real Hash Table with chaining collision resolution.
 * Also includes frequency map, two-sum, and character frequency.
 */

export interface HashEntry<K, V> {
  key: K;
  value: V;
}

export interface HashTableStats {
  size: number;
  capacity: number;
  loadFactor: number;
  collisions: number;
}

/**
 * Custom Hash Table using chaining (array of linked lists).
 * Demonstrates real hashing with collision handling.
 */
export class HashTable<K extends string | number, V> {
  private buckets: Array<Array<HashEntry<K, V>>>;
  private _size: number;
  private _capacity: number;
  private _collisions: number;

  constructor(capacity: number = 16) {
    this._capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
    this._size = 0;
    this._collisions = 0;
  }

  /** Simple hash function — sum of char codes mod capacity */
  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % this._capacity;
    }
    return Math.abs(hash);
  }

  /** Insert or update key-value pair. Time: O(1) average */
  set(key: K, value: V): { index: number; collision: boolean } {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const existing = bucket.find(e => e.key === key);
    const collision = bucket.length > 0 && !existing;
    if (collision) this._collisions++;
    if (existing) {
      existing.value = value;
    } else {
      bucket.push({ key, value });
      this._size++;
    }
    return { index, collision };
  }

  /** Search for a key. Time: O(1) average */
  get(key: K): V | undefined {
    const index = this.hash(key);
    const entry = this.buckets[index].find(e => e.key === key);
    return entry?.value;
  }

  /** Delete a key. Time: O(1) average */
  delete(key: K): boolean {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const i = bucket.findIndex(e => e.key === key);
    if (i === -1) return false;
    bucket.splice(i, 1);
    this._size--;
    return true;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  getHashIndex(key: K): number {
    return this.hash(key);
  }

  getBuckets(): Array<Array<HashEntry<K, V>>> {
    return this.buckets;
  }

  getStats(): HashTableStats {
    return {
      size: this._size,
      capacity: this._capacity,
      loadFactor: this._size / this._capacity,
      collisions: this._collisions,
    };
  }

  entries(): HashEntry<K, V>[] {
    return this.buckets.flat();
  }

  get size() { return this._size; }
}

// ─── FREQUENCY MAP ─────────────────────────────────────────
export function buildFrequencyMap(items: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const item of items) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}

// ─── CHARACTER FREQUENCY ───────────────────────────────────
export function charFrequency(str: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of str) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  return freq;
}

// ─── TWO SUM USING HASH ────────────────────────────────────
export interface TwoSumStep {
  index: number;
  value: number;
  complement: number;
  found: boolean;
  hashState: [number, number][];
}

export function twoSumHash(arr: number[], target: number): { pairs: [number, number][]; steps: TwoSumStep[] } {
  const map = new Map<number, number>();
  const pairs: [number, number][] = [];
  const steps: TwoSumStep[] = [];

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    const found = map.has(complement);
    steps.push({
      index: i,
      value: arr[i],
      complement,
      found,
      hashState: Array.from(map.entries()),
    });
    if (found) {
      pairs.push([map.get(complement)!, i]);
    }
    map.set(arr[i], i);
  }
  return { pairs, steps };
}

// ─── DUPLICATE DETECTION USING SET ────────────────────────
export function detectDuplicatesHash(arr: number[]): { duplicates: number[]; firstDupIndex: number } {
  const seen = new Set<number>();
  const dups: number[] = [];
  let firstDupIndex = -1;
  arr.forEach((v, i) => {
    if (seen.has(v)) {
      if (!dups.includes(v)) {
        dups.push(v);
        if (firstDupIndex === -1) firstDupIndex = i;
      }
    } else {
      seen.add(v);
    }
  });
  return { duplicates: dups, firstDupIndex };
}
