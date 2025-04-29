
'use client'
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
export default function NamePage() {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  useEffect(() => {
    // Crear conexión WebSocket
    ws.current = new WebSocket(`${process.env.apiws}/ws/chat`);

    ws.current.onopen = () => {
      console.log('✅ Conectado al WebSocket');
    };

    ws.current.onmessage = (event: MessageEvent) => {
      console.log('📩 Mensaje recibido:', event.data);
      setMessages(prev => [...prev, event.data]);
    };

    ws.current.onerror = (event: Event) => {
      console.error('❌ Error en WebSocket:', event);
    };

    ws.current.onclose = (event: CloseEvent) => {
      console.log('🔌 Conexión cerrada:', event.reason);
    };

    // Limpiar la conexión al desmontar
    return () => {
      ws.current?.close();
    };
  }, []);

  const enviarMensaje = async() => {
    const dataobj={
      idcuenta :154874
    }
    const {data}=await axios.post(`${process.env.apiurl}/api/websocket/send/154874`,dataobj);
    console.log(data)
  };
  return (
    <div className="p-4">
    <h2 className="text-xl font-bold mb-2">Mensajes del WebSocket:</h2>
    <ul className="border p-2 mb-4 max-h-60 overflow-y-auto">
      {messages.map((msg, idx) => (
        <li key={idx} className="text-sm mb-1">
          {msg}
        </li>
      ))}
    </ul>
    <div className="flex gap-2">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        className="border px-2 py-1 flex-1"
        placeholder="Escribe tu mensaje"
      />
      <button
        onClick={enviarMensaje}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Enviar
      </button>
    </div>
  </div>
  );
}