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
  country: string;
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
          refCountry : record.country ? record.country : "-"
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
  
        if (response.status === 200) {
          toast.success(`Record(s) for audit ${data.auditName} submitted successfully.`);
        }
      }
  
      router.push('/success');
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

      router.push('/success');

      
    }
  };
  
  

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
      {excelData.length > 0 && (
        <div className="mt-4">
          <div className='flex justify-between'>
          <h2 className="text-xl font-bold mb-2">Combined Excel File Contents:</h2> 
          <Button className='mb-2' onClick={handleExcelSubmit}>Submit</Button>
          </div>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(excelData, null, 2)}
          </pre>
        </div>
      )}
    </Container>
  );
};

export default Excel;