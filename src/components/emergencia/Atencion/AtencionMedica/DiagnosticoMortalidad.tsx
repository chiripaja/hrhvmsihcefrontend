import { getData } from '@/components/helper/axiosHelper';
import { ModalProps } from '@/components/ui/ModalProps/ModalProps';
import { showConfirmDeleteAlert } from '@/components/utils/alertHelper';
import SelectGenerico from '@/components/utils/SelectGenerico';
import { ToasterMsj } from '@/components/utils/ToasterMsj';
import { useEmergenciaDatosStore } from '@/store/ui/emergenciadatos';
import { debounce } from '@mui/material';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaHospitalUser, FaSkull } from 'react-icons/fa';
import Select from 'react-select';
export const DiagnosticoMortalidad = ({ datosEmergencia,enviarFormulario }: any) => {
    const [optionsDx, setOptionsDx] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [OptionsSubclasificacionMortalidad, setOptionsSubclasificacionMortalidad] = useState<any[]>([]);
    const { handleSubmit: handleSubmitMortalidad, control: controlMortalidad, register: registerMortalidad, reset: resetMortalidad } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const setDiagnosticoByCuenta = useEmergenciaDatosStore((state: any) => state.setDiagnosticoByCuenta)
    const { handleSubmit, control, register, formState: { errors }, reset } = useForm();
    const setEliminarDiagnosticoByCuenta = useEmergenciaDatosStore((state: any) => state.setEliminarDiagnosticoByCuenta);
    const [eliminandoDiagnostico, setEliminandoDiagnostico] = useState(Boolean);
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

    const FormDxMortalidad: SubmitHandler<any> = async (data: any) => {
        const subClasificacion = OptionsSubclasificacionMortalidad.find((item: any) => item.idSubclasificacionDx == data.idSubclasificacionDx);

        console.log(subClasificacion)
        await setDiagnosticoByCuenta(
            data.IdDiagnostico.value,
            data.IdDiagnostico.label,
            data.IdDiagnostico.codigoCIE10,
            data.idSubclasificacionDx,
            subClasificacion.descripcion,
            '',
            4,
            data.idOrdenDx
        );/**/
    }
    const handleDelete = async (IdDiagnostico: number, idClasificacionDx: number) => {
        try {
            showConfirmDeleteAlert().then(async (result) => {
                if (result.isConfirmed) {
                    setEliminandoDiagnostico(true);
                    await axios.delete(`${process.env.apijimmynew}/diagnosticos/deleteByIdDiagnosticoAndIdClasificacionDx/${IdDiagnostico}/3`);
                    await setEliminarDiagnosticoByCuenta(IdDiagnostico, idClasificacionDx);
                    ToasterMsj('Exito', 'success', 'Se elimino correctamente.');
                }
                else {
                    console.log("no elimino")
                }
            });
        } catch (error) {
            console.error("Error al eliminar diagnóstico:", error);
        } finally {
            setEliminandoDiagnostico(false);
        }

    };
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
    useEffect(() => {
        getDatos()
    }, [])
    const enviarAlta=()=>{
        enviarFormulario()
    }

    return (
        <>

            <ModalProps isOpen={isModalOpen} onClose={closeModal} width="50vw" height="55vh">


                <fieldset className='border p-3  rounded-lg mt-2'>
                    <legend className='font-bold'>Diagnósticos de Mortalidad</legend>
                    <form onSubmit={handleSubmitMortalidad(FormDxMortalidad)}>
                        <div className="grid grid-cols-2 gap-4">
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
                                    opciones={OptionsSubclasificacionMortalidad}
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
                  
                    <div className="overflow-x-auto">
                        <table className={datosEmergencia.diagnosticos?.filter((data: any) => data.idClasificacionDx == 4).length > 0 ? "tableT  w-3/4 mb-4" : "hidden"}>
                            <thead>
                                <tr>
                                    <th scope="col" className="tableth">Clasificacion</th>
                                    <th scope="col" className="tableth ">Diagnostico</th>
                                    {datosEmergencia?.idTipoAlta == null && (
                                        <th scope="col" className="tableth">Accion</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                {datosEmergencia.diagnosticos.filter((data: any) => data.idClasificacionDx == 4)
                                    .sort((a: any, b: any) => {
                                        // Ordenar por nomdx (lexicográficamente)
                                        if (a?.nomdx < b?.nomdx) return -1;  // Orden ascendente
                                        if (a?.nomdx > b?.nomdx) return 1;
                                        return 0;  // Si son iguales, no cambiar el orden
                                    })
                                    .map((data: any) => (
                                        <tr key={data?.codigoCIE10 + data?.labConfHIS}>
                                            <td className="tabletd w-10">{data?.subClasificacion}</td>
                                            <td>
                                                {data?.nomdx}

                                            </td>
                                            {datosEmergencia?.idTipoAlta == null && (
                                                <td className="tabletd">
                                                    <button type="button" className="aAzul" onClick={() => handleDelete(data.IdDiagnostico, data.idClasificacionDx)}>
                                                        Eliminar
                                                    </button>
                                                </td>)}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {datosEmergencia?.diagnosticos?.filter((data: any) => data.idClasificacionDx === 4).length > 0 && (
  <button className="btnprimario m-2" onClick={enviarAlta}>
    Aceptar
  </button>
)}
                       
                    </div>
                </fieldset>
            </ModalProps>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={openModal}>
                <FaHospitalUser />
                Diagnóstico de Mortalidad
            </button>
        </>
    )
}
