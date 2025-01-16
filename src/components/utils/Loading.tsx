

export const Loading = ({messagge="Cargando..."}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
    <div className="w-6 h-6 border-4  border-t-transparent border-solid rounded-full animate-spin"></div>
    <p className="letraFondo font-semibold">{messagge}</p>
  </div>
  )
}
