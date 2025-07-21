'use client'
import React, { useEffect, useState } from 'react'
import { getData } from "@/components/helper/axiosHelper";
import Image from 'next/image';

export const RecetasOrdenesFarmacia = ({ idcuentaatencion }: any) => {
    const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
    const [datosAtencion, setdatosAtencion] = useState<any>([]);
    const [datos, setdatos] = useState<any>([]);

    useEffect(() => {
        if (idcuentaatencion) {
            getDatosHC(idcuentaatencion)
            getdatosAtencion(idcuentaatencion)
        }
    }, [idcuentaatencion])
    const getDatosHC = async (idcuenta: any) => {
        const response = await getData(`${process.env.apijimmynew}/atenciones/${idcuenta}`);
        setdatosPxGeneral(response)
    }
    const getdatosAtencion = async (idcuenta: any) => {
        const datosAtencion = await getData(`${process.env.apijimmynew}/atenciones/findByIdCuentaAtencion/${idcuenta}`);
        setdatosAtencion(datosAtencion)
    }

    const getDatosFarmacia = async (idcuenta: any) => {
        const datos = await getData(`${process.env.apijimmynew}/recetas/apiordenesfarmaciabycuenta/${idcuenta}`);
        setdatos(datos)
    }
    useEffect(() => {
        if (datosAtencion?.idCuentaAtencion) {
            getDatosFarmacia(datosAtencion?.idCuentaAtencion)
        }
    }, [datosAtencion?.idCuentaAtencion])

    useEffect(() => {
        console.log(datos[0]?.idReceta)
        if (datos[0]?.idReceta) {
            // window.print()
        }
    }, [datos])


    return (
        <div className={`flex justify-center print-page-break scale-[0.9]`}>
            <div className='grid grid-cols-2 gap-1 items-start'>
                {/* primer componente*/}
                <div className="p-6 border border-black flex flex-col justify-between min-h-[650px] w-full">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <Image
                                        src="/img/loghrhvm.png"
                                        alt="Logo del hospital"
                                        width={80}
                                        height={80}
                                        className="w-30 h-auto"
                                    />
                                </td>
                                <td className='text-xs'>
                                    <div className='text-center'>
                                        <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
                                        <p>RUC: 20146038329</p>
                                        <p>JIRÓN HERMILIO VALDIZAN NÚMERO 950 DISTRITO HUÁNUCO</p>
                                        <p>TELÉFONO: (062)</p>
                                    </div>
                                </td>
                                <td>
                                    <table className='border-collapse text-xs'>
                                        <tbody>
                                            <tr>
                                                <td className='border border-black text-center'> N° de Receta </td>
                                            </tr>
                                            <tr>
                                                <td className='border border-black text-center'> {datos[0]?.idReceta}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                    {/* Encabezado */}


                    <div className="text-center font-bold">RECETA MÉDICA</div>

                    <div className="text-xs w-full ">
                        <span className='font-bold'>
                            F. Atencion:
                        </span>
                        <span className='ml-1'>
                            {datosPxGeneral?.FechaIngreso}
                        </span>

                    </div>
                    <div className='w-full mt-1'>
                        <table className='w-full'>
                            <tbody className='text-xs'>
                                <tr>
                                    <td className='font-bold'>Paciente</td>
                                    <td className='border border-black'>{datosPxGeneral?.nombreCompleto} </td>
                                    <td className='font-bold'>N° H.C:</td>
                                    <td className='border border-black text-center'>{datosPxGeneral?.NroHistoriaClinica}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className='w-full mt-1'>
                        <table className='w-full'>
                            <tbody className='text-xs'>
                                <tr>
                                    <td className='font-bold'>Tipo Financ:</td>
                                    <td className='border border-black'>{datosPxGeneral?.FuentesFinanciamiento}</td>
                                    <td className='font-bold'>Edad:</td>
                                    <td className='border border-black'>{datosPxGeneral?.edad} años</td>
                                    <td className='font-bold'> N° Cuenta:</td>
                                    <td className='border border-black text-center'>{datosPxGeneral?.idCuentaAtencion}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='w-full mt-1'>
                        <table className='w-full'>
                            <tbody className='text-xs'>
                                <tr>
                                    <td className='border border-black w-1/2 text-center' >  {datosPxGeneral?.AfiliacionDisa} {datosPxGeneral?.AfiliacionTipoFormato} {datosPxGeneral?.AfiliacionNroFormato} </td>
                                    <td> Especialidad:</td>
                                    <td className='border border-black'>{datosPxGeneral?.espnom}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='w-full mt-1'>
                        <table className='w-full'>
                            <tbody className='text-xs'>
                                <tr>
                                    <td>Serv.:</td>
                                    <td className='border border-black'>{datosPxGeneral?.tiposervicio} </td>
                                    <td>Consultorio:</td>
                                    <td className='border border-black'>{datosPxGeneral?.servnom}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>




                    <div className='mt-2 font-semibold'>
                        DIAGNOSTICOS
                    </div>
                    <table className="w-full text-xs ">
                        <thead className="border-b border-t border-black">
                            <tr>
                                <th className="text-left">TIPO</th>
                                <th>CIE 10</th>
                                <th >DESCRIPCION</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {datosAtencion?.atencionesDiagnosticos?.length > 0 &&
                                datosAtencion.atencionesDiagnosticos.map((data: any, index: number) => (
                                    <tr key={data?.diagnostico?.codigoCIE10 || index}>
                                        <td>{data?.subclasificacionDiagnosticos?.descripcion}</td>
                                        <td>{data?.diagnostico?.codigoCIE10}</td>
                                        <td>{data?.diagnostico?.descripcion}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>





                    <table className="w-full mt-7">
                        <thead className="border-b border-t border-black">
                            <tr>
                                <th className="text-left">Medicamento o Insumo</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {datos.map((item: any) => (
                                <tr key={item.idReceta + item.Nombre}>
                                    <td className=' text-[10px]'>{item.Nombre}</td>
                                    <td className=' text-[10px] text-center'>{item.CantidadPedida}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-xs mt-44 text-right">
                        <span className='border-t border-black pl-2 pr-2'>
                            {datosPxGeneral?.MedicoPaterno} {datosPxGeneral?.MedicoMaterno} {datosPxGeneral?.MedicoNombres}
                        </span>
                    </div>
                </div>


                {/* segundo componente*/}
                <div className="p-6 border border-black flex flex-col justify-between min-h-[650px]  w-full">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <Image
                                        src="/img/loghrhvm.png"
                                        alt="Logo del hospital"
                                        width={80}
                                        height={80}
                                        className="w-30 h-auto"
                                    />
                                </td>
                                <td className='text-xs'>
                                    <div className='text-center'>
                                        <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
                                        <p>RUC: 20146038329</p>
                                        <p>JIRÓN HERMILIO VALDIZAN NÚMERO 950 DISTRITO HUÁNUCO</p>
                                        <p>TELÉFONO: (062)</p>
                                    </div>
                                </td>
                                <td>
                                    <table className='border-collapse text-xs'>
                                        <tbody>
                                            <tr>
                                                <td className='border border-black text-center'> N° de Receta </td>
                                            </tr>
                                            <tr>
                                                <td className='border border-black text-center'> {datos[0]?.idReceta}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                    {/* Encabezado */}


                    <div className="text-center font-bold">RECETA MÉDICA</div>

                    <div className="text-xs w-full ">
                        <span className='font-bold'>
                            F. Atencion:
                        </span>
                        <span className='ml-1'>
                            {datosPxGeneral?.FechaIngreso}
                        </span>

                    </div>
                    <div className='w-full mt-1'>
                        <table className='w-full'>
                            <tbody className='text-xs'>
                                <tr>
                                    <td className='font-bold'>Paciente</td>
                                    <td className='border border-black'>{datosPxGeneral?.nombreCompleto} </td>
                                    <td className='font-bold'>N° H.C:</td>
                                    <td className='border border-black text-center'>{datosPxGeneral?.NroHistoriaClinica}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <table className="w-full mt-7">
                        <thead className="border-b border-t border-black">
                            <tr>
                                <th className="text-left text-[10px]">Medicamento o Insumo</th>
                                <th className="text-[10px]">Via</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((item: any) => (
                                <React.Fragment key={item.idReceta + item.Nombre}>
                                    <tr className="border-b">
                                        <td className="p-1 text-[10px]">{item.Nombre}</td>
                                        <td className="p-1 text-[10px]">{item.viaadministracion}</td>
                                    </tr>
                                    {item.observaciones && (
                                        <tr className="bg-gray-100">
                                            <td colSpan={2} className="p-1 text-[10px] text-gray-700 italic">
                                                Frecuencia: {item.observaciones}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-xs mt-44 text-right">
                        <span className='border-t border-black pl-2 pr-2'>
                            {datosPxGeneral?.MedicoPaterno} {datosPxGeneral?.MedicoMaterno} {datosPxGeneral?.MedicoNombres}
                        </span>

                    </div>

                </div>

            </div>


        </div>
    )
}
