import { getData } from '@/components/helper/axiosHelper';
import { ModalProps } from '@/components/ui/ModalProps/ModalProps';
import SelectGenerico from '@/components/utils/SelectGenerico';
import { debounce } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from 'react-select';
export const DiagnosticoMortalidad = () => {
    const [optionsDx, setOptionsDx] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [optionsClasificacionDx, setOptionsClasificacionDx] = useState<any[]>([]);
    const [OptionsSubclasificacionMortalidad, setOptionsSubclasificacionMortalidad] = useState<any[]>([]);
    const { handleSubmit: handleSubmitMortalidad, control: controlMortalidad, register: registerMortalidad, reset: resetMortalidad } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handleSubmit, control, register, formState: { errors }, reset } = useForm();
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
   const getDatos = async () => {
        const subclasificacionMortalidad = await getData(`${process.env.apijimmynew}/diagnosticos/subclasificacionByIdclasificacion/4`);
        setOptionsSubclasificacionMortalidad(subclasificacionMortalidad)
    }

    const FormDx: SubmitHandler<any> = async (data: any) => {
        /*const subClasificacion = optionsClasificacionDx.find((item: any) => item.idSubclasificacionDx == data.idSubclasificacionDx);
        await setDiagnosticoByCuenta(
          data.IdDiagnostico.value,
          data.IdDiagnostico.label,
          data.IdDiagnostico.codigoCIE10,
          data.idSubclasificacionDx,
          subClasificacion.descripcion,
          '',
          3,
          data.idOrdenDx
        );*/
    }
    const fetchDx = useCallback(
        debounce(async (nomdx) => {
            try {
                setIsLoading(true);
                const response = await getData(`${process.env.apijimmynew}/diagnosticos/findByName/${nomdx}`);
                const mappedOptions = response.map((est: any) => ({
                    value: est.idDiagnostico,
                    label: `${est.codigoCIE10} - ${est.descripcion}`,
                    codigoCIE10: est.codigoCIE10
                }));
                setOptionsDx(mappedOptions);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setOptionsDx([]);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );
    return (
        <>
            <ModalProps isOpen={isModalOpen} onClose={closeModal} width="40vw" height="55vh">


                <fieldset className='border p-3  rounded-lg mt-2'>
                    <legend className='font-bold'>Diagnósticos de Mortalidad</legend>
                    <form onSubmit={handleSubmitMortalidad(FormDx)}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Diagnóstico</label>
                                <Controller
                                    name="IdDiagnostico"
                                    control={controlMortalidad}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            instanceId="unique-select-id"
                                            {...field}
                                            className=" mb-2"
                                            options={optionsDx}
                                            required={true}
                                            placeholder={isLoading ? 'Cargando...' : 'Seleccione un diagnostico'}
                                            isLoading={isLoading}
                                            onInputChange={(value) => {
                                                if (value.length >= 3) {
                                                    fetchDx(value);
                                                } else {
                                                    setOptionsDx([]);
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tipo diagnóstico</label>
                                <SelectGenerico
                                    opciones={optionsClasificacionDx}
                                    control={controlMortalidad}
                                    name="idSubclasificacionDx"
                                    idKey="idSubclasificacionDx"
                                    labelKey="descripcion"
                                    rules={{ required: "Este campo es obligatorio" }}
                                />
                            </div>

                        </div>
                        <div className="mt-4 flex space-x-2">

                            <button className="bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center">
                                Agregar Dx
                            </button>
                        </div>
                    </form>

                </fieldset>
            </ModalProps>
        </>
    )
}
