import axios from 'axios';
import { Area } from "@/types";

const getAreas = async (auditId: string): Promise<Area[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/areas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

export default getAreas;
