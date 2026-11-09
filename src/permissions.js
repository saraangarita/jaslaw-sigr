const pagesByRole = {
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
