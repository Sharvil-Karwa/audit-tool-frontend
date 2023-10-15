import axios from 'axios';
import { Audit } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/audits`;

const getAudits = async (): Promise<Audit[]> => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching audits:', error);
    throw error;
  }
};

export default getAudits;
