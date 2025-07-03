'use client'
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import axios from "axios";
import { ToasterMsj } from "@/components/utils/ToasterMsj";

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

export const CEFarmaciaTablaMUI = ({ cuentaDatos }: Props) => {
    if (!cuentaDatos?.medicamentos) return null; // o un loading
    const [rows, setRows] = useState<Medicamento[]>(cuentaDatos?.medicamentos || []);
    useEffect(() => {
        if (cuentaDatos?.medicamentos) {
            setRows(cuentaDatos?.medicamentos)
        }
    }, [cuentaDatos])
    const onMedicamentoActualizado =async (nuevo: any, anterior: Medicamento) => {
        const obj={
            idReceta: nuevo?.idrecetacabecera,
            idItem: nuevo?.idproducto,
            cantidadPedida: nuevo?.cantidad,
            observaciones: nuevo?.observaciones
}
        const dataActualizacion=await axios.put(`${process.env.apijimmynew}/recetas/apiUpdateRecetadaDetalleCantidadObservaciones`,obj)
        console.log(dataActualizacion)
           ToasterMsj('Exito', 'success', 'Se actualizo correctamente.');
    };

    const handleProcessRowUpdate = async (
        newRow: Medicamento,
        oldRow: Medicamento
    ): Promise<Medicamento> => {
        onMedicamentoActualizado(newRow, oldRow);

        const updatedRow = { ...newRow };
        setRows((prev) =>
            prev.map((row) =>
                row.idproducto === updatedRow.idproducto ? updatedRow : row
            )
        );
        return updatedRow;
    };

    const columns: GridColDef<Medicamento>[] = [
        {
            field: "nombre",
            headerName: "Medicamento",
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
            editable: true,
            width: 100,
        },
        {
            field: "observaciones",
            headerName: "Indicaciones",
            flex: 1,
            editable: true,
        },
    ];

    return (
        <>
        {cuentaDatos?.medicamentos.length>0 &&
        
        <Box sx={{ width: '100%', height: 400 }}>
  <DataGrid
  
    rows={rows}
    columns={columns}
    getRowId={(row) => row.idproducto}
    processRowUpdate={handleProcessRowUpdate}
    disableRowSelectionOnClick
    pageSizeOptions={[5]}
    sx={{
      "& .MuiDataGrid-cell": { fontSize: "0.875rem" },
      "& .MuiDataGrid-columnHeaders": { fontWeight: "bold" },
    }}
  />
</Box>
        }
       

        </>

    );
};
