import axios from 'axios';
import { RefObs } from "@/types";

const getRefObs = async (auditId: string): Promise<RefObs[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/ref-obs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ref-obs:', error);
    throw error;
  }
};

export default getRefObs;
