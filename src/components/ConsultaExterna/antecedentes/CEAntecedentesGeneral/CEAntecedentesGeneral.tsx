'use client'
import { TfiBookmarkAlt, TfiClipboard, TfiRss, TfiWrite } from 'react-icons/tfi'
import style from './CEAntecedentesGeneral.module.css'
import { useCallback, useEffect, useState } from 'react'
import { useCEDatosStore } from '@/store'
import { getData } from '@/components/helper/axiosHelper'
import { SubmitHandler, useForm } from 'react-hook-form'

import { GrFormNextLink } from "react-icons/gr";
import axios from 'axios'
import { Loading } from '@/components/utils/Loading'
import { ToasterMsj } from '@/components/utils/ToasterMsj'


export const CEAntecedentesGeneral = ({ handleTabChange,cuentaDatos }: any) => {
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>();
   const getAntecedentes = useCallback(async (idpaciente: any) => {
    if (!idpaciente) return;

    setLoading(true);
    try {
        const data = await getData(`${process.env.apijimmynew}/consultaexterna/findbyidpacienteantecedentes/${idpaciente}`);

        setValue('antecedQuirurgico', data?.antecedQuirurgico || '');
        setValue('antecedAlergico', data?.antecedAlergico || '');
        setValue('antecedPatologico', data?.antecedPatologico || '');
        setValue('antecedFamiliar', data?.antecedFamiliar || '');
        setValue('antecedObstetrico', data?.antecedObstetrico || '');
        setValue('antecedentes', data?.antecedentes || '');
    } catch (error) {
        console.error('Error cargando antecedentes:', error);
        // Puedes mostrar un toast o alerta si quieres
    } finally {
        setLoading(false);
    }
}, [setValue]);
    useEffect(() => {
        if (cuentaDatos?.idpaciente) {
            getAntecedentes(cuentaDatos?.idpaciente);
        }
    }, [cuentaDatos, getAntecedentes]);

   
    const FormAntecedentes: SubmitHandler<any> = async (data: any) => {
        setIsSubmitting(true);
        try {
            await axios.put(`${process.env.apijimmynew}/consultaexterna/actualizarAntecedentes/${cuentaDatos?.idpaciente}`, data);
            ToasterMsj('Exito', 'success', 'Se pasará a diagnostico.');
            handleTabChange('2')
        } catch (error) {
            console.error('Error al enviar el formulario:', error); 
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <>{loading ? (
            <div className="skeleton-container">
                {/* You can replace this with a skeleton component or spinner */}
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
                <div className="skeleton-card"></div>
            </div>
        ) : (
            <form onSubmit={handleSubmit(FormAntecedentes)}>
                <div className={style.container}>
                    <div className={style.card}>
                        <h2 className={style.card__header}>
                            <span className={`${style.card__header__borderGreen} borderfondo`}></span>
                            Quirugicos      <TfiBookmarkAlt size={23} className="text-gray-400 ml-4" />
                        </h2>
                        <div className={style.card__body}>
                            <div className="mb-4 w-full">
                                <textarea
                                    {...register('antecedQuirurgico')}
                                    className={style.card__body__TextArea}
                                    rows={3}
                                    placeholder="Antecedentes quirurgicos..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={style.card}>
                        <h2 className={style.card__header}>
                        <span className={`${style.card__header__borderGreen} borderfondo`}></span>
                            Alergias      <TfiClipboard size={23} className="text-gray-400 ml-4" />
                        </h2>
                        <div className={style.card__body}>
                            <div className="mb-4 w-full">
                                <textarea
                                    {...register('antecedAlergico')}
                                    className={style.card__body__TextArea}
                                    rows={3}
                                    placeholder="Antecedentes Alergicos..."
                                />
                            </div>
                        </div>
                    </div>


                    <div className={style.card}>
                        <h2 className={style.card__header}>
                        <span className={`${style.card__header__borderGreen} borderfondo`}></span>
                            Patologicos      <TfiRss size={23} className="text-gray-400 ml-4" />
                        </h2>
                        <div className={style.card__body}>
                            <div className="mb-4 w-full">
                                <textarea
                                    {...register('antecedPatologico')}
                                    className={style.card__body__TextArea}
                                    rows={3}
                                    placeholder="Antecedentes Patologicos..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={style.card}>
                        <h2 className={style.card__header}>
                        <span className={`${style.card__header__borderGreen} borderfondo`}></span>
                            Familiares      <TfiWrite size={23} className="text-gray-400 ml-4" />
                        </h2>
                        <div className={style.card__body}>
                            <div className="mb-4 w-full">
                                <textarea
                                    {...register('antecedFamiliar')}
                                    className={style.card__body__TextArea}
                                    rows={3}
                                    placeholder="Antecedentes Familiares..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={style.card}>
                        <h2 className={style.card__header}>
                        <span className={`${style.card__header__borderGreen} borderfondo`}></span>
                            Obstetricos      <TfiBookmarkAlt size={23} className="text-gray-400 ml-4" />
                        </h2>
                        <div className={style.card__body}>
                            <div className="mb-4 w-full">
                                <textarea
                                    {...register('antecedObstetrico')}
                                    className={style.card__body__TextArea}
                                    rows={3}
                                    placeholder="Antecedentes Obstetricos..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={style.card}>
                        <h2 className={style.card__header}>
                        <span className={`${style.card__header__borderGreen} borderfondo`}></span>
                            Otros      <TfiClipboard size={23} className="text-gray-400 ml-4" />
                        </h2>
                        <div className={style.card__body}>
                            <div className="mb-4 w-full">
                                <textarea
                                    {...register('antecedentes')}
                                    className={style.card__body__TextArea}
                                    rows={3}
                                    placeholder="Antecedentes Otros..."
                                />
                            </div>
                        </div>
                    </div>




                    <div className="flex justify-end mt-6 col-span-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center px-4 py-2 rounded focus:outline-none ${isSubmitting ? 'bg-gray-400' : 'colorFondo'} text-white`}
                        >
                            {isSubmitting ? (
                                <Loading />
                            ) : (
                                <>
                                    Guardar y continuar
                                    <GrFormNextLink className="ml-2" />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </form>
        )}
        </>
    )
}
