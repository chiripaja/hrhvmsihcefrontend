import { useState } from 'react';


interface Props {
  onAgregar: (p: any) => void;
}

export const ScheduleForm = ({ onAgregar }: Props) => {
  const [idMedico, setIdMedico] = useState('');
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idMedico || !servicio || !fecha) return;

    const nueva: any = {
      id: Date.now(),
      idMedico,
      servicio,
      fecha: new Date(fecha),
    };

    onAgregar(nueva);
    setIdMedico('');
    setServicio('');
    setFecha('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="ID Médico"
        value={idMedico}
        onChange={(e) => setIdMedico(e.target.value)}
        className="border p-2"
      />
      <input
        type="text"
        placeholder="Servicio"
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        className="border p-2"
      />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Agendar
      </button>
    </form>
  );
};
