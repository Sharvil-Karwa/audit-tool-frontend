import axios from 'axios';
import { Rating } from "@/types";

const getRatings = async (auditId: string): Promise<Rating[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${auditId}/ratings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
};

export default getRatings;
