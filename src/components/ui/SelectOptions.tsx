import React, { forwardRef } from 'react'
interface Opcion {
    id: number;
    descripcion: string;
}
interface SelectOptionProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    opciones?: Opcion[];
    deshabilitado?: boolean;
}

export const SelectOptions = forwardRef<HTMLSelectElement, SelectOptionProps>(
    ({ deshabilitado = true, label = "", opciones = [], defaultValue = "", ...props }, ref) => {
        return (
            <select
            ref={ref}
            {...props}
            // Asigna el ref al select
            disabled={deshabilitado}
            className={`inputSelect ${deshabilitado ? 'bg-gray-200' : ''}`}
        >
                {opciones.map(opcion => (                            
                    <option key={opcion.id} value={opcion.id}  >
                        {opcion.descripcion}
                    </option>
                ))}
            </select>
        )
    })
    SelectOptions.displayName = 'SelectOptions';