'use client'

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import axios from 'axios';
import { obtenerFechaYHora } from '@/components/utils/obtenerFechaYHora';
import { getData } from '@/components/helper/axiosHelper';
import { RecetaCabecera } from '../../../interfaces/RecetaCabezeraI';
import { SeccionOrdenes } from './SeccionOrdenes';
// @ts-ignore
import html2pdf from "html2pdf.js"
export const HojaAtencion = ({ idcuentaatencion }: any) => {

  const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
  const [datosAtencion, setdatosAtencion] = useState<any>([]);
  const [datosFarmacia, setdatosFarmacia] = useState<any>([]);
  const [datosRayosX, setdatosRayosX] = useState<any>([]);
  const [datosTomografia, setdatosTomografia] = useState<any>([]);
  const [datosEcografia, setdatosEcografia] = useState<any>([]);
  const [datosEcografiaObstetrica, setdatosEcografiaObstetrica] = useState<any>([]);
  const [datosAnatomiaPatologica, setdatosAnatomiaPatologica] = useState<any>([]);
  const [datosPatologicaClinica, setdatosPatologicaClinica] = useState<any>([]);
  const [datosBancoSangre, setdatosBancoSangre] = useState<any>([]);
  const [datosProcedimientosFuera, setdatosProcedimientosFuera] = useState<any>([]);
  const [datosProcedimientosDentro, setdatosProcedimientosDentro] = useState<any>([]);
  const [datosInterconsulta, setdatosInterconsulta] = useState<any>([]);


  const [flagFarmacia, setflagFarmacia] = useState<boolean>(false);
  const [flagOrders, setflagOrders] = useState<boolean>(false);
  const [flagDatosAtencion, setflagDatosAtencion] = useState<boolean>(false);
  const [flagDatosPx, setflagDatosPx] = useState<boolean>(false);
  const [flagProcedimientosFuera, setflagProcedimientosFuera] = useState<boolean>(false);
  const [flagProcedimientosDentro, setflagProcedimientosDentro] = useState<boolean>(false);
  let printed = false;



  useEffect(() => {
    if (
      flagFarmacia &&
      flagOrders &&
      flagDatosAtencion &&
      flagDatosPx &&
      flagProcedimientosFuera &&
      flagProcedimientosDentro
    ) {
      window.print();
    }
  }, [
    flagFarmacia,
    flagOrders,
    flagDatosAtencion,
    flagDatosPx,
    flagProcedimientosFuera,
    flagProcedimientosDentro
  ]);

  useEffect(() => {
    getDatosHC(idcuentaatencion)
  }, [idcuentaatencion])
  const getDatosHC = async (idcuentaatencion: any) => {
    const response = await getData(`${process.env.apijimmynew}/atenciones/${idcuentaatencion}`);
    setdatosPxGeneral(response)
    setflagDatosPx(true)
  }

  const getdatosAtencion = async (idatencion: any) => {
    const datosAtencion = await getData(`${process.env.apijimmynew}/atenciones/findByIdCuentaAtencion/${idcuentaatencion}`);
    setdatosAtencion(datosAtencion)
    setflagDatosAtencion(true)
  }

  const getdatosprocdentro = async (idcuenta: any) => {
    const datosprocdentro = await getData(`${process.env.apijimmynew}/recetas/ApiProcedimientosRealizadosDentroByIdCuenta/${idcuenta}`)
    setdatosProcedimientosDentro(datosprocdentro)
    setflagProcedimientosDentro(true)
  }

  function obtenerHoraActual() {
    const fecha = new Date();
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const esAM = horas < 12;
    horas = horas % 12 || 12;
    const minutosFormateados = minutos.toString().padStart(2, "0");
    const periodo = esAM ? "a. m." : "p. m.";
    return `${horas}:${minutosFormateados} ${periodo}`;
  }
  useEffect(() => {
    if (datosPxGeneral) {
      //window.print();
    }

  }, [datosPxGeneral])

  const getMedicamentosbyIdRecetaCabeceraFarmacia = async (idcuenta: number) => {
    try {
      const data = await getData(`${process.env.apijimmynew}/recetas/apiordenesfarmaciabycuenta/${idcuenta}`)
      setdatosFarmacia(data);
      setflagFarmacia(true);
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    if (idcuentaatencion) {
      getMedicamentosbyIdRecetaCabeceraFarmacia(idcuentaatencion)
    }
  }, [idcuentaatencion])


  const otrosProc = async () => {
    const data = await getData(`${process.env.apijimmynew}/api/solicitud-procedimientos/procedimientos/${idcuentaatencion}`)
    setdatosProcedimientosFuera(data)
    setflagProcedimientosFuera(true)
  }
  useEffect(() => {
    if (datosAtencion?.idAtencion) {
      otrosProc();

    }
  }, [datosAtencion])


  useEffect(() => {
    if (datosPxGeneral?.idAtencion) {
      getdatosAtencion(datosPxGeneral?.idAtencion)
      getListadoInterconsulta(datosPxGeneral?.idAtencion)
    }
  }, [datosPxGeneral?.idAtencion])

  const getListadoInterconsulta = async (idatencion: any) => {
    const data = await getData(`${process.env.apijimmynew}/atenciones/interconsulta/${idatencion}`)
    setdatosInterconsulta(data)
  }

  const getLaboratorioByCuenta = async (idcuenta: any) => {
    const data = await getData(`${process.env.apijimmynew}/recetas/apiordenesmedicasbycuenta/${idcuenta}`)
    setdatosPatologicaClinica(data.filter((data: any) => data.IdPuntoCarga == 2))
    setdatosAnatomiaPatologica(data.filter((data: any) => data.IdPuntoCarga == 3))
    setdatosBancoSangre(data.filter((data: any) => data.IdPuntoCarga == 11))
    setdatosRayosX(data.filter((data: any) => data.IdPuntoCarga == 21))
    setdatosTomografia(data.filter((data: any) => data.IdPuntoCarga == 22))
    setdatosEcografia(data.filter((data: any) => data.IdPuntoCarga == 20))
    setdatosEcografiaObstetrica(data.filter((data: any) => data.IdPuntoCarga == 23))
    setflagOrders(true)
  }

  useEffect(() => {
    if (idcuentaatencion) {
      getdatosprocdentro(idcuentaatencion)
      getLaboratorioByCuenta(idcuentaatencion)
    }

  }, [idcuentaatencion])

const handleFirmarPDF = async () => {
  const element = document.getElementById('hoja-atencion');
  if (!element) return;

  const opt = {
    margin: 0,
    filename: `${idcuentaatencion}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const worker = html2pdf().set(opt).from(element);
  const blob = await worker.outputPdf('blob');

  const tempForm = new FormData();
  tempForm.append('file', blob, `${idcuentaatencion}.pdf`);

  // 1. Enviar el PDF al backend
  const uploadResp = await fetch(`${process.env.apifirma}/api/upload-temp`, {
    method: 'POST',
    body: tempForm,
  });

  const { tempUrl, param_token } = await uploadResp.json();
  console.log("*****************")
  console.log(tempUrl)
  console.log(param_token)
console.log("*****************")
  // 2. Llamar a /api/param con la URL dinámica
  const paramResp = await fetch(`${process.env.apifirma}/api/param`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ param_token, tempUrl }),
  });

  const base64 = await paramResp.text();
  console.log("Firma base64:", base64);
};


  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  return (
<>

<div className="  min-h-screen flex justify-center scale-[0.9] origin-top bg-white" id='hoja-atencion'>
<pre>
  {JSON.stringify(datosAtencion,null,2)}
</pre>
      <div className=" w-full max-w-4xl p-6 ">
        {/* Encabezado */}
        <div className="text-center border-b pb-2  flex justify-between">
          <div className='h-1'>
            <Image
              src="/img/loghrhvm.png"
              alt="Logo del hospital"
              width={60}
              height={60}
              className="w-20 h-auto"
            />
          </div>
          <div className="text-xs">
            <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
            <p>JIRÓN HERMILIO VALDIZAN NÚMERO 950 DISTRITO HUANUCO</p>
            <p>TELÉFONO: (062)</p>
          </div>

          <div className="flex flex-col mt-2 text-xs">
            <span>{formattedDate}</span>
            <span> {obtenerHoraActual()}</span>
            <span>Página 1 de 1</span>
          </div>
        </div>
        <h1 className="text-center text-base font-bold mt-1">
          Detalle de Atención médica del Paciente
        </h1>
        <div className=" justify-between items-center mt-1 pb-1 text-sm w-full grid-cols-1">
          {/* Datos generales */}
          <table className='border border-black w-full text-xs '>
            <tbody>
              <tr>
                <td className='align-top font-bold'>Médico:</td>
                <td>{datosPxGeneral?.MedicoPaterno} {datosPxGeneral?.MedicoMaterno} {datosPxGeneral?.MedicoNombres}
                  &nbsp;  Colegiatura: {datosPxGeneral?.MedicoColegitura}  RNE: {datosPxGeneral?.Medicorne}</td>
                <td className='align-top font-bold'>Fecha Consulta:</td>
                <td>{datosPxGeneral?.FechaIngreso}</td>
              </tr>
              <tr>
                <td className='align-top font-bold'>Paciente:</td>
                <td>({datosPxGeneral?.nroDocumento}) {datosPxGeneral?.nombreCompleto} (Edad: {datosPxGeneral?.triajeEdad} Años) ({datosPxGeneral?.FuentesFinanciamiento})</td>
                <td className='align-top font-bold'>Hora Atención:</td>
                <td>{datosPxGeneral?.HoraEgreso}</td>
              </tr>
              <tr>
                <td className='align-top font-bold'>Consultorio:</td>
                <td>{datosPxGeneral?.servnom}</td>
                <td className='align-top font-bold'>N° Cuenta:</td>
                <td>{datosPxGeneral?.idCuentaAtencion}</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td className='align-top font-bold'>Fecha Proxima:</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Triaje */}
          <table className='border w-full mt-1 text-xs  border-black'>
            <tbody>
              <tr>
                <td className='align-top font-bold w-1/4'>P.Arterial:</td>
                <td className='w-1/4'>
                  {datosPxGeneral?.triajePresion && (
                    <>
                      {datosPxGeneral?.triajePresion} Sistólica/Diastólica
                    </>
                  )}
                </td>
                <td className='align-top font-bold w-1/4'>Talla:</td>
                <td className='w-1/4'>
                  {datosPxGeneral?.triajeTalla && (<>
                    {datosPxGeneral?.triajeTalla} cm
                  </>)}
                </td>
              </tr>
              <tr>
                <td className='align-top font-bold'>Temperatura:</td>
                <td>
                  {datosPxGeneral?.triajeTemperatura && <>
                  {datosPxGeneral?.triajeTemperatura} °C
                  </>}
                  </td>
                <td className='align-top font-bold'>Peso: </td>
                <td>
                {datosPxGeneral?.triajePeso}
                </td>
              </tr>
              <tr>
                <td className='align-top font-bold'>F.Cardiaca:</td>
                <td>
                  {datosPxGeneral?.triajeFrecCardiaca && (<>
                  {datosPxGeneral?.triajeFrecCardiaca} rpm.
                  </>)}
                  </td>
                <td className='align-top font-bold'>F.Respiratoria:</td>
                <td>{datosPxGeneral?.TriajeFrecRespiratoria} rpm.</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td className='align-top font-bold'>IMC:</td>
                <td> {(() => {
                  const tallaCm = datosPxGeneral?.triajeTalla;
                  const peso = datosPxGeneral?.triajePeso;

                  if (tallaCm && peso) {
                    const tallaM = tallaCm / 100;
                    const imc = peso / (tallaM * tallaM);
                    return imc.toFixed(2); // Redondea a 2 decimales
                  } else {
                    return '';
                  }
                })()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Antecedentes Personales */}
        <table className="border border-black col-span-2  text-xs w-full">
          <thead>
            <tr>
              <th className="border-black border-b text-left" colSpan={2}>
                Antecedentes Personales
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="w-1/5 align-top font-bold">Quirúrgico :</td>
              <td className="align-top">{datosPxGeneral?.antecedQuirurgico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top font-bold">Patológico :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedPatologico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top font-bold">Alergias :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedAlergico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top font-bold">Obstétricos :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedObstetrico}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="align-top font-bold">Otros :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedentes}</td>
            </tr>
            <tr className="border-b border-black">
              <td className="align-top font-bold">Ant. Familiares :</td>
              <td className="align-top text-justify">{datosPxGeneral?.antecedFamiliar}</td>
            </tr>
          </tbody>
        </table>
        {/* Motivo Consulta */}
        <table className='border border-black col-span-2  mt-2 text-xs w-full'>
          <tbody>
            <tr className='border-b border-gray-100'>
              <td className='w-1/5 align-top font-bold'>
                Motivo de Consulta  :
              </td>
              <td className='align-top text-justify'>
                {datosPxGeneral?.CitaMotivo}
              </td>
            </tr>
            <tr className='border-b border-gray-100 '>
              <td className='align-top text-justify font-bold'>
                Exámen Clínico :
              </td>
              <td>
                {datosPxGeneral?.CitaExamenClinico}
              </td>
            </tr>
            <tr>
              <td className='align-top text-justify font-bold'>
                Diagnóstico CIE 10  :
              </td>
              <td>
                {
                  datosAtencion?.atencionesDiagnosticos && datosAtencion.atencionesDiagnosticos.length > 0 ? (
                    datosAtencion.atencionesDiagnosticos.map((data: any, index: number) => (
                      <span key={data?.idDiagnostico}>
                        
                        ({data?.diagnostico?.codigoCIE10} - {data?.subclasificacionDiagnosticos?.codigo} - {data?.diagnostico?.descripcion})
                        {index < datosAtencion.atencionesDiagnosticos.length - 1 && ', '}
                      </span>
                    ))
                  ) : (
                    <></>
                  )
                }
              </td>
            </tr>
            <tr>
              <td className='align-top font-bold'>
                Tratamiento :
              </td>
              <td className='align-top'>
                <hr className="border-t-2 border-gray-400 border-dashed my-2" />
                {datosFarmacia[0]?.Descripcion && datosFarmacia[0]?.idReceta && (
                  <>
                    ({datosFarmacia[0].Descripcion}) (N° Receta: {datosFarmacia[0].idReceta})
                  </>
                )}
                {
                  datosFarmacia.map((item: any) => (
                    <div key={item.IdProducto}>
                      - {item?.Nombre} ( {item?.CantidadPedida})
                    </div>
                  ))
                }
              </td>
            </tr>
            <tr>
              <td className='align-top font-bold'>
                Ord.Médicas  :
              </td>
              <td>
                <SeccionOrdenes datos={datosAnatomiaPatologica} />
                <SeccionOrdenes datos={datosPatologicaClinica} />
                <SeccionOrdenes datos={datosBancoSangre} />
                <SeccionOrdenes datos={datosRayosX} />
                <SeccionOrdenes datos={datosTomografia} />
                <SeccionOrdenes datos={datosEcografia} />
                <SeccionOrdenes datos={datosEcografiaObstetrica} />
              </td>
            </tr>
            <tr>
              <td className='align-top font-bold'>
                Procedimientos :
              </td>
              <td>
                {
                  datosProcedimientosDentro.map((item: any, index: number) => (
                    <span key={item.IdProducto}>
                      {item?.Nombre} ({item?.Cantidad})
                      {index < datosProcedimientosDentro.length - 1 && ', '}
                    </span>
                  ))
                }
              </td>
            </tr>
            <tr>
              <td className='align-top font-bold'>
                Otros Procedimientos :
              </td>
              <td>
                {
                  datosProcedimientosFuera.map((item: any, index: number) => (
                    <span key={item.idSolicitudProc}>
                      {item?.factCatalogoServicios?.nombre} ({item?.cantidad})
                      {index < datosProcedimientosFuera.length - 1 && ', '}
                    </span>
                  ))
                }
              </td>
            </tr>
            <tr>
              <td className='align-top font-bold'>
                Interconsultas :
              </td>
              <td>
                {
                  datosInterconsulta.map((item: any, index: number) => (
                    <span key={item.idsolicitudespecialidad}>
                      [
                      {item?.Descripcion} {item?.Diagnostico} {item?.motivo}
                      ]
                      {index < datosInterconsulta.length - 1 && ', '}
                    </span>
                  ))
                }
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

</>
    
  )
}
