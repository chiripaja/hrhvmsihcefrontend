'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';

export const CabeceraEmergencia = ({idcuentaatencion}:any) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.apijimmynew}/atenciones/${idcuentaatencion}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>; // Muestra un loader mientras se carga la información.

  return (
    <>
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto hidden">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        {/* Aquí puedes agregar una imagen de perfil si la propiedad 'foto' está disponible */}
        {data.foto ? (
          <img
            className="h-24 w-24 rounded-full object-cover"
            src={data.foto}
            alt={data.nombreCompleto}
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xl text-white">{data.nombreCompleto[0]}</span>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">{data.nombreCompleto}</h2>
        <p className="text-sm text-gray-600">Edad: {data.edad}</p>
        <p className="text-sm text-gray-600">Documento: {data.nroDocumento}</p>
        <p className="text-sm text-gray-600">Fecha de Nacimiento: {data.fechaNacimiento}</p>
      </div>
    </div>

  </div>
  <h2 className="text-2xl font-semibold text-gray-500 ml-6">{data.nombreCompleto} - {data.nroDocumento}</h2>
    </>
    
  );
};
