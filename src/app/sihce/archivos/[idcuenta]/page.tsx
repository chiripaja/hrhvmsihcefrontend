import TicketArchivo from '../../../../components/reportes/ArchivosListaImpresion/TicketArchivo';

export default function TicketPage(props:any) {
  return (
    <div>
    
    
      <TicketArchivo idcuentaatencion={props.params.idcuenta} />
    </div>
  );
}