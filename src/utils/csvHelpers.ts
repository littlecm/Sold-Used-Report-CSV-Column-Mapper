import Papa from 'papaparse';
import { FileData, ProcessedData } from '../types';

export const parseCSV = (file: File): Promise<{ data: any[]; columns: string[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const columns = Object.keys(results.data[0] || {});
        resolve({ data: results.data, columns });
      },
      error: (error) => reject(error),
    });
  });
};

export const processDataWithMapping = (fileData: FileData): ProcessedData[] => {
  return fileData.rawData
    .filter((row) => {
      return Object.values(row).some((value) => value !== '');
    })
    .map((row) => ({
      year: row[fileData.mapping.year || ''] || '',
      make: row[fileData.mapping.make || ''] || '',
      model: row[fileData.mapping.model || ''] || '',
      price: row[fileData.mapping.price || ''] || '',
    }));
};

export const exportToCSV = (data: ProcessedData[]) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'processed_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};