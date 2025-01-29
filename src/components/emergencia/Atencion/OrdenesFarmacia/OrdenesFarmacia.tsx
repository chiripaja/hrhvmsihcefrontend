import { CEFarmacia } from '@/components/ConsultaExterna/orders/CEFarmacia/CEFarmacia'
import { CEImagenes } from '@/components/ConsultaExterna/orders/CEImagenes/CEImagenes'
import { CELaboratorio } from '@/components/ConsultaExterna/orders/CELaboratorio/CELaboratorio'
import { CEOtros } from '@/components/ConsultaExterna/orders/CEOtros/CEOtros'
import { CEProcedimientosConsultorio } from '@/components/ConsultaExterna/orders/CEProcedimientosConsultorio/CEProcedimientosConsultorio'
import { Loading } from '@/components/utils/Loading'
import React from 'react'
import { GrFormNextLink } from 'react-icons/gr'

export const OrdenesFarmacia = ({session}:any) => {
  return (
    
                <div className='grid grid-cols-2 gap-3 mt-4' >
                    <CEFarmacia/>
                    <CELaboratorio/>
                    <CEImagenes /> 
                     <CEOtros session={session} />
                    <CEProcedimientosConsultorio session={session} />{/**/ }
                      
                    
                </div>
  )
}
