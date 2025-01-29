import { auth } from '@/auth';
import { FormPacientev2 } from "@/components/ModuloAdmision/FormPacientev2";

export default async function PacienteNuevoPage() {
    const session = await auth()
  return (
    <div>
      <FormPacientev2 usuario={session}/>
    </div>
  );
}