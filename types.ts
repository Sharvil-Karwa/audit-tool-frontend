export interface Audit {
    id: string;
    name: string;
  }

export interface Department {
    id: string;
    name: string;
  }

  
export interface DepEquipments {
  departmentId: string;
  equipmentId: string;
  id: string;
  dep_name: string;
  eq_name: string;
  eq_id: string;
  location: string;
  type: string;
}

export interface Equipment {
  id: string;
  name: string;
  location: string;
  type: string;
}

export interface Area {
  id: string
  area: string 
} 

export interface AreaObservations {
  id: string;
  areaId: string;
  area_name: string;
  obs: string;
  referenc: string;
  observationId: string;
}