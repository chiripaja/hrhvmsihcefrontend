import { Tooltip } from "@/components/ui/Tooltip";
import { useCEDatosStore } from "@/store"
import axios from "axios";

import { GoTrash } from "react-icons/go";
const NombrePuntoCarga = (id: any) => {
    const parsedId = Number(id);
    switch (parsedId) {
        case 20:
            return "Ecografía General"
        case 21:
            return "Rayos X"
        case 22:
            return "Tomografia"
        case 23:
            return "Ecografía Obstétrica"
    }
    return "hola mundo"
}
export const CEImagenesTabla = ({ modificar = 0,cuentaDatos }: { modificar?: number,cuentaDatos:any }) => {
 
    const deleteImagenes = useCEDatosStore((state: any) => state.deleteImagenes);
    const handleDelete = async(indexToDelete: number, puntocarga: any,idrecetacabecera:any) => {
         if(idrecetacabecera){
            const data=await axios.delete(`${process.env.apijimmynew}/recetas/apiDeleteRecetaDetalleByIdRecetaAndIdItem/${idrecetacabecera}/${indexToDelete}`)
        
           deleteImagenes(indexToDelete, puntocarga)
        }else{
           deleteImagenes(indexToDelete, puntocarga)
        }
      
    };
    const filterByRecetaCabezera = (id: any) => {
        const datos = cuentaDatos?.recetaCabezera.filter((data: any) => data.idReceta == id)

        return datos[0]?.idEstado
    }
    return (
        <>
            <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <table className={cuentaDatos?.ordenesImagenes.length > 0 ? "tableT" : "hidden"} >
                    <thead>
                        <tr>
                            <th scope="col" className="tableth">Departamento</th>
                            <th scope="col" className="tableth">Procedimiento</th>
                            {(modificar === 0) &&
                                <th scope="col" className="tableth">Accion</th>
                            }
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {cuentaDatos?.ordenesImagenes.map((data: any) => (
                            <tr key={data?.idproducto + data?.puntoCarga}>
                                <td className="tabletd w-1/3">

                                    {NombrePuntoCarga(data.puntoCarga)}</td>
                                <td className="tabletd w-32">{data.nombre}</td>
                                {(modificar === 0) &&
                                    <td className="tabletd">
                                        
                                        {(filterByRecetaCabezera(data?.idrecetacabecera) == "1" || !filterByRecetaCabezera(data?.idrecetacabecera)) ?
                                            <Tooltip text="Eliminar">
                                                <GoTrash size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idproducto, data.puntoCarga,data?.idrecetacabecera)} />
                                            </Tooltip>
                                            :
                                            <span className="text-blue-500 text-xs">
                                                Receta Despachada
                                            </span>
                                        }
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
