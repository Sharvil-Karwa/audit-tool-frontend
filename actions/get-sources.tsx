import axios from 'axios';
import { Source} from "@/types";

const getSources = async (auditId: string): Promise<Source[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/sources`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
};

export default getSources;
