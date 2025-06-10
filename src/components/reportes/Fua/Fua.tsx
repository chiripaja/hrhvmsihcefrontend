'use client'
import './fua.css'
import React, { useEffect, useState } from 'react'
import { getData } from "@/components/helper/axiosHelper";
import { HiX } from 'react-icons/hi';

export const Fua = ({ idcuentaatencion }: any) => {
    const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
    const [datosAtencion, setdatosAtencion] = useState<any>([]);
    const [datos, setdatos] = useState<any>([]);


    return (
        <>
            <div className="flex justify-center print-page-break bg-white ">
                <table className='w-full scale-100 origin-top'>
                    <tbody>
                        <tr>
                            <td>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>LOGO PERU</td>
                                            <td>MINISTERIO DE SALUD</td>
                                            <td>SEGURO INTEGRAL DE SALUD</td>
                                            <td>ANEXO 1</td>
                                            <td>Cta: escribir(Cons. Ext)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                 <table className='w-full border border-black border-collapse' style={{ fontSize: '8px' }}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={9} className='bg-zinc-300 border border-black px-2 font-semibold text-center'> FORMATO ÚNICO DE ATENCIÓN - FUA </td>
                                        </tr>
                                        <tr>
                                            <td className='w-2/5 text-center border border-black bg-zinc-300' colSpan={3}>NÚMERO DE FORMATO </td>
                                            <td colSpan={4} className='text-center border border-black bg-zinc-300 w-12'>INSTITUCIÓN EDUCATIVA</td>
                                            <td colSpan={2} className='text-center border border-black bg-zinc-300' >CÓDIGO</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className='border border-black text-center font-bold text-lg'>00000754</td>
                                            <td rowSpan={2} className='border border-black text-center font-bold text-lg'>23</td>
                                            <td rowSpan={2} className='border border-black text-center font-bold text-lg'>00136277</td>
                                            <td colSpan={4} className='border border-black h-4'></td>
                                            <td colSpan={2} className='border border-black'></td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black bg-zinc-300'></td>
                                            <td className='border border-black'></td>
                                            <td className='border border-black bg-zinc-300 w-10'>SECCIÓN</td>
                                            <td className='border border-black'></td>
                                            <td className='border border-black bg-zinc-300 w-10'>TURNO</td>
                                            <td className='border border-black '></td>
                                        </tr>
                                    </tbody>
                                 </table>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <table className='w-full border border-black border-collapse' style={{ fontSize: '8px' }}>
                                    <tbody>
                                        <tr>
                                            <td colSpan={10} className='text-center border border-black  bg-zinc-300 font-semibold '>DE LA INSTITUCIÓN PRESTADORA DE SERVICIOS DE SALUD</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='bg-zinc-300 border border-black px-2 font-semibold text-center'  >CÓDIGO RENAES DE LA IPRESS </td>
                                            <td colSpan={7} className='bg-zinc-300 border border-black px-2 font-semibold text-center'>NOMBRE DE LA IPRESS QUE REALIZA LA ATENCIÓN</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='border border-black px-2 text-center'>00754</td>
                                            <td colSpan={7} className='border border-black px-2 text-center'>HOSPITAL REGIONAL HERMILIO VALDIZAN</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className='bg-zinc-300 border border-black text-center font-semibold' >PERSONAL QUE ATIENDE</td>
                                            <td colSpan={2} className='bg-zinc-300 border border-black text-center font-semibold'>LUGAR DE ATENCIÓN</td>
                                            <td colSpan={2} className='bg-zinc-300 border border-black text-center font-semibold'>ATENCIÓN</td>
                                            <td colSpan={3} className='bg-zinc-300 border border-black text-center font-semibold'>REFERENCIA REALIZADA POR</td>
                                        </tr>
                                        <tr>
                                            {/*personal que atiende*/}
                                            <td className='bg-zinc-300 border border-black px-2'>DE LA IPRESS</td>
                                            <td className='border border-black text-center'>X</td>
                                            <td className='bg-zinc-300 border border-black px-2'>CÓDIGO DE LA OFERTA FLEXIBLE</td>
                                            {/*personal que atiende*/}
                                            {/*LUGAR DE ATENCIÓN*/}
                                            <td className='bg-zinc-300 border border-black px-2'> INTRAMURAL</td>
                                            <td className='w-4 text-center' >X</td>
                                            {/*LUGAR DE ATENCIÓN*/}
                                            {/*ATENCIÓN*/}
                                            <td className='bg-zinc-300 border border-black px-2'>AMBULATORIA</td>
                                            <td className='w-4'> </td>
                                            {/*ATENCIÓN*/}
                                            {/*REFERENCIA REALIZADA POR*/}
                                            <td className='bg-zinc-300 border border-black text-center'>CÓD. RENAES</td>
                                            <td className='bg-zinc-300 border border-black text-center'>NOMBRE DE LA IPRESS U OFERTA FLEXIBLE</td>
                                            <td className='bg-zinc-300 border border-black text-center'>N° HOJA DE REFERENCIA</td>
                                            {/*REFERENCIA REALIZADA POR*/}
                                        </tr>
                                        <tr>
                                            {/*personal que atiende*/}
                                            <td className='bg-zinc-300 border border-black px-2'>ITINERANTE</td>
                                            <td className='w-4 border border-black'></td>
                                            <td className=' border-black border px-2 text-center' rowSpan={2}></td>
                                            {/*personal que atiende*/}
                                            {/*LUGAR DE ATENCIÓN*/}
                                            <td className='bg-zinc-300 border border-black px-2'> EXTRAMURAL</td>
                                            <td className='w-4 text-center border border-black ' ></td>
                                            {/*LUGAR DE ATENCIÓN*/}
                                            {/*ATENCIÓN*/}
                                            <td className='bg-zinc-300 border border-black px-2'>REFERENCIA</td>
                                            <td className='w-4 border border-black text-center'>X </td>
                                            {/*ATENCIÓN*/}
                                            {/*REFERENCIA REALIZADA POR*/}
                                            <td className='border border-black text-center' rowSpan={2}>785</td>
                                            <td className='border border-black text-center' rowSpan={2}>APARICIO POMARES</td>
                                            <td className='border border-black text-center' rowSpan={2}>2887501065</td>
                                            {/*REFERENCIA REALIZADA POR*/}
                                        </tr>
                                        <tr>
                                            {/*personal que atiende*/}
                                            <td className='bg-zinc-300 border border-black px-2'>OFERTA FLEXIBLE</td>
                                            <td className='w-4'></td>
                                            {/*personal que atiende*/}

                                            {/*LUGAR DE ATENCIÓN*/}
                                            <td className=' border border-black px-2' colSpan={2}> </td>

                                            {/*LUGAR DE ATENCIÓN*/}

                                            {/*ATENCIÓN*/}
                                            <td className='bg-zinc-300 border border-black px-2'>EMERGENCIA</td>
                                            <td className='w-4 border border-black text-center'></td>
                                            {/*ATENCIÓN*/}
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='w-full  grid grid-cols-4  border  border-black' style={{ fontSize: '9px' }}>

                                    <div className=' bg-zinc-300 text-center font-semibold col-span-4   border-b mb-1  border-black' >
                                        DEL ASEGURADO / USUARIO
                                    </div>

                                    <div className='col-span-1 mr-1 '>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center font-semibold   border border-black' colSpan={2}>IDENTIFICACIÓN</td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center border border-black w-4'>TDI</td>
                                                    <td className=' bg-zinc-300 text-center border border-black'>N° DOCUMENTO DE IDENTIDAD</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black  w-4'>2</td>
                                                    <td className=' text-center border border-black'>91447612</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='col-span-1 mr-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center font-semibold  border border-black' colSpan={3}>CÓDIGO DEL ASEGURADO SIS</td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center border border-black'>DIRESA  / OTROS</td>
                                                    <td className=' bg-zinc-300 text-center border border-black' colSpan={2}>NÚMERO</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>140</td>
                                                    <td className=' text-center border border-black'>2</td>
                                                    <td className=' text-center border border-black'>91447612</td>
                                                </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                    <div className='col-span-2'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center font-semibold  border border-black' colSpan={2}>ASEGURADO DE OTRA IAFAS</td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-zinc-300 w-20 text-center  border border-black'>INSTITUCIÓN</td>
                                                    <td className='  text-center border border-black'>0</td>
                                                </tr>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center  border border-black'>COD. SEGURO</td>
                                                    <td className=' text-center border border-black'></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='col-span-2 mt-1 mr-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center border border-black'>APELLIDO PATERNO</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>ORTEGA</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='col-span-2 mt-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center border border-black'>APELLIDO MATERNO</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>ORTEGA</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className='col-span-2 mt-1 mr-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center border border-black'>PRIMER NOMBRE </td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>YAEL</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className='col-span-2 mt-1'>
                                        <table className='w-full'>
                                            <tbody>
                                                <tr>
                                                    <td className=' bg-zinc-300 text-center border border-black'>OTROS NOMBRES</td>
                                                </tr>
                                                <tr>
                                                    <td className=' text-center border border-black'>OLIVER</td>
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
                                                            <td colSpan={2} className='bg-zinc-300 text-center border border-black font-semibold'>SEXO</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-zinc-300 text-center border border-black'>MASCULINO</td>
                                                            <td className='border border-black text-center'>X</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-zinc-300 text-center border border-black'>FEMENINO</td>
                                                            <td className='border border-black text-center'></td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2} className='bg-zinc-300 text-center border border-black font-semibold'>SALUD MATERNA</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-zinc-300 text-center border border-black'>GESTANTE </td>
                                                            <td className='border border-black text-center'></td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-zinc-300 text-center border border-black'>PUERPERA</td>
                                                            <td className='border border-black text-center'></td>
                                                        </tr>
                                                    </tbody>
                                                </table>


                                            </div>
                                            <div className='col-span-2 h-full'>
                                                <table className='w-full border-collapse border border-black'>
                                                    <tbody>
                                                        <tr>
                                                            <td className='bg-zinc-300 text-center border border-black w-32 h-8'>FECHA</td>
                                                            <td className='bg-zinc-300 text-center border border-black h-8'>DIA</td>
                                                            <td className='bg-zinc-300 text-center border border-black h-8'>MES</td>
                                                            <td className='bg-zinc-300 text-center border border-black h-8'>AÑO</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-zinc-300 border border-black text-center h-8'>FECHA PROBABLE DE PARTO / FECHA DE PARTO </td>
                                                            <td className='text-center border border-black h-8'></td>
                                                            <td className='text-center border border-black h-8'></td>
                                                            <td className='text-center border border-black h-8'></td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-zinc-300 border border-black text-center h-8'>FECHA DE NACIMIENTO</td>
                                                            <td className='text-center border border-black h-8'>9</td>
                                                            <td className='text-center border border-black h-8'>8</td>
                                                            <td className='text-center border border-black h-8'>2019</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='bg-zinc-300 border border-black text-center h-8'>FECHA DE FALLECIMIENTO</td>
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
                                                            <td className='bg-zinc-300 text-center border border-black w-56 h-8'>N° DE HISTORIA CLÍNICA</td>
                                                            <td className='bg-zinc-300 text-center border border-black h-8'>ETNIA</td>
                                                        </tr>
                                                        <tr>
                                                            <td className='text-center  border border-black'>91447612</td>
                                                            <td className='text-center  border border-black'>58</td>
                                                        </tr>
                                                        <tr>
                                                            <td className=' bg-zinc-300 border border-black text-center h-8'> DNI / CNV / AFILIACIÓN DEL RN 1 </td>
                                                            <td className='text-center border border-black h-8'></td>
                                                        </tr>
                                                        <tr>
                                                            <td className=' bg-zinc-300 border border-black text-center h-8'> DNI / CNV / AFILIACIÓN DEL RN 2 </td>
                                                            <td className='text-center border border-black h-8'></td>
                                                        </tr>
                                                        <tr>
                                                            <td className=' bg-zinc-300 border border-black text-center h-8'> DNI / CNV / AFILIACIÓN DEL RN 3 </td>
                                                            <td className='text-center border border-black h-8'></td>
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
                                    <div className='col-span-3 text-center font-bold bg-zinc-300 border border-black'>
                                        DE LA ATENCIÓN
                                    </div>

                                    <div className='col-span-2'>
                                        <div className='grid grid-cols-3 items-stretch'>

                                            <table className='border-collapse w-full h-full'>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={3} className='bg-zinc-300 border border-black text-center font-semibold'>FECHA DE ATENCIÓN</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border-t border-black bg-zinc-300 text-center'>DIA</td>
                                                        <td className='border border-black bg-zinc-300 text-center'>MES</td>
                                                        <td className='border border-black bg-zinc-300 text-center'>AÑO</td>
                                                    </tr>
                                                    <tr>
                                                        <td className=' border-t border-black text-center'>11</td>
                                                        <td className='border-l border-black text-center'>10</td>
                                                        <td className='border-l border-r border-black text-center'>2023</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className='  border-collapse w-full col-span-2 h-full'>
                                                <tbody>
                                                    <tr>
                                                        <td className='bg-zinc-300 border-r border-black text-center font-semibold'>HORA</td>
                                                        <td className='bg-zinc-300 border-r border-black text-center font-semibold'>UPS</td>
                                                        <td className='bg-zinc-300 border-r border-black text-center font-semibold'>CÓD. PRESTA</td>
                                                        <td className='bg-zinc-300 border-r border-black  text-center font-semibold'>CÓD. PRESTACION(ES) ADICIONAL (ES)</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='border-t border-black  text-center'>10:00</td>
                                                        <td className='border-t border-l border-black text-center'>221900</td>
                                                        <td className='border-t border-l border-black text-center'>056</td>
                                                        <td className='border border-black text-center'></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className=' border-collapse w-full col-span-3 h-full'>
                                                <tbody>
                                                    <tr>
                                                        <td rowSpan={3} className=' bg-zinc-300 border-t border-l  border-black text-center'>REPORTE VINCULADO</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='bg-zinc-300 border  border-black'>CÓD. AUTORIZACIÓN</td>
                                                        <td className='bg-zinc-300 border-r border-b border-black '>N° FUA A VINCULAR</td>
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
                                                        className="border border-black text-center align-middle p-0 bg-zinc-300"
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
                                                    <td className='border border-black bg-zinc-300 w-24 text-center'>FECHA</td>
                                                    <td className='border-l border-black'></td>
                                                    <td className='border-l border-black'></td>
                                                    <td className='border-l border-black'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>DE INGRESO</td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>DE ALTA</td>
                                                    <td className='border border-black'></td>
                                                    <td className='border border-black'></td>
                                                    <td className='border-l border-t border-black'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border-l border-t border-black bg-zinc-300 text-center'>DE CORTE ADMINISTRATIVO</td>
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


                        <tr>
                            <td  style={{ fontSize: '9px' }}>
                                <table className='w-full border-collapse border-black border'>
                                    <tbody>

                                        <tr>
                                            <td colSpan={18} className='text-center font-semibold bg-zinc-300'>DEL DESTINO DEL ASEGURADO/USUARIO</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className='bg-zinc-300 text-center border border-black'>ALTA</td>
                                            <td rowSpan={2} className=' text-center border border-black w-4'></td>
                                            <td rowSpan={2} className='bg-zinc-300 text-center border border-black'>CITA</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'>X</td>
                                            <td rowSpan={2} className='bg-zinc-300 text-center border border-black'>HOSPITALIZACIÓN</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'></td>
                                            <td colSpan={6} className='bg-zinc-300 text-center border border-black'>REFERIDO</td>
                                            <td rowSpan={2} className='bg-zinc-300 text-center border border-black'>CONTRA <br /> REFERIDO</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'></td>
                                            <td rowSpan={2} className='bg-zinc-300 text-center border border-black'>FALLECIDO</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'></td>
                                            <td rowSpan={2} className='bg-zinc-300 text-center border border-black'>CORTE <br /> ADMINIS</td>
                                            <td rowSpan={2} className=' text-center border border-black  w-4'></td>
                                        </tr>
                                        <tr>
                                            <td className=' text-center border border-black'>EMERGENCIA</td>
                                            <td className=' text-center border border-black w-4'></td>
                                            <td className=' text-center border border-black'>CONSULTA EXTERNA</td>
                                            <td className=' text-center border border-black w-4'></td>
                                            <td className=' text-center border border-black'>APOYO AL DIAGNÓSTICO</td>
                                            <td className=' text-center border border-black w-4'></td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                                <table className='border border-black border-collapse w-full mt-1'>
                                    <tbody>
                                        <tr>
                                            <td className='bg-zinc-300 border border-black text-center' colSpan={3}>SE REFIERE / CONTRARREFIERE A:</td>
                                        </tr>
                                        <tr>
                                            <td className='bg-zinc-300 border border-black text-center'>CÓDIGO RENAES DE LA IPRESS</td>
                                            <td className='bg-zinc-300 border border-black text-center'>NOMBRE DE LA IPRESS A LA QUE SE REFIERE / CONTRARREFIERE</td>
                                            <td className='bg-zinc-300 border border-black text-center'>N° HOJA DE REFER / CONTRARR.</td>
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
                            <div className='grid grid-cols-3' style={{fontSize:'7px'}}>
                                <div className='col-span-2'>
                                    <table className='w-full border border-collapse border-black'>
                                        <tbody>
                                            <tr>
                                                <td colSpan={6} className='border border-black bg-zinc-300 text-center'>ACTIVIDADES PREVENTIVAS Y OTROS</td>
                                            </tr>
                                            <tr>
                                                <td className='border border-black bg-zinc-300 text-center'>PESO (Kg)</td>
                                                <td className='border border-black  text-center'>19.9</td>
                                                <td className='border border-black bg-zinc-300 text-center'>TALLA (cm)</td>
                                                <td className='border border-black  text-center'>110</td>
                                                <td className='border border-black bg-zinc-300 text-center'>P.A. (mmHg) </td>
                                                <td className='border border-black  text-center'>___/___ </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className='w-full grid grid-cols-5'>
                                        <table className='border border-black border-collapse'>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={2} className='border border-black bg-zinc-300 text-center'>DE LA GESTANTE</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center w-4'>CPN (N°)</td>
                                                    <td className='border border-black text-center w-4'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>EDAD GEST</td>
                                                    <td className='border border-black text-center'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>ALTURA UTERINA</td>
                                                    <td className='border border-black text-center'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>PARTO VERTICAL</td>
                                                    <td className='border border-black text-center'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>CONTROL PUERP (N°)</td>
                                                    <td className='border border-black text-center'></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table>
                                             <tbody>
                                                <tr>
                                                    <td colSpan={5} className='border border-black bg-zinc-300 text-center font-semibold'>DEL RECIEN NACIDO</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center' colSpan={4}>CPN (N°)</td>
                                                    <td className='border border-black text-center'>s</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black text-center'>APGAR</td>
                                                    <td className='border border-black bg-zinc-300 text-center'>1°</td>
                                                    <td className='border border-black w-3'></td>
                                                    <td className='border border-black bg-zinc-300 text-center'>5°</td>
                                                    <td className='border border-black '></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center' colSpan={4}>Corte Tardío de Cordón (2 a 3 min)</td>
                                                    <td className='border border-black text-center w-10'></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className='col-span-2'>
                                            <tbody>
                                                <tr>
                                                     <td className='border border-black bg-zinc-300 text-center font-semibold'  colSpan={4}>GESTANTE / RN / NIÑO / ADOLESCENTE / JOVEN Y ADULTO / ADULTO MAYOR</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>CRED N°</td>
                                                    <td className='border border-black  text-center w-8'></td>
                                                    <td className='border border-black bg-zinc-300 text-center'>PAB (cm)</td>
                                                    <td className='border border-black  text-center w-7'></td>
                                                </tr>
                                                  <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>R.N. PREMATURO</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-zinc-300 text-center'>TAP/ EEDP o TEPSI</td>
                                                    <td className='border border-black  text-center '></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>BAJO PESO AL NACER</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-zinc-300 text-center'>CONSEJERIA NUTRICIONAL</td>
                                                    <td className='border border-black  text-center '></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>ENFER. CONGENITA / SECUELA AL NACER</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-zinc-300 text-center'>CONSEJERIA INTEGRAL</td>
                                                    <td className='border border-black  text-center '></td>
                                                </tr>
                                                  <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>N° FAMILIARES DE GEST / PUERP. CASA MAT.</td>
                                                    <td className='border border-black  text-center '></td>
                                                    <td className='border border-black bg-zinc-300 text-center'>IMC (Kg/M<sup>2</sup> )</td>
                                                    <td className='border border-black  text-center '></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                         <table className=' border-collapse'>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={2} className='border border-black bg-zinc-300 text-center font-semibold'>JOVEN Y ADULTO</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center w-3'>EVALUACIÓN INTEGRAL</td>
                                                    <td className='border border-black text-center w-3'></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2} className='border border-black bg-zinc-300 text-center font-semibold'>ADULTO MAYOR</td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>VACAM</td>
                                                    <td className='border border-black text-center'></td>
                                                </tr>
                                                <tr>
                                                    <td className='border border-black bg-zinc-300 text-center'>TAMIZAJE DE SALUD MENTAL</td>
                                                    <td className='border border-black text-center'></td>
                                                </tr>
                                                <tr>
                                                    <td className='text-red-500 text-right' colSpan={2}>PAT. O NOR</td>
                                                   
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div >
                                    <table className='border border-black w-full border-collapse'>
                                        <tbody>
                                            <tr>
