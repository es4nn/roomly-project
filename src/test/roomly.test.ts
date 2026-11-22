import { describe, expect, it } from 'vitest';
import { atTime, makeDemo, validateReservation } from '../lib/roomly';
describe('Reguły rezerwacji Roomly', () => {
  const w = makeDemo(); const day = w.reservations[0]?.starts_at.slice(0,10) ?? '2026-11-22';
  it('odrzuca 10:30–11:30 dla A101 zajętej 10–11', () => { expect(validateReservation(w.rooms,w.reservations,'A101',atTime(day,'10:30'),atTime(day,'11:30'),'Spotkanie')).toContain('zarezerwowana'); });
  it('akceptuje sąsiadujący termin 11–12', () => { expect(validateReservation(w.rooms,w.reservations,'A101',atTime(day,'11:00'),atTime(day,'12:00'),'Spotkanie')).toBeNull(); });
  it('wymaga końca późniejszego niż początek', () => { expect(validateReservation(w.rooms,[],'A101',atTime(day,'11:00'),atTime(day,'10:00'),'Spotkanie')).toContain('późniejsza'); });
  it('zawiera dwie sale o wymaganej pojemności i trzy rezerwacje', () => { expect(w.rooms.map(r=>r.capacity)).toEqual([20,10]); expect(w.reservations).toHaveLength(3); });
});