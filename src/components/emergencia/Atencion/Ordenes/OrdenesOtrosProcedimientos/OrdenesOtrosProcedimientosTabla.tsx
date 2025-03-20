
import { Tooltip } from "@/components/ui/Tooltip";
import { GoTrash } from "react-icons/go";
import { useEmergenciaDatosStore } from "@/store/ui/emergenciadatos";
export const OrdenesOtrosProcedimientosTabla = ({ modificar = 0,datosEmergencia }: { modificar?: number,datosEmergencia:any }) => {
 
  const deleteordenesOtros = useEmergenciaDatosStore((state: any) => state.deleteordenesOtros);
  const handleDelete = (indexToDelete: number) => {

      deleteordenesOtros(indexToDelete)
  };
  return (
    <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <table className={datosEmergencia?.ordenesOtros.length > 0 ? "tableT" : "hidden"} >
        <thead>
            <tr>
                <th scope="col" className="tableth">Cantidad</th>
                <th scope="col" className="tableth">Procedimiento</th>
                {datosEmergencia?.idTipoAlta==null &&(
                 <th scope="col" className="tableth">Accion</th>
                    )}
               
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {datosEmergencia?.ordenesOtros.map((data: any,index:any) => (
                <tr key={`${data.idProducto}-${data.nombre}-${index}`}>
                    <td className="tabletd w-1/3">{data.cantidad}  </td>
                    <td className="tabletd w-32"> {data.nombre} </td>
                    {datosEmergencia?.idTipoAlta==null &&(
                    <td className="tabletd">
                         <Tooltip text="Eliminar">
                         <GoTrash  size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idProducto)}/>
                         </Tooltip>
                    </td>
)}
                </tr>
            ))}
        </tbody>
    </table>
    </div>
  )
}
