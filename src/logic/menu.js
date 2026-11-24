/**
 * Catálogo del menú: filtros, categorías y disponibilidad.
 */

export function money(value) {
  return "$" + Number(value || 0).toLocaleString("es-CO");
}

/** Categorías presentes en la carta, con "Todos" al inicio. */
export function categoriesOf(menu = []) {
  return ["Todos", ...new Set(menu.map((dish) => dish.category))];
}

/** Filtra por categoría y por texto en nombre o descripción. */
export function filterMenu(menu = [], { query = "", category = "Todos" } = {}) {
  const term = String(query).trim().toLowerCase();
  return menu.filter((dish) => {
    const matchesCategory = category === "Todos" || dish.category === category;
    const haystack = `${dish.name} ${dish.description ?? ""}`.toLowerCase();
    return matchesCategory && haystack.includes(term);
  });
}

export function availableCount(menu = []) {
  return menu.filter((dish) => dish.available).length;
}

/** Solo los platos ofertables se pueden añadir a una comanda. */
export function orderableMenu(menu = []) {
  return menu.filter((dish) => dish.available);
}
