'use client'

import { obtenerFechaYHora } from "@/components/utils/obtenerFechaYHora";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
export const Historiaclinica = ({ idcuentaatencion }: any) => {
  const [datosPx, setdatosPx] = useState<any>();


  useEffect(() => {
    getDatosHC(idcuentaatencion)
  }, [idcuentaatencion])
  const getDatosHC = async (idcuentaatencion: any) => {
    const { data } = await axios.get(`${process.env.apiWebOrigenNodeJs}api/reportes/imprimehc/${idcuentaatencion}`);

    setdatosPx(data)
  }

  function obtenerHoraActual() {
    const fecha = new Date();
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const esAM = horas < 12;

    // Convertir formato 24 horas a 12 horas
    horas = horas % 12 || 12;

    // Formatear minutos con dos dígitos
    const minutosFormateados = minutos.toString().padStart(2, "0");

    // Crear el formato final
    const periodo = esAM ? "a. m." : "p. m.";
    return `${horas}:${minutosFormateados} ${periodo}`;
  }
  useEffect(() => {
    console.log("aca")
    if(datosPx){
      window.print();
    }
  
  }, [datosPx])
  
  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  return (
    <>


      <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
        <div className=" w-full max-w-4xl p-6 ">
          {/* Encabezado */}
          <div className="text-center border-b pb-4  flex justify-between">
            <div>
              <Image
                src="/img/loghrhvm.png"
                alt="Logo del hospital"
                width={254}
                height={254}
                className="w-36 h-auto"
              />
            </div>
            <div className="text-xs">
              <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
              <p>JIRÓN HERMINIO VALDIZÁN NÚMERO 600 DISTRITO HUÁNUCO</p>
              <p>TELÉFONO: (062)</p>
            </div>

            <div className="flex flex-col mt-2 text-sm">
              <span>{formattedDate}</span>
              <span> {obtenerHoraActual()}</span>
              <span>Página 1 de 1</span>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-center text-xl font-bold mt-4">
            HOJA DE FILIACIÓN DE PACIENTE
          </h1>

          {/* Información principal */}
          <div className="flex justify-between items-center mt-4 border-b pb-4">
            <div>
              <p className="font-bold">Apellidos Y Nombres</p>
              <p className="text-lg font-bold">{datosPx?.nombrespx}</p>
            </div>
            <div>
              <p className="font-bold">Nro Historia</p>
              <p className="text-lg font-bold">{datosPx?.NroHistoriaClinica}</p>
            </div>
          </div>

          {/* Detalles del paciente */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">



            <table>
              <tbody>
                <tr>
                  <td className="font-bold">Fecha ingreso:</td>
                  <td>{datosPx?.FechaIngreso}</td>
                </tr>
                <tr>
                  <td className="font-bold">Hora ingreso:</td>
                  <td>{datosPx?.HoraIngreso}</td>
                </tr>

                <tr>
                  <td className="font-bold">Consultorio:</td>
                  <td>{datosPx?.servicio}</td>
                </tr>

                <tr>
                  <td className="font-bold">Estado Civil:</td>
             
                  <td>{datosPx?.estadocivil || '-'}</td>
                </tr>

                <tr>
                  <td className="font-bold">Médico:</td>
                  <td>{datosPx?.Medico}</td>
                </tr>

                <tr>
                  <td className="font-bold">Especialidad:</td>
                  <td>{datosPx?.especialidad}</td>
                </tr>

                <tr>
                  <td className="font-bold">Dirección:</td>
                  <td>{datosPx?.direccion}</td>
                </tr>

                <tr>
                  <td className="font-bold">Departamento:</td>
                  <td>{datosPx?.departamento}</td>
                </tr>

                <tr>
                  <td className="font-bold">Distrito:</td>
                  <td>{datosPx?.distrito}</td>
                </tr>
              </tbody>

            </table>
            <table>
              <tbody>
                <tr>
                  <td className="font-bold">Edad (años):</td>
                  <td>{datosPx?.Edad}</td>
                </tr>
                <tr>
                  <td className="font-bold">Fecha nacimiento:</td>
                  <td>{datosPx?.FechaNacimiento}</td>
                </tr>

                <tr>
                  <td className="font-bold">Sexo:</td>
                  <td>{datosPx?.sexo}</td>
                </tr>

                <tr>
                  <td className="font-bold">N° Documento:</td>
                  <td>{datosPx?.NroDocumento}</td>
                </tr>

                <tr>
                  <td className="font-bold">Ocupación:</td>
                  <td>{datosPx?.ocupacion || '-'}</td>
                </tr>

                <tr>
                  <td className="font-bold">Teléfono:</td>
                  <td>{datosPx?.Telefono}</td>
                </tr>

                <tr>
                  <td className="font-bold">Provincia:</td>
                  <td>{datosPx?.provincia}</td>
                </tr>

                <tr>
                  <td className="font-bold">Departamento:</td>
                  <td>{datosPx?.departamento}</td>
                </tr>

                <tr>
                  <td className="font-bold">Centro Poblado:</td>
                  <td>{datosPx?.centropoblado || '-'}</td>
                </tr>

              </tbody>

            </table>
          </div>


          {/* Datos Adicionales */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm border-t-2">



            <table>
              <tbody>
                <tr>
                  <td className="font-bold" colSpan={2}>Datos de Procedencia</td>

                </tr>
                <tr>
                  <td className="font-bold">Departamento:</td>
                  <td>{datosPx?.departamentoProcedencia  || '-'}</td>
                </tr>

                <tr>
                  <td className="font-bold">Provincia:</td>
                  <td>{datosPx?.provinciaProcedencia  || '-'}</td>
                </tr>

                <tr>
                  <td className="font-bold">Distrito:</td>
                  <td>{datosPx?.DistritoProcedencia || '-'}</td>
                </tr>

                <tr>
                  <td className="font-bold">Centro Poblado:</td>
                  <td>{datosPx?.centropobladoproc || '-'}</td>
                </tr>
              </tbody>


            </table>
            <table>
              <tbody>
                <tr>
                  <td className="font-bold" colSpan={2}>Datos de Nacimiento</td>
                </tr>
                <tr>
                  <td className="font-bold">Departamento:</td>
                  <td>{datosPx?.departamentoNacimiento}</td>
                </tr>
                <tr>
                  <td className="font-bold">Provincia:</td>
                  <td>{datosPx?.provinciaNacimiento}</td>
                </tr>
                <tr>
                  <td className="font-bold">Distrito:</td>
                  <td>{datosPx?.distritoNacimiento}</td>
                </tr>
                <tr>
                  <td className="font-bold">Centro Poblado:</td>
                  <td>{datosPx?.centropobladonac || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm border-t-2">
            <table>
              <tbody>
                <tr>
                  <td className="font-bold">Nº Cuenta</td>
                  <td>{datosPx?.IdCuentaAtencion}</td>
                </tr>
              </tbody>

            </table>
            <table>
              <tbody>
                <tr>
                  <td className="font-bold">Nº Orden Pago</td>
                  <td>{datosPx?.idOrdenPago || '-'}</td>
                </tr>
              </tbody>

            </table>
          </div>


        </div>
      </div>


    </>
  )
}
