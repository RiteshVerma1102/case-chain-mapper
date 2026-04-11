import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { CaseData } from './LinkedList';

interface PDFWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number };
  autoTable: (options: object) => void;
}

export interface PDFExportOptions {
  caseData: CaseData;
  relatedCases?: CaseData[];
  includeTimeline?: boolean;
}

export async function generateInvestigationReportPDF(options: PDFExportOptions): Promise<void> {
  const { caseData, relatedCases = [], includeTimeline = true } = options;

  // Create PDF instance
  const pdfInstance = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdf = pdfInstance as PDFWithAutoTable;

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with automatic page breaks
  const addText = (
    text: string,
    size: number,
    weight: 'normal' | 'bold' = 'normal',
    color: [number, number, number] = [0, 0, 0]
  ) => {
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    pdf.setFont('helvetica', weight);
    
    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = size / 2.5;
    
    // Check if we need a new page
    if (yPosition + lines.length * lineHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 2;
  };

  const addSection = (title: string) => {
    if (yPosition > margin + 5) yPosition += 3;
    pdf.setDrawColor(100, 150, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 3;
    addText(title, 12, 'bold', [100, 150, 255]);
    yPosition += 2;
  };

  // Header
  addText('INVESTIGATION REPORT', 16, 'bold', [0, 0, 0]);
  yPosition += 3;
  addText(`Generated: ${new Date().toLocaleString()}`, 9, 'normal', [100, 100, 100]);
  yPosition += 5;

  // Case Overview Section
  addSection('CASE OVERVIEW');
  
  const priorityLabel = caseData.priority === 'High' ? 'CRITICAL' : 
                       caseData.priority === 'Medium' ? 'MODERATE' : 'LOW RISK';
  
  addText(`Case ID: ${caseData.caseId}`, 10, 'bold');
  addText(`Title: ${caseData.title}`, 10);
  addText(`Priority: ${priorityLabel}`, 10);
  addText(`Status: ${caseData.status}`, 10);
  addText(`Filed Date: ${new Date(caseData.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })}`, 10);
  addText(`Suspect: ${caseData.suspectName}`, 10);
  yPosition += 3;

  // Case Summary
  addSection('CASE SUMMARY');
  addText(caseData.description, 9, 'normal', [50, 50, 50]);
  yPosition += 3;

  // Case Details
  addSection('CASE DETAILS');
  const detailsTable = [
    ['Field', 'Value'],
    ['Classification', caseData.priority],
    ['Status', caseData.status === 'Open' ? 'Active Investigation' : 'Case Resolved'],
    ['Suspect Name', caseData.suspectName],
    ['Filed Date', new Date(caseData.date).toLocaleDateString()],
  ];

  pdf.autoTable({
    startY: yPosition,
    head: [[detailsTable[0][0], detailsTable[0][1]]],
    body: detailsTable.slice(1),
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [100, 150, 255],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  });

  yPosition = (pdf.lastAutoTable?.finalY ?? yPosition) + 5;

  // Related Cases Section
  if (relatedCases && relatedCases.length > 0) {
    addSection(`RELATED CASES (${relatedCases.length})`);
    
    const relatedTable = [
      ['Case ID', 'Title', 'Suspect', 'Priority', 'Status'],
      ...relatedCases.map(c => [
        c.caseId,
        c.title.length > 25 ? c.title.substring(0, 25) + '...' : c.title,
        c.suspectName,
        c.priority,
        c.status,
      ]),
    ];

    pdf.autoTable({
      startY: yPosition,
      head: [relatedTable[0]],
      body: relatedTable.slice(1),
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2.5,
      },
      headStyles: {
        fillColor: [100, 150, 255],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
      },
    });

    yPosition = (pdf.lastAutoTable?.finalY ?? yPosition) + 5;
  }

  // Timeline Section
  if (includeTimeline) {
    addSection('INVESTIGATION TIMELINE');
    
    const dateFormatted = new Date(caseData.date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const timelineEvents = [
      { time: dateFormatted, title: 'Case Filed', description: `Case ${caseData.caseId} was created and assigned priority level: ${caseData.priority}` },
      { time: dateFormatted, title: 'Suspect Identified', description: `Primary suspect "${caseData.suspectName}" linked to this investigation` },
      ...(caseData.status === 'Closed' ? [
        { time: 'Recent', title: 'Case Resolved', description: 'Investigation concluded — case marked as closed' }
      ] : []),
      { time: 'Now', title: 'Under Review', description: `Case currently ${caseData.status === 'Open' ? 'under active investigation' : 'archived in system'}` },
    ];

    timelineEvents.forEach((event, index) => {
      if (yPosition > pageHeight - margin - 10) {
        pdf.addPage();
        yPosition = margin;
      }
      
      addText(`${event.time}`, 9, 'bold', [100, 150, 255]);
      addText(`${event.title}`, 9, 'bold');
      addText(`${event.description}`, 8, 'normal', [80, 80, 80]);
      yPosition += 2;
    });
  }

  // Footer
  const internalPages = pdf.internal?.pages as unknown[] | undefined;
  const pageCount = (internalPages?.length ?? 1) - 1;
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Page ${i} of ${pageCount} | Case ID: ${caseData.caseId}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Download PDF
  const fileName = `Investigation_Report_${caseData.caseId}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
