
import Link from 'next/link';
import style from './TopMenuCss.module.css'
export const TopMenuItem = ({ webadmin, cetriaje, admisionista ,CEAtencion}: { webadmin: any, cetriaje: any, admisionista: any,CEAtencion:any }) => {
  const linkClass = style.menu_items;
  const menuItems = [
    { href: "/sihce/inicio", label: "Inicio", condition: true },
    { href: "/sihce/auditoria", label: "Auditoria", condition: webadmin },
    { href: "/sihce/consultaexterna", label: "CE Externo", condition: webadmin || CEAtencion},
    { href: "/sihce/admigest", label: "Reprogramar", condition: webadmin },
    { href: "/sihce/listapx", label: "Lista Citados", condition: webadmin },
    { href: "/sihce/admision", label: "Admision", condition: webadmin || admisionista },
    { href: "/sihce/nuevousuario", label: "Paciente Nuevo", condition: webadmin || admisionista },
    { href: "/sihce/triaje", label: "Triaje", condition: webadmin || cetriaje },
    { href: "/sihce/roles", label: "Roles", condition: webadmin },
  ];
  return (
    <>
      {menuItems.map(
        (item, index) =>
          item.condition && (
            <Link key={index} className={linkClass} href={item.href} aria-current="page">
              {item.label}
            </Link>
          )
      )}
    </>
  )
}
