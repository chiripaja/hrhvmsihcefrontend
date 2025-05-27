import { RecetasOrdenesImagenes } from "@/components/reportes/RecetasOrdenesImagenes/RecetasOrdenesImagenes";

export default function RecetasPage(props:any) {
 
  return (

    <RecetasOrdenesImagenes idcuentaatencion={props.params.idcuenta}/>
  
    
  );
}