'use client'
import { getData } from "@/components/helper/axiosHelper";

import { obtenerFechaYHora } from '@/components/utils/obtenerFechaYHora';
import Image from "next/image";
import { useEffect, useState } from "react";
import { SeccionImpresion } from "./SeccionImpresion";
export const RecetasOrdenesImagenes = ({ idcuentaatencion }: any) => {
  const { formattedDate, hora, fechayhora } = obtenerFechaYHora();
  const [datosPxGeneral, setdatosPxGeneral] = useState<any>();
  const [datosAtencion, setdatosAtencion] = useState<any>([]);
  const [datosRayosX, setdatosRayosX] = useState<any>([]);
  const [datosTomografia, setdatosTomografia] = useState<any>([]);
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

  const getImagenesByCuenta = async (idcuenta: any) => {
    const data = await getData(`${process.env.apijimmynew}/recetas/apiordenesmedicasbycuenta/${idcuenta}`)
    setdatosRayosX(data.filter((data: any) => data.IdPuntoCarga == 21))
    setdatosTomografia(data.filter((data: any) => data.IdPuntoCarga == 22))
  }



  useEffect(() => {
    if (datosAtencion?.idCuentaAtencion) {
      getImagenesByCuenta(datosAtencion?.idCuentaAtencion)
    }
  }, [datosAtencion?.idCuentaAtencion])



  return (
    <>
  <SeccionImpresion
    datosPxGeneral={datosPxGeneral}
    datos={datosRayosX}
    datosAtencion={datosAtencion}
   
  />

  <SeccionImpresion
    datosPxGeneral={datosPxGeneral}
    datos={datosTomografia}
    datosAtencion={datosAtencion}
  />
    </>

  )
}
