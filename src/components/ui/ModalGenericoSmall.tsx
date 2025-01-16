import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { GrSearch } from "react-icons/gr";

export const ModalGenericoSmall = ({ NombBoton, data, idproducto }: any) => {
    const [open, setOpen] = useState(false);
    const [datos, setDatos] = useState<any[]>([]);

    // Filtrar los laboratorios y resultados que contengan items
    const result2 = useMemo(() => {
        return data?.labMovimientoLaboratorios?.filter(
            (entry: any) => entry?.labResultadoPorItemsList.length > 0
        ) || [];
    }, [data]);

    // Filtrar los resultados del producto
    const result3 = useMemo(() => {
        return result2?.[0]?.labResultadoPorItemsList?.filter(
            (entry: any) => entry?.idProductoCpt == idproducto
        ) || [];
    }, [result2, idproducto]);

    // Solo actualizar el estado cuando `result3` cambie
    useEffect(() => {

        setDatos(result3);
    }, [result3]); // Dependencia de `result3`

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            {
                datos.length > 0 ? <span className="text-blue-400 hover:cursor-pointer " onClick={handleClickOpen}>
                    {NombBoton} 
                </span>
                    : <>{NombBoton}</>
            }

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {datos[0]?.factCatalogoServicios?.nombre}
                </DialogTitle>
                <DialogContent>
                    {/* Usamos un div normal en lugar de DialogContentText para evitar el problema */}
                    <div id="alert-dialog-description">
                        <div className="overflow-x-auto border border-gray-300 rounded-lg">
                            <div className="flex border-b border-gray-300 font-bold">
                                <div className="w-1/3 p-3 text-center">Nombre</div>
                                <div className="w-1/3 p-3 text-center">Resultado</div>
                                <div className="w-1/3 p-3 text-center">Valor Referencial</div>
                            </div>
                            {datos && datos.map((item: any, index: number) => (
                                <div key={index} className="flex border-b border-gray-200">
                                    <div className="w-1/3 p-3 text-center">{item?.labItemsCpt?.labItems?.item}</div>
                                    <div className="w-1/3 p-3 text-center">{item?.valorResultado}</div>
                                    <div className="w-1/3 p-3 text-center">{item?.labItemsCpt?.valorReferencial}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleClose} autoFocus>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>


    );
};
