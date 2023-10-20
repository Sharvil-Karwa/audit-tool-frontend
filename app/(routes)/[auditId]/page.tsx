import getAudit from "@/actions/get-audit";
import Container from "@/components/ui/container";
import DepartmentList from "@/components/department-list";
import getDepartments from "@/actions/get-departments";
import getEquipments from "@/actions/get-equipments";
import getAreas from "@/actions/get-areas";
import getObservations from "@/actions/get-observations";
import getRatings from "@/actions/get-ratings";
import getSources from "@/actions/get-sources";

const AuditPage = async ({ params }: { params: { auditId: string } }) => { 

  try{
    const audit = await getAudit(params.auditId);
    const departments = await getDepartments(params.auditId);
    const equipments = await getEquipments(params.auditId); 
    const areas = await getAreas(params.auditId);
    const observations = await getObservations(params.auditId); 
    const ratings = await getRatings(params.auditId);
    const sources = await getSources(params.auditId);

    return (
      <Container>
        <div className="flex flex-col h-screen justify-center items-center border">
          <div className="font-bold text-2xl m-4">{audit.name} </div>
          <DepartmentList departments={departments} equipments={equipments} auditId={params.auditId} areas={areas} areaObservations={observations} ratings={ratings} sources={sources}/>
        </div>
      </Container>
    )
  } catch(error){
    return (
      <Container>
        <div className="flex justify-center items-center h-screen">
          Audit Not Found
        </div>
      </Container>
    )
  }
};

export default AuditPage;
