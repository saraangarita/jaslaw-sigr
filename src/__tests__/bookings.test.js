import { describe, it, expect } from "vitest";
import {
  isPastDate,
  validateBooking,
  changeBookingStatus,
  agendaStats,
} from "../logic/bookings.js";

const today = new Date(2026, 10, 5); // 5 de noviembre de 2026
const validBooking = {
  name: "Mariana Acosta",
  date: "2026-11-06",
  time: "19:00",
  guests: 4,
  phone: "300 456 7801",
};

const bookings = [
  { id: 1, name: "Mariana Acosta", date: "2026-11-05", time: "19:00", guests: 4, status: "Confirmada" },
  { id: 2, name: "Felipe Mendoza", date: "2026-11-05", time: "20:30", guests: 2, status: "Pendiente" },
  { id: 3, name: "Laura Jiménez", date: "2026-11-06", time: "19:30", guests: 6, status: "Confirmada" },
];

describe("validación de reservas", () => {
  it("acepta una reserva completa y futura", () => {
    expect(validateBooking(validBooking, today).valid).toBe(true);
  });

  it("rechaza fechas pasadas", () => {
    const result = validateBooking(
      { ...validBooking, date: "2026-11-04" },
      today,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.date).toMatch(/pasadas/);
  });

  it("acepta la fecha de hoy como válida", () => {
    expect(isPastDate("2026-11-05", today)).toBe(false);
    expect(
      validateBooking({ ...validBooking, date: "2026-11-05" }, today).valid,
    ).toBe(true);
  });

  it("exige nombre, teléfono, hora y número de personas", () => {
    const { errors } = validateBooking({}, today);
    expect(Object.keys(errors).sort()).toEqual([
      "date",
      "guests",
      "name",
      "phone",
      "time",
    ]);
  });

  it("rechaza teléfonos con formato inválido", () => {
    const { errors } = validateBooking(
      { ...validBooking, phone: "12345" },
      today,
    );
    expect(errors.phone).toMatch(/10 dígitos/);
  });

  it("rechaza grupos fuera del rango 1 a 20", () => {
    expect(validateBooking({ ...validBooking, guests: 0 }, today).valid).toBe(
      false,
    );
    expect(validateBooking({ ...validBooking, guests: 25 }, today).valid).toBe(
      false,
    );
  });
});

describe("gestión de la agenda", () => {
  it("cambia el estado de una reserva existente", () => {
    const updated = changeBookingStatus(bookings, 2, "Confirmada");
    expect(updated.find((b) => b.id === 2).status).toBe("Confirmada");
  });

  it("rechaza estados no permitidos y reservas inexistentes", () => {
    expect(() => changeBookingStatus(bookings, 2, "En cocina")).toThrow(
      /inválido/,
    );
    expect(() => changeBookingStatus(bookings, 99, "Confirmada")).toThrow(
      /no encontrada/,
    );
  });

  it("resume reservas, comensales y pendientes del día", () => {
    expect(agendaStats(bookings, "2026-11-05")).toEqual({
      bookings: 2,
      guests: 6,
      pending: 1,
    });
  });
});
