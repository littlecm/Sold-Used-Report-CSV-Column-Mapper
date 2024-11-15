export interface ColumnMapping {
  year: string;
  make: string;
  model: string;
  price: string;
}

export interface ProcessedData {
  year: string;
  make: string;
  model: string;
  price: string;
}

export interface FileData {
  id: string;
  filename: string;
  columns: string[];
  mapping: Partial<ColumnMapping>;
  rawData: any[];
}