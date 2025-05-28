import { ModalProps } from '@/components/ui/ModalProps/ModalProps';
import Image from 'next/image';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaFileMedical, FaUndoAlt } from 'react-icons/fa';

export const CEFormatoRehabilitacion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit, control, register, formState: { errors }, reset } = useForm();
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const FormRehabilitacion: SubmitHandler<any> = async (data: any) => {

  }

  return (
    <>
      <ModalProps isOpen={isModalOpen} onClose={closeModal} width="40vw" height="55vh">
    <form className="max-w-5xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Historia Clínica de Optometría</h2>

      {/* DATOS PERSONALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Fecha</label>
          <input type="date" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Hora</label>
          <input type="time" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Apellidos</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Nombres</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de Nacimiento</label>
          <input type="date" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Edad</label>
          <input type="number" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Género</label>
          <select className="w-full border p-2 rounded">
            <option>Masculino</option>
            <option>Femenino</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Ocupación</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input type="tel" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Dirección</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Procedencia</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Último Control Visual</label>
          <input type="date" className="w-full border p-2 rounded" />
        </div>
      </div>

      {/* MOTIVO DE CONSULTA */}
      <div>
        <label className="block text-sm font-medium">Motivo de consulta</label>
        <textarea className="w-full border p-2 rounded h-24" />
      </div>

      {/* EXAMEN EXTERNO */}
      <div>
        <h3 className="text-lg font-semibold">Examen Externo / Biomicroscopía</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            
            <Image
                                            src="/img/od.png"
                                            alt="Logo del hospital"
                                            width={254}
                                            height={254}
                                            className="w-full h-40 object-contain border rounded"
                                        />
          </div>
          <div className="flex flex-col items-center">
          
          <Image
                                            src="/img/oi.png"
                                            alt="Logo del hospital"
                                            width={254}
                                            height={254}
                                            className="w-full h-40 object-contain border rounded"
                                        />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {["Órbita / Cejas", "Párpados / Pestañas", "Sistema Lagrimal", "Conjuntiva / Esclera", "Córnea / Cámara Anterior", "Iris / Pupila", "Cristalino"].map((item) => (
            <div key={item}>
              <label className="block text-sm font-medium">{item}</label>
              <input type="text" className="w-full border p-2 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* REFLEJOS PUPILARES */}
      <div>
        <h3 className="text-lg font-semibold">Reflejos Pupilares</h3>
        <div className="flex gap-4 flex-wrap">
          {["Acomodativo", "Fotomotor", "Consensual"].map((reflejo) => (
            <label key={reflejo} className="flex items-center gap-2">
              <input type="checkbox" /> {reflejo}
            </label>
          ))}
        </div>
      </div>

      {/* OFTALMOSCOPIA */}
      <div>
        <h3 className="text-lg font-semibold">Oftalmoscopía</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium block mb-2">OD</span>
            <img src="./img/od.png" alt="OD" className="w-full h-40 object-contain border rounded" />
             
          </div>
          <div>
            <span className="font-medium block mb-2">OI</span>
            <img src="./img/oi.png" alt="OI" className="w-full h-40 object-contain border rounded" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">Papila / Disco</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-4 pt-6">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Guardar</button>
        <button type="reset" className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Limpiar</button>
      </div>
    </form>


      </ModalProps>
      <button
        className="letraFondo hover:letraFondo flex items-center "
        onClick={openModal}
      >
        <FaFileMedical />
        Oftalmologia
      </button>
    </>

  )
}
