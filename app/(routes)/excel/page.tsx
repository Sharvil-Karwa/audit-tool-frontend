"use client"

import React, { useState } from 'react';
import Container from "@/components/ui/container";
import { useDropzone, FileRejection } from 'react-dropzone';
import * as XLSX from 'xlsx';

const Excel = () => {
  const [excelData, setExcelData] = useState<unknown[]>([]);

  const onDrop = (acceptedFiles: File[], _fileRejections: FileRejection[]) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const excelContent = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as unknown[];
        setExcelData(excelContent);
        console.log(excelContent);
      } else {
        console.error("File data is undefined or empty.");
      }
    };

    reader.onerror = (e) => {
      console.error("An error occurred while reading the file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Container>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 rounded p-4 text-gray-600 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Excel file here...</p>
        ) : (
          <p>Drag 'n' drop an Excel file here, or click to select one</p>
        )}
      </div>
      {excelData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Excel File Contents:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(excelData, null, 2)}
          </pre>
        </div>
      )}
    </Container>
  );
};

export default Excel;
