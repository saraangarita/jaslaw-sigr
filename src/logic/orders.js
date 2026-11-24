/**
 * Lógica pura del dominio de pedidos y caja — Jaslaw.
 * Sin dependencias de React ni del navegador: apta para pruebas unitarias
 * automáticas dentro del pipeline CI/CD.
 */

export const ORDER_STATUS = [
  "Recibido",
  "En preparación",
  "Listo",
  "Entregado",
  "Cancelado",
];

export const FINAL_STATUS = ["Entregado", "Cancelado"];

/** Estado siguiente en el flujo de comanda. */
export function nextStatus(status) {
  switch (status) {
    case "Recibido":
      return "En preparación";
    case "En preparación":
      return "Listo";
    case "Listo":
      return "Entregado";
    case "Entregado":
    case "Cancelado":
      return status;
    default:
      throw new Error(`Estado de pedido desconocido: ${status}`);
  }
}

/** Aplica la transición de estado a un pedido dentro de una lista. */
export function advanceOrder(orders, id) {
  if (!Array.isArray(orders)) throw new TypeError("orders debe ser un arreglo");
  let touched = false;
  const updated = orders.map((order) => {
    if (order.id !== id) return order;
    touched = true;
    return { ...order, status: nextStatus(order.status) };
  });
  if (!touched) throw new Error(`Pedido no encontrado: ${id}`);
  return updated;
}

/** Pedidos que continúan en servicio (ni entregados ni cancelados). */
export function activeOrders(orders = []) {
  return orders.filter((order) => !FINAL_STATUS.includes(order.status));
}

/** Suma de ventas de los pedidos entregados. */
export function completedSales(orders = []) {
  return orders
    .filter((order) => order.status === "Entregado")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
}

/** Promedio por pedido entregado, seguro ante división por cero. */
export function averageTicket(orders = []) {
  const delivered = orders.filter((order) => order.status === "Entregado");
  if (delivered.length === 0) return 0;
  return Math.round(completedSales(delivered) / delivered.length);
}

/** Conteo de pedidos por estado, útil para los indicadores del tablero. */
export function countByStatus(orders = []) {
  return ORDER_STATUS.reduce((acc, status) => {
    acc[status] = orders.filter((order) => order.status === status).length;
    return acc;
  }, {});
}
