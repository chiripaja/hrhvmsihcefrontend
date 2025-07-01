import { useCEDatosStore } from "@/store";
import { Tooltip } from "@/components/ui/Tooltip";
import { GoTrash } from "react-icons/go";
import axios from "axios";

export const CEProcedimientosConsultorioTabla = ({ modificar = 0,cuentaDatos }: { modificar?: number,cuentaDatos:any }) => {

    const deleteordenesProcedimiento = useCEDatosStore((state: any) => state.deleteordenesProcedimiento);
 const handleDelete = async (idproducto: number, idOrden: any) => {
  try {
    deleteordenesProcedimiento(idproducto);
   const data= await axios.delete(`${process.env.apijimmynew}/recetas/ApiEliminarFacturacionPorOrdenIdproducto/${idOrden}/${idproducto}`);
   console.log(data)
    console.log('Eliminado correctamente');
  } catch (error) {
 
    console.error('Error al eliminar:', error);
  }
};
  return (
    <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <table className={cuentaDatos?.ordenesProcedimiento.length > 0 ? "tableT" : "hidden"} >
        <thead>
            <tr>
                <th scope="col" className="tableth">Cantidad</th>
                <th scope="col" className="tableth">Procedimiento</th>
                {(modificar===0) && 
                 <th scope="col" className="tableth">Accion</th>
                }
               
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {cuentaDatos?.ordenesProcedimiento.map((data: any,index:any) => (
                <tr key={data.idProducto}>
                    <td className="tabletd w-1/3">
                  
                    {data.cantidad} </td>
                    <td className="tabletd w-32">({data.Codigo}) - {data.nombreproc} </td>
                    {(modificar===0) && 
                    <td className="tabletd">
                         <Tooltip text="Eliminar">
                         <GoTrash  size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idProducto,data?.idOrden)}/>
                         </Tooltip>
                    </td>
}
                </tr>
            ))}
        </tbody>
    </table>
    </div>
  )
}
