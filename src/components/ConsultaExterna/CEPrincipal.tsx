'use client'

import { FaUser } from 'react-icons/fa';
import InputTextTriaje from '../ui/InputTextTriaje';
import InputWithHeader from '../ui/InputWithHeader';
import { HCTotal } from './HCTotal';
import { CEAntecedentes } from './CEAntecedentes';

export const CEPrincipal = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white m-4 p-4 border rounded">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-lg font-semibold">
          Datos de Paciente
        </div>

        <div className="row-span-3 bg-cyan-50 hidden lg:block">
          {/* Espacio reservado para agregar información o imagen */}
        </div>

        <InputWithHeader label='Datos Paciente' defaultValue='Jose Manuel Ordoñez Torres' />
        <InputWithHeader label='Procedencia' defaultValue='Huanuco-Huanuco-Amarilis' />
        <InputWithHeader label='Fecha de Nacimiento' defaultValue='21/07/1988' />
        <InputWithHeader label='Referencia' defaultValue='Peru Corea' />
        <InputWithHeader label='Dni' defaultValue='786854879' />
        <InputWithHeader label='Financimiento' defaultValue='SIS' />

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-sky-600">
          UPSS. /Gastroenterologia / Dr. Fernando Ramos
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 font-bold">
          Consultas anteriores
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <HCTotal />
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 font-bold">
          Funciones Vitales
        </div>
        <InputTextTriaje label="Temperatura" unidadMedida={"C°"} requerido={false} disabled={true} defaultValue='37.5' />
        <InputTextTriaje label="Presion Arterial" unidadMedida={"x mmHg"} requerido={false} disabled={true} defaultValue='70/30' />
        <InputTextTriaje label="Peso" unidadMedida={"kg."} requerido={false} disabled={true} defaultValue='74' />

        <InputTextTriaje label="Saturacion (SAT)" unidadMedida={"%"} requerido={false} disabled={true} defaultValue='70' />
        <InputTextTriaje label="Frecuencia Cardiaca (FC)" unidadMedida={"x min"} requerido={false} disabled={true} defaultValue='40' />
        <InputTextTriaje label="Talla" unidadMedida={"cm."} requerido={false} disabled={true} defaultValue='1,65' />
      </div>

      <div className=' h-48 lg:h-auto'>  
        <CEAntecedentes/>
      </div>

    </div>
  );
}
