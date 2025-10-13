"use client";
import * as React from "react";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridColDef,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

const TablaAltasMedicasMUI = ({ data,buscadorByIdCuentaAtencion }: any) => {
    const [rows, setRows] = React.useState<any[]>([]);
  const [showQuickFilter, setShowQuickFilter] = React.useState(true);

  React.useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  // 🧱 Columnas
  const columns: GridColDef[] = [
    { field: "TipoServicio", headerName: "Tipo Servicio", flex: 1, minWidth: 150 },
    { field: "DestinoAtencion", headerName: "Destino", flex: 1, minWidth: 150 },
    { field: "ApellidoPaterno", headerName: "Apellido Paterno", flex: 1, minWidth: 150 },
    { field: "ApellidoMaterno", headerName: "Apellido Materno", flex: 1, minWidth: 150 },
    {
      field: "IdCuentaAtencion",
      headerName: "IdCuentaAtención",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "FechaIngreso",
      headerName: "Fecha Ingreso",
      flex: 1,
      minWidth: 140,
valueGetter: (params: any) => {
  const fecha = params?.row?.FechaIngreso;
  if (!fecha) return "";
  return new Date(fecha).toISOString().slice(0, 10);
},
    },
    {
      field: "acciones",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <button
          onClick={() => buscadorByIdCuentaAtencion(`${params.row.IdCuentaAtencion}`)}
          className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 
             text-white font-semibold px-2  rounded-xl shadow-md hover:shadow-lg 
             transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
        >
          ContraReferir
        </button>
      ),
    },
  ];
  return (
     <Box sx={{ height: 700, width: 1 }}>
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => row.IdCuentaAtencion || Math.random()} // evita error si no hay ID único
        slots={{
          toolbar: () => (
            <Box sx={{ p: 1 }}>
              <GridToolbarQuickFilter
                debounceMs={400}
                placeholder="Buscar..."
                sx={{
                  input: { fontSize: "0.9rem" },
                  "& .MuiInputBase-root": { borderRadius: 2 },
                }}
              />
            </Box>
          ),
        }}
    
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: "FechaIngreso", sort: "desc" }] },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        pagination
        disableRowSelectionOnClick
        sx={{
          fontSize: 14,
          borderRadius: 2,
          backgroundColor: "white",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8fafc",
            fontWeight: "bold",
            color: "#1e293b",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f1f5f9",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#f8fafc",
          },
          "& .MuiTablePagination-root": {
            fontSize: 13,
          },
        }}
      />
    </Box>
  )
}

export default TablaAltasMedicasMUI
