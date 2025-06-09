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
                <table className='w-full'>
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
                                <table className='w-full border border-black border-collapse' style={{ fontSize: '11px' }}>
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
                                <div className='w-full  grid grid-cols-4  border  border-black' style={{ fontSize: '11px' }}>

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
                            <td style={{ fontSize: '11px' }}>
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
                                                            fontSize: '10px',
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
                            <div className='grid grid-cols-3' style={{fontSize:'9px'}}>
                                <div className='col-span-2'>

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
                                                <td  className='border border-black  text-center' colSpan={4}>
GRUPO DE RIESGO HVB: 1. TRABAJADOR DE SALUD 2. TRABAJAD. SEXUALES 3. HSH 4. PRIVADO LIBERTAD 5. FF. AA. 6. POLICIA NACIONAL  7. ESTUDIANTES DE SALUD 8. POLITRANFUNDIDOS 9. DROGO DEPENDIENTES

                                                </td>
                                               
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>

                            </div>
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
