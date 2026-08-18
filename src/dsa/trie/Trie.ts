/**
 * ============================================================
 * TRIE (PREFIX TREE) MODULE
 * ============================================================
 * Real Trie implementation:
 * - insert(word)
 * - search(word)
 * - startsWith(prefix)
 * - getAutocompleteSuggestions(prefix)
 */

export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  word?: string; // store complete word at leaf for quick retrieval
}

export class Trie {
  root: TrieNode = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    const cleanWord = word.trim();
    for (const ch of cleanWord.toLowerCase()) {
      if (!curr.children.has(ch)) {
        curr.children.set(ch, new TrieNode());
      }
      curr = curr.children.get(ch)!;
    }
    curr.isEndOfWord = true;
    curr.word = cleanWord;
  }

  search(word: string): boolean {
    let curr = this.root;
    for (const ch of word.toLowerCase().trim()) {
      if (!curr.children.has(ch)) return false;
      curr = curr.children.get(ch)!;
    }
    return curr.isEndOfWord;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const ch of prefix.toLowerCase().trim()) {
      if (!curr.children.has(ch)) return false;
      curr = curr.children.get(ch)!;
    }
    return true;
  }

  getAutocompleteSuggestions(prefix: string, maxSuggestions: number = 10): string[] {
    let curr = this.root;
    const cleanPrefix = prefix.toLowerCase().trim();
    if (!cleanPrefix) return [];

    for (const ch of cleanPrefix) {
      if (!curr.children.has(ch)) return [];
      curr = curr.children.get(ch)!;
    }

    const suggestions: string[] = [];

    function dfs(node: TrieNode) {
      if (suggestions.length >= maxSuggestions) return;
      if (node.isEndOfWord && node.word) {
        suggestions.push(node.word);
      }
      for (const [, child] of node.children) {
        dfs(child);
      }
    }

    dfs(curr);
    return suggestions;
  }
}
