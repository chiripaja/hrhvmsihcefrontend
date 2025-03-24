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
import { ModalProps } from '@/components/ui/ModalProps/ModalProps';

export const CEConsultaGeneral = ({ handleTabChange, session, datosAtencion }: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const cuentaDatos = useCEDatosStore((state: any) => state.datosce);
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
        console.log(cuentaDatos?.diagnosticos.length)
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
                citaMotivo: data?.citaMotivo,
                citaExamenClinico: data?.citaExamenClinico,
                citaDiagMed: concatenatedNomdx,
                citaIdUsuario: session?.user?.id,
                triajeEdad: cuentaDatos?.edad,
            };
            setAtencionMedica(data?.citaMotivo,data?.citaExamenClinico);
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
     
            <div className='grid grid-cols-2 gap-3 mt-4'>
                <form ref={formRef} onSubmit={handleSubmit(FormMotivo)}>
                    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="border-l-4 borderfondo h-6 mr-2"></span>
                            Motivo
                        </h2>
                        <div className="flex flex-col items-center justify-center mt-6 w-full">
                            <textarea
                                {...register('citaMotivo', {
                                    required: 'El campo es obligatorio',
                                })}
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 placeholder-gray-400 resize-none shadow-inner"
                                rows={6}
                                placeholder="Escribe aquí el motivo..."
                            />
                            {errors.citaMotivo?.message && (
                                <p className="text-red-500 text-sm mt-1">
                                    {String(errors.citaMotivo.message)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4 mt-2">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <span className="border-l-4 borderfondo h-6 mr-2"></span>
                            Examen Clinico
                        </h2>
                        <div className="flex flex-col items-center justify-center mt-6 w-full">
                            <textarea
                                {...register('citaExamenClinico', {
                                    required: 'El campo es obligatorio',
                                })}
                                required
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 placeholder-gray-400 resize-none shadow-inner"
                                rows={6}
                                placeholder="Escribe aquí el motivo..."
                            />
                            {errors.citaExamenClinico?.message && (
                                <p className="text-red-500 text-sm mt-1">
                                    {String(errors.citaExamenClinico.message)}
                                </p>
                            )}
                        </div>
                    </div>
                </form>

                <CEDiagnostico />
                <div className="flex justify-end mt-6 col-span-2">
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
    );
};
