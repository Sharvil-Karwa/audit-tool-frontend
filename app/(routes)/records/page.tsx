import getRecords from "@/actions/get-userRecords";
import Navbar from "@/components/navbar";
import Container from "@/components/ui/container";
import { currentUser } from "@clerk/nextjs";
import { Record, columns } from "./columns"
import { DataTable } from "./data-table"
import { parseISO, format } from "date-fns";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

const recordPage = async () =>{

    const user = await currentUser();
    const email = user ? user.emailAddresses[0].emailAddress : "";

    try {
        const records = await getRecords(email);

        
    const formattedRecords: Record[] = records.map((item)=>({
      auditId: item.auditId,
      auditName: item.auditName,
      department: item.department,
      equipment: item.equipment,
      eq_id: item.eq_id,
      rating: item.rating,
      // createdAt: format(item.createdAt, "MMMM do, yyyy"),
      // createdAt: format(parseISO(item.createdAt), "MMMM do, yyyy"),
      createdAt: formatDate(item.createdAt.toString()),
      type: item.type,
      location: item.location,
      area: item.area,
      reference: item.reference,
      refCountry: item.refCountry,
      comment: item.comment,
      source: item.source,
      observation: item.observation,
      id: item.id
  }))
        return(
            <Container>
                <Navbar />
                <div className="container mx-auto py-10">
                  <DataTable columns={columns} data={formattedRecords} />
                </div>
            </Container>
        )
    } catch(error){
        return (
          <Container>
            <div className="flex justify-center items-center h-screen">
              User Not Found
            </div>
          </Container>
        )
      }

}

export default recordPage