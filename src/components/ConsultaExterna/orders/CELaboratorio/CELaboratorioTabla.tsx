
import { Tooltip } from "@/components/ui/Tooltip";
import { useCEDatosStore } from "@/store"

import { GoTrash } from "react-icons/go";
const NombrePuntoCarga = (id: any) => {
    const parsedId = Number(id);
    switch (parsedId) {
        case 2:
            return "Patología Clínica"
        case 3:
            return "Anatomia Patologica"
        case 11:
            return "Banco de Sangre"
    }
    return "hola mundo"
}
export const CELaboratorioTabla = ({ modificar = 0 }: { modificar?: number }) => {
    const cuentaDatos = useCEDatosStore((state: any) => state.datosce);
    const deleteLaboratorio = useCEDatosStore((state: any) => state.deleteLaboratorio);
    const handleDelete = (indexToDelete: number, puntocarga: any) => {
        console.log(indexToDelete, puntocarga)
        deleteLaboratorio(indexToDelete, puntocarga)
    };
    const filterByRecetaCabezera=(id:any)=>{
        const datos=cuentaDatos?.recetaCabezera.filter((data:any)=>data.idReceta==id)
        return datos[0]?.idEstado
    }
    return (
        <>
        <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <table className={cuentaDatos?.ordenesLaboratorio.length > 0 ? "tableT" : "hidden"} >
                <thead>
                    <tr>
                        <th scope="col" className="tableth">Departamento</th>
                        <th scope="col" className="tableth">Servicio</th>
                        {(modificar===0) && 
                         <th scope="col" className="tableth">Accion</th>
                        }
                       
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {cuentaDatos?.ordenesLaboratorio.map((data: any,index:any) => (
                        <tr key={index}>
                            <td className="tabletd w-1/3">
                         
                       
                            {NombrePuntoCarga(data.puntoCarga)}</td>
                            <td className="tabletd w-32">{data.nombre} </td>
                            {(modificar===0) && 
                            <td className="tabletd w-23" >
                                {data?.idEstado=="1" ? 
                                <Tooltip text="Eliminar">
                                <GoTrash  size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idproducto, data.puntoCarga)}/>
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
            </>   
    )
}
