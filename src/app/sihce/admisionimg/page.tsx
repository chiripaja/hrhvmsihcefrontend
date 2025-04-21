import { auth } from '@/auth';
import { ModuloAdmisionImg } from '@/components/ModuloAdmisionImg/ModuloAdmisionImg';
import { ModuloAdmisionImgLista } from '@/components/ModuloAdmisionImg/ModuloAdmisionImgLista';
export default async function AdmisionImgPage() {
  const session = await auth()
  return (
    <ModuloAdmisionImgLista usuario={session}/>
  );
}