import { describe, it, expect } from "vitest";
import {
  nextStatus,
  advanceOrder,
  activeOrders,
  completedSales,
  averageTicket,
  countByStatus,
} from "../logic/orders.js";

const orders = [
  { id: "J-104", status: "En preparación", total: 166000 },
  { id: "J-103", status: "Recibido", total: 104000 },
  { id: "J-102", status: "Listo", total: 218000 },
  { id: "J-101", status: "Entregado", total: 90000 },
  { id: "J-100", status: "Cancelado", total: 50000 },
];

describe("flujo de estados del pedido", () => {
  it("avanza Recibido → En preparación → Listo → Entregado", () => {
    expect(nextStatus("Recibido")).toBe("En preparación");
    expect(nextStatus("En preparación")).toBe("Listo");
    expect(nextStatus("Listo")).toBe("Entregado");
  });

  it("mantiene el estado cuando el pedido ya es final", () => {
    expect(nextStatus("Entregado")).toBe("Entregado");
    expect(nextStatus("Cancelado")).toBe("Cancelado");
  });

  it("rechaza estados desconocidos", () => {
    expect(() => nextStatus("Volando")).toThrow(/desconocido/);
  });

  it("actualiza solo el pedido indicado", () => {
    const updated = advanceOrder(orders, "J-103");
    expect(updated.find((o) => o.id === "J-103").status).toBe("En preparación");
    expect(updated.find((o) => o.id === "J-104").status).toBe("En preparación");
    expect(updated).toHaveLength(orders.length);
    expect(orders.find((o) => o.id === "J-103").status).toBe("Recibido");
  });

  it("lanza error si el pedido no existe", () => {
    expect(() => advanceOrder(orders, "J-999")).toThrow(/no encontrado/);
  });
});

describe("indicadores de caja y tablero", () => {
  it("cuenta como activos los pedidos que no son finales", () => {
    expect(activeOrders(orders)).toHaveLength(3);
  });

  it("suma únicamente las ventas entregadas", () => {
    expect(completedSales(orders)).toBe(90000);
  });

  it("calcula el ticket promedio sin dividir por cero", () => {
    expect(averageTicket(orders)).toBe(90000);
    expect(averageTicket([])).toBe(0);
  });

  it("agrupa los pedidos por estado", () => {
    const counts = countByStatus(orders);
    expect(counts.Recibido).toBe(1);
    expect(counts.Entregado).toBe(1);
    expect(counts.Cancelado).toBe(1);
  });
});
