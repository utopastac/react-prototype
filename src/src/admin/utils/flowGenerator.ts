export interface GeneratedFlow {
  layouts: any[];
  names: string[];
  layoutPositions: Record<string, { row: number; col: number }>;
  gridRows: number;
  gridCols: number;
}