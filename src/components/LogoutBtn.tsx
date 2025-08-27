"use client";

import useUserStore from "@/store/ui/useUserStore";
import { CiLogout } from "react-icons/ci";
import { logoutAction } from "./logout";
import { useMyStore } from "@/store/ui/useProgramacionStore";

// 👉 función que centraliza el logout
const handleLogout = async (setIdProgramacionzus: (id: string) => void) => {
  // 1. limpiar stores
  setIdProgramacionzus("");

  console.log("✅ Stores limpiados");

  // 2. ejecutar server action (signOut + redirect)
  await logoutAction();
};

export const LogoutBtn = () => {
  const { setIdProgramacionzus } = useMyStore();

  return (
    <form
      action={async () => {
        await handleLogout(setIdProgramacionzus);
      }}
    >
      <button className="px-4 py-3 flex items-center space-x-4 rounded-md group w-full">
        <CiLogout />
        <span>Logout</span>
      </button>
    </form>
  );
};
