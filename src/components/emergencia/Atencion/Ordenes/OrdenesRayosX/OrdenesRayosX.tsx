import { getData } from '@/components/helper/axiosHelper';
import { RecetaCabecera } from '@/interfaces/RecetaCabezeraI';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { useEmergenciaDatosStore } from '@/store/ui/emergenciadatos';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import { TbShoppingCart } from 'react-icons/tb';
import Select from 'react-select';
import { PiJarLabel } from 'react-icons/pi';
import { CgAdd } from 'react-icons/cg';
import { OrdenesRayosXTablaRecetasCabecera } from './OrdenesRayosXTablaRecetasCabecera';
import { OrdenesRayosXTabla } from './OrdenesRayosXTabla';

export const OrdenesRayosX = ({ datosEmergencia, session }: any) => {
    const [isOffcanvasOpenPatologiaClinica, setIsOffcanvasOpenPatologiaClinica] = useState(false);
    const [options, setOptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tiposViasAdministracion, setTiposViasAdministracion] = useState<any[]>([]);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const setRecetaCabezera = useEmergenciaDatosStore((state: any) => state.setRecetaCabezera);
    const createordenesRayosX = useEmergenciaDatosStore((state: any) => state.createordenesRayosX);
    const updateordenesRayosX = useEmergenciaDatosStore((state: any) => state.updateordenesRayosX);
    const [recetaIdTemporal, setRecetaIdTemporal] = useState<any>(0)
  
    const toggleOffcanvas = () => {
        if (isOffcanvasOpenPatologiaClinica) {
            setRecetaIdTemporal(0)
        }
        setIsOffcanvasOpenPatologiaClinica(!isOffcanvasOpenPatologiaClinica);
    };
  
  
    const fecthExamenesSelect = async () => {
        try {
            if (!datosEmergencia?.idFormaPago) {
                console.error("ID Forma Pago no disponible en datosEmergencia");
                return;
            }
            setIsLoading(true);
           

 const response = await getData(`${process.env.apijimmynew}/FactCatalogoServicios/factaCatalogoServicioByIdPuntoCargaAndFormaPago/21/${datosEmergencia?.idFormaPago}`);
        
            const mappedOptions = response.map((est: any) => ({
                value: est.IdProducto,
                label: `${est.Nombre.trim()}`,
                PrecioUnitario: est.PrecioUnitario,
            }));
            setOptions(mappedOptions);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    }
  
    const FormLaboratorio: SubmitHandler<any> = async (data: any) => {
        if (recetaIdTemporal == 0) {
        const datosServicios = {
            idrecetacabecera: "",
            idproducto: data?.factservicio?.value,
            cantidad: data?.cantlaboratorio,
            precio: data?.factservicio?.PrecioUnitario,
            total: (data?.cantlaboratorio * data?.factservicio?.PrecioUnitario)?.toFixed(4),
            cantidadFarmSaldo: 0,
            idDosisRecetada: 0,
            observaciones: data?.frecuencia,
            idViaAdministracion: 0,
            iddiagnostico: data?.diagnostico,
            nombre: data?.factservicio?.label,
            usuarioauditoria: 0,
            puntoCarga: data?.puntoCarga,
            idEstadoDetalle: 1
        }
        createordenesRayosX(datosServicios)
        ToasterMsj("Procesado", "success", "Examen agregado correctamente.");
        reset();
    }else {
        const datosServicios = {
            idrecetacabecera: recetaIdTemporal,
            idproducto: data?.factservicio?.value,
            cantidad: data?.cantlaboratorio,
            precio: data?.factservicio?.PrecioUnitario,
            total: (data?.cantlaboratorio * data?.factservicio?.PrecioUnitario)?.toFixed(4),
            cantidadFarmSaldo: 0,
            idDosisRecetada: 0,
            observaciones: data?.frecuencia,
            idViaAdministracion: 0,
            iddiagnostico: data?.diagnostico,
            nombre: data?.factservicio?.label,
            usuarioauditoria: 0,
            puntoCarga: data?.puntoCarga,
            idEstadoDetalle: 1
        }
        createordenesRayosX(datosServicios)
        ToasterMsj("Procesado", "success", "Examen agregado correctamente.");
        reset();
    }
    }
  
  
  
    const handleCanasta = async () => {
        if (recetaIdTemporal == 0) {
            crearNuevaReceta()
        }
        else {
            updateReceta()
        }
    }
  
    const updateReceta=async()=>{
        try {
            if(recetaIdTemporal>0){
                const data = datosEmergencia?.ordenesRayosX.filter((data: any) => data.idrecetacabecera == recetaIdTemporal);
                await axios.delete(`${process.env.apijimmynew}/recetas/deleterecetadetallebyid/${recetaIdTemporal}`);
                const promises = data.map((data: any) =>
                    axios.post(`${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`, data)
                );
                const responses = await Promise.all(promises);
                responses.forEach((response) => {
                    console.log('Examen enviado exitosamente:', response.data);
                });
            }
            
        } catch (error) {
            console.error('Error procesando la receta:', error);
        }
        Swal.fire({
            icon: "success",
            title: "Orden creada exitosamente",
            showConfirmButton: false,
            timer: 1500
        });
        toggleOffcanvas()
    }
  
  
    const crearNuevaReceta = async () => {
        const datosCabecera = {
            idPuntoCarga: 21,
            fechaReceta: new Date().toISOString(),
            idCuentaAtencion: datosEmergencia?.idcuentaatencion,
            idServicioReceta: datosEmergencia?.idServicioEgreso ? datosEmergencia?.idServicioEgreso : datosEmergencia?.idServicio,
            idEstado: 1,
            idComprobantePago: null,
            idMedicoReceta: datosEmergencia?.idMedicoIngreso,
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
                `${process.env.apijimmynew}/recetas/findRecetaCabezeraByIdCuentaAtencion/${datosEmergencia?.idcuentaatencion}`
            );
  
            
            const updatedOrdenes = await updateordenesRayosX(
                datosCabeceraCreado?.data
            );
            console.log(updatedOrdenes)
            const updatedOrdenesFiltrado = updatedOrdenes.filter((data: any) => data.idrecetacabecera === datosCabeceraCreado?.data)
  
            const promises = updatedOrdenesFiltrado.map((data: any) =>
                axios.post(
                    `${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`,
                    data
                )
            );
            const responses = await Promise.all(promises);
            responses.forEach((response) => {
                console.log("Examen enviado exitosamente:", response.data);
            });
            setRecetaCabezera(DatosRecetaCabecera);
  
            Swal.fire({
                icon: "success",
                title: "Orden creada exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.log(error)
        }
  
        toggleOffcanvas()
    }
  
    const handleOpenMenu = (idReceta: number) => {
        console.log(idReceta)
        setRecetaIdTemporal(idReceta)
    }
    useEffect(() => {
            if (recetaIdTemporal > 0) {
                toggleOffcanvas()
            }
        }, [recetaIdTemporal])
  
  
    useEffect(() => {
      fecthExamenesSelect()
    }, [])
    const recetaCabeceraF = datosEmergencia?.recetaCabezera.filter(
        (data: any) => data.IdPuntoCarga === 21
    );
  return (
    <>
        
    <div className="bg-white rounded-md shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between relative">
            <span className="border-l-4 borderfondo h-6 mr-2"></span>
            <span className="flex-grow">Rayos X</span>
            {datosEmergencia?.idTipoAlta==null &&(    <button
                onClick={toggleOffcanvas}
                className={
                    recetaCabeceraF.length > 0
                        ? "text-blue-500 hover:underline text-sm"
                        : "hidden"
                }
            >
                Agregar
            </button>)}
        </h2>
        <div className={recetaCabeceraF.length == 0 ? "flex flex-col items-center justify-center mt-6 " : "hidden"}>
            <div className="mb-4">
                <PiJarLabel size={36} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mb-4">
                No hay recetas activas para mostrar para este paciente
            </p>
            {datosEmergencia?.idTipoAlta==null &&(   <button
                onClick={toggleOffcanvas}
                className="text-blue-500 hover:underline text-sm"
            >
                Registrar recetas activos
            </button>)}
        </div>
        <OrdenesRayosXTablaRecetasCabecera datosEmergencia={datosEmergencia} handleOpenMenu={handleOpenMenu} />
    </div>
    {isOffcanvasOpenPatologiaClinica && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleOffcanvas}
        ></div>
    )}
    <div
        className={`fixed top-0 end-0 transition-all duration-300 transform h-full max-w-lg w-96 z-[80] bg-white border-s dark:bg-neutral-800 dark:border-neutral-700 ${isOffcanvasOpenPatologiaClinica ? "translate-x-0" : "translate-x-full"
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
                Modulo de Rayos X
            </h3>
            <span className={`flex items-center ${datosEmergencia?.ordenesRayosX.length === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                <TbShoppingCart />({datosEmergencia?.medicamentos.length})
            </span>
            <button type="button" onClick={toggleOffcanvas} className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-offcanvas-right">
                <span className="sr-only">Close</span>
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </button>
        </div>
        <div className="p-4">
            <div>
                <form onSubmit={handleSubmit(FormLaboratorio)}>
                    {datosEmergencia?.diagnosticos?.length > 0 && (
                        <Controller
                            name="diagnostico"
                            control={control}
                            defaultValue={datosEmergencia.diagnosticos[0]?.IdDiagnostico}
                            render={({ field }) => (
                                <select {...field} className="w-full border mb-2 p-2 rounded shadow-sm">
                                    {datosEmergencia.diagnosticos
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
                                placeholder="Examen"
                                required={true}
                                isLoading={isLoading}

                            />
                        )}
                    />
                    <input type="number" className='inputSelect mt-2 mb-1'
                        min="0"
                        {...register('cantlaboratorio', {
                            required: true,
                            validate: value => value >= 0 || "La cantidad no puede ser negativa"
                        })}
                        placeholder="Cantidad" />
                    <textarea {...register('frecuencia')} className='w-full border shadow mt-2 p-1' placeholder='Observaciones' ></textarea>
                    {datosEmergencia?.idTipoAlta==null &&(     <button type="submit" className="btnprimario mt-2">Guardar</button>)}
                </form>
            </div>

            <OrdenesRayosXTabla datosEmergencia={datosEmergencia} recetaIdTemporal={recetaIdTemporal} />
            <div className={datosEmergencia?.ordenesRayosX.length > 0 ? "block" : "hidden"}>
            {datosEmergencia?.idTipoAlta==null &&( <button onClick={handleCanasta} type="button" className="w-full py-3 px-4 flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                    Confirmar Orden
                    <CgAdd />
                </button>)}
            </div>
        </div>
    </div>
</>
  )
}
