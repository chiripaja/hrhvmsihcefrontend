import { useCEDatosStore } from "@/store";
import { Tooltip } from "@/components/ui/Tooltip";
import { GoTrash } from "react-icons/go";
import axios from "axios";

export const CEOtrosTabla = ({ modificar = 0,cuentaDatos }: { modificar?: number,cuentaDatos:any }) => {

    const deleteordenesOtros = useCEDatosStore((state: any) => state.deleteordenesOtros);
    const handleDelete = async(indexToDelete: number,idCuenta:any) => {
      
          const data=await axios.delete(`${process.env.apijimmynew}/recetas/apideleteSolicitudProcedimientos/${idCuenta}/${indexToDelete}`)
     
        deleteordenesOtros(indexToDelete)
    };
  return (
    <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
       
    <table className={cuentaDatos?.ordenesOtros.length > 0 ? "tableT" : "hidden"} >
        <thead>
            <tr>
                <th scope="col" className="tableth">Cantidad</th>
                <th scope="col" className="tableth">Procedimiento</th>
                {
                (modificar!==0) && 
                      <th scope="col" className="tableth">Obs.</th>
                }
          
                {(modificar===0) && 
                 <th scope="col" className="tableth">Accion</th>
                }
               
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {cuentaDatos?.ordenesOtros.map((data: any,index:any) => (
                <tr key={`${data.idProducto}-${data.nombre}-${index}`}>
                    <td className="tabletd w-1/3">{data.cantidad}  </td>
                    <td className="tabletd w-32"> {data.nombre} </td>
                      {
                (modificar!==0) && 
                      <td className="tabletd w-32"> {data.observacion} </td>
                }
                   
                    {(modificar===0) && 
                    <td className="tabletd">
                         <Tooltip text="Eliminar">
                         <GoTrash  size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idProducto,data?.idCuenta)}/>
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
