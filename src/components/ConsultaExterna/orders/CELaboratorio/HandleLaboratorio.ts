import { useCEDatosStore } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";

// Función principal donde recibimos todos los datos que nos pides
export const handleCanastaPorPuntoDeCarga = async (
    cuentaDatos: any, 
    updateOrdenesLaboratorio: (idReceta: any,puntocarga:any) => Promise<any[]>, 
    getData: (url: string) => Promise<any[]>, 
    setRecetaCabezera: (data: any) => void,
    createordenesLaboratorio: (receta: any, puntoCarga: number) => Promise<any[]>,
    toggleOffcanvasLaboratorio: () => void = () => {} // Valor por defecto vacío si no se manda
   
) => {
    const puntosDeCarga = [2, 3, 11];
    
    // Iterar sobre los puntos de carga
    for (const puntoCarga of puntosDeCarga) {
        const recetaexistente = cuentaDatos?.recetaCabezera?.find(
            (item: any) => item.IdPuntoCarga === puntoCarga
        );
        
        if (recetaexistente) {
            await actualizarReceta(
                recetaexistente.idReceta, 
                puntoCarga, 
                cuentaDatos, 
                updateOrdenesLaboratorio, 
                getData, 
                setRecetaCabezera
            );
        } else {
            const existeOrdenParaPuntoCarga = cuentaDatos?.ordenesLaboratorio?.some(
                (orden: any) => Number(orden.puntoCarga) === puntoCarga
            );
            
            if (existeOrdenParaPuntoCarga) {
                await crearReceta(
                    puntoCarga, 
                    cuentaDatos, 
                    setRecetaCabezera, 
                    updateOrdenesLaboratorio, 
                    getData,
                    createordenesLaboratorio
                );
            }
        }
    }
    
    // Alerta de éxito
    Swal.fire({
        icon: "success",
        title: "Ordenes creadas exitosamente",
        showConfirmButton: false,
        timer: 1500
    });

    // Llamamos a toggleOffcanvasFarmacia si está definido
    if (toggleOffcanvasLaboratorio) {
        toggleOffcanvasLaboratorio();
    }
};

// Función para crear receta
const crearReceta = async (
    puntoCarga: number, 
    cuentaDatos: any, 
    setRecetaCabezera: (data: any) => void, 
    updateOrdenesLaboratorio: (idReceta: number,puntocarga:any) => Promise<any[]>, 
    getData: (url: string) => Promise<any[]>,
    createordenesLaboratorio: (receta: any, puntoCarga: number) => Promise<any[]>,
) => {
    
    const datosCabecera = {
        idPuntoCarga: puntoCarga,
        fechaReceta: new Date().toISOString(),
        idCuentaAtencion: cuentaDatos?.idcuentaatencion,
        idServicioReceta: cuentaDatos?.idServicio,
        idEstado: 1,
        idComprobantePago: null,
        idMedicoReceta: cuentaDatos?.idMedicoIngreso,
        fechaVigencia: null,
        idUsuarioAuditoria: 1,
    };
  
    try {
        // Crear receta
        const response = await axios.post(
            `${process.env.apijimmynew}/recetas/recetacabezeraadd`,
            datosCabecera
        );
    
        // Obtener Receta Cabezera
        const DatosRecetaCabecera = await axios.get(
            `${process.env.apijimmynew}/recetas/findRecetaCabezeraByIdCuentaAtencion/${cuentaDatos?.idcuentaatencion}`
        );
       
        console.log(DatosRecetaCabecera.data)
        // Establecer Receta Cabezera
        setRecetaCabezera(DatosRecetaCabecera.data);

        // Si la respuesta contiene datos, procesamos las órdenes
        if (response?.data) {
            const ordenes = await updateOrdenesLaboratorio(response?.data, puntoCarga);
            await enviarOrdenes(ordenes);
        }
    } catch (error) {
        console.error(`Error creando receta para el punto de carga ${puntoCarga}:`, error);
    }
};

// Función para actualizar receta
const actualizarReceta = async (
    idReceta: number, 
    puntoCarga: number, 
    cuentaDatos: any, 
    updateOrdenesLaboratorio: (idReceta: number,puntocarga:any) => Promise<any[]>, 
    getData: (url: string) => Promise<any[]>, 
    setRecetaCabezera: (data: any) => void
) => {
    try {
        const data = cuentaDatos?.recetaCabezera.filter((datos: any) => datos?.idReceta === idReceta);

        if (data && data.length > 0 && data[0].idEstado === 1) {
            // Eliminar receta detalle
            await axios.delete(`${process.env.apijimmynew}/recetas/deleterecetadetallebyid/${idReceta}`);
            
            // Actualizar órdenes de laboratorio
            const ordenes = await updateOrdenesLaboratorio(idReceta,puntoCarga);
            if (ordenes) {
                await enviarOrdenes(ordenes);
            }/**/
        }
    } catch (error) {
        console.error(`Error actualizando receta para el punto de carga ${puntoCarga}:`, error);
    }
};

// Función para enviar medicamentos
const enviarOrdenes = async (medicamentos: any[]) => {
    try {
        console.log(medicamentos)
        const promises = medicamentos.map((medicamento: any) =>
            axios.post(`${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`, medicamento)
        );
        const responses = await Promise.all(promises);
        responses.forEach((response) => {
            console.log("Medicamento enviado exitosamente:", response.data);
        });
    } catch (error) {
        console.error("Error enviando medicamentos:", error);
    }
};
