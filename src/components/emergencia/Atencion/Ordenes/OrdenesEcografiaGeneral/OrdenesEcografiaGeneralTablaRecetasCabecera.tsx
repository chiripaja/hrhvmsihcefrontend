import { showConfirmDeleteAlert, showDeleteAlert } from '@/components/utils/alertHelper';
import { useEmergenciaDatosStore } from '@/store/ui/emergenciadatos';
import axios from 'axios';
import React from 'react'
import { Tooltip } from "@/components/ui/Tooltip";
import { GoPencil, GoTrash } from 'react-icons/go';

export const OrdenesEcografiaGeneralTablaRecetasCabecera = ({ datosEmergencia, handleOpenMenu }: { datosEmergencia: any, handleOpenMenu: any }) => {
  const deleteRecetaCabecera = useEmergenciaDatosStore((state: any) => state.deleteRecetaCabecera);
  const handleDelete = (indexToDelete: number) => {
      showConfirmDeleteAlert().then(async (result) => {
          if (result.isConfirmed) {
              showDeleteAlert();
              const data = await axios.delete(`${process.env.apijimmynew}/recetas/apiDeleteRecetaCabeceraByIdReceta/${indexToDelete}`)
              deleteRecetaCabecera(indexToDelete)
          }
          else {
              console.log("no elimino")
          }
      });
  };
  const recetaCabecera = datosEmergencia?.recetaCabezera.filter(
      (data: any) => data.IdPuntoCarga === 20
  );
  return (
         <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                           <table className={recetaCabecera.length > 0 ? "tableT" : "hidden"} >
                               <thead>
                                   <tr>
                                       <th scope="col" className="tableth">Fecha</th>
               
                                       <th scope="col" className="tableth">Nro. Receta</th>
               
               
                                       <th scope="col" className="tableth">Accion</th>
               
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                   {recetaCabecera.map((data: any, index: any) => (
                                       <tr key={`${data.idReceta}-${data.FechaReceta}`}>
                                           <td className="tabletd">
                                               {new Intl.DateTimeFormat('es-PE', {
                                                   day: '2-digit',
                                                   month: '2-digit',
                                                   year: 'numeric',
                                                   hour: '2-digit',
                                                   minute: '2-digit',
                                                   hour12: false
                                               }).format(new Date(data.FechaReceta))}
                                           </td>
                                           <td className="tabletd">
                                               {data.idReceta}
                                           </td>
                                           <td className="tabletd">
                                               {data?.idEstado == "1" ?
                                                   <div className="flex items-center gap-4">
                                                       <Tooltip text="Eliminar">
                                                           <button
                                                               onClick={() => handleDelete(data?.idReceta)}
                                                               className="p-2 text-red-500 bg-red-100 rounded-lg shadow-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                                                           >
                                                               <GoTrash size={16} />
                                                           </button>
                                                       </Tooltip>
               
                                                       <Tooltip text="Modificar">
                                                           <button
                                                               onClick={() => handleOpenMenu(data.idReceta)}
                                                               className="p-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                           >
                                                               <GoPencil size={16} />
                                                           </button>
                                                       </Tooltip>
                                                   </div>
               
                                                   :
                                                   <span className="text-blue-500 text-xs">
                                                       Receta
                                                       Despachada
                                                   </span>
                                               }
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
  )
}
