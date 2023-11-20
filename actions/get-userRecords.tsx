import axios from 'axios';
import { Record } from "@/types";

const getRecords = async (email: string): Promise<Record[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userRecords/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error while fetching records:', error);
    throw error;
  }
};

export default getRecords;
