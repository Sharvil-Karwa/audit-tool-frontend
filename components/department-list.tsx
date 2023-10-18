"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { Area, AreaObservations, DepEquipments, Department, Rating, Source } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react"
import { useRouter } from 'next/navigation';

interface DepartmentListProps {
  auditId: string;
  departments: Department[];
  depEquipments: DepEquipments[];
  areas: Area[];
  areaObservations: AreaObservations[];
  ratings: Rating[]; 
  sources: Source[];
}

const DepartmentList: React.FC<DepartmentListProps> = ({ auditId, departments, depEquipments, areas, areaObservations, sources, ratings }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [filteredDepEquipments, setFilteredDepEquipments] = useState<DepEquipments[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<DepEquipments | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [filteredAreaObservations, setFilteredAreaObservations] = useState<AreaObservations[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<AreaObservations | null>(null);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState<string | null>("");

  const router = useRouter();

  const handleDepartmentSelection = (department: Department) => {
    setSelectedDepartment(department);
    const filteredEquipment = depEquipments.filter((equipment) => equipment.departmentId === department.id);
    setFilteredDepEquipments(filteredEquipment);
    setSelectedEquipment(null);
  };

  const handleDepartmentEquipmentSelection = (equipment: DepEquipments) => {
    setSelectedEquipment(equipment);
  };

  const handleAreaSelection = (area: Area) => {
    setSelectedArea(area);
    const filteredAreaObservations = areaObservations.filter((obs) => obs.areaId === area.id);
    setFilteredAreaObservations(filteredAreaObservations);
    setSelectedObservation(null);
  };

  const handleAreaObservationSelection = (equipment: AreaObservations) => {
    setSelectedObservation(equipment);
  };

  const handleRatingSelection = (rating: Rating) => {
    setSelectedRating(rating);
  };

  const handleSourceSelection = (source: Source) => {
    setSelectedSource(source);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };
  const handleSubmission = async () => {
    try {
      const data = {
          "user": "",
          "department": selectedDepartment ? selectedDepartment.name : "",
          "equipment": selectedEquipment ? selectedEquipment.eq_name : "",
          "eq_id": selectedEquipment ? selectedEquipment.eq_id: "",
          "type": selectedEquipment ? selectedEquipment.type: "",
          "location": selectedEquipment ? selectedEquipment.location : "",
          "area": selectedArea ? selectedArea.area : "",
          "observation": selectedObservation ? selectedObservation.obs : "",
          "reference": selectedObservation ? selectedObservation.reference : "",
          "comment": comment ? comment : "",
          "rating": selectedRating ? selectedRating.rating : "",
          "source": selectedSource? selectedSource.source : "",
          "auditId": auditId
      };

      // Make a POST request to your backend API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/record`, data);

      if (response.status === 200) {
        // Redirect to the success page
        router.push('/success');
      } else {
        // Handle errors or show a message to the user
        console.error('Submission failed');
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      <DropdownMenu>
        <div className='text-red-500'>Departments</div>
        <DropdownMenuTrigger className='flex'>
          {selectedDepartment ? selectedDepartment.name : 'Select a department'}
          <ArrowDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select a department</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {departments.map((dep) => (
            <DropdownMenuItem key={dep.id} onClick={() => handleDepartmentSelection(dep)}>
              {dep.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <div className='text-red-500'>Equipments</div>
        <DropdownMenuTrigger className='flex'>
          {selectedEquipment ? selectedEquipment.eq_name : 'Select an equipment'}
          <ArrowDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select an equipment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filteredDepEquipments.map((dep) => (
            <DropdownMenuItem key={dep.id} onClick={() => handleDepartmentEquipmentSelection(dep)}>
              {dep.eq_name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <div className='text-red-500'>Areas</div>
        <DropdownMenuTrigger className='flex'>
          {selectedArea ? selectedArea.area : 'Select an area'}
          <ArrowDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select an area</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {areas.map((dep) => (
            <DropdownMenuItem key={dep.id} onClick={() => handleAreaSelection(dep)}>
              {dep.area}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <div className='text-red-500'>Observations</div>
        <DropdownMenuTrigger className='flex'>
          {selectedObservation ? selectedObservation.obs : 'Select an observation'}
          <ArrowDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select an observation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filteredAreaObservations.map((dep) => (
            <DropdownMenuItem key={dep.id} onClick={() => handleAreaObservationSelection(dep)}>
              {dep.obs}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <div className='text-red-500'>Source</div>
        <DropdownMenuTrigger className='flex'>
          {selectedSource ? selectedSource.source : 'Select a source'}
          <ArrowDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select a source</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sources.map((dep) => (
            <DropdownMenuItem key={dep.id} onClick={() => handleSourceSelection(dep)}>
              {dep.source}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <div className='text-red-500'>Rating</div>
        <DropdownMenuTrigger className='flex'>
          {selectedRating ? selectedRating.rating : 'Select a rating'}
          <ArrowDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select a rating</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ratings.map((dep) => (
            <DropdownMenuItem key={dep.id} onClick={() => handleRatingSelection(dep)}>
              {dep.rating}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="text"
        placeholder="Enter your comment"
        onChange={handleCommentChange}
      />
      <button onClick={handleSubmission}>Submit</button>
    </div>
  );
};

export default DepartmentList;
