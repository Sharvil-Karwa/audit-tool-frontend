import Link from "next/link";
import Container from "./ui/container";
import getAudits from "@/actions/get-audits";
import AuditSwitcher from "./audit-switcher";
import { Button } from "./ui/button";
import { Table } from "lucide-react";

const Navbar = async () => {
  const audits = await getAudits();

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">AUDIT TOOL</p>
          </Link>
          <div className="flex space-x-5 items-center">
            <Link href="/excel" className="ml-4 flex lg:ml-0 gap-x-2">
              <Button className=""><Table className="mr-2"/> Upload Excel</Button>
            </Link>
            <AuditSwitcher items={audits} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
