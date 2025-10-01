import ContraReferencia from "@/components/reportes/Refcon/ContraReferencia";

export default function ContrareferenciaPage(props:any) {
  return (
    <>
      <ContraReferencia idcuentaatencion={props.params.idcuenta}/>
    </>
  );
}