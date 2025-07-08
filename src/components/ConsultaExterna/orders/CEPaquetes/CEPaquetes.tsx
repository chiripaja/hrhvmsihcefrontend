import { getData } from "@/components/helper/axiosHelper";
import { Loading } from "@/components/utils/Loading";
import { useCEDatosStore } from "@/store";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GrFormNextLink } from "react-icons/gr";
import { MedicamentosCE } from "@/interfaces/MedicamentosCe";
import { CgKey } from "react-icons/cg";
import { handleFarmacia } from "../CEFarmacia/HandleFarmacia";
import { HandleLaboratorio } from "../CELaboratorio/HandleLaboratorio";
import { HandleImagenes } from "../CEImagenes/HandleImagenes";
import Swal from "sweetalert2";

import Select from 'react-select';
export const CEPaquetes = ({ onClose, cuentaDatos, session }: any) => {
    const [OptionPuntoCarga, setOptionPuntoCarga] = useState<any[]>([]);

    const [DatosPaquetes, setDatosPaquetes] = useState<any[]>([]);
    const [OptionPaquetes, setOptionPaquetes] = useState<any[]>([]);
    const setRecetaCabezera = useCEDatosStore((state: any) => state.setRecetaCabezera);
    const [DatosKit, setDatosKit] = useState<any[]>([]);
    const createMedicamento = useCEDatosStore((state: any) => state.createMedicamento);
    const updateMedicamentos = useCEDatosStore((state: any) => state.updateMedicamentos);
    const createordenesLaboratorio = useCEDatosStore((state: any) => state.createordenesLaboratorio);
    const updateOrdenesLaboratorio = useCEDatosStore((state: any) => state.updateOrdenesLaboratorio);

    const createOrdenesImagenes = useCEDatosStore((state: any) => state.createOrdenesImagenes);
    const updateOrdenesImagenes = useCEDatosStore((state: any) => state.updateOrdenesImagenes);
    const getPuntoCarga = async () => {
        const data = await getData(`${process.env.apijimmynew}/recetas/puntoscargapaquetes`);
        setOptionPuntoCarga(data);
        const datosPaq = await getData(`${process.env.apijimmynew}/recetas/paquetes`);
        setDatosPaquetes(datosPaq);
    }
    useEffect(() => {
        getPuntoCarga()
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const datosFiltrados = DatosPaquetes.filter((data: any) => data.idPuntoCarga == event.target.value)
        setDatosKit([])
        console.log(datosFiltrados)
        setOptionPaquetes(datosFiltrados)
    };
    const MostrarPaquete = async (id: any) => {
        const dato = await getData(`${process.env.apijimmynew}/recetas/FacturacionCatalogoPaquetesXpaquete/${id}`);
        console.log(dato)
        setDatosKit(dato)
    }

    const onSubmit = async (data: any) => {
       
        /*farmacia*/
        await procesarFarmacia(
            DatosKit,
            actualizarDatosFarmacia,
            createMedicamento,
            session,
            data,
            cuentaDatos,
            updateMedicamentos,
            getData,
            setRecetaCabezera
        );
        /*laboratorio*/
        await procesarLaboratorio(
            DatosKit,
            data?.diagnostico,
            session,
            updateOrdenesLaboratorio,
            getData,
            setRecetaCabezera,
            createordenesLaboratorio,
            actualizarDatosLaboratorio,
            HandleLaboratorio,
            [2, 3, 11]
        );/**/
        /*Imagenes*/
        await procesarImagenes(
            DatosKit,
            data?.diagnostico,
            session,
            updateOrdenesImagenes,
            getData,
            setRecetaCabezera,
            createOrdenesImagenes,
            actualizarDatosLaboratorio,
            HandleLaboratorio,
            [20, 21, 22, 23]
        );
        /*cerar*/
        onClose()
    };

    const procesarFarmacia = async (
        DatosKit: any[],
        actualizarDatosFarmacia: (farmacia: any[]) => Promise<any[]>,
        createMedicamento: (medicamento: MedicamentosCE) => Promise<any>,
        session: any,
        data: any,
        cuentaDatos: any,
        updateMedicamentos: any,
        getData: any,
        setRecetaCabezera: any
    ) => {
        const farmacia = DatosKit.filter((datos: any) => datos.idPuntoCarga == 5);
        
        const farmaciaActualizado = await actualizarDatosFarmacia(farmacia);
       
        const datosMedicamentosArray: MedicamentosCE[] = farmaciaActualizado.map((element: any) => ({
            idrecetacabecera: "",
            idproducto: element?.idProducto,
            cantidad: element.Cantidad,
            precio: element.Precio,
            total: ((element.Cantidad || 0) * (element.Precio || 0))?.toFixed(4),
            cantidadFarmSaldo: element.stock,
            idDosisRecetada: 0,
            observaciones: "",
            idViaAdministracion: 0,
            iddiagnostico: parseInt(data?.diagnostico),
            nombre: element.Descripcion,
            usuarioauditoria: session?.user?.id,
            idEstadoDetalle: 1,
            Codigo: element?.Codigo?.trim(),
            TipoProducto:element?.TipoProducto
        }));
   
       await Promise.all(datosMedicamentosArray.map((medicamento) => createMedicamento(medicamento)));
        const cuentaDatosActualizado = useCEDatosStore.getState().datosce;
        // Llamar a handleFarmacia al final
       await handleFarmacia(cuentaDatosActualizado, updateMedicamentos, getData, setRecetaCabezera);
    };



    const procesarLaboratorio = async (
        DatosKit: any[],
        dataDiagnostico: any,
        session: any,
        updateOrdenesLaboratorio: any,
        getData: any,
        setRecetaCabezera: any,
        createordenesLaboratorio: any,
        actualizarDatosLaboratorio: any,
        handleCanastaPorPuntoDeCarga: any,
        puntosCarga: any[]
    ) => {
        const laboratorio = DatosKit.filter((datos: any) =>
            puntosCarga.includes(datos.idPuntoCarga)
        );

        const laboratorioActualizado = await actualizarDatosLaboratorio(laboratorio);
      
        const laboratorioActualizadoArray = laboratorioActualizado.map((element: any) => ({
            idrecetacabecera: "",
            idproducto: element?.idProducto,
            cantidad: element?.Cantidad,
            precio: element?.Precio,
            total: (element?.Cantidad * element?.Precio)?.toFixed(4),
            cantidadFarmSaldo: 0,
            idDosisRecetada: 0,
            observaciones: "",
            idViaAdministracion: 0,
            iddiagnostico: parseInt(dataDiagnostico),
            nombre: element?.Descripcion,
            usuarioauditoria: session?.user?.id,
            puntoCarga: element?.idPuntoCarga,
            idEstadoDetalle: 1,
            Codigo:element?.Codigo?.trim()
        }));

        await Promise.all(
            laboratorioActualizadoArray.map((item: any) => createordenesLaboratorio(item))
        );


        const cuentaDatosActualizado = useCEDatosStore.getState().datosce;


        await handleCanastaPorPuntoDeCarga(
            cuentaDatosActualizado,
            updateOrdenesLaboratorio,
            getData,
            setRecetaCabezera,
            createordenesLaboratorio,
            puntosCarga
        );/**/
    };
    const procesarImagenes = async (
        DatosKit: any[],
        dataDiagnostico: any,
        session: any,
        updateOrdenesImagenes: any,
        getData: any,
        setRecetaCabezera: any,
        createordenesImagenes: any,
        actualizarDatosImagenes: any,
        handleCanastaPorPuntoDeCarga: any,
        puntosCarga: any[]
    ) => {
        const imagenes = DatosKit.filter((datos: any) =>
            puntosCarga.includes(datos.idPuntoCarga)
        );

        const ImagenesActualizado = await actualizarDatosLaboratorio(imagenes);

        const ImangeActualizadoArray = ImagenesActualizado.map((element: any) => ({
            idrecetacabecera: "",
            idproducto: element?.idProducto,
            cantidad: element?.Cantidad,
            precio: element?.Precio,
            total: (element?.Cantidad * element?.Precio)?.toFixed(4),
            cantidadFarmSaldo: 0,
            idDosisRecetada: 0,
            observaciones: "",
            idViaAdministracion: 0,
            iddiagnostico: parseInt(dataDiagnostico),
            nombre: element?.Descripcion,
            usuarioauditoria: session?.user?.id,
            puntoCarga: element?.idPuntoCarga,
            idEstadoDetalle: 1,
            Codigo:element?.Codigo?.trim()
        }));


        await Promise.all(
            ImangeActualizadoArray.map((item: any) => createordenesImagenes(item))
        );


        const cuentaDatosActualizado = useCEDatosStore.getState().datosce;


        await HandleImagenes(
            cuentaDatosActualizado,
            updateOrdenesImagenes,
            getData,
            setRecetaCabezera,
            createOrdenesImagenes,
            puntosCarga
        );/**/
    };

    const actualizarDatosFarmacia = async (farmacia: any) => {
        const noDisponibles: any[] = [];
        const DatosKitFarmaciaActualizado = await Promise.all(
            farmacia.map(async (data: any) => {
                try {
                    const response = await getData(
                        `${process.env.apijimmynew}/farmacia/apiMedicamentosPrecioByIdProducto/4/${cuentaDatos?.idFormaPago}/${data?.idProducto}`
                    );
                    if (!response || !response?.PrecioUnitario) {
                        noDisponibles.push(data?.Descripcion || `ID: ${data?.idProducto}`);
                        return null;
                    }
                    return {
                        ...data,
                        Precio: response?.PrecioUnitario,
                        stock: response?.cantidad,
                    };
                } catch (error) {
                    console.error(`Error obteniendo datos para idProducto ${data?.idProducto}`, error);
                    noDisponibles.push(data?.Descripcion || `ID: ${data?.idProducto}`);
                    return null;
                }
            })
        );

        // Mostrar alerta si hay productos no disponibles
        if (noDisponibles.length > 0) {
            await Swal.fire({
                icon: 'warning',
                title: 'Producto(s) no disponible(s) en farmacia',
                html: `<ul style="text-align: left;">${noDisponibles.map(item => `<li>${item}</li>`).join('')}</ul>`,
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }

        // Retornar solo los disponibles
        return DatosKitFarmaciaActualizado.filter(item => item !== null);
    };


    const actualizarDatosLaboratorio = async (laboratorio: any) => {
        const DatosKitFarmaciaActualizado = await Promise.all(
            laboratorio.map(async (data: any) => {
                const response = await getData(
                    `${process.env.apijimmynew}/FactCatalogoServicios/apiCatalogoServiciosSeleccionarSoloConPreciosEnParticularIdProducto/${data?.idPuntoCarga}/${cuentaDatos?.idFormaPago}/${data?.idProducto}`
                );

                return {
                    ...data, // Mantiene los datos originales
                    precio: response?.PrecioUnitario, // Actualiza solo el precio si está disponible
                };
            })
        );
        return DatosKitFarmaciaActualizado;
    };


    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<any>();
    const puntoCarga = (id: any) => {
        switch (id) {
            case 2:
                return "Patología Clínica";
            case 3:
                return "Anatomia Patologica";
            case 5:
                return "Farmacia";
            case 11:
                return "Banco de Sangre";
            case 20:
                return "Ecografía General";
            case 21:
                return "Rayos X";
            case 22:
                return "Tomografia";
            case 23:
                return "Ecografía Obstétrica";
            default:
                return "Número no reconocido";
        }
    }

    const idFactPaqueteW = watch("idFactPaquete")
    useEffect(() => {
        if (idFactPaqueteW) {
            console.log(idFactPaqueteW)
            MostrarPaquete(idFactPaqueteW?.value);
        }
    }, [idFactPaqueteW])

    return (
        <>
{cuentaDatos?.diagnosticos?.length > 0 ? (
            <form onSubmit={handleSubmit(onSubmit)} >
                <select
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                >
                    <option value="">Seleccione</option>
                    {OptionPuntoCarga && OptionPuntoCarga.length > 0 && OptionPuntoCarga.map((opcion: any) => {
                        return (
                            <option key={opcion.idPuntoCarga} value={opcion.idPuntoCarga}>
                                {opcion.descripcion}
                            </option>
                        );
                    })}
                </select>
                {/* Select para Paquetes */}
                <div className="mt-4">
                   <Controller
  name="idFactPaquete"
  control={control}
  defaultValue={null}
  rules={{ required: "Por favor, seleccione un paquete." }}
  render={({ field, fieldState }) => (
    <>
      <Select
        {...field}
        options={OptionPaquetes?.map((opcion: any) => ({
          value: opcion.idFactPaquete,
          label: opcion.descripcion,
        }))}
        placeholder="Seleccione un paquete"
        className="mt-2 mb-2"
        classNamePrefix="react-select"
        isClearable
      />
      {fieldState.error && (
        <span className="text-red-500 text-sm">{fieldState.error.message}</span>
      )}
    </>
  )}
/>
                    {/* Mensaje de error */}
                    {errors.idFactPaquete?.message && typeof errors.idFactPaquete.message === "string" && (
                        <p className="mt-1 text-sm text-red-500">{errors.idFactPaquete.message}</p>
                    )}
                </div>
                <div>
                    Seleccione Diagnostico:
                    {cuentaDatos?.diagnosticos?.length > 0 && (
                        <Controller
                            name="diagnostico"
                            control={control}
                            defaultValue={cuentaDatos.diagnosticos[0]?.IdDiagnostico}
                            render={({ field }) => (
                                <select {...field} className="w-full border p-2 rounded shadow-sm">
                                    <option value="">
                                        Seleccione
                                    </option>
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
                </div>
                {DatosKit.length > 0 &&
                    <div className="p-4">
                        <h2 className="text-2xl font-bold mb-4">Listado Adicionar</h2>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="px-4 py-2 border border-gray-300">Código</th>
                                        <th className="px-4 py-2 border border-gray-300">Descripción</th>
                                        <th className="px-4 py-2 border border-gray-300">Cantidad</th>
                                        <th className="px-4 py-2 border border-gray-300">Destino</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DatosKit.map((item: any, index: number) => (
                                        <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-4 py-2 border border-gray-300">{item.Codigo}</td>
                                            <td className="px-4 py-2 border border-gray-300">{item.Descripcion}</td>
                                            <td className="px-4 py-2 border border-gray-300">{item.Cantidad}</td>
                                            <td className="px-4 py-2 border border-gray-300">{puntoCarga(item.idPuntoCarga)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                <div className="flex justify-end mt-6 col-span-2 gap-2">
                      
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isSubmitting ? (
                            <Loading />
                        ) : (
                            <>
                                Agregar Kit de Medicamentos y Servicios
                                <GrFormNextLink className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                    >
                        <HiX className="w-5 h-5" />
                        Cerrar
                    </button>
                </div>
            </form>):(
                <div>Debe ingresar un diagnostico</div>
            )}
        </>
    );
};