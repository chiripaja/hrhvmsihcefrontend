'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Select from 'react-select';
import Swal from "sweetalert2";
import { FormNuevoUsuario } from './FormNuevoUsuario';
import { ModalGenerico } from "../ui/ModalGenerico";
import { FiFile, FiPrinter } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";
import { TicketImpresion } from "./TicketImpresion";
import { useSession } from "next-auth/react";
import { RiDeleteBin6Line, RiH1 } from "react-icons/ri";
import { FormPaciente } from "./FormPaciente";
import { FormPacientev2 } from "./FormPacientev2";
import { Tooltip } from '../ui/Tooltip';
import { useRouter } from "next/router";
import Link from 'next/link';
type InputBusquedadDni = {
    dni: string,
    idDocIdentidad: string,
}

type formAdmision = {
    idPaciente: number,
    idProgramacion: number,
    idIafa: any,
    referenciaCodigo: any,
    referenciaNumero: string,
    esAdicional: number,
}

interface Establecimiento {
    value: string;
    label: string;
}

const showAlert = (title: any, html: any) => {
    Swal.fire({
        title: `<span>${title}</span>`,
        html: `<h5>${html}</h5>`,
        timer: 5000,
        timerProgressBar: true,
        icon: 'error',
    });
};

const showAlertSuccess = (title: any, html: any) => {
    Swal.fire({
        title: `<span>${title}</span>`,
        html: `<h5>${html}</h5>`,
        timer: 5000,
        timerProgressBar: true,
        icon: 'success',
    });
};

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


const fetchOptionsByCodigo = async (codigo: string): Promise<Establecimiento[]> => {
    try {
        const response = await axios.get(`${process.env.apiurl}/Totem/Establecimientos/${codigo}`);
        return response.data.map((est: any) => ({
            value: est.codigo,
            label: est.nombre
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
};





export const FormAdmision = (data: any) => {

    const referenciaInputRef = useRef<HTMLInputElement>(null);
    const { diactual } = data
    const { ffFinanciamiento } = data;
    const { consultorio } = data;
    const { tipoDoc } = data;
    const { usuario } = data;
    const [nearest, setNearest] = useState<any>(null);
    const [optionsCombo, setOptionsCombo] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [datospx, setDatospx] = useState<any>();
    const [activeIndex, setActiveIndex] = useState(null);
    const [datosConsultorio, setDatosConsultorio] = useState<any>();
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [listadoProgramacion, setListadoProgramacion] = useState<any[]>([])
    const [cargandoLista, setCargandoLista] = useState(false)
    const [isLoadingAdmisionar, setIsLoadingAdmisionar] = useState(false);
    const [shouldPrint, setShouldPrint] = useState(false);
    const [enableNewUser, setEnableNewUser] = useState(false);
    const [validacionListarIafas, setValidacionListarIafas] = useState(0);

    const loadOptions = useCallback(async (inputValue: string) => {
        setIsLoading(true);
        const fetchedOptions = await fetchOptions(inputValue);
        setOptionsCombo(fetchedOptions);
        setIsLoading(false);

    }, []);


    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const verdata = async (data: any, index: any) => {
        setCargandoLista(true);
        setDatosConsultorio(data);
        setActiveIndex(index);
        cargarListadoProgramados(data?.idProgramacion);
        setCargandoLista(false);
    }

    const cargarListadoProgramados = async (idprogramacion: any) => {
        try {
            const dataProgramacion = await axios.get(`${process.env.apiurl}/Citados/${idprogramacion}`);
            const filteredData = dataProgramacion?.data.filter((data: any) => data?.idCuentaAtencion !== 0);
            setListadoProgramacion(filteredData);
        } catch (error) {
            console.error("Error al cargar el listado programado:", error);
            console.error(error);
        }
    }

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        watch: watch2,
        reset: reset2,
        formState: { errors: errors2, isValid: isValid2 },
    } = useForm<InputBusquedadDni>({
        mode: 'onChange',
    })

    const { control, register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<formAdmision>();

    const BuscadorDni: SubmitHandler<InputBusquedadDni> = async (formdata) => {
        setEnableNewUser(false)
        try {
            setDatospx(null)
            setValue('idIafa', "")
            setValue('referenciaNumero', "")
            setValue('referenciaCodigo', "")
            setbuttonLoading(true)
            const dataEnvio = {
                ip: "string",
                usuario: usuario.user.id,
                endPoint: "string",
                fechaConsulta: "string",
                tipoDocumento: "string",
                numeroDocumento: "string"
            }
            const { data }: any = await axios.post(`${process.env.apiurl}/Totem/SolicitaAdmitir?dni=${formdata?.dni}&idDocIdentidad=${formdata?.idDocIdentidad}`, dataEnvio)
            if (data?.paciente?.idPaciente) {
                setDatospx(data);
                if (data?.sisRpta?.exito == '1') {
                    setValue('idIafa', 3)
                }
                else {
                    setValue('idIafa', 5)
                }
            } else {
                setEnableNewUser(true)
                showAlert("Atencion", "paciente no encontrado.")
            }

            if (data?.paciente?.exito == '1' && data?.sis?.codError == '1001') {
                showAlert("Atencion", "Paciente no posee SIS.")
                setValidacionListarIafas(3)
            }
            else if (data?.paciente?.exito == '1' && data?.sis?.codError == '0000') {
                showAlertSuccess("Atencion", "Paciente si posee SIS.")
                setValidacionListarIafas(1)
            } else if (data?.sis?.codError == '9001' || data?.sis?.codError == 'TIME') {
                showAlert("Atencion", "Consultas SIS esta fallando rellenar manual.")
                setValidacionListarIafas(0)
            }
            if (data?.sis?.eess) {
                await AutoseleccionEstablecimiento(data?.sis?.eess.slice(-5))
            }
            setbuttonLoading(false)
        } catch (error) {
            setDatospx(null)
            setbuttonLoading(true)
            setEnableNewUser(true)
            showAlert("Atencion", "DNI no encontrado.")
            setbuttonLoading(false)
            console.error(error);
        }
    }

    const AutoseleccionEstablecimiento = async (codigo: string) => {
        setIsLoading(true);
        const fetchedOptions = await fetchOptionsByCodigo(codigo);
        setOptionsCombo(fetchedOptions);
        if (fetchedOptions.length > 0) {
            setValue('referenciaCodigo', fetchedOptions[0]);
        }
        setIsLoading(false);
    }

    const AdmisionarPx: SubmitHandler<formAdmision> = async (formData: any) => {
        setIsLoadingAdmisionar(true)
        if (formData.idIafa === 3) {
            if (!formData?.idPaciente) {
                showAlert("Atencion", "No se encuentra al paciente.")
                setIsLoadingAdmisionar(false);
            }
            else if (!formData?.idProgramacion) {
                showAlert("Atencion", "Seleccionar consultorio.")
                setIsLoadingAdmisionar(false);
            } else {
                try {
                    const convertData = async () => {
                        return {
                            ...formData,
                            idIafa: parseInt(formData?.idIafa, 10),
                            referenciaCodigo: formData?.referenciaCodigo?.value,
                            idUsuario: parseInt(usuario?.user?.id, 10),
                            esAdicional: parseInt(formData?.esAdicional, 10),
                        };
                    };
                    const convertedData = await convertData();

                    const data = await axios.post(`${process.env.apiurl}/AdmisionGuardar`, convertedData);
                    cargarListadoProgramados(convertedData?.idProgramacion)
                    if (data?.data?.exito == '1') {
                        limpiarCampos();
                        impresionTicket(data?.data?.idCuentaAtencion);
                    }
                    else {
                        showAlert("Atencion", data?.data?.mensaje)
                    }
                } catch (error) {
                    showAlert("Atencion", error);
                    console.error(error);
                } finally {
                    setIsLoadingAdmisionar(false);
                }
            }
        } else {
            if (!formData?.idPaciente) {
                showAlert("Atencion", "Seleccionar paciente.")
                setIsLoadingAdmisionar(false);
            }
            else if (!formData?.idProgramacion) {
                showAlert("Atencion", "Seleccionar consultorio.")
                setIsLoadingAdmisionar(false);
            } else {
                try {
                    const convertData = async () => {
                        return {
                            ...formData,
                            idIafa: parseInt(formData?.idIafa, 10),
                            idUsuario: parseInt(usuario?.user?.id, 10),
                            esAdicional: parseInt(formData?.esAdicional, 10),
                        };
                    };
                    const convertedData = await convertData();
                    const data = await axios.post(`${process.env.apiurl}/AdmisionGuardar`, convertedData);
                    cargarListadoProgramados(convertedData?.idProgramacion)
                    if (data?.data?.exito == '1') {
                        limpiarCampos();
                        impresionTicket(data?.data?.idCuentaAtencion);
                    }
                    else {
                        showAlert("Atencion", data?.data?.mensaje)
                    }
                } catch (error) {
                    showAlert("Atencion", error);
                    console.error(error);
                } finally {
                    setIsLoadingAdmisionar(false);
                }
            }
        }
    }

    const impresionTicket = async (numcuenta: any) => {
        const { data } = await axios.get(`${process.env.apiurl}/TicketAdmision/${numcuenta}`)
        await setNearest(data)
        setShouldPrint(true);
    }



    const AnularCuenta = async (idcita: any, idprogramacion: any) => {
        Swal.fire({
            title: "¿Seguro que quieres eliminarlo?",
            showDenyButton: true,
            confirmButtonText: "Si",
            denyButtonText: `No, Cancelar`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.get(`${process.env.apiurl}/CitaAnula/${idcita}/${usuario.user.id}`);
                    cargarListadoProgramados(idprogramacion)
                    Swal.fire("Se eliminó la cuenta correctamente!", "", "success");
                } catch (error) {
                    Swal.fire("Hubo un error al eliminar la cuenta.", "", "error");
                    console.error(error);
                }
            }
        });
    }

    const limpiarCampos = () => {
        setDatosConsultorio(null);
        setDatospx(null);
        reset2();
        reset();
        setActiveIndex(null);
    }

    const selectedTipoDocumento = watch2('idDocIdentidad', '1');
    const dniValue = watch2('dni', '');
    useEffect(() => {
        if (selectedTipoDocumento === '1' && dniValue.length > 8) {
            setValue2('dni', dniValue.slice(0, 8)); // Limita el valor a 8 dígitos
        }
    }, [selectedTipoDocumento, dniValue, setValue2]);

    const idIafaValue = watch('idIafa');

    useEffect(() => {
        if (inputValue) {
            loadOptions(inputValue);
        } else {
            setOptionsCombo([]);
        }
    }, [inputValue, loadOptions]);

    useEffect(() => {
        setActiveIndex(null);
        setDatosConsultorio(null);
        setDatospx(null);
        reset2();
        reset();
        setListadoProgramacion([]);
    }, [consultorio])

    useEffect(() => {
        if (datospx?.paciente?.idPaciente) {
            setValue('idPaciente', datospx.paciente.idPaciente);
        }
    }, [datospx, setValue]);

    useEffect(() => {
        if (datosConsultorio?.idProgramacion) {
            setValue('idProgramacion', datosConsultorio?.idProgramacion)
        }
    }, [datosConsultorio, setValue])

    const idIafa = watch('idIafa');
    useEffect(() => {
        if (idIafa) {
            setValue('referenciaCodigo', '');
            setValue('referenciaNumero', '');
        }
    }, [idIafa]);

    useEffect(() => {
        if (shouldPrint && nearest) {
            print();
            setShouldPrint(false);
        }
    }, [nearest, shouldPrint]);

    useEffect(() => {
        if (idIafaValue == 3 && referenciaInputRef.current) {
            referenciaInputRef.current.focus();
        }
    }, [idIafaValue]);



    if (data === null || data.consultorio === undefined) {
        return (
            <div className="bg-yellow-100 m-5 border border-yellow-300 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Aviso:</strong>
                <span className="block sm:inline"> Escoge alguna especialidad.</span>
            </div>
        );
    }

    return (
        <>
            <div className=" p-3 print:hidden ">
                <div className="flex justify-center ">

                    {enableNewUser && (
                        <button
                            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                            onClick={openModal}
                        >
                            Nuevo Paciente
                        </button>
                    )}
                    <ModalGenerico isOpen={isModalOpen} onClose={closeModal}>
                        <label className="text-lg font-semibold text-gray-900">Formulario Paciente</label>
                        <div className="text-sm text-gray-600">
                            <FormPacientev2 usuario={usuario} />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={closeModal}
                            >
                                Cerrar
                            </button>
                        </div>
                    </ModalGenerico>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 mt-3 gap-2">
                    {
                        consultorio?.map((data: any, index: number) => {
                            if (data.cuposLibres <= 0 && diactual !== data.fecha) {
                                return null; // No mostrar nada si no cumple la condición
                            }
                            return (

                                <div
                                    key={index}
                                    onClick={() => verdata(data, index)}
                                    className={`${data?.cuposLibres === '0' ? 'bg-orange-600 hover:bg-orange-500' : activeIndex === index ? 'bg-yellow-400 text-black font-semibold hover:bg-yellow-200' : 'bg-blue-500 text-white hover:bg-yellow-200'} 
shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:text-black rounded-lg p-4 sm:p-6 m-2 sm:m-4 flex items-center justify-center`}
                                >    <div className="text-center" >
                                        <div className="mt-2 text-xs sm:text-sm md:text-base">


                                            <p className="font-bold">{data?.fecha}</p>
                                            <p >{data.nombreServicio}
                                                <span className="font-bold">  ({(data.cuposLibres >= 0) ? data.cuposLibres : 0})</span>
                                            </p>
                                            <p >{data.nombreMedico}</p>
                                            <p className="font-bold"> ( {data.horaInicio} - {data.horaFin} )</p>
                                        </div>
                                    </div>
                                </div>

                            )
                        })
                    }
                </div>
                {(datosConsultorio?.cuposLibres <= 0) ? <>
                    <div className="p-4 mb-4 mt-3 text-sm text-red-700 rounded-lg bg-red-200 dark:bg-gray-800 dark:text-red-700" role="alert">
                        <span className="font-medium">Atencion!</span> Estara admisionando una cita adicional
                    </div>
                </> : <></>}
                {datosConsultorio?.nombreServicio && (
                    <>
                        <form onSubmit={handleSubmit2(BuscadorDni)}>
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                <select
                                    {...register2('idDocIdentidad')}
                                    defaultValue="1"
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                                >
                                    {tipoDoc && tipoDoc.length > 0 && tipoDoc.map((opcion: any) => {
                                        return (
                                            <option key={opcion.idDocIdentidad} value={opcion.idDocIdentidad}>
                                                {opcion.descripcion}
                                            </option>
                                        );
                                    })}
                                </select>

                                <input
                                    type="number"
                                    className="px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder=""
                                    autoComplete="off"
                                    maxLength={selectedTipoDocumento === '1' ? 8 : undefined}
                                    {...register2('dni', {
                                        maxLength: selectedTipoDocumento === '1' ? 8 : undefined,
                                    })}
                                />



                                <button
                                    type="submit"
                                    className={` text-white py-2 px-4 rounded-r-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2  
                                 ${isValid2 ? 'colorFondo' : 'bg-gray-300 cursor-not-allowed'}
                                 ${buttonLoading ? 'bg-gray-300 cursor-not-allowed' : ''}
                                 `}
                                    disabled={!isValid2 || buttonLoading}
                                >

                                    {!buttonLoading ? 'Buscar' : 'Cargando...'}

                                </button>
                                {errors2.dni && (
                                    <div className="text-red-500 text-sm mt-1 col-span-3 text-center">{errors2?.dni?.message}</div>
                                )}
                            </div>
                        </form>
                        {datospx?.paciente?.idPaciente && (
                            <>
                                <div className="flex ">
                                    <span className="border w-full text-center m-2 p-2">
                                        {datospx?.paciente?.apenom}
                                    </span>
                                </div>
                                <form onSubmit={handleSubmit(AdmisionarPx)}>
                                    <input
                                        type="text" className="hidden"
                                        {...register('esAdicional')}
                                        defaultValue={datosConsultorio?.cuposLibres <= 0 ? '1' : '0'}
                                    />
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <span className='text-center'>
                                            Financiamiento :
                                        </span>
                                        <select
                                            {...register('idIafa')}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        >
                                            {ffFinanciamiento && ffFinanciamiento.length > 0 && (() => {
                                                let opcionFormateado;

                                                // Verifica si data.idsis es igual a 1
                                                if (validacionListarIafas == 1) { // Cambia `true` a la condición real que necesitas
                                                    // Filtra el arreglo basado en la condición
                                                    opcionFormateado = ffFinanciamiento.filter((data: any) =>
                                                        data.idFuenteFinanciamiento === 3 || data.idFuenteFinanciamiento === 5
                                                    );
                                                } else if (validacionListarIafas == 3) {
                                                    opcionFormateado = ffFinanciamiento.filter((data: any) => data.idFuenteFinanciamiento != 3);
                                                } else if (validacionListarIafas == 0) {
                                                    opcionFormateado = ffFinanciamiento;
                                                } else {
                                                    opcionFormateado = ffFinanciamiento;
                                                }


                                                return opcionFormateado.map((item: any) => (
                                                    <option key={item.idFuenteFinanciamiento} value={item.idFuenteFinanciamiento}>
                                                        {item.descripcion}
                                                    </option>
                                                ));
                                            })()}
                                        </select>
                                    </div>


                                    {idIafaValue == 3 && (
                                        <div>
                                            <div className="grid grid-cols-1 gap-2 mt-3">
                                                <Controller
                                                    name="referenciaCodigo" // Nombre del campo en el formulario
                                                    control={control}
                                                    defaultValue="" // Valor predeterminado
                                                    render={({ field }) => (
                                                        <Select
                                                            inputId="select-establecimientos"
                                                            options={optionsCombo}
                                                            placeholder={isLoading ? 'Cargando...' : 'Seleccione un establecimiento'}
                                                            isSearchable={true}
                                                            isLoading={isLoading}
                                                            {...field}
                                                            onInputChange={setInputValue}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-3">
                                                <label className="text-center">Nro de Referencia : </label>
                                                <input
                                                    type="text"
                                                    className={` focus:ring-blue-500 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 
${errors.referenciaNumero ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                                    placeholder=""


                                                    {...register('referenciaNumero', { required: 'Este campo es obligatorio' })}
                                                />
                                                <div className="text-red-500 col-span-3 text-center">
                                                    {errors.referenciaNumero && <span>{errors.referenciaNumero.message}</span>}
                                                </div>

                                            </div>
                                        </div>
                                    )}





                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="submit"
                                            className={`flex justify-center items-center ${isLoadingAdmisionar ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 w-1/2 h-12`}
                                            disabled={isLoadingAdmisionar}
                                        >

                                            {isLoadingAdmisionar ? <AiOutlineLoading className="animate-spin" /> : <FaPlus />} &nbsp;
                                            {isLoadingAdmisionar ? 'Cargando...' : 'Admisionar'}

                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </>
                )}

                <div className="flex flex-col mt-4 ">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden h-fit"> {/* Establece la altura fija aquí */}
                                <div className="overflow-y-auto h-5/6"> {/* Habilita el scroll vertical */}
                                    {cargandoLista ? (
                                        <div className="flex items-center justify-center h-fit">
                                            <div className="rounded-full h-20 w-20 bg-blue-600 animate-ping"></div>
                                        </div>
                                    ) : listadoProgramacion && Array.isArray(listadoProgramacion) && listadoProgramacion.length === 0 ? (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-gray-500">No tiene datos</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className=" h-[39vh] m-1 overflow-auto">
                                                <table className="min-w-fit divide-y divide-gray-200 dark:divide-neutral-700 border ">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Nombres</th>
                                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Acción</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                        {listadoProgramacion.map((datalista: any) => {
                                                            const isCuentaAtencionNotZero = datalista?.idCuentaAtencion !== 0;
                                                            return (
                                                                <tr key={datalista?.idCita} className={isCuentaAtencionNotZero ? '' : 'bg-yellow-100'}>
                                                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                                                        {datalista?.paciente} ({datalista?.idCuentaAtencion})
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                                        <div className="flex  gap-y-1">
                                                                            <Tooltip text="Imprimir">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => impresionTicket(datalista?.idCuentaAtencion)}
                                                                                    className="py-2 px-3 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-transparent bg-yellow-500 text-gray-700  hover:bg-yellow-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                                >
                                                                                    <FiPrinter size={18} className="text-white hover: cursor-pointer" />
                                                                                </button>
                                                                            </Tooltip>
                                                                            <Tooltip text="Hoja Filiación">
                                                                                <a
                                                                                    href={`/reportes/historiaclinica/${datalista?.idCuentaAtencion}`}
                                                                                    target="_blank"
                                                                                    className="ml-3 py-2 px-3 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-transparent bg-blue-400 text-gray-700 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                                >

                                                                                    <FiFile size={18} className="text-white" />
                                                                                </a>
                                                                            </Tooltip>
                                                                            <Tooltip text="Eliminar">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => AnularCuenta(datalista?.idCita, datalista?.idProgramacion)}
                                                                                    className="ml-3 py-2 px-3 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-transparent bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
                                                                                >

                                                                                    <RiDeleteBin6Line size={18} className="text-red-200  hover:text-red-300 cursor-pointer" />

                                                                                </button>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </td>

                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>  </div>


                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {nearest && (
                <TicketImpresion Datos={nearest} />
            )}
        </>
    )
}
