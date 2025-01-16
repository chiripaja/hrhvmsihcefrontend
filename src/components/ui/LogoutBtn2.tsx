"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { CiLogout } from "react-icons/ci"

export const LogoutBtn2 = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    // Ejecutar el signOut y luego redirigir
    await signOut({ redirect: false }); // Desactivar redirección automática de next-auth
    router.push('/login'); // Redirigir manualmente a la página de inicio de sesión
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-3 flex items-center space-x-4 rounded-md text-white group hover:text-gray-300"
    >
      <CiLogout />
      <span className="">Logout</span>
    </button>
  );
}
