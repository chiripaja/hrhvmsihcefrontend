import React from 'react'
import { LogoutBtn } from '../LogoutBtn';
import { auth } from '@/auth';
import { BsHospital } from 'react-icons/bs';
import { ColorPicker } from '../utils/ColorPicker';
import { FaRegFileAlt, FaRegUser, FaUserCog } from 'react-icons/fa';
import { TbBuildingHospital } from 'react-icons/tb';
import Link from 'next/link';
import { GrConfigure } from "react-icons/gr";

export const TopMenu2 = async () => {
  const session = await auth()
  const admisionista = session?.user?.roles?.some(role => role.idRol === 52);
  const webadmin = session?.user?.roles?.some(role => role.idRol === 1165);
  const cetriaje = session?.user?.roles?.some(role => role.idRol === 101);
  const CEAtencion = session?.user?.roles?.some(role => role.idRol === 143);
  const CEAtencionProc = session?.user?.roles?.some(role => role.idRol === 1170);
  const menuItemsConsultaExterna = [
    { href: "/sihce/consultaexterna", label: "CE Atencion", condition: webadmin || CEAtencion },
    { href: "/sihce/admision", label: "Admision CE", condition: webadmin || admisionista },
    { href: "/sihce/admisionproc", label: "Admision Proc", condition: webadmin || CEAtencionProc },
    { href: "/sihce/procedimientos/anatomiapatologica", label: "Anatomia Patologica", condition: webadmin || CEAtencionProc },
    { href: "/sihce/admisionimg", label: "Admision Imagen", condition: webadmin || CEAtencionProc },
    { href: "/sihce/admisionimg/programacionimg", label: "Programacion Imagen", condition: webadmin },
    
    { href: "/sihce/listapx", label: "Lista Citados", condition: webadmin },
    { href: "/sihce/nuevousuario", label: "Paciente Nuevo", condition: webadmin || admisionista },
    { href: "/sihce/triaje", label: "Triaje", condition: webadmin || cetriaje },
  ];

  const menuItemsEmergencia = [
    { href: "/sihce/emergencia", label: "Admision", condition: webadmin },
    { href: "/sihce/emergencia/busqueda", label: "Listado Emergencia", condition: webadmin },
    { href: "/sihce/triaje", label: "Triaje", condition: webadmin || cetriaje },
  ];

  const menuItemsConfiguracion = [
    { href: "/sihce/roles", label: "Roles", condition: webadmin },
    { href: "/sihce/auditoria", label: "Auditoria", condition: webadmin }
  ];

  return (<>
    <header className=" print:hidden flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full colorFondo text-sm py-4 sm:py-0 dark:bg-neutral-800 ">
      <nav className="max-w-[85rem] w-full mx-auto px-4 md:px-6 lg:px-8 p-2">
        <div className="relative sm:flex sm:items-center">
          <div className="flex items-center justify-between">
            <span className=" text-xl font-semibold text-white focus:outline-none focus:opacity-80">
              <Link href="/sihce/inicio" passHref className='flex'>
                <BsHospital className="mr-2" /> HRHVM
              </Link>
            </span>
            <div className="sm:hidden">
              <button
                type="button"
                className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                id="hs-navbar-columns-collapse"
                aria-expanded="false"
                aria-controls="hs-navbar-columns"
                aria-label="Toggle navigation"
                data-hs-collapse="#hs-navbar-columns"
              >
                <svg
                  className="hs-collapse-open:hidden shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <svg
                  className="hs-collapse-open:block hidden shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div
            id="hs-navbar-columns"
            className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
            aria-labelledby="hs-navbar-columns-collapse"
          >
            <div className="flex flex-col gap-y-3  sm:gap-y-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
              {menuItemsConsultaExterna
                .filter(item => item.condition).length > 0 && (
                  <div className="hs-dropdown z-50 [--strategy:static] sm:[--strategy:absolute] [--adaptive:none] sm:[--trigger:hover] [--is-collapse:true] sm:[--is-collapse:false]">
                    <button
                      id="hs-mega-menu-1-col"
                      type="button"
                      className="sm:p-3 flex  items-center w-full text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-md shadow-md transition-all duration-300"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Mega Menu"
                    >
                      <FaRegFileAlt className="mr-2" />
                      Consulta Externa
                      <svg
                        className="hs-dropdown-open:-rotate-180 sm:hs-dropdown-open:rotate-0 duration-300 ms-1 shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      className="hs-dropdown-menu sm:transition-[opacity,margin] sm:ease-in-out sm:duration-150 hs-dropdown-open:opacity-100 opacity-0 hidden z-10 top-full sm:w-48 bg-white sm:shadow-md rounded-lg py-2 sm:px-2 dark:bg-neutral-800 sm:dark:border dark:border-neutral-700 dark:divide-neutral-700"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="hs-mega-menu-1-col"
                    >
                      <div className="flex flex-col">
                        {menuItemsConsultaExterna
                          .filter(item => item.condition) // Filter based on condition
                          .map(item => (
                            <Link key={item.href} href={item.href} passHref>
                              <span className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300">
                                {item.label}
                              </span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              {/* Optionally, add a similar dropdown or section for Emergencia */}
              {menuItemsEmergencia.filter(item => item.condition).length > 0 && (
                <div className="hs-dropdown  z-50 [--strategy:static] sm:[--strategy:absolute] [--adaptive:none] sm:[--trigger:hover] [--is-collapse:true] sm:[--is-collapse:false]">
                  <button
                    id="hs-mega-menu-2-col"
                    type="button"
                    className="sm:p-3 flex items-center w-full text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-md shadow-md transition-all duration-300"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-controls="emergency-menu"
                    aria-label="Emergencia"
                  >
                    <TbBuildingHospital className='mr-2' />
                    Emergencia
                    <svg
                      className="hs-dropdown-open:-rotate-180 sm:hs-dropdown-open:rotate-0 duration-300 ms-1 shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    id="emergency-menu"
                    className="hs-dropdown-menu sm:transition-[opacity,margin] sm:ease-in-out sm:duration-150 hs-dropdown-open:opacity-100 opacity-0 hidden z-10 top-full sm:w-48 bg-white sm:shadow-md rounded-lg py-2 sm:px-2 dark:bg-neutral-800 sm:dark:border dark:border-neutral-700 dark:divide-neutral-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-mega-menu-2-col"
                  >
                    <div className="flex flex-col space-y-1">
                      {menuItemsEmergencia
                        .filter(item => item.condition) // Filter based on condition
                        .map(item => (


                          <Link key={item.href} href={item.href} passHref>
                            <span className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {menuItemsConfiguracion.filter(item => item.condition).length > 0 && (
                <div className="hs-dropdown z-50 [--strategy:static] sm:[--strategy:absolute] [--adaptive:none] sm:[--trigger:hover] [--is-collapse:true] sm:[--is-collapse:false]">
                  <button
                    id="hs-mega-menu-2-col"
                    type="button"
                    className="sm:p-3 flex items-center w-full text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-md shadow-md transition-all duration-300"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-controls="emergency-menu"
                    aria-label="Emergencia"
                  >
                    <GrConfigure className='mr-2' />
                    Configuraciones
                    <svg
                      className="hs-dropdown-open:-rotate-180 sm:hs-dropdown-open:rotate-0 duration-300 ms-1 shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    id="emergency-menu"
                    className="hs-dropdown-menu sm:transition-[opacity,margin] sm:ease-in-out sm:duration-150 hs-dropdown-open:opacity-100 opacity-0 hidden z-10 top-full sm:w-48 bg-white sm:shadow-md rounded-lg py-2 sm:px-2 dark:bg-neutral-800 sm:dark:border dark:border-neutral-700 dark:divide-neutral-700"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-mega-menu-2-col"
                  >
                    <div className="flex flex-col space-y-1">
                      {menuItemsConfiguracion
                        .filter(item => item.condition) // Filter based on condition
                        .map(item => (
                          <Link key={item.href} href={item.href} passHref>
                            <span className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="mr-2 z-50 hs-dropdown [--strategy:static] sm:[--strategy:absolute] [--adaptive:none] sm:[--trigger:hover] [--is-collapse:true] sm:[--is-collapse:false]">
                <button
                  id="hs-mega-menu-2-col"
                  type="button"
                  className="sm:p-3 flex items-center w-full text-white font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-md shadow-md transition-all duration-300"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  aria-label="Mega Menu"
                >
                  <FaUserCog className="mr-2" />
                  {session?.user?.name}
                  <svg
                    className="hs-dropdown-open:-rotate-180 sm:hs-dropdown-open:rotate-0 duration-300 ms-1 shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  className="hs-dropdown-menu sm:transition-all ease-in-out sm:duration-300 hs-dropdown-open:opacity-100 opacity-0 hidden z-10 top-full sm:w-60 bg-white sm:shadow-lg rounded-lg py-4 sm:px-4 dark:bg-neutral-800 sm:dark:border dark:border-neutral-700 dark:divide-neutral-700"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="hs-mega-menu-2-col"
                >
                  <div className="flex flex-col gap-y-2">
                    <LogoutBtn />
                  </div>
                </div>
              </div>
              <ColorPicker />
            </div>
          </div>
        </div>
      </nav>
    </header>
  </>
  )
}
