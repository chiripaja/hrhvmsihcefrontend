'use client'
import React, { useState } from 'react'
import { CEFarmacia } from './CEFarmacia/CEFarmacia';
import { CEImagenes } from './CEImagenes/CEImagenes';
import { CgNotes } from 'react-icons/cg';
import { CELaboratorio } from './CELaboratorio/CELaboratorio';
import { CEOtros } from './CEOtros/CEOtros';
import { CEProcedimientosConsultorio } from './CEProcedimientosConsultorio/CEProcedimientosConsultorio';
import { Loading } from '@/components/utils/Loading';
import { GrFormNextLink } from 'react-icons/gr';
import { ToasterMsj } from '@/components/utils/ToasterMsj';

export const CEOrdenesGeneral = ({ session,handleTabChange }: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const DestinoAtencion=()=>{
        setIsSubmitting(true)
        ToasterMsj('Correcto', 'success', 'Se pasará a Destino de Atencion.');
        handleTabChange('4')
        setIsSubmitting(false)
    }
    return (
        <>

            <div className='grid grid-cols-2 gap-3 mt-4' >
                <CEFarmacia/>
                <CELaboratorio/>
                <CEImagenes /> 
                 <CEOtros session={session} />
                <CEProcedimientosConsultorio session={session} />{/**/ }
                    <div className="flex justify-end mt-6 col-span-2">
                                        <button
                                            type="button"
                                            onClick={DestinoAtencion}
                                            disabled={isSubmitting}
                                            className={`flex items-center px-4 py-2 rounded focus:outline-none ${isSubmitting ? 'bg-gray-400' : 'colorFondo'} text-white`}
                                        >
                                            {isSubmitting ? (
                                                <Loading />
                                            ) : (
                                                <>
                                                    Guardar y continuar
                                                    <GrFormNextLink className="ml-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                
            </div>


        </>
    )
}
