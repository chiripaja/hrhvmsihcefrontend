
import { TriajeDif } from '../../../components/TriajeDiferenciado/TriajeDif';
import { auth } from '@/auth';
export default async function triajepage() {
  const session = await auth()
  return (
    <div className="flex-1 p-4">
      <div className="p-5 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Modulo Triaje</h2>
        <TriajeDif usuario={session}/>
      </div>   
    </div>
  );
}