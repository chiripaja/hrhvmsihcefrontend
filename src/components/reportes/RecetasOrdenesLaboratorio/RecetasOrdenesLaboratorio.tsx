'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useEffect, useState } from 'react'
import { SeccionImpresion } from '../RecetasOrdenesImagenes/SeccionImpresion';

export const RecetasOrdenesLaboratorio = ({ idcuentaatencion }: any) => {
    const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
    const [datosAtencion, setdatosAtencion] = useState<any>([]);
    const [datosPatologiaClinica, setdatosPatologiaClinica] = useState<any>([]);
    const [datosAnatomiaPatologica, setdatosAnatomiaPatologica] = useState<any>([]);
    const [datosBancoSangre, setdatosBancoSangre] = useState<any>([]);

    const [isPxGeneralLoaded, setIsPxGeneralLoaded] = useState(false);
    const [isAtencionLoaded, setIsAtencionLoaded] = useState(false);
    const [isImagenesLoaded, setIsImagenesLoaded] = useState(false);
    useEffect(() => {
        if (idcuentaatencion) {
            getDatosHC(idcuentaatencion)
            getdatosAtencion(idcuentaatencion)
        }
    }, [idcuentaatencion])
    const getDatosHC = async (idcuenta: any) => {
        const response = await getData(`${process.env.apijimmynew}/atenciones/${idcuenta}`);
        setdatosPxGeneral(response)
        setIsPxGeneralLoaded(true);
    }
    const getdatosAtencion = async (idcuenta: any) => {
        const datosAtencion = await getData(`${process.env.apijimmynew}/atenciones/findByIdCuentaAtencion/${idcuenta}`);
        setdatosAtencion(datosAtencion)
        setIsAtencionLoaded(true);
    }

    const getLaboratorioByCuenta = async (idcuenta: any) => {
        const data = await getData(`${process.env.apijimmynew}/recetas/apiordenesmedicasbycuenta/${idcuenta}`)
        console.log(data)
        setdatosPatologiaClinica(data.filter((data: any) => data.IdPuntoCarga == 2))
        setdatosAnatomiaPatologica(data.filter((data: any) => data.IdPuntoCarga == 3))
        setdatosBancoSangre(data.filter((data: any) => data.IdPuntoCarga == 11))
        setIsImagenesLoaded(true);
    }

    useEffect(() => {
        if (datosAtencion?.idCuentaAtencion) {
            getLaboratorioByCuenta(datosAtencion?.idCuentaAtencion)
        }
    }, [datosAtencion?.idCuentaAtencion])
  const secciones = [
    datosAnatomiaPatologica,
    datosPatologiaClinica,
    datosBancoSangre
  ].filter((datos) => datos.length > 0);


   useEffect(() => {
    if (isPxGeneralLoaded && isAtencionLoaded && isImagenesLoaded) {
      setTimeout(() => {
        window.print();
      }, 500); // espera a que todo pinte en pantalla
    }
  }, [isPxGeneralLoaded, isAtencionLoaded, isImagenesLoaded]);
    return (
           <>
             {secciones.map((datos, index) => (
               <SeccionImpresion
                 key={index}
                 datosPxGeneral={datosPxGeneral}
                 datos={datos}
                 datosAtencion={datosAtencion}
                 isLast={index === secciones.length - 1}
               />
             ))}
           </>
    )
}
