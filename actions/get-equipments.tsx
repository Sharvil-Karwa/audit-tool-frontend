import axios from 'axios';
import { Equipment } from "@/types";


const getEquipments = async (auditId:string): Promise<Equipment[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/equipments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
};

export default getEquipments;
