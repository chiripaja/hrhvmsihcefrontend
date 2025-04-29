'use client'

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import * as StompJs from '@stomp/stompjs';
import { FormAdmision } from "./FormAdmision";
import { Controller, useForm } from "react-hook-form";

interface Cita {
    idEspecialidad: number;
    fecha: string;
    cuposLibres: string;
    total_Citas: string;
    nombreEspecialidad: string;
}

interface AgrupadoCitas {
    [key: number]: {
        [key: string]: {
            totalCitas: number;
            cuposLibres: number;
        }
    }
}

const agruparYCuposLibres = (citas: Cita[]): AgrupadoCitas => {
    if (!Array.isArray(citas)) return {};

    const agrupado = citas.reduce((acc: AgrupadoCitas, cita: Cita) => {
        const { idEspecialidad, fecha, cuposLibres, total_Citas } = cita;

        if (!acc[idEspecialidad]) {
            acc[idEspecialidad] = {};
        }

        if (!acc[idEspecialidad][fecha]) {
            acc[idEspecialidad][fecha] = { totalCitas: 0, cuposLibres: 0 };
        }

        const totalCitasInt = parseInt(total_Citas, 10);
        const cuposLibresInt = parseInt(cuposLibres, 10);

        if (totalCitasInt >= 0) {
            acc[idEspecialidad][fecha].totalCitas += totalCitasInt;
        }

        if (cuposLibresInt >= 0) {
            acc[idEspecialidad][fecha].cuposLibres += cuposLibresInt;
        }

        return acc;
    }, {});

    return agrupado;
};

const generarFechas = (citas: Cita[]): string[] => {
    const fechas = new Set<string>();
    citas.forEach((cita) => fechas.add(cita.fecha));
    return Array.from(fechas).sort();
};

