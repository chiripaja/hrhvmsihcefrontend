'use client'
import { getData } from '@/components/helper/axiosHelper'
import { Loading } from '@/components/utils/Loading'
import React, { useEffect, useState } from 'react'
import { BiShow } from 'react-icons/bi'
import { LiaSearchPlusSolid } from "react-icons/lia";
import { IoCloseCircleOutline } from 'react-icons/io5'
import { ModalGenerico } from '@/components/ui/ModalGenerico'
import { ModalGenericoSmall } from '@/components/ui/ModalGenericoSmall'
interface props {
  dni: string
}
export const CEHistoricosByDni = ({ dni }: props) => {
  const [filtro, setFiltro] = useState("");
  const [pxDatos, setPxDatos] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    dni && getHistoryByDni(dni)
  }, [dni])

  const getHistoryByDni = async (dni: string) => {
    setIsLoading(true);
    try {
      const data = await getData(`${process.env.apijimmynew}/paciente/${dni}`);

      setPxDatos(data);
    } catch (err) {
      setError("Hubo un problema al obtener los datos del paciente.");
    } finally {
      setIsLoading(false);
    }

  }
  const [openRow, setOpenRow] = useState(null);

  const toggleAccordion = (id: any) => {
    setOpenRow(openRow === id ? null : id);
  };



  return (
    <>
      {isLoading ? (
        <Loading messagge='Cargando datos del paciente...' />
      ) : (
        <>
          <div className='grid grid-cols-1 bg-white shadow-xl p-2 rounded'>
            <div className='flex justify-center text-xl '>
              Historial de pacientes
            </div>
            <div>
              <span>Paciente :</span>
              <span> {pxDatos.primerNombre} {pxDatos.apellidoPaterno} {pxDatos.apellidoMaterno} {pxDatos.nroDocumento && "(" + pxDatos.nroDocumento + ")"}  </span>
            </div>
            <div className="my-4">
  <input
    type="text"
    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
    placeholder="Buscar por servicio o médico..."
    value={filtro}
    onChange={(e) => setFiltro(e.target.value)}
  />
</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-center">Fecha</th>
                  <th className="py-3 px-6 text-left">Servico</th>
                  <th className="py-3 px-6 text-left">Medico</th>
                  <th className="py-3 px-6 text-center">Motivo</th>
                  <th className="py-3 px-6 text-center">Accion</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {pxDatos.atenciones && pxDatos.atenciones.length > 0 && (
  
 pxDatos.atenciones
  ?.slice()
  .sort((a: any, b: any) => new Date(a.fechaIngreso).getTime() - new Date(b.fechaIngreso).getTime())
  .filter((item: any) => {
    const texto = filtro.toLowerCase();
    return (
      item.servicio?.nombre?.toLowerCase().includes(texto) ||
      item.medico?.empleado?.apellidoPaterno?.toLowerCase().includes(texto) ||
      item.medico?.empleado?.apellidomaterno?.toLowerCase().includes(texto) ||
      item.medico?.empleado?.nombres?.toLowerCase().includes(texto) 
    );
  })

                  .map((item: any) => (
                    <React.Fragment key={item.idAtencion}>
                      <tr
                        className="border-b border-gray-200 cursor-pointer"
                        onClick={() => toggleAccordion(item.idAtencion)}
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap">{item.fechaIngreso}</td>
                        <td className="py-3 px-6 text-left">
                          <p>
{item?.idCuentaAtencion}        
                          </p>
                
                          {item.servicio?.nombre}</td>
                        <td className="py-3 px-6 text-left">{item.medico?.empleado?.apellidoPaterno} {item.medico?.empleado?.apellidomaterno} {item.medico?.empleado?.nombres}</td>
                        <td className="py-3 px-6 text-left">
                          <p>Motivo</p>
                          <p>{item.atencionesCE?.citaMotivo}</p>
                          <p>
                            Diagnostico
                          </p>
                          {item.atencionesCE?.citaDiagMed}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {openRow === item.idAtencion ? (
                            <span className="inline-flex items-center text-blue-500"><IoCloseCircleOutline className='mr-2' /> Esconder</span>
                          ) : (
                            <span className="inline-flex items-center text-blue-500"><BiShow className='mr-2' /> Mostrar</span>
                          )}
                        </td>
                      </tr>


                      {openRow === item.idAtencion && (
                        <tr className="bg-gray-200">
                          <td className="py-3 px-6" colSpan={5}>
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        
                        
                              {/* Triaje Section */}
                              {item.atencionesCE?.triajePeso && (
                                <div className='bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200 w-full md:w-1/3'>
                                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos Triaje</h3>
                                  <ul className="list-disc list-inside">
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Temperatura :</span>
                                      <span className="ml-2">{item?.atencionesCE?.triajeTemperatura}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Peso :</span>
                                      <span className="ml-2">{item?.atencionesCE?.triajePeso}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Talla :</span>
                                      <span className="ml-2">{item?.atencionesCE?.triajeTalla}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Temperatura :</span>
                                      <span className="ml-2">{item?.atencionesCE?.triajeTemperatura}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Presion :</span>
                                      <span className="ml-2">{item?.atencionesCE?.triajePresion}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">TriajeSaturacion :</span>
                                      <span className="ml-2">{item?.atencionesCE?.triajeSaturacion}</span>
                                    </li>
                                  </ul>
                                </div>
                              )}

                              {/* Diagnósticos Section */}
                              {item.atencionesDiagnosticos && item.atencionesDiagnosticos > 0 && (
                                <div className='bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200 w-full md:w-1/3'>
                                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Diagnósticos</h3>
                                  {item.atencionesDiagnosticos.map((dx: any) => (
                                    <div key={dx.diagnostico.codigoCIE10}>
                                      <ul className="list-disc list-inside">
                                        <li className="text-gray-600">
                                          <span className="font-medium text-blue-600">{dx.diagnostico.codigoCIE10}</span> -
                                          <span className="ml-2">({dx.subclasificacionDiagnosticos.descripcion}) {dx.diagnostico.descripcion}</span>
                                        </li>
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Receta Cabeceras Section */}
                              <div className='w-full md:w-1/3'>
                                {item.recetaCabeceras.filter((rc: any) => rc.idPuntoCarga !== 5).map((rc: any) => (
                                  <div key={rc.idreceta} className="bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{rc.factPuntosCarga?.descripcion} </h3>
                                    {[20, 21, 22, 23].includes(rc.factPuntosCarga?.idPuntoCarga) ? (
                                      <ul className="list-disc list-inside">
                                        {rc.recetaDetalles.map((rd: any) => (
                                          <li className="text-gray-600 flex items-center" key={rd.idItem}>
                                            <a className="hover:text-blue-500 flex items-center" href="http://192.168.50.12:8085/" target="_blank">
                                              <LiaSearchPlusSolid className="mr-2" />
                                              {rd.factCatalogoServicios?.nombre || rd.factCatalogoBienesInsumos?.nombre}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : rc.factPuntosCarga?.idPuntoCarga === 2 ? (
                                      <ul className="list-disc list-inside">
                                          
                                        {rc.recetaDetalles.map((rd: any) => (
                                          <li key={rd.idItem}>
                                          

                                               <ModalGenericoSmall NombBoton={rd.factCatalogoServicios?.nombre} data={item} idproducto={rd?.factCatalogoServicios.idProducto}>
                                                 
                                                  </ModalGenericoSmall>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : rc.factPuntosCarga?.idPuntoCarga === 3 ? (
                                      <ul className="list-disc list-inside">
                                        {rc.recetaDetalles.map((rd: any) => (
                                          <li key={rd.idItem} className="text-gray-600 flex items-center">

                                            {item?.labMovimientoLaboratorios?.some(
                                              (labMovimiento: any) => labMovimiento?.labMovimiento?.idPuntoCarga === 3
                                            ) ? (
                                              <a
                                                className="hover:text-blue-500 flex items-center cursor-pointer"
                                                target="_blank"
                                                href={`${process.env.apireportespatologia}/inicio/reporte_anatopatologia/${item?.labMovimientoLaboratorios[0]?.idMovimiento}`}
                                              >
                                                <LiaSearchPlusSolid className="mr-2" />
                                                {rd.factCatalogoServicios?.nombre || rd.factCatalogoBienesInsumos?.nombre}
                                              </a>
                                            ) : (
                                              <div className="flex items-center">
                                                <LiaSearchPlusSolid className="mr-2" />
                                                {rd.factCatalogoServicios?.nombre || rd.factCatalogoBienesInsumos?.nombre}
                                              </div>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <ul className="list-disc list-inside">
                                        {rc.recetaDetalles.map((rd: any) => (
                                          <li key={rd.idItem}>

                                            <span className="ml-2">
                                              {rd.factCatalogoServicios?.nombre || rd.factCatalogoBienesInsumos?.nombre}

                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Receta Cabeceras - Punto Carga 5 Section */}
                              <div className='w-full md:w-1/3'>
                                {item.recetaCabeceras.filter((rc: any) => rc.idPuntoCarga === 5).map((rc: any) => (
                                  <div key={rc.idreceta} className="bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{rc.factPuntosCarga?.descripcion}</h3>
                                    <ul className="list-disc list-inside">
                                      {rc.recetaDetalles.map((rd: any) => (
                                        <li className="text-gray-600" key={rd.idItem}>
                                          <span className="ml-2">{rd.factCatalogoBienesInsumos?.nombre ? rd.factCatalogoBienesInsumos?.nombre : null}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* Información Adicional Section */}
                              {item.atencionesCE?.citaMotivo && (
                                <div className='bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200 w-full md:w-1/3'>
                                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Información Adicional</h3>
                                  <ul className="list-disc list-inside">
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Motivo :</span>
                                      <span className="ml-2 text-justify">{item?.atencionesCE?.citaMotivo}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Examen Clínico :</span>
                                      <span className="ml-2 text-justify">{item?.atencionesCE?.citaExamenClinico}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Diagnóstico Médico :</span>
                                      <span className="ml-2 text-justify">{item?.atencionesCE?.citaDiagMed}</span>
                                    </li>
                                    <li className="text-gray-600">
                                      <span className="font-medium text-blue-600">Médico :</span>
                                      <span className="ml-2">{item?.atencionesCE?.citaMedico}</span>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}


                    </React.Fragment>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </>
      )}


    </>
  )
}
