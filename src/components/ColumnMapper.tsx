import React from 'react';
import { FileData } from '../types';

interface ColumnMapperProps {
  fileData: FileData;
  onUpdateMapping: (id: string, field: keyof FileData['mapping'], value: string) => void;
}

export function ColumnMapper({ fileData, onUpdateMapping }: ColumnMapperProps) {
  const requiredFields = ['year', 'make', 'model', 'price'] as const;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Map columns for: {fileData.filename}
      </h3>
      <div className="space-y-4">
        {requiredFields.map((field) => (
          <div key={field} className="flex items-center gap-4">
            <label className="w-24 font-medium capitalize">{field}:</label>
            <select
              className="flex-1 border rounded-md p-2"
              value={fileData.mapping[field] || ''}
              onChange={(e) => onUpdateMapping(fileData.id, field, e.target.value)}
            >
              <option value="">Select column</option>
              {fileData.columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}