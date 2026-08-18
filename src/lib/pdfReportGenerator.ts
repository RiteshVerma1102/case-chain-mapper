import jsPDF from "jspdf";
import "jspdf-autotable";
import { CaseData } from "./LinkedList";

interface PDFWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
  autoTable: (options: object) => void;
}

export type ReportType = "quick" | "full" | "dsa";

export interface ComprehensivePDFOptions {
  caseData: CaseData;
  relatedCases?: CaseData[];
  reportType?: ReportType;
  bfsTraversal?: string[];
  dfsTraversal?: string[];
}

export function generateCaseReportPDF(options: ComprehensivePDFOptions): void {
  const { caseData, relatedCases = [], reportType = "full", bfsTraversal = [], dfsTraversal = [] } = options;

  const pdfInstance = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdf = pdfInstance as PDFWithAutoTable;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const checkPageBreak = (neededHeight: number = 10) => {
    if (yPosition + neededHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin + 5;
    }
  };

  const addHeading = (text: string, level: 1 | 2 = 1) => {
    checkPageBreak(12);
    if (level === 1) {
      yPosition += 4;
      pdf.setDrawColor(79, 70, 229);
      pdf.setLineWidth(0.6);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 4;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(30, 41, 59);
      pdf.text(text, margin, yPosition);
      yPosition += 6;
    } else {
      yPosition += 3;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(79, 70, 229);
      pdf.text(text, margin, yPosition);
      yPosition += 5;
    }
  };

  const addParagraph = (text: string, size: number = 9, isBold: boolean = false, color: [number, number, number] = [51, 65, 85]) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    pdf.setTextColor(...color);

    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = size * 0.4;
    checkPageBreak(lines.length * lineHeight + 2);

    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 2;
  };

  // -------------------------------------------------------------
  // PAGE 1: COVER PAGE
  // -------------------------------------------------------------
  pdf.setFillColor(15, 23, 42); // Deep Slate
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Accent Line
  pdf.setFillColor(99, 102, 241);
  pdf.rect(margin, 40, 12, 3, "F");

  // Title & Subtitle
  pdf.setFontSize(26);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("INVESTIGATION CASE REPORT", margin, 55);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(148, 163, 184);
  pdf.text("Case Chain Mapper • Digital Intelligence Platform", margin, 63);

  // Metadata Card on Cover
  pdf.setFillColor(30, 41, 59);
  pdf.roundedRect(margin, 85, contentWidth, 80, 4, 4, "F");

  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text(`CASE ID: ${caseData.caseId}`, margin + 8, 98);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(203, 213, 225);
  pdf.text(`Title: ${caseData.title}`, margin + 8, 108);
  pdf.text(`Suspect: ${caseData.suspectName}`, margin + 8, 117);
  pdf.text(`Priority Level: ${caseData.priority.toUpperCase()}`, margin + 8, 126);
  pdf.text(`Current Status: ${caseData.status}`, margin + 8, 135);
  pdf.text(`Date Filed: ${caseData.date}`, margin + 8, 144);
  pdf.text(`Report Type: ${reportType.toUpperCase()} INVESTIGATION`, margin + 8, 153);

  // Cover Footer
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - 20);
  pdf.text("Confidential Criminal Intelligence Record", margin, pageHeight - 15);

  // -------------------------------------------------------------
  // PAGE 2: EXECUTIVE SUMMARY & OVERVIEW
  // -------------------------------------------------------------
  pdf.addPage();
  yPosition = margin;

  addHeading("1. Executive Summary & Overview", 1);
  addParagraph(`Case ${caseData.caseId} ("${caseData.title}") is currently classified as ${caseData.status} with a priority rating of ${caseData.priority}. Primary investigation focuses on suspect "${caseData.suspectName}".`);

  addHeading("Case Metadata Overview", 2);
  pdf.autoTable({
    startY: yPosition,
    head: [["Attribute", "Details"]],
    body: [
      ["Case ID", caseData.caseId],
      ["Case Title", caseData.title],
      ["Primary Suspect", caseData.suspectName],
      ["Priority Classification", caseData.priority],
      ["Investigation Status", caseData.status],
      ["Date Created", caseData.date],
      ["Connected Network Count", `${relatedCases.length} Direct Connections`],
    ],
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8.5, cellPadding: 2.5 },
  });
  yPosition = (pdf.lastAutoTable?.finalY ?? yPosition) + 6;

  addHeading("Case Description & Context", 2);
  addParagraph(caseData.description || "No description supplied for this case.");

  // -------------------------------------------------------------
  // PAGE 3: PEOPLE, SUSPECTS & TIMELINE
  // -------------------------------------------------------------
  if (reportType !== "quick") {
    addHeading("2. People & Suspect Identification", 1);
    addParagraph(`Primary person of interest linked to Case ${caseData.caseId}:`);

    pdf.autoTable({
      startY: yPosition,
      head: [["Suspect Name", "Role", "Case Link", "Network Status"]],
      body: [
        [caseData.suspectName, "Primary Suspect", caseData.caseId, "Under Active Investigation"],
        ...relatedCases.map(rc => [rc.suspectName, "Co-Suspect / Associate", rc.caseId, rc.status])
      ],
      margin: { left: margin, right: margin },
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 2.5 },
    });
    yPosition = (pdf.lastAutoTable?.finalY ?? yPosition) + 6;

    addHeading("3. Investigation Timeline", 1);
    const timelineEvents = [
      ["Filed Date", caseData.date, `Case ${caseData.caseId} initialized in system`],
      ["Suspect Linked", caseData.date, `Suspect ${caseData.suspectName} associated`],
      ["Network Analysis", new Date().toISOString().split("T")[0], `${relatedCases.length} connected cases mapped in Adjacency Graph`],
      ["Current Review", new Date().toISOString().split("T")[0], `Status: ${caseData.status}`]
    ];

    pdf.autoTable({
      startY: yPosition,
      head: [["Milestone", "Date", "Event Description"]],
      body: timelineEvents,
      margin: { left: margin, right: margin },
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
      styles: { fontSize: 8.5, cellPadding: 2.5 },
    });
    yPosition = (pdf.lastAutoTable?.finalY ?? yPosition) + 6;
  }

  // -------------------------------------------------------------
  // PAGE 4: CASE CONNECTIONS & GRAPH NETWORK
  // -------------------------------------------------------------
  if (reportType === "full" || reportType === "dsa") {
    addHeading("4. Case Relationship Network & Graph Traversal", 1);
    addParagraph(`Direct network connections for Case ${caseData.caseId} mapped via Adjacency List Graph:`);

    if (relatedCases.length > 0) {
      pdf.autoTable({
        startY: yPosition,
        head: [["Related Case ID", "Title", "Suspect", "Priority", "Status"]],
        body: relatedCases.map(rc => [rc.caseId, rc.title, rc.suspectName, rc.priority, rc.status]),
        margin: { left: margin, right: margin },
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 2 },
      });
      yPosition = (pdf.lastAutoTable?.finalY ?? yPosition) + 6;
    } else {
      addParagraph("No direct case relationships recorded in graph.");
    }

    addHeading("Graph Algorithmic Traversal Execution", 2);
    if (bfsTraversal.length > 0) {
      addParagraph(`Breadth-First Search (BFS Order): ${bfsTraversal.join(" → ")}`, 8.5, true);
    }
    if (dfsTraversal.length > 0) {
      addParagraph(`Depth-First Search (DFS Order): ${dfsTraversal.join(" → ")}`, 8.5, true);
    }
  }

  // -------------------------------------------------------------
  // PAGE 5: DSA BEHIND THE INVESTIGATION & KEY FINDINGS
  // -------------------------------------------------------------
  addHeading("5. Data Structures & Algorithms (DSA) Behind Investigation", 1);
  const dsaTable = [
    ["Data Structure / Algorithm", "Project Application", "Time Complexity", "Space Complexity"],
    ["Singly Linked List", "Primary storage engine for case chain", "O(1) Head Ins / O(n) Search", "O(n)"],
    ["Adjacency List Graph", "Case relationship network model", "O(V + E) Traversal", "O(V + E)"],
    ["Breadth-First Search (BFS)", "Explores level-order connected cases", "O(V + E)", "O(V)"],
    ["Depth-First Search (DFS)", "Traverses deep investigation paths", "O(V + E)", "O(V)"],
    ["Trie (Prefix Tree)", "Suspect & case title autocomplete", "O(L) per search", "O(Alphabet * N)"],
    ["Max Heap", "Case priority management queue", "O(log n) Insert/Extract", "O(n)"],
    ["Chaining Hash Table", "O(1) instant case/suspect lookup", "O(1) avg", "O(n)"]
  ];

  pdf.autoTable({
    startY: yPosition,
    head: [dsaTable[0]],
    body: dsaTable.slice(1),
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
    styles: { fontSize: 8, cellPadding: 2 },
  });
  yPosition = (pdf.lastAutoTable?.finalY ?? yPosition) + 6;

  addHeading("Key Findings & Investigation Conclusion", 2);
  addParagraph(`• Case ${caseData.caseId} maintains ${relatedCases.length} direct network connections.`);
  addParagraph(`• Primary suspect "${caseData.suspectName}" is monitored across active graph nodes.`);
  addParagraph(`• Priority level ${caseData.priority} dictates immediate review allocation.`);

  // -------------------------------------------------------------
  // PAGE NUMBERS & FOOTERS
  // -------------------------------------------------------------
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    if (i === 1) continue; // Skip cover footer

    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Case Report: ${caseData.caseId} • Confidential`, margin, pageHeight - 8);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  // Save PDF
  pdf.save(`Case_Report_${caseData.caseId}_${reportType}_${Date.now()}.pdf`);
}
