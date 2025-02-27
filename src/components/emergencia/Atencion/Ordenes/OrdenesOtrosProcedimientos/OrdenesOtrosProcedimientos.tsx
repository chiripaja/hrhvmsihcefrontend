import React, { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiInjection } from 'react-icons/bi';
import { CiImageOn } from 'react-icons/ci';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { debounce } from '@mui/material';
import { getData } from '@/components/helper/axiosHelper';

import { CgAdd } from 'react-icons/cg';
import axios from 'axios';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import { AiOutlineFileProtect } from 'react-icons/ai';
import { OrdenesOtrosProcedimientosTabla } from './OrdenesOtrosProcedimientosTabla';
import { useEmergenciaDatosStore } from '@/store/ui/emergenciadatos';
interface Option {
    value: string;
    label: string;
}


export const OrdenesOtrosProcedimientos = ({ datosEmergencia, session }: any) => {
    const [isOffcanvasOpenOtros, setIsOffcanvasOpenOtros] = useState(false);

    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const createordenesOtros = useEmergenciaDatosStore((state: any) => state.createordenesOtros);
    const FormOtros: SubmitHandler<any> = async (data: any) => {
        const ProcidimientosObjeto = {
            idCuenta: datosEmergencia?.idcuentaatencion,
            idProducto: data?.idproductoServicio?.value,
            cantidad: data?.cantmedicamento,
            observacion: data?.frecuencia,
            idUsuario: session?.user?.id,
            nombre: data?.idproductoServicio?.label
        }
        const existeProducto = datosEmergencia?.ordenesOtros?.some(
            (ordenesOtros: any) => ordenesOtros.idProducto === ProcidimientosObjeto.idProducto
        );
         if (!existeProducto) {
            createordenesOtros(ProcidimientosObjeto);
            ToasterMsj("Procesado", "success", "Procedimiento agregado correctamente.");
            reset();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Advertencia",
                        text: "Ese item ya está registrado."
                    });
                }
      
    }

    const fetchOtros = useCallback(
        debounce(async (nommed) => {
            try {
                setIsLoading(true);
                const response = await getData(`${process.env.apijimmynew}/FactCatalogoServicios/findByName/${nommed}`);
                const mappedOptions = response.map((est: any) => ({
                    value: est.idProducto,
                    label: est.nombre,
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
    const handleCanastaOtros = async () => {
        if (!datosEmergencia?.ordenesOtros || datosEmergencia.ordenesOtros.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No hay órdenes para procesar",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        try {
            await axios.delete(`${process.env.apijimmynew}/recetas/ApiEliminarSolicitudProcedimientosByIdCuenta/${datosEmergencia?.idcuentaatencion}`)
            const solicitudes = datosEmergencia.ordenesOtros.map((data: any) => {
                const datosEnvioOrdenesOtros = {
                    idCuenta: data?.idCuenta,
                    idProducto: data?.idProducto,
                    cantidad: data?.cantidad,
                    observacion: data?.observacion,
                    idUsuario: session?.user?.id,
                };
                return axios.post(
                    `${process.env.apijimmynew}/recetas/OtrosCptAgregar`,
                    datosEnvioOrdenesOtros
                );
            });

            await Promise.all(solicitudes);

            Swal.fire({
                icon: "success",
                title: "Órdenes creadas exitosamente",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Error al procesar las órdenes",
                text: "Revisa la consola para más detalles.",
                showConfirmButton: true,
            });
        }
        toggleOffcanvasOtros()
    }
    const toggleOffcanvasOtros = () => {
        setIsOffcanvasOpenOtros(!isOffcanvasOpenOtros);
    };
  return (
    <>

    <div className="bg-white border border-gray-300  rounded-md shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between relative">
            <span className="border-l-4 borderfondo h-6 mr-2"></span>
            <span className="flex-grow">Otros Procedimientos</span>

            <button
                onClick={toggleOffcanvasOtros} 
                className={datosEmergencia?.ordenesOtros.length > 0 ? "text-blue-500 hover:underline text-sm" : "hidden"}
            >
                Agregar
            </button>

        </h2>


        <div className={datosEmergencia?.ordenesOtros.length == 0 ? "flex flex-col items-center justify-center mt-6 " : "hidden"}>
            <div className="mb-4">
            <AiOutlineFileProtect size={36} className="text-gray-400" />
      
            </div>

            <p className="text-gray-500 text-sm mb-4">
                No hay procedimientos activos para mostrar para este paciente
            </p>

            <button 
            onClick={toggleOffcanvasOtros} 
            className="text-blue-500 hover:underline text-sm">
                Registrar procedimientos
            </button>
        </div>
        <OrdenesOtrosProcedimientosTabla modificar={1}  datosEmergencia={datosEmergencia}/>
    </div>

    {isOffcanvasOpenOtros && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleOffcanvasOtros}
        ></div>
    )}

    <div id="hs-offcanvas-otros" 
    className={`fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700 ${isOffcanvasOpenOtros ? "translate-x-0" : "translate-x-full"
    }`}
    role="dialog" tabIndex={-1} aria-labelledby="hs-offcanvas-otros-label">
        <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
            <h3 id="hs-offcanvas-otros-label" className="font-bold text-gray-800 dark:text-white">
                Modulo de otros
            </h3>
            <button type="button" 
            onClick={toggleOffcanvasOtros}
            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-otros">
                <span className="sr-only">Close</span>
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </button>
        </div>
        <div className="p-4">
            <div>
                <form onSubmit={handleSubmit(FormOtros)}>
                    <Controller
                        name="idproductoServicio"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Select
                                instanceId="unique-select-id"
                                {...field}
                                className="mt-2 mb-2"
                                options={options}
                                placeholder="Procedimientos a realizar"
                                required={true}
                                isLoading={isLoading}
                                onInputChange={(value) => {
                                    if (value.length >= 3) {
                                        fetchOtros(value);
                                    } else {
                                        setOptions([]);
                                    }
                                }}
                            />
                        )}
                    />
                    <input type="number" className='inputSelect mt-2 mb-1' {...register('cantmedicamento')} placeholder="Cantidad" />
                    <textarea {...register('frecuencia')} className='w-full border shadow mt-2 p-1' placeholder='Observaciones' ></textarea>
                    <button type="submit" className="btnprimario mt-2">Guardar</button>
                </form>
                <OrdenesOtrosProcedimientosTabla datosEmergencia={datosEmergencia}/>
                <div className={datosEmergencia?.ordenesOtros.length > 0 ? "block" : "hidden"}>
                    <button onClick={handleCanastaOtros} type="button" className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Confirmar Orden
                        <CgAdd />
                    </button>
                </div>
            </div>
        </div>
    </div>

</>
  )
}
