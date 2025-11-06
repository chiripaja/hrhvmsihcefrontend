import HistoriaClinicaEmer from "@/components/reportes/HistoriaClinicaEmer/HistoriaClinicaEmer";

export default function HistoriaClinicaEPage(props:any) {
  return (
    <HistoriaClinicaEmer  idcuentaatencion={props.params.idcuenta}/>
  );
}