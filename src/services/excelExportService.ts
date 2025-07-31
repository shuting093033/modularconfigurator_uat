import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HierarchicalEstimate, Estimate, AssemblyEstimateItem } from '../types/estimate';
import { formatCurrency } from '../utils/currency';

interface CategoryData {
  name: string;
  assemblies: AssemblyEstimateItem[];
  totalCost: number;
  componentCount: number;
  laborHours: number;
}

/**
 * Service for exporting estimate data to Excel files
 */
export class ExcelExportService {
  /**
   * Main export function that handles both hierarchical and legacy estimates
   */
  static async exportEstimateToExcel(
    estimate: HierarchicalEstimate | Estimate,
    isHierarchical: boolean
  ): Promise<void> {
    try {
      const workbook = XLSX.utils.book_new();
      
      if (isHierarchical) {
        this.generateHierarchicalExcel(workbook, estimate as HierarchicalEstimate);
      } else {
        this.generateLegacyExcel(workbook, estimate as Estimate);
      }
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${estimate.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.xlsx`;
      
      // Write and save the file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Failed to export estimate to Excel. Please try again.');
    }
  }

  /**
   * Generate Excel workbook for hierarchical estimates
   */
  private static generateHierarchicalExcel(workbook: XLSX.WorkBook, estimate: HierarchicalEstimate): void {
    const categories = this.processCategories(estimate.assemblies);
    
    // Executive Summary sheet
    this.addExecutiveSummarySheet(workbook, estimate, categories);
    
    // Category Breakdown sheet
    this.addCategoryBreakdownSheet(workbook, categories);
    
    // Detailed Components sheet
    this.addDetailedComponentsSheet(workbook, estimate.assemblies);
    
    // Assembly Summary sheet
    this.addAssemblySummarySheet(workbook, estimate.assemblies);
  }

  /**
   * Generate Excel workbook for legacy estimates
   */
  private static generateLegacyExcel(workbook: XLSX.WorkBook, estimate: Estimate): void {
    // Executive Summary sheet
    this.addLegacyExecutiveSummarySheet(workbook, estimate);
    
    // Components List sheet
    this.addLegacyComponentsSheet(workbook, estimate);
  }

  /**
   * Add Executive Summary sheet for hierarchical estimates
   */
  private static addExecutiveSummarySheet(workbook: XLSX.WorkBook, estimate: HierarchicalEstimate, categories: CategoryData[]): void {
    const summaryData = [
      ['Estimate Summary', ''],
      ['', ''],
      ['Estimate Name', estimate.name],
      ['Created Date', estimate.createdAt.toLocaleDateString()],
      ['Total Cost', formatCurrency(estimate.totalCost)],
      ['Total Labor Hours', estimate.totalLaborHours.toString()],
      ['Total Assemblies', estimate.assemblies.length.toString()],
      ['Total Components', estimate.assemblies.reduce((sum, assembly) => sum + assembly.components.length, 0).toString()],
      ['', ''],
      ['Category Breakdown', ''],
      ['Category', 'Total Cost'],
      ...categories.map(cat => [cat.name, formatCurrency(cat.totalCost)])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 20 },
      { width: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Executive Summary');
  }

  /**
   * Add Category Breakdown sheet
   */
  private static addCategoryBreakdownSheet(workbook: XLSX.WorkBook, categories: CategoryData[]): void {
    const breakdownData = [
      ['Category Breakdown', '', '', '', ''],
      ['', '', '', '', ''],
      ['Category', 'Assemblies', 'Components', 'Labor Hours', 'Total Cost'],
      ...categories.map(cat => [
        cat.name,
        cat.assemblies.length.toString(),
        cat.componentCount.toString(),
        cat.laborHours.toString(),
        formatCurrency(cat.totalCost)
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(breakdownData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 20 },
      { width: 12 },
      { width: 12 },
      { width: 15 },
      { width: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Category Breakdown');
  }

  /**
   * Add Detailed Components sheet
   */
  private static addDetailedComponentsSheet(workbook: XLSX.WorkBook, assemblies: AssemblyEstimateItem[]): void {
    const componentsData = [
      ['Detailed Components', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['Assembly', 'Component', 'Description', 'Quality', 'Quantity', 'Unit', 'Unit Cost', 'Total Cost']
    ];

    assemblies.forEach(assembly => {
      assembly.components.forEach(component => {
        componentsData.push([
          assembly.assemblyName,
          component.componentName,
          component.qualityTier.description || '',
          component.qualityTier.name,
          component.quantity.toString(),
          component.unit,
          formatCurrency(component.qualityTier.unitCost),
          formatCurrency(component.totalCost)
        ]);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(componentsData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 20 },
      { width: 25 },
      { width: 30 },
      { width: 15 },
      { width: 10 },
      { width: 8 },
      { width: 12 },
      { width: 12 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detailed Components');
  }

  /**
   * Add Assembly Summary sheet
   */
  private static addAssemblySummarySheet(workbook: XLSX.WorkBook, assemblies: AssemblyEstimateItem[]): void {
    const assemblyData = [
      ['Assembly Summary', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Assembly Name', 'Quantity', 'Material Cost', 'Labor Cost', 'Labor Hours', 'Total Cost']
    ];

    assemblies.forEach(assembly => {
      assemblyData.push([
        assembly.assemblyName,
        assembly.quantity.toString(),
        formatCurrency(assembly.totalMaterialCost),
        formatCurrency(assembly.totalLaborCost),
        assembly.totalLaborHours.toString(),
        formatCurrency(assembly.totalMaterialCost + assembly.totalLaborCost)
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(assemblyData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 25 },
      { width: 10 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assembly Summary');
  }

  /**
   * Add Executive Summary sheet for legacy estimates
   */
  private static addLegacyExecutiveSummarySheet(workbook: XLSX.WorkBook, estimate: Estimate): void {
    const summaryData = [
      ['Estimate Summary', ''],
      ['', ''],
      ['Estimate Name', estimate.name],
      ['Created Date', estimate.createdAt.toLocaleDateString()],
      ['Total Cost', formatCurrency(estimate.totalCost)],
      ['Total Components', estimate.items.length.toString()],
      ['Total Labor Hours', estimate.items.reduce((sum, item) => sum + (item.laborHours || 0), 0).toString()]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 20 },
      { width: 15 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Executive Summary');
  }

  /**
   * Add Components List sheet for legacy estimates
   */
  private static addLegacyComponentsSheet(workbook: XLSX.WorkBook, estimate: Estimate): void {
    const componentsData = [
      ['Components List', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['Component', 'Quality', 'Quantity', 'Unit', 'Unit Cost', 'Labor Hours', 'Total Cost']
    ];

    estimate.items.forEach(item => {
      componentsData.push([
        item.componentName,
        item.qualityTier.name,
        item.quantity.toString(),
        item.unit,
        formatCurrency(item.qualityTier.unitCost),
        (item.laborHours || 0).toString(),
        formatCurrency(item.totalCost)
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(componentsData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 25 },
      { width: 15 },
      { width: 10 },
      { width: 8 },
      { width: 12 },
      { width: 12 },
      { width: 12 }
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Components List');
  }

  /**
   * Process assemblies into categories for better organization
   */
  private static processCategories(assemblies: AssemblyEstimateItem[]): CategoryData[] {
    const categoryMap = new Map<string, CategoryData>();

    assemblies.forEach(assembly => {
      const category = this.determineCategoryFromAssembly(assembly);
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          assemblies: [],
          totalCost: 0,
          componentCount: 0,
          laborHours: 0
        });
      }

      const categoryData = categoryMap.get(category)!;
      categoryData.assemblies.push(assembly);
      categoryData.totalCost += assembly.totalMaterialCost + assembly.totalLaborCost;
      categoryData.componentCount += assembly.components.length;
      categoryData.laborHours += assembly.totalLaborHours;
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.totalCost - a.totalCost);
  }

  /**
   * Determine category based on assembly components
   */
  private static determineCategoryFromAssembly(assembly: AssemblyEstimateItem): string {
    const componentNames = assembly.components.map(c => c.componentName.toLowerCase());
    
    if (componentNames.some(name => name.includes('electrical') || name.includes('wire') || name.includes('outlet'))) {
      return 'Electrical';
    }
    if (componentNames.some(name => name.includes('plumbing') || name.includes('pipe') || name.includes('faucet'))) {
      return 'Plumbing';
    }
    if (componentNames.some(name => name.includes('hvac') || name.includes('duct') || name.includes('air'))) {
      return 'HVAC';
    }
    if (componentNames.some(name => name.includes('frame') || name.includes('stud') || name.includes('beam'))) {
      return 'Framing';
    }
    if (componentNames.some(name => name.includes('foundation') || name.includes('concrete') || name.includes('footing'))) {
      return 'Foundation';
    }
    if (componentNames.some(name => name.includes('roof') || name.includes('shingle') || name.includes('gutter'))) {
      return 'Roofing';
    }
    if (componentNames.some(name => name.includes('floor') || name.includes('tile') || name.includes('carpet'))) {
      return 'Flooring';
    }
    if (componentNames.some(name => name.includes('window') || name.includes('door'))) {
      return 'Windows & Doors';
    }
    if (componentNames.some(name => name.includes('drywall') || name.includes('wall'))) {
      return 'Drywall';
    }
    if (componentNames.some(name => name.includes('paint') || name.includes('primer'))) {
      return 'Painting';
    }
    if (componentNames.some(name => name.includes('insulation'))) {
      return 'Insulation';
    }
    if (componentNames.some(name => name.includes('siding') || name.includes('exterior'))) {
      return 'Exterior';
    }
    
    return 'General';
  }
}