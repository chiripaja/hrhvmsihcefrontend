import { getData } from "@/components/helper/axiosHelper";
import { ToasterMsj } from "@/components/utils/ToasterMsj";
import { useCEDatosStore } from "@/store";
import Select from 'react-select';
import { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CgAdd } from "react-icons/cg";
import { CiImageOn } from "react-icons/ci"
import { Loading } from "@/components/utils/Loading";
import { CEProcedimientosConsultorioTabla } from './CEProcedimientosConsultorioTabla';
import axios from "axios";
import { debounce } from "@mui/material";
import Swal from "sweetalert2";

export const CEProcedimientosConsultorio = ({ session,cuentaDatos }: any) => {
    const [isOffcanvasOpenProcedimientos, setIsOffcanvasOpenProcedimientos] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const createordenesProcedimiento = useCEDatosStore((state: any) => state.createordenesProcedimiento);
    const updateProcedimientosIdOrden = useCEDatosStore((state: any) => state.updateProcedimientosIdOrden);
    const setRecetaCabezeraProcedimientos = useCEDatosStore((state: any) => state.setRecetaCabezeraProcedimientos);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const FormImagenes: SubmitHandler<any> = async (data: any) => {
        const datosProcedimientos = {
            idOrden: '',
            idProducto: data?.factservicio?.value,
            cantidad: data?.cantidad,
            precio: parseFloat(data?.factservicio?.PrecioUnitario),
            total: parseFloat((data?.cantidad * data?.factservicio?.PrecioUnitario)?.toFixed(4)),
            idUsuario: session?.user?.id,
            idDiagnostico: data?.diagnostico,
            idFuenteFinanciamiento: cuentaDatos?.idFuenteFinanciamiento,
            idTipoFinanciamiento: cuentaDatos?.idFormaPago,
            nombreproc: data?.factservicio?.label,
            Codigo:data?.factservicio?.Codigo
        }
        createordenesProcedimiento(datosProcedimientos)
        reset()
        ToasterMsj("Procesado", "success", "Examen agregado correctamente.");
    }
    const handleCanastaProcedimientos = async () => {
        if (cuentaDatos?.recetaCabezeraProcedimientos[0]?.IdOrden !== null && cuentaDatos?.recetaCabezeraProcedimientos[0]?.IdOrden !== undefined) {
            const idorden = cuentaDatos?.recetaCabezeraProcedimientos[0].IdOrden;
            try {
                await axios.delete(`${process.env.apijimmynew}/recetas/ApiEliminarFacturacionPorOrden/${idorden}`);
                const procedimientosOrdenesEnvio = updateProcedimientosIdOrden(idorden);
                const promises = procedimientosOrdenesEnvio.map((data: any) =>
                    axios.post(`${process.env.apijimmynew}/recetas/FacturacionServicioDespachoAgregar`, data)
                );
                const responses = await Promise.all(promises);
                responses.forEach((response) => {
                    console.log('Procedimientos enviado exitosamente:', response.data);
                });/**/
            } catch (error) {
                console.error('Error procesando la receta:', error);
            }
            Swal.fire({
                icon: "success",
                title: "Ordenes creadas exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            try {
                const datosCabezera = {
                    idPaciente: cuentaDatos?.idpaciente,
                    idServicioPaciente: cuentaDatos?.idServicio,
                    idTipoFinanciamiento: cuentaDatos?.idFormaPago,
                    idFuenteFinanciamiento: cuentaDatos?.idFuenteFinanciamiento,
                    idUsuario: session?.user?.id,
                    idCuentaAtencion: cuentaDatos?.idcuentaatencion
                }
                const { data }: any = await axios.post(`${process.env.apijimmynew}/recetas/FactOrdenServicioAgregar`, datosCabezera)
                const procedimientosOrdenesEnvio = updateProcedimientosIdOrden(data);
                const promises = procedimientosOrdenesEnvio.map((data: any) =>

                    axios.post(`${process.env.apijimmynew}/recetas/FacturacionServicioDespachoAgregar`, data)
                );
                const responses = await Promise.all(promises);
                setRecetaCabezeraProcedimientos(datosCabezera)
                responses.forEach((response) => {
                    console.log('Procedimientos enviado exitosamente:', response.data);
                });
            } catch (error) {
                console.error('Error procesando la receta:', error);
            }
        }
        toggleOffcanvasProcedimientos()
    }

    const fetchFarmacia = useCallback(
        debounce(async (nom) => {
            try {
                if (!cuentaDatos?.idFormaPago) {
                    console.error("ID Forma Pago no disponible en cuentaDatos");
                    return;
                }
                setIsLoading(true);
                const response = await getData(`${process.env.apijimmynew}/FactCatalogoServicios/apiCatalogoServiciosSeleccionarSoloConPreciosEnParticularByNombre/${cuentaDatos?.idPuntoCargaProcDentroConsultorio}/${cuentaDatos?.idFormaPago}/${nom}`);
                const mappedOptions = response.map((est: any) => ({
                    value: est.IdProducto,
                   label: `${est.Codigo?.trim()} - ${est.Nombre.trim()} `,
                    PrecioUnitario: est.PrecioUnitario,
                    Codigo:est.Codigo
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
    const toggleOffcanvasProcedimientos = () => {
        setIsOffcanvasOpenProcedimientos(!isOffcanvasOpenProcedimientos);
    };
    return (
        <>

            <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4 col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between relative">
                    <span className="border-l-4 borderfondo h-6 mr-2"></span>
                    <span className="flex-grow">Procedimientos en Consultorio</span>

                    <button
                        onClick={toggleOffcanvasProcedimientos}
                        className={cuentaDatos?.ordenesProcedimiento.length > 0 ? "text-blue-500 hover:underline text-sm" : "hidden"}
                    >
                        Agregar
                    </button>

                </h2>


                <div className={cuentaDatos?.ordenesProcedimiento.length == 0 ? "flex flex-col items-center justify-center mt-6 " : "hidden"}>
                    <div className="mb-4">

                        <CiImageOn size={36} className="text-gray-400" />
                    </div>

                    <p className="text-gray-500 text-sm mb-4">
                        No hay examenes activos para mostrar para este paciente
                    </p>

                    <button onClick={toggleOffcanvasProcedimientos} 
                        className="text-blue-500 hover:underline text-sm">
                        Registrar examenes activos
                    </button>
                </div>
                <CEProcedimientosConsultorioTabla modificar={1} cuentaDatos={cuentaDatos}/>
            </div>
            {isOffcanvasOpenProcedimientos && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleOffcanvasProcedimientos}
                ></div>
            )}

            <div id="hs-offcanvas-proc" 
             className={`fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700 ${isOffcanvasOpenProcedimientos ? "translate-x-0" : "translate-x-full"
             }`}
            role="dialog" tabIndex={-1} aria-labelledby="hs-offcanvas-proc-label">
                <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                    <h3 id="hs-offcanvas-proc-label" className="font-bold text-gray-800 dark:text-white">
                        Modulo de Procedimientos
                    </h3>
                    <button type="button" 
                    onClick={toggleOffcanvasProcedimientos}
                    className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-proc">
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
                        <Controller
                            name="factservicio"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    instanceId="unique-select-id"
                                    {...field}
                                    className="mt-2 mb-2"
                                    options={options}
                                    placeholder="Procedimientos"
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
                        <input type="number" className='inputSelect mt-2 mb-1' {...register('cantidad')} placeholder="Cantidad" />
                        <button type="submit" className="btnprimario mt-2">Guardar</button>
                    </form>
                    <CEProcedimientosConsultorioTabla cuentaDatos={cuentaDatos}/>
                    <div className={cuentaDatos?.ordenesProcedimiento.length > 0 ? "block" : "hidden"}>
                        <button onClick={handleCanastaProcedimientos} type="button" className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                            Confirmar Orden
                            <CgAdd />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
