import { getData } from "@/components/helper/axiosHelper";
import Select from 'react-select';
import { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaFileMedical, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { debounce } from "@mui/material";
import { useCEDatosStore } from "@/store";
import style from "./CEDiagnostico.module.css";
import { Toaster, toast } from 'sonner';
import { ToasterMsj } from "@/components/utils/ToasterMsj";
import { RiDeleteBin3Line } from "react-icons/ri";
import axios from "axios";

interface Option {
    value: string;
    label: string;
}

export const CEDiagnostico = () => {
    const [isOffcanvasOpenDx, setIsOffcanvasOpenDx] = useState(false);
    const [arraLab, setArraLab] = useState<any[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [optionsLab, setOptionsLab] = useState<Option[]>([]);
    const [isCustomInputVisible, setIsCustomInputVisible] = useState(false);
    const { watch, control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>();
    const [clasificacionDx, setClasificacionDx] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setDiagnosticoByCuenta = useCEDatosStore((state: any) => state.setDiagnosticoByCuenta)
    const setEliminarDiagnosticoByCuenta = useCEDatosStore((state: any) => state.setEliminarDiagnosticoByCuenta);
    const cuentaDatos = useCEDatosStore((state: any) => state.datosce);
    const clearLabField = () => {
        setValue('IdDiagnostico', '');
        setValue("labs", "");
        setArraLab([]);
    };

    const FormDX: SubmitHandler<any> = async (data: any) => {
        const subClasificacion = clasificacionDx.find((item: any) => item.idSubclasificacionDx == data.IdSubclasificacionDx);
        if (arraLab.length > 0) {
            for (const datalab of arraLab) {
                await setDiagnosticoByCuenta(
                    data.IdDiagnostico.value,
                    data.IdDiagnostico.label,
                    data.IdDiagnostico.codigoCIE10,
                    data.IdSubclasificacionDx,
                    subClasificacion.descripcion,
                    datalab
                );
            }
            ToasterMsj("Exito", "success", "Añadio un diagnostico.")
        }

        else {
            await checkAndAddDiagnostico(
                data.IdDiagnostico.value,
                data.IdDiagnostico.label,
                data.IdDiagnostico.codigoCIE10,
                data.IdSubclasificacionDx,
                subClasificacion.descripcion,
                cuentaDatos,
                setDiagnosticoByCuenta
            );
        }
        clearLabField()


    }

    const checkAndAddDiagnostico =
        async (IdDiagnostico: any, nomdx: any, codigoCIE10: any, idSubclasificacionDx: any, subClasificacion: any, cuentaDatos: any, setDiagnosticoByCuenta: Function) => {
            const diagnosticoExiste = cuentaDatos.diagnosticos.some((diagnostico: any) => diagnostico.IdDiagnostico === IdDiagnostico);
            if (diagnosticoExiste) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Diagnóstico duplicado',
                    text: 'El diagnóstico con este CIE10 ya ha sido agregado.',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                await setDiagnosticoByCuenta(IdDiagnostico, nomdx, codigoCIE10, idSubclasificacionDx, subClasificacion);
                ToasterMsj("Exito", "success", "Añadio un diagnostico.")
            }
        };

    const handleDelete = async(indexToDelete: number) => {
        const data=await axios.delete(`${process.env.apijimmynew}/diagnosticos/deleteByIdAtencionAndIdDiagnostico/${cuentaDatos?.idatencion}/${indexToDelete}`)
        setEliminarDiagnosticoByCuenta(indexToDelete)
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


    const getLab = async () => {
        try {
            const response = await getData(`${process.env.apijimmynew}/atenciones/findallcampolab`);
            const mappedOptions = response.map((est: any) => ({
                value: est.valores ?? est.codigo,
                label: est.valores ? `${est.valores} - ${est.descripcio}` : est.descripcio,
                isCustom: est.valores === null,
            }));
            setOptionsLab(mappedOptions);
        } catch (error) {
            console.error("Error fetching lab options:", error);
        } finally {
            setIsLoading(false);
        }
    }


    const selectedDx = watch("IdDiagnostico");

    const selectedLabs = watch("labs");
    const customvaluewatch = watch("customValue");

    const removeLab = (valueToRemove: any) => {
        setArraLab((prevArrayLab) => prevArrayLab.filter((item) => item !== valueToRemove));
    };
    const addLab = () => {
        if (selectedLabs) {
            const selectedValue = selectedLabs.value;
            if (selectedValue == '999999') {
                if (customvaluewatch === "") {
                    ToasterMsj('Advertencia', 'error', 'Ingrese un número para campo lab.');
                } else {
                    setArraLab((prevArrayLab) => [...prevArrayLab, customvaluewatch]);
                    setValue("customValue", "");
                }


            } else {
                if (arraLab.includes(selectedValue)) {
                    ToasterMsj('Advertencia', 'error', 'Codigo lab ya se registrado');
                } else {
                    setArraLab((prevArrayLab) => [...prevArrayLab, selectedValue]);
                }
            }
        }

    };

    useEffect(() => {
        const option: any = optionsLab.find(opt => opt.value === selectedLabs.value);
        setIsCustomInputVisible(option?.isCustom || false);
        if (!option?.isCustom) {
            setValue("customValue", "");
        }
    }, [selectedLabs, optionsLab]);



    useEffect(() => {
        const getSubClasDx = async () => {
            const data = await getData(`${process.env.apijimmynew}/diagnosticos/clasificacionce`);
            setClasificacionDx(data);
            if (data.length > 0) {
                setValue('IdSubclasificacionDx', `${data[0].idSubclasificacionDx}`);
            }
        };
        getSubClasDx();
        getLab();
    }, []);
    const toggleOffcanvasDx = () => {
        setIsOffcanvasOpenDx(!isOffcanvasOpenDx);
    };
    return (
        <>
      
            <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between relative">
                    <span className="border-l-4 borderfondo h-6 mr-2"></span>
                    <span className="flex-grow">Diagnostico</span>
                    <button
                        onClick={toggleOffcanvasDx}
                        className={cuentaDatos.diagnosticos?.length > 0 ? "text-blue-500 hover:underline text-sm" : "hidden"}
                    >
                        Agregar
                    </button>
                </h2>

                <div className={cuentaDatos.diagnosticos?.length === 0 ? "flex flex-col items-center justify-center mt-6" : "hidden"}>
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
                    <table className={cuentaDatos.diagnosticos?.length > 0 ? "tableT  w-3/4" : "hidden"}>
                        <thead>
                            <tr>
                                <th scope="col" className="tableth">Clasificacion</th>
                                <th scope="col" className="tableth ">Diagnostico</th>
                                <th scope="col" className="tableth">Lab</th>
                                <th scope="col" className="tableth">Accion</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            {cuentaDatos.diagnosticos
                                .sort((a: any, b: any) => {
                                    // Ordenar por nomdx (lexicográficamente)
                                    if (a?.nomdx < b?.nomdx) return -1;  // Orden ascendente
                                    if (a?.nomdx > b?.nomdx) return 1;
                                    return 0;  // Si son iguales, no cambiar el orden
                                })
                                .map((data: any) => (
                                    <tr key={data?.codigoCIE10 + data?.labConfHIS}>
                                        <td className="tabletd w-10">{data?.subClasificacion}</td>
                                        <td className={`${style['fixed-width']} tabletd`}>
                                            {data?.nomdx}
                                        </td>
                                        <td className={`w-10 tabletd`}>
                                            {data?.labConfHIS}
                                        </td>
                                        <td className="tabletd">
                                            <button type="button" className="aAzul" onClick={() => handleDelete(data.IdDiagnostico)}>
                                                Eliminar
                                            </button>
                                        </td>
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
                        <p className="font-semibold">
                            Campo Lab:
                        </p>
                        <div className="flex justify-center items-center">
                            <span onClick={addLab} className="bg-blue-600 text-white p-2 w-1/5 justify-center items-center flex rounded">
                                <FaPlus />
                            </span>
                            <Controller
                                name="labs"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        instanceId="unique-select-id"
                                        {...field}
                                        className="mt-2 mb-2 ml-2 w-4/5"
                                        options={optionsLab}
                                        placeholder={isLoading ? 'Cargando...' : 'Seleccionar campo lab'}
                                        isLoading={isLoading}
                                    />
                                )}
                            />
                        </div>

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
    );
}