<td colSpan={6} className='border border-black bg-zinc-300 text-center'>
                                                VACUNAS N° DE DOSIS
                                            </td>
                                            </tr>
                                            <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>BCG</td>
                                                <td  className='border border-black  text-center w-6'></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>INFLUENZA</td>
                                                <td  className='border border-black  text-center w-6'></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>ANTIAMARILICA</td>
                                                <td  className='border border-black  text-center w-6'></td>
                                            </tr>
                                            <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>DPT</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>PAROTID</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>ANTINEUMOC</td>
                                                <td  className='border border-black  text-center'></td>
                                            </tr>
                                            <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>APO</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>RUBEOLA</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>ANTITETANICA</td>
                                                <td  className='border border-black  text-center '></td>
                                            </tr>
                                            <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>ASA</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>ROTAVIRUS</td>
                                                <td  className='border border-black  text-center'></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>COMPLETAS PARA LA EDAD</td>
                                                <td  className='border border-black  text-center'></td>
                                            </tr>
                                            <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>SPR</td>
                                                <td  className='border border-black  text-center'></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>DT ADULTO (N° DOSIS)</td>
                                                <td  className='border border-black  text-center'></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>VPH</td>
                                                <td  className='border border-black  text-center '></td>
                                            </tr>
                                             <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>SR</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>IPV</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>OTRA VACUNA</td>
                                                <td  className='border border-black  text-center '></td>
                                            </tr>
                                             <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>HVB</td>
                                                <td  className='border border-black  text-center'></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>PENTAVAL</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black bg-zinc-300 text-center'>____________</td>
                                                <td  className='border border-black  text-center '></td>
                                            </tr>
                                            <tr >
                                                <td  className='border border-black bg-zinc-300 text-center'>GRUPO DE RIESGO HVB</td>
                                                <td  className='border border-black  text-center '></td>
                                                <td  className='border border-black  text-center' colSpan={4}  style={{fontSize:'6px'}}>
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
                                            <td colSpan={9} className='border border-black bg-zinc-300 font-semibold text-center'>DIAGNÓSTICOS</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={2} className='border border-black bg-zinc-300 font-semibold text-center'>N° </td>
                                            <td rowSpan={2} className='border border-black bg-zinc-300 font-semibold text-center'>DESCRIPCIÓN </td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center' colSpan={4}>INGRESO</td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center' colSpan={3}>EGRESO</td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center'>P</td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center'>D</td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center'>R</td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center'>CIE - 10</td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center'>D</td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center'>R</td>
                                            <td className='border border-black bg-zinc-300 font-semibold text-center'>CIE - 10</td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black font-semibold text-center'>1</td>
                                            <td className='border border-black font-semibold'>Pulpitis</td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'>X</td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'>K040</td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black font-semibold text-center'>2</td>
                                            <td className='border border-black font-semibold '></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black font-semibold text-center'>3</td>
                                            <td className='border border-black font-semibold '></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black font-semibold text-center'>4</td>
                                            <td className='border border-black font-semibold '></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black font-semibold text-center'>5</td>
                                            <td className='border border-black font-semibold '></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                        </tr>
                                        <tr>
                                            <td className='border border-black font-semibold text-center'>6</td>
                                            <td className='border border-black font-semibold '></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                            <td className='border border-black font-semibold text-center'></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ fontSize: '9px' }}> 
                                <table className='w-full'>
                                    <tbody>
                                    <tr>
                                        <td  className='border border-black bg-zinc-300 font-semibold text-center'>N° DE DNI</td>
                                        <td  className='border border-black bg-zinc-300 font-semibold text-center' colSpan={5}>NOMBRE DEL RESPONSABLE DE LA ATENCIÓN</td>
                                        <td  className='border border-black bg-zinc-300 font-semibold text-center' colSpan={2}>N° DE COLEGIATURA</td>
                                    </tr>
                                    <tr>
                                        <td className='border border-black text-center'>43298860</td>
                                        <td className='border border-black text-center' colSpan={5}>Herrera ISIDRO PILAR </td>
                                        <td className='border border-black text-center' colSpan={2}>27914</td>
                                    </tr>
                                    <tr>
                                        <td  className='border border-black bg-zinc-300 font-semibold text-center'>RESPONSABLE DE LA ATENCIÓN</td>
                                        <td className='border border-black text-center w-10'>3</td>
                                        <td  className='border border-black bg-zinc-300 font-semibold text-center'>ESPECIALIDAD</td>
                                        <td className='border border-black text-center'>Odontologo</td>
                                        <td  className='border border-black bg-zinc-300 font-semibold text-center'>N° RNE</td>
                                        <td className='border border-black text-center w-10'></td>
                                        <td  className='border border-black bg-zinc-300 font-semibold text-center'>EGRESADO</td>
                                        <td className='border border-black text-center w-10'></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table className='border border-collapse w-full'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={5}>
                                                1. MÉDICO 2. FARMACEUTICO 3. CIRUJANO DENTISTA 4. BIÓLOGO 5. OBSTETRIZ 6. ENFERMERA 7. TRABAJADORA SOCIAL 8. PSICOLOGA 9.TECNOLOGO MEDICO 10.NUTRICION 11. TECNICO ENFERMERIA 12. AUXILIAR DE ENFERMERIA 13. OTRO
                                            </td>
                                        </tr>
                                        <tr>
                                          
                                            <td colSpan={5}>
                                                <table className='w-full  border-collapse'>
                                                    <tbody>
                                                        <tr>
                                                            <td className=' border-black w-2/5'></td>
                                                            <td>
                                                                <table>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td colSpan={2} className='font-semibold'>FIRMA</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='font-semibold'>ASEGURADO</td>
                                                                            <td className='border border-black w-6'></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className='font-semibold'>APODERADO</td>
                                                                            <td className='border border-black w-6'></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td className='border-b border-black w-40'></td>
                                                           <td rowSpan={2} className="text-center align-middle">
  <div className="flex justify-center items-center w-full h-full">
    <div className="border border-black w-32 h-36">
      {/* contenido aquí si lo necesitas */}
    </div>
  </div>
</td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td className='grid grid-cols-1 font-semibold'><span>APODERADO:</span>   <span>NOMBRES Y APELLIDOS</span></td>
                                                            <td className='border-b border-black w-9'></td>
                                                        </tr>
                                                        <tr>
                                                            <td className='border-t border-black w-9 text-center'>FIRMA Y SELLO DEL RESPONSABLE DE LA ATENCIÓN</td>
                                                            <td className='font-semibold'>DNI o CE DEL APODERADO:</td>
                                                            <td className='border-b border-black w-9'></td>
                                                            <td className='text-center'>Huella Digital del Asegurado o del Apoderado</td>
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
            <div className="flex justify-center print-page-break">
                hola
            </div>
        </>
    )
}
