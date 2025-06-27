'use client'
import React, { useEffect, useState } from 'react'
import { getData } from "@/components/helper/axiosHelper";
export const RecetasInterconsulta = ({ idcuentaatencion }: any) => {
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


    const getInterconsulta = async (idatencion: any) => {
        const data = await getData(`${process.env.apijimmynew}/atenciones/interconsulta/${idatencion}`)
        setdatos(data)
    }

    useEffect(() => {
        if (datosPxGeneral?.idAtencion) {
            getInterconsulta(datosPxGeneral?.idAtencion)
        }

    }, [datosPxGeneral])


    useEffect(() => {

        if (datos?.length > 0) {
            //window.print()
        }
    }, [datos])
    return (
        <div className={`flex justify-center print-page-break`}>
 
            <div className="w-full max-w-md p-6 break-inside-avoid">
                {/* Encabezado */}
                <div className="text-center border-b pb-2 text-xs">
                    <h2 className="font-bold">HOSPITAL REGIONAL HERMINIO VALDIZÁN</h2>
                    <p>JIRÓN HERMILIO VALDIZAN NÚMERO 950 DISTRITO HUÁNUCO</p>
                    <p>TELÉFONO: (062)</p>
                </div>

                <div className="text-center">TICKET INTERCONSULTA</div>

                <div className="text-xs">Servicio: Interconsulta</div>
                <div className="text-xs">
                    Fecha/Hora Atencion: {datosPxGeneral?.FechaIngreso} {datosPxGeneral?.HoraEgreso}
                </div>

                <div className="text-xs flex justify-between">
                
                    <span>N° Cta: {datosPxGeneral?.idCuentaAtencion}</span>
                </div>

                <div className="text-xs">Consultorio: {datosPxGeneral?.servnom}</div>
                <div className="text-xs">
                    Prof. de la Salud : {datosPxGeneral?.MedicoPaterno} {datosPxGeneral?.MedicoMaterno} {datosPxGeneral?.MedicoNombres}
                </div>
                <div className="text-xs">Paciente: {datosPxGeneral?.nombreCompleto}</div>
                <div className="text-xs">Tipo Plan: {datosPxGeneral?.FuentesFinanciamiento}</div>



                <table className="w-full text-xs mt-2">
                    <thead className="border-b-2">
                        <tr>
                            <th className="text-left">Concepto</th>
                            <th>Cant.</th>
                        </tr>
                    </thead>
                    <tbody className="border-b-2">
                        {datos.map((item: any) => (
                            <tr key={item.motivo}>
                                <td>{item.Descripcion}</td>
                                <td>{item.Diagnostico}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-xs mt-2">Fecha: {datosPxGeneral?.FechaIngreso}</div>

                <div className="text-xs">Terminal: SRV-SIHCE</div>
            </div>
        </div>
    )
}
