/* eslint-disable react/no-unescaped-entities */

"use client"

import React, { useState } from 'react';
import Container from "@/components/ui/container";
import { useDropzone, FileRejection } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { MoveLeft, MoveLeftIcon, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios,{AxiosError} from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';

interface ExcelRecord {
  user: string;
  department: string;
  equipment: string;
  eq_id: string;
  type: string;
  location: string;
  area: string;
  observation: string;
  reference: string;
  source: string;
  comment: string;
  rating: string;
  audit_id: string;
  audit_name: string;
  new_area: Boolean;
  new_obs: Boolean;
  new_src: Boolean;
  refCountry: string;
}

const Excel = ({ params }: { params: { email: string } }) => {    

  const encodedEmail = params.email;
  const decodedEmail = encodedEmail.replace('%40', '@');


  const [excelData, setExcelData] = useState<ExcelRecord[]>([]);
  const onDrop = (acceptedFiles: File[], _fileRejections: FileRejection[]) => {
    const promises = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const excelContent = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as unknown[];
            resolve(excelContent);
          } else {
            reject(new Error("File data is undefined or empty."));
          }
        };
        reader.onerror = (e) => {
          reject(new Error("An error occurred while reading the file."));
        };
        reader.readAsArrayBuffer(file);
      });
    });
    Promise.all(promises)
  .then((results) => {
    const combinedData = results.flat() as ExcelRecord[];
    setExcelData(combinedData);
    console.log(combinedData);
  })
  .catch((error) => {
    console.error("Error reading the Excel file:", error);
  });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, 
  });

  const router = useRouter()
  const handleExcelSubmit = async () => {


    try {
      for (const record of excelData) {
        const data = {
          user: decodedEmail,
          department: record.department ? record.department : "-",
          equipment: record.equipment ? record.equipment : "-",
          eq_id: record.eq_id ? record.eq_id : "-",
          type: record.type ? record.type : "-",
          location: record.location ? record.location : "-",
          area: record.area ? record.area : "-",
          observation: record.observation ? record.observation : "-",
          reference: record.reference ? record.reference : "-",
          source: record.source ? record.source : "-",
          comment: record.comment ? record.comment : "-",
          rating: record.rating ? record.rating : "-",
          auditId: record.audit_id,
          auditName: record.audit_name,
          refCountry : record.refCountry ? record.refCountry : "-"
        };

  
        // Make a POST request to your API endpoint with the data for each record
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/${record.audit_id}/record`,
          data
        );

        if(record.new_area===true){
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${record.audit_id}/areas`, {area : record.area, observations: []}) 
        }

        if(record.new_obs===true){
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${record.audit_id}/observations`, {
            observation: record.observation,
            reference: record.reference
          }) 
        }

        if(record.new_src===true){
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${record.audit_id}/sources`, {
            source: record.source
          }) 
        }
      }
  
      toast.success("Submitted records successfully")
      router.push(`/${excelData[0].audit_id}`);
    } catch (error) {
     

      console.error("An error occurred:", error);

      if (typeof error === 'object' && error !== null) {
        const axiosError = error as AxiosError; // Assuming AxiosError is the expected type
        console.error("Error code:", axiosError.code);
        console.error("Request configuration:", axiosError.config);
        console.error("Response data:", axiosError.response?.data);
        console.error("HTTP status code:", axiosError.response?.status);
        console.error("HTTP status text:", axiosError.response?.statusText);
      }

      router.push(`/${excelData[0].audit_id}`);

      
    }
  };
  
  let isFormatValid = true; // Flag to track if the format is valid
const expectedHeaders = [
  'department', 'equipment', 'eq_id', 'type', 'location', 'area', 'observation',
  'reference', 'refCountry', 'comment', 'source', 'rating', 'new_area', 'new_obs',
  'new_src', 'audit_name', 'audit_id'
];

// Check if the uploaded Excel data matches the expected format
if (excelData.length > 0) {
  const dataHeaders = Object.keys(excelData[0]);
  isFormatValid = expectedHeaders.every(header => dataHeaders.includes(header));
}

  

  return (
    
    <Container>
       <Button className='mr-2' onClick={()=>{router.push('/')}}><MoveLeft className='mr-2'/> Back</Button>

<div
  {...getRootProps()}
  className="border-2 border-dashed border-gray-400 rounded p-4 text-gray-600 text-center cursor-pointer mt-2"
>
  <input {...getInputProps()} />
  {isDragActive ? (
    <p>Drop Excel files here...</p>
  ) : (
    <p>Drag 'n' drop Excel files here, or click to select them</p>
  )}
</div>
     {
      isFormatValid ? (
     <div>
  

{excelData.length > 0 && (
<div className="mt-4">
<div className='flex justify-between'>
<h2 className="text-xl font-bold mb-2">Combined Excel File Contents:</h2> 
<Button className='mb-2' onClick={handleExcelSubmit}>Submit</Button>
</div>
<div className="overflow-x-auto">
<table className="table-auto w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-200">
      <th className="px-4 py-2">Department</th>
      <th className="px-4 py-2">Equipment</th>
      <th className="px-4 py-2">Eq ID</th>
      <th className="px-4 py-2">Type</th>
      <th className="px-4 py-2">Location</th>
      <th className="px-4 py-2">Area</th>
      <th className="px-4 py-2">Observation</th>
      <th className="px-4 py-2">Reference</th>
      <th className="px-4 py-2">Country</th>
      <th className="px-4 py-2">Comment</th>
      <th className="px-4 py-2">Source</th>
      <th className="px-4 py-2">Rating</th>
      <th className="px-4 py-2">Audit Name</th>
      <th className="px-4 py-2">Audit ID</th>
    </tr>
  </thead>
  <tbody>
    {excelData.map((record, index) => (
      <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
        <td className="border px-4 py-2">{record.department}</td>
        <td className="border px-4 py-2">{record.equipment}</td>
        <td className="border px-4 py-2">{record.eq_id}</td>
        <td className="border px-4 py-2">{record.type}</td>
        <td className="border px-4 py-2">{record.location}</td>
        <td className="border px-4 py-2">{record.area}</td>
        <td className="border px-4 py-2 truncate">{record.observation}</td>
        <td className="border px-4 py-2">{record.reference}</td>
        <td className="border px-4 py-2">{record.refCountry}</td>
        <td className="border px-4 py-2">{record.comment}</td>
        <td className="border px-4 py-2">{record.source}</td>
        <td className="border px-4 py-2">{record.rating}</td>
        <td className="border px-4 py-2">{record.audit_name}</td>
        <td className="border px-4 py-2">{record.audit_id}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>
</div>
)}
     </div>
      ): (
        <div className="mt-4 text-red-600">
        <p>The uploaded Excel file does not match the expected format.</p>
        <p>Please make sure the file contains the required columns:</p>
        <ul className="list-disc list-inside">
          {expectedHeaders.map((header, index) => (
            <li key={index}>{header}</li>
          ))}
        </ul>
      </div>
      )
     }

    </Container>
  );
};

export default Excel;