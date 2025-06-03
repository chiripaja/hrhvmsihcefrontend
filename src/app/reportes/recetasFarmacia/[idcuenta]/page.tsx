import { RecetasOrdenesFarmacia } from "@/components/reportes/RecetasOrdenesFarmacia/RecetasOrdenesFarmacia";

export default function RecetasFarmaciaPage(props:any) {
  return (
    <RecetasOrdenesFarmacia idcuentaatencion={props.params.idcuenta}/>
  );
}