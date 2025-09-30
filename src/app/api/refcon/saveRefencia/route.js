import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); // tu objeto dataenvio
    console.log("Datos recibidos desde el frontend:", body);


    const payload = {
      contrareferenciaFinal: body,
    };
 
    const response = await fetch(
       `${process.env.apiServiciosRefcon}/mcs-servicios-refcon/servicio/v1.0.0/saveReferencia`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ipclient: "38.250.134.82", 
          password: "demo@2025@",    
          username: "USR_00000754",  
        },
        body: JSON.stringify(payload?.contrareferenciaFinal),
      }
    );

    const result = await response.json();
/**/
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
