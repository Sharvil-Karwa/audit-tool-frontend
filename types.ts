export interface Audit {
    id: string;
    name: string;
    offline: boolean
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
  depId: string;
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
  reference: string;
  observationId: string;
} 

export interface Observation {
  id: string;
  observation: string;
  reference: string;
} 

export interface Source{
  id: string;
  source: string;
} 

export interface Rating{
  id: string;
  rating: string;
}

export interface Reference {
  id: string;
  mainRef: string;
  reference: string;
  isMain: string;
  country: string
}


export interface RefObs {
  id: string;
  refId: string;
  obsId: string;
  reference: string;
  country: string;
}

export interface Record{    
  auditId: String
  auditName: String
  department: String
  equipment: String
  eq_id: String
  type: String
  location:    String
  area:   String
  reference:   String
  refCountry: String
  comment:     String
  rating:      String
  source:      String
  observation: String
  createdAt: String
  id: String
}