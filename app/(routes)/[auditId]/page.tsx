import getAudit from "@/actions/get-audit";
import Container from "@/components/ui/container";
import DepartmentList from "@/components/department-list";
import getDepartments from "@/actions/get-departments";
import getEquipments from "@/actions/get-equipments";
import getAreas from "@/actions/get-areas";
import getObservations from "@/actions/get-observations";
import getRatings from "@/actions/get-ratings";
import getSources from "@/actions/get-sources";
import getObservationss from "@/actions/get-obs";
import getReferences from "@/actions/get-references";
import getRefObs from "@/actions/get-refObs";
import { currentUser } from "@clerk/nextjs";
import Navbar from "@/components/nav";
import getAudits from "@/actions/get-audits";

const AuditPage = async ({ params }: { params: { auditId: string } }) => { 
  const user = await currentUser();
  const email = user ? user.emailAddresses[0].emailAddress : "";

  try{
    const audits = await getAudits(email);
    const audit = await getAudit(params.auditId);
    const departments = await getDepartments(params.auditId);
    const equipments = await getEquipments(params.auditId); 
    const areas = await getAreas(params.auditId);
    const areaObservations = await getObservations(params.auditId); 
    const ratings = await getRatings(params.auditId);
    const sources = await getSources(params.auditId);
    const references = await getReferences(params.auditId);
    const observations =  await getObservationss(params.auditId)
    const refobs = await getRefObs(params.auditId) 
    const access = audit.offline


    return (
      <Container>
        <Navbar audits = {audits} email={email}/>
        <div className="flex flex-col h-screen justify-center items-center border mt-8">
          <DepartmentList access={access} email={email} auditName = {audit.name} departments={departments} equipments={equipments} auditId={params.auditId} areas={areas} areaObservations={areaObservations} ratings={ratings} sources={sources} references={references} observations={observations} refObs={refobs}/>
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
