import { FormatoInterconsulta } from "@/components/reportes/FormatoInterconsulta/FormatoInterconsulta";

export default function formatoInterconsultaPage(props:any) {
  return (
    <FormatoInterconsulta idcuentaatencion={props.params.idcuenta}/>
  );
}