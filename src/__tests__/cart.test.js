import { describe, it, expect } from "vitest";
import {
  addToCart,
  removeFromCart,
  cartTotal,
  cartItems,
  buildOrder,
} from "../logic/cart.js";

const posta = {
  id: 1,
  name: "Posta cartagenera",
  price: 68000,
  available: true,
};
const ceviche = { id: 4, name: "Ceviche", price: 38000, available: true };

describe("comanda en construcción", () => {
  it("añade un plato nuevo con cantidad 1", () => {
    const cart = addToCart([], posta);
    expect(cart).toEqual([{ ...posta, qty: 1 }]);
  });

  it("incrementa la cantidad si el plato ya está en la comanda", () => {
    const cart = addToCart(addToCart([], posta), posta);
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(2);
  });

  it("calcula subtotal y número de productos", () => {
    const cart = addToCart(addToCart([], posta), ceviche);
    expect(cartTotal(cart)).toBe(106000);
    expect(cartItems(cart)).toBe(2);
  });

  it("no permite añadir un plato agotado", () => {
    expect(() => addToCart([], { ...posta, available: false })).toThrow(
      /no está disponible/,
    );
  });

  it("elimina el plato cuando la cantidad llega a cero", () => {
    const cart = addToCart([], ceviche);
    expect(removeFromCart(cart, ceviche.id)).toHaveLength(0);
  });

  it("construye el pedido con estado Recibido y total correcto", () => {
    const order = buildOrder(addToCart([], posta), { id: "J-201" });
    expect(order).toMatchObject({
      id: "J-201",
      status: "Recibido",
      items: 1,
      total: 68000,
    });
  });

  it("no permite registrar una comanda vacía", () => {
    expect(() => buildOrder([], { id: "J-202" })).toThrow(/vacía/);
  });
});
