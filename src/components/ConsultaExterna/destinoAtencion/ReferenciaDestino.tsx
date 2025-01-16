import Select from 'react-select';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { getData } from '@/components/helper/axiosHelper';
import InputText from '../../ui/InputTextDefaultValue';
interface Establecimiento {
    value: string;
    label: string;
}
export const ReferenciaDestino = () => {
    const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>();
    const [optionsCombo, setOptionsCombo] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [destinoAtencion, setDestinoAtencion] = useState<any[]>();
    const [transporte, setTransporte] = useState<any[]>();
    const [destinoCondicion, setDestinoCondicion] = useState<any[]>();
    const [servicios, setservicios] = useState<any[]>();
    const [ups, setups] = useState<any[]>()
    const fecthDestinosAtencion=async()=>{
        const data=await getData(`${process.env.apijimmynew}/atenciones/destinoatencion/destinos`)
        setDestinoAtencion(data);
    }
    const fecthDestinoCondicion = async () => {
        const data = await getData(`${process.env.apijimmynew}/atenciones/destinoatencion/condicion`)
        setDestinoCondicion(data)
      }
    const fecthDestinostransporte=async()=>{
        const data=await getData(`${process.env.apijimmynew}/atenciones/destinoatencion/transporte`)
        setTransporte(data);
    }
    const fecthServicios=async()=>{
        const data=await getData(`${process.env.apijimmynew}/atenciones/destinoatencion/servicio`)
        setservicios(data)
    }
    const fecthUps=async()=>{
        const data=await getData(`${process.env.apijimmynew}/atenciones/destinoatencion/ups`)
        setups(data)
    }
    const loadOptions = useCallback(async (inputValue: string) => {
        setIsLoading(true);
        const fetchedOptions = await fetchOptions(inputValue);
        setOptionsCombo(fetchedOptions);
        setIsLoading(false);

    }, []);
    useEffect(() => {
        fecthDestinosAtencion()
        fecthDestinostransporte()
        fecthDestinoCondicion()
        fecthServicios()
        fecthUps()
    }, [])
    
    const fetchOptions = async (establecimiento: string): Promise<Establecimiento[]> => {
        try {
            const response = await axios.get(`${process.env.apiurl}/Establecimientos/${establecimiento}`);
            return response.data.map((est: any) => ({
                value: est.codigo,
                label: est.nombre
            }));
        } catch (error) {
            console.error(error);
            return [];
        }
    };
      useEffect(() => {
        if (inputValue && inputValue.length >= 3) {
            loadOptions(inputValue); 
        } else {
            setOptionsCombo([]); 
        }
        }, [inputValue, loadOptions]);
    return (
        <fieldset className='border p-3 mt-4 rounded-lg'>
            <legend className='font-bold'>Modulo Interconsultas</legend>
            <h2>Referencia Destino</h2>
            <form action="" className='flex flex-col gap-3'>
                <Controller
                    name="referenciaCodigo" // Nombre del campo en el formulario
                    control={control}
                    defaultValue="" // Valor predeterminado
                    render={({ field }) => (
                        <Select
                            inputId="select-establecimientos"
                            options={optionsCombo}
                            className='w-full'
                            placeholder={isLoading ? 'Cargando...' : 'Seleccione un establecimiento'}
                            isSearchable={true}
                            isLoading={isLoading}
                            required={true}
                            {...field}
                            onInputChange={setInputValue}
                        />
                    )}
                />
                Motivo: 
                    <select
                        {...register('destino')}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                    >
                        {destinoAtencion && destinoAtencion.length > 0 && destinoAtencion.map((opcion: any) => {
                            return (
                                <option key={opcion.id_motivo_ref} value={opcion.id_motivo_ref}>
                                    {opcion.desc_motivo_ref}
                                </option>
                            );
                        })}
                    </select>
Transporte:
                    <select
                        {...register('transporte')}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                    >
                        {transporte && transporte.length > 0 && transporte.map((opcion: any) => {
                            return (
                                <option key={opcion.id_transporte_ref} value={opcion.id_transporte_ref}>
                                    {opcion.desc_Transporte_ref}
                                </option>
                            );
                        })}
                    </select>
                    Condición:
                    <select
                        {...register('condicion')}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                    >
                        {destinoCondicion && destinoCondicion.length > 0 && destinoCondicion.map((opcion: any) => {
                            return (
                                <option key={opcion.id_condicion_ref} value={opcion.id_condicion_ref}>
                                    {opcion.desc_condicion_ref}
                                </option>
                            );
                        })}
                    </select>
                    Ups:
                    <select
                        {...register('ups')}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                    >
                        {ups && ups.length > 0 && ups.map((opcion: any) => {
                            return (
                                <option key={opcion.idUPS} value={opcion.idUPS}>
                                    {opcion.descripcion}
                                </option>
                            );
                        })}
                    </select>
                    Servicio:
                    <select
                        {...register('servicios')}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                    >
                        {servicios && servicios.length > 0 && servicios.map((opcion: any) => {
                            return (
                                <option key={opcion.id_especialidad_ref} value={opcion.id_especialidad_ref}>
                                    {opcion.desc_especialidad_ref}
                                </option>
                            );
                        })}
                    </select>
            </form>

        </fieldset>
    )
}
