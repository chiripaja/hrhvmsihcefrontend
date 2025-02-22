import { CEFarmacia } from '@/components/ConsultaExterna/orders/CEFarmacia/CEFarmacia'
import { CEImagenes } from '@/components/ConsultaExterna/orders/CEImagenes/CEImagenes'
import { CELaboratorio } from '@/components/ConsultaExterna/orders/CELaboratorio/CELaboratorio'
import { CEOtros } from '@/components/ConsultaExterna/orders/CEOtros/CEOtros'
import { CEProcedimientosConsultorio } from '@/components/ConsultaExterna/orders/CEProcedimientosConsultorio/CEProcedimientosConsultorio'
import React, { useState } from 'react'
import { OrdenesFarmacia } from './OrdenesFarmacia/OrdenesFarmacia'
import { OrdenesPatologia } from './OrdenesPatologiaClinica/OrdenesPatologia'
import { OrdenesAnatomiaPatologica } from './OrdenesAnatomiaPatologica/OrdenesAnatomiaPatologica'
import { OrdenesBancoSangre } from './OrdenesBancoSangre/OrdenesBancoSangre'
import { OrdenesRayosX } from './OrdenesRayosX/OrdenesRayosX'
import { OrdenesTomografia } from './OrdenesTomografia/OrdenesTomografia'

export const Ordenes = ({ datosEmergencia, session }: any) => {
    const [activeTab, setActiveTab] = useState(1);
    return (<>

        <div className="p-4">
            {/* Contenedor de los Tabs */}
            <div className="flex border-b">
                {/* Tab 1 */}
                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 1 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                        } focus:outline-none`}
                    onClick={() => setActiveTab(1)}
                >
                    Farmacia
                </button>

                {/* Tab 2 */}
                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 2 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                        } focus:outline-none`}
                    onClick={() => setActiveTab(2)}
                >
                    Patologia Clinica
                </button>

                {/* Tab 3 */}
                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 3 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                        } focus:outline-none`}
                    onClick={() => setActiveTab(3)}
                >
                    Anatomia Patologica
                </button>

                {/* Tab 4 */}
                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 4 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                        } focus:outline-none`}
                    onClick={() => setActiveTab(4)}
                >
                    Banco de Sangre
                </button>

                {/* Tab 5 */}
                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 5 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                        } focus:outline-none`}
                    onClick={() => setActiveTab(5)}
                >
                    Rayos X
                </button>

                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 6 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
                        } focus:outline-none`}
                    onClick={() => setActiveTab(6)}
                >
                    Tomografia
                </button>
            </div>

            {/* Contenedor del contenido de los tabs */}
            <div className="mt-4">
                {/* Contenido de Tab 1 */}
                {activeTab === 1 && (
                    <div className="p-4 bg-white border rounded-md shadow-md">
                        <OrdenesFarmacia datosEmergencia={datosEmergencia} session={session} />
                    </div>
                )}

                {/* Contenido de Tab 2 */}
                {activeTab === 2 && (
                    <div className="p-4 bg-white border rounded-md shadow-md">
                        <OrdenesPatologia datosEmergencia={datosEmergencia} session={session} />
                    </div>
                )}

                {/* Contenido de Tab 3 */}
                {activeTab === 3 && (
                    <div className="p-4 bg-white border rounded-md shadow-md">
                        <OrdenesAnatomiaPatologica datosEmergencia={datosEmergencia} session={session} />
                    </div>
                )}

                {/* Contenido de Tab 4 */}
                {activeTab === 4 && (
                    <div className="p-4 bg-white border rounded-md shadow-md">

                        <OrdenesBancoSangre datosEmergencia={datosEmergencia} session={session} />
                    </div>
                )}

                {/* Contenido de Tab 5 */}
                {activeTab === 5 && (
                    <div className="p-4 bg-white border rounded-md shadow-md">
                        <OrdenesRayosX datosEmergencia={datosEmergencia} session={session} />{/**/}
                    </div>
                )}
                {/* Contenido de Tab 6 */}
                {activeTab === 6 && (
                    <div className="p-4 bg-white border rounded-md shadow-md">
                        <OrdenesTomografia datosEmergencia={datosEmergencia} session={session} />{/**/}
                    </div>
                )}

            </div>
        </div>

    </>
    )
}
