'use client'

import { getData } from "@/components/helper/axiosHelper";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import Swal from "sweetalert2";
export const Roles = () => {
    const [options, setOptions] = useState<any[]>([]);
    const [optionsRoles, setOptionsRoles] = useState<any[]>([]);
    const [listaRoles, setlistaRoles] = useState<any[]>([])
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>();
    const getRoles=async()=>{
           const response = await getData(`${process.env.apijimmynew}/empleados/`);
                    const mappedOptions = response.map((est: any) => ({
                        value: est.idEmpleado,
                        label: `${est.apellidoPaterno.trim()} ${est.apellidomaterno.trim()} ${est.nombres.trim()}`,
                   
                    }));
                    setOptions(mappedOptions);

                    const response2 = await getData(`${process.env.apijimmynew}/empleados/roles`);
                    const mappedOptions2 = response2.map((est: any) => ({
                        value: est.idRol,
                        label: `${est.nombre.trim()}`
                    }));
                    setOptionsRoles(mappedOptions2);
    }
    useEffect(() => {
        getRoles()
    }, [])

    const AddRoles=async(dat:any)=>{
        const objenvio={
            idEmpleado: dat?.empleado.value,
            idRol: dat?.permisos.value
          }
        const {data}=await axios.post(`${process.env.apijimmynew}/empleados/roles`,objenvio)
        Swal.fire({
            title: "Informativo",
            text: data,
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
          });
    }
    const empleadow=watch('empleado')

    const getRolesUser=async(idempleado:any)=>{
        const data=await getData(`${process.env.apijimmynew}/empleados/roles/${idempleado}`)
        setlistaRoles(data)
    }

    useEffect(() => {
        if(empleadow){
            getRolesUser(empleadow.value)
        }
       
    }, [empleadow])
    
    
    return (
<div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">Gestión de Usuarios y Roles</h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit(AddRoles)}
        >
          {/* Lista Usuarios */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Lista de Usuarios</label>
            <Controller
              name="empleado"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  instanceId="empleado-select"
                  {...field}
                  options={options}
                  placeholder="Selecciona un empleado"
                  className="w-full"
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                  }}
                />
              )}
            />
          </div>

          {/* Permisos */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Permisos</label>
            <Controller
              name="permisos"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  instanceId="roles-select"
                  {...field}
                  options={optionsRoles}
                  placeholder="Selecciona un rol"
                  className="w-full"
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                  }}
                />
              )}
            />
          </div>

          {/* Botón Registrar */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="py-3 px-6 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 shadow-lg"
            >
              Agregar Rol
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Roles */}
      <div className="mt-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Roles del Usuario</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border border-gray-300 text-left font-semibold text-gray-700">
                  Nombre
                </th>
              </tr>
            </thead>
            <tbody>
              {listaRoles.map((rol) => (
                <tr
                  key={rol.IdRol}
                  className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
                >
                  <td className="px-6 py-3 border border-gray-300 text-gray-700">
                    {rol.Nombre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )
}
