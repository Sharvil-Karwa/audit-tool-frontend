import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import {ThumbsUp} from "lucide-react"

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
