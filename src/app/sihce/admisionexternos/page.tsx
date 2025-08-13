import { auth } from '@/auth';
import { ModuloAdmisionExternos } from '@/components/ModuloAdmision/ModuloAdmisionExternos';
import axios from 'axios';
export default async function AdmisionExternosPage() {
  const session = await auth()
  let porcentaje = null;
  try {
    const res = await fetch(`${process.env.apijimmynew}/citas/porcentajecitas`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error en API');
    const data = await res.json();
    porcentaje = data?.porcentajecitas ?? null;
  } catch (error) {
    console.error('Error obteniendo porcentaje:', error);
  }
  return (
    <div className="flex-1 bg-white  px-1 shadow print:p-1 print:shadow-none ">
      <ModuloAdmisionExternos usuario={session} porcentaje={porcentaje} />
    </div>
  );
}