'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale/es";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendarStyles.css';
import { Controller, useForm } from 'react-hook-form';
import { getData } from '@/components/helper/axiosHelper';
import Select from 'react-select';
import axios from 'axios';
import { watch } from 'fs';
import { showSuccessAlert, showSuccessError } from '@/components/utils/alertHelper';
import { getMessagesES } from '@/components/helper/getMessages';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';





const locales = { 'es': es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});





const ProgramacionImagenologia = () => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const { control, register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm();
  const [programaciones, setProgramaciones] = useState<any[]>([]);
  const [optionPuntosImg, setoptionPuntosImg] = useState<any[]>([]);
  const [optionMedicosG, setoptionMedicosG] = useState<any[]>([]);
  const [optionCatalogoOrdenes, setOptionCatalogoOrdenes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    const dateSelected = format(slotInfo.start, "yyyy-MM-dd");
    setSelectedDates((prevDates) =>
      prevDates.includes(dateSelected)
        ? prevDates.filter((date) => date !== dateSelected)
        : [...prevDates, dateSelected]
    );
  };

  // Estilo personalizado para los días seleccionados
  const customEventStyle = (event: any) => {
    const eventDate = format(event.start, "yyyy-MM-dd");
    const isSelected = selectedDates.includes(eventDate);
    return {
      style: {
        backgroundColor: isSelected ? "#4f46e5" : "#3b82f6", // Morado si está seleccionado, azul si no.
        color: "#fff",
        borderRadius: "8px",
        padding: "2px 5px",
        border: isSelected ? "2px solid #9333ea" : "none",
      },
    };
  };

  const onSubmit = async (data: any) => {
    try {
      if (selectedDates.length > 0) {

        for (const dates of selectedDates) {
          const objProgra = {
            idProgramacionOrdenes: 0,
            idMedico: data.idmedico?.value,
            idPuntoCarga: parseInt(data.idpuntocarga.value),
            fecha: dates,
            horaInicio: data.horaInicio,
            horaFin: data.horaFin
          }
          const datos = await axios.post(
            `${process.env.apijimmynew}/programacionordenes`,
            objProgra
          )
          setSelectedDates([])
          //     reset();
        }
        getFechaProgramacionByMedico(data.idmedico?.value)
        showSuccessAlert("Ingresado correctamente la programación.")
      } else {
        showSuccessError("Porfavor seleccione las fechas en el calendario.")
      }




    } catch (error) {
      console.log(error)
    }

  };

  const eventosSeleccionados = selectedDates.map((date) => ({
    title: "Seleccionado",
    start: new Date(`${date}T00:00:00`), // Usamos T00:00:00 para evitar diferencias horarias
    end: new Date(`${date}T23:59:59`),  // Cubrimos todo el día
    allDay: true,
  }));

  // Eventos precargados desde las programaciones
  const eventosPrecargados = programaciones.map((p, index) => {
    const start = new Date(`${p.fecha}T${p.horaInicio}`);
    const end = new Date(`${p.fecha}T${p.horaFin}`);

    return {
      id: index,
      title: `Dr. ${p.medico?.empleado?.apellidoPaterno} ${p.medico?.empleado?.apellidomaterno}`,
      start,
      end,
      servicio: `Serv: ${p.catalogOrdenes?.nombreExamen}`,
    };
  });
  const eventosCalendario = [...eventosSeleccionados, ...eventosPrecargados];
  const OnLoadPointsOfLoad = async () => {
    const data = await getData(`${process.env.apijimmynew}/FactCatalogoServicios/FactPuntosCargaFiltrar`)
    const imgfil = data.filter((dat: any) => dat.IdUPS == 1)
    setoptionPuntosImg(imgfil)
  }
  useEffect(() => {
    OnLoadPointsOfLoad()
  }, [])

  const getMedicosGeneral = async (nom: string) => {
    try {
      const response = await getData(`${process.env.apijimmynew}/apimedicobynomape/${nom}`);
      const mappedOptions = response.map((est: any) => ({
        value: est.IdMedico,
        label: est.nommed,
      }));
      setoptionMedicosG(mappedOptions);
    } catch (error) {
      console.error("Error al obtener médicos:", error);
    }
  };

  const getNomOrdenes = async () => {
    try {
      const response = await getData(`${process.env.apijimmynew}/programacionordenes/listaordenes`);

      const catalogoOrdenesOptions = response.map((est: any) => ({
        value: est.id,
        label: est.nombreExamen,
      }));
      setOptionCatalogoOrdenes(catalogoOrdenesOptions)
    } catch (error) {
      console.error("Error al obtener médicos:", error);
    }
  }
  const getFechaProgramacionByMedico = async (idmedico: number) => {
    const data = await getData(`${process.env.apijimmynew}/programacionordenes/medico/${idmedico}`)
    setProgramaciones(data);
  }
  useEffect(() => {

    getNomOrdenes();
  }, [])

  const idmedicoW = watch('idmedico')

  useEffect(() => {
    if (idmedicoW) {
      getFechaProgramacionByMedico(idmedicoW?.value)
    }
  }, [idmedicoW])

  const turnow = watch('turno')

  useEffect(() => {
    if (turnow == 1) {
      setValue("horaInicio", "08:00");
      setValue("horaFin", "12:00");
    } else {
      setValue("horaInicio", "14:00");
      setValue("horaFin", "18:00");
    }
  }, [turnow, setValue])

  const onDoubleClick=(event:any)=>{
    console.log({doubleClick:event});
  }
  const onSelect=(event:any)=>{
    console.log({click:event})
  }

  const onViewChange=(event:any)=>{
    console.log({ViewChange:event})
  }

  return (
    <div className=" mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">

      {/* Formulario */}
      <div className="bg-white shadow p-4 rounded lg:col-span-1">
        <h2 className="text-xl font-bold mb-4">Programar Imagenología</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Controller
              name="idpuntocarga"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  instanceId="unique-select-id"
                  {...field}
                  options={optionCatalogoOrdenes}
                  placeholder="Catalogo"
                  className="w-full"
                  required
                  isClearable
                  isSearchable
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="idmedico"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  instanceId="unique-select-id"
                  {...field}
                  options={optionMedicosG}
                  placeholder="Médicos"
                  className="w-full"
                  required
                  isClearable
                  isSearchable
                  onInputChange={(inputValue) => {
                    if (inputValue.length > 2) {
                      getMedicosGeneral(inputValue);
                    }
                  }}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                  }}
                />
              )}
            />
          </div>
          <div>
            <select className="w-full border p-2 rounded shadow-sm"  {...register('turno')}>
              <option value="1">Turno Mañana</option>
              <option value="2">Turno Tarde</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Hora Inicio</label>
              <input
                type="time"
                {...register('horaInicio', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.horaInicio && <p className="text-red-500 text-sm">Campo obligatorio</p>}
            </div>

            <div>
              <label className="block font-medium">Hora Fin</label>
              <input
                type="time"
                {...register('horaFin', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.horaFin && <p className="text-red-500 text-sm">Campo obligatorio</p>}
            </div>
          </div>



          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar programación
          </button>
        </form>
      </div>

      {/* Calendario */}
      <div className="bg-white shadow p-4 rounded lg:col-span-4">
        <h2 className="text-xl font-bold mb-4">Calendario de Programación</h2>
        <Calendar
          style={{ height: "calc(100vh - 400px)" }}
          localizer={localizer}
          events={eventosCalendario}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={customEventStyle}
          views={["month", "week", "day"]}
          messages={getMessagesES()}
          culture='es'
          titleAccessor={(event) => event.title}
          components={{
            event: CalendarEvent
          }}
          onDoubleClickEvent={onDoubleClick}
          onSelectEvent={onSelect}
          onView={onViewChange}
        />
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md"
          onClick={() => setSelectedDates([])}
        >
          Limpiar selección
        </button>


        <div className="mt-4">
                <CalendarModal/>
          <h3>Fechas seleccionadas:</h3>
          <ul>
            {selectedDates.length > 0 ? (
              selectedDates.map((date, index) => <li key={index}>{date}</li>)
            ) : (
              <li>No hay fechas seleccionadas.</li>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default ProgramacionImagenologia;
