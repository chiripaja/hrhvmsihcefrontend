import { CEAtencionPx } from "@/components/ConsultaExterna/CEAtencionPx";
import { auth } from '@/auth';

export default async function CeAtencionPage(props:any) {
  const session = await auth()
  return (
    <CEAtencionPx idcuentaatencion={props.params.idcuenta} session={session}/>
  );
}