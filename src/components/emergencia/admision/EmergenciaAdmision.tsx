'use client'
import Select from 'react-select';
import { getData } from "@/components/helper/axiosHelper";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import style from "./EmergenciaAdmision.module.css"
import { AiOutlineLoading } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import { EmergenciaTicket } from './EmergenciaTicket';
import { ModalGenerico } from '@/components/ui/ModalGenerico';
import { FormPacientev2 } from '@/components/ModuloAdmision/FormPacientev2';
import { CheckBox } from '../../ui/CheckBox';
type InputBusquedadDni = {
    dni: string,
    idDocIdentidad: string,
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

type formAdmisionEmergencia = {
    idPaciente: number,
    idIafa: any,
    referenciaCodigo: any,
    referenciaNumero: any,
    IdOrigenAtencion: any,
    IdServicio: any,
    IdMedicoIngreso: any,
    gravedadAtencion: any,
    Telefono: any,
    NombreAcompaniante: any,
    DireccionDomicilio: any
}
interface Establecimiento {
    value: string;
    label: string;
}
export const EmergenciaAdmision = ({ session }: any) => {
    const referenciaInputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [origenAtencion, setOrigenAtencion] = useState<any[]>([])
    const [optionMedicos, setoptionMedicos] = useState<any[]>([])
    const [optionSexo, setOptionSexo] = useState<any[]>([])
    const [gravedadAtencion, setGravedadAtencion] = useState<any[]>([])
    const [optionsCombo, setOptionsCombo] = useState<any[]>([]);
    const [enableNewUser, setEnableNewUser] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ffFinanciamiento, setffFinanciamiento] = useState<any[]>([]);
    const [tipoDoc, setTipoDoc] = useState<any>()
    const [datospx, setDatospx] = useState<any>();
    const [options, setOptions] = useState<any[]>([]);
    const [tickeEmergencia, setTickeEmergencia] = useState<any>()
    const [validacionListarIafas, setValidacionListarIafas] = useState(0);
    const [isLoadingAdmisionar, setIsLoadingAdmisionar] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numCuenta, setnumCuenta] = useState<any>();
    const [isChecked, setIsChecked] = useState(false);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<formAdmisionEmergencia>();
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        watch: watch2,
        reset: reset2,
        resetField: resetField2,
        formState: { errors: errors2, isValid: isValid2 },
    } = useForm<InputBusquedadDni>({
        mode: 'onChange',
    })

    const {
        control: control3,
        register: register3,
        handleSubmit: handleSubmit3,
        setValue: setValue3,
        watch: watch3,
        reset: reset3,
        resetField: resetField3,
        formState: { errors: errors3, isValid: isValid3 },
    } = useForm<any>({
        mode: 'onChange',
    })
    const FormEmergencia: SubmitHandler<formAdmisionEmergencia> = async (data: any) => {


        setTickeEmergencia({
            servicios: data?.IdServicio?.label,
            gravedadAtencion: data?.gravedadAtencion?.label,
            MedicoIngreso: data?.IdMedicoIngreso?.label,
            Telefono: data?.Telefono

        })
        const tramaAdmision = {
            idfuentefinancimiento: data?.idIafa,
            idUsuarioAuditoria: Number(session?.user?.id),
            idOrigenAtencion: data?.IdOrigenAtencion?.value,
            preferenciaCodigo: data?.referenciaCodigo?.value ? data?.referenciaCodigo.value : null,
            nombreAcompaniante: data?.NombreAcompaniante,
            direccionDomicilio: data?.DireccionDomicilio,
            preferenciaNumero: data?.referenciaNumero ? data?.referenciaNumero : null,
            idMedicoIngreso: data?.IdMedicoIngreso?.value,
            idServicio: data?.IdServicio?.value,
            telefono: data?.Telefono,
            idTipoGravedad: data?.gravedadAtencion.value,
            idPaciente: data?.idPaciente
        }

        try {
            const response = await axios.post(`${process.env.apijimmynew}/emergencia/ejecutarAdmisionEmergencia`, tramaAdmision)
            console.log(response.data)
            setnumCuenta(response.data)
            resetField2('dni'),
                reset()
                setValue3('observaciones',"")
            setDatospx(null);
        } catch (error) {
            setnumCuenta('')
            console.log(error)
        } finally {

        }

    }

    const AgregarNN: SubmitHandler<any> = async (dataForm) => {

        try {
            const { data } = await axios.post(`${process.env.apijimmynew}/emergencia/nn`, dataForm)
            setValue('idIafa', 5)
            const response  = {
                paciente: {
                idPaciente: data,
                apenom: "nn nn nn",
                }
            }
            setDatospx(response)
         
            
        } catch (error) {
            console.log(error)
        }

    }
    const BuscadorDni: SubmitHandler<InputBusquedadDni> = async (formdata) => {
        setnumCuenta(null);
        setEnableNewUser(false)
        try {
            setDatospx(null)
            setValue('idIafa', "")
            setValue('referenciaNumero', "")
            setValue('referenciaCodigo', "")
            setbuttonLoading(true)
            const dataEnvio = {
                ip: "string",
                usuario: session.user.id,
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
    const fetchOptionsByCodigo = async (codigo: string): Promise<any[]> => {
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
    const getDatosGenerales = async () => {
        try {
            const response = await getData(`${process.env.apiurl}/Publico/TiposDocumentos`);
            setTipoDoc(response);
            const responseFF = await getData(`${process.env.apiurl}/FuentesFinanciamiento`);

            setffFinanciamiento(responseFF);
        } catch (error) {
            console.log(error)
        }



    }

    useEffect(() => {
        getDatosGenerales();
        fetchCombosEmergencia();
    }, [])
    const selectedTipoDocumento = watch2('idDocIdentidad', '1');
    const fetchCombosEmergencia = async () => {
        try {
            setIsLoading(true);
            const response = await getData(`${process.env.apijimmynew}/emergencia/ServiciosFiltrar`);
            console.log(response)
            const mappedOptions = response.map((est: any) => ({
                value: est.idServicio,
                label: `${est.nombre?.trim()}`,
                IdEspecialidad: est.idEspecialidad
            }));
            setOptions(mappedOptions);
            const responseOrigenAtencion = await getData(`${process.env.apijimmynew}/emergencia/TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia`)
            const mappedOptionsOrigenAtencion = responseOrigenAtencion.map((est: any) => ({
                value: est.IdOrigenAtencion,
                label: `${est.DescripcionLarga?.trim()}`
            }));
            setOrigenAtencion(mappedOptionsOrigenAtencion)
            const responseGravedadAtencion = await getData(`${process.env.apijimmynew}/emergencia/tiposGravedadAtencion`);

            const mappedresponseGravedadAtencion = responseGravedadAtencion.map((est: any) => ({
                value: est.idTipoGravedad,
                label: `${est.descripcion?.trim()}`
            }));
            setGravedadAtencion(mappedresponseGravedadAtencion)
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    }
    const getMedicos = async (idespecialidad: any) => {
        const response = await getData(`${process.env.apijimmynew}/emergencia/MedicosFiltrar/${idespecialidad}`);
        const mappedOptions = response.map((est: any) => ({
            value: est.IdMedico,
            label: `${est.Nombres + ' ' + est.ApellidoPaterno + ' ' + est.ApellidoMaterno}`,
        }));
        setoptionMedicos(mappedOptions)
    }
    const getSexo = async () => {
        const data = await getData(`${process.env.apiurl}/Publico/Maestros/sexo`)
        setOptionSexo(data)

    }

    const handleSelectChange = (selectedOption: any) => {
        getMedicos(selectedOption?.IdEspecialidad)
    };
    const idIafaValue = watch('idIafa');
    useEffect(() => {
        if (idIafaValue == 3 && referenciaInputRef.current) {
            referenciaInputRef.current.focus();
        }
    }, [idIafaValue]);
    useEffect(() => {
        if (idIafaValue) {
            setValue('referenciaCodigo', '');
            setValue('referenciaNumero', '');
        }
    }, [idIafaValue]);


    useEffect(() => {
        if (datospx?.paciente?.idPaciente) {
            setValue('idPaciente', datospx.paciente.idPaciente);
        }
    }, [datospx, setValue]);
    const loadOptions = useCallback(async (inputValue: string) => {
        setIsLoading(true);
        const fetchedOptions = await fetchOptions(inputValue);
        setOptionsCombo(fetchedOptions);
        setIsLoading(false);

    }, []);

    useEffect(() => {
        getSexo()
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
        if (inputValue) {
            loadOptions(inputValue);
        } else {
            setOptionsCombo([]);
        }
    }, [inputValue, loadOptions]);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (tipoDoc && tipoDoc.length > 0) {
            setValue2('idDocIdentidad', '1');
        }
    }, [tipoDoc]);


    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);

    };
    return (
        <>
           

            <div className="flex justify-center print:hidden">
                <div className="flex items-center flex-col">
                    <div>
                        <input
                            type="checkbox"
                            className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                            id="hs-default-checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <label className="text-sm text-gray-500 ms-3 dark:text-neutral-400">
                            No identificado
                        </label>
                    </div>
                    {/* Mostrar el formulario cuando el checkbox está marcado */}
                    {isChecked && (
    <div className="mt-6 w-full max-w-md mx-auto bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
        <form className="space-y-4" onSubmit={handleSubmit3(AgregarNN)}>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-neutral-200 text-center">
                Formulario No Identificados
            </h2>
            {optionSexo?.length > 0 && (
                <Controller
                    name="idsexo"
                    control={control3}
                    rules={{
                        required: "El sexo es obligatorio",
                    }}
                    render={({ field }) => (
                        <>
                            <label className="block text-sm font-medium text-gray-600 dark:text-neutral-300">
                                Sexo
                            </label>
                            <select
                                {...field}
                                className={`w-full mt-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${errors3.idsexo ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Selecciona un sexo</option>
                                {optionSexo.map((data: any) => (
                                    <option key={data?.id} value={data?.id}>
                                        {data?.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors3.idsexo && (
                                <span className="text-red-500 text-sm">
                                    {typeof errors3.idsexo.message === 'string' ? errors3.idsexo.message : 'Error desconocido'}
                                </span>
                            )}
                        </>
                    )}
                />
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-neutral-300">
                    Observaciones
                </label>
                <Controller
                    name="observaciones"
                    control={control3}
                    render={({ field }) => (
                        <textarea
                            rows={4}
                            className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                            {...field}
                            placeholder="Observaciones del paciente"
                        />
                    )}
                />
            </div>

            <div className="mt-6">
                <button
                    type="submit"
                    className="w-full py-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Registrar
                </button>
            </div>
        </form>
    </div>
)}


                </div>



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
                        <FormPacientev2 usuario={session} />
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
            {!isChecked && (
                <form onSubmit={handleSubmit2(BuscadorDni)} className='print:hidden bg-white p-2 rounded shadow-md'>

                    <div className="grid grid-cols-3 gap-3 mt-3 mb-3">
                        <select
                            {...register2('idDocIdentidad')}
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
                            className={style.txtfield}
                            placeholder=""
                            autoComplete="off"
                            maxLength={selectedTipoDocumento === '1' ? 8 : undefined}
                            {...register2('dni', {
                                maxLength: selectedTipoDocumento === '1' ? 8 : undefined,
                            })}
                        />



                        <button
                            type="submit"
                            className={` text-white py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
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
                </form>)}
            {datospx?.paciente?.idPaciente && (
                <>
                    <div className="flex print:hidden">
                        <span className="border w-full text-center m-2 p-2 bg-slate-100 shadow-sm">
                            {datospx?.paciente?.apenom}
                        </span>
                    </div>
                    <form onSubmit={handleSubmit(FormEmergencia)} className=' mt-4 flex flex-col print:hidden  gap-2 mx-auto w-full max-w-md items-center shadow-lg p-3 m-2 bg-white rounded'>

                        <select
                            {...register('idIafa')}
                            className={`w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            {ffFinanciamiento && ffFinanciamiento.length > 0 && (() => {
                                let opcionFormateado;
                                if (validacionListarIafas == 1) {
                                    opcionFormateado = ffFinanciamiento.filter((data: any) => data.idFuenteFinanciamiento === 3);
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

                        {idIafaValue == 3 && (
                            <>

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

                                <input
                                    type="text"
                                    className={style.txtfield}
                                    placeholder="Numero Referencia"
                                    {...register('referenciaNumero')}
                                />

                            </>
                        )}

                        <Controller
                            name="IdOrigenAtencion"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    instanceId="unique-select-id2"
                                    {...field}
                                    className='w-full'
                                    options={origenAtencion}
                                    placeholder="Origen Atencion"
                                    required={true}
                                />
                            )}
                        />
                        <Controller
                            name="IdServicio"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    instanceId="unique-select-id"
                                    {...field}
                                    options={options}
                                    placeholder="Servicios Emergencia"
                                    className='w-full'
                                    required={true}
                                    isLoading={isLoading}
                                    onChange={(selectedOption) => {
                                        field.onChange(selectedOption);
                                        handleSelectChange(selectedOption);
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="IdMedicoIngreso"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    instanceId="unique-select-id"
                                    {...field}
                                    className='w-full'
                                    options={optionMedicos}
                                    placeholder="Medico"
                                    required={true}
                                    isLoading={isLoading}
                                />
                            )}
                        />
                        <Controller
                            name="gravedadAtencion"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    instanceId="unique-select-id2"
                                    {...field}
                                    className='w-full'
                                    options={gravedadAtencion}
                                    placeholder="ncion"
                                    required={true}
                                />
                            )}
                        />
                        <input type="text" required  {...register('Telefono')} className={style.txtfield} placeholder='Celular' />
                        <input type="text" required {...register('NombreAcompaniante')} className={style.txtfield} placeholder='Nombre Acompañante' />
                        <input type="text" required {...register('DireccionDomicilio')} className={style.txtfield} placeholder='Direccion' />
                        <button
                            type="submit"
                            className={`flex justify-center items-center ${isLoadingAdmisionar ? 'bg-gray-400 cursor-not-allowed' : 'colorFondo'} text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 w-1/2 h-12`}
                            disabled={isLoadingAdmisionar}
                        >
                            {isLoadingAdmisionar ? <AiOutlineLoading className="animate-spin" /> : <FaPlus />} &nbsp;
                            {isLoadingAdmisionar ? 'Cargando...' : 'Admisionar'}
                        </button>
                    </form>


                </>
            )}
            {(numCuenta) &&
                <EmergenciaTicket numCuenta={numCuenta} />
            }
        </>
    )
}
