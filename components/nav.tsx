import Link from "next/link";
import Container from "./ui/container";
import getAudits from "@/actions/get-audits";
import AuditSwitcher from "./audit-switcher";
import { Button } from "./ui/button";
import { Table, User } from "lucide-react";
import { UserButton, authMiddleware, currentUser, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Audit } from "@/types";

const Navbar = async (params : {
  audits : Audit[],
  email : string | null

}) => {
  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">AUDIT TOOL</p>
          </Link>
          <div className="flex space-x-5 items-center">
            <AuditSwitcher items={params.audits} />
            <Link href="/records" className="ml-4 flex lg:ml-0 gap-x-2">
            <Button><User /> User Records</Button>
          </Link>
          </div>
          <div className="">
              <UserButton afterSignOutUrl="/"/>
          </div>
        </div>
       
      </Container>
    </div>
  );
};

export default Navbar;
