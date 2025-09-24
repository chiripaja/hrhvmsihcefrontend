import { Referencia } from "@/components/Refcon/Referencia/Referencia";
import { auth } from '@/auth';
export default async function ReferenciaPage() {
    const session = await auth()
  return (
    <Referencia session={session}/>
  );
}