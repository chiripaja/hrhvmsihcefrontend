import { auth } from '@/auth';
import { ModuloAdmisionImg } from '@/components/ModuloAdmisionImg/ModuloAdmisionImg';
export default async function AdmisionImgPage() {
  const session = await auth()
  return (
    <ModuloAdmisionImg usuario={session}/>
  );
}