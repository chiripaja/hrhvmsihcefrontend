import { Fua } from "@/components/reportes/Fua/Fua";

export default function FuaPage(props:any) {
  return (
    <Fua idcuentaatencion={props.params.idcuenta}/>
  );
}