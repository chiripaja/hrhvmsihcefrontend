import { auth } from '@/auth';
import { ModuloAdmisionExternos } from '@/components/ModuloAdmision/ModuloAdmisionExternos';
export default async function AdmisionExternosPage() {
    const session = await auth()
    return (
      <div className="flex-1 bg-white  px-1 shadow print:p-1 print:shadow-none ">
            <ModuloAdmisionExternos usuario={session}/>
          </div>
    );
}