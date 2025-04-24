'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Controller, useForm } from 'react-hook-form';
import { getData } from '@/components/helper/axiosHelper';
import Select from 'react-select';
import axios from 'axios';


type CalendarioEvento = Event & {
  title: string;
  start: Date;
  end: Date;
  servicio: string,
};

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const ProgramacionImagenologia = () => {
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm();
  const [programaciones, setProgramaciones] = useState<any[]>([]);
  const [optionPuntosImg, setoptionPuntosImg] = useState<any[]>([]);
  const [optionMedicosG, setoptionMedicosG] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit = async (data: any) => {
    const objProgra = {
      idProgramacionOrdenes: 0,
      idMedico: data.idmedico?.value,
      idPuntoCarga: parseInt(data.idpuntocarga),
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin
    }
    const datos = await axios.post(
      `${process.env.apijimmynew}/programacionordenes`,
      objProgra
    )

    getFechaProgramacion()
    // reset();
  };

  // Convertir a eventos para el calendario
  const eventosCalendario: CalendarioEvento[] = programaciones.map((p, index) => {
    const start = new Date(`${p.fecha}T${p.horaInicio}`);
    const end = new Date(`${p.fecha}T${p.horaFin}`);

    return {
      id: index,
      title: `Dr. ${p.medico?.empleado?.apellidoPaterno}`,
      start,
      end,
      servicio: `Serv: ${p.idPuntoCarga}`, // agregamos más información
    };
  });

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
  const getFechaProgramacion = async () => {
    const data = await getData(`${process.env.apijimmynew}/programacionordenes`)
    setProgramaciones(data);
  }
  useEffect(() => {
    getFechaProgramacion()
  }, [])
  return (
    <div className=" mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Formulario */}
      <div className="bg-white shadow p-4 rounded lg:col-span-1">
        <h2 className="text-xl font-bold mb-4">Programar Imagenología</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="block font-medium">Fecha</label>
            <input
              type="date"
              {...register('fecha', { required: true })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.fecha && <p className="text-red-500 text-sm">Este campo es obligatorio</p>}
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

          <div>

            {optionPuntosImg?.length > 0 && (
              <Controller
                name="idpuntocarga"
                control={control}
                rules={{
                  required: "El sexo es obligatorio",
                }}
                render={({ field }) => (
                  <>
                    <label className="block text-sm font-medium text-gray-600 dark:text-neutral-300">
                      Servicio
                    </label>
                    <select
                      {...field}
                      className={`w-full mt-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white ${errors.idpuntocarga ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Selecciona un servicio</option>
                      {optionPuntosImg.map((data: any) => (
                        <option key={data?.IdPuntoCarga} value={data?.IdPuntoCarga}>
                          {data?.Descripcion}
                        </option>
                      ))}
                    </select>
                    {errors.idpuntocarga && (
                      <span className="text-red-500 text-sm">
                        {typeof errors.idpuntocarga.message === 'string' ? errors.idpuntocarga.message : 'Error desconocido'}
                      </span>
                    )}
                  </>
                )}
              />
            )}
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
        <h2 className="text-xl font-bold mb-4">Calendario</h2>
        <Calendar
          localizer={localizer}
          events={eventosCalendario}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          views={['month', 'week', 'day', 'agenda']}
          messages={{
            today: 'Hoy',
            previous: 'Atrás',
            next: 'Siguiente',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango.',
            allDay: 'Todo el día',
          }}
          components={{
            event: ({ event }) => (
              <div>
                <strong>{event.title}</strong>
                <div>{event.servicio}</div>
              </div>
            ),
          }}
        />

      </div>
    </div>
  );
};

export default ProgramacionImagenologia;
