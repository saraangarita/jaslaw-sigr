/**
 * Carrito / comanda en construcción — lógica pura y testeable.
 */

/** Añade un plato; si ya existe incrementa la cantidad. */
export function addToCart(cart = [], dish) {
  if (!dish || dish.id === undefined) throw new Error("Plato inválido");
  if (dish.available === false)
    throw new Error(`El plato ${dish.name} no está disponible`);

  const found = cart.find((item) => item.id === dish.id);
  if (found) {
    return cart.map((item) =>
      item.id === dish.id ? { ...item, qty: item.qty + 1 } : item,
    );
  }
  return [...cart, { ...dish, qty: 1 }];
}

/** Quita una unidad; elimina el plato cuando la cantidad llega a cero. */
export function removeFromCart(cart = [], id) {
  return cart
    .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
    .filter((item) => item.qty > 0);
}

export function cartTotal(cart = []) {
  return cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
}

export function cartItems(cart = []) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/** Arma el objeto de pedido que se registra al confirmar la comanda. */
export function buildOrder(cart, { id, table = "Mesa nueva", guest = "Cliente", time }) {
  if (!cart || cart.length === 0) throw new Error("La comanda está vacía");
  return {
    id,
    table,
    guest,
    items: cartItems(cart),
    total: cartTotal(cart),
    status: "Recibido",
    time: time ?? new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
