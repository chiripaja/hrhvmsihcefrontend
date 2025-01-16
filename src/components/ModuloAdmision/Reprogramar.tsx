'use client';
import axios from "axios";
import { useSession } from "next-auth/react";
import { stringify } from "querystring";
import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import Swal from "sweetalert2";
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });
import { useForm, SubmitHandler, Controller } from 'react-hook-form';


export const Reprogramar = () => {



    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors, isValid }, } = useForm<any>({ mode: 'onChange', })
    const [optionComboConsultorio, setOptionComboConsultorio] = useState<any>([]);
    const [optionComboConsultorio2, setOptionComboConsultorio2] = useState<any>([]);
    const [optionComboConsultorioRepro, setOptionComboConsultorioRepro] = useState<any>([]);
    const [idEspecialidad, setIdEspecialidad] = useState<any>('');
    const [inputValueConsultorio, setInputValueConsultorio] = useState<any>([]);
    const [inputValueConsultorioRepro, setInputValueConsultorioRepro] = useState<any>([]);
    const [idEspecialidadID, setIdEspecialidadID] = useState<any>('');
    const [idProgramacionId, setIdProgramacionId] = useState<any>();
    const [idServicio, setIdServicio] = useState<any>();
    const [fecha, setFecha] = useState<any>();
    const [dataListadoPX, setDataListadoPX] = useState<any>([]);
    const [dataListadoPX2, setDataListadoPX2] = useState<any>([]);
    const [optionComboMedNombre, setOptionComboMedNombre] = useState<any>([]);
    const [inputValueRepro, setInputValueRepro] = useState<any>([]);






    // PARA EL COMBO DE CONSULTORIO Y MEDICO inicio
    const SeleccionConsultorio = useCallback(async (inputValue: string) => {
        setOptionComboConsultorioRepro([])
        const concat = inputValue + " " + " "
        if (inputValue != '') {
            const response = await axios.get(`${process.env.apiurl}/Repro/Opciones/${concat}`)
            console.log(response)
            setIdEspecialidad(response.data)
            const format = response.data.map((est: any) => ({
                value: est.idProgramacion,
                label: est.servicio + ' - ' + est.medico + ' - ' + est.fecha + ' - ' + est.horaInicio
            }));
            setOptionComboConsultorio(format);
            setOptionComboConsultorio2(format);
            // para que cargue solo el nombre del los med a reprogramar
            const format2 = Array.from(new Set(response.data.map((est: any) => est.medico)))
                .map((medico) => {
                    const program = response.data.find((est: any) => est.medico === medico);
                    return {
                        value: program.idProgramacion,
                        label: medico
                    };
                });
            setOptionComboMedNombre(format2);
        }
    }, []);
    // cada vez que selecciones otro item del combo 
    const handleConsultorioChange = (selectedOption: any, field: any) => {
        const verdata = idEspecialidad.filter((data: any) => data.idProgramacion == selectedOption.value)
        // para cargar data en otro combo de reprogramacion
        setOptionComboConsultorioRepro([])
        const verdataRepro = optionComboConsultorio.filter((data: any) => data.value != verdata[0].idProgramacion)
        if (verdataRepro) {
            const formatRepro = verdataRepro.map((est: any) => ({
                value: est.value,
                label: est.label
            }));
            setOptionComboConsultorioRepro(formatRepro)
        }
        setIdEspecialidadID(verdata[0].idEspecialidad)
        setIdProgramacionId(verdata[0].idProgramacion)
        setIdServicio(verdata[0].idServicio)
        setFecha(verdata[0].fecha)
        ListadePxCitados(verdata[0].fecha, verdata[0].idServicio)
    };
    useEffect(() => {
        if (inputValueConsultorio) {
            SeleccionConsultorio(inputValueConsultorio);
        }
    }, [inputValueConsultorio]);
    // PARA EL COMBO DE CONSULTORIO Y MEDICO fin









    // PARA TRAER TODOS LOS PACIENTES DEL CONSULTORIO SELECCIONADO
    const ListadePxCitados = useCallback(async (fecha: string, idservicio: string) => {
        setDataListadoPX2([])
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Citados/${fecha}/${idservicio}`);
            const datafiltrada = data.filter((data: any) => data.idCuentaAtencion != 0);
            setDataListadoPX2(datafiltrada);
        } catch (error) {
            console.log(error);
        }
    }, []);

    //PARA EL COMBO DE CONSULTORIO Y MEDICO A REPORGRAMAR 
    const handleConsultorioReproChange = (selectedOption: any) => {
        const verdata = idEspecialidad.filter((data: any) => data.idProgramacion == selectedOption.value)
        ListadePxCitados2(verdata[0].fecha, verdata[0].idServicio)
        //para mostrar el CE programado cupos
        ListadodeCEProgra(selectedOption.label)
        console.log(selectedOption.label)
    };

    // trae px para la tabla reprogramacion
    const ListadePxCitados2 = useCallback(async (fecha: string, idservicio: string) => {
        setDataListadoPX([])
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Citados/${fecha}/${idservicio}`);
            const datafiltrada = data.filter((data: any) => data.idCuentaAtencion != 0);
            setDataListadoPX(datafiltrada);
        } catch (error) {
            console.log(error);
        }
    }, []);

    // Cuando optionComboConsultorioRepro cambia, limpiamos el valor del select
    useEffect(() => {
        setValue("consultorio_repro", null);
    }, [optionComboConsultorioRepro, setValue]);

    // Para trasladar por cuenta a otra lista 
    const handleDragStart = (event: React.DragEvent) => {
        //event.preventDefault();

        // const data = event.dataTransfer.getData("application/json");
        // const item = JSON.parse(data);

        console.log(event)
    }

    // para mostrar en la tabla de reprogra la cantidad de cupos
    const [ceprogra, setCeprogra] = useState<any>([]);
    console.log(ceprogra)
    const ListadodeCEProgra = useCallback(async (selec: any) => {
        setCeprogra([])
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Admision/CuposLibres`);
           
            setCeprogra(data);

        } catch (error) {
            console.log(error);
        }
    }, []);




    // Lista inicial de opciones disponibles y seleccionadas
    // const [availableItems, setAvailableItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    // const [selectedItems, setSelectedItems] = useState<any>([]);

    // // Mover un ítem a la lista de seleccionados
    // const selectItem = (item: any) => {
    //     setAvailableItems(availableItems.filter((i) => i !== item));
    //     setSelectedItems([...selectedItems, item]);
    // };

    // // Mover un ítem de vuelta a la lista de disponibles
    // const deselectItem = (item: any) => {
    //     setSelectedItems(selectedItems.filter((i) => i !== item));
    //     setAvailableItems([...availableItems, item]);
    // };


    const initialItems = [
        { id: 1, name: 'Item One' },
        { id: 2, name: 'Item Two' },
        { id: 3, name: 'Item Three' },
        { id: 4, name: 'Item Four' },
    ];

    // Estado para mantener los ítems disponibles y seleccionados
    const [availableItems, setAvailableItems] = useState<any>(initialItems);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    // Mover un ítem de disponibles a seleccionados
    const selectItem = (id: number) => {
        const selectedItem = availableItems.find((item: any) => item.id === id);
        if (selectedItem) {
            setAvailableItems(availableItems.filter((item: any) => item.id !== id));
            setSelectedItems([...selectedItems, selectedItem]);
        }
    };

    // Mover un ítem de seleccionados a disponibles
    const deselectItem = (id: number) => {
        const deselectedItem = selectedItems.find((item: any) => item.id === id);
        if (deselectedItem) {
            setSelectedItems(selectedItems.filter((item: any) => item.id !== id));
            setAvailableItems([...availableItems, deselectedItem]);
        }
    };

    // Mover todos los ítems de disponibles a seleccionados
    const selectAll = () => {
        setSelectedItems([...selectedItems, ...availableItems]);
        setAvailableItems([]);
    };

    // Mover todos los ítems de seleccionados a disponibles
    const deselectAll = () => {
        setAvailableItems([...availableItems, ...selectedItems]);
        setSelectedItems([]);
    };





    return (
        <>
            <div className="w-full bg-white rounded-lg shadow-md dark:bg-neutral-800">

                <div className="border-b border-gray-200 px-4 dark:border-neutral-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">

                      

                        </div>
                    </div>
                </div>

                <div className="mt-3 p-4">
                    <h4 className="text-3xl font-semibold text-gray-800 mb-6">Reprogramación</h4>
                    <div id="basic-tabs-1" role="tabpanel" aria-labelledby="basic-tabs-item-1">
                        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-inner">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        SELECCIONAR Consultorio / Médico:
                                    </label>
                                    <Controller
                                        name="consultorio"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={optionComboConsultorio}
                                                isSearchable={true}
                                                {...field}
                                                onInputChange={setInputValueConsultorio}
                                                onChange={(selectedOption) => handleConsultorioChange(selectedOption, field)}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        REPROGRAMAR Consultorio / Médico:
                                    </label>
                                    <Controller
                                        name="consultorio_repro"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={optionComboConsultorio2}
                                                isSearchable={true}
                                                {...field}
                                                // onInputChange={inputValueRepro}
                                                onChange={(selectedOpt) => handleConsultorioReproChange(selectedOpt)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {/* Lista de ítems disponibles */}
                                <div className="space-y-1">
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-lg font-bold mb-4">Available Items</h3>
                                        <ul className="border p-4 w-64 bg-white shadow-md rounded h-64 overflow-y-auto">
                                            {availableItems.map((item: any) => (
                                                <li key={item.id} className="flex justify-between mb-2 items-center">
                                                    <span>{item.name}</span>
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
                                                        onClick={() => selectItem(item.id)}
                                                    >
                                                        Select
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="space-y-2 flex flex-col items-center justify-center">
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                                        onClick={selectAll}
                                    >
                                        Select All
                                    </button>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                                        onClick={deselectAll}
                                    >
                                        Deselect All
                                    </button>
                                </div>

                                {/* Lista de ítems seleccionados */}
                                <div className="space-y-1">
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-lg font-bold mb-4">Selected Items</h3>
                                        <ul className="border p-4 w-64 bg-white shadow-md rounded h-64 overflow-y-auto">
                                            {selectedItems.map((item: any) => (
                                                <li key={item.id} className="flex justify-between mb-2 items-center">
                                                    <span>{item.name}</span>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                                                        onClick={() => deselectItem(item.id)}
                                                    >
                                                        Deselect
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>



                            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-4">
                                    <div className="flex justify-end space-x-3">
                                        <button type="button" className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Reprogramar</button>
                                    </div>
                                </div>
                            </div> */}


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
