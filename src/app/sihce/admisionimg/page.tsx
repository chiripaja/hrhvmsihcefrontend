import { auth } from '@/auth';
import { ModuloAdmisionImgLista } from '@/components/ModuloAdmisionImg/AdmisionImg/ModuloAdmisionImgLista';
export default async function AdmisionImgPage() {
  const session = await auth()
  return (
    <ModuloAdmisionImgLista usuario={session}/>
  );
}