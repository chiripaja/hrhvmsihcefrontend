import { auth } from "@/auth";
import { CEAtencionPx } from "@/components/ConsultaExterna/CEAtencionPx";
import { CEListado } from "@/components/ConsultaExterna/CEListado";

export default async function NamePage() {
  const session = await auth()
  return (
    <CEListado session={session}/>
  );
}