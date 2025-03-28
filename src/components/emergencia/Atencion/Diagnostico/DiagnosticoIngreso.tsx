import { getData } from '@/components/helper/axiosHelper';
import { showConfirmDeleteAlert } from '@/components/utils/alertHelper';
import { ToasterMsj } from '@/components/utils/ToasterMsj';

import { useEmergenciaDatosStore } from '@/store/ui/emergenciadatos';
import { debounce } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaFileMedical, FaPlus } from 'react-icons/fa';
import { RiDeleteBin3Line } from 'react-icons/ri';
import Select from 'react-select';
import Swal from 'sweetalert2';
export const DiagnosticoIngreso = ({ datosEmergencia, session }: any) => {
    const [isOffcanvasOpenDx, setIsOffcanvasOpenDx] = useState(false);
    const [arraLab, setArraLab] = useState<any[]>([]);
    const [options, setOptions] = useState<any[]>([]);
    const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);
    const { watch, control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>();
    const [clasificacionDx, setClasificacionDx] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setDiagnosticoByCuenta = useEmergenciaDatosStore((state: any) => state.setDiagnosticoByCuenta)
    const setEliminarDiagnosticoByCuenta = useEmergenciaDatosStore((state: any) => state.setEliminarDiagnosticoByCuenta);
    const [eliminandoDiagnostico, setEliminandoDiagnostico] = useState(Boolean);
    const isFirstRender = useRef(true);
    const toggleOffcanvasDx = () => {
        setIsOffcanvasOpenDx(!isOffcanvasOpenDx);
    };
    const handleDelete = async (IdDiagnostico: number, idClasificacionDx: number) => {
        try {
            showConfirmDeleteAlert().then(async (result) => {
                if (result.isConfirmed) {
                    setEliminandoDiagnostico(true);
                    await axios.delete(`${process.env.apijimmynew}/diagnosticos/deleteByIdDiagnosticoAndIdClasificacionDx/${IdDiagnostico}/2`);
                    await setEliminarDiagnosticoByCuenta(IdDiagnostico, idClasificacionDx);
                    ToasterMsj('Exito', 'success', 'Se elimino correctamente.');
                }
                else {
                    console.log("no elimino")
                }
            });
        } catch (error) {
            console.error("Error al eliminar diagnóstico:", error);
        } finally {
            setEliminandoDiagnostico(false);
        }

    };
    const fetchDx = useCallback(
        debounce(async (nomdx) => {
            try {
                setIsLoading(true);
                const response = await getData(`${process.env.apijimmynew}/diagnosticos/findByName/${nomdx}`);
                const mappedOptions = response.map((est: any) => ({
                    value: est.idDiagnostico,
                    label: `${est.codigoCIE10} - ${est.descripcion}`,
                    codigoCIE10: est.codigoCIE10
                }));
                setOptions(mappedOptions);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );
    const removeLab = (valueToRemove: any) => {
        setArraLab((prevArrayLab) => prevArrayLab.filter((item) => item !== valueToRemove));
    };
    const FormDX: SubmitHandler<any> = async (data: any) => {

        const subClasificacion = clasificacionDx.find((item: any) => item.idSubclasificacionDx == data.IdSubclasificacionDx);
        await setDiagnosticoByCuenta(
            data.IdDiagnostico.value,
            data.IdDiagnostico.label,
            data.IdDiagnostico.codigoCIE10,
            data.IdSubclasificacionDx,
            subClasificacion.descripcion,
            '',
            2,
            null
          ); 
    }

    useEffect(() => {
        const getSubClasDx = async () => {
            const data = await getData(`${process.env.apijimmynew}/diagnosticos/clasificacionEmergencia`);
            setClasificacionDx(data);
            if (data.length > 0) {
                setValue('IdSubclasificacionDx', `${data[0].idSubclasificacionDx}`);
            }
        };
        getSubClasDx();


    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Evita la ejecución en el primer render
        }
        if (datosEmergencia.diagnosticos.length > 0 && !eliminandoDiagnostico) {
            getAddDx()
        }
    }, [datosEmergencia.diagnosticos])

    const getAddDx = async () => {
        const data = await axios.delete(`${process.env.apijimmynew}/diagnosticos/deleteByIdAtencionAndIdClasificacionDx/${datosEmergencia?.idatencion}/2`);
        const requests = datosEmergencia.diagnosticos.filter((data:any)=>data.idClasificacionDx==2).map((data: any) => {
            const DxSend = {
                labConfHIS: "",
                idAtencion: datosEmergencia?.idatencion,
                idDiagnostico: data?.IdDiagnostico,
                idSubclasificacionDx: data?.idSubclasificacionDx,
                idClasificacionDx: 2,
                idAtencionDiagnostico: datosEmergencia?.idatencion,
                idUsuarioAuditoria: session?.user?.id,
            };
            console.log(DxSend)
            return axios.post(`${process.env.apijimmynew}/diagnosticos/agregarAtencionDiagnostico`, DxSend);
        });
        ToasterMsj("Exito", "success", "Actualización diagnostico.")
    }

    return (
        <>
            <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between relative">
                    <span className="border-l-4 borderfondo h-6 mr-2"></span>
                    <span className="flex-grow">Diagnostico de Ingreso</span>
                    {datosEmergencia?.idTipoAlta==null &&(
                    <button
                        onClick={toggleOffcanvasDx}
                        className={datosEmergencia?.diagnosticos?.filter((data: any) => data.idClasificacionDx === 2).length > 0 ? "text-blue-500 hover:underline text-sm" : "hidden"}
                    >
                        Agregar
                    </button>
                    )}
                </h2>

                <div className={datosEmergencia.diagnosticos?.length === 0 ? "flex flex-col items-center justify-center mt-6" : "hidden"}>
                    <div className="mb-4">
                        <FaFileMedical size={36} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No hay diagnosticos registrados para este paciente</p>
                    <button
                        onClick={toggleOffcanvasDx}
                        className="text-blue-500 hover:underline text-sm">
                        Registrar Diagnosticos
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className={datosEmergencia.diagnosticos?.filter((data:any)=>data.idClasificacionDx==2).length > 0 ? "tableT  w-3/4" : "hidden"}>
                        <thead>
                            <tr>
                                <th scope="col" className="tableth">Clasificacion</th>
                                <th scope="col" className="tableth ">Diagnostico</th>
                                {datosEmergencia?.idTipoAlta==null &&(
                                <th scope="col" className="tableth">Accion</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            {datosEmergencia.diagnosticos.filter((data:any)=>data.idClasificacionDx==2)
                                .sort((a: any, b: any) => {
                                    // Ordenar por nomdx (lexicográficamente)
                                    if (a?.nomdx < b?.nomdx) return -1;  // Orden ascendente
                                    if (a?.nomdx > b?.nomdx) return 1;
                                    return 0;  // Si son iguales, no cambiar el orden
                                })
                                .map((data: any) => (
                                    <tr key={data?.codigoCIE10 + data?.labConfHIS}>
                                        <td className="tabletd w-10">{data?.subClasificacion}</td>
                                        <td>
                                            {data?.nomdx}

                                        </td>
                                        {datosEmergencia?.idTipoAlta==null &&(
                                        <td className="tabletd">
                                            <button type="button" className="aAzul" onClick={() => handleDelete(data.IdDiagnostico, data.idClasificacionDx)}>
                                                Eliminar
                                            </button>
                                        </td>)}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOffcanvasOpenDx && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleOffcanvasDx}
                ></div>
            )}

            <div id="hs-offcanvas-rightdx"
                className={`fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700 ${isOffcanvasOpenDx ? "translate-x-0" : "translate-x-full"
                    }`}
                role="dialog" tabIndex={-1} aria-labelledby="hs-offcanvas-rightdx-label">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3 id="hs-offcanvas-rightdx-label" className="font-bold text-gray-800 dark:text-white">Modulo de Diagnostico</h3>
                    <button
                        type="button"
                        onClick={toggleOffcanvasDx}
                        className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-rightdx">
                        <span className="sr-only">Close</span>
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit(FormDX)}>
                        <select {...register('IdSubclasificacionDx')} className="inputSelect" required>
                            {clasificacionDx && clasificacionDx.map((data: any) => (
                                <option key={data.idSubclasificacionDx} value={data.idSubclasificacionDx}>
                                    {data.descripcion}
                                </option>
                            ))}
                        </select>
                        <Controller
                            name="IdDiagnostico"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    instanceId="unique-select-id"
                                    {...field}
                                    className="mt-2 mb-2"
                                    options={options}
                                    required={true}
                                    placeholder={isLoading ? 'Cargando...' : 'Seleccione un diagnostico'}
                                    isLoading={isLoading}
                                    onInputChange={(value) => {
                                        if (value.length >= 3) {
                                            fetchDx(value);
                                        } else {
                                            setOptions([]);
                                        }
                                    }}
                                />
                            )}
                        />

                        {isCustomInputVisible && (
                            <div className="mt-2">
                                <label>Ingrese un valor numérico:</label>
                                <Controller
                                    name="customValue"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="Escriba un valor numérico"
                                            className="border mt-1 p-1 w-full"
                                        />
                                    )}
                                />
                            </div>
                        )}

                        <button type="submit" className="btnprimario mt-4">Guardar</button>
                    </form>
                    {arraLab && arraLab.length > 0 && (
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal text-center">
                                    <th className="py-3 px-4 border-b">Código Lab</th>
                                    <th className="py-3 px-4 border-b">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arraLab && arraLab.map((data, index) => (
                                    <tr key={index} className="hover:bg-gray-100 text-center">
                                        <td className="py-3 px-4 border-b text-gray-700">{data}</td>
                                        <td className="py-3 px-4 border-b text-center">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded "
                                                title="Eliminar"
                                                onClick={() => removeLab(data)}
                                            >
                                                <RiDeleteBin3Line className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    )}
                </div>
            </div>
        </>
    )
}
