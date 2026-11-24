/**
 * Control de acceso simulado por rol — prototipo académico Jaslaw.
 * No existen cuentas, contraseñas ni sesiones de producción.
 */

export const pagesByRole = {
  Cliente: ["Inicio", "Menú", "Reservas"],
  Mesero: ["Inicio", "Menú", "Pedidos", "Reservas"],
  Administrador: [
    "Inicio",
    "Menú",
    "Pedidos",
    "Reservas",
    "Caja",
    "Reportes",
    "Usuarios",
  ],
};

export function canAccess(role, page) {
  return pagesByRole[role]?.includes(page) ?? false;
}

export function nextRole(role) {
  const roles = Object.keys(pagesByRole);
  const i = roles.indexOf(role);
  return roles[(i + 1) % roles.length];
}
