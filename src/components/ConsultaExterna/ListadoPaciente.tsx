'use client'

import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid';

import { esES } from '@mui/x-data-grid/locales';
import { Box, Button, createTheme, ThemeProvider } from '@mui/material';
import { FaRegEdit } from 'react-icons/fa';
import { PiPrinter } from "react-icons/pi";
const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    esES,
);

export const ListadoPaciente = () => {
    const handleEditClick = (row: any) => {
        console.log('Editar fila:', row);
        // Implement your edit logic here
    };

    const handleDeleteClick = (row: any) => {
        console.log('Eliminar fila:', row);
        // Implement your delete logic here
    };



    const columns: GridColDef[] = [
        { field: 'cuenta', headerName: 'N° de Cuenta', flex: 1 },
        { field: 'px', headerName: 'Paciente', flex: 1 },
        { field: 'servicio', headerName: 'Servicio', flex: 1 },
        { field: 'especialista', headerName: 'Nombre de Especialista', flex: 1 },
        { field: 'fecha', headerName: 'Fecha de Cita', flex: 1 },
        { field: 'financiamiento', headerName: 'Financiamiento', flex: 1 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 440,
            renderCell: (params) => (
                <div className='flex flex-wrap gap-4'>


                    <button type="button" onClick={() => handleEditClick(params.row)} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        <FaRegEdit />
                        Atender
                    </button>
                    <button type="button" onClick={() => handleEditClick(params.row)} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-300 text-gray-800 hover:bg-yellow-500 focus:outline-none focus:bg-yellow-700 disabled:opacity-50 disabled:pointer-events-none">
                        <PiPrinter />
                        Historia
                    </button>

                </div>
            ),
        },
    ];
  return (
    <div>
    <div className="w-full bg-white rounded-lg shadow-md dark:bg-neutral-800">
        <div className="border-b border-gray-200 px-4 dark:border-neutral-700">
            <nav className="flex gap-x-2" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 dark:focus:text-blue-500 active" id="basic-tabs-item-1" aria-selected="true" data-hs-tab="#basic-tabs-1" aria-controls="basic-tabs-1" role="tab">
                    Citas Pendientes
                </button>
                <button type="button" className="hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2 border-transparent text-sm whitespace-nowrap text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-blue-500 dark:focus:text-blue-500" id="basic-tabs-item-2" aria-selected="false" data-hs-tab="#basic-tabs-2" aria-controls="basic-tabs-2" role="tab">
                    Citas Atendidas
                </button>

            </nav>
        </div>

        <div className="mt-3 p-4">
            <div id="basic-tabs-1" role="tabpanel" aria-labelledby="basic-tabs-item-1">
                <div style={{ width: '100%' }}>
                    <ThemeProvider theme={theme}>
                        <Box sx={{ height: 400, width: 1 }}>
                            <DataGrid
                                columns={columns}
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                    },
                                }}
                            />
                        </Box>
                    </ThemeProvider>

                </div>

            </div>
            <div id="basic-tabs-2" className="hidden" role="tabpanel" aria-labelledby="basic-tabs-item-2">
                <p className="text-gray-500 dark:text-neutral-400">
                    This is the <em className="font-semibold text-gray-800 dark:text-neutral-200">second</em> items tab body.
                </p>
            </div>

        </div>
    </div>

</div>
  )
}
