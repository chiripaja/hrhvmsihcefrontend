import ContraReferencia from '../../../../components/Refcon/ContraReferencia/ContraReferencia';
import { auth } from '@/auth';
export default async function ContraReferenciaPage() {
  const session = await auth()
  return (
      <ContraReferencia session={session}/>
  );
}