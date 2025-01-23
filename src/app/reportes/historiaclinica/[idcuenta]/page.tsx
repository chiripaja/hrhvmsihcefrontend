import { Historiaclinica } from "@/components/reportes/HistoriaClinica/HistoriaClinica";

export default function HistoricaClinicaPage(props:any) {
  return (
    <Historiaclinica idcuentaatencion={props.params.idcuenta}/>
  );
}