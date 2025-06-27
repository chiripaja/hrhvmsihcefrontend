import { RecetasInterconsulta } from "@/components/reportes/RecetasInterconsulta/RecetasInterconsulta";

export default function recetaInterconsultaPage(props:any) {
  return (
    <RecetasInterconsulta idcuentaatencion={props.params.idcuenta}/>
  );
}