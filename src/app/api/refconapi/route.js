import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.apiServiciosRefcon}/mcs-servicios-refcon/servicio/v1.0.0/listadoUps/00754`,
      {
        headers: {
          username: "USR_00000754",
          password: "demo@2025@",
          ipclient: "38.250.134.82",
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al consumir API MINSA:", error.message);
    return new Response(
      JSON.stringify({ error: "No se pudo obtener listadoUps" }),
      { status: 500 }
    );
  }
}
