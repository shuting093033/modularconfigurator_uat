export interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  qualityTiers: QualityTier[];
}

export interface QualityTier {
  id: string;
  name: string;
  unitCost: number;
  description: string;
}

export interface EstimateItem {
  id: string;
  componentId: string;
  componentName: string;
  qualityTier: QualityTier;
  quantity: number;
  unit: string;
  totalCost: number;
  laborHours?: number;
}

export interface AssemblyEstimateItem {
  id: string;
  estimateId: string;
  assemblyId: string;
  assemblyName: string;
  quantity: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalLaborHours: number;
  components: EstimateItem[];
}

export interface HierarchicalEstimate {
  id: string;
  name: string;
  assemblies: AssemblyEstimateItem[];
  totalCost: number;
  totalLaborHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Estimate {
  id: string;
  name: string;
  items: EstimateItem[];
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ComponentCategory = 
  | 'Foundation'
  | 'Framing'
  | 'Roofing'
  | 'Electrical'
  | 'Plumbing'
  | 'HVAC'
  | 'Flooring'
  | 'Windows & Doors'
  | 'Insulation'
  | 'Drywall'
  | 'Painting'
  | 'Exterior';