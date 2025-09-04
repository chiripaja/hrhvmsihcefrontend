import axios from "axios";

export async function GET(request, { params }) {
  const { codigo } = params; // 👈 este es el "00754" dinámico
    console.log(codigo)
  try {
    const response = await axios.get(
      `${process.env.apiServiciosRefcon}/mcs-servicios-refcon/servicio/v1.0.0/listadoUps/${codigo}`,
      {
        headers: {
          username: `USR_00000754`, // 👈 también lo hago dinámico
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
