import { describe, expect, it } from "vitest";
import {
  atTime,
  makeDemo,
  validateReservation,
  canCancelReservation,
  validRoomCapacity,
  subscriptionPlans,
} from "../lib/roomly";
describe("Reguły rezerwacji Roomly", () => {
  const w = makeDemo();
  const day = w.reservations[0]?.starts_at.slice(0, 10) ?? "2026-11-22";
  it("odrzuca 10:30–11:30 dla A101 zajętej 10–11", () => {
    expect(
      validateReservation(
        w.rooms,
        w.reservations,
        "A101",
        atTime(day, "10:30"),
        atTime(day, "11:30"),
        "Spotkanie",
      ),
    ).not.toBeNull();
  });
  it("akceptuje sąsiadujący termin 11–12", () => {
    expect(
      validateReservation(
        w.rooms,
        w.reservations,
        "A101",
        atTime(day, "11:00"),
        atTime(day, "12:00"),
        "Spotkanie",
      ),
    ).toBeNull();
  });
  it("wymaga końca późniejszego niż początek", () => {
    expect(
      validateReservation(
        w.rooms,
        [],
        "A101",
        atTime(day, "11:00"),
        atTime(day, "10:00"),
        "Spotkanie",
      ),
    ).not.toBeNull();
  });
  it("A101 ma 20 miejsc", () => {
    expect(w.rooms.find((r) => r.id === "A101")?.capacity).toBe(20);
  });
  it("B202 ma 10 miejsc", () => {
    expect(w.rooms.find((r) => r.id === "B202")?.capacity).toBe(10);
  });
  it("demo zawiera dokładnie trzy rezerwacje", () => {
    expect(w.reservations).toHaveLength(3);
  });
  it("pojemność musi być dodatnia", () => {
    expect(validRoomCapacity(0)).toBe(false);
    expect(validRoomCapacity(1)).toBe(true);
  });
  it("pracownik może anulować własną przyszłą rezerwację", () => {
    const row = w.reservations[0];
    if (!row) throw new Error("Missing fixture");
    expect(canCancelReservation(row, "TEST-U01", "employee", Date.parse(row.starts_at) - 1)).toBe(
      true,
    );
  });
  it("pracownik nie może anulować cudzej rezerwacji", () => {
    const row = w.reservations[0];
    if (!row) throw new Error("Missing fixture");
    expect(canCancelReservation(row, "TEST-U02", "employee", Date.parse(row.starts_at) - 1)).toBe(
      false,
    );
  });
  it("pracownik nie anuluje własnej rozpoczętej rezerwacji", () => {
    const row = w.reservations[0];
    if (!row) throw new Error("Missing fixture");
    expect(canCancelReservation(row, "TEST-U01", "employee", Date.parse(row.starts_at))).toBe(
      false,
    );
  });
  it("administrator może anulować cudzą rezerwację", () => {
    const row = w.reservations[0];
    if (!row) throw new Error("Missing fixture");
    expect(canCancelReservation(row, "TEST-U02", "admin", Date.parse(row.starts_at))).toBe(true);
  });
  it("Basic kosztuje 19 zł na użytkownika miesięcznie", () => {
    expect(subscriptionPlans.find((p) => p.name === "Basic")?.price).toBe(19);
  });
  it("Pro kosztuje 39 zł na użytkownika miesięcznie", () => {
    expect(subscriptionPlans.find((p) => p.name === "Pro")?.price).toBe(39);
  });
});
