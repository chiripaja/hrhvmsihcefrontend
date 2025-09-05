import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); // tu objeto dataenvio
    console.log("Datos recibidos desde el frontend:", body);

    // 👉 Armar el payload con la clave `contrareferenciaFinal`
    const payload = {
      contrareferenciaFinal: body,
    };

    // 👉 Hacer POST al servicio externo
    const response = await fetch(
       `${process.env.apiServiciosRefcon}/mcs-servicios-refcon/servicio/v1.0.0/saveContrareferencia`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ipclient: "38.250.134.82", // aquí pones el valor real
          password: "demo@2025@",    // tu password
          username: "USR_00000754",  // tu username
        },
        body: JSON.stringify(payload?.contrareferenciaFinal),
      }
    );

    const result = await response.json();

    return NextResponse.json({
      ok: true,
      message: "Petición enviada al servicio externo",
      result,
    });
  } catch (error) {
    console.error("Error en saveContrareferencia:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
