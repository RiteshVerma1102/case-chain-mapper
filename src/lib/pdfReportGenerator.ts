import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CaseData } from "./LinkedList";

export interface ComprehensivePDFOptions {
  caseData: CaseData;
  relatedCases?: CaseData[];
  entities?: any[];
  relationships?: any[];
  timeline?: any[];
  evidence?: any[];
  investigation?: any;
  bfsTraversal?: string[];
  dfsTraversal?: string[];
}

export function generateCaseReportPDF(options: ComprehensivePDFOptions): void {
  const {
    caseData,
    relatedCases = [],
    entities = [],
    relationships = [],
    timeline = [],
    evidence = [],
    investigation = null,
    bfsTraversal = [],
    dfsTraversal = [],
  } = options;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  const checkPageBreak = (needed: number = 12) => {
    if (y + needed > pageHeight - margin) {
      pdf.addPage();
      y = margin + 6;
      // Header for subsequent pages
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 150);
      pdf.text(`CaseChain Intelligence Platform — Case Reference: ${caseData.caseId}`, margin, margin - 6);
      pdf.setDrawColor(220, 220, 230);
      pdf.setLineWidth(0.2);
      pdf.line(margin, margin - 4, pageWidth - margin, margin - 4);
    }
  };

  const addHeading = (title: string, subtitle?: string) => {
    checkPageBreak(18);
    y += 4;
    pdf.setDrawColor(124, 58, 237); // Purple accent
    pdf.setLineWidth(0.8);
    pdf.line(margin, y, margin + 24, y);
    y += 4;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.setTextColor(20, 20, 35);
    pdf.text(title.toUpperCase(), margin, y);
    y += 5;

    if (subtitle) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 120);
      pdf.text(subtitle, margin, y);
      y += 5;
    }
  };

  // ============================================================
  // COVER PAGE (PREMIUM DARK SLATE ENTERPRISE THEME)
  // ============================================================
  pdf.setFillColor(15, 17, 30);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Top Glowing Accent Band
  pdf.setFillColor(124, 58, 237);
  pdf.rect(margin, 35, 16, 3, "F");

  // Title & Subtitle
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text("CASE INVESTIGATION REPORT", margin, 48);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(167, 139, 250);
  pdf.text("CaseChain • Relationship Intelligence Platform", margin, 56);

  // Divider Line
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.2);
  pdf.line(margin, 64, pageWidth - margin, 64);

  // Metadata Card Box
  pdf.setFillColor(24, 26, 44);
  pdf.roundedRect(margin, 74, contentWidth, 80, 4, 4, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(167, 139, 250);
  pdf.text("CASE METADATA", margin + 8, 86);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text(caseData.title, margin + 8, 96);

  const metaItems = [
    { label: "Case ID", val: caseData.caseId },
    { label: "Classification", val: caseData.category || "Investigation" },
    { label: "Severity / Priority", val: caseData.priority },
    { label: "Current Status", val: caseData.status },
    { label: "Primary Entity / Suspect", val: caseData.suspectName || "Unknown" },
    { label: "Assigned Investigator", val: caseData.investigator || "Senior Investigator" },
    { label: "Date Initialized", val: new Date(caseData.date).toLocaleDateString() },
    { label: "Security Clearance", val: "CONFIDENTIAL / LEVEL-3" },
  ];

  let metaY = 108;
  for (let i = 0; i < metaItems.length; i += 2) {
    const left = metaItems[i];
    const right = metaItems[i + 1];

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text(left.label.toUpperCase(), margin + 8, metaY);
    if (right) pdf.text(right.label.toUpperCase(), margin + contentWidth / 2, metaY);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9.5);
    pdf.setTextColor(240, 240, 250);
    pdf.text(left.val, margin + 8, metaY + 4.5);
    if (right) pdf.text(right.val, margin + contentWidth / 2, metaY + 4.5);

    metaY += 12;
  }

  // Cover Footer
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Document Generated: ${new Date().toUTCString()}`, margin, pageHeight - 20);
  pdf.text("Authorized Law Enforcement & Legal Intelligence Record — Do Not Disclose", margin, pageHeight - 15);

  // ============================================================
  // PAGE 2: EXECUTIVE SUMMARY & OBJECTIVES
  // ============================================================
  pdf.addPage();
  y = margin;

  addHeading("1. Executive Summary & Incident Profile");

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(40, 45, 60);
  const descLines = pdf.splitTextToSize(caseData.description || "No narrative details logged for this investigation.", contentWidth);
  pdf.text(descLines, margin, y);
  y += descLines.length * 4.5 + 8;

  // Case Investigation Objectives
  addHeading("2. Investigation Objectives & Status");
  const objectives = investigation?.objectives?.length > 0
    ? investigation.objectives
    : [
        "Reconstruct full chronological timeline from digital and physical logs",
        "Perform cross-case intelligence analysis for repeat entities and serial vectors",
        "Secure forensic chain of custody for all seized items",
        "Map corporate entity structures and financial asset transfers",
      ];

  objectives.forEach((obj: string, i: number) => {
    checkPageBreak(8);
    pdf.setFillColor(124, 58, 237);
    pdf.circle(margin + 2, y - 1, 1.2, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(40, 45, 60);
    const lines = pdf.splitTextToSize(obj, contentWidth - 8);
    pdf.text(lines, margin + 6, y);
    y += lines.length * 4.5 + 2;
  });

  y += 4;

  // Key Findings
  if (investigation?.findings?.length > 0) {
    addHeading("3. Key Investigative Findings");
    const findingsBody = investigation.findings.map((f: any, i: number) => [
      `F-${(i + 1).toString().padStart(2, '0')}`,
      f.text,
      f.confidence || "High",
      f.author || "Investigator",
    ]);

    autoTable(pdf, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["ID", "Finding Observation", "Confidence", "Investigator"]],
      body: findingsBody,
      headStyles: { fillColor: [45, 40, 75], textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 8, textColor: [30, 30, 45] },
      columnStyles: { 0: { cellWidth: 14 }, 2: { cellWidth: 24 }, 3: { cellWidth: 30 } },
    });

    y = (pdf as any).lastAutoTable.finalY + 10;
  }

  // ============================================================
  // PAGE 3: CONNECTED ENTITIES & RELATIONSHIPS
  // ============================================================
  checkPageBreak(35);
  addHeading("4. Key Entities & Relationship Vectors", "Graph adjacency mappings and connected subjects");

  const entList = entities.length > 0
    ? entities
    : [
        { name: caseData.suspectName || "Unknown", type: "Person", riskLevel: caseData.priority },
        { name: "Harbor Logistics Freight Co.", type: "Organization", riskLevel: "High" },
        { name: "Encrypted Burner Terminal", type: "Phone", riskLevel: "High" },
        { name: "Offshore Wire Relays", type: "Transaction", riskLevel: "Critical" },
      ];

  const entityBody = entList.map((e: any, i: number) => [
    e.entityId || `ENT-${(i + 1).toString().padStart(3, '0')}`,
    e.name,
    e.type || "Subject",
    e.riskLevel || "Medium",
    e.description || "Associated node identified in investigation chain",
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Entity ID", "Name / Subject", "Type", "Risk Level", "Description"]],
    body: entityBody,
    headStyles: { fillColor: [124, 58, 237], textColor: 255, fontSize: 8.5 },
    styles: { fontSize: 8, textColor: [30, 30, 45] },
    columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 38 }, 2: { cellWidth: 24 }, 3: { cellWidth: 22 } },
  });

  y = (pdf as any).lastAutoTable.finalY + 8;

  // Relationships Table
  if (relationships.length > 0) {
    checkPageBreak(30);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 80);
    pdf.text("Relationship Intelligence Vectors", margin, y);
    y += 4;

    const relBody = relationships.map((r: any) => [
      r.sourceEntity,
      r.type || "Associated with",
      r.targetEntity,
      r.strength || "strong",
      r.details || "Direct linkage verified",
    ]);

    autoTable(pdf, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Source Entity", "Relationship Type", "Target Entity", "Strength", "Intelligence Notes"]],
      body: relBody,
      headStyles: { fillColor: [45, 40, 75], textColor: 255, fontSize: 8.5 },
      styles: { fontSize: 7.5, textColor: [30, 30, 45] },
      columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 30 }, 2: { cellWidth: 35 }, 3: { cellWidth: 20 } },
    });

    y = (pdf as any).lastAutoTable.finalY + 10;
  }

  // ============================================================
  // CHRONOLOGICAL TIMELINE TABLE
  // ============================================================
  checkPageBreak(35);
  addHeading("5. Chronological Investigation Timeline", "Timestamped event sequence");

  const timelineList = timeline.length > 0
    ? timeline
    : [
        { date: caseData.date, time: "01:12 AM", eventType: "Incident", description: "Perimeter breach and alarm trigger recorded", location: "Harbor Terminal" },
        { date: caseData.date, time: "04:15 AM", eventType: "Evidence Upload", description: "Tool remnants logged into custody", location: "Crime Scene" },
      ];

  const timelineBody = timelineList.map((evt: any) => [
    evt.date ? new Date(evt.date).toLocaleDateString() : "2026-04-01",
    evt.time || "12:00 PM",
    evt.eventType || "Event",
    evt.description,
    evt.relatedEntity || "—",
    evt.location || "Metro District",
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Date", "Time", "Event Type", "Description", "Linked Entity", "Location"]],
    body: timelineBody,
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontSize: 8.5 },
    styles: { fontSize: 7.5, textColor: [30, 30, 45] },
    columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 16 }, 2: { cellWidth: 24 }, 4: { cellWidth: 28 }, 5: { cellWidth: 26 } },
  });

  y = (pdf as any).lastAutoTable.finalY + 10;

  // ============================================================
  // EVIDENCE INVENTORY TABLE
  // ============================================================
  checkPageBreak(35);
  addHeading("6. Evidence Chain of Custody", "Physical, digital, and documentary exhibits");

  const evidenceList = evidence.length > 0
    ? evidence
    : [
        { evidenceId: "EVD-001", name: "Surveillance Storage Volume (4K)", type: "Video", status: "Verified", uploadedBy: "Forensic Team" },
        { evidenceId: "EVD-002", name: "Recovered Exothermic Tool Slag", type: "Physical Evidence", status: "Verified", uploadedBy: "Lab Chemist" },
      ];

  const evidenceBody = evidenceList.map((ev: any) => [
    ev.evidenceId || "EVD-001",
    ev.name,
    ev.type || "Digital Record",
    ev.status || "Collected",
    ev.uploadedBy || "Specialist",
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Evidence ID", "Exhibit Name", "Category", "Status", "Secured By"]],
    body: evidenceBody,
    headStyles: { fillColor: [124, 58, 237], textColor: 255, fontSize: 8.5 },
    styles: { fontSize: 8, textColor: [30, 30, 45] },
  });

  y = (pdf as any).lastAutoTable.finalY + 10;

  // ============================================================
  // GRAPH / ALGORITHMIC TRAVERSAL (BFS / DFS)
  // ============================================================
  if (bfsTraversal.length > 0 || dfsTraversal.length > 0 || relatedCases.length > 0) {
    checkPageBreak(35);
    addHeading("7. Algorithmic Intelligence Analysis (DSA Traversal)", "Adjacency list BFS & DFS path tracing");

    if (bfsTraversal.length > 0) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(124, 58, 237);
      pdf.text("Breadth-First Search (BFS) Discovery Path (Connected Cases):", margin, y);
      y += 4.5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(50, 50, 65);
      const bfsText = bfsTraversal.join("  →  ");
      const bfsLines = pdf.splitTextToSize(bfsText, contentWidth);
      pdf.text(bfsLines, margin, y);
      y += bfsLines.length * 4.5 + 4;
    }

    if (dfsTraversal.length > 0) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(37, 99, 235);
      pdf.text("Depth-First Search (DFS) Deep Trace (Serial Relationship Path):", margin, y);
      y += 4.5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(50, 50, 65);
      const dfsText = dfsTraversal.join("  →  ");
      const dfsLines = pdf.splitTextToSize(dfsText, contentWidth);
      pdf.text(dfsLines, margin, y);
      y += dfsLines.length * 4.5 + 4;
    }

    if (relatedCases.length > 0) {
      y += 2;
      const relCasesBody = relatedCases.map((rc: CaseData) => [
        rc.caseId,
        rc.title,
        rc.suspectName,
        rc.priority,
        rc.status,
      ]);

      autoTable(pdf, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["Related Case ID", "Case Title", "Shared Subject", "Priority", "Status"]],
        body: relCasesBody,
        headStyles: { fillColor: [45, 40, 75], textColor: 255, fontSize: 8 },
        styles: { fontSize: 7.5, textColor: [30, 30, 45] },
      });
      y = (pdf as any).lastAutoTable.finalY + 8;
    }
  }

  // ============================================================
  // CERTIFICATION & SIGN-OFF BLOCK
  // ============================================================
  checkPageBreak(30);
  y += 4;
  pdf.setDrawColor(200, 200, 215);
  pdf.setLineWidth(0.4);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(30, 30, 45);
  pdf.text("INVESTIGATOR ATTESTATION & CHAIN VERIFICATION", margin, y);
  y += 6;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 115);
  pdf.text("I hereby certify that the intelligence, entity mappings, and timeline records compiled in this report represent the verified findings of this agency at the time of generation.", margin, y, { maxWidth: contentWidth });
  y += 12;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.text("Lead Investigator Signature:", margin, y);
  pdf.text("Date Certified:", margin + contentWidth / 2, y);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.text(`Det. / Agent in Charge (${caseData.investigator || "Senior Investigator"})`, margin, y + 5);
  pdf.text(new Date().toLocaleDateString(), margin + contentWidth / 2, y + 5);

  // Footer on all pages
  const totalPages = (pdf.internal as any).getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(140, 140, 150);
    pdf.text(`CaseChain Intelligence Document • Page ${i} of ${totalPages}`, margin, pageHeight - 8);
    pdf.text(`Classification: CONFIDENTIAL`, pageWidth - margin - 35, pageHeight - 8);
  }

  // Save / Trigger Download
  const filename = `${caseData.caseId}_CaseChain_Investigation_Report.pdf`;
  pdf.save(filename);
}
