import axios from 'axios';
import { Reference } from "@/types";

const getReferences = async (auditId: string): Promise<Reference[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/references`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audits:', error);
    throw error;
  }
};

export default getReferences;
