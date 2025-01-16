'use client'

import { useState } from "react";

export default function ProbandoPage() {

  const [activeTab, setActiveTab] = useState('1');
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  return (
    <div className="flex flex-wrap bg-white p-3 rounded w-full shadow-2xl">

      <div className="border-e border-gray-200 dark:border-neutral-700">
        <nav className="flex flex-col space-y-2">
          <button
            type="button"
            className={`py-1 pe-4 inline-flex items-center gap-x-2 border-e-2 border-transparent text-sm whitespace-nowrap ${activeTab === '1'
                ? 'hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-600'
                : 'text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500'
              } focus:outline-none focus:text-blue-600`}
            onClick={() => handleTabChange('1')}
           
         
          >
            Antecedentes
          </button>

          <button
            type="button"
            className={`py-1 pe-4 inline-flex items-center gap-x-2 border-e-2 border-transparent text-sm whitespace-nowrap ${activeTab === '2'
                ? 'hs-tab-active:border-blue-500 hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-600'
                : 'text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500'
              } focus:outline-none focus:text-blue-600`}
            onClick={() => handleTabChange('2')}
         
           
          >
            Consulta Medica
          </button>




        </nav>
      </div>

      <div className="ms-3 flex-grow">
        {/* Mostrar el contenido de la pestaña activa */}
        <div
          className={activeTab === '1' ? '' : 'hidden'}
        >
          1
        </div>
        <div
          className={activeTab === '2' ? '' : 'hidden'}
        >
          2
        </div>


      </div>




    </div>
  )
}