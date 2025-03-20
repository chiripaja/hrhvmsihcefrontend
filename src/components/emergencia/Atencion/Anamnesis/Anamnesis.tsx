import { showSuccessAlert } from "@/components/utils/alertHelper";
import axios, { Axios } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiFillFileText, AiOutlineHeart, AiOutlineHistory } from "react-icons/ai";
import { MdOutlineDescription, MdAccessTime, MdOutlineAssignment, MdHistory } from "react-icons/md";

export const Anamnesis = ({ datosEmergencia, session }: any) => {
    const { register, handleSubmit ,reset } = useForm();
  
    const onSubmit = async(data:any) => {
      const objeto={
        idCausaExternaMorbilidad: 13,
        idAtencion: datosEmergencia?.idatencion,
        idAtencionEmergencia:datosEmergencia?.atencionesEmergencia?.idAtencionEmergencia,
        idUsuarioAuditoria: parseInt(session?.user?.id),
        motivo: data?.motivoConsulta,
        te: data?.tiempoEnfermedad,
        relato: data?.relato,
        antecedentes: data?.antecedentes,
        efGeneral: data?.general,
        efRespiratorio: data?.respiratorio,
        efCardiovascular: data?.cardiovascular,
        efAbdomen: data?.abdomen,
        efNeurologico: data?.neurológico,
        efGentouriano: data?.genitourinario,
        efLocomotor: data?.locomotor,
        otros: data?.otros,
        evolucion: data?.evolucion
      }
      console.log(objeto) 
      try {
        
       const response=await axios.put(
          `${process.env.apijimmynew}/emergencia/AtencionesEmergenciaModificar`,
          objeto)
          console.log(response)
          showSuccessAlert("Guardado Correctamente.")
      } catch (error) {
          console.log(error)
      }
      
    };

    useEffect(() => {
      if (datosEmergencia?.atencionesEmergencia) {
        reset({
          motivoConsulta: datosEmergencia.atencionesEmergencia.motivo || "",
          tiempoEnfermedad: datosEmergencia.atencionesEmergencia.te || "",
          relato: datosEmergencia.atencionesEmergencia.relato || "",
          antecedentes: datosEmergencia.atencionesEmergencia.antecedentes || "",
          general: datosEmergencia.atencionesEmergencia.efgeneral || "",
          respiratorio: datosEmergencia.atencionesEmergencia.efrespiratorio || "",
          cardiovascular: datosEmergencia.atencionesEmergencia.efcardiovascular || "",
          abdomen: datosEmergencia.atencionesEmergencia.efabdomen || "",
          neurológico: datosEmergencia.atencionesEmergencia.efneurologico || "",
          genitourinario: datosEmergencia.atencionesEmergencia.efgentouriano || "",
          locomotor: datosEmergencia.atencionesEmergencia.eflocomotor || "",
          otros: datosEmergencia.atencionesEmergencia.otros || "",
          evolucion: datosEmergencia.atencionesEmergencia.evolucion || "",
        });
      }
    }, [datosEmergencia, reset]);
    return (
      <form onSubmit={handleSubmit(onSubmit)} className=" mx-auto bg-white p-6 ">
   
     
      {/* Sección Anamnesis */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AiFillFileText className="text-blue-500" /> Anamnesis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Motivo de Consulta</label>
          <div className="flex items-center border rounded p-2">

            <textarea {...register("motivoConsulta")} className="w-full outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Tiempo Enfermedad</label>
          <div className="flex items-center border rounded p-2">

            <textarea {...register("tiempoEnfermedad")} className="w-full outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Relato</label>
          <div className="flex items-center border rounded p-2">

            <textarea {...register("relato")} className="w-full outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Antecedentes</label>
          <div className="flex items-center border rounded p-2">
        
            <textarea {...register("antecedentes")} className="w-full outline-none" />
          </div>
        </div>
      </div>

      {/* Sección Examen Físico */}
      <h2 className="text-lg font-semibold mt-6 mb-4 flex items-center gap-2">
        <AiOutlineHeart className="text-red-500" /> Examen Físico
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {["General", "Respiratorio", "Cardiovascular", "Abdomen",
          "Neurológico", "Genitourinario", "Locomotor", "Otros"
        ].map((field) => (
          <div key={field} className="mb-2">
            <label className="block text-sm font-medium">{field}</label>
            <div className="flex items-center border rounded p-2">

              <input type="text" {...register(field.toLowerCase())} className="w-full outline-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Sección Evolución */}
      <h2 className="text-lg font-semibold mt-6 mb-4 flex items-center gap-2">
        <AiOutlineHistory className="text-green-500" /> Evolución
      </h2>
      <div className="flex items-center border rounded p-2">
        <MdOutlineAssignment className="text-gray-500 mr-2" />
        <textarea {...register("evolucion")} className="w-full outline-none" />
      </div>

      {/* Botón de envío */}
      {datosEmergencia?.idTipoAlta==null &&(
      <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2">
        Enviar
      </button>
      )}
    </form>
    )
}
