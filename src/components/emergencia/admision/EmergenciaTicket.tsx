'use client'
import { getData } from '@/components/helper/axiosHelper';
import React, { useEffect, useState } from 'react'

export const EmergenciaTicket = ({ numCuenta }: any) => {
    const [datosTicketEmergencia, setDatosTicketEmergencia] = useState<any>();
    const getDataPX=async(idnumcuenta:any)=>{
        const response=await getData(`${process.env.apijimmynew}/emergencia/EmergenciaTicketByIdCuentaAtencion/${idnumcuenta}`);
        console.log(response)
        setDatosTicketEmergencia(response);
       
    }
    useEffect(() => {
        if(numCuenta){
            getDataPX(numCuenta)
        }
        
    }, [numCuenta])
    useEffect(() => {
        if(datosTicketEmergencia?.IdCuentaAtencion){
            print();
           setDatosTicketEmergencia(null);
          
        }
        
    }, [datosTicketEmergencia])
    
    return (
        <div className='container hidden print:block  text-sm'>
            <div className='flex flex-col'>
            <div className="row text-center  text-xs">
                    <div className="col-sm-12 font-bold">
                        HOSPITAL REGIONAL HERMILIO VALDIZAN
                    </div>
                    <div className="col-sm-12 text-xs">
                        RUC : 20146038329
                    </div>
                    <div className="col-sm-12" style={{ fontSize: '8px' }}>
                        JIRON HERMILIO VALDIZAN NUMERO 950 DISTRITO HUANUCO
                    </div>
                    <div className="col-sm-12 font-bold text-xs">
                        TICKET DE EMERGENCIA
                    </div>
                </div>
                <div>
                    <span className='font-bold'> Num Cuenta :</span> <br /> {datosTicketEmergencia?.IdCuentaAtencion}
                </div>
                <div>
                    <span className='font-bold'> Servicio :</span><br />  {datosTicketEmergencia?.Nombre}
                </div>
                <div>
                    <span className='font-bold'> Medico :</span> <br />  {datosTicketEmergencia?.NomMedico} 
                </div>
             
                <div>
                    <span className='font-bold'> Paciente :</span><br /> {datosTicketEmergencia?.NomPaciente}</div>
                
                <div>
                    <span className='font-bold'> Celular :</span><br /> {datosTicketEmergencia?.Telefono}
                </div>
                <div className="col-sm-12">
                <span className='font-bold'> Terminal:</span>  Admision Emergencia
                    </div>
                  
                    <div className="col-sm-12 text-xs">
                        <p className='font-bold'>Fecha y Hora de Impresión: <br />{new Date().toLocaleString('es-ES')}</p>
                    </div>
            </div>
        </div>
    )
}
