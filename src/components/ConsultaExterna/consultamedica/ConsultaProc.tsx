'use client'

import { CEDiagnostico } from './CEDiagnostico';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { Loading } from '@/components/utils/Loading';
import { GrFormNextLink } from 'react-icons/gr';
import { useCEDatosStore } from '@/store';
import axios from 'axios';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import Swal from 'sweetalert2';
export default function ConsultaProc({ handleTabChange, session, datosAtencion,cuentaDatos }: any) {
   const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>();
    const formRef = useRef<HTMLFormElement>(null);
    const setAtencionMedica=useCEDatosStore((state:any)=>state.setAtencionMedica);
   
    const getConcatenatedNomdx = (diagnosticos: any[]): string => {
        return diagnosticos
            .filter((diagnostico, index, self) => 
                self.findIndex((d) => d.codigoCIE10 === diagnostico.codigoCIE10) === index
            )
            .map((diagnostico) => `(${diagnostico?.nomdx})`)
            .join(', ');
    };
    const getCitaMedico = (medico: any): string => {
        const { apellidoPaterno, apellidomaterno, nombres } = medico.empleado;
        return `${apellidoPaterno} ${apellidomaterno} ${nombres}`.toUpperCase();
    };

    useEffect(() => {
            cuentaDatos?.CitaMotivo && setValue('citaMotivo',cuentaDatos?.CitaMotivo)
            cuentaDatos?.CitaExamenClinico && setValue('citaExamenClinico',cuentaDatos?.CitaExamenClinico)
    }, [cuentaDatos?.CitaMotivo,cuentaDatos?.CitaExamenClinico])
    

    


    const FormMotivo: SubmitHandler<any> = async (data: any) => {
     
        if(cuentaDatos?.diagnosticos.length==0){
            Swal.fire({
                icon: "error",
                title: "Advertencia",
                text: "Ingrese al menos un diagnostico.",
              });
            return;
        }        
        const concatenatedNomdx = getConcatenatedNomdx(cuentaDatos?.diagnosticos);        
        try {
            setIsSubmitting(true);
            const objectAtencionCe = {
                idAtencion: cuentaDatos?.idatencion,
                nroHistoriaClinica: parseInt(cuentaDatos?.NroHistoriaClinica, 10) || null,
                citaMedico: getCitaMedico(datosAtencion?.medico),
                citaServicioJamo: datosAtencion?.servicio?.nombre,
                citaIdServicio: cuentaDatos?.idServicio,
                citaMotivo: "",
                citaExamenClinico:"",
                citaDiagMed: concatenatedNomdx,
                citaIdUsuario: session?.user?.id,
                triajeEdad: cuentaDatos?.edad,
            };
            setAtencionMedica("","");
            await axios.post(`${process.env.apijimmynew}/atenciones/atencionce`, objectAtencionCe);
    
            if (cuentaDatos.diagnosticos.length > 0) {
                await axios.delete(`${process.env.apijimmynew}/consultaexterna/deletedxbyidatencion/${cuentaDatos?.idatencion}`);
                const requests = cuentaDatos.diagnosticos.map((data:any) => {
                    const DxSend = {
                        labConfHIS: data?.labConfHIS,
                        idAtencion: cuentaDatos?.idatencion,
                        idDiagnostico: data?.IdDiagnostico,
                        idSubclasificacionDx: data?.idSubclasificacionDx,
                        idClasificacionDx: 1,
                        idAtencionDiagnostico: cuentaDatos?.idatencion,
                        idUsuarioAuditoria: session?.user?.id,
                        idordenDx:null
                    };
                    return axios.post(`${process.env.apijimmynew}/diagnosticos/agregarAtencionDiagnostico`, DxSend);
                });
                try {
                    await Promise.all(requests);
                    handleTabChange('3');
                    ToasterMsj('Exito', 'success', 'Se pasará a órdenes médicas.');
                } catch (error) {
                    console.error("Error en solicitudes de diagnóstico:", error);
                    ToasterMsj('Error', 'error', 'Hubo un error al guardar los diagnósticos.');
                }
            } else {
                ToasterMsj('Exito', 'info', 'No hay diagnósticos para guardar');
            }
            setIsSubmitting(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error en la solicitud:", error.response?.data || error.message);
            } else {
                console.error("Error desconocido:", error);
            }
            ToasterMsj('Error', 'error', 'Ocurrió un error al procesar la solicitud.');
        }
    };


    const handleButtonClick = () => {
        handleSubmit(FormMotivo)();
    };
  return (

      <>
 <form ref={formRef} onSubmit={handleSubmit(FormMotivo)}>
                   

                </form>
            <div className='grid grid-cols-2 gap-3 mt-4 '>
               

                <CEDiagnostico />

                <div className="flex justify-end mt-12 col-span-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleButtonClick} 
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
