import { describe, it, expect } from "vitest";
import {
  money,
  categoriesOf,
  filterMenu,
  availableCount,
  orderableMenu,
} from "../logic/menu.js";

const menu = [
  { id: 1, name: "Posta cartagenera", category: "Platos fuertes", description: "Res cocida lentamente", price: 68000, available: true },
  { id: 4, name: "Ceviche de camarón", category: "Entradas", description: "Cítrico del Caribe", price: 38000, available: false },
  { id: 6, name: "Enyucado tibio", category: "Postres", description: "Coco y queso costeño", price: 24000, available: true },
];

describe("carta y disponibilidad", () => {
  it("formatea precios en pesos colombianos", () => {
    expect(money(68000)).toBe("$68.000");
    expect(money(0)).toBe("$0");
  });

  it("lista categorías sin duplicados e incluye Todos", () => {
    expect(categoriesOf(menu)).toEqual([
      "Todos",
      "Platos fuertes",
      "Entradas",
      "Postres",
    ]);
  });

  it("filtra por categoría", () => {
    expect(filterMenu(menu, { category: "Postres" })).toHaveLength(1);
  });

  it("busca por nombre y descripción sin distinguir mayúsculas", () => {
    expect(filterMenu(menu, { query: "coco" })[0].name).toBe("Enyucado tibio");
    expect(filterMenu(menu, { query: "POSTA" })).toHaveLength(1);
  });

  it("devuelve lista vacía cuando no hay coincidencias", () => {
    expect(filterMenu(menu, { query: "sushi" })).toEqual([]);
  });

  it("cuenta y excluye los platos agotados", () => {
    expect(availableCount(menu)).toBe(2);
    expect(orderableMenu(menu).map((d) => d.id)).toEqual([1, 6]);
  });
});
