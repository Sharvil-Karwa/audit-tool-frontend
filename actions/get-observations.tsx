import axios from 'axios';
import { AreaObservations } from "@/types";


const getObservations = async (auditId:string): Promise<AreaObservations[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/area-observations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching observations:', error);
    throw error;
  }
};

export default getObservations;
