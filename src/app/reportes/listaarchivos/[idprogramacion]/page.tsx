import ListaArchivoByIdProgramacion from '@/components/reportes/ArchivosListaImpresion/ListaArchivoByIdProgramacion'
import React from 'react'

export default function page({ params }: { params: { idprogramacion: string } }) {
  return (
<>
    <ListaArchivoByIdProgramacion idprogramacion={params.idprogramacion} />
</>
  )
}
