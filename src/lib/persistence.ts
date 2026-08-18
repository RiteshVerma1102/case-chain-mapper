/**
 * ============================================================
 * DATA PERSISTENCE & IMPORT / EXPORT MODULE
 * ============================================================
 * Handles localStorage sync, demo data reset, and JSON/CSV import & export.
 */

import { CaseData } from "./LinkedList";
import { sampleCases } from "./sampleData";

const STORAGE_KEY = "dcis_case_chain_data_v1";

/** Save cases to localStorage */
export function saveCasesToStorage(cases: CaseData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (err) {
    console.error("Failed to save cases to localStorage:", err);
  }
}

/** Load cases from localStorage, fallback to sampleCases */
export function loadCasesFromStorage(): CaseData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleCases;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    console.error("Failed to load cases from localStorage:", err);
  }
  return sampleCases;
}

/** Reset cases to initial sample data */
export function resetDemoData(): CaseData[] {
  saveCasesToStorage(sampleCases);
  return sampleCases;
}

/** Export cases to JSON file */
export function exportCasesToJSON(cases: CaseData[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cases, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `case_chain_export_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/** Export cases to CSV file */
export function exportCasesToCSV(cases: CaseData[]): void {
  const headers = ["caseId", "title", "description", "priority", "status", "suspectName", "date"];
  const rows = cases.map(c => [
    `"${c.caseId}"`,
    `"${c.title.replace(/"/g, '""')}"`,
    `"${c.description.replace(/"/g, '""')}"`,
    `"${c.priority}"`,
    `"${c.status}"`,
    `"${c.suspectName.replace(/"/g, '""')}"`,
    `"${c.date}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", encodeURI(csvContent));
  downloadAnchor.setAttribute("download", `case_chain_export_${Date.now()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/** Validate and import JSON case data */
export function importCasesFromJSON(jsonString: string): { success: boolean; cases?: CaseData[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { success: false, error: "Imported data must be an array of case objects" };
    }

    const validatedCases: CaseData[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < parsed.length; i++) {
      const c = parsed[i];
      if (!c.caseId || !c.title || !c.suspectName || !c.priority || !c.status) {
        return { success: false, error: `Item #${i + 1} is missing required fields (caseId, title, suspectName, priority, status)` };
      }
      if (seenIds.has(c.caseId)) {
        return { success: false, error: `Duplicate caseId found: "${c.caseId}"` };
      }
      seenIds.add(c.caseId);
      validatedCases.push({
        caseId: String(c.caseId),
        title: String(c.title),
        description: String(c.description || ""),
        priority: c.priority === "High" || c.priority === "Medium" || c.priority === "Low" ? c.priority : "Medium",
        status: c.status === "Open" || c.status === "Closed" ? c.status : "Open",
        suspectName: String(c.suspectName),
        date: String(c.date || new Date().toISOString().split("T")[0])
      });
    }

    return { success: true, cases: validatedCases };
  } catch (err: any) {
    return { success: false, error: `JSON Parse Error: ${err.message}` };
  }
}
