import getAudit from "@/actions/get-audit";
import Container from "@/components/ui/container";
import DepartmentList from "@/components/department-list";
import getDepartments from "@/actions/get-departments";
import getEquipments from "@/actions/get-equipments";
import getAreas from "@/actions/get-areas";
import getObservations from "@/actions/get-observations";

const AuditPage = async ({ params }: { params: { auditId: string } }) => { 

  try{
    const audit = await getAudit(params.auditId);
    const departments = await getDepartments(params.auditId);
    const equipments = await getEquipments(params.auditId); 
    const areas = await getAreas(params.auditId);
    const observations = await getObservations(params.auditId);
    return (
      <Container>
        <div className="flex flex-col justify-center items-center h-screen">
          {audit.name} 
          <DepartmentList departments={departments} auditId={params.auditId} depEquipments={equipments} areas={areas} areaObservations={observations}/>
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
