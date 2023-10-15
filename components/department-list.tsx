"use client"

import React, { useState } from 'react';
import { Area, AreaObservations, DepEquipments, Department } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react"


interface DepartmentListProps {
  auditId: string;
  departments: Department[];
  depEquipments: DepEquipments[];
  areas: Area[];
  areaObservations: AreaObservations[];
}

const DepartmentList: React.FC<DepartmentListProps> = ({ auditId, departments, depEquipments, areas, areaObservations}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [filteredDepEquipments, setFilteredDepEquipments] = useState<DepEquipments[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<DepEquipments | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [filteredAreaObservations, setFilteredAreaObservations] = useState<AreaObservations[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<AreaObservations | null>(null);

  const handleDepartmentSelection = (department: Department) => {
    setSelectedDepartment(department);
    const filteredEquipment = depEquipments.filter((equipment) => equipment.departmentId === department.id);
    setFilteredDepEquipments(filteredEquipment);
    setSelectedEquipment(null); 

    console.log(areaObservations)
  };
  const handleDepartmentEquipmentSelection = (equipment: DepEquipments) => {
    setSelectedEquipment(equipment);
  };
  const handleAreaSelection = (area: Area) => {
    setSelectedArea(area); 
    const filteredAreaObservations = areaObservations.filter((obs)=>obs.areaId==area.id)
    console.log(filteredAreaObservations)
    setFilteredAreaObservations(filteredAreaObservations);
    setSelectedObservation(null);
  }; 
  const handleAreaObservationSelection = (equipment: AreaObservations) => {
    setSelectedObservation(equipment);
  };

  const handleSubmission = () => {
    // Log the chosen values from the dropdowns
    console.log("Selected Department: ", selectedDepartment);
    console.log("Selected Equipment: ", selectedEquipment);
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
      <button onClick={handleSubmission}>Submit</button>
    </div>
  );
};

export default DepartmentList;
