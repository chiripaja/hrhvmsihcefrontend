import { getData } from '@/components/helper/axiosHelper'
import Select from 'react-select';
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
export const FormAdmisionImg = ({ isModalOpen, closeModal, datosPx }: any) => {
    const [dataProgramaciones, setdataProgramaciones] = useState<any[]>([])
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const getProgramacion = async () => {
        const data = await getData(`${process.env.apijimmynew}/programacionordenes`)

        const mappedOptionsOrigenAtencion = data.map((est: any) => ({
            value: est.idProgramacionOrdenes,
            label: `${est.fecha?.trim() + " " + est.catalogOrdenes?.nombreExamen}`
        }));
        setdataProgramaciones(mappedOptionsOrigenAtencion)
    }
    useEffect(() => {

        getProgramacion()
    }, [])

    useEffect(() => {
        if (datosPx) {
            reset({
                Telefono: datosPx?.Telefono || '', // u otro nombre según lo que recibas
            });
        }
    }, [datosPx, reset]);
    const FormImg=async(data:any)=>{
        console.log(data)

    }
    return (
        <>
            <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>
                <form 
                onSubmit={handleSubmit(FormImg)}
                className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Admisión a Imagenología</h3>
                        <p className="text-sm text-gray-500">Datos del paciente y origen de atención</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                        <div>
                            <span className="font-medium text-gray-800">Nombre:</span> {datosPx?.NombreCompleto}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Documento:</span> {datosPx?.NroDocumento}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Servicio:</span> {datosPx?.Descripcion?.trim()}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Examen:</span> {datosPx?.NombreExamen}
                        </div>

                        <div>
                            <span className="font-medium text-gray-800">Procedencia:</span> {datosPx?.nomServicio}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Edad:</span> {datosPx?.edad}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Fecha Atención:</span>
                            <div className="mt-1">
                                <Controller
                                    name="IdOrigenAtencion"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Este campo es obligatorio' }} 
                                    render={({ field }) => (
                                        <Select
                                            instanceId="unique-select-id2"
                                            {...field}
                                            className='w-full'
                                            options={dataProgramaciones}
                                            placeholder="Seleccione..."
                                            required={true}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                            value={field.value}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <span className="font-medium text-gray-800">Celular:</span>
                            <div className="mt-1">
                                <input type="text"  {...register('Telefono')} className='px-3 py-2 border border-gray-300  w-full rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500;' placeholder='Celular' />
                            </div>
                        </div>

                        <div>
                            <button  className="py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">Guardar</button>
                        </div>

                    </div>
                </form>


                <div className="mt-6 flex justify-end">
                    <button
                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={closeModal}
                    >
                        Cerrar
                    </button>
                </div>
            </ModalGeneric>


        </>

    )
}
