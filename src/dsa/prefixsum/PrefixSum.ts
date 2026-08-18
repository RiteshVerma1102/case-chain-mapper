/**
 * ============================================================
 * PREFIX SUM MODULE
 * ============================================================
 * Precomputes range sum queries in O(1) time after O(n) preprocessing.
 */

export interface RangeQuery {
  left: number;
  right: number;
  result: number;
  formula: string;
}

export interface PrefixSumResult {
  originalArray: number[];
  prefixArray: number[];
  queries: RangeQuery[];
  preprocessingTime: string;
  queryTime: string;
  spaceComplexity: string;
}

export class PrefixSum {
  private original: number[];
  private prefix: number[];

  constructor(arr: number[]) {
    this.original = [...arr];
    this.prefix = new Array(arr.length);
    if (arr.length > 0) {
      this.prefix[0] = arr[0];
      for (let i = 1; i < arr.length; i++) {
        this.prefix[i] = this.prefix[i - 1] + arr[i];
      }
    }
  }

  query(l: number, r: number): RangeQuery {
    if (l < 0 || r >= this.original.length || l > r) {
      return { left: l, right: r, result: 0, formula: "Invalid range" };
    }
    if (l === 0) {
      return {
        left: l, right: r,
        result: this.prefix[r],
        formula: `P[${r}] = ${this.prefix[r]}`
      };
    }
    const res = this.prefix[r] - this.prefix[l - 1];
    return {
      left: l, right: r,
      result: res,
      formula: `P[${r}] (${this.prefix[r]}) - P[${l - 1}] (${this.prefix[l - 1]}) = ${res}`
    };
  }

  getDetails(): PrefixSumResult {
    return {
      originalArray: this.original,
      prefixArray: this.prefix,
      queries: [],
      preprocessingTime: "O(n)",
      queryTime: "O(1)",
      spaceComplexity: "O(n)"
    };
  }
}
