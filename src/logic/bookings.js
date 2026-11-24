/**
 * Reservas: validación de formulario y métricas de agenda.
 */

export const BOOKING_STATUS = ["Pendiente", "Confirmada", "Cancelada"];

/** Devuelve true si la fecha (YYYY-MM-DD) es anterior a hoy. */
export function isPastDate(date, today = new Date()) {
  if (!date) return false;
  const [y, m, d] = String(date).split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return target < base;
}

/**
 * Valida los datos de una reserva.
 * @returns {{valid: boolean, errors: Record<string,string>}}
 */
export function validateBooking(values = {}, today = new Date()) {
  const errors = {};
  const name = String(values.name ?? "").trim();
  const phone = String(values.phone ?? "").trim();
  const guests = Number(values.guests);

  if (name.length < 3) errors.name = "El nombre debe tener al menos 3 caracteres.";
  if (!/^\d{3}[\s-]?\d{3}[\s-]?\d{4}$/.test(phone))
    errors.phone = "El teléfono debe tener 10 dígitos.";
  if (!values.date) errors.date = "La fecha es obligatoria.";
  else if (isPastDate(values.date, today))
    errors.date = "No se permiten fechas pasadas.";
  if (!values.time) errors.time = "La hora es obligatoria.";
  if (!Number.isInteger(guests) || guests < 1 || guests > 20)
    errors.guests = "Las personas deben ser un entero entre 1 y 20.";

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Cambia el estado de una reserva solo si es una transición permitida. */
export function changeBookingStatus(bookings = [], id, status) {
  if (!BOOKING_STATUS.includes(status))
    throw new Error(`Estado de reserva inválido: ${status}`);
  const exists = bookings.some((booking) => booking.id === id);
  if (!exists) throw new Error(`Reserva no encontrada: ${id}`);
  return bookings.map((booking) =>
    booking.id === id ? { ...booking, status } : booking,
  );
}

/** Métricas de agenda para un día concreto (YYYY-MM-DD). */
export function agendaStats(bookings = [], date) {
  const ofDay = bookings.filter((booking) => booking.date === date);
  return {
    bookings: ofDay.length,
    guests: ofDay.reduce((sum, booking) => sum + Number(booking.guests || 0), 0),
    pending: bookings.filter((booking) => booking.status === "Pendiente").length,
  };
}
