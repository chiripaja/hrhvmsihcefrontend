import { FormatoTeleconsulta } from '@/components/reportes/FormatoTeleconsulta/FormatoTeleconsulta'
import React from 'react'

export default function page(props:any) {
  return (
       <FormatoTeleconsulta idcuentaatencion={props.params.idcuenta}/>
  )
}
