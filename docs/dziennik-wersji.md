# Dziennik wersji
## Prototypy
- v1 — samodzielny HTML, role symulowane, lista 2 sal i 3 rezerwacji.
- v2 — dodane tworzenie rezerwacji i kontrola konfliktu 10:30–11:30 z 10–11; 11–12 dozwolone.
- v3 — dodany panel zarządzania salami, niedostępny w UI pracownika; role nadal tylko symulowane.
Lokalizacja: public/prototypy/. Dostęp w aplikacji: /materialy.
## Roomly MVP 1.0
Polskie dashboard, kalendarz dzień/tydzień, sale, filtry, rezerwacje, anulowanie, profile, ciemny motyw, Cloud Auth, onboarding, organizacje, chronione role, atomowe konflikty, statystyki i zaproszenia. Publiczne demo jest odseparowane od bazy.
## Wyniki rzeczywiste — 22 listopada 2026
- Vitest: 14/14 testów — konflikty, sąsiedni termin, kolejność godzin, rekordy demo, pojemność, uprawnienia anulowania, ceny Basic/Pro i dopasowanie strony /.
- Przeglądarka demo: zapis rezerwacji, odczyt w dashboardzie, kalendarz dzień/tydzień, reset po odświeżeniu, obrazy załadowane, telefon 390×844 bez poziomego przepełnienia, działające menu.
- Przeglądarka Cloud: utworzenie organizacji, sali i rezerwacji; odczyt po odświeżeniu; wylogowanie do /auth.
- Konto pracownika: dodawanie sal przez API i samodzielna zmiana roli odrzucone; cudze tytuły redagowane.
- Izolacja: odczyt obcej sali zwrócił 0 rekordów, zapis rezerwacji obcej organizacji odrzucony.
- Równoczesny zapis administratora i pracownika: dokładnie jeden sukces, druga operacja kod 23P01. Rezerwacja sąsiadująca pracownika przyjęta i widoczna w UI.
- Trwałość: rezerwacja widoczna po odświeżeniu oraz przywróceniu rzeczywistej sesji po wylogowaniu. Nie wykonano ponownego wpisania hasła w teście trwałości.
- Prototypy v1–v3: początkowe 2 sale i 3 rezerwacje; reset po odświeżeniu; v2/v3 odrzucają konflikt i przyjmują sąsiedni termin; v3 dodaje salę jako administrator i ukrywa administrację pracownikowi.
- Zaproszenia: administrator generuje kod, nowe konto dołącza przez UI jako pracownik; ponowna próba jest odrzucona.
## Niezweryfikowane
Dostarczenie e-mail potwierdzającego i odzyskiwania hasła, pełny cykl resetu hasła z otrzymanego e-mail, backup/odtworzenie, MFA, obciążenie 100 firm i własne połączenie Git użytkownika.
