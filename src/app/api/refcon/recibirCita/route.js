import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const dataenvio = await req.json(); // tu objeto dataenvio
        console.log("Datos recibidos desde el frontend en recibirCita:", dataenvio);
         const response = await fetch(
       `${process.env.apiServiciosRefcon}/mcs-servicios-refcon/servicio/v1.0.0/recibirCita`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ipclient: "38.250.134.82", 
          password: "demo@2025@",    
          username: "USR_00000754",  
        },
        
        body: JSON.stringify(dataenvio),
      }

    );
      const result = await response.json();
        return NextResponse.json(
            result,
        );
    } catch (error) {
        console.error("Error en recibirCita:", error);
        return NextResponse.json(
            { ok: false, error: error || "Error interno en el servidor" },
            { status: 500 }
        );
    }
}