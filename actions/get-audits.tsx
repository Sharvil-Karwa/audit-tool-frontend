import axios from 'axios';
import { Audit } from "@/types";

const getAudits = async (email : string): Promise<Audit[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/audits/user/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audits:', error);
    return ([])
  }
};

export default getAudits;