export const ModuloAdmision = ({ usuario }: any) => {
      const ws = useRef<WebSocket | null>(null);
      const [idcuentaActualizacion, setidcuentaActualizacion] = useState();
    const [medicoSeleccionado, setMedicoSeleccionado] = useState<string | null>(null);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const diactual = new Date().toISOString().split('T')[0];

 
    const [citas, setCitas] = useState<Cita[]>([]);
    const [consultorio, setConsultorio] = useState<Cita[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [daysToShow, setDaysToShow] = useState(15);
    const [TextoLoading, settextoLoading] = useState("")
    const [activeIndex, setActiveIndex] = useState<any>(null);
    const [establecimientosLista, setEstablecimientosLista] = useState<any>()
    const [ffFinanciamiento, setffFinanciamiento] = useState<any>()
    const [tipoDoc, setTipoDoc] = useState<any>()


    const obtenerMedicosUnicos2 = (citas: Cita[]) => {
        const medicos = new Set<string>();
        citas.forEach((cita: any) => {
            if (cita?.nombreMedico) {
                medicos.add(cita.nombreMedico);
            }
        });
        return Array.from(medicos)
            .sort()
            .map(medico => ({ value: medico, label: medico }));
    };

    const citasFiltradas = medicoSeleccionado
        ? citas.filter((cita: any) => cita?.nombreMedico === medicoSeleccionado)
        : citas;

    const ver = async (id: string, fecha: any) => {
        await setActiveIndex({ id, fecha });
        const especilidadDatos = citas.filter((item: Cita) =>
            item.idEspecialidad.toString() === id && item.fecha === fecha
        );
        setConsultorio(especilidadDatos)
    }


    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Admision/CuposLibres`);

            setCitas(data);

        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProductsActualizacionPosterior = async () => {
        settextoLoading("cargando");
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Admision/CuposLibres`);
            setCitas(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            settextoLoading("");
        }
    }


    const getTipoDoc = async () => {
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Publico/TiposDocumentos`);
            setTipoDoc(data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts();
        obtenerff();
        getTipoDoc();
       

    }, []);


    useEffect(() => {
        // Crear conexión WebSocket
        ws.current = new WebSocket(`${process.env.apiws}/ws/chat`);
    
        ws.current.onopen = () => {
          console.log('✅ Conectado al WebSocket');
        };
    
        ws.current.onmessage = (event: MessageEvent) => {
            setidcuentaActualizacion(event.data)
          console.log('📩 Mensaje recibido:', event.data);
      
        };
    
        ws.current.onerror = (event: Event) => {
          console.error('❌ Error en WebSocket:', event);
        };
    
        ws.current.onclose = (event: CloseEvent) => {
          console.log('🔌 Conexión cerrada:', event.reason);
        };
    
        // Limpiar la conexión al desmontar
        return () => {
          ws.current?.close();
        };
      }, []);


    function toBoolean(value: any) {
        if (value === 'True') {
            return true;
        } else if (value === 'False') {
            return false;
        } else {
            console.error(`Invalid boolean string: ${value}`);
            return null;
        }
    }

    const actualizarCitas = (mensaje: any) => {
        try {
            const body = typeof mensaje === 'string' ? JSON.parse(mensaje) : mensaje;
            const validarCambio = toBoolean(body.contenido)
            if (validarCambio) {
                fetchProductsActualizacionPosterior()
            }
        } catch (error) {
            console.error('Error al parsear el mensaje:', error);
        }
    };

    const obtenerff = async () => {
        try {
            const { data } = await axios.get(`${process.env.apiurl}/FuentesFinanciamiento`);
            setffFinanciamiento(data);
        } catch (error) {
            console.log(error)
        }
    }
    const citasAgrupadas = agruparYCuposLibres(citasFiltradas);
    const fechas = generarFechas(citas);
    const medicoBuscadoW = watch('medicoBuscado')
    useEffect(() => {
        if (medicoBuscadoW) {

            setMedicoSeleccionado(medicoBuscadoW?.value)
        }
    }, [medicoBuscadoW])

    useEffect(() => {
     if(idcuentaActualizacion){
        
        fetchProductsActualizacionPosterior()
     }
    }, [idcuentaActualizacion])
    


    return (
        <div className="px-2 bg-white rounded print:m-0 print:p-0 print:bg-transparent print:rounded-none">

            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="rounded-full h-20 w-20 bg-blue-600 animate-ping"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-12 gap-4  h-[90vh] sm:overflow-hidden bg-white">
                        <div className="col-span-12 print:hidden">
                            <h1>{TextoLoading}</h1>
                        </div>
                        <div className="col-span-12 print:hidden">
                            <label htmlFor="medico" className=" block text-sm font-medium text-gray-700">
                                Filtrar por Médico {idcuentaActualizacion}
                            </label>
                            <Controller
                                name="medicoBuscado"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <Select
                                        instanceId="unique-select-id"
                                        {...field}
                                        options={[
                                            { value: "", label: "Todos" }, // Opción adicional para "Todos"
                                            ...obtenerMedicosUnicos2(citas)
                                        ]}
                                        placeholder="Nombre de medico"
                                        className="w-full z-30"
                                        isLoading={isLoading}
                                        required
                                        onChange={(selectedOption) => {
                                            field.onChange(selectedOption); // Mantiene la funcionalidad de react-hook-form
                                            setMedicoSeleccionado(selectedOption?.value); // Actualiza el estado directamente
                                        }}
                                    />
                                )}
                            />

                        </div>
                        <div className="col-span-12 print:hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => setDaysToShow(Math.ceil(fechas.length / 2))} // Mostrar 50% (15 días)
                                >
                                    Mostrar Citas Proximas
                                </button>
                                <button
                                    type="button"
                                    className="colorFondo text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => setDaysToShow(fechas.length)} // Mostrar 100% (30 días)
                                >
                                    Mostrar Total Citas
                                </button>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-8 gap-3 overflow-x-auto print:hidden  overflow-y-auto border h-[75vh]">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 ">
                                <thead className="sticky top-0 bg-white dark:bg-neutral-800 z-20">
                                    <tr>
                                        <th className="sticky left-0 bg-white dark:bg-neutral-800 z-30">Especialidad</th>
                                        {fechas.slice(0, daysToShow).map((fecha) => {
                                            const partes = fecha.split("-");
                                            const mesDia = `${partes[2]}-${partes[1]}`;
                                            return <th key={fecha}>{mesDia}</th>;
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(agruparYCuposLibres(citasFiltradas))
                                        .filter((idEspecialidad) =>
                                            fechas.slice(0, daysToShow).some(
                                                (fecha) =>
                                                    citasAgrupadas[parseInt(idEspecialidad)]?.[fecha]?.cuposLibres >= 0
                                            )
                                        )
                                        .sort((a, b) => {
                                            const nombreA =
                                                citasFiltradas.find(
                                                    (cita) => cita.idEspecialidad === parseInt(a)
                                                )?.nombreEspecialidad || "";
                                            const nombreB =
                                                citasFiltradas.find(
                                                    (cita) => cita.idEspecialidad === parseInt(b)
                                                )?.nombreEspecialidad || "";
                                            return nombreA.localeCompare(nombreB);
                                        })
                                        .map((idEspecialidad, index) => {

                                            const citaEspecialidad: any = citasFiltradas.find(
                                                (cita) => cita.idEspecialidad === parseInt(idEspecialidad)
                                            );

                                            return (
                                                <tr key={idEspecialidad} className="odd:bg-white even:bg-gray-100">
                                                    <td
                                                        className={`sticky left-0 z-10 px-4 py-2 
              ${index % 2 === 0 ? "bg-white" : "bg-gray-100"} dark:bg-neutral-800`}
                                                    >

                                                        {citaEspecialidad ? citaEspecialidad.nombreEspecialidad : "No disponible"}
                                                    </td>
                                                    {fechas.slice(0, daysToShow).map((fecha) => {
                                                        const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
                                                        const esHoy = fecha === hoy;
                                                        const cuposLibres = citasAgrupadas[parseInt(idEspecialidad)]?.[fecha]?.cuposLibres || 0;

                                                        return (
                                                            <td key={fecha} className="p-1">
                                                                {citasAgrupadas[parseInt(idEspecialidad)]?.[fecha] ? (
                                                                    esHoy ? (
                                                                        <div
                                                                            onClick={() => ver(idEspecialidad, fecha)}
                                                                            className={`cursor-pointer text-center rounded  hover:bg-yellow-200 shadow-md transition duration-300 ease-in-out transform hover:scale-105
                        ${activeIndex?.id === idEspecialidad && activeIndex?.fecha === fecha ? "bg-yellow-400 font-bold" : ""}
                        ${cuposLibres > 0 ? "bg-teal-500" : "bg-orange-600"}
                        `}
                                                                        >
                                                                            {/* Mostrar cupos libres si hay más de 0, de lo contrario mostrar 0 */}
                                                                            [{cuposLibres > 0 ? cuposLibres : 0}]

                                                                        </div>
                                                                    ) : cuposLibres > 0 ? (
                                                                        <div
                                                                            onClick={() => ver(idEspecialidad, fecha)}
                                                                            className={`cursor-pointer text-center rounded bg-teal-500 hover:bg-yellow-200 shadow-md transition duration-300 ease-in-out transform hover:scale-105
                        ${activeIndex?.id === idEspecialidad && activeIndex?.fecha === fecha ? "bg-yellow-400 font-bold" : ""}`}
                                                                        >
                                                                            [{cuposLibres}]
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-gray-300 rounded">
                                                                            <button onClick={() => ver(idEspecialidad, fecha)}></button>
                                                                        </div>
                                                                    )
                                                                ) : (
                                                                    <div className="bg-gray-300 rounded">
                                                                        <button onClick={() => ver(idEspecialidad, fecha)}></button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-span-12 md:col-span-4 h-fit border rounded print:col-span-12 print:md:col-span-12 print:border-none print:rounded-none ">
                            <FormAdmision diactual={diactual} usuario={usuario} consultorio={consultorio} establecimientos={establecimientosLista} ffFinanciamiento={ffFinanciamiento} tipoDoc={tipoDoc} ejecutarVer={ver} />
                        </div>
                    </div>


                </>


            )}
        </div>
    );
};
