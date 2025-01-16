'use client';
import axios from "axios";
import { useSession } from "next-auth/react";
import { stringify } from "querystring";
import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
import Swal from "sweetalert2";

import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

export const ReprogramarCita = () => {

    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors, isValid }, } = useForm<any>({ mode: 'onChange', })

    // REPORGRAMACION POR CUENTA
    const [error, setError] = useState<any>();
    const [cta, setCta] = useState<any>('');
    const [cita, setCita] = useState<any>();
    const [progra, setProgra] = useState<any>();
    const [repro, setRepro] = useState<any>();
    const [horaselec, setHoraselec] = useState<any>();
    const [medpro, setMedprog] = useState<any>();
    const session = useSession()
    const buscarcita = () => {
        citadatos()
    }    
    const ctacargar = (event: ChangeEvent<any>) => {
        setCta(event.target.value)
    }
    const citadatos = async () => {
        setCita('')
        setProgra('')
        setRepro('')
        setMedprog('')
        try{
            const { data } = await axios.get(`${process.env.apiurl}/Repro/Buscar/${cta}`)     
                
            setCita(data)
            const idespecialidad = data.idEspecialidad
            const especialidad = data.servicio

            const datad  = await axios.get(`${process.env.apiurl}/Repro/Opciones/${especialidad}`)
          
            setProgra(datad.data)
            setError('')
        }catch{
            setError(1)
        }
    }
    const handleReproChange = (event: ChangeEvent<any>) => {
        selehora(event.target.value)
        setMedprog(event.target.value)
    }
    const selehora = async (idprogra: any) => {
        const data = await axios.get(`${process.env.apiurl}/Repro/Dispone/${idprogra}`)
        setRepro(data.data)
    }
    const handleHoraChange = (event: ChangeEvent<any>) => {
        setHoraselec(event.target.value)
    }
    const reprogramar = async () => {        
        if(medpro != '' && horaselec != '' && cta != ''){
            const datosreprogra = {
                idProgramacion: medpro,
                horaInicio: horaselec.substring(0, 5),
                idCuentaAtencion: cta,
                idUsuario: Number(session?.data?.user.id)
            }
            const data = await axios.post(`${process.env.apiurl}/Repro/Repro`, datosreprogra)
            const respuesta = data.data; 
            if (respuesta.exito) {
                if(respuesta.exito === 1){
                    setCita('')
                    setProgra('')
                    setRepro('')
                    setMedprog('')
                    setCta('')
                }
                Swal.fire({
                  title: 'Información',
                  text: respuesta.mensaje,
                  icon: respuesta.exito === 1 ? 'success' : 'warning',
                  confirmButtonText: 'Aceptar'
                });
            }
        }else{
            Swal.fire({
                title: 'Información',
                text: 'Error verifique los datos requeridos.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
        }       
    }

    // REPROGRAMACIÓN MASIVO 
    const [consultorio, setConsultorio] = useState<any>();
    const [optionComboConsultorio, setOptionComboConsultorio] = useState<any>([]);    
    const [inputValueConsultorio, setInputValueConsultorio] = useState<any>([]);
    const [idEspecialidad, setIdEspecialidad] = useState<any>('');    
    const [idEspecialidadID, setIdEspecialidadID] = useState<any>('');    
    const [idProgramacionId, setIdProgramacionId] = useState<any>();
    const [comboMedicos, setComboMedico] = useState<any>([]);   
    const [inputValueMedico, setInputValueMedico] = useState<any>('');
    const [origenDatos, setOrigenDatos] = useState<any>(1);
    const [fecha, setFecha] = useState<any>('');  

    // PARA QUE BUSQUE EL CONSULTORIO
    const SeleccionConsultorio = useCallback(async (inputValue: string) => { 
        if(inputValue != ''){
            const response = await axios.get(`${process.env.apiurl}/Repro/Opciones/${inputValue}`) 
            setIdEspecialidad(response.data)   
            const format = response.data.map((est: any) => ({
                value: est.idProgramacion,
                label: est.servicio+' - '+est.medico+' - '+est.fecha+' - '+est.horaInicio              
            }));        
            setOptionComboConsultorio(format);
        }        
    }, []);
    // se ejecute la busqueda detecta texto en inputValueConsultorio
    useEffect(() => {
        if (inputValueConsultorio) {
            SeleccionConsultorio(inputValueConsultorio);
        }
    }, [inputValueConsultorio]);
    
    // AL termino de la seleccion guarda id IdProgramacion e IdEpecialidad
    const handleConsultorioChange = (selectedOption:any, field:any) => {        
        const verdata = idEspecialidad.filter((data:any) => data.idProgramacion == selectedOption.value)      
        setIdEspecialidadID(verdata[0].idEspecialidad)
        setIdProgramacionId(verdata[0].idProgramacion)
    };
        
    const buscarMedicosAfines = async (idEspecialidadID: any) => {              
        const response = await axios.get(`${process.env.apiurl}/Medicos/${idEspecialidadID}`)
        const format = response.data.map((est: any) => ({
            value: est.idMedico,
            label: est.medico
        }));        
        setComboMedico(format);        
    }
    useEffect(() => {
        if (idEspecialidadID) {
            buscarMedicosAfines(idEspecialidadID);
        }
    }, [idEspecialidadID]);

    
    const origenData = (origen: any) => {
        setOrigenDatos(origen)
    }
      
    const handleFechaChange = (event: ChangeEvent<any>) => {
        setFecha(event.target.value);
    }
    
    const handleMedicoChange = (datos: any) => {        
        setInputValueMedico(datos.value)
    };  

    const reprogramarMedico = async () => {
        if(origenDatos != '' && idProgramacionId != ''){
            let dataEnv:any = ''
            if(origenDatos == '1' && fecha != ''){
                dataEnv = {
                    "idProgramacion": idProgramacionId,
                    "fecha": fecha,
                    "idMedico": ""
                }
            }else if(origenDatos == '2' && inputValueMedico != ''){
                dataEnv = {
                    "idProgramacion": idProgramacionId,
                    "fecha": "",
                    "idMedico": inputValueMedico
                }
            }else{
                Swal.fire({
                    title: 'Información',
                    text: 'Error verifique los datos requeridos. (*)',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
            }
            if(dataEnv){
                const data = await axios.post(`${process.env.apiurl}/Repro/ReproProg`, dataEnv)
                if(data.data.exito == 1){
                    Swal.fire({
                        title: 'Aviso',
                        text: 'Registrado correctamente!!',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    setFecha(''); 
                    setInputValueMedico('');
                    setComboMedico([]);
                    setOptionComboConsultorio([]);
                    setInputValueConsultorio([]);
                }
            }            
        }else{
            Swal.fire({
                title: 'Información',
                text: 'Error verifique los datos requeridos. (*)',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    return (
        <>
            
            <div className="w-full bg-white rounded-lg shadow-md dark:bg-neutral-800">
                <div className="border-b border-gray-200 px-4 dark:border-neutral-700">
                    <nav className="flex gap-x-2" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                    <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 dark:focus:text-blue-500 active" id="basic-tabs-item-1" aria-selected="true" data-hs-tab="#basic-tabs-1" aria-controls="basic-tabs-1" role="tab">
                        Reprogramar Paciente.
                    </button>
                    <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 dark:focus:text-blue-500" id="basic-tabs-item-2" aria-selected="false" data-hs-tab="#basic-tabs-2" aria-controls="basic-tabs-2" role="tab">
                        Reprogramar Medica.
                    </button>
                    </nav>
                </div>

                <div className="mt-3 p-4">

                    <div id="basic-tabs-1" role="tabpanel" aria-labelledby="basic-tabs-item-1">
                        {/* PRIMER DIV */}
                           
                            <h4 className="text-3xl font-semibold text-gray-800 mb-6">Reprogramar Paciente</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-full">
                                            <input onChange={ctacargar} value={cta} className="peer h-full w-full border-b border-gray-300 bg-transparent pt-4 pb-2 text-sm text-gray-700 placeholder-transparent focus:border-blue-500 focus:outline-none" placeholder="N° Cuenta" />
                                            <label className="absolute left-0 top-2 text-sm text-gray-500 transform -translate-y-2 scale-75 origin-[0] transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:translate-y-2 peer-focus:scale-75 peer-focus:opacity-0">
                                                N° Cuenta
                                            </label>
                                        </div>
                                        <button type="button" onClick={buscarcita} className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Buscar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                    <>
                                        <h1 className="text-red-700"> Error Número de Cuenta No Encontrado!!! </h1>
                                    </>
                                )}
                            {cita && (
                                <>
                                    <form>
                                        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-inner">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Num. Documento:</label>
                                                    <span className="block px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
                                                        {cita.dni}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Paciente:</label>
                                                    <span className="block px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
                                                        {cita.paciente}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">IAFA:</label>
                                                    <span className="block px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
                                                        {cita.fuenteFinanciamiento}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Servicio:</label>
                                                    <span className="block px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
                                                        {cita.servicio}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">  </label>
                                                    <span className="block px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
                                                        {cita.tipoServicio}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Médico:</label>
                                                    <span className="block px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
                                                        {cita.usuario}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700"> Fecha Atención: </label>
                                                    <span className="block px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
                                                        {cita.fechaIngreso}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700"> REPROGRAMACIÓN </label>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700"> Médico </label>
                                                    <select onChange={handleReproChange} className="block px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800">
                                                        <option value=""> Seleccionar </option>
                                                        {progra && (
                                                            progra.map((data: any) => (                                                   
                                                                <option key={data.idProgramacion} value={data.idProgramacion}> {data.fecha} - {data.medico} - {data.servicio} </option>                                                   
                                                            ))
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    {repro && (
                                                        <>
                                                            <label className="text-sm font-medium text-gray-700"> Reprogramación - Hora </label>
                                                            <select onChange={handleHoraChange} className="block px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800">
                                                                <option value=""> Seleccionar </option>
                                                                {repro && (
                                                                    repro.map((data: any) => (                                                           
                                                                        <option key={data.id} value={data.hora}> {data.hora} </option>                                                           
                                                                    ))
                                                                )}
                                                            </select>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="md:col-span-4">
                                                    <div className="flex justify-end space-x-3">
                                                        <button type="button" onClick={reprogramar} className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                            REPROGRAMAR
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}

                        {/* PRIMER DIV FIN */}
                    </div>


                    <div id="basic-tabs-2" className="hidden" role="tabpanel" aria-labelledby="basic-tabs-item-2">
                        {/* SEGUNDO DIV */}
                                          
                            <h4 className="text-3xl font-semibold text-gray-800 mb-6">Reprogramar Médica</h4>
                            <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-inner">
                                
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700"> Consultorio (*) : </label>
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
                                    </div>

              
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">    
                                        <div className="border-b border-gray-200 dark:border-neutral-700">
                                            <nav className="flex gap-x-1" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                                                <button type="button" onClick={() => origenData(1)} className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 active" id="tabs-with-underline-item-1" aria-selected="true" data-hs-tab="#tabs-with-underline-1" aria-controls="tabs-with-underline-1" role="tab">
                                                    Fecha Programada
                                                </button>
                                                <button type="button" onClick={() => origenData(2)} className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500" id="tabs-with-underline-item-2" aria-selected="false" data-hs-tab="#tabs-with-underline-2" aria-controls="tabs-with-underline-2" role="tab">
                                                    Médico Reemplaza
                                                </button>
                                            </nav>
                                            </div>
                                            <div className="mt-3">
                                            <div id="tabs-with-underline-1" role="tabpanel" aria-labelledby="tabs-with-underline-item-1">                                            
                                                <p className="text-gray-500 dark:text-neutral-400">
                                                    Nueva Fecha (*) :
                                                </p>
                                                <input type="date" onChange={handleFechaChange} className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}/>
                                            </div>
                                            <div id="tabs-with-underline-2" className="hidden" role="tabpanel" aria-labelledby="tabs-with-underline-item-2">                                            
                                                <p className="text-gray-500 dark:text-neutral-400">
                                                    Medico Reemplaza (*) :
                                                </p>

                                                <Controller
                                                    name="medicos"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select                                    
                                                            options={comboMedicos} 
                                                            isSearchable={true}                                                            
                                                            {...field}                
                                                            onChange={(selectedOption) => handleMedicoChange(selectedOption)}                 
                                                        />
                                                    )}
                                                />

                                            </div>
                                        </div>
                                        <div className="">
                                        </div>                                    
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-4">
                                            <div className="flex justify-end space-x-3">
                                                <button type="button" onClick={() => reprogramarMedico()} className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    REPROGRAMAR
                                                </button>
                                            </div>
                                        </div>
                                    </div> 

                            </div>    
                            
                            {/* SEGUNDO DIV FIN */}
                        </div>
                        
                    </div>
                </div>

            </>
        )
    }
