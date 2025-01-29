import { getData } from "@/components/helper/axiosHelper";
import { Loading } from "@/components/utils/Loading";
import { useCEDatosStore } from "@/store";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GrFormNextLink } from "react-icons/gr";

export const CEPaquetes = ({  onClose }: any) => {
     const [OptionPuntoCarga, setOptionPuntoCarga] = useState<any[]>([]);
        const [DatosPaquetes, setDatosPaquetes] = useState<any[]>([]);
        const [OptionPaquetes, setOptionPaquetes] = useState<any[]>([]);
        const [DatosKit, setDatosKit] = useState<any[]>([])
     const getPuntoCarga = async () => {
            const data = await getData(`${process.env.apijimmynew}/recetas/puntoscargapaquetes`);
            setOptionPuntoCarga(data);
            const datosPaq = await getData(`${process.env.apijimmynew}/recetas/paquetes`);
            setDatosPaquetes(datosPaq);
        }
        useEffect(() => {
            getPuntoCarga()
        }, [])
    
    
    
    
        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const datosFiltrados = DatosPaquetes.filter((data: any) => data.idPuntoCarga == event.target.value)
            setOptionPaquetes(datosFiltrados)
        };
        const MostrarPaquete = async (id: any) => {
            const dato = await getData(`${process.env.apijimmynew}/recetas/FacturacionCatalogoPaquetesXpaquete/${id}`);
            setDatosKit(dato)
            
        }
    
        const onSubmit = (data: any) => {
            if (!data.idFactPaquete) {
                alert("Por favor, seleccione un paquete.");
                return;
            }
        };
    
    
    const cuentaDatos = useCEDatosStore((state: any) => state.datosce);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, register, handleSubmit, watch,setValue, reset, formState: { errors } } = useForm<any>();
    
    const puntoCarga = (id: any) => {
        switch (id) {
            case 2:
                return "Patología Clínica";
            case 3:
                return "Anatomia Patologica";
            case 5:
                return "Farmacia";
            case 11:
                return "Banco de Sangre";
            case 20:
                return "Ecografía General";
            case 21:
                return "Rayos X";
            case 22:
                return "Tomografia";
            case 23:
                return "Ecografía Obstétrica";
            default:
                return "Número no reconocido";
        }
    }
    const FormKits=(iddx:any)=>{
     
        const objFarmacia={}
    }
    const idFactPaqueteW=watch("idFactPaquete")
    useEffect(() => {
        console.log(idFactPaqueteW)
        if(idFactPaqueteW){
            console.log("entor")
            MostrarPaquete(idFactPaqueteW);
        }
    }, [idFactPaqueteW])
    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} >
                <select

                    onChange={handleChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 }`}
                >
                    <option value="">Seleccione</option>
                    {OptionPuntoCarga && OptionPuntoCarga.length > 0 && OptionPuntoCarga.map((opcion: any) => {
                        return (
                            <option key={opcion.idPuntoCarga} value={opcion.idPuntoCarga}>
                                {opcion.descripcion}
                            </option>
                        );
                    })}
                </select>
              
                {/* Select para Paquetes */}
                <div className="mt-4">
                    <select
                        className={`w-full px-3 py-2 border ${errors.idFactPaquete ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 ${errors.idFactPaquete ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                        {...register("idFactPaquete", {
                            required: "Por favor, seleccione un paquete.",
                        })}
                    >
                        <option value="">Seleccione un paquete</option>
                        {OptionPaquetes &&
                            OptionPaquetes.length > 0 &&
                            OptionPaquetes.map((opcion: any) => (
                                <option key={opcion.idFactPaquete} value={opcion.idFactPaquete}>
                                    {opcion.descripcion}
                                </option>
                            ))}
                    </select>
                    {/* Mensaje de error */}
                    {errors.idFactPaquete?.message && typeof errors.idFactPaquete.message === "string" && (
                        <p className="mt-1 text-sm text-red-500">{errors.idFactPaquete.message}</p>
                    )}
                </div>
             
            </form>

            {DatosKit.length>0 && 
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Listado Adicionar</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border border-gray-300">Código</th>
                            <th className="px-4 py-2 border border-gray-300">Descripción</th>
                            <th className="px-4 py-2 border border-gray-300">Cantidad</th>
                            <th className="px-4 py-2 border border-gray-300">Destino</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DatosKit.map((item: any, index: number) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className="px-4 py-2 border border-gray-300">{item.Codigo}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.Descripcion}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.Cantidad}</td>
                                <td className="px-4 py-2 border border-gray-300">{puntoCarga(item.idPuntoCarga)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        
            <form>
                Seleccione Diagnostico:
                {cuentaDatos?.diagnosticos?.length > 0 && (
                    <Controller
                        name="diagnostico"
                        control={control}
                        defaultValue={cuentaDatos.diagnosticos[0]?.IdDiagnostico}
                        render={({ field }) => (
                            <select {...field} className="w-full border p-2 rounded shadow-sm">
                                <option value="">
                                    Seleccione
                                </option>
                                {cuentaDatos.diagnosticos
                                    .filter((value: any, index: any, self: any) =>
                                        index === self.findIndex((t: any) => t.IdDiagnostico === value.IdDiagnostico)
                                    )
                                    .map((data: any) => (
                                        <option key={data?.IdDiagnostico} value={data?.IdDiagnostico}>
                                            {data?.nomdx}
                                        </option>
                                    ))}
                            </select>
                        )}
                    />
                )}
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
                                Agregar Kit de Medicamentos y Servicios
                                <GrFormNextLink className="ml-2" />
                            </>
                        )}
                    </button>
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </form>

        </div>
}
        </>
    );
};