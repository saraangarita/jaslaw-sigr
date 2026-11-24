import { describe, it, expect } from "vitest";
import { canAccess, pagesByRole, nextRole } from "../permissions.js";

describe("control de acceso por rol", () => {
  it("el administrador accede a todos los módulos", () => {
    ["Inicio", "Menú", "Pedidos", "Reservas", "Caja", "Reportes", "Usuarios"].forEach(
      (page) => expect(canAccess("Administrador", page)).toBe(true),
    );
  });

  it("el mesero no accede a caja, reportes ni usuarios", () => {
    expect(canAccess("Mesero", "Pedidos")).toBe(true);
    expect(canAccess("Mesero", "Caja")).toBe(false);
    expect(canAccess("Mesero", "Reportes")).toBe(false);
  });

  it("el cliente solo consulta menú y reservas", () => {
    expect(canAccess("Cliente", "Menú")).toBe(true);
    expect(canAccess("Cliente", "Reservas")).toBe(true);
    expect(canAccess("Cliente", "Pedidos")).toBe(false);
  });

  it("niega el acceso a roles inexistentes y páginas desconocidas", () => {
    expect(canAccess("Invitado", "Inicio")).toBe(false);
    expect(canAccess("Administrador", "Auditoría")).toBe(false);
  });

  it("rota los roles de demostración en ciclo", () => {
    expect(nextRole("Cliente")).toBe("Mesero");
    expect(nextRole("Mesero")).toBe("Administrador");
    expect(nextRole("Administrador")).toBe("Cliente");
    expect(Object.keys(pagesByRole)).toHaveLength(3);
  });
});
