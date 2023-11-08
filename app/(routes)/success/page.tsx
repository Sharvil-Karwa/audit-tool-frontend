import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import {MoveLeft, ThumbsUp} from "lucide-react"
import { Button } from "@/components/ui/button";



const SuccessPage = async () => { 
    return (
      <Container>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-green-600 text-2xl align-items">
        <ThumbsUp className="mx-2"/> Submission Successful 
        </div>
      </Container>
    )
  }

export default SuccessPage;
