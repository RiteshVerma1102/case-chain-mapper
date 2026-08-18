import { useState } from "react";
import { CaseProcessingQueue } from "@/dsa/queue/Queue";
import { useCases } from "@/context/CaseContext";
import { ArrowRight } from "lucide-react";

export default function QueueModule() {
  const { cases } = useCases();
  const [procQueue] = useState(() => {
    const q = new CaseProcessingQueue();
    cases.slice(0, 4).forEach(c => q.addCaseToQueue(c.caseId, c.title));
    return q;
  });

  const [, setTick] = useState(0);

  const handleEnqueue = () => {
    const randomCase = cases[Math.floor(Math.random() * cases.length)];
    procQueue.addCaseToQueue(randomCase.caseId, randomCase.title);
    setTick(t => t + 1);
  };

  const handleDequeue = () => {
    procQueue.processNextCase();
    setTick(t => t + 1);
  };

  const currentItems = procQueue.getQueueState();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Queue Data Structure</h3>
        <p className="text-xs text-muted-foreground">FIFO (First In First Out) • Case Processing Queue • Front / Rear Pointers</p>
      </div>

      <div className="glass-card p-4 flex gap-3">
        <button onClick={handleEnqueue} className="intel-btn-primary text-xs flex-1">Enqueue Case (at Rear)</button>
        <button onClick={handleDequeue} className="intel-btn text-xs flex-1 text-destructive">Dequeue & Process (from Front)</button>
      </div>

      {/* Queue Visual */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
          <span>FRONT (Next to Process)</span>
          <span>REAR (Newly Enqueued)</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto p-4 bg-secondary/30 rounded-xl border border-border">
          {currentItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 flex-shrink-0">
              <div className="w-44 p-3 rounded-lg bg-card border border-primary/30 font-mono text-xs space-y-1">
                <span className="text-primary font-bold">{item.id}</span>
                <p className="text-foreground truncate font-sans text-xs">{item.title}</p>
                <div className="text-[10px] text-muted-foreground pt-1 border-t border-border flex justify-between">
                  <span>{idx === 0 ? "FRONT" : idx === currentItems.length - 1 ? "REAR" : `Pos #${idx + 1}`}</span>
                </div>
              </div>
              {idx < currentItems.length - 1 && <ArrowRight size={16} className="text-primary" />}
            </div>
          ))}
          {currentItems.length === 0 && (
            <div className="w-full text-center text-xs text-muted-foreground italic py-6">
              Processing queue is empty!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
