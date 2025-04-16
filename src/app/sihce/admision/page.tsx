import { auth } from '@/auth';
import { ModuloAdmision } from '@/components/ModuloAdmision/ModuloAdmision'


export default async function admisionPage() {
  const session = await auth()
  return (
    <div className="flex-1 bg-white  px-1 shadow print:p-1 print:shadow-none ">

      <ModuloAdmision usuario={session}/>
    </div>
  );
}  
  