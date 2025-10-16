import Imagenologia from '@/components/reportes/Imagenologia/Imagenologia'
import React from 'react'

export default function Imagenologiapage(props:any) {
  return (
    <Imagenologia idcuenta={props.params.idcuenta}/>
  )
}
