"use client"

import * as XLSX from "xlsx";


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Area, AreaObservations, Equipment, Department, Rating, Source, Reference, Observation, RefObs } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, Table } from "lucide-react"
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
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import Excel from "@/app/(routes)/excel/[email]/page";


interface DepartmentListProps {
  auditId: string;
  departments: Department[];
  areas: Area[];
  areaObservations: AreaObservations[];
  ratings: Rating[];
  sources: Source[];
  equipments: Equipment[];
  auditName: String;
  references: Reference[]
  observations: Observation[];
  refObs: RefObs[];
  email: string;
  access: Boolean;
}

interface SubmissionData {
  user: string;
  department: string;
  equipment: string;
  eq_id: string;
  type: string;
  location: string;
  area: string | null;
  observation: string | null;
  reference: string | null;
  comment: string;
  rating: string;
  source: string | null;
  auditName: String | null;
  auditId: string;
  new_src: Boolean;
  new_obs: Boolean;
  new_area: Boolean;
}

const DepartmentList: React.FC<DepartmentListProps> = ({email, auditId, departments, equipments, areas, areaObservations, sources, ratings, auditName, references, observations, refObs, access }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [filteredAreaObservations, setFilteredAreaObservations] = useState<AreaObservations[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<AreaObservations | null>(null);
  const [selectedObservation2, setSelectedObservation2] = useState<Observation | null>(null);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [filteredRefObs, setFilteredRefObs] = useState<RefObs[]>([]);
  const [reference, setReference] = useState<string | null>(null);
  const [refCountry, setRefCountry] = useState<string | null>(null);
  const [comment, setComment] = useState<string | null>("");
  const [newArea, setNewArea] = useState<string | null>("");
  const [newObs, setNewObs] = useState<string | null>("");
  const [newRef, setNewRef] = useState<string | null>("");
  const [newSrc, setNewSrc] = useState<string | null>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
    setnewarea(false)
  };

  const handleAreaObservationSelection = (equipment: AreaObservations) => {
    setSelectedObservation(equipment);
    const filteredRefOb:RefObs[] = [];
    for(const refob of refObs){
      if(refob.obsId==equipment.observationId){
        filteredRefOb.push(refob)
      }
    }
    setFilteredRefObs(filteredRefOb);
    setSelectedObservation2(null);
    setnewobs(false)
  };

  const handleNewAreaObservationSelection = (equipment: Observation) => {
    setSelectedObservation2(equipment);
    const filteredRefOb:RefObs[] = [];
    for(const refob of refObs){
      if(refob.obsId==equipment.id){
        filteredRefOb.push(refob)
      }
    }
    setFilteredRefObs(filteredRefOb);
    setSelectedObservation(null);
    setnewobs(false)
  };

  const handleRatingSelection = (rating: Rating) => {
    setSelectedRating(rating);
  };

  const handleSourceSelection = (source: Source) => {
    setSelectedSource(source);
    setnewsrc(false)
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };
  
  const generateExcelFile = (data: SubmissionData) => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["user","department", "equipment", "eq_id", "type", "location", "area", "observation", "reference", "comment", "rating", "source", "audit_name", "audit_id", "new_area", "new_obs",  "new_src"],
      [data.user, data.department, data.equipment, data.eq_id, data.type, data.location, data.area, data.observation, data.reference, data.comment, data.rating, data.source, auditName ,auditId, data.new_area, data.new_obs,  data.new_src],
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${data.auditName}_data.xlsx`);
  };

 

  
        const downloadAuditData = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}`);
            const jsonData = response.data;
        
            // Convert JSON to a pretty formatted string with 2-space indentation
            const prettyJson = JSON.stringify(jsonData, null, 2);
        
            const blob = new Blob([prettyJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
        
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        
            toast.success('Downloaded data');
          } catch (error) {
            toast.error('Error occurred');
            console.log(error);
          }
        };

  const handleSubmission = async () => {    
    const data = {
      "user": email,
      "department": selectedDepartment ? selectedDepartment.name : "",
      "equipment": selectedEquipment ? selectedEquipment.name : "",
      "eq_id": selectedEquipment ? selectedEquipment.id: "",
      "type": selectedEquipment ? selectedEquipment.type: "",
      "location": selectedEquipment ? selectedEquipment.location : "",
      "area": newarea ? newArea : (selectedArea ? selectedArea.area : ""),
      "observation": newobs ? newObs : (selectedObservation ? selectedObservation.obs : (selectedObservation2 ? selectedObservation2.observation : "")),
      "reference": newobs ? newRef : reference ? reference : "",
      "source": newsrc ? newSrc : (selectedSource ? selectedSource.source : ""),
      "comment": comment ? comment : "",
      "rating": selectedRating ? selectedRating.rating : "",
      "auditId": auditId,
      "auditName": auditName,
      "new_area": newarea,
      "new_obs": newobs,
      "new_src": newsrc,
      "refCountry" : refCountry ? refCountry : ""
    };


    if(!data.reference){
      data.reference = ""
    }

    try {

      setLoading(true);

      if(newarea && !comment){
        toast.error("Please fill additional observation details as you have added a new area");
        return;
      } 

      if(newobs && !comment){
        toast.error("Please fill additional observation details as you have added a new observation");
        return;
      }  

      if(newobs && !newRef){
        toast.error("Enter observation reference");
        return;
      }

      if(newSrc && !comment){
        toast.error("Please fill additional observation details as you have added a new observation source");
        return;
      } 
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/record`, data);

          // adding area, source and observation to database

          let newareaid = null
          let newobsid = null

          if(newarea){
            const resp_area = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/areas`, {area : newArea, observations: []}) 
            newareaid = resp_area.data.id
          } 

          if(newobs){
            const resp_obs = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/observations`, {
              observation: newObs,
              reference: newRef
            }) 
            newobsid = resp_obs.data.id
          }  

          console.log(newareaid)

          if(newareaid && newarea){
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/areas/${newareaid}`, {
              area: newArea,
              observations: [
                {
                  "id": newobsid ? newobsid : (selectedObservation ? selectedObservation.id : selectedObservation2 ? selectedObservation2.id : ""),
                  "observation" : data.observation,
                  "reference" : data.reference
                }
              ]
            })
          }

          if(newsrc){
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/sources`, {
              source: newSrc
            }) 
          }

      
          if (response.status === 200) {
              toast.success("Submission successful");
              if(newarea || newobs || newsrc){
                window.location.reload();
              }
              else{
                setSelectedDepartment(null);
              setFilteredEquipments([]);
              setSelectedEquipment(null);
              setSelectedArea(null);
              setFilteredAreaObservations([]);
              setSelectedObservation(null);
              setSelectedObservation2(null);
              setSelectedSource(null);
              setSelectedRating(null);
              setFilteredRefObs([]);
              setReference(null);
              setRefCountry(null);
              setComment("");
              setNewArea("");
              setNewObs("");
              setNewRef("");
              setNewSrc("");
              }
          } else {
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
              auditId: auditId,
              auditName: auditName,
              new_area: data.new_area,
              new_obs: data.new_obs,
              new_src: data.new_src
            });
            toast.error("Submission Error");
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
        auditId: auditId,
        auditName: auditName,
        new_area: data.new_area,
              new_obs: data.new_obs,
              new_src: data.new_src
      });
      toast.error("Submission error")
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const [openDep, setOpenDep] = React.useState(false)
  const [openEqui, setOpenEqui] = React.useState(false)
  const [openArea, setOpenArea] = React.useState(false)
  const [openObs, setOpenObs] = React.useState(false)
  const [openSrc, setOpenSrc] = React.useState(false)
  const [openRat, setOpenRat] = React.useState(false)
  const [openRef, setOpenRef] = React.useState(false)
  const[openAreaBox, setOpenAreaBox] = useState(false)
  const [newarea, setnewarea] = useState(false)
  const[openObsBox, setOpenObsBox] = useState(false)
  const [newobs, setnewobs] = useState(false)
  const [openSrcBox, setOpenSrcBox] = useState(false)
  const [newsrc, setnewsrc] = useState(false)

  return (
    <div className="container mx-auto md:p-8 max-w-4xl">

    <div className="mt-4 mx-4 text-2xl font-bold flex flex-row justify-between items-center">
      <div>{auditName}</div>
      {
        access && <div className="flex items-center">
        <Button onClick={downloadAuditData}>
          Download Audit Data <Download className="ml-4" />
        </Button>
        <Link href={`/excel/${email}`} className="ml-4">
          <Button><Table className="mr-2"/> Upload Excel</Button>
        </Link>
      </div>
      }
    </div>

      <div className="flex flex-col mx-auto items-left"> 
        <div className="grid md:grid-cols-3 sm:grid-cols-1 mb-4">
          <div className="m-4">
          <div className="font-bold mb-1 ">Departments</div>
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
                
                { selectedDepartment ? <span className="truncate max-w-100">{selectedDepartment.name}</span> : 'Select a Department'  }
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
        <div className="m-4">
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
                
                { selectedEquipment ?<span className="truncate max-w-100">{selectedEquipment.name}</span> : 'Select an equipment'  }
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
        <div className="m-4">
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
        <div className="m-4">
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

        <div className="m-4">
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
        </div>
      </div>
      <div className="mx-4 flex flex-row items-end">
        <div className="mr-6">
          <div>
            <div className="font-bold">Areas</div>
            <Popover open={openArea} onOpenChange={setOpenArea}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={openArea}
                  aria-label="Select an area"
                  className={cn("w-[200px] h-[40px] justify-between")}
                >
                  {newarea && newArea}
                  {!newarea && (selectedArea ? selectedArea.area : 'Select an area')}
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
        </div>
        <div className="flex flex-col">
          {openAreaBox && <div>
            <div className="font-bold">Enter new area</div>
          <div className="flex items-center"> 
            <input
              type="text"
              placeholder="Enter new area"
              ref={inputRef}
              className="mr-2 p-2 border border-gray-300 rounded h-[40px] w-[200px]"
            />
            <button className="p-2 bg-black text-white rounded " onClick={()=>{
              setNewArea(inputRef.current?.value || '');
              setnewarea(true);
              setFilteredAreaObservations(areaObservations);
              setOpenAreaBox(false)
            }}>
              <PlusCircle className=""/>
            </button>
          </div></div>} 
          {!openAreaBox && <Button className="" onClick={()=>{setOpenAreaBox(true)}}><PlusCircle className="mr-3"/> Add</Button>}
        </div>
      </div>
      <div className="m-4 flex-col">
          <div className="mr-6">
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
                      className={cn("w-[700px] h-[100px] ")}
                    >
                      
                      {newobs && newObs}
                      {!newobs && (selectedObservation ? selectedObservation.obs : (selectedObservation2 ? selectedObservation2.observation : "select an observation"))}
                      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[700px] p-0">
                    <Command>
                      <CommandList>
                        <CommandInput placeholder="Search observation..." />
                        <CommandEmpty>No observation found.</CommandEmpty>
                        <CommandGroup heading="Observation">
                          {!newarea && filteredAreaObservations.map((dep) => (
                            <CommandItem
                              key={dep.id}
                              onSelect={() => handleAreaObservationSelection(dep)}
                              className="text-sm"
                            >
                              
                              {dep.obs} 
                            </CommandItem>
                          ))}
                          {newarea && observations.map((dep) => (
                            <CommandItem
                              key={dep.id}
                              onSelect={() => handleNewAreaObservationSelection(dep)}
                              className="text-sm"
                            >
                              
                              {dep.observation} 
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
          <div className="flex flex-col">
          {openObsBox && <div>
            <div className="font-bold">Enter new observation</div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter new observation"
              ref={inputRef2}
              className="mr-2 p-2 border border-gray-300 rounded h-[100px] w-[700px]"
            />
            <button className="p-2 bg-black text-white rounded " onClick={()=>{
              setNewObs(inputRef2.current?.value || '');
              setnewobs(true);
              setOpenObsBox(false)
            }}>
              <PlusCircle className=""/>
            </button>
          </div></div>} 
          {!openObsBox && <Button className="mt-3 w-[100px]" onClick={()=>{setOpenObsBox(true)}}><PlusCircle className="mr-3"/> Add</Button>}
        </div>
      </div>
        <div className="flex items-center m-4 space-x-12">
        <div>
          <div className="font-bold mb-1">Reference</div>
          {!newobs && <div>
            <Popover open={openRef} onOpenChange={setOpenRef}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={openEqui}
                  aria-label="Select a source"
                  className={cn("w-[200px] justify-between")}
                >
                  {reference ? reference : "Select a reference"}
                  <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandInput placeholder="Search reference..." />
                    <CommandEmpty>No reference found.</CommandEmpty>
                    <CommandGroup heading="Reference Source">
                      {filteredRefObs.map((dep) => (
                        <CommandItem
                          key={dep.id}
                          onSelect={() => {setReference(dep.reference);
                          setRefCountry(dep.country)}}
                          className="text-sm"
                        >
                          {dep.reference}  <span className="font-bold mx-2">{dep.country}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <CommandSeparator />
                </Command>
              </PopoverContent>
            </Popover></div>}
          {newobs && <div className="flex">
            <input
              type="text"
              placeholder="Enter observation reference"
              ref={inputRef3}
              onChange={()=>{setNewRef(inputRef3.current?.value || '');}}
              className="mr-2 p-2 border border-gray-300 rounded w-[250px]"
            />
          </div>}
        </div>

        <div className="flex items-end">
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
                  {newsrc && newSrc}
                  {!newsrc && (selectedSource ? selectedSource.source : 'Select a source')}
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
          <div>
          <div className="ml-2">
          {openSrcBox && <div>
            <div className="font-bold">Enter new observation source</div>
          <div className="flex items-center"> {/* Create a flex container for input and button */}
            <input
              type="text"
              placeholder="Enter new observation source"
              ref={inputRef4}
              className="mr-2 p-2 border border-gray-300 rounded h-[40px] w-[200px]"
            />
            <button className="p-2 bg-black text-white rounded " onClick={()=>{
              setNewSrc(inputRef4.current?.value || '');
              setnewsrc(true);
              setOpenSrcBox(false)
            }}>
              <PlusCircle className=""/>
            </button>
          </div></div>} 
          {!openSrcBox && <Button className="" onClick={()=>{setOpenSrcBox(true)}}><PlusCircle className="mr-2"/>Add</Button>}
        </div>
          </div>
        </div>



        <div >
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
      <div className="md:col-span-2 flex-col justify-between mt-4 mx-4"> {/* Align the comment box to the right */}
        <div className="font-bold">Additonal Observation Details</div>
        <input
          type="text"
          placeholder="Enter your comments"
          onChange={handleCommentChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 h-[100px]"
        />
      </div>
      <button
          disabled={loading}
          onClick={handleSubmission}
          className="w-1/4 mx-4 md:w-auto bg-gray-800 text-white p-2 rounded mt-2 hover:bg-black focus:outline-none mb-3"
        >
          Submit Form
      </button>
    </div>
  );
};

export default DepartmentList;
