import { useState } from "react";
import { Trie } from "@/dsa/trie/Trie";
import { useCases } from "@/context/CaseContext";
import { Search } from "lucide-react";

export default function TrieModule() {
  const { cases } = useCases();
  const [trie] = useState(() => {
    const t = new Trie();
    // Insert all suspect names and titles into Trie
    cases.forEach((c) => {
      t.insert(c.suspectName);
      c.title.split(" ").forEach(w => {
        if (w.length > 2) t.insert(w);
      });
    });
    // Add extra names
    ["Rahul", "Rakesh", "Rahat", "Rohan", "Marcus", "Elena"].forEach(w => t.insert(w));
    return t;
  });

  const [inputPrefix, setInputPrefix] = useState("Rah");
  const [newWord, setNewWord] = useState("SanityCheck");

  const suggestions = trie.getAutocompleteSuggestions(inputPrefix);

  const handleAddWord = () => {
    if (!newWord) return;
    trie.insert(newWord);
    setNewWord("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Trie (Prefix Tree) Autocomplete Module</h3>
        <p className="text-xs text-muted-foreground">O(L) Insert & Search • Fast Suspect Name / Keyword Autocomplete</p>
      </div>

      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Type Prefix for Autocomplete</label>
          <input
            type="text"
            value={inputPrefix}
            onChange={(e) => setInputPrefix(e.target.value)}
            className="intel-input font-bold text-primary"
            placeholder="Type e.g. Rah, Marcus, Elena..."
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground block mb-1">Insert New Keyword into Trie</label>
            <input type="text" value={newWord} onChange={(e) => setNewWord(e.target.value)} className="intel-input" />
          </div>
          <button onClick={handleAddWord} className="intel-btn-primary text-xs">Insert Word</button>
        </div>
      </div>

      {/* Autocomplete Suggestions */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
          <Search size={14} className="text-primary" /> Live Trie Autocomplete Suggestions for "{inputPrefix}"
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {suggestions.map((s, idx) => (
            <div key={idx} className="px-3 py-1.5 rounded-lg bg-secondary border border-primary/40 font-mono text-xs text-foreground flex items-center gap-1.5">
              <span className="text-primary font-bold">✓</span>
              <span>{s}</span>
            </div>
          ))}
          {suggestions.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No Trie matches found for prefix "{inputPrefix}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
