import React from 'react'

const TablaRecomendaciones = ({ receta }: any) => {
const detalles = receta || [];


  return (
      <table className="w-full border-collapse mt-2 text-sm">
        
      <tbody>
        <tr className="w-full border-collapse text-center border border-black bg-gray-100">
          <td colSpan={4}>RECOMENDACIONES / PLAN</td>
        </tr>
    
  {receta
      ?.filter((filtro:any)=>filtro?.factCatalogoBienesInsumos?.tipoProducto=='0')
        .map((data: any, index: number) => (
          <tr key={index}>
            <td className="border-r border-l border-black w-3 text-center">
              {index + 1}
            </td>
            <td className="w-96 text-left px-2">
            
              </td>
            <td className="border-black border-r border-l w-3 text-center">
              {index + 8 <= 10 ? index + 8 : ''}
            </td>
            <td className="w-96  border-black border-r">
              {data?.factCatalogoBienesInsumos?.nombre} {data?.cantidadPedida}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TablaRecomendaciones
