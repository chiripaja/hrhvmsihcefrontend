
import { FaPrint, FaSearchPlus } from "react-icons/fa";

import { useState } from "react";
import { ModalGeneric } from "../../ui/ModalGeneric/ModalGeneric";
import style from './CECabezeraTriaje.module.css'
import { CEHistoricosByDni } from "../historicos/CEHistoricosByDni";
import Image from "next/image";
import { CEFormatoRehabilitacion } from "../consultamedica/CEFormatoRehabilitacion";
import Link from "next/link";
export const CECabezeraTriaje = ({ dataPx,cuentaDatos }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>

            <div className='bg-white w-full mb-6 rounded-lg shadow-lg border-b-4 borderfondo'>
                <div className={style.mainTriaje__grid}>
                    <div className={style.mainTriaje__grid__header}>
                        <label className="text-2xl font-bold letraFondo">Signos Vitales y Biometría</label>
                        <button onClick={openModal} className="letraFondo hover:letraFondo flex items-center">
                            (Ver Históricos <FaSearchPlus className="ml-2" />)
                        </button>
                        <CEFormatoRehabilitacion />
                    </div>
                    <div className={style.mainTriaje__body}>
                        <div className={style.mainTriaje__body__container}>
                            <div className="flex-grow flex justify-center  md:mb-0">
                                <div className="h-32">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={dataPx?.foto ? `data:image/png;base64,${dataPx.foto}` : '/img/userdefault.png'}
                                            alt="Imagen decodificada"
                                            width={100}
                                            height={100}
                                            className="rounded-xl shadow-2xl"
                                            loading="lazy"
                                        />
                                    </div>

                                </div>

                            </div>
                            <div className={style.mainTriaje__body__container__item}>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Paciente:({dataPx?.nroDocumento}) {dataPx?.FuentesFinanciamiento}</span>
                                    <span className={style.txtColorContenido}>{dataPx?.nombreCompleto} </span>
                                </div>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Fecha de Nacimiento:</span>
                                    <span className={style.txtColorContenido}>{dataPx?.fechaNacimiento} ({dataPx?.edad} años)</span>
                                </div>

                            </div>
                            <div className={style.mainTriaje__body__container__item}>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Temperatura:</span>
                                    <span className={style.txtColorContenido}>{dataPx?.triajeTemperatura ? dataPx?.triajeTemperatura + " °" : '-'} </span>
                                </div>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Saturación (SAT):</span>
                                    <span className={style.txtColorContenido}>{dataPx?.triajeSaturacion ? dataPx?.triajeSaturacion + " %" : '-'}</span>
                                </div>

                            </div>
                            <div className={style.mainTriaje__body__container__item}>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Presión Arterial:</span>
                                    <span className={style.txtColorContenido}>
                                        {dataPx?.triajePresion ? dataPx?.triajePresion + " mmHg" : '-'}
                                    </span>
                                </div>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Frecuencia Cardíaca (FC):</span>
                                    <span className={style.txtColorContenido}>
                                        {dataPx?.triajeFrecCardiaca ? dataPx?.triajeFrecCardiaca + " x min" : '-'}
                                    </span>
                                </div>

                            </div>
                            <div className={style.mainTriaje__body__container__item}>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Talla:</span>
                                    <span className={style.txtColorContenido}>
                                        {dataPx?.triajeTalla ? dataPx?.triajeTalla + " cm" : '-'}
                                    </span>
                                </div>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    <span className={style.mainTriaje__body__container__item__container__txtprincipal}>Peso:</span>
                                    <span className={style.txtColorContenido}>
                                        {dataPx?.triajePeso ? dataPx?.triajePeso + " Kg" : '-'}
                                    </span>
                                </div>
                            </div>
                             <div className={style.mainTriaje__body__container__item}>
                                <div className={style.mainTriaje__body__container__item__container}>
                                    
                                    <span className={style.txtColorContenido}>
                                            <Link
          className="flex items-center px-4 h-12 py-2 mb-2 rounded focus:outline-none bg-blue-500 hover:bg-blue-800 text-white w-44 shadow-md transition duration-200"
          href={`/sihce/consultaexterna`}

        >
          📄 Lista Pacientes
        </Link>
                                        {(cuentaDatos?.FuaNumero && cuentaDatos?.idFuenteFinanciamiento=='3')&& (
                                          <Link
    className="flex items-center px-4 py-2 mb-2 rounded focus:outline-none bg-blue-700 hover:bg-blue-800 text-white w-44 shadow-md transition duration-200"
    href={`/reportes/fua/${cuentaDatos?.idcuentaatencion}`}
    target="_blank"
  >
    📄 FUA
  </Link>
                                        )}
                                {cuentaDatos?.diagnosticos.length > 0 && (
  <Link
    
    className="flex items-center px-4 py-2 rounded focus:outline-none colorFondo text-white w-44"
    href={`/reportes/hojaatencion/${cuentaDatos?.idcuentaatencion}`}
                                    target="__blank"
  >
    <FaPrint className="mr-2" />
    Impresión HC
  </Link>
)}
                                           
                                      
                                    </span>
                                </div>
                         
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ModalGeneric isOpen={isModalOpen} onClose={closeModal} css={style.modalSize}>
               
                <div className="text-sm text-gray-600">
                    <CEHistoricosByDni dni={dataPx?.nroDocumento} />
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={closeModal}
                    >
                        Cerrar
                    </button>
                </div>
            </ModalGeneric>
        </>
    );
};
