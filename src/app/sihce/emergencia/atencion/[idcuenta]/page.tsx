import { AtencionEmergencia } from "@/components/emergencia/Atencion/AtencionEmergencia";
import { auth } from "@/auth";

export default async function AtencionPage(props:any) {
   
  const session = await auth()
  return (
      <AtencionEmergencia session={session} idcuentaatencion={props.params.idcuenta} />

  
  );
}