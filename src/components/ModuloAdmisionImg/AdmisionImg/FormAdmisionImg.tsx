import { getData } from '@/components/helper/axiosHelper'
import Select from 'react-select';
import { ModalGeneric } from '@/components/ui/ModalGeneric/ModalGeneric'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { showSuccessAlert } from '@/components/utils/alertHelper';
import { showSuccessError } from '../../utils/alertHelper';

import { Box, Button, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
export const FormAdmisionImg = ({ isModalOpen, closeModal, datosPx, dataExamenes, GetListadosCitas }: any) => {
    const [filtro, setFiltro] = useState("");
    const [dataProgramaciones, setdataProgramaciones] = useState<any[]>([])
    const [ListaProgramaciones, setListaProgramaciones] = useState<any[]>([])
    const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<any>({
        defaultValues: {
            intereses: [],
        }
    });
    const getProgramacion = async () => {
        const data = await getData(`${process.env.apijimmynew}/programacionordenes`)
        const mappedOptionsOrigenAtencion = data.map((est: any) => ({
            value: est.idProgramacionOrdenes,
            label: `${est.fecha?.trim() + " " + est.catalogOrdenes?.nombreExamen}`
        }));
        setdataProgramaciones(mappedOptionsOrigenAtencion)
    }
    useEffect(() => {

        getProgramacion()
    }, [])

    useEffect(() => {
        if (isModalOpen && datosPx) {
            reset({
                Telefono: datosPx?.Telefono || '',
                intereses: [], // esto limpia los checkboxes
            });
        }
    }, [isModalOpen, datosPx, reset]);
    const FormImg = async (data: any) => {
        console.log(data.imgordenes)
        if (data.imgordenes) {
            for (const img of data.imgordenes) {
                const [receta, idproducto] = img.split("-");
             
                const objImg = {
                    id: 0,
                    idProducto: parseInt(idproducto, 10),
                    idPaciente: datosPx.IdPaciente,
                    idCuentaAtencion: datosPx.IdCuentaAtencion,
                    numReceta: String(datosPx.idReceta),
                    procedencia: datosPx?.nomServicio,
                    idempleado: 1,
                    observacion: "",
                    fechaEntrega: null,
                    idprogramacionordenes: data?.idprogramacion.value,
                    recetaFactCatServ: img
                }
                const response = await axios.post(`${process.env.apijimmynew}/citasimagenologia`, objImg)
                GetListadosCitas();/**/
                getProgramacionByIdProgramacion(idprogramacionw?.value)
            }
            showSuccessAlert("Guardado Correctamente.")
        } else {
            showSuccessError("Escoja algun examen")
        }

    }
    const idprogramacionw = watch('idprogramacion')

    useEffect(() => {
        console.log(dataExamenes)
        reset({ intereses: [] }); // o imgordenes: [] si es el campo correcto
    }, [dataExamenes, reset]);

    const getProgramacionByIdProgramacion = async (idprogramacion: any) => {
        const { data } = await axios.get(`${process.env.apijimmynew}/citasimagenologia/findbyidprogramacion/${idprogramacion}`)
        setListaProgramaciones(data)
    }

    useEffect(() => {
        if (idprogramacionw) {
            console.log(idprogramacionw?.value)
            getProgramacionByIdProgramacion(idprogramacionw?.value)
        }
    }, [idprogramacionw])
    const rowsFiltradas = ListaProgramaciones.filter((row) =>
        Object.values(row).some((value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(filtro.toLowerCase())
        )
    );
    const eliminarElemento=(id:any)=>{
        console.log(id)
    }
    const columnas = [
        { field: "id", headerName: "id" },
        { field: "procedencia", headerName: "procedencia" },
        { field: "recetaFactCatServ", headerName: "recetaFactCatServ", width: 250 },
        { field: "numReceta", headerName: "numReceta", width: 180 },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 200,
            sortable: false,
            renderCell: (params: any) => (
                <Box sx={{ display: "flex", marginTop: "0.5em", gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => eliminarElemento(2)} // Aquí pasas el ID o índice del elemento a eliminar
                    >
                        Eliminar
                    </Button>
                </Box>
            ),
        },
    ];
    return (
        <>


            <ModalGeneric isOpen={isModalOpen} onClose={closeModal}>

                <form
                    onSubmit={handleSubmit(FormImg)}
                    className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Admisión a Imagenología</h3>
                        <p className="text-sm text-gray-500">Datos del paciente y origen de atención</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md text-sm text-gray-700">
                        <div>
                            <span className="font-medium text-gray-800">Nombre:</span> {datosPx?.NombreCompleto}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Documento:</span> {datosPx?.NroDocumento}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Servicio:</span> {datosPx?.Descripcion?.trim()}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Examen:</span> {datosPx?.NombreExamen}
                        </div>

                        <div>
                            <span className="font-medium text-gray-800">Procedencia:</span> {datosPx?.nomServicio}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Edad:</span> {datosPx?.edad}
                        </div>
                        <div>
                            <span className="font-medium text-gray-800">Fecha Atención:</span>
                            <div className="mt-1">
                                <Controller
                                    name="idprogramacion"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: 'Este campo es obligatorio' }}
                                    render={({ field }) => (
                                        <Select
                                            instanceId="unique-select-id2"
                                            {...field}
                                            className='w-full'
                                            options={dataProgramaciones}
                                            placeholder="Seleccione..."
                                            required={true}
                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                            value={field.value}
                                            styles={{
        menu: (provided) => ({
          ...provided,
          zIndex: 9999
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999
        })
      }}
      menuPortalTarget={document.body} 
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <span className="font-medium text-gray-800">Celular:</span>
                            <div className="mt-1">
                                <input type="text"  {...register('Telefono')} className='px-3 py-2 border border-gray-300  w-full rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500;' placeholder='Celular' />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="font-semibold">Selecciona tus examenes:</label>
                            <Controller
                                control={control}
                                name="imgordenes"
                                render={({ field }) => {
                                    const { value = [], onChange } = field;
                                    const handleCheckboxChange = (checkedValue: any) => {
                                        const newValue = value.includes(checkedValue)
                                            ? value.filter((val: any) => val !== checkedValue)
                                            : [...value, checkedValue];
                                        onChange(newValue);
                                    };
                                    return (
                                        <div className="space-y-1">
                                            {dataExamenes.filter((data: any) => data.recetaFactCatServ == null).map((item: any) => {
                                                const itemValue = `${item.idReceta}-${item.IdProducto}`; // aquí se construye el valor deseado
                                                return (
                                                    <label key={item.IdProducto} className="block">
                                                        <input
                                                            type="checkbox"
                                                            checked={value.includes(itemValue)}
                                                            onChange={() => handleCheckboxChange(itemValue)}
                                                        />
                                                        <span className="ml-2">{item.Nombre}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    );
                                }}
                            />
                        </div>
                        <div>
                            <button className="py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">Guardar</button>
                        </div>

                    </div>
                </form>
                {ListaProgramaciones.length > 0 ? (
  <Box sx={{ width: "100%", backgroundColor: "white", p: 2 }}>
    <TextField
      label="Buscar..."
      variant="outlined"
      size="small"
      fullWidth
      value={filtro}
      onChange={(e) => setFiltro(e.target.value)}
      sx={{ mb: 2 }}
    />
    <DataGrid
      rows={rowsFiltradas}
      columns={columnas}
      autoHeight // Ajusta la altura al contenido
      sx={{
        backgroundColor: "white", // Fondo blanco
        border: "1px solid #e0e0e0", // Borde suave opcional
      }}
    />
  </Box>
) : (
  <p>No posee registros.</p> // Mensaje cuando no hay elementos en la lista
)}
            </ModalGeneric>


        </>

    )
}
