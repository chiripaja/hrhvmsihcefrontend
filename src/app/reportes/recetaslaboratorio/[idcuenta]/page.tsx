import { RecetasOrdenesLaboratorio } from "@/components/reportes/RecetasOrdenesLaboratorio/RecetasOrdenesLaboratorio";

export default function recetasLaboratorioPage(props:any) {
  return (
    <RecetasOrdenesLaboratorio idcuentaatencion={props.params.idcuenta}/>
  );
}