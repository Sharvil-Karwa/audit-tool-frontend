import Link from "next/link";
import Container from "./ui/container";
import getAudits from "@/actions/get-audits";
import AuditSwitcher from "./audit-switcher";
import { Button } from "./ui/button";
import { Home, Table } from "lucide-react";
import { UserButton, authMiddleware, currentUser, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Navbar = async () => {
  // const user = await useUser();
  // const email = user ? user.emailAddresses[0].emailAddress : "karwasharvil@gmail.com";
  // const audits = await getAudits("karwasharvil@gmail.com");
  // alert(user)

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">AUDIT TOOL</p>
          </Link>
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <Button><Home className="mr-2"/>Home Page</Button>
          </Link>
          <div className="">
                    <UserButton afterSignOutUrl="/"/>
                </div>
        </div>
       
      </Container>
    </div>
  );
};

export default Navbar;
