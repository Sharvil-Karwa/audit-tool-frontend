import axios from 'axios';
import { DepEquipments } from "@/types";


const getEquipments = async (auditId:string): Promise<DepEquipments[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/department-equipments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipments:', error);
    throw error;
  }
};

export default getEquipments;
