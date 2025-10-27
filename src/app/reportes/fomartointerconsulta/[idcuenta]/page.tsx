import { FormatoTeleconsulta } from "@/components/reportes/FormatoTeleconsulta/FormatoTeleconsulta";


export default function formatoInterconsultaPage(props:any) {
  return (
    <FormatoTeleconsulta idcuentaatencion={props.params.idcuenta}/>
  );
}