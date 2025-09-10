import { Button } from '@mui/material';
'use client'

const RecibirCita = () => {

  const recibirReferenciaPaciente = async () => {
    const dataenvio = {
      codigoRenipressDestino: "754",
      condicionPaciente: "E",
      fechaCita: "2025-09-11",
      horaCita: "15:00",
      idReferencia: "1365805",
      llegoPaciente: "S",
      personalRegistra: {
        apellidoMaterno: "FERNANDEZ",
        apellidoPaterno: "ROBLES",
        fechaNacimiento: "20000610",
        idcolegio: "06",
        idprofesion: "29",
        nombres: "MARIA",
        nroDocumento: "58778800",
        sexo: "F",
        tipoDocumento: "1",
      }
    }
    const response = await fetch("/api/refcon/recibirReferenciaPaciente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataenvio),
    });
    const result = await response.json();
    console.log(result)
  }



  const recibirCitaSubmit = async () => {
    const dataenvio = {
      codUnicoDestino: "754",
      datosCita: {
        consultorio: "MEDICINA INTERNA 2",
        fecha: "20250911",
        hora: "15:00:00",
        turno: "T",
      },
      datosMedico: {
        apellidoMaterno: "FERNANDEZ",
        apellidoPaterno: "ARGELINO",
        fechaNacimiento: "20000610",
        nombres: "PEREZ",
        nroDocumento: "78778899",
        sexo: "M",
        tipoDocumento: "1",
      },
      idReferencia: "1365805",
      personalRegistra: {
        apellidoMaterno: "FERNANDEZ",
        apellidoPaterno: "ROBLES",
        fechaNacimiento: "20000410",
        idcolegio: "06",
        idprofesion: "29",
        nombres: "MARIA",
        nroDocumento: "58778800",
        sexo: "F",
        tipoDocumento: "1",
      },
    };

    const response = await fetch("/api/refcon/recibirCita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataenvio),
    });
    const result = await response.json();
    console.log(result)
  }


  return (
    <div className='flex flex-col gap-4'>
      <button
        onClick={recibirCitaSubmit}
        className="bg-slate-600 text-white font-semibold rounded-xl px-6 py-3 
             shadow-md hover:bg-slate-700 hover:shadow-lg 
             transition-all duration-300 ease-in-out 
             focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
      >
        recibirCita
      </button>
      <button onClick={recibirReferenciaPaciente}
        className="bg-cyan-600 text-white font-semibold rounded-xl px-6 py-3 
             shadow-md hover:bg-cyan-700 hover:shadow-lg 
             transition-all duration-300 ease-in-out 
             focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1">
        recibirReferenciaPaciente
      </button>
    </div>
  )
}

export default RecibirCita
