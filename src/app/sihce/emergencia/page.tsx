
import { auth } from "@/auth";
import { EmergenciaAdmision } from "@/components/emergencia/admision/EmergenciaAdmision";


export default async function page() {
  const session = await auth()
  return (
    <EmergenciaAdmision session={session}/>
  )
}
