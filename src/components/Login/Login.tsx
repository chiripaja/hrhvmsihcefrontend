'use client'
const crypto = require('crypto');
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { docredentials } from "@/actions/auth-actions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import Image from "next/image";
import { useMyStore } from "@/store/ui/useProgramacionStore";
type FormInput = {
    usuario: string
    clave: string
}
const MySwal = withReactContent(Swal);
export const Login = () => {
    const router = useRouter()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>();
  const { idprogramacionzus, setIdProgramacionzus } = useMyStore()
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
        setIsLoading(true);

        const hash = crypto.createHash('sha1');
        hash.update(data.clave);
        const clave = hash.digest('hex'); // Guarda el hash en una variable
    
        const usuario = data.usuario;
     
       try {
            const response = await docredentials(usuario, clave)
       
            if (!!response.error) {
                MySwal.fire({
                    title: "Error",
                    text: "Credenciales incorrectas.",
                    icon: "error",
                });
            } else {
                router.push("/sihce/inicio")
            }
        } catch (error) {
            MySwal.fire({
                title: "Error",
                text: "Error en el servidor. Inténtelo de nuevo más tarde.",
                icon: "error",
            });
        }
        finally {
            setIsLoading(false);
        } 
    }
const handleClearStore = async () => {
  // Limpia en memoria
  setIdProgramacionzus("");

  // Limpia en localStorage (persistencia)
  await useMyStore.persist.clearStorage();

  console.log("✅ Store limpiado");
};
useEffect(() => {
handleClearStore();
}, [])


    return (
        <main className="flex justify-center bg-gray-300">
    
            <div className="w-full sm:w-[400px] px-5">
                <div className="flex flex-col min-h-screen   justify-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-xl">

                        {isLoading && (
                            <div className="relative mb-4 block w-full rounded-lg bg-sky-800 p-4 text-base leading-5 text-white animate-pulse">
                                Cargando...
                            </div>
                        )}

                        <div className="flex justify-center mb-6">
                            <Image
                                src="/img/logo_hrhvm.png"
                                alt="Logo del hospital"
                                width={254}
                                height={254}
                                className="w-36 h-auto"
                            />
                        </div>

                        <div className="flex flex-col mt-3 space-y-4">
                            <div>
                                <label htmlFor="usuario" className="text-gray-700 font-semibold">Usuario</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                    {...register("usuario")}
                                    placeholder="Ingrese su usuario"
                                />
                            </div>

                            <div>
                                <label htmlFor="clave" className="text-gray-700 font-semibold">Contraseña</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                    {...register("clave", { required: true })}
                                    placeholder="Ingrese su contraseña"
                                />
                            </div>

                            <button
                                className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg shadow-md transition-transform hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 disabled:opacity-50"
                                type="submit"
                            >
                                Ingresar 
                            </button>
                      
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
