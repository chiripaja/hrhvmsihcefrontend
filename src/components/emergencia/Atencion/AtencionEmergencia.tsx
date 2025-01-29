'use client'
import { useState } from "react";
import { CabeceraEmergencia } from "./CabeceraEmergencia"
import { TriajeBusqueda } from "@/components/Triaje/TriajeBusqueda";
import { Anamnesis } from "./Anamnesis/Anamnesis";
import { ExamenFisicoEmergencia } from "./ExamenFisicoEmergencia/ExamenFisicoEmergencia";
import { OrdenesFarmacia } from "./OrdenesFarmacia/OrdenesFarmacia";
import { CEDiagnostico } from "@/components/ConsultaExterna/consultamedica/CEDiagnostico";
import { CEConsultaGeneral } from "@/components/ConsultaExterna";

export const AtencionEmergencia = ({session,idcuentaatencion}:any) => {
    const [activeTab, setActiveTab] = useState(1);
  return (
    <>
    <CabeceraEmergencia idcuentaatencion={idcuentaatencion}/>
  










    <div className="p-4">
      {/* Contenedor de los Tabs */}
      <div className="flex border-b">
        {/* Tab 1 */}
        <button
          className={`py-2 px-4 text-sm font-semibold ${
            activeTab === 1 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          } focus:outline-none`}
          onClick={() => setActiveTab(1)}
        >
          Triaje
        </button>

        {/* Tab 2 */}
        <button
          className={`py-2 px-4 text-sm font-semibold ${
            activeTab === 2 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          } focus:outline-none`}
          onClick={() => setActiveTab(2)}
        >
          Anamnesis
        </button>

         {/* Tab 5 */}
         <button
          className={`py-2 px-4 text-sm font-semibold ${
            activeTab === 5 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          } focus:outline-none`}
          onClick={() => setActiveTab(5)}
        >
          Diagnostico
        </button>

        {/* Tab 3 */}
        <button
          className={`py-2 px-4 text-sm font-semibold ${
            activeTab === 3 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          } focus:outline-none`}
          onClick={() => setActiveTab(3)}
        >
          Examen Fisico
        </button>

        {/* Tab 4 */}
        <button
          className={`py-2 px-4 text-sm font-semibold ${
            activeTab === 4 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          } focus:outline-none`}
          onClick={() => setActiveTab(4)}
        >
          Ordenes 
        </button>
      </div>

      {/* Contenedor del contenido de los tabs */}
      <div className="mt-4">
        {/* Contenido de Tab 1 */}
        {activeTab === 1 && (
          <div className="p-4 bg-white border rounded-md shadow-md">
            <TriajeBusqueda/>
          </div>
        )}

        {/* Contenido de Tab 2 */}
        {activeTab === 2 && (
          <div className="p-4 bg-white border rounded-md shadow-md">
            <Anamnesis/>
          </div>
        )}

        {/* Contenido de Tab 3 */}
        {activeTab === 3 && (
          <div className="p-4 bg-white border rounded-md shadow-md">
            <ExamenFisicoEmergencia/>
          </div>
        )}

         {/* Contenido de Tab 4 */}
         {activeTab === 4 && (
          <div className="p-4 bg-white border rounded-md shadow-md">
            <OrdenesFarmacia session={session}/>
          </div>
        )}

          {/* Contenido de Tab 5 */}
          {activeTab === 5 && (
          <div className="p-4 bg-white border rounded-md shadow-md">
            <CEConsultaGeneral/>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
