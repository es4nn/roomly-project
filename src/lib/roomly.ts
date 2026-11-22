export type Room = { id: string; name: string; location: string; capacity: number; description: string; equipment: string[]; is_active: boolean };
export type Reservation = { id: string; room_id: string; user_id: string; title: string; starts_at: string; ends_at: string; status: string };
export type Workspace = { organization: { id: string; name: string } | null; role: string; userId: string; displayName: string; rooms: Room[]; reservations: Reservation[]; members: { user_id: string; role: string; display_name: string }[] };
export const pages = ['Dashboard', 'Kalendarz', 'Sale konferencyjne', 'Moje rezerwacje', 'Administracja', 'Ustawienia'] as const;
export type Page = typeof pages[number];
export const pagePaths = ['/', '/kalendarz', '/sale', '/rezerwacje', '/administracja', '/ustawienia'] as const;
export function dayString(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function atTime(date: string, time: string) { return new Date(`${date}T${time}:00`).toISOString(); }
export function overlaps(start: string, end: string, otherStart: string, otherEnd: string) { return new Date(start).getTime() < new Date(otherEnd).getTime() && new Date(end).getTime() > new Date(otherStart).getTime(); }
export function validateReservation(rooms: Room[], rows: Reservation[], roomId: string, start: string, end: string, title: string) {
  if (!title.trim()) return 'Podaj tytuł spotkania.';
  if (!rooms.some(r => r.id === roomId && r.is_active)) return 'Wybierz aktywną salę.';
  if (!Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || Date.parse(end) <= Date.parse(start)) return 'Godzina zakończenia musi być późniejsza niż rozpoczęcia.';
  if (rows.some(r => r.room_id === roomId && r.status === 'active' && overlaps(start, end, r.starts_at, r.ends_at))) return 'Sala jest już zarezerwowana w tym terminie. Wybierz inne godziny.';
  return null;
}
export function makeDemo(): Workspace {
  const nextDay = new Date(); nextDay.setDate(nextDay.getDate()+1);
  const date = dayString(nextDay);
  return { organization: { id: 'demo', name: 'Merito Workspace' }, role: 'employee', userId: 'TEST-U01', displayName: 'Aleksandra', members: [{ user_id: 'TEST-U01', role: 'employee', display_name: 'Aleksandra · TEST-U01' }, { user_id: 'TEST-U02', role: 'employee', display_name: 'Michał · TEST-U02' }], rooms: [
    { id: 'A101', name: 'Sala A101', capacity: 20, location: 'Piętro 1 · Budynek A', description: 'Przestronna sala do wspólnych pomysłów i ważnych spotkań.', equipment: ['Monitor', 'Wi-Fi', 'Tablica', 'Klimatyzacja'], is_active: true },
    { id: 'B202', name: 'Sala B202', capacity: 10, location: 'Piętro 2 · Budynek B', description: 'Kameralna przestrzeń na spotkania zespołu i wideokonferencje.', equipment: ['Monitor', 'Wi-Fi', 'Wideokonferencja'], is_active: true }
  ], reservations: [
    { id: 'd1', room_id: 'A101', user_id: 'TEST-U01', title: 'Spotkanie zespołu projektowego', starts_at: atTime(date,'10:00'), ends_at: atTime(date,'11:00'), status: 'active' },
    { id: 'd2', room_id: 'A101', user_id: 'TEST-U02', title: 'Zajęty termin', starts_at: atTime(date,'12:00'), ends_at: atTime(date,'13:00'), status: 'active' },
    { id: 'd3', room_id: 'B202', user_id: 'TEST-U01', title: 'Planowanie tygodnia', starts_at: atTime(date,'09:00'), ends_at: atTime(date,'10:00'), status: 'active' }
  ] };
}
export function pageHead(title: string, description = 'Roomly — sale konferencyjne, wspólny kalendarz i rezerwacje bez konfliktów.') {
  return { meta: [{ title: `${title} · Roomly` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} · Roomly` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}