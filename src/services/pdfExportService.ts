import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/utils/currency';
import { HierarchicalEstimate, Estimate, AssemblyEstimateItem } from '@/types/estimate';

// Extend jsPDF type for autoTable to match existing declaration
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface CategorySummary {
  name: string;
  assemblies: AssemblyEstimateItem[];
  totalCost: number;
  componentCount: number;
}

export class PDFExportService {
  private static readonly PAGE_WIDTH = 210; // A4 width in mm
  private static readonly PAGE_HEIGHT = 297; // A4 height in mm
  private static readonly MARGIN = 20;

  static async exportEstimateToPDF(
    estimate: HierarchicalEstimate | Estimate,
    isHierarchical: boolean
  ): Promise<void> {
    const pdf = new jsPDF();
    
    try {
      if (isHierarchical) {
        await this.generateHierarchicalPDF(pdf, estimate as HierarchicalEstimate);
      } else {
        await this.generateLegacyPDF(pdf, estimate as Estimate);
      }

      // Generate filename with date
      const date = new Date().toLocaleDateString().replace(/\//g, '-');
      const filename = `${estimate.name.replace(/[^a-zA-Z0-9]/g, '_')}_estimate_${date}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF export');
    }
  }

  private static generateHierarchicalPDF(pdf: jsPDF, estimate: HierarchicalEstimate): void {
    this.addHeader(pdf, estimate.name);
    
    // Executive Summary
    this.addExecutiveSummary(pdf, {
      totalCost: estimate.totalCost,
      totalAssemblies: estimate.assemblies.length,
      totalLaborHours: estimate.totalLaborHours,
      createdAt: estimate.createdAt
    });

    // Calculate categories
    const categories = this.processCategories(estimate.assemblies);
    
    // Add category breakdown
    this.addCategoryBreakdown(pdf, categories);

    // Add detailed assembly breakdown
    let yPosition = pdf.internal.pageSize.height - 40;
    
    categories.forEach((category) => {
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.height - 60) {
        pdf.addPage();
        yPosition = this.MARGIN;
        this.addPageHeader(pdf, estimate.name);
      }

      yPosition = this.addCategorySection(pdf, category, yPosition);
    });

    this.addFooter(pdf);
  }

  private static generateLegacyPDF(pdf: jsPDF, estimate: Estimate): void {
    this.addHeader(pdf, estimate.name);
    
    // Executive Summary
    const totalComponents = estimate.items.length;
    const totalLaborHours = estimate.items.reduce((sum, item) => sum + (item.laborHours || 0), 0);
    
    this.addExecutiveSummary(pdf, {
      totalCost: estimate.totalCost,
      totalComponents,
      totalLaborHours,
      createdAt: estimate.createdAt
    });

    // Add items table
    const tableData = estimate.items.map(item => [
      item.componentName,
      item.qualityTier.name,
      `${item.quantity} ${item.unit}`,
      formatCurrency(item.qualityTier.unitCost),
      formatCurrency(item.totalCost)
    ]);

    autoTable(pdf, {
      head: [['Component', 'Quality Tier', 'Quantity', 'Unit Cost', 'Total Cost']],
      body: tableData,
      startY: 120,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    this.addFooter(pdf);
  }

  private static addHeader(pdf: jsPDF, estimateName: string): void {
    // Main title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Estimate Report', this.MARGIN, 30);
    
    // Estimate name
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(estimateName, this.MARGIN, 45);
    
    // Date
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, this.MARGIN, 55);
    
    // Separator line
    pdf.setLineWidth(0.5);
    pdf.line(this.MARGIN, 60, this.PAGE_WIDTH - this.MARGIN, 60);
  }

  private static addPageHeader(pdf: jsPDF, estimateName: string): void {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${estimateName} - Continued`, this.MARGIN, 20);
    pdf.setLineWidth(0.3);
    pdf.line(this.MARGIN, 25, this.PAGE_WIDTH - this.MARGIN, 25);
  }

  private static addExecutiveSummary(pdf: jsPDF, summary: {
    totalCost: number;
    totalAssemblies?: number;
    totalComponents?: number;
    totalLaborHours: number;
    createdAt: Date;
  }): void {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', this.MARGIN, 75);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const summaryData = [
      ['Total Project Cost', formatCurrency(summary.totalCost)],
      ['Total Labor Hours', `${summary.totalLaborHours.toFixed(1)} hours`],
      ['Created Date', summary.createdAt.toLocaleDateString()]
    ];

    if (summary.totalAssemblies) {
      summaryData.splice(1, 0, ['Total Assemblies', summary.totalAssemblies.toString()]);
    }
    
    if (summary.totalComponents) {
      summaryData.splice(1, 0, ['Total Components', summary.totalComponents.toString()]);
    }

    autoTable(pdf, {
      body: summaryData,
      startY: 80,
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 60 }
      },
      theme: 'plain'
    });
  }

  private static addCategoryBreakdown(pdf: jsPDF, categories: CategorySummary[]): void {
    const tableData = categories.map(category => [
      category.name,
      category.assemblies.length.toString(),
      category.componentCount.toString(),
      formatCurrency(category.totalCost)
    ]);

    autoTable(pdf, {
      head: [['Category', 'Assemblies', 'Components', 'Total Cost']],
      body: tableData,
      startY: 140,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  }

  private static addCategorySection(pdf: jsPDF, category: CategorySummary, startY: number): number {
    let currentY = startY;
    
    // Category header
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(category.name, this.MARGIN, currentY);
    currentY += 15;

    // Assembly details
    category.assemblies.forEach((assembly) => {
      // Check if we need a new page
      if (currentY > pdf.internal.pageSize.height - 80) {
        pdf.addPage();
        currentY = this.MARGIN;
        this.addPageHeader(pdf, 'Estimate Details');
      }

      // Assembly header
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${assembly.assemblyName} (Qty: ${assembly.quantity})`, this.MARGIN + 5, currentY);
      currentY += 10;

      // Assembly cost summary
      const totalCost = (assembly.totalMaterialCost + assembly.totalLaborCost) * assembly.quantity;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total: ${formatCurrency(totalCost)} | Labor: ${(assembly.totalLaborHours * assembly.quantity).toFixed(1)} hrs`, this.MARGIN + 10, currentY);
      currentY += 15;

      // Components table
      const componentData = assembly.components.map(component => [
        component.componentName,
        component.qualityTier.name,
        `${component.quantity * assembly.quantity} ${component.unit}`,
        formatCurrency(component.qualityTier.unitCost),
        formatCurrency(component.totalCost * assembly.quantity)
      ]);

      autoTable(pdf, {
        head: [['Component', 'Quality', 'Quantity', 'Unit Cost', 'Total']],
        body: componentData,
        startY: currentY,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [220, 220, 220] },
        margin: { left: this.MARGIN + 10 },
        tableWidth: this.PAGE_WIDTH - this.MARGIN * 2 - 10
      });

      currentY = (pdf as any).lastAutoTable.finalY + 10;
    });

    return currentY;
  }

  private static addFooter(pdf: jsPDF): void {
    const pageCount = pdf.internal.pages.length - 1;
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        this.PAGE_WIDTH - this.MARGIN - 20,
        this.PAGE_HEIGHT - 10
      );
      pdf.text(
        'This estimate is confidential and proprietary.',
        this.MARGIN,
        this.PAGE_HEIGHT - 10
      );
    }
  }

  private static processCategories(assemblies: AssemblyEstimateItem[]): CategorySummary[] {
    const categoryMap = new Map<string, CategorySummary>();

    assemblies.forEach((assembly) => {
      const categoryName = this.determineCategoryFromAssembly(assembly);
      
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          assemblies: [],
          totalCost: 0,
          componentCount: 0
        });
      }

      const category = categoryMap.get(categoryName)!;
      category.assemblies.push(assembly);
      category.totalCost += (assembly.totalMaterialCost + assembly.totalLaborCost) * assembly.quantity;
      category.componentCount += assembly.components.length;
    });

    return Array.from(categoryMap.values());
  }

  private static determineCategoryFromAssembly(assembly: AssemblyEstimateItem): string {
    const name = assembly.assemblyName.toLowerCase();
    
    if (name.includes('electrical') || name.includes('power') || name.includes('lighting')) {
      return 'Electrical Systems';
    }
    if (name.includes('mechanical') || name.includes('hvac') || name.includes('cooling')) {
      return 'Mechanical Systems';
    }
    if (name.includes('network') || name.includes('cable') || name.includes('fiber')) {
      return 'Network Infrastructure';
    }
    if (name.includes('security') || name.includes('access') || name.includes('camera')) {
      return 'Security Systems';
    }
    if (name.includes('rack') || name.includes('cabinet') || name.includes('enclosure')) {
      return 'Rack Systems';
    }
    if (name.includes('server') || name.includes('compute') || name.includes('storage')) {
      return 'IT Equipment';
    }
    
    return 'General Systems';
  }
}