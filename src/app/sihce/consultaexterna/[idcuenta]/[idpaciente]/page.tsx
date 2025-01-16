import { CEAtencionPx } from "@/components/ConsultaExterna/CEAtencionPx";

export default function CeAtencionPage(props:any) {
  return (
    <CEAtencionPx idcuentaatencion={props.params.idcuenta} idpaciente={props.params.idpaciente}/>
  );
}