import { RecetasOrdenesOtrosProcedimientos } from "@/components/reportes/RecetasOrdenesOtrosProcedimientos/RecetasOrdenesOtrosProcedimientos";


export default function RecetasOtrosProcedimientos(props:any) {
  return (
   <RecetasOrdenesOtrosProcedimientos idcuentaatencion={props.params.idcuenta}/>
  )
}
