
import { Tooltip } from "@/components/ui/Tooltip";
import { GoTrash } from "react-icons/go";
import { useEmergenciaDatosStore } from "@/store/ui/emergenciadatos";
import { showConfirmDeleteAlert, showDeleteAlert } from "@/components/utils/alertHelper";
import axios from "axios";

export const OrdenesEcografiaObstetricaTabla = ({ modificar = 0, datosEmergencia, recetaIdTemporal }:
    { modificar?: number, datosEmergencia: any, recetaIdTemporal: any }) => {
        const deleteordenesEcografiaObstetrica = useEmergenciaDatosStore((state: any) => state.deleteordenesEcografiaObstetrica);
        const handleDelete = async (indexToDelete: number) => {
          showConfirmDeleteAlert().then(async (result) => {
            if (result.isConfirmed) {
              showDeleteAlert();
              const data = await axios.delete(`${process.env.apijimmynew}/recetas/apiDeleteRecetaDetalleByIdRecetaAndIdItem/${recetaIdTemporal}/${indexToDelete}`)
              deleteordenesEcografiaObstetrica(indexToDelete)
            }
            else {
              console.log("no elimino")
            }
          });
        };
  return (
    <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
    <table className={datosEmergencia?.ordenesEcografiaObstetrica.length > 0 ? "tableT" : "hidden"} >
        <thead>
            <tr>
                <th scope="col" className="tableth">Examen
                </th>
                <th scope="col" className="tableth">Cantidad</th>
                {(modificar === 1) &&
                    <th scope="col" className="tableth">Observaciones</th>
                }
                {(modificar === 0) &&
                    <th scope="col" className="tableth">Accion</th>
                }
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {datosEmergencia?.ordenesEcografiaObstetrica.filter((data: any) => data.idrecetacabecera == recetaIdTemporal).map((data: any, index: any) => (
                <tr key={`${data.idproducto}-${data.nombre}`}>
                    <td className="tabletd w-1/3">
                        {data.nombre} </td>
                    <td className="tabletd w-32"> {data.cantidad} </td>
                    {(modificar === 1) &&
                        <td className="tabletd">
                            {data.observaciones}
                        </td>}
                    {(modificar === 0) &&
                        <td className="tabletd">
                            <Tooltip text="Eliminar">
                                <GoTrash size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idproducto)} />
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
