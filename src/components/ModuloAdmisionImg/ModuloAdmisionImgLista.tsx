'use client'
import React, { useEffect, useState } from 'react'

import { getData } from '../helper/axiosHelper';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField } from '@mui/material';
import { ModalGeneric } from '../ui/ModalGeneric/ModalGeneric';


export const ModuloAdmisionImgLista = ({ usuario }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [rows, setRows] = useState([]);
  const [filtro, setFiltro] = useState("");


  const GetListadosCitas = async () => {

    const { data } = await axios.post(`${process.env.apijimmynew}/recetas/ListadoOrdenesByPuntoCargaImagenes`)
    const datosFormateados = data.map((item: any, index: any) => ({
      id: index, // obligatorio para el DataGrid
      ...item,
      NombreCompleto: `${item.PrimerNombre || ""} ${item.SegundoNombre || ""} ${item.ApellidoPaterno || ""} ${item.ApellidoMaterno || ""}`.trim(),
      FechaReceta: item.FechaReceta?.split("T")[0],
      FechaIngreso: item.FechaIngreso?.split("T")[0]
    }));
    setRows(datosFormateados);
    console.log(data)
  }
  useEffect(() => {
    GetListadosCitas()
  }, [])
  // Filtro global por cualquier campo string
  const rowsFiltradas = rows.filter((row) =>
    Object.values(row).some((value) =>
      value !== null &&
      value !== undefined &&
      value.toString().toLowerCase().includes(filtro.toLowerCase())
    )
  );
  const handleVer = (fila: any) => {
    console.log("Ver:", fila);
    // Puedes abrir un modal o redirigir
  };
  const columnas = [

    { field: "IdCuentaAtencion", headerName: "IdCuentaAtencion", width: 130 },
    { field: "NroDocumento", headerName: "Documento", width: 130 },
    { field: "NombreCompleto", headerName: "Paciente", width: 250 },
    { field: "Nombre", headerName: "Estudio", width: 250 },
    { field: "Descripcion", headerName: "Servicio", width: 180 },
    { field: "FechaIngreso", headerName: "F. Ingreso", width: 120 },
    { field: "FechaReceta", headerName: "F. Receta", width: 120 },
    { field: "observaciones", headerName: "Obs.", width: 200 },
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
            onClick={() => openModal()}
          >
            Admisionar
          </Button>
        </Box>
      ),
    },
  ];
  return (
    <div>
      <ModalGeneric isOpen={isModalOpen} onClose={closeModal} >
        <label className="text-lg font-semibold text-gray-900">Historial del Paciente</label>
        <div className="text-sm text-gray-600">
          dsds
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </ModalGeneric>
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
          autoHeight // 👈 Esto ajusta la altura al contenido
          sx={{
            backgroundColor: "white", // Fondo blanco
            border: "1px solid #e0e0e0", // Borde suave opcional
          }}

        />
      </Box>

    </div>
  )
}
