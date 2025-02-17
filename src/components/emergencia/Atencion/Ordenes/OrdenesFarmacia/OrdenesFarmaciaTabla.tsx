import { useCEDatosStore } from "@/store";
import { Tooltip } from "@/components/ui/Tooltip";
import { GoTrash } from "react-icons/go";

export const OrdenesFarmaciaTabla= ({ modificar = 0 }: { modificar?: number }) => {
    const cuentaDatos = useCEDatosStore((state: any) => state.datosce);
    const deleteMedicamento = useCEDatosStore((state: any) => state.deleteMedicamento);
    const handleDelete = (indexToDelete: number) => {
        deleteMedicamento(indexToDelete)
    };
  return (
    <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <table className={cuentaDatos?.medicamentos.length > 0 ? "tableT" : "hidden"} >
        <thead>
            <tr>
                <th scope="col" className="tableth">Medicamento</th>
                <th scope="col" className="tableth">Cantidad</th>
                {(modificar===1) && 
                 <th scope="col" className="tableth">Observaciones</th>
                }
                {(modificar===0) && 
                 <th scope="col" className="tableth">Accion</th>
                }
               
               
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {cuentaDatos?.medicamentos.map((data: any,index:any) => (
                <tr key={`${data.idProducto}-${data.nombre}`}>
                    <td className="tabletd w-1/3">
                 
                    {data.nombre} </td>
                    <td className="tabletd w-32"> {data.cantidad} </td>
                    {(modificar===1) && 
                    <td className="tabletd">
                         {data.observaciones}
                    </td>}
                    {(modificar===0) && 
                    <td className="tabletd">
                         {data?.idEstadoDetalle=="1" ? 
                         <Tooltip text="Eliminar">
                         <GoTrash  size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idproducto)}/>
                         </Tooltip>:
                                <span className="text-blue-500 text-xs">
                                    Receta 
                                    Despachada
                                </span>
                            }
                    </td>
}
                </tr>
            ))}
        </tbody>
    </table>
    </div>
  )
}
