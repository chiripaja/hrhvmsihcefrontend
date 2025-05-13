import { ModalProps } from '@/components/ui/ModalProps/ModalProps'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { FaFileMedical } from 'react-icons/fa';
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { parseISO, format } from 'date-fns';

registerLocale('es', es)
export const CalendarModal = ({ isModalOpen, openModal, closeModal, datosModal, optionCatalogoOrdenes }: any) => {

  const { handleSubmit, control, register, formState: { errors }, reset } = useForm();
  useEffect(() => {
    if (datosModal) {
      const turno = datosModal.horaFin <= '12:30' ? 1 : 2;
      const fechaISO = datosModal.fecha ? parseISO(datosModal.fecha) : null;
      const fechaAjustada = fechaISO ? new Date(fechaISO.getTime() + fechaISO.getTimezoneOffset() * 60000) : null;

      // Buscar la opción correspondiente en optionCatalogoOrdenes
      const selectedOption = optionCatalogoOrdenes.find(
        (option: any) => option.value === datosModal.idPuntoCarga
      );


      reset({
        horaInicio: datosModal.horaInicio || "",
        horaFin: datosModal.horaFin || "",
        turno: turno,
        fecha: fechaAjustada,
        idpuntocarga: selectedOption || null, // Mantener el objeto para el Select
      });
    }
  }, [datosModal, reset, optionCatalogoOrdenes]);
  const onSubmitModal = async (data: any) => {
    const objEnvio = {
      idMedico: 1,
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      idpuntocarga: data.idpuntocarga?.value, // Aquí solo el valor
    };
    console.log(objEnvio);
  };
  return (
    <>
      <ModalProps isOpen={isModalOpen} onClose={closeModal} width="auto" height="auto">
        <form onSubmit={handleSubmit(onSubmitModal)} className="space-y-3 p-4 bg-white  max-w-lg mx-auto">
          {/* Encabezado del Modal */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Programación del Servicio</h2>

          {/* Información del Servicio */}
          <div className="space-y-1">
            <p className="text-gray-600"><span className="font-semibold">Título:</span> {datosModal?.title || "No especificado"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Servicio :</label>
            <Controller
              name="idpuntocarga"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  instanceId="unique-select-id"
                  options={optionCatalogoOrdenes}
                  placeholder="Catalogo"
                  className="w-full"
                  isClearable
                  isSearchable
                  value={field.value} // Mantener el objeto seleccionado
                  onChange={(option) => field.onChange(option)} // Manejar como objeto
                />
              )}
            />

          </div>

          {/* Selección de Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turno :</label>
            <select
              className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              {...register('turno')}
            >
              <option value="1">Turno Mañana</option>
              <option value="2">Turno Tarde</option>
            </select>
          </div>

          {/* Horarios de Inicio y Fin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio :</label>
              <input
                type="time"
                {...register('horaInicio', { required: "La hora de inicio es obligatoria" })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin :</label>
              <input
                type="time"
                {...register('horaFin', { required: "La hora de fin es obligatoria" })}
                className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />

            </div>
          </div>

          {/* Selector de Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha :</label>
            <div className="relative">
              <Controller
                name="fecha"
                control={control}
                rules={{ required: "La fecha es obligatoria" }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    locale={es}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona una fecha"
                    className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              />{errors.fecha?.message && (
                <p className="text-red-500 text-sm mt-1">{String(errors.fecha?.message)}</p>
              )}
            </div>
          </div>

          {/* Botón de Guardar */}
          <div className="flex ">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Actualizar programación
            </button>
          </div>
        </form>
      </ModalProps>

    </>

  )
}
