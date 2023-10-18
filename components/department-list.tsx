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
import { ChevronDown } from "lucide-react"
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Separator } from '@radix-ui/react-dropdown-menu';

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
      // Submit the form data
      if(selectedDepartment &&
        selectedEquipment &&
        selectedArea &&
        selectedObservation &&
        selectedSource &&
        selectedRating ){
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
      
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/record`, data);
      
          if (response.status === 200) {
            router.push('/success');
          } else {
            toast.error("Submission Error")
          }
        }
        else{
          toast.error("Fill all the fields")
        }
    } catch (error) {
      toast.error("Submission Error")
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="font-bold mb-2">Departments</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedDepartment ? selectedDepartment.name : 'Select a department'}
              <ChevronDown />
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
        </div>

        <div className="md:mb-2 sm:mb-0"></div>

        <div>
          <div className="font-bold mb-2">Equipments</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedEquipment ? selectedEquipment.eq_name: 'Select an equipment'}
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select an equipment</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filteredDepEquipments.map((dep) => (
                <DropdownMenuItem key={dep.id} onClick={() => handleDepartmentEquipmentSelection(dep)}>
                  {dep.eq_name} <span className='font-bold mx-1'>{dep.eq_id}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <div className="font-bold mb-2">Equipment ID</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedEquipment ? selectedEquipment.eq_id : '(Select an equipment first)'}
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>

        <div>
          <div className="font-bold mb-2">Equipment Type</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedEquipment ? selectedEquipment.type : '(Select an equipment first)'}
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>

        <div>
          <div className="font-bold mb-2">Equipment Location</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedEquipment ? selectedEquipment.location : '(Select an equipment first)'}
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>

        <div>
          <div className="font-bold mb-2">Areas</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedArea ? selectedArea.area : 'Select an area'}
              <ChevronDown />
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
        </div>

        <div>
          <div className="font-bold mb-2">Observations</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedObservation ? selectedObservation.obs : 'Select an observation'}
              <ChevronDown />
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
        </div>

        <div>
          <div className="font-bold mb-2">Reference</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedObservation ? selectedObservation.reference : '(Select an observation first)'}
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>

        <div>
          <div className="font-bold mb-2">Observation Source</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedSource ? selectedSource.source : 'Select a source'}
              <ChevronDown />
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
        </div>

        <div className="md:mb-2 sm:mb-0"></div>


        <div>
          <div className="font-bold mb-2">Rating</div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex">
              {selectedRating ? selectedRating.rating : 'Select a rating'}
              <ChevronDown />
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
        </div>
      </div>

      <div className="md:col-span-2 flex justify-between"> {/* Align the comment box to the right */}
        <input
          type="text"
          placeholder="Enter your comment"
          onChange={handleCommentChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 mt-4"
        />
      </div>

      <button
          onClick={handleSubmission}
          className="w-1/4 md:w-auto bg-gray-800 text-white p-2 rounded mt-4 hover:bg-black focus:outline-none"
        >
          Submit
        </button>
    </div>
  );
};

export default DepartmentList;
