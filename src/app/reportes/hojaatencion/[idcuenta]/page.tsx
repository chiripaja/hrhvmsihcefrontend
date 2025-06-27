import { HojaAtencion } from '@/components/reportes/HojaAtencion/HojaAtencion'
import React from 'react'

export default function HojaAtencionPage(props:any) {

  return (
   <HojaAtencion idcuentaatencion={props.params.idcuenta} />
  )
}
