'use client'

export const SeccionOrdenes = ({datos}:any) => {
  if (datos.length === 0) return null;
  return (
              <div>
                    <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                    ({datos[0]?.Descripcion}) (N° Receta: {datos[0]?.idReceta})
                    {
                      datos.map((item: any) => (
                        <div key={item.IdProducto}>
                          - {item?.Nombre} ( {item?.CantidadPedida} )
                        </div>
                      ))
                    }
                  </div>
  )
}
