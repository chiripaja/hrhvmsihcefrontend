import React from "react";
import { useController, Control } from "react-hook-form";

type Option = Record<string, any>;

type SelectGenericoProps = {
  opciones: Option[];
  control: Control<any>;
  name: string;
  label?: string;
  rules?: any;
  idKey: string;  // Clave para el ID único
  labelKey: string;  // Clave para el texto visible
};

const SelectGenerico: React.FC<SelectGenericoProps> = ({
  opciones,
  control,
  name,
  label,
  rules,
  idKey,
  labelKey,
}) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold">{label}</label>}
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className={`border rounded p-2 w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">Seleccione una opción</option>
        {opciones.map((opcion) => (
          <option key={opcion[idKey]} value={opcion[idKey]}>
            {opcion[idKey]}-
            {opcion[labelKey]}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
};

export default SelectGenerico;
