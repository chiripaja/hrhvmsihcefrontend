import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {format} from 'date-fns/format';
import {parse} from 'date-fns/parse';
import {startOfWeek} from 'date-fns/startOfWeek';

import 'react-big-calendar/lib/css/react-big-calendar.css';
export interface Programacion {
    id: number;
    idMedico: string;
    servicio: string;
    fecha: Date;
  }
import { getDay } from 'date-fns';

const locales = {
  'es': require('date-fns/locale/es'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Props {
  eventos: Programacion[];
}

export const ProgramacionImagenologia = ({ eventos }: Props) => {
  const events = eventos.map((e) => ({
    title: `${e.servicio} (Dr. ${e.idMedico})`,
    start: new Date(e.fecha),
    end: new Date(e.fecha),
    allDay: true,
  }));

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        culture="es"
      />
    </div>
  );
};
