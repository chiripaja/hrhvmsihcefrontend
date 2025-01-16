import { FormPaciente } from "@/components/ModuloAdmision/FormPaciente";
import { auth } from '@/auth';
export default async function NamePage() {
  const session = await auth()
  return (
    <div>
      <FormPaciente usuario={session}/>
    </div>
  );
} 

   