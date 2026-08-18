import { useState } from "react";
import { HashTable, buildFrequencyMap, charFrequency, twoSumHash, detectDuplicatesHash } from "@/dsa/hashing/HashTable";
import { Play } from "lucide-react";

export default function HashingModule() {
  const [hashTable] = useState(() => new HashTable<string, string>(8));
  const [keyInput, setKeyInput] = useState("CASE-001");
  const [valInput, setValInput] = useState("Marcus Webb");
  const [strInput, setStrInput] = useState("casechainmapper");
  const [arrayInput, setArrayInput] = useState("2, 7, 11, 15, 7, 2");
  const [targetInput, setTargetInput] = useState("9");
  const [activeTab, setActiveTab] = useState<"table" | "freq" | "char" | "twosum">("table");

  const [logs, setLogs] = useState<string[]>([]);
  const [buckets, setBuckets] = useState(hashTable.getBuckets());
  const [stats, setStats] = useState(hashTable.getStats());

  const addLog = (msg: string) => setLogs((prev) => [msg, ...prev]);

  const handleSet = () => {
    if (!keyInput) return;
    const res = hashTable.set(keyInput, valInput);
    addLog(`SET: Key "${keyInput}" → Index ${res.index}${res.collision ? " [COLLISION DETECTED & RESOLVED VIA CHAINING]" : ""}`);
    setBuckets([...hashTable.getBuckets()]);
    setStats(hashTable.getStats());
  };

  const handleGet = () => {
    if (!keyInput) return;
    const val = hashTable.get(keyInput);
    const idx = hashTable.getHashIndex(keyInput);
    addLog(val ? `GET: Key "${keyInput}" found at Bucket [${idx}] → Value: "${val}"` : `GET: Key "${keyInput}" not found!`);
  };

  const handleDelete = () => {
    if (!keyInput) return;
    const success = hashTable.delete(keyInput);
    addLog(success ? `DELETE: Key "${keyInput}" removed successfully` : `DELETE: Key "${keyInput}" not found`);
    setBuckets([...hashTable.getBuckets()]);
    setStats(hashTable.getStats());
  };

  const getNums = () => arrayInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Hashing & Hash Table Module</h3>
        <p className="text-xs text-muted-foreground">O(1) average lookup • Chaining Collision Resolution • Frequency Maps • Two-Sum Hash</p>
      </div>

      <div className="flex gap-2 border-b border-border pb-2">
        {[
          { id: "table", label: "Custom Hash Table" },
          { id: "freq", label: "Frequency Map" },
          { id: "char", label: "Character Freq" },
          { id: "twosum", label: "Two Sum Hash" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === t.id ? "bg-primary text-primary-foreground font-semibold" : "bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "table" && (
        <div className="space-y-4">
          <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Key</label>
              <input type="text" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Value</label>
              <input type="text" value={valInput} onChange={(e) => setValInput(e.target.value)} className="intel-input" />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button onClick={handleSet} className="intel-btn-primary text-xs flex-1">Set (O(1))</button>
              <button onClick={handleGet} className="intel-btn text-xs flex-1">Get (O(1))</button>
              <button onClick={handleDelete} className="intel-btn text-xs flex-1 text-destructive">Delete</button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Size</span>
              <span className="font-bold text-foreground">{stats.size}</span>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Capacity</span>
              <span className="font-bold text-foreground">{stats.capacity}</span>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Load Factor</span>
              <span className="font-bold text-primary">{stats.loadFactor.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Collisions</span>
              <span className="font-bold text-destructive">{stats.collisions}</span>
            </div>
          </div>

          {/* Buckets Visualization */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Hash Table Buckets (Chaining Visualization)</p>
            <div className="space-y-2">
              {buckets.map((bucket, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-secondary/40 rounded-lg border border-border/50 text-xs">
                  <span className="w-16 font-mono font-bold text-primary">Bucket {idx}:</span>
                  {bucket.length === 0 ? (
                    <span className="text-muted-foreground italic">empty</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {bucket.map((entry, eIdx) => (
                        <div key={eIdx} className="px-2.5 py-1 bg-secondary border border-border rounded font-mono text-foreground flex items-center gap-1">
                          <span className="text-accent font-semibold">{String(entry.key)}</span>
                          <span className="text-muted-foreground">:</span>
                          <span className="text-foreground">{String(entry.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Operation History</p>
            <div className="space-y-1 max-h-40 overflow-y-auto text-xs font-mono">
              {logs.map((log, i) => (
                <div key={i} className="text-foreground/80">{log}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "char" && (
        <div className="glass-card p-4 space-y-3">
          <label className="text-xs text-muted-foreground block">Input String</label>
          <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} className="intel-input" />
          <div className="p-3 bg-secondary rounded border border-border font-mono text-xs text-primary">
            {JSON.stringify(Object.fromEntries(charFrequency(strInput)), null, 2)}
          </div>
        </div>
      )}

      {activeTab === "twosum" && (
        <div className="glass-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Array</label>
              <input type="text" value={arrayInput} onChange={(e) => setArrayInput(e.target.value)} className="intel-input" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Target</label>
              <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="intel-input" />
            </div>
          </div>
          <div className="p-3 bg-secondary rounded border border-border font-mono text-xs text-emerald">
            {JSON.stringify(twoSumHash(getNums(), parseInt(targetInput) || 0), null, 2)}
          </div>
        </div>
      )}
    </div>
  );
}
