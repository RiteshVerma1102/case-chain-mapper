import { useState } from "react";
import { reverseString, isStringPalindrome, isAnagram, longestSubstringWithoutRepeating, prefixSearch } from "@/dsa/strings/StringAlgorithms";

export default function StringsModule() {
  const [str1, setStr1] = useState("listen");
  const [str2, setStr2] = useState("silent");
  const [subStr, setSubStr] = useState("abcabcbb");
  const [prefixInput, setPrefixInput] = useState("Rah");
  const [algo, setAlgo] = useState("anagram");

  const wordList = ["Rahul", "Rakesh", "Rahat", "Rohan", "Ram", "Vikram"];

  const runAlgo = () => {
    switch (algo) {
      case "reverse": return reverseString(str1);
      case "palindrome": return isStringPalindrome(str1);
      case "anagram": return isAnagram(str1, str2);
      case "longestSub": return longestSubstringWithoutRepeating(subStr);
      case "prefix": return prefixSearch(wordList, prefixInput);
      default: return null;
    }
  };

  const output: any = runAlgo();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">String Algorithms Module</h3>
        <p className="text-xs text-muted-foreground">Reverse • Palindrome • Anagrams • Longest Substring • Prefix Search</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {[
          { id: "anagram", label: "Anagram Check" },
          { id: "longestSub", label: "Longest Substring" },
          { id: "reverse", label: "Reverse String" },
          { id: "palindrome", label: "Palindrome Check" },
          { id: "prefix", label: "Prefix Search" },
        ].map((b) => (
          <button
            key={b.id}
            onClick={() => setAlgo(b.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              algo === b.id ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-4 space-y-3">
        {algo === "anagram" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">String 1</label>
              <input type="text" value={str1} onChange={(e) => setStr1(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">String 2</label>
              <input type="text" value={str2} onChange={(e) => setStr2(e.target.value)} className="intel-input" />
            </div>
          </div>
        ) : algo === "longestSub" ? (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Input String</label>
            <input type="text" value={subStr} onChange={(e) => setSubStr(e.target.value)} className="intel-input" />
          </div>
        ) : algo === "prefix" ? (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Prefix Search Input</label>
            <input type="text" value={prefixInput} onChange={(e) => setPrefixInput(e.target.value)} className="intel-input" />
            <p className="text-[10px] text-muted-foreground mt-1">Searching inside: [{wordList.join(", ")}]</p>
          </div>
        ) : (
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Input String</label>
            <input type="text" value={str1} onChange={(e) => setStr1(e.target.value)} className="intel-input" />
          </div>
        )}
      </div>

      {output && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 font-mono text-xs">
          <div className="border-b border-border pb-3">
            <span className="text-muted-foreground block">Result:</span>
            <span className="font-bold text-primary text-sm">{JSON.stringify(output.reversed || output.isAnagram || output.isPalindrome || output.substring || output.matches)}</span>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {output.steps?.map((st: any, i: number) => (
              <div key={i} className="p-2 rounded bg-secondary/40 border border-border/50 text-foreground">
                <span className="text-muted-foreground mr-2">[{i + 1}]</span>
                {st.description}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
