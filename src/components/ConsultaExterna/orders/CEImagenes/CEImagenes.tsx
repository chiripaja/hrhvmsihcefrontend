import React, { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SlPrinter } from "react-icons/sl";
import { CiImageOn } from 'react-icons/ci';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { getData } from '@/components/helper/axiosHelper';
import { CEImagenesTabla } from './CEImagenesTabla';
import { useCEDatosStore } from '@/store';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import axios from 'axios';
import { RecetaCabecera } from '@/interfaces/RecetaCabezeraI';
import { CgAdd } from 'react-icons/cg';
import Link from 'next/link';
import { CEimagenesTablaMUI } from './CEimagenesTablaMUI';
interface Option {
    value: string;
    label: string;
}
export const CEImagenes = ({ cuentaDatos }: any) => {
    const [isOffcanvasOpenImagenes, setIsOffcanvasOpenImagenes] = useState(false);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const setRecetaCabezera = useCEDatosStore((state: any) => state.setRecetaCabezera);
    const createOrdenesImagenes = useCEDatosStore((state: any) => state.createOrdenesImagenes);
    const updateOrdenesImagenes = useCEDatosStore((state: any) => state.updateOrdenesImagenes);
    const [dataPuntosDeCargaLab, setDataPuntosDeCargaLab] = useState<any[]>([]);
    const [datosExamenes, setDatosExamenes] = useState<any[]>([]);
    const FormImagenes: SubmitHandler<any> = async (data: any) => {
        const datosServicios = {
            idrecetacabecera: "",
            idproducto: data?.factservicio?.value,
            cantidad: data?.cantimagenes,
            precio: data?.factservicio?.PrecioUnitario,
            total: (data?.cantimagenes * data?.factservicio?.PrecioUnitario)?.toFixed(4),
            cantidadFarmSaldo: 0,
            idDosisRecetada: 0,
            observaciones: data?.frecuencia,
            idViaAdministracion: 0,
            iddiagnostico: data?.diagnostico,
            nombre: data?.factservicio?.label,
            usuarioauditoria: 0,
            puntoCarga: data?.puntoCarga,
            Codigo:data?.factservicio?.Codigo
        }
        const existeProducto = cuentaDatos?.ordenesImagenes?.some(
            (ordenesImagenes: any) => ordenesImagenes.idproducto === datosServicios.idproducto
        );
        if (!existeProducto) {
            createOrdenesImagenes(datosServicios)
            setValue('factservicio', null);
            setValue('cantimagenes', null);
            setValue('frecuencia', null);
            ToasterMsj("Procesado", "success", "Examen agregado correctamente.");
        } else {
            Swal.fire({
                icon: "error",
                title: "Advertencia",
                text: "Ese item ya está registrado."
            });
        }
    }

    const getDataPuntoDeCarga = async () => {
        const datos = await getData(`${process.env.apijimmynew}/FactCatalogoServicios/FactPuntosCargaFiltrar`)
        const idsPermitidos = [20, 21, 22, 23].map(String);
        const puntoCargaLab = datos.filter((data: any) => idsPermitidos.includes(data.IdPuntoCarga.toString()));
        setDataPuntosDeCargaLab(puntoCargaLab)
    }
    const getDataPuntoDeCargaValidacion = async () => {
        const datos = await getData(`${process.env.apijimmynew}/FactCatalogoServicios/FactPuntosCargaFiltrar`)
        const idsPermitidos = ["20", "21", "22", "23"];
        const idsPermitidosi = [20, 21, 22, 23];
        const puntoCargaLab = datos.filter((data: any) => idsPermitidos.includes(data.IdPuntoCarga))
        const filtro = cuentaDatos?.recetaCabezera.filter(
            (item: any) => idsPermitidosi.includes(item.IdPuntoCarga) && item?.idEstado == 2
        );
        const idpermitidonodespachado = filtro?.map((item: any) => item.IdPuntoCarga.toString()) || [];
        if (idpermitidonodespachado.length > 0) {
            const nuevoCombo = puntoCargaLab.filter(
                (data: any) => !idpermitidonodespachado.includes(data.IdPuntoCarga.toString())
            );
            setDataPuntosDeCargaLab(nuevoCombo);
        }
    }
    const getExamenesByPuntoCarga = async (idpuntocarga: any) => {
        const datos = await getData(`${process.env.apijimmynew}/FactCatalogoServicios/factaCatalogoServicioByIdPuntoCargaAndFormaPago/${idpuntocarga}/${cuentaDatos?.idFormaPago}`);
        const mappedOptions = datos.map((est: any) => ({
            value: est.IdProducto,
            label: `${est.Codigo?.trim()} - ${est.Nombre.trim()}`,
            PrecioUnitario: est.PrecioUnitario,
            Codigo:est.Codigo,
        }));
        setDatosExamenes(mappedOptions);
    }
    const puntoCargaW = watch('puntoCarga')
    useEffect(() => {
        if (cuentaDatos?.idFormaPago && puntoCargaW) {
            getExamenesByPuntoCarga(puntoCargaW)
        }
    }, [puntoCargaW])
    useEffect(() => {
        getDataPuntoDeCarga()
    }, [])
    useEffect(() => {
        if (cuentaDatos?.recetaCabezera) {
            getDataPuntoDeCargaValidacion()
        }
    }, [cuentaDatos?.recetaCabezera])
    useEffect(() => {
        if (dataPuntosDeCargaLab[0]?.IdPuntoCarga && cuentaDatos?.idFormaPago) {
            getExamenesByPuntoCarga(dataPuntosDeCargaLab[0]?.IdPuntoCarga)
        }
    }, [dataPuntosDeCargaLab, cuentaDatos?.idFormaPago])



    const handleCanastaPorPuntoDeCarga = async () => {
        const puntosDeCarga = [20, 21, 22, 23];
        for (const puntoCarga of puntosDeCarga) {
            const recetaexistente = cuentaDatos?.recetaCabezera?.find((item: any) => item.IdPuntoCarga === puntoCarga);
            if (recetaexistente) {
                await actualizarReceta(recetaexistente.idReceta, puntoCarga);
            } else {
                const existeOrdenParaPuntoCarga = cuentaDatos?.ordenesImagenes?.some(
                    (orden: any) => Number(orden.puntoCarga) === puntoCarga
                );
                if (existeOrdenParaPuntoCarga) {
                    await crearReceta(puntoCarga);
                }
            }
        }

        Swal.fire({
            icon: "success",
            title: "Orden creada exitosamente",
            showConfirmButton: false,
            timer: 1500
        });
        toggleOffcanvasImagenes()
    };
    const crearReceta = async (puntoCarga: number) => {
        const datosCabecera = {
            idPuntoCarga: puntoCarga,
            fechaReceta: new Date().toISOString(),
            idCuentaAtencion: cuentaDatos?.idcuentaatencion,
            idServicioReceta: cuentaDatos?.idServicio,
            idEstado: 1,
            idComprobantePago: null,
            idMedicoReceta: cuentaDatos?.idMedicoIngreso,
            fechaVigencia: null,
            idUsuarioAuditoria: 1
        };

        try {
            const response = await axios.post(
                `${process.env.apijimmynew}/recetas/recetacabezeraadd`,
                datosCabecera
            );
            const DatosRecetaCabecera: RecetaCabecera[] = await getData(
                `${process.env.apijimmynew}/recetas/findRecetaCabezeraByIdCuentaAtencion/${cuentaDatos?.idcuentaatencion}`
            );
            setRecetaCabezera(DatosRecetaCabecera);
            if (response?.data) {
                const ordenes = await updateOrdenesImagenes(response?.data, puntoCarga);
                await enviarOrdenes(ordenes);
            }
            console.log(`Receta creada exitosamente para el punto de carga ${puntoCarga}`);
        } catch (error) {
            console.error(`Error creando receta para el punto de carga ${puntoCarga}:`, error);
        }
    };
    const actualizarReceta = async (idReceta: number, puntoCarga: number) => {
        try {
            const data = cuentaDatos?.recetaCabezera.filter((datos: any) => datos?.idReceta === idReceta);

            if (data && data.length > 0 && data[0].idEstado === 1) {
                await axios.delete(`${process.env.apijimmynew}/recetas/deleterecetadetallebyid/${idReceta}`);
                const ordenes = await updateOrdenesImagenes(idReceta, puntoCarga);
                if (ordenes) {
                    await enviarOrdenes(ordenes);
                }
            }

        } catch (error) {
            console.error(`Error actualizando receta para el punto de carga ${puntoCarga}:`, error);
        }
    };

    const enviarOrdenes = async (medicamentos: any[]) => {
        console.log(medicamentos)
        try {
            const promises = medicamentos.map((medicamento: any) =>
                axios.post(`${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`, medicamento)
            );
            const responses = await Promise.all(promises);
            responses.forEach((response) => {
                console.log("Medicamento enviado exitosamente:", response.data);
            });/**/
        } catch (error) {
            console.error("Error enviando medicamentos:", error);
        }
    };
    const toggleOffcanvasImagenes = () => {
        setIsOffcanvasOpenImagenes(!isOffcanvasOpenImagenes);
    };
    return (
        <>

            <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4 max-w-[52rem]">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between relative">
                    <span className="border-l-4 borderfondo h-6 mr-2"></span>
                    <span className="flex-grow">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">Imágenes</span>

                            {cuentaDatos?.recetaCabezera?.some((item: any) =>
                                [20, 21, 22, 23].includes(item.IdPuntoCarga) && cuentaDatos?.ordenesImagenes.length>0
                            ) && (
                                    <Link
                                        href={`/reportes/recetasimagenes/${cuentaDatos?.idcuentaatencion}`}
                                        target="_blank"
                                        className="inline-flex items-center px-3 py-1.5 text-blue-600 text-sm rounded-md hover:bg-blue-100 transition-colors duration-200"
                                    >
                                        <SlPrinter className="m-2" />
                                        <span>Imprimir</span>
                                    </Link>
                                )}
                        </div>
                    </span>


                    <button
                        onClick={toggleOffcanvasImagenes}
                        className={cuentaDatos?.ordenesImagenes.length > 0 ? "text-blue-500 hover:underline text-sm ml-2" : "hidden"}
                    >
                        Agregar
                    </button>

                </h2>


                <div className={cuentaDatos?.ordenesImagenes.length == 0 ? "flex flex-col items-center justify-center mt-6 " : "hidden"}>
                    <div className="mb-4">

                        <CiImageOn size={36} className="text-gray-400" />
                    </div>

                    <p className="text-gray-500 text-sm mb-4">
                        No hay examenes activos para mostrar para este paciente
                    </p>

                    <button onClick={toggleOffcanvasImagenes}
                        className="text-blue-500 hover:underline text-sm">
                        Registrar examenes activos
                    </button>
                </div>

                <div className="w-full">
                      <CEimagenesTablaMUI cuentaDatos={cuentaDatos} />
                    </div>
            </div>
            {isOffcanvasOpenImagenes && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleOffcanvasImagenes}
                ></div>
            )}
            <div id="hs-offcanvas-rightimg"
                className={`fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700 ${isOffcanvasOpenImagenes ? "translate-x-0" : "translate-x-full"
                    }`}
                role="dialog" tabIndex={-1} aria-labelledby="hs-offcanvas-rightimg-label">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3 id="hs-offcanvas-rightimg-label" className="font-bold text-gray-800 dark:text-white">
                        Modulo de Imagenes
                    </h3>
                    <button
                        type="button"
                        onClick={toggleOffcanvasImagenes}
                        className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-rightimg">
                        <span className="sr-only">Close</span>
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit(FormImagenes)}>
                        {cuentaDatos?.diagnosticos?.length > 0 && (
                            <Controller
                                name="diagnostico"
                                control={control}
                                defaultValue={cuentaDatos.diagnosticos[0]?.IdDiagnostico}
                                render={({ field }) => (
                                    <select {...field} className="w-full border mb-2 p-2 rounded shadow-sm">
                                        {cuentaDatos.diagnosticos
                                            .filter((value: any, index: any, self: any) =>
                                                index === self.findIndex((t: any) => t.IdDiagnostico === value.IdDiagnostico)
                                            )
                                            .map((data: any) => (
                                                <option key={data?.IdDiagnostico} value={data?.IdDiagnostico}>
                                                    {data?.nomdx}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            />
                        )}
                        {dataPuntosDeCargaLab.length > 0 && (
                            <Controller
                                name="puntoCarga"
                                control={control}
                                defaultValue={dataPuntosDeCargaLab[0]?.IdPuntoCarga}
                                render={({ field }) => (
                                    <select {...field} className="w-full border p-2 rounded shadow-sm">
                                        {dataPuntosDeCargaLab.map((data: any) => (
                                            <option key={data?.IdPuntoCarga} value={data?.IdPuntoCarga}>
                                                {data?.Descripcion}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        )}
                        <Controller
                            name="factservicio"
                            control={control}
                            defaultValue={null} // Inicialmente null o como prefieras
                            render={({ field }) => (
                                <Select
                                    instanceId="unique-select-id"
                                    className="mt-2"
                                    options={datosExamenes}
                                    required
                                    value={datosExamenes.find(option => option.value === field.value?.value) || null} // Sincroniza con el objeto completo
                                    onChange={(selectedOption) => field.onChange(selectedOption)} // Envía el objeto completo al formulario
                                    placeholder="Imagenes"
                                    isClearable
                                    getOptionLabel={(e) => `${e.label}`} // Personaliza cómo se muestra cada opción (opcional)
                                />
                            )}
                        />
                        <input type="number" className='inputSelect mt-2 mb-1'
                            min="0"
                            {...register('cantimagenes', {
                                required: true,
                                validate: value => value >= 0 || "La cantidad no puede ser negativa"
                            })}
                            placeholder="Cantidad" />
                        <textarea {...register('frecuencia')} className='w-full border shadow mt-2 p-1' placeholder='Observaciones' ></textarea>
                        <button type="submit" className="btnprimario mt-2">Guardar</button>
                    </form>
                    <CEImagenesTabla cuentaDatos={cuentaDatos} />
                    <div className={cuentaDatos?.ordenesImagenes.length > 0 ? "block" : "hidden"}>
                        <button onClick={handleCanastaPorPuntoDeCarga} type="button" className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            Confirmar Orden
                            <CgAdd />
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}
