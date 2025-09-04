// app/api/consultaReferencia/route.js
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();

    const { establecimientoDestino, limite, numerodocumento, pagina, tipodocumento } = body;

    // El servicio espera que todo vaya dentro de "request"
const requestData = {
    establecimientoDestino,
    limite,
    numerodocumento,
    pagina,
    tipodocumento,
};

const dataprobar={
    establecimientoDestino: "754",
      limite: "10",
      numerodocumento: "42713040",
      pagina: "1",
      tipodocumento: "1",
}
    const response = await axios.post(
      `${process.env.apiServiciosRefcon}/mcs-servicios-refcon/servicio/v1.0.0/consultaReferencia`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          ipclient: "38.250.134.82",
          password: "demo@2025@",
          username: "USR_00000754",
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en consultaReferencia:", error.response?.data || error.message);

    return new Response(
      JSON.stringify({ error: error.message, details: error.response?.data }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
