"use client"

import * as XLSX from "xlsx";
import React, { useState } from 'react';
import axios from 'axios';
import { Area, AreaObservations, Equipment, Department, Rating, Source } from "@/types";
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

import { Check, ChevronsUpDown, PlusCircle, Briefcase} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DepartmentListProps {
  auditId: string;
  departments: Department[];
  areas: Area[];
  areaObservations: AreaObservations[];
  ratings: Rating[];
  sources: Source[];
  equipments: Equipment[];
}

interface SubmissionData {
  user: string;
  department: string;
  equipment: string;
  eq_id: string;
  type: string;
  location: string;
  area: string;
  observation: string;
  reference: string;
  comment: string;
  rating: string;
  source: string;
  auditId: string
}

const DepartmentList: React.FC<DepartmentListProps> = ({ auditId, departments, equipments, areas, areaObservations, sources, ratings }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [filteredAreaObservations, setFilteredAreaObservations] = useState<AreaObservations[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<AreaObservations | null>(null);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState<string | null>("");

  const router = useRouter();

  const handleDepartmentSelection = (department: Department) => {
    setSelectedDepartment(department);
    const filteredEquipments = equipments.filter((equipment) => equipment.depId === department.id);
    setFilteredEquipments(filteredEquipments);
    setSelectedEquipment(null);
  };

  const handleDepartmentEquipmentSelection = (equipment: Equipment) => {
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
  
  const generateExcelFile = (data: SubmissionData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["department", "equipment", "eq_id", "type", "location", "area", "observation", "reference", "comment", "rating", "source", "audit id"],
      [data.department, data.equipment, data.eq_id, data.type, data.location, data.area, data.observation, data.reference, data.comment, data.rating, data.source, auditId],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };


  const handleSubmission = async () => {

    const data = {
      "user": "",
      "department": selectedDepartment ? selectedDepartment.name : "",
      "equipment": selectedEquipment ? selectedEquipment.name : "",
      "eq_id": selectedEquipment ? selectedEquipment.id: "",
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

    try {
      // Submit the form data
      if(selectedDepartment &&
        selectedEquipment &&
        selectedArea &&
        selectedObservation &&
        selectedSource &&
        selectedRating ){
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/cord`, data);
      
          if (response.status === 200) {
            router.push('/success');
          } else {
            // Generate the Excel file with the data
            generateExcelFile({
              user: data.user,
              department: data.department,
              equipment: data.equipment,
              eq_id: data.eq_id,
              type: data.type,
              location: data.location,
              area: data.area,
              observation: data.observation,
              reference: data.reference,
              comment: data.comment,
              rating: data.rating,
              source: data.source,
              auditId: auditId
            });
            toast.error("Submission Error");
          }
        }
        else{
          toast.error("Fill all the dropdown fields")
        }
    } catch (error) {
      generateExcelFile({
        user: data.user,
        department: data.department,
        equipment: data.equipment,
        eq_id: data.eq_id,
        type: data.type,
        location: data.location,
        area: data.area,
        observation: data.observation,
        reference: data.reference,
        comment: data.comment,
        rating: data.rating,
        source: data.source,
        auditId: auditId
      });
      toast.error("Submission Error")
      console.error('Error:', error);
    }
  };

  const [openDep, setOpenDep] = React.useState(false)
  const [openEqui, setOpenEqui] = React.useState(false)
  const [openArea, setOpenArea] = React.useState(false)
  const [openObs, setOpenObs] = React.useState(false)
  const [openSrc, setOpenSrc] = React.useState(false)
  const [openRat, setOpenRat] = React.useState(false)


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="font-bold mb-1">Departments</div>
          <Popover open={openDep} onOpenChange={setOpenDep}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openDep}
          aria-label="Select a department"
          className={cn("w-[200px] justify-between")}
        >
          
          { selectedDepartment ? selectedDepartment.name : 'Select a Department'  }
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search department..." />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup heading="Departments">
              {departments.map((dep) => (
                <CommandItem
                  key={dep.id}
                  onSelect={() => handleDepartmentSelection(dep)}
                  className="text-sm"
                >
                  
                  {dep.name}
                  
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
        </div>

        <div className="md:mb-1 sm:mb-0"></div>

        <div>
          <div className="font-bold mb-1">Equipments</div>
          <Popover open={openEqui} onOpenChange={setOpenEqui}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openEqui}
          aria-label="Select an equipment"
          className={cn("w-[200px] justify-between")}
        >
          
          { selectedEquipment ? selectedEquipment.name : 'Select an equipment'  }
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search equipment..." />
            <CommandEmpty>No equipment found.</CommandEmpty>
            <CommandGroup heading="Equipments">
              {filteredEquipments.map((dep) => (
                <CommandItem
                  key={dep.id}
                  onSelect={() => handleDepartmentEquipmentSelection(dep)}
                  className="text-sm"
                >
                  
                  {dep.name} <span className="font-bold ml-3"> {dep.id} </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
        </div>

        <div>
          <div className="font-bold mb-1">Equipment ID</div>

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openEqui}
          aria-label="Select an equipment"
          className={cn("w-[200px] justify-between")}
        >
          { selectedEquipment ? selectedEquipment.id : <span className="text-red-500">
            Select an equipment first
          </span>  }
        </Button>
      </PopoverTrigger>
    </Popover>
        </div>

        <div>
          <div className="font-bold mb-1">Equipment Type</div>
          <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openEqui}
          aria-label="Select an equipment"
          className={cn("w-[200px] justify-between")}
        >
          { selectedEquipment ? selectedEquipment.type : <span className="text-red-500">
            Select an equipment first
          </span>  }
        </Button>
      </PopoverTrigger>
    </Popover>
    
        </div>

        <div>
          <div className="font-bold mb-1">Equipment Location</div>
          <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openEqui}
          aria-label="Select an equipment"
          className={cn("w-[200px] justify-between")}
        >
          { selectedEquipment ? selectedEquipment.location : <span className="text-red-500">
            Select an equipment first
          </span>  }
        </Button>
      </PopoverTrigger>
    </Popover>
        </div>

        <div>
          <div className="font-bold mb-1">Areas</div>
          <Popover open={openArea} onOpenChange={setOpenArea}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openArea}
          aria-label="Select an area"
          className={cn("w-[200px] justify-between")}
        >
          
          { selectedArea ? selectedArea.area : 'Select an area'  }
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search area..." />
            <CommandEmpty>No area found.</CommandEmpty>
            <CommandGroup heading="Areas">
              {areas.map((dep) => (
                <CommandItem
                  key={dep.id}
                  onSelect={() => handleAreaSelection(dep)}
                  className="text-sm"
                >
                  
                  {dep.area} 
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
        </div>

        <div>
  <div className="font-bold mb-1">Observations</div>
  <Popover open={openObs} onOpenChange={setOpenObs}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openArea}
          aria-label="Select an observation"
          className={cn("w-[200px] justify-between")}
        >
          
          { selectedObservation ? <div className=" truncate max-w-100px">{selectedObservation.obs}</div> : 'Select an observation'  }
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search observation..." />
            <CommandEmpty>No observation found.</CommandEmpty>
            <CommandGroup heading="Observation">
              {filteredAreaObservations.map((dep) => (
                <CommandItem
                  key={dep.id}
                  onSelect={() => handleAreaObservationSelection(dep)}
                  className="text-sm"
                >
                  
                  {dep.obs} 
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
</div>


        <div>
          <div className="font-bold mb-1">Reference</div>
          <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openEqui}
          aria-label="Select an observation"
          className={cn("w-[200px] justify-between")}
        >
          { selectedObservation ? selectedObservation.reference : <span className="text-red-500">
            Select an observation first
          </span>  }
        </Button>
      </PopoverTrigger>
    </Popover>
        </div>

        <div>
          <div className="font-bold mb-1 col-span-2">Observation Source</div>
          <Popover open={openSrc} onOpenChange={setOpenSrc}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openEqui}
          aria-label="Select a source"
          className={cn("w-[200px] justify-between")}
        >
          
          { selectedSource ? selectedSource.source : 'Select a source'  }
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search observation..." />
            <CommandEmpty>No observation found.</CommandEmpty>
            <CommandGroup heading="Observation Source">
              {sources.map((dep) => (
                <CommandItem
                  key={dep.id}
                  onSelect={() => handleSourceSelection(dep)}
                  className="text-sm"
                >
                  {dep.source}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
        </div>

        <div className="md:mb-1 sm:mb-0"></div>


        <div>
          <div className="font-bold mb-1">Rating</div>
          <Popover open={openRat} onOpenChange={setOpenRat}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={openEqui}
          aria-label="Select a rating"
          className={cn("w-[200px] justify-between")}
        >
          
          { selectedRating ? selectedRating.rating : 'Select a rating'  }
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search rating..." />
            <CommandEmpty>No rating found.</CommandEmpty>
            <CommandGroup heading="Ratings">
              {ratings.map((dep) => (
                <CommandItem
                  key={dep.id}
                  onSelect={() => handleRatingSelection(dep)}
                  className="text-sm"
                >
                  {dep.rating}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
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
