import React from 'react'

export default function PruebaPage() {
    
  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <video
        src="/img/vid.mp4"
        controls
        autoPlay
        loop
        className="rounded-2xl shadow-lg w-full max-w-2xl"
      >
        Tu navegador no soporta el video.
      </video>
    </div>
  )
}
