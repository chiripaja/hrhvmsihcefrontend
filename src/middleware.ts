import NextAuth from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import { UserRole } from "./type/types";
import { auth } from "./auth"

const publicRoutes: string[] = [
    "/login",
    "/allow",
    "/reportes"
]

const publicRoutesRegex: RegExp[] = [
  /^\/allow(\/.*)?$/,  // Permite todas las subrutas bajo "/allow"
  /^\/reportes(\/.*)?$/  // Permite todas las subrutas bajo "/allow"
];
const roleRoutes: Record<string, string[]> = {
  //"/sihce/inicio": [""],
 // "/sihce/admision": ["webadmin"],
  //"/sihce/triaje": ["webadmin","CE Triaje"],
};

export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRoles: UserRole[] = req.auth?.user?.roles || [];

  // Verificar rutas públicas
  if (
      publicRoutes.includes(nextUrl.pathname) ||
      publicRoutesRegex.some((regex) => regex.test(nextUrl.pathname))
  ) {
      return NextResponse.next();
  }

  // Verificar si el usuario está autenticado
  if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Verificar permisos basados en roles
  const requiredRoles = roleRoutes[nextUrl.pathname];

  if (
      requiredRoles &&
      !requiredRoles.some((role: any) =>
          userRoles.some((userRole) => userRole.nombre === role)
      )
  ) {
      // Redirigir a una página de acceso denegado o a la página de inicio
      return NextResponse.redirect(new URL("/sihce/inicio", nextUrl));
  }

  return NextResponse.next();
});


export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};