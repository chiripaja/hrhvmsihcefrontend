'use client'
import { getData } from '@/components/helper/axiosHelper'
import React, { useState } from 'react'
import { ThemeProvider } from "@emotion/react"
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from "@mui/x-data-grid"
import { Box, Button, createTheme } from '@mui/material'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { esES } from '@mui/x-data-grid/locales';
import { FormAdmisionProc } from './FormAdmisionProc'

const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    esES,
);


export const ProcedimientosGenerales = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [dataCompleto, setDataCompleto] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.apijimmynew}/api/solicitud-procedimientos/by-date`, {
                params: {
                    startDate: data.startDate,
                    endDate: data.endDate
                }
            });
            setDataCompleto(response.data);
            alert('Solicitud realizada correctamente');
        } catch (error) {
            console.error(error);
            alert('Error al realizar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const rows: GridRowsProp = dataCompleto;

    const columns = [
        { field: "idSolicitudProc", headerName: "idSolicitudProc", width: 130 },
        { field: "idCuenta", headerName: "IdCuentaAtencion", width: 130 },
        { field: "fechaRegistro", headerName: "fechaRegistro", width: 130 },
        {
            field: "factCatalogoServicios",
            headerName: "Procedimiento",
            flex: 2,
            minWidth: 250,
            valueGetter: (params: any) => {
                const factCatalogoServicios = params;
                return factCatalogoServicios
                    ? `${factCatalogoServicios.nombre || ""}`.trim()
                    : "";
            },
        },
        { field: "observacion", headerName: "observacion", width: 180 },
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
                        onClick={() => openModal(params.row)}
                    >
                        Admisionar
                    </Button>
                </Box>
            ),
        },
    ];
    const openModal = (data: any) => {
        console.log(data)

        setIsModalOpen(true);/**/
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <div>
  <div className="max-w-md mx-auto p-6 border rounded-lg shadow bg-white my-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Solicitud de Procedimientos</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 justify-center">
          <input type="date" {...register('startDate', { required: true })} className="p-2 border rounded" placeholder="Fecha de Inicio" />
          <input type="date" {...register('endDate', { required: true })} className="p-2 border rounded" placeholder="Fecha de Fin" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </form>
    </div>

            <ThemeProvider theme={theme}>
                <Box sx={{ height: 700, width: 1, backgroundColor: "white", p: 2,mt:2 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        getRowId={(row) => row.idSolicitudProc}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                </Box>
            </ThemeProvider>

                        <FormAdmisionProc isModalOpen={isModalOpen} closeModal={closeModal} />

        </div>
    )
}
