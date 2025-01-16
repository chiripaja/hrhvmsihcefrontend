'use client'
import React, { useEffect, useState } from 'react';

export const ColorPicker = () => {
  const [color, setColor] = useState("#14b8a6"); // Color por defecto
  const [isMounted, setIsMounted] = useState(false);

  // Establecer el estado cuando el componente se monta en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Efecto para actualizar el color de fondo global solo después de montar
  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.setProperty('--bg-color', color);
    }
  }, [color, isMounted]);

  // Efecto para actualizar las variables RGB solo después de montar
  useEffect(() => {
    if (isMounted) {
      const rgb:any = hexToRgb(color);
      if (rgb) {
        document.documentElement.style.setProperty('--bg-color-r', rgb.r);
        document.documentElement.style.setProperty('--bg-color-g', rgb.g);
        document.documentElement.style.setProperty('--bg-color-b', rgb.b);
      }
    }
  }, [color, isMounted]);

  // Función para convertir hex a RGB
  const hexToRgb = (hex: string) => {
    const match = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex);
    if (!match) return null;

    let r = parseInt(match[1].substring(0, 2), 16);
    let g = parseInt(match[1].substring(2, 4), 16);
    let b = parseInt(match[1].substring(4, 6), 16);

    // Para soportar colores hexadecimales de 3 caracteres, como #abc
    if (match[1].length === 3) {
      r = parseInt(match[1][0] + match[1][0], 16);
      g = parseInt(match[1][1] + match[1][1], 16);
      b = parseInt(match[1][2] + match[1][2], 16);
    }

    return { r, g, b };
  };

  // Retorna el componente solo si el componente está montado
  if (!isMounted) return null;

  return (
    <div>
      <input
        type="color"
        id="color-picker"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-16 h-10"
      />
    </div>
  );
};
