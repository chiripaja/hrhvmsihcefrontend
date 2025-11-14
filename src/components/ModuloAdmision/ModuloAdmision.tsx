'use client'

import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import Select from 'react-select';
import * as StompJs from '@stomp/stompjs';
import { FormAdmision } from "./FormAdmision";
import { Controller, useForm } from "react-hook-form";
import { getData } from "../helper/axiosHelper";
import { toast } from "sonner";
import { RiUserVoiceLine } from "react-icons/ri";
import { Tooltip } from "../ui/Tooltip";
import './ModuloAdmision.css';
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
    const [seconds, setSeconds] = useState(0);
    const [idcuentaActualizacion, setidcuentaActualizacion] = useState();
    const [medicoSeleccionado, setMedicoSeleccionado] = useState<string | null>(null);
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const { control: control2, handleSubmit: handleSubmit2,setValue:setValue2,register:register2 } = useForm<any>();
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
    const [ventanillas, setVentanillas] = useState<any[]>([])
    const [dataTicket, setdataTicket] = useState<any>()
    useEffect(() => {
        getVentanillas();
    }, []);

    const getVentanillas = async () => {
        try {
            const { data } = await axios.get(`${process.env.apiSistemasColas}api/ventanillas`);
            console.log(data)
            setVentanillas(data);
        } catch (error) {
            console.log(error)
        }
    }

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
    useEffect(() => {
   console.log(dataTicket?.data?.ticket?.id)
        if(dataTicket?.data?.ticket?.id){
            console.log("*******************************")
            console.log(dataTicket?.data?.ticket?.id)
            setValue2("idpenultimoticket",dataTicket?.data?.ticket?.id)
           console.log("*******************************")
        }

        let timer: NodeJS.Timeout;
        if (dataTicket) {
            setSeconds(0); // reinicia al obtener nuevo ticket
            timer = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer); // limpia cuando cambia el ticket o desmonta
    }, [dataTicket]);
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
        settextoLoading("sincronizando...");
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
        if (idcuentaActualizacion) {

            fetchProductsActualizacionPosterior()
        }
    }, [idcuentaActualizacion])
    const onSubmitTicket = async (data: any) => {
        if(data?.idpenultimoticket){
            const datosActualizar=await axios.put(`${process.env.apiSistemasColas}api/tickets/${data?.idpenultimoticket}/estado?estado=ATENDIDO`);
            console.log(datosActualizar)
        }
        try {
            console.log(data)
            const dataTicket = await axios.post(`${process.env.apiSistemasColas}api/atenciones/atender?idVentanilla=${data?.ventanilla}&tipo=${data?.tipo}`);
          
            setdataTicket(dataTicket);
        } catch (error) {
            setdataTicket(null);
            toast('No hay más Tickets en espera.', {
                position: 'top-right',
                style: {
                    background: '#E0F2FE', // azul claro
                    color: '#0369A1',      // azul oscuro para el texto
                    border: '1px solid #7DD3FC',
                },
            });
            console.log("------------")
            console.log(error)
            console.log("------------")
        }
    }
    /*    
    useEffect(() => {
      if (activeIndex) {
        const especilidadDatos = citas.filter(
          (item: Cita) =>
            item.idEspecialidad.toString() === activeIndex.id &&
            item.fecha === activeIndex.fecha
        );
        setConsultorio(especilidadDatos);
      } else {
        // 👇 si no hay consultorio seleccionado, vaciamos
        setConsultorio([]);
      }
    }, [citas, activeIndex]);*/

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
                                Filtrar por Médico
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
                       
  <div
                            className="col-span-12 md:col-span-8 print:hidden hidden">
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
                                        placeholder="Nombre de medico 2"
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

                    <form
  onSubmit={handleSubmit2(onSubmitTicket)}
  className="col-span-12 md:col-span-4 flex flex-wrap md:flex-nowrap items-center gap-3 print:hidden hidden"
>
  {/* SELECT 1 */}
  <Controller
    name="ventanilla"
    control={control2}
    rules={{ required: true }}
    render={({ field, fieldState }) => (
      <div className="flex flex-col w-full sm:w-1/2 md:w-auto">
        <select
          {...field}
          required
          className={`w-full sm:w-36 rounded-xl border px-4 py-2 text-gray-700 shadow-sm 
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none 
          transition duration-200 ease-in-out
          ${fieldState.invalid ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Seleccione...</option>
          {ventanillas
            .filter((v) => v.activa)
            .map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre}
              </option>
            ))}
        </select>
        {fieldState.invalid && (
          <span className="text-red-500 text-sm mt-1">Campo requerido</span>
        )}
      </div>
    )}
  />

  {/* SELECT 2 */}
  <Controller
    name="tipo"
    control={control2}
    rules={{ required: true }}
    render={({ field, fieldState }) => (
      <div className="flex flex-col w-full sm:w-1/2 md:w-auto">
        <select
          {...field}
          required
          className={`w-full sm:w-36 rounded-xl border px-4 py-2 text-gray-700 shadow-sm 
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none 
          transition duration-200 ease-in-out
          ${fieldState.invalid ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Seleccione...</option>
          <option value="GENERAL">GENERAL</option>
          <option value="PREFERENCIAL">PREFERENCIAL</option>
          <option value="INVITADO">INVITADO</option>
        </select>
        {fieldState.invalid && (
          <span className="text-red-500 text-sm mt-1">Campo requerido</span>
        )}
      </div>
    )}
  />

  {/* Input oculto */}
  <input
    type="text"
    className="hidden"
    placeholder="idpenultimoticket"
    {...register2("idpenultimoticket")}
  />

  {/* BOTÓN */}
  <button
    type="submit"
    title="Llamar al siguiente paciente"
    className="w-full sm:w-auto px-5 py-2.5 bg-cyan-700 text-white rounded-xl font-semibold shadow-md 
    hover:bg-cyan-800 hover:shadow-lg transition-all duration-300 ease-in-out 
    focus:outline-none focus:ring-2 focus:ring-cyan-400 flex justify-center items-center"
  >
    <RiUserVoiceLine className="text-xl" />
  </button>

{/* TICKET + TIEMPO */}
{dataTicket && (
  <div
    className={`w-full md:w-auto ml-0 md:ml-4 p-1 px-2 rounded-2xl shadow-md border transition-all duration-300
        ${
      seconds > 10
        ? 'bg-red-200 border-red-400 animate-border-pulse' // 🔴 Rojo + palpita
        : 'bg-gray-50 border-gray-200' // ⚪ Normal
    }`}
  >
    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
      <p className="text-lg font-semibold text-gray-800 ">
        Ticket:{" "}
        <span className="font-bold text-cyan-700">
          {dataTicket.data?.ticket?.codigo}
        </span>
      </p>

      <span
        className={`font-mono text-lg px-3 py-1 rounded-md shadow-sm transition-all duration-300
          ${
            seconds >= 10
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
      >
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </span>
    </div>
  </div>
)}


</form>

                      


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
