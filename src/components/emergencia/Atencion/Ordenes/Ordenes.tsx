import { CEFarmacia } from '@/components/ConsultaExterna/orders/CEFarmacia/CEFarmacia'
import { CEImagenes } from '@/components/ConsultaExterna/orders/CEImagenes/CEImagenes'
import { CELaboratorio } from '@/components/ConsultaExterna/orders/CELaboratorio/CELaboratorio'
import { CEOtros } from '@/components/ConsultaExterna/orders/CEOtros/CEOtros'
import { CEProcedimientosConsultorio } from '@/components/ConsultaExterna/orders/CEProcedimientosConsultorio/CEProcedimientosConsultorio'
import React from 'react'
import { OrdenesFarmacia } from './OrdenesFarmacia/OrdenesFarmacia'

export const Ordenes = ({ datosEmergencia, session }: any) => {
    return (<>
        <h1>ordenes medicas emergencia</h1>
        <div className='grid grid-cols-2 gap-3 mt-4' >
            <OrdenesFarmacia datosEmergencia={datosEmergencia} session={session} />
            <CELaboratorio />
            <CEImagenes />
            <CEOtros session={session} />
            <CEProcedimientosConsultorio session={session} />{/**/}
        </div>
    </>
    )
}
