'use client'

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './calendarStyles.css';
const locales = { es: es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function NamePage() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    const dateSelected = format(slotInfo.start, "yyyy-MM-dd");
    setSelectedDates((prevDates) =>
      prevDates.includes(dateSelected)
        ? prevDates.filter((date) => date !== dateSelected)
        : [...prevDates, dateSelected]
    );
  };

  // Definir eventos para los días seleccionados
  const eventosCalendario = selectedDates.map((date) => ({
    title: "Seleccionado",
    start: new Date(`${date}T00:00:00`), // Usamos T00:00:00 para evitar diferencias horarias
    end: new Date(`${date}T23:59:59`),  // Cubrimos todo el día
    allDay: true,
  }));

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

  return (
    <div className="mx-auto p-6 transition-all duration-500 ease-in-out">
      <h2 className="text-xl font-bold mb-4">Calendario de Programación</h2>
      <Calendar
      style={{ height: "calc(100vh - 100px)", minHeight: "500px" }}
        localizer={localizer}
        events={eventosCalendario}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={customEventStyle}
        views={["month", "week", "day"]}
        messages={{
          today: "Hoy",
          previous: "Atrás",
          next: "Siguiente",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
        }}
      />
      <button
  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md"
  onClick={() => setSelectedDates([])}
>
  Limpiar selección
</button>
<div className="flex gap-2 mb-4">
  <button
    className="bg-blue-500 text-white py-2 px-4 rounded-md"
    onClick={() => console.log("Vista Día")}
  >
    Día
  </button>
  <button
    className="bg-green-500 text-white py-2 px-4 rounded-md"
    onClick={() => console.log("Vista Semana")}
  >
    Semana
  </button>
  <button
    className="bg-yellow-500 text-white py-2 px-4 rounded-md"
    onClick={() => console.log("Vista Mes")}
  >
    Mes
  </button>
</div>

      <div className="mt-4">
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
  );
}
