'use client'
import './fua.css'
import React, { useEffect, useState } from 'react'
import { getData } from "@/components/helper/axiosHelper";
import { HiX } from 'react-icons/hi';
import Image from 'next/image';

export const Fua = ({ idcuentaatencion }: any) => {
    const [sisFuaAtencion, setSisFuaAtencion] = useState<any>();
    const [sisFuaAtencionDIA, setSisFuaAtencionDIA] = useState<any[]>([]);
    const [sisFuaAtencionMED, setSisFuaAtencionMED] = useState<any[]>([]);
    const [sisFuaAtencionINS, setsisFuaAtencionINS] = useState<any[]>([]);
    const [sisFuaAtencionPRO, setSisFuaAtencionPRO] = useState<any[]>([]);
    const [loadingFua, setLoadingFua] = useState(false);
    const getFuaAtencion = async (idcuenta: any) => {
        setLoadingFua(true);
        const fuadatosgenerales = await getData(`${process.env.apijimmynew}/fua/SisFuaAtencionSeleccionarPorId/${idcuenta}`)
        setSisFuaAtencion(fuadatosgenerales)
        const fuadiag = await getData(`${process.env.apijimmynew}/fua/SisFuaAtencionDIAbyIdCuentaAtencion/${idcuenta}`)
        setSisFuaAtencionDIA(fuadiag);
        const fuamed = await getData(`${process.env.apijimmynew}/fua/apiSisFuaAtencionMEDbyIdCuentaAtencion/${idcuenta}`)
        setSisFuaAtencionMED(fuamed)
        const fuains = await getData(`${process.env.apijimmynew}/fua/apiSisFuaAtencionINSbyIdCuenta/${idcuenta}`)
        setsisFuaAtencionINS(fuains)
        const fuaprod = await getData(`${process.env.apijimmynew}/fua/apiSisFuaAtencionPRObyIdCuenta/${idcuenta}`)
        setSisFuaAtencionPRO(fuaprod)
        setLoadingFua(false);
    }



    useEffect(() => {
        if (idcuentaatencion) {
            getFuaAtencion(idcuentaatencion)
        }
    }, [idcuentaatencion])

    useEffect(() => {
        if (
            !loadingFua &&
            sisFuaAtencion &&
            sisFuaAtencionDIA.length > 0 &&
            sisFuaAtencionMED !== undefined &&
            sisFuaAtencionINS !== undefined &&
            sisFuaAtencionPRO !== undefined
        ) {
            setTimeout(() => {
                 window.print();
            }, 500); // opcional: pequeño retraso para asegurar el render
        }
    }, [
        loadingFua,
        sisFuaAtencion,
        sisFuaAtencionDIA,
        sisFuaAtencionMED,
        sisFuaAtencionINS,
        sisFuaAtencionPRO,
    ]);




    return (
        <>

            <div className="flex justify-center print-page-break bg-white ">
                <table className="w-full" style={{
                    transform: 'scale(0.8)', // Ajusta este valor según necesidad (0.7 a 0.9)
                    transformOrigin: 'top center',
                    width: '133%' // Compensa la reducción de escala
                }}>
                    <tbody>
                        <tr>
                            <td >
                                <table className='w-full'>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className=' grid grid-cols-4 w-full border border-black'>
                                                    <Image
                                                        src="/img/logofua.png"
                                                        alt="Logo del hospital"
                                                        width={254}
                                                        height={254}
                                                        className="w-80 h-auto col-span-2 p-1"
                                                    />
                                                    <span className='font-semibold'>ANEXO 1</span>
                                                    <span className="text-xs text-center self-end">Cta: {idcuentaatencion} (Cons.Ext)</span>
                                                </div>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td >
                                <div className='border border-red-900'>

                              
                                <table className='w-full border border-black border-collapse' style={{ fontSize: '11px' }}>
                                    <tbody >
                                        <tr>
                                       
                                            <td colSpan={9} className='bg-customGray border border-black px-2 font-semibold text-center'> FORMATO ÚNICO DE ATENCIÓN - FUA </td>
                                        </tr>
                                        <tr>
                                                 <td rowSpan={2} className='w-3'></td>
                                            <td className='w-2/5 text-center border border-black bg-customGray' colSpan={3}>NÚMERO DE FORMATO </td>
                                            <td rowSpan={2} className='text-center border border-black  w-12'></td>

                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className='border border-black text-center font-bold text-lg'>00000754</td>
                                            <td rowSpan={2} className='border border-black text-center font-bold text-lg'>{sisFuaAtencion?.FuaLote}</td>
                                            <td rowSpan={2} className='border border-black text-center font-bold text-lg'>{sisFuaAtencion?.FuaNumero}</td>

                                        </tr>

                                    </tbody>
                                </table>
                                  </div>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <table className='w-full border border-black border-collapse' style={{ fontSize: '8px' }}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={10} className='text-center border border-black  bg-customGray font-semibold '>DE LA INSTITUCIÓN PRESTADORA DE SERVICIOS DE SALUD</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='bg-customGray border border-black px-2 font-semibold text-center'  >CÓDIGO RENAES DE LA IPRESS </td>
                                            <td colSpan={7} className='bg-customGray border border-black px-2 font-semibold text-center'>NOMBRE DE LA IPRESS QUE REALIZA LA ATENCIÓN</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='border border-black px-2 text-center'>

                                                {sisFuaAtencion?.EstablecimientoCodigoRenaes}


                                            </td>
                                            <td colSpan={7} className='border border-black px-2 text-center'>HOSPITAL REGIONAL HERMILIO VALDIZAN</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='bg-customGray border border-black text-center font-semibold' >PERSONAL QUE ATIENDE</td>
                                            <td colSpan={2} className='bg-customGray border border-black text-center font-semibold'>LUGAR DE ATENCIÓN</td>
                                            <td colSpan={2} className='bg-customGray border border-black text-center font-semibold'>ATENCIÓN</td>
                                            <td colSpan={3} className='bg-customGray border border-black text-center font-semibold'>REFERENCIA REALIZADA POR</td>
                                        </tr>
                                        <tr>
                                            {/*personal que atiende*/}
                                            <td className='bg-customGray border border-black px-2'>DE LA IPRESS</td>
                                            <td className='border border-black text-center'>X</td>
                                            <td className='bg-customGray border border-black px-2'>CÓDIGO DE LA OFERTA FLEXIBLE</td>
                                            {/*personal que atiende*/}
                                            {/*LUGAR DE ATENCIÓN*/}
                                            <td className='bg-customGray border border-black px-2'> INTRAMURAL</td>
                                            <td className='w-4 text-center' >X</td>
                                            {/*LUGAR DE ATENCIÓN*/}
                                            {/*ATENCIÓN*/}
                                            <td className='bg-customGray border border-black px-2'>AMBULATORIA</td>
                                            <td className='w-4'> </td>
                                            {/*ATENCIÓN*/}
                                            {/*REFERENCIA REALIZADA POR*/}
                                            <td className='bg-customGray border border-black text-center'>CÓD. RENAES</td>
                                            <td className='bg-customGray border border-black text-center'>NOMBRE DE LA IPRESS U OFERTA FLEXIBLE</td>
                                            <td className='bg-customGray border border-black text-center'>N° HOJA DE REFERENCIA</td>
                                            {/*REFERENCIA REALIZADA POR*/}
                                        </tr>
                                        <tr>
                                            {/*personal que atiende*/}
                                            <td className='bg-customGray border border-black px-2'>ITINERANTE</td>
                                            <td className='w-4 border border-black'></td>
                                            <td className=' border-black border px-2 text-center' rowSpan={2}></td>
                                            {/*personal que atiende*/}
                                            {/*LUGAR DE ATENCIÓN*/}
                                            <td className='bg-customGray border border-black px-2'> EXTRAMURAL</td>
                                            <td className='w-4 text-center border border-black ' ></td>
                                            {/*LUGAR DE ATENCIÓN*/}
                                            {/*ATENCIÓN*/}
                                            <td className='bg-customGray border border-black px-2'>REFERENCIA</td>
                                            <td className='w-4 border border-black text-center'>X </td>
                                            {/*ATENCIÓN*/}
                                            {/*REFERENCIA REALIZADA POR*/}
                                            <td className='border border-black text-center' rowSpan={2}>{sisFuaAtencion?.FuaReferidoOrigenCodigoRenaes}</td>
                                            <td className='border border-black text-center' rowSpan={2}>{sisFuaAtencion?.Nombre}</td>
                                            <td className='border border-black text-center' rowSpan={2}>{sisFuaAtencion?.FuaReferidoOrigenNreferencia}</td>
                                            {/*REFERENCIA REALIZADA POR*/}
                                        </tr>
                                        <tr>
                                            {/*personal que atiende*/}
                                            <td className='bg-customGray border border-black px-2'>OFERTA FLEXIBLE</td>
                                            <td className='w-4'></td>
                                            {/*personal que atiende*/}

                                            {/*LUGAR DE ATENCIÓN*/}
                                            <td className=' border border-black px-2' colSpan={2}> </td>

                                            {/*LUGAR DE ATENCIÓN*/}

                                            {/*ATENCIÓN*/}
                                            <td className='bg-customGray border border-black px-2'>EMERGENCIA</td>
                                            <td className='w-4 border border-black text-center'></td>
                                            {/*ATENCIÓN*/}
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='w-full  grid grid-cols-4  border  border-black' style={{ fontSize: '8px' }}>

                                    <div className=' bg-customGray text-center font-semibold col-span-4   border-b mb-1  border-black' >
                                        DEL ASEGURADO / USUARIO
                                    </div>

                                    <div className='col-span-1 mr-1 '>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-customGray text-center font-semibold   border border-black' colSpan={2}>IDENTIFICACIÓN</td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-customGray text-center border border-black w-4'>TDI</td>
                                                    <td className=' bg-customGray text-center border border-black'>N° DOCUMENTO DE IDENTIDAD</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black  w-4'>{sisFuaAtencion?.AfiliacionTipoFormato}</td>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.DocumentoNumero}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='col-span-1 mr-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-customGray text-center font-semibold  border border-black' colSpan={3}>CÓDIGO DEL ASEGURADO SIS</td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-customGray text-center border border-black'>DIRESA  / OTROS</td>
                                                    <td className=' bg-customGray text-center border border-black' colSpan={2}>NÚMERO</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.AfiliacionDisa}</td>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.AfiliacionTipoFormato}</td>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.AfiliacionNroFormato}</td>
                                                </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                    <div className='col-span-2'>
                                        <table className='w-full' style={{ fontSize: '8px' }}>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-customGray text-center font-semibold  border border-black' colSpan={2}>ASEGURADO DE OTRA IAFAS</td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-customGray w-20 text-center  border border-black'>INSTITUCIÓN</td>
                                                    <td className='  text-center border border-black'></td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-customGray text-center  border border-black'>COD. SEGURO</td>
                                                    <td className=' text-center border border-black'></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='col-span-2 mt-1 mr-1'>
                                        <table className='w-full' style={{ fontSize: '8px' }}>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-customGray text-center border border-black'>APELLIDO PATERNO</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.Apaterno}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='col-span-2 mt-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-customGray text-center border border-black'>APELLIDO MATERNO</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.Amaterno}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className='col-span-2 mt-1 mr-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-customGray text-center border border-black'>PRIMER NOMBRE </td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.Pnombre}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='col-span-2 mt-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-customGray text-center border border-black'>OTROS NOMBRES</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>{sisFuaAtencion?.Onombre}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className='col-span-4 mt-1'>
                                        <div className='grid grid-cols-5 gap-4 items-stretch'>
                                            <div className='col-span-1 h-full'>
                                                <table className='border-black border-collapse w-full h-full table-fixed'>
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={2} className='bg-customGray text-center border border-black font-semibold'>SEXO</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-customGray text-center border border-black'>MASCULINO</td>
                                                            <td className='border border-black text-center'>{sisFuaAtencion?.Genero == '1' && "X"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-customGray text-center border border-black'>FEMENINO</td>
                                                            <td className='border border-black text-center'>{sisFuaAtencion?.Genero == '0' && "X"}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2} className='bg-customGray text-center border border-black font-semibold'>SALUD MATERNA</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-customGray text-center border border-black'>GESTANTE </td>
                                                            <td className='border border-black text-center'>{sisFuaAtencion?.FuaCondicionMaterna == '1' && 'X'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-customGray text-center border border-black'>PUERPERA</td>
                                                            <td className='border border-black text-center'>{sisFuaAtencion?.FuaCondicionMaterna == '2' && 'X'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>


                                            </div>
                                            <div className='col-span-2 h-full'>
                                                <table className='w-full border-collapse border border-black'>
                                                    <tbody>
                                                        <tr>
                                                            <td className='bg-customGray text-center border border-black w-32 h-8'>FECHA</td>
                                                            <td className='bg-customGray text-center border border-black h-8'>DIA</td>
                                                            <td className='bg-customGray text-center border border-black h-8'>MES</td>
                                                            <td className='bg-customGray text-center border border-black h-8'>AÑO</td>
                                                        </tr>

                                                        <tr>
                                                            <td className='bg-customGray border border-black text-center h-8'>FECHA PROBABLE DE PARTO / FECHA DE PARTO </td>
                                                            <td className='text-center border border-black'></td>
                                                            <td className='text-center border border-black '></td>
                                                            <td className='text-center border border-black'></td>
                                                        </tr>
                                                        <tr>
                                                            {sisFuaAtencion?.fnacimiento && (
                                                                <>
                                                                    <td className='bg-customGray border border-black text-center h-8'>FECHA DE NACIMIENTO</td>
                                                                    <td className='text-center border border-black '>{sisFuaAtencion.fnacimiento.split("/")[0]}</td>
                                                                    <td className='text-center border border-black '>{sisFuaAtencion.fnacimiento.split("/")[1]}</td>
                                                                    <td className='text-center border border-black '>{sisFuaAtencion.fnacimiento.split("/")[2]}</td>
                                                                </>
                                                            )}

                                                        </tr>
                                                        <tr>
                                                            <td className='bg-customGray border border-black text-center h-8'>FECHA DE FALLECIMIENTO</td>
                                                            <td className='text-center border border-black h-8'></td>
                                                            <td className='text-center border border-black h-8'></td>
                                                            <td className='text-center border border-black h-8'></td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                            <div className='col-span-2 h-full'>
                                                <table className='w-full border-collapse border border-black h-full table-fixed'>
                                                    <tbody>
                                                        <tr>
                                                            <td className='bg-customGray text-center border border-black w-56 h-8'>N° DE HISTORIA CLÍNICA</td>
                                                            <td className='bg-customGray text-center border border-black'>ETNIA</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='text-center  border border-black h-5'>{sisFuaAtencion?.FuaNrohistoria}</td>
                                                            <td className='text-center  border border-black'>58</td>
                                                        </tr>
                                                        <tr>
                                                            <td className=' bg-customGray border border-black text-center h-5'> DNI / CNV / AFILIACIÓN DEL RN 1 </td>
                                                            <td className='text-center border border-black '></td>
                                                        </tr>
                                                        <tr>
                                                            <td className=' bg-customGray border border-black text-center h-5'> DNI / CNV / AFILIACIÓN DEL RN 2 </td>
                                                            <td className='text-center border border-black '></td>
                                                        </tr>
                                                        <tr>
                                                            <td className=' bg-customGray border border-black text-center h-5'> DNI / CNV / AFILIACIÓN DEL RN 3 </td>
                                                            <td className='text-center border border-black '></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </td>
                        </tr>


                        <tr>
                            <td style={{ fontSize: '9px' }}>
                                <div className='w-full border border-black grid grid-cols-3 mt-1'>
                                    <div className='col-span-3 text-center font-bold bg-customGray border border-black'>
                                        DE LA ATENCIÓN
                                    </div>

                                    <div className='col-span-2'>
                                        <div className='grid grid-cols-3 items-stretch'>

                                            <table className='border-collapse w-full h-full'>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={3} className='bg-customGray border border-black text-center font-semibold'>FECHA DE ATENCIÓN</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border-t border-black bg-customGray text-center'>DIA</td>
                                                        <td className='border border-black bg-customGray text-center'>MES</td>
                                                        <td className='border border-black bg-customGray text-center'>AÑO</td>
                                                    </tr>
                                                    {sisFuaAtencion?.FuaAtencionFecha && (
                                                        <tr>
                                                            <td className=' border-t border-black text-center'>{sisFuaAtencion.FuaAtencionFecha.split("/")[0]}</td>
                                                            <td className='border-l border-black text-center'>{sisFuaAtencion.FuaAtencionFecha.split("/")[1]}</td>
                                                            <td className='border-l border-r border-black text-center'>{sisFuaAtencion.FuaAtencionFecha.split("/")[2]}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                            <table className='  border-collapse w-full col-span-2 h-full'>
                                                <tbody>
                                                    <tr>
                                                        <td className='bg-customGray border-r border-black text-center font-semibold' colSpan={3}>HORA</td>
                                                        <td className='bg-customGray border-r border-black text-center font-semibold'>UPS</td>
                                                        <td className='bg-customGray border-r border-black text-center font-semibold'>CÓD. PRESTA</td>
                                                        <td className='bg-customGray border-r border-black  text-center font-semibold'>CÓD. PRESTACION(ES) ADICIONAL (ES)</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border-t border-black  text-center'> {sisFuaAtencion?.FuaAtencionHora?.split(':')[0]}</td>
                                                        <td className='border-t border-l border-black text-center'>:</td>
                                                        <td className='border-t border-l border-black text-center'> {sisFuaAtencion?.FuaAtencionHora?.split(':')[1]}</td>
                                                        <td className='border-t border-l border-black text-center'>{sisFuaAtencion?.FuaUPS}</td>
                                                        <td className='border-t border-l border-black text-center'>{sisFuaAtencion?.FuaCodigoPrestacion}</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className=' border-collapse w-full col-span-3 h-full'>
                                                <tbody>
                                                    <tr>
                                                        <td rowSpan={3} className=' bg-customGray border-t border-l  border-black text-center'>REPORTE VINCULADO</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='bg-customGray border  border-black text-center'>CÓD. AUTORIZACIÓN</td>
                                                        <td className='bg-customGray border-r border-b border-black text-center'>N° FUA A VINCULAR</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border-r border-l border-black h-5'></td>
                                                        <td className='border-r border-black  '></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>


                                    <div className='col-span-1'>
                                        <table className='border-collapse  w-full h-full'>
                                            <tbody>
                                                <tr>
                                                    <td
                                                        rowSpan={5}
                                                        className="border border-black text-center align-middle p-0 bg-customGray"
                                                        style={{
                                                            transform: 'rotate(180deg)',       // Gira el texto
                                                            writingMode: 'vertical-lr',        // Mantiene el modo vertical
                                                            textOrientation: 'mixed',
                                                            width: '4px',
                                                            fontSize: '9px',
                                                            lineHeight: '1',
                                                            padding: 0,
                                                        }}
                                                    >
                                                        HOSPITALIZACIÓN
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-customGray w-24 text-center'>FECHA</td>
                                                    <td className='border-l border-black text-center bg-customGray' colSpan={2}>DIA</td>
                                                    <td className='border-l border-black text-center bg-customGray' colSpan={2}>MES</td>
                                                    <td className='border-l border-black text-center bg-customGray' colSpan={2}>AÑO</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-customGray text-center'>DE INGRESO</td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                </tr>

                                                <tr>
                                                    <td className='border border-black bg-customGray text-center'>DE ALTA</td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border-l border-t border-black bg-customGray text-center'>DE CORTE ADMINISTRATIVO</td>
                                                    <td className='border-l border-t border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* INICIO CONCEPTO PRESTACIONAL */}
                        <tr>
                            <td style={{ fontSize: '8px' }}>
                                <table className='w-full border-collapse '>
                                    <tbody>
                                        <tr>
                                            <td colSpan={10} className='text-center border border-black bg-customGray font-semibold'>CONCEPTO PRESTACIONAL</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className='border border-black bg-customGray text-center font-semibold w-3'>ATENCIÓN DIRECTA</td>
                                            <td rowSpan={2} className='border border-black text-center w-8'>
                                                X
                                            </td>
                                            <td rowSpan={2} className='border border-black text-center w-48'>

                                            </td>
                                            <td rowSpan={2} className='border border-black text-center w-2'>

                                            </td>
                                            <td colSpan={6} className='border border-black w-8 bg-customGray text-center font-semibold'>
                                                Sepelio
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black w-14 bg-customGray text-center font-semibold'>NATIMUERTO</td>
                                            <td className='border border-black w-14'></td>
                                            <td className='border border-black w-14 bg-customGray text-center font-semibold'>OBITO</td>
                                            <td className='border border-black w-14'></td>
                                            <td className='border border-black w-14 bg-customGray text-center font-semibold'>OTRO</td>
                                            <td className='border border-black w-14'></td>
                                        </tr>



                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* FIN CONCEPTO PRESTACIONAL */}

                        <tr>
                            <td style={{ fontSize: '9px' }}>
                                <table className='w-full border-collapse border-black border'>
                                    <tbody>

                                        <tr>
                                            <td colSpan={18} className='text-center font-semibold bg-customGray'>DEL DESTINO DEL ASEGURADO/USUARIO


                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className='bg-customGray text-center border border-black'>ALTA</td>
                                            <td rowSpan={2} className=' text-center border border-black w-4'>{sisFuaAtencion?.FuaDestino == '1' && 'X'}</td>
                                            <td rowSpan={2} className='bg-customGray text-center border border-black'>CITA</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'>{sisFuaAtencion?.FuaDestino == '2' && 'X'}</td>
                                            <td rowSpan={2} className='bg-customGray text-center border border-black'>HOSPITALIZACIÓN</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'>{sisFuaAtencion?.FuaDestino == '8' && 'X'}</td>
                                            <td colSpan={6} className='bg-customGray text-center border border-black'>REFERIDO</td>
                                            <td rowSpan={2} className='bg-customGray text-center border border-black'>CONTRA <br /> REFERIDO</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'>{sisFuaAtencion?.FuaDestino == '6' && 'X'}</td>
                                            <td rowSpan={2} className='bg-customGray text-center border border-black'>FALLECIDO</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'>{sisFuaAtencion?.FuaDestino == '7' && 'X'}</td>
                                            <td rowSpan={2} className='bg-customGray text-center border border-black'>CORTE <br /> ADMINIS</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'></td>
                                        </tr>
                                        <tr>
                                            <td className=' text-center border border-black'>EMERGENCIA</td>
                                            <td className=' text-center border border-black w-4'>{sisFuaAtencion?.FuaDestino == '3' && 'X'}</td>
                                            <td className=' text-center border border-black'>CONSULTA EXTERNA</td>
                                            <td className=' text-center border border-black w-4'>{sisFuaAtencion?.FuaDestino == '4' && 'X'}</td>
                                            <td className=' text-center border border-black'>APOYO AL DIAGNÓSTICO</td>
                                            <td className=' text-center border border-black w-4'>{sisFuaAtencion?.FuaDestino == '5' && 'X'}</td>
                                        </tr>

                                    </tbody>
                                </table>
                                <table className='border border-black border-collapse w-full mt-1'>
                                    <tbody>
                                        <tr>
                                            <td className='bg-customGray border border-black text-center font-semibold' colSpan={3}>SE REFIERE / CONTRARREFIERE A:</td>
                                        </tr>
                                        <tr>
                                            <td className='bg-customGray border border-black text-center font-semibold'>CÓDIGO RENAES DE LA IPRESS</td>
                                            <td className='bg-customGray border border-black text-center font-semibold'>NOMBRE DE LA IPRESS A LA QUE SE REFIERE / CONTRARREFIERE</td>
                                            <td className='bg-customGray border border-black text-center font-semibold'>N° HOJA DE REFER / CONTRARR.</td>
                                        </tr>
                                        <tr>
                                            <td className='h-4 border border-black'></td>
                                            <td className='border border-black'></td>
                                            <td className='border border-black'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='grid grid-cols-3' style={{ fontSize: '7px' }}>
                                    <div className='col-span-2'>
                                        <table className='w-full border border-collapse border-black'>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={6} className='border border-black bg-customGray text-center font-semibold'>ACTIVIDADES PREVENTIVAS Y OTROS</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-customGray text-center'>PESO (Kg)</td>
                                                    <td className='border border-black  text-center w-12'>{sisFuaAtencion?.TriajePeso ? parseFloat(sisFuaAtencion.TriajePeso).toFixed(2) : ""}</td>
                                                    <td className='border border-black bg-customGray text-center'>TALLA (cm)</td>
                                                    <td className='border border-black  text-center w-12'>{sisFuaAtencion?.TriajeTalla ? parseFloat(sisFuaAtencion.TriajeTalla).toFixed(2) : ""}</td>
                                                    <td className='border border-black bg-customGray text-center'>P.A. (mmHg) </td>
                                                    <td className='border border-black  text-center w-12'>{sisFuaAtencion?.TriajePresion} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className='w-full grid grid-cols-5  border'>
                                            <table className='border border-black border-collapse row-span-2'>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={2} className='border border-black bg-customGray text-center'>DE LA GESTANTE</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center w-4'>CPN (N°)</td>
                                                        <td className='border border-black text-center w-4'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>EDAD GEST</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>ALTURA UTERINA</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>PARTO VERTICAL</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>CONTROL PUERP (N°)</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={5} className='border border-black bg-customGray text-center font-semibold'>DEL RECIEN NACIDO</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center' colSpan={4}>EDAD GEST RN
                                                            (SEM)</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black text-center bg-customGray '>APGAR</td>
                                                        <td className='border border-black text-center'>1°</td>
                                                        <td className='border border-black w-3'></td>
                                                        <td className='border border-black  text-center'>5°</td>
                                                        <td className='border border-black '></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center' colSpan={4}>Corte Tardío de Cordón (2 a 3 min)</td>
                                                        <td className='border border-black text-center w-10'></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className='col-span-2'>
                                                <tbody>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center font-semibold' colSpan={4}>GESTANTE / RN / NIÑO / ADOLESCENTE / JOVEN Y ADULTO / ADULTO MAYOR</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>CRED N°</td>
                                                        <td className='border border-black  text-center w-8'></td>
                                                        <td className='border border-black bg-customGray text-center'>PAB (cm)</td>
                                                        <td className='border border-black  text-center w-7'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>R.N. PREMATURO</td>
                                                        <td className='border border-black  text-center '></td>
                                                        <td className='border border-black bg-customGray text-center'>TAP/ EEDP o TEPSI</td>
                                                        <td className='border border-black  text-center '></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>BAJO PESO AL NACER</td>
                                                        <td className='border border-black  text-center '></td>
                                                        <td className='border border-black bg-customGray text-center'>CONSEJERIA NUTRICIONAL</td>
                                                        <td className='border border-black  text-center '></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>ENFER. CONGENITA / SECUELA AL NACER</td>
                                                        <td className='border border-black  text-center '></td>
                                                        <td className='border border-black bg-customGray text-center'>CONSEJERIA INTEGRAL</td>
                                                        <td className='border border-black  text-center '></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>N° FAMILIARES DE GEST / PUERP. CASA MAT.</td>
                                                        <td className='border border-black  text-center '></td>
                                                        <td className='border border-black bg-customGray text-center'>IMC (Kg/M<sup>2</sup> )</td>
                                                        <td className='border border-black  text-center '></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className='border-collapse'>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={2} className='border border-black bg-customGray text-center font-semibold'>JOVEN Y ADULTO</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center w-3'>EVALUACIÓN INTEGRAL</td>
                                                        <td className='border border-black text-center w-3'></td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={2} className='border border-black bg-customGray text-center font-semibold'>ADULTO MAYOR</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center'>VACAM</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black bg-customGray text-center' rowSpan={2}>TAMIZAJE DE SALUD MENTAL</td>
                                                        <td className='border border-black text-center'>PAT.</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border border-black text-center'>NOR</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                            <table className='col-span-4 border-collapse'>
                                                <tbody>
                                                    <tr>
                                                        <td className='border border-black text-center bg-customGray font-semibold' colSpan={6}>TAMIZAJE DE PATOLOGÍAS CRÓNICAS</td>
                                                    </tr>
                                                    <tr style={{ fontSize: '6px' }}>
                                                        <td className='border border-black  text-center bg-customGray'>HB.GLICOSILADA(mg/dL)</td>
                                                        <td className='border border-black w-4'></td>
                                                        <td className='border border-black  text-center bg-customGray'>DOSAJE DE ALBUMINA EN ORINA (ug/mL)</td>
                                                        <td className='border border-black w-4'></td>
                                                        <td className='border border-black  text-center bg-customGray'>DEPURACION DE CREATININA (mL/min)</td>
                                                        <td className='border border-black  w-4'></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div >
                                        <table className='border border-black w-full border-collapse'>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={7} className='border border-black bg-customGray text-center font-semibold'>
                                                        VACUNAS N° DE DOSIS
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center w-12'>BCG</td>
                                                    <td className='border border-black  text-center w-6'></td>
                                                    <td className='border border-black bg-customGray text-center  w-12'>INFLUENZA</td>
                                                    <td className='border border-black  text-center w-6'></td>
                                                    <td className='border border-black bg-customGray text-center'>ANTIAMARILICA</td>
                                                    <td className='border border-black  text-center w-6' colSpan={2}></td>

                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center'>DPT</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>PAROTID</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>ANTINEUMOC</td>
                                                    <td className='border border-black  text-center' colSpan={2}></td>
                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center'>APO</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>RUBEOLA</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>ANTITETANICA</td>
                                                    <td className='border border-black  text-center ' colSpan={2}></td>
                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center'>ASA</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>ROTAVIRUS</td>
                                                    <td className='border border-black  text-center'></td>
                                                    <td className='border border-black bg-customGray text-center w-5'>COMPLETAS PARA LA EDAD</td>
                                                    <td className='border border-black  text-center w-4'>SI</td>
                                                    <td className='border border-black  text-center w-4'>NO</td>
                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center'>SPR</td>
                                                    <td className='border border-black  text-center'></td>
                                                    <td className='border border-black bg-customGray text-center'>DT ADULTO (N° DOSIS)</td>
                                                    <td className='border border-black  text-center'></td>
                                                    <td className='border border-black bg-customGray text-center'>VPH</td>
                                                    <td className='border border-black  text-center ' colSpan={2}></td>
                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center'>SR</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>IPV</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>OTRA VACUNA</td>
                                                    <td className='border border-black  text-center ' colSpan={2}></td>
                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center'>HVB</td>
                                                    <td className='border border-black  text-center'></td>
                                                    <td className='border border-black bg-customGray text-center'>PENTAVAL</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-customGray text-center'>____________</td>
                                                    <td className='border border-black  text-center ' colSpan={2}></td>
                                                </tr>
                                                <tr >
                                                    <td className='border border-black bg-customGray text-center' > GRUPO DE RIESGO HVB</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black  text-center' colSpan={5} style={{ fontSize: '6px' }}>
                                                        GRUPO DE RIESGO HVB: 1. TRABAJADOR DE SALUD 2. TRABAJAD. SEXUALES 3. HSH 4. PRIVADO LIBERTAD 5. FF. AA. 6. POLICIA NACIONAL  7. ESTUDIANTES DE SALUD 8. POLITRANFUNDIDOS 9. DROGO DEPENDIENTES

                                                    </td>

                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td style={{ fontSize: '9px' }}>
                                <table className='w-full'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={9} className='border border-black bg-customGray font-semibold text-center'>DIAGNÓSTICOS</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className='border border-black bg-customGray font-semibold text-center'>N° </td>
                                            <td rowSpan={2} className='border border-black bg-customGray font-semibold text-center'>DESCRIPCIÓN </td>
                                            <td className='border border-black bg-customGray font-semibold text-center' colSpan={4}>INGRESO</td>
                                            <td className='border border-black bg-customGray font-semibold text-center' colSpan={3}>EGRESO</td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black bg-customGray font-semibold text-center'>P</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>D</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>R</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>CIE - 10</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>D</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>R</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>CIE - 10</td>
                                        </tr>
                                        {Array.from({ length: 6 }, (_, index) => {
                                            // si existe el item en el array, lo llenamos
                                            const item = sisFuaAtencionDIA[index];
                                            return (
                                                <tr key={item?.id ?? `empty-row-${index}`}>
                                                    <td className='border border-black font-semibold text-center h-4'>{item?.DxNumero ?? ''}</td>
                                                    <td className='border border-black'>{item?.Descripcion ?? ''}</td>
                                                    <td className='border border-black font-semibold text-center'>{item?.DxTipoDPR == 'P' ? "X" : ''}</td>
                                                    <td className='border border-black font-semibold text-center'>{item?.DxTipoDPR == 'D' ? "X" : ''}</td>
                                                    <td className='border border-black font-semibold text-center'>{item?.DxTipoDPR == 'R' ? "X" : ''}</td>
                                                    <td className='border border-black font-semibold text-center'> {item?.DxCodigo}</td>
                                                    <td className='border border-black font-semibold text-center'>

                                                    </td>
                                                    <td className='border border-black font-semibold text-center'></td>
                                                    <td className='border border-black font-semibold text-center'></td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr >
                            <td style={{ fontSize: '9px' }} className='border-black '>
                                <table className="w-full border border-black border-collapse">
                                    <tbody>
                                        <tr>
                                            <td className='border border-black bg-customGray font-semibold text-center'>N° DE DNI</td>
                                            <td className='border border-black bg-customGray font-semibold text-center' colSpan={5}>NOMBRE DEL RESPONSABLE DE LA ATENCIÓN</td>
                                            <td className='border border-black bg-customGray font-semibold text-center' colSpan={2}>N° DE COLEGIATURA</td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black text-center'>{sisFuaAtencion?.FuaMedicoDNI} </td>
                                            <td className='border border-black text-center' colSpan={5}>{sisFuaAtencion?.FuaMedico} </td>
                                            <td className='border border-black text-center' colSpan={2}>{sisFuaAtencion?.Colegiatura}</td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black bg-customGray font-semibold text-center'>RESPONSABLE DE LA ATENCIÓN</td>
                                            <td className='border border-black text-center w-10'>{sisFuaAtencion?.FuaMedicoTipo}</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>ESPECIALIDAD</td>
                                            <td className='border border-black text-center'>{sisFuaAtencion?.Descripcion}</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>N° RNE</td>
                                            <td className='border border-black text-center w-10'>{sisFuaAtencion?.rne}</td>
                                            <td className='border border-black bg-customGray font-semibold text-center'>EGRESADO</td>
                                            <td className='border border-black text-center w-10'></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className='border border-collapse w-full'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={5} style={{ fontSize: '8px' }}>
                                                1. MÉDICO 2. FARMACEUTICO 3. CIRUJANO DENTISTA 4. BIÓLOGO 5. OBSTETRIZ 6. ENFERMERA 7. TRABAJADORA SOCIAL 8. PSICOLOGA 9.TECNOLOGO MEDICO 10.NUTRICION 11. TECNICO ENFERMERIA 12. AUXILIAR DE ENFERMERIA 13. OTRO
                                            </td>
                                        </tr>
                                        <tr>

                                            <td colSpan={5}>
                                                <table className='w-full  border-separate border-spacing-2'  >
                                                    <tbody >
                                                        <tr>
                                                            <td className=' border-black w-2/5'></td>
                                                            <td className='align-bottom' >
                                                                <table className='border-separate border-spacing-2 ml-auto'>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td colSpan={2} className='font-semibold'>FIRMA</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='font-semibold'>ASEGURADO</td>
                                                                            <td className='border border-black w-6'></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='font-semibold'>REPRESENTANTE</td>
                                                                            <td className='border border-black w-6'></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td className='border-b border-black w-40'></td>
                                                            <td rowSpan={2} className="text-center align-middle ">
                                                                <div className="flex justify-center items-center w-full h-full">
                                                                    <div className="border border-black w-28 h-32">
                                                                        {/* contenido aquí si lo necesitas */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr >
                                                            <td></td>
                                                            <td className='grid grid-cols-1 font-semibold align-bottom  text-right'><span>REPRESENTANTE DEL ASEGURADO:</span>   <span>NOMBRES Y APELLIDOS</span></td>
                                                            <td className='border-b border-black w-9'></td>
                                                            <td></td>
                                                        </tr>
                                                        <tr>
                                                            <td className='border-t border-black w-9 text-center'>FIRMA Y SELLO DEL RESPONSABLE DE LA ATENCIÓN</td>
                                                            <td className='font-semibold align-bottom text-right'>DNI o CE DEL REPRESENTANTE:</td>
                                                            <td className='border-b border-black w-9'></td>
                                                            <td className='text-center'>Huella Digital del Asegurado o del REPRESENTANTE</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>

                </table>

            </div>
            <div className="  bg-white ">
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td>
                                <div className="w-5/6 mx-auto">
                                    <table className='border-collapse w-full' style={{ fontSize: '9px' }}>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="flex items-center justify-center text-center  font-bold  h-8  rounded-md w-11/12">
                                                        TERAPEUTICA, INSUMOS, PROCEDIMIENTOS Y APOYO AL DIAGNOSTICO
                                                    </div>
                                                </td>
                                                <td>
                                                    <table className='border-collapse w-full'>
                                                        <tbody>
                                                            <tr>
                                                                <td className='bg-customGray  border border-black text-center font-semibold' colSpan={3}>FORMATO DE ATENCIÓN Nº</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='border border-black text-center font-bold text-xs' style={{ fontSize: '9px' }}>00000754</td>
                                                                <td className='border border-black text-center font-bold text-xs' style={{ fontSize: '9px' }}>{sisFuaAtencion?.FuaLote}</td>
                                                                <td className='border border-black text-center font-bold text-xs' style={{ fontSize: '9px' }}>{sisFuaAtencion?.FuaNumero}</td>
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>

                                    </table>
                                    <table className='border-collapse w-full mt-1' style={{ fontSize: '9px' }}>
                                        <tbody>
                                            <tr>
                                                <td className='text-center font-bold bg-customGray border border-black' colSpan={14} style={{ fontSize: '8px' }}>PRODUCTOS FARMACEUTICOS / MEDICAMENTOS</td>
                                            </tr>
                                            <tr style={{ fontSize: '7px' }}>
                                                <td className='text-center font-bold bg-customGray border border-black w-12' >CÓDIGO SISMED</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-36' >NOMBRE</td>
                                                <td className='text-center font-bold bg-customGray border border-black' >FF</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>CONCENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>PRES</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>ENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>DX</td>



                                                <td className='text-center font-bold bg-customGray border border-black w-12'>CÓDIGO SISMED</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-36'>NOMBRE</td>
                                                <td className='text-center font-bold bg-customGray border border-black' >FF</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>CONCENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>PRES</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>ENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>DX</td>
                                            </tr>

                                            {Array.from({ length: 8 }).map((_, rowIndex) => {
                                                // el primer nombre va en 0, el segundo en 1, el tercer en 2, el cuarto en 3...
                                                const item1 = sisFuaAtencionMED[rowIndex * 2];
                                                const item2 = sisFuaAtencionMED[rowIndex * 2 + 1];
                                                return (
                                                    <tr key={rowIndex} style={{ fontSize: '7px' }}>
                                                        {/* primera parte */}
                                                        <td className='border border-black h-3 text-center'>{item1?.Codigo ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item1?.Nombre ?? ''}</td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'>{item1?.CantidadPrescrita ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item1?.CantidadEntregada ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item1?.DxNumero ?? ''}</td>

                                                        {/* segunda parte */}
                                                        <td className='border border-black text-center'>{item2?.Codigo ?? ''}</td>
                                                        <td className='border border-black text-center'>{item2?.Nombre ?? ''}</td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'>{item2?.CantidadPrescrita ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item2?.CantidadEntregada ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item2?.DxNumero ?? ''}</td>
                                                    </tr>
                                                )
                                            })}

                                            <tr>
                                                <td className='text-center font-bold bg-customGray border border-black' colSpan={14} style={{ fontSize: '8px' }}>DISPOSITIVOS MÉDICOS / PRODUCTOS SANITARIOS</td>
                                            </tr>
                                            <tr style={{ fontSize: '7px' }}>
                                                <td className='text-center font-bold bg-customGray border border-black w-12' >CÓDIGO</td>
                                                <td className='text-center font-bold bg-customGray border border-black '>NOMBRE  </td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6' >FF</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>CONCENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>PRES</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>ENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>DX</td>

                                                <td className='text-center font-bold bg-customGray border border-black w-12'>CÓDIGO</td>
                                                <td className='text-center font-bold bg-customGray border border-black'>NOMBRE  </td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'  >FF</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>CONCENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>PRES</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>ENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>DX</td>
                                            </tr>
                                            {Array.from({ length: 8 }).map((_, rowIndex) => {
                                                // el primer nombre va en 0, el segundo en 1, el tercer en 2, el cuarto en 3...
                                                const item1 = sisFuaAtencionINS[rowIndex * 2];
                                                const item2 = sisFuaAtencionINS[rowIndex * 2 + 1];
                                                return (
                                                    <tr key={rowIndex} style={{ fontSize: '7px' }}>
                                                        {/* primera parte */}
                                                        <td className='border border-black h-3 text-center'>{item1?.Codigo ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item1?.Nombre ?? ''}</td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'>{item1?.CantidadPrescrita ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item1?.CantidadEntregada ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item1?.DxNumero ?? ''}</td>

                                                        {/* segunda parte */}
                                                        <td className='border border-black  text-center'>{item2?.Codigo ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item2?.Nombre ?? ''}</td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'></td>
                                                        <td className='border border-black  text-center'>{item2?.CantidadPrescrita ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item2?.CantidadEntregada ?? ''}</td>
                                                        <td className='border border-black  text-center'>{item2?.DxNumero ?? ''}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    <table className='border-collapse w-full' style={{ fontSize: '7px' }}>
                                        <tbody>
                                            <tr>
                                                <td className='text-center font-bold bg-customGray border border-black' colSpan={12} style={{ fontSize: '8px' }}>PROCEDIMIENTOS/ DIAGNÓSTICO POR IMÁGENES/ LABORATORIO</td>
                                            </tr>
                                            <tr>
                                                <td className='text-center font-bold bg-customGray border border-black w-12' >CÓDIGO</td>
                                                <td className='text-center font-bold bg-customGray border border-black '>NOMBRE </td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>IND</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>EJE</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>DX</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>RES</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-12'>CÓDIGO</td>
                                                <td className='text-center font-bold bg-customGray border border-black'>NOMBRE  </td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>IND</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>EJE</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>DX</td>
                                                <td className='text-center font-bold bg-customGray border border-black w-6'>RES</td>
                                            </tr>
                                            {Array.from({ length: 8 }).map((_, rowIndex) => {
                                                // el primer nombre va en 0, el segundo en 1, el tercer en 2, el cuarto en 3...
                                                const item1 = sisFuaAtencionPRO[rowIndex * 2];
                                                const item2 = sisFuaAtencionPRO[rowIndex * 2 + 1];
                                                return (
                                                    <tr key={rowIndex}>
                                                        {/* primera parte */}
                                                        <td className='border border-black h-3 text-center'>{item1?.Codigo ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'>{item1?.Nombre ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'>{item1?.CantidadPrescrita ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'>
                                                             {item1?.CantidadEjecutada ?? ''}
                                                            </td>
                                                        <td className='border border-black h-3 text-center'>{item1?.DxNumero ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'></td>

                                                        {/* segunda parte */}
                                                        <td className='border border-black h-3 text-center'>{item2?.Codigo ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'>{item2?.Nombre ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'>{item2?.CantidadPrescrita ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'></td>
                                                        <td className='border border-black h-3 text-center'>{item2?.DxNumero ?? ''}</td>
                                                        <td className='border border-black h-3 text-center'></td>
                                                    </tr>
                                                )
                                            })}

                                        </tbody>
                                    </table>
                                    <table className='border-collapse w-full' style={{ fontSize: '7px' }}>
                                        <tbody>
                                            <tr>
                                                <td className='text-center font-bold bg-customGray border border-black' colSpan={12} style={{ fontSize: '8px' }}>
                                                    SUB COMPONENTE PRESTACIONAL (PROCEDIMIENTOS)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='text-center font-bold bg-customGray border border-black w-12' >CÓDIGO</td>
                                                <td className='text-center font-bold bg-customGray border border-black '>NOMBRE </td>
                                                <td className='text-center font-bold bg-customGray border border-black '>CARACT</td>
                                                <td className='text-center font-bold bg-customGray border border-black '>IND/ PRES</td>
                                                <td className='text-center font-bold bg-customGray border border-black '>EJE/ENTR</td>
                                                <td className='text-center font-bold bg-customGray border border-black '>DX</td>
                                                <td className='text-center font-bold bg-customGray border border-black '>RES</td>
                                                <td className='text-center font-bold bg-customGray border border-black'>N° TICKET </td>
                                                <td className='text-center font-bold bg-customGray border border-black '>PO</td>
                                            </tr>
                                            {Array.from({ length: 8 }).map((_, index) => (
                                                <tr key={index}>
                                                    {Array.from({ length: 9 }).map((_, colIndex) => (
                                                        <td key={colIndex} className="border border-black h-3"></td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {/*observaciones*/}
                                    <table className='w-full  border-collapse ' style={{ fontSize: '9px' }}>
                                        <tbody>
                                            <tr>
                                                <td className='border border-black text-center bg-customGray font-semibold'>OBSERVACIONES</td>
                                            </tr>
                                            <tr>
                                                <td className='h-20 border border-black align-top'> {sisFuaAtencion?.FuaObservaciones?.split('\r\n').map((line: any, index: any) => (
                                                    <span key={index}>
                                                        {line}
                                                        <br />
                                                    </span>
                                                ))}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/* fin observaciones*/}


                                    <table className='w-full  border-separate border-spacing-2' style={{ fontSize: '8px' }} >
                                        <tbody >
                                            <tr>
                                                <td className=' border-black w-2/5'></td>
                                                <td className='align-bottom'>
                                                    <table className='border-separate border-spacing-2 ml-auto'>
                                                        <tbody>
                                                            <tr>
                                                                <td colSpan={2} className='font-semibold'>FIRMA</td>
                                                            </tr>
                                                            <tr>
                                                                <td className='font-semibold'>ASEGURADO</td>
                                                                <td className='border border-black w-6'></td>
                                                            </tr>
                                                            <tr>
                                                                <td className='font-semibold'>REPRESENTANTE</td>
                                                                <td className='border border-black w-6'></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td className='border-b border-black w-40'></td>
                                                <td rowSpan={2} className="text-center align-middle ">
                                                    <div className="flex justify-center items-center w-full h-full">
                                                        <div className="border border-black w-28 h-32">
                                                            {/* contenido aquí si lo necesitas */}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr >
                                                <td></td>
                                                <td className='grid grid-cols-1 font-semibold align-bottom  text-right'><span>REPRESENTANTE DEL ASEGURADO:</span>   <span>NOMBRES Y APELLIDOS</span></td>
                                                <td className='border-b border-black w-9'></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td className='border-t border-black w-9 text-center'>FIRMA Y SELLO DEL RESPONSABLE DE LA ATENCIÓN</td>
                                                <td className='font-semibold align-bottom text-right'>DNI o CE DEL REPRESENTANTE:</td>
                                                <td className='border-b border-black w-9'></td>
                                                <td className='text-center'>Huella Digital del Asegurado o del REPRESENTANTE</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>

                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    )
}
