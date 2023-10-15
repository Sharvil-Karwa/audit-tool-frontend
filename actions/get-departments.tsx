import axios from 'axios';
import { Department } from "@/types";

const getDepartments = async (auditId: string): Promise<Department[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/departments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audits:', error);
    throw error;
  }
};

export default getDepartments;
