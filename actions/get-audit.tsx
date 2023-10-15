import axios from 'axios';
import { Audit } from "@/types";

const getAudit = async (auditId: string): Promise<Audit> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/audits/${auditId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching that audit:', error);
    throw error;
  }
};

export default getAudit;
