import { CEHistoricosByDni } from "@/components/ConsultaExterna/historicos/CEHistoricosByDni";


export default function HistoricoByDniPage(props:any) {
  const dni=props.params.dni?props.params.dni:'41664204';
  return (
    <CEHistoricosByDni dni={dni}/>
  );
}