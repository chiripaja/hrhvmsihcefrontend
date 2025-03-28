import React, { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TbShoppingCart } from "react-icons/tb";
import { GiMedicines } from 'react-icons/gi';
import { CgAdd } from "react-icons/cg";
import Select from 'react-select';
import { debounce } from '@mui/material';
import { getData } from '@/components/helper/axiosHelper';
import { useCEDatosStore } from '@/store';
import axios from 'axios';
import { RecetaCabecera } from '@/interfaces/RecetaCabezeraI';
import { MedicamentosCE } from '../../../../interfaces/MedicamentosCe';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import { CEFarmaciaTabla } from './CEFarmaciaTabla';
import Swal from 'sweetalert2';
interface Option {
    value: string;
    label: string;
}
export const CEFarmacia = ({ cuentaDatos }: any) => {
    const [isOffcanvasOpenFarmacia, setIsOffcanvasOpenFarmacia] = useState(false);

    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tiposViasAdministracion, setTiposViasAdministracion] = useState<any[]>([]);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const setRecetaCabezera = useCEDatosStore((state: any) => state.setRecetaCabezera);
    const createMedicamento = useCEDatosStore((state: any) => state.createMedicamento);
    const updateMedicamentos = useCEDatosStore((state: any) => state.updateMedicamentos);
    const toggleOffcanvasFarmacia = () => {
        setIsOffcanvasOpenFarmacia(!isOffcanvasOpenFarmacia);
    };
    const FormFarmacia: SubmitHandler<any> = async (data: any) => {
        const datosMedicamentos: MedicamentosCE = {
            idrecetacabecera: "",
            idproducto: data?.idproductoFarmacia?.value,
            cantidad: data?.cantmedicamento,
            precio: data?.idproductoFarmacia?.PrecioUnitario,
            total: (data?.cantmedicamento * data?.idproductoFarmacia?.PrecioUnitario)?.toFixed(4),
            cantidadFarmSaldo: data?.idproductoFarmacia?.cantidad,
            idDosisRecetada: 1,
            observaciones: data?.frecuencia,
            idViaAdministracion: data?.viaadministracion == 0 ? null : data?.viaadministracion,
            iddiagnostico: data?.diagnostico,
            nombre: data?.idproductoFarmacia?.label,
            usuarioauditoria: 0,
            idEstadoDetalle: 1
        }
        const existeMedicamento = cuentaDatos?.medicamentos?.some(
            (medicamento: MedicamentosCE) => medicamento.idproducto === datosMedicamentos.idproducto
        );
        if (!existeMedicamento) {
            createMedicamento(datosMedicamentos);
            ToasterMsj("Procesado", "success", "Examen agregado correctamente.");
            reset();
        } else {
            Swal.fire({
                icon: "error",
                title: "Advertencia",
                text: "El medicamento ya está registrado."
            });
        }

    }

    const GetTiposViasAdministracion = async () => {
        try {
            const data = await getData(`${process.env.apijimmynew}/diagnosticos/viasadministracion`);
            setTiposViasAdministracion(data)
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            setTiposViasAdministracion([]);
        }
    }


    const handleCanasta = async () => {
        const RecetaCabezeraFarmacia = cuentaDatos?.recetaCabezera?.filter((data: RecetaCabecera) => data.IdPuntoCarga === 5)
        if (RecetaCabezeraFarmacia[0]?.idReceta !== null && RecetaCabezeraFarmacia[0]?.idReceta !== undefined) {
            const idReceta = RecetaCabezeraFarmacia[0].idReceta;
            try {
                await axios.delete(`${process.env.apijimmynew}/recetas/deleterecetadetallebyid/${idReceta}`);
                const updatedMedicamentos = await updateMedicamentos(idReceta);
                const promises = updatedMedicamentos.map((medicamento: any) =>
                    axios.post(`${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`, medicamento)
                );
                const responses = await Promise.all(promises);
                responses.forEach((response) => {
                    console.log('Medicamento enviado exitosamente:', response.data);
                });
            } catch (error) {
                console.error('Error procesando la receta:', error);
            }
            Swal.fire({
                icon: "success",
                title: "Orden de farmacia creada exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            const datosCabecera = {
                idPuntoCarga: 5,
                fechaReceta: new Date().toISOString(),
                idCuentaAtencion: cuentaDatos?.idcuentaatencion,
                idServicioReceta: cuentaDatos?.idServicio,
                idEstado: 1,
                idComprobantePago: null,
                idMedicoReceta: cuentaDatos?.idMedicoIngreso,
                fechaVigencia: (() => {
                    const fecha = new Date();
                    fecha.setDate(fecha.getDate() + 1);
                    fecha.setHours(0, 0, 0, 0);
                    return fecha.toISOString();
                })(),
                idUsuarioAuditoria: 1,
            }
            try {
                const datosCabeceraCreado = await axios.post(
                    `${process.env.apijimmynew}/recetas/recetacabezeraadd`,
                    datosCabecera
                );
                const DatosRecetaCabecera: RecetaCabecera[] = await getData(
                    `${process.env.apijimmynew}/recetas/findRecetaCabezeraByIdCuentaAtencion/${cuentaDatos?.idcuentaatencion}`
                );
                const RecetaCabezeraFarmacia = DatosRecetaCabecera?.filter(
                    (data: RecetaCabecera) => data.IdPuntoCarga === 5
                );
                if (RecetaCabezeraFarmacia.length === 0) {
                    throw new Error("No se encontraron recetas con IdPuntoCarga === 5.");
                }
                const updatedMedicamentos = await updateMedicamentos(
                    RecetaCabezeraFarmacia[0].idReceta
                );
                const promises = updatedMedicamentos.map((medicamento: any) =>
                    axios.post(
                        `${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`,
                        medicamento
                    )
                );
                const responses = await Promise.all(promises);
                responses.forEach((response) => {
                    console.log("Medicamento enviado exitosamente:", response.data);
                });
                setRecetaCabezera(DatosRecetaCabecera);
                Swal.fire({
                    icon: "success",
                    title: "Orden de farmacia creada exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                });
            } catch (error) {
                console.log(error)
            }

        }
        toggleOffcanvasFarmacia()
    }

    useEffect(() => {
        GetTiposViasAdministracion()
    }, [])

    const fetchFarmacia = useCallback(
        debounce(async (nommed) => {
            try {
                if (!cuentaDatos?.idFormaPago) {
                    console.error("ID Forma Pago no disponible en cuentaDatos");
                    return;
                }
                setIsLoading(true);
                const response = await getData(`${process.env.apijimmynew}/farmacia/findmedicamentoscebynombreCE/4/${cuentaDatos?.idFormaPago}/${nommed}`);
                const mappedOptions = response.map((est: any) => ({
                    value: est.IdProducto,
                    label: `${est.Nombre.trim()}`,
                    cantidad: est.cantidad,
                    PrecioUnitario: est.PrecioUnitario,
                }));
                setOptions(mappedOptions);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        [cuentaDatos]
    );
    return (
        <>
            <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between relative">
                    <span className="border-l-4 borderfondo h-6 mr-2"></span>
                    <span className="flex-grow">Farmacia</span>
                    <button
                        onClick={toggleOffcanvasFarmacia}
                        className={
                            cuentaDatos?.medicamentos.length > 0
                                ? "text-blue-500 hover:underline text-sm"
                                : "hidden"
                        }
                    >
                        Agregar
                    </button>
                </h2>
                <div className={cuentaDatos?.medicamentos.length == 0 ? "flex flex-col items-center justify-center mt-6 " : "hidden"}>
                    <div className="mb-4">
                        <GiMedicines size={36} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                        No hay medicamentos activos para mostrar para este paciente
                    </p>
                    <button
                        onClick={toggleOffcanvasFarmacia}
                        className="text-blue-500 hover:underline text-sm"
                    >
                        Registrar medicamentos activos
                    </button>
                </div>
                <CEFarmaciaTabla modificar={1} cuentaDatos={cuentaDatos} />
            </div>
            {isOffcanvasOpenFarmacia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleOffcanvasFarmacia}
                ></div>
            )}
            <div
                className={`fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700 ${isOffcanvasOpenFarmacia ? "translate-x-0" : "translate-x-full"
                    }`}
                role="dialog"
                tabIndex={-1}
                aria-labelledby="hs-offcanvas-right-label"
            >
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3
                        id="hs-offcanvas-right-label"
                        className="font-bold text-gray-800 dark:text-white flex justify-between"
                    >
                        Modulo de Farmacia
                    </h3>
                    <span className={`flex items-center ${cuentaDatos?.medicamentos.length === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                        <TbShoppingCart />({cuentaDatos?.medicamentos.length})
                    </span>
                    <button type="button" onClick={toggleOffcanvasFarmacia} className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-right">
                        <span className="sr-only">Close</span>
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <form onSubmit={handleSubmit(FormFarmacia)}>
                            <Controller
                                name="idproductoFarmacia"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        instanceId="unique-select-id"
                                        {...field}
                                        className="mt-2 mb-2"
                                        options={options}
                                        placeholder="Medicamento"
                                        required={true}
                                        isLoading={isLoading}
                                        onInputChange={(value) => {
                                            if (value.length >= 3) {
                                                fetchFarmacia(value);
                                            } else {
                                                setOptions([]);
                                            }
                                        }}
                                    />
                                )}
                            />
                            {cuentaDatos?.diagnosticos?.length > 0 && (
                                <Controller
                                    name="diagnostico"
                                    control={control}
                                    defaultValue={cuentaDatos.diagnosticos[0]?.IdDiagnostico}
                                    render={({ field }) => (
                                        <select {...field} className="w-full border p-2 rounded shadow-sm">
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


                            <select className='w-full mt-2 border p-2 rounded shadow-sm' {...register('viaadministracion')} >
                                {tiposViasAdministracion && tiposViasAdministracion.map((data: any) => (
                                    <option key={data?.idViaAdministracion} value={data?.idViaAdministracion}>{data?.descripcion}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                className='inputSelect mt-2'
                                min="0"
                                {...register('cantmedicamento', {
                                    required: true,  // Asegura que el campo sea obligatorio
                                    validate: value => value >= 0 || "La cantidad no puede ser negativa"
                                })}
                                placeholder="Cantidad"
                            />
                            <textarea {...register('frecuencia')} className='w-full border shadow mt-2 p-1' placeholder='Frecuencia' ></textarea>
                            <button type="submit" className="btnprimario m-2" >Agregar</button>
                        </form>
                    </div>

                    <CEFarmaciaTabla cuentaDatos={cuentaDatos} />
                    <div className={cuentaDatos?.medicamentos.length > 0 ? "block" : "hidden"}>
                        <button onClick={handleCanasta} type="button" className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            Confirmar Orden
                            <CgAdd />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
