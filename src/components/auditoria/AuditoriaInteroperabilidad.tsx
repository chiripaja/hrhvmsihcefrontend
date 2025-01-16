'use client'

import { ThemeProvider } from "@emotion/react"
import { Box, createTheme } from "@mui/material"
import { esES } from '@mui/x-data-grid/locales';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import { Loading } from "../utils/Loading";
const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
    },
    esES,
);
export const AuditoriaInteroperabilidad = () => {
    const [dataAuditoria, setDataAuditoria] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        getListado();

    }, [])

    const getListado = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${process.env.apiauditoriosis}/peticiones`);

            setDataAuditoria(data);

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }


    }

    const rows: GridRowsProp = dataAuditoria;

    const columns: GridColDef[] = [
        { field: 'endPoint', headerName: 'endPoint', flex: 1 },
        { field: 'fechaConsulta', headerName: 'fechaConsulta', flex: 1 },
        { field: 'id', headerName: 'id', flex: 1 },
        { field: 'ip', headerName: 'ip', flex: 1 },
        { field: 'usuario', headerName: 'usuario', flex: 1 },
        { field: 'numeroDocumento', headerName: 'numeroDocumento', flex: 1 },
        { field: 'estado', headerName: 'estado', flex: 1 },

    ];

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="h-full bg-slate-400 md:bg-white p-3">


            <div className="block print:hidden">
                <h1 className="print-hidden">Listado de Auditoria</h1>

                <div className="print-hidden">

                </div>
            </div>

            <div className='print:block'>
                <div className="mt-3 p-4">
                    <div id="basic-tabs-1" role="tabpanel" aria-labelledby="basic-tabs-item-1">
                        <div style={{ width: '100%' }}>
                            <ThemeProvider theme={theme}>
                                <Box sx={{ height: 700, width: 1 }}>
                                    <DataGrid
                                        rows={rows}
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
