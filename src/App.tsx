import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ColumnMapper } from './components/ColumnMapper';
import { parseCSV, processDataWithMapping, exportToCSV } from './utils/csvHelpers';
import { FileData, ProcessedData } from './types';
import { FileDown, Trash2 } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<FileData[]>([]);

  const handleFileSelect = async (file: File) => {
    try {
      const { data, columns } = await parseCSV(file);
      const newFile: FileData = {
        id: crypto.randomUUID(),
        filename: file.name,
        columns,
        mapping: {},
        rawData: data,
      };
      setFiles((prev) => [...prev, newFile]);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  };

  const updateMapping = (id: string, field: keyof FileData['mapping'], value: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? { ...file, mapping: { ...file.mapping, [field]: value } }
          : file
      )
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleExport = () => {
    const processedData: ProcessedData[] = files.flatMap(processDataWithMapping);
    exportToCSV(processedData);
  };

  const isExportDisabled = files.length === 0 || 
    files.some(file => 
      !file.mapping.year || 
      !file.mapping.make || 
      !file.mapping.model || 
      !file.mapping.price
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CSV Column Mapper</h1>
          <p className="text-gray-600 mb-6">
            Upload your CSV files and map the columns to standardize your data format.
          </p>
          <FileUpload onFileSelect={handleFileSelect} />
        </div>

        {files.length > 0 && (
          <div className="space-y-6">
            {files.map((file) => (
              <div key={file.id} className="relative">
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute -right-4 -top-4 p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
                <ColumnMapper
                  fileData={file}
                  onUpdateMapping={updateMapping}
                />
              </div>
            ))}

            <div className="flex justify-end mt-8">
              <button
                onClick={handleExport}
                disabled={isExportDisabled}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium
                  ${
                    isExportDisabled
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                <FileDown className="h-5 w-5" />
                Export Merged Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;