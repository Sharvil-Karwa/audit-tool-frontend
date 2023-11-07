import axios from 'axios';
import { Observation } from "@/types";


const getObservationss = async (auditId:string): Promise<Observation[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/observations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching observations:', error);
    throw error;
  }
};

export default getObservationss;
