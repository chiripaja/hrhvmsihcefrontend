import { useCEDatosStore } from "@/store";
import { Tooltip } from "@/components/ui/Tooltip";
import { GoTrash } from "react-icons/go";

export const OrdenesProcedimientosConsultorioTabla = ({ modificar = 0,datosEmergencia }: { modificar?: number,datosEmergencia:any }) => {

  const deleteordenesProcedimiento = useCEDatosStore((state: any) => state.deleteordenesProcedimiento);
  const handleDelete = (indexToDelete: number) => {
    deleteordenesProcedimiento(indexToDelete)
  };
  return (
    <div className="max-h-[300px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <table className={datosEmergencia?.ordenesProcedimiento.length > 0 ? "tableT" : "hidden"} >
        <thead>
          <tr>
            <th scope="col" className="tableth">Cantidad</th>
            <th scope="col" className="tableth">Procedimiento</th>
            {(modificar === 0) &&
              <th scope="col" className="tableth">Accion</th>
            }
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {datosEmergencia?.ordenesProcedimiento.map((data: any, index: any) => (
            <tr key={data.idProducto}>
              <td className="tabletd w-1/3">{data.cantidad} </td>
              <td className="tabletd w-32"> {data.nombreproc} </td>
              {(modificar === 0) &&
                <td className="tabletd">
                  <Tooltip text="Eliminar">
                    <GoTrash size={24} className="text-red-400 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(data?.idProducto)} />
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
