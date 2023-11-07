import getAudits from "@/actions/get-audits";
import Navbar from "@/components/nav";
import Container from "@/components/ui/container";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const email = user ? user.emailAddresses[0].emailAddress : "";
  const audits = await getAudits(email);
  return (
    <Container>
      <Navbar audits={audits} email={email}/>
      <div className="flex justify-center items-center h-screen">
        Audit Tool Home Page
      </div>
    </Container>
  )
}
