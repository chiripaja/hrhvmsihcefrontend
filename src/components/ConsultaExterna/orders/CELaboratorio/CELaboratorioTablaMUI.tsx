'use client'

import { useEffect, useState, useRef } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import { ToasterMsj } from "@/components/utils/ToasterMsj";
import { useCEDatosStore } from "@/store";
interface Medicamento {
    idproducto: number;
    nombre: string;
    Codigo: string;
    cantidad: number;
    observaciones?: string;
}

interface Props {
    cuentaDatos: {
        medicamentos: Medicamento[];
    };
}

export const CELaboratorioTablaMUI = ({ cuentaDatos }: any) => {
    const deleteMedicamento = useCEDatosStore((state: any) => state.deleteMedicamento);
    const [rows, setRows] = useState<Medicamento[]>([]);
    const [isReady, setIsReady] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [estadoDespacho, setestadoDespacho] = useState<boolean>(true);
    const deleteLaboratorio = useCEDatosStore((state: any) => state.deleteLaboratorio);
    useEffect(() => {
        if (!cuentaDatos?.ordenesLaboratorio) return;
        setRows(cuentaDatos.ordenesLaboratorio);
    }, [cuentaDatos]);

    useEffect(() => {
        if (cuentaDatos?.recetaCabezera) {
            const data = cuentaDatos?.recetaCabezera?.filter((data: any) => data?.IdPuntoCarga == '5')


            if (data[0]?.idEstado == '2') setestadoDespacho(false)

        }

    }, [cuentaDatos])


    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (containerRef.current && containerRef.current.offsetWidth > 0) {
                setIsReady(true);
            }
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const onMedicamentoActualizado = async (nuevo: any, anterior: Medicamento) => {
        const obj = {
            idReceta: nuevo?.idrecetacabecera,
            idItem: nuevo?.idproducto,
            cantidadPedida: nuevo?.cantidad,
            observaciones: nuevo?.observaciones
        };
        await axios.put(`${process.env.apijimmynew}/recetas/apiUpdateRecetadaDetalleCantidadObservaciones`, obj);
        ToasterMsj('Éxito', 'success', 'Se actualizó correctamente.');
    };
    const handleProcessRowUpdate = async (
        newRow: any,
        oldRow: Medicamento
    ): Promise<Medicamento> => {
        const receta = cuentaDatos?.recetaCabezera?.find(
            (data: any) => data.idReceta === newRow.idrecetacabecera
        );

        if (receta?.idEstado != '1') {
            // Mostrar alerta con SweetAlert2
            Swal.fire({
                icon: 'warning',
                title: 'No editable',
                text: 'No se puede editar la cantidad porque la receta ya está cerrada.',
            });

            // Revertir el cambio
            return oldRow;
        }

        // Si es editable, continúa con la actualización
        onMedicamentoActualizado(newRow, oldRow);

        const updatedRow = { ...newRow };

        setRows((prev) =>
            prev.map((row) =>
                row.idproducto === updatedRow.idproducto ? updatedRow : row
            )
        );

        return updatedRow;
    };

    // ✅ Función para eliminar con SweetAlert
    const handleEliminarMedicamento = async (medicamento: any) => {
        const result = await Swal.fire({
            title: '¿Eliminar medicamento?',
            text: `(${medicamento.Codigo}) - ${medicamento.nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                
               const data = await axios.delete(`${process.env.apijimmynew}/recetas/apiDeleteRecetaDetalleByIdRecetaAndIdItem/${medicamento?.idrecetacabecera}/${medicamento?.idproducto}`)
               deleteLaboratorio(medicamento?.idproducto, medicamento?.puntoCarga)
               

                ToasterMsj("Eliminado", "success", "Medicamento eliminado correctamente.");
            } catch (error) {
                console.error(error);
                ToasterMsj("Error", "error", "Hubo un problema al eliminar.");
            }
        }
    };

    const columns: GridColDef<any>[] = [
        {
            field: "nombre",
            headerName: "Procedimientos",
            flex: 1,
            renderCell: (params) => (
                <span>
                    ({params.row.Codigo}) - {params.row.nombre}
                </span>
            ),
        },
        {
            field: "cantidad",
            headerName: "Cantidad",
            type: "number",

            width: 100,
            editable: true,
        },
        {
            field: "observaciones",
            headerName: "Indicaciones",
            flex: 1,
            editable: estadoDespacho,
        },
        {
            field: "acciones",
            headerName: "Acciones",
            width: 90,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const receta = cuentaDatos?.recetaCabezera?.find(
                    (data: any) => data.idReceta == params.row?.idrecetacabecera
                );

                const mostrarBotonEliminar = receta?.idEstado != '2';

                return (
                    <>

                        {mostrarBotonEliminar && (
                            <Tooltip title="Eliminar">
                                <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => handleEliminarMedicamento(params.row)}
                                >
                                    <MdDelete />
                                </IconButton>
                            </Tooltip>
                        )}
                    </>
                );
            },
        },
    ];

    return (
        <div ref={containerRef} className="w-full">
           
            {isReady && cuentaDatos?.ordenesLaboratorio.length > 0 && (
                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.idproducto}
                        processRowUpdate={handleProcessRowUpdate}
                        disableRowSelectionOnClick
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        pagination
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5, page: 0 }, // muestra 5 por página al inicio
                            },
                        }}
                        sx={{
                            height: 300,
                            "& .MuiDataGrid-cell": { fontSize: "0.875rem" },
                            "& .MuiDataGrid-columnHeaders": { fontWeight: "bold" },
                        }}
                    />
                </Box>
            )}
        </div>
    )
}
