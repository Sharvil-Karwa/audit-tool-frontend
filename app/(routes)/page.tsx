import Container from "@/components/ui/container";
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <Container>
      <div className="flex justify-center items-center h-screen">
        Audit Tool Home Page
      </div>
    </Container>
  )
}
