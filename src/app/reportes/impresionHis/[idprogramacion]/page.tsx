import { ImpresionHis } from "@/components/reportes/ImpresionHis/ImpresionHis";

export default function ImpresionHisPage(props:any) {
  return (
    <ImpresionHis idprogramacion={props.params.idprogramacion}/>
  );
}