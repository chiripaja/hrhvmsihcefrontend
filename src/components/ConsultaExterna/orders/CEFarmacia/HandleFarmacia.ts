import axios from "axios";
import Swal from "sweetalert2";

export const handleFarmacia = async (
  cuentaDatos: any,
  updateMedicamentos: (idReceta: number) => Promise<any[]>,
  getData: (url: string) => Promise<any[]>,
  setRecetaCabezera: (data: any) => void,
  toggleOffcanvasFarmacia: () => void = () => {} 
) => {
  const RecetaCabezeraFarmacia = cuentaDatos?.recetaCabezera?.filter(
    (data: any) => data.IdPuntoCarga === 5
  );

  if (RecetaCabezeraFarmacia[0]?.idReceta !== null && RecetaCabezeraFarmacia[0]?.idReceta !== undefined) {
    const idReceta = RecetaCabezeraFarmacia[0].idReceta;
    try {
      await axios.delete(`${process.env.apijimmynew}/recetas/deleterecetadetallebyid/${idReceta}`);
      const updatedMedicamentos = await updateMedicamentos(idReceta);
      const promises = updatedMedicamentos.map((medicamento: any) =>
        axios.post(`${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`, medicamento)
      );
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        console.log("Medicamento enviado exitosamente:", response.data);
      });
    } catch (error) {
      console.error("Error procesando la receta:", error);
    }
    Swal.fire({
      icon: "success",
      title: "Orden de farmacia creada exitosamente",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    const datosCabecera = {
      idPuntoCarga: 5,
      fechaReceta: new Date().toISOString(),
      idCuentaAtencion: cuentaDatos?.idcuentaatencion,
      idServicioReceta: cuentaDatos?.idServicio,
      idEstado: 1,
      idComprobantePago: null,
      idMedicoReceta: cuentaDatos?.idMedicoIngreso,
      fechaVigencia: (() => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  fecha.setHours(0, 0, 0, 0);
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia} 00:00:00.000-05:00`; // <-- importante
})(),
      idUsuarioAuditoria: 1,
    };

    try {
      await axios.post(`${process.env.apijimmynew}/recetas/recetacabezeraadd`, datosCabecera);
      const DatosRecetaCabecera = await getData(
        `${process.env.apijimmynew}/recetas/findRecetaCabezeraByIdCuentaAtencion/${cuentaDatos?.idcuentaatencion}`
      );

      const RecetaCabezeraFarmacia = DatosRecetaCabecera?.filter(
        (data: any) => data.IdPuntoCarga === 5
      );

      if (RecetaCabezeraFarmacia.length === 0) {
        throw new Error("No se encontraron recetas con IdPuntoCarga === 5.");
      }

      const updatedMedicamentos = await updateMedicamentos(RecetaCabezeraFarmacia[0].idReceta);
      const promises = updatedMedicamentos.map((medicamento: any) =>
        axios.post(`${process.env.apijimmynew}/recetas/RecetaDetalleAgregar`, medicamento)
      );
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        console.log("Medicamento enviado exitosamente:", response.data);
      });

      setRecetaCabezera(DatosRecetaCabecera);

      Swal.fire({
        icon: "success",
        title: "Orden de farmacia creada exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
    }
  }

  toggleOffcanvasFarmacia();
};
