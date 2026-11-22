# C2 — Macierz dostępu i audyt
| Zasób/operacja | Pracownik | Administrator | Aplikacja | Dostawca |
|---|---|---|---|---|
| Sale własnej organizacji | odczyt | odczyt i zarządzanie | egzekwuje reguły | utrzymuje usługę |
| Własna przyszła rezerwacja | tworzy/anuluje | tworzy/anuluje | walidacja + atomowy zapis | utrzymuje bazę |
| Cudze spotkania | wyłącznie zajętość | szczegóły/anulowanie | redakcja tytułu i właściciela | dostęp operacyjny ograniczany proceduralnie |
| Role | brak modyfikacji | zmiana w swojej firmie | chronione funkcje | obsługa incydentów |
| Inna organizacja | brak | brak | RLS i kontrola tenantów | odpowiedzialność operacyjna |
## Osiem ustaleń audytu
1. Dane produkcyjne są w PostgreSQL Lovable Cloud; zdjęcia aplikacji w magazynie zasobów Lovable. Region i polityka retencji wymagają potwierdzenia w ustawieniach usługi.
2. Role znajdują się w osobnej tabeli user_roles. Nie są brane z edytowalnego profilu ani pamięci przeglądarki.
3. Narzędzia deweloperskie mogą zmienić interfejs i wysyłać żądania, ale funkcje w bazie sprawdzają tożsamość i członkostwo.
4. Kod nie zawiera klucza administracyjnego ani hasła bazy. Publiczny klucz klienta nie jest sekretem. Sekrety runtime zarządza Cloud.
5. RLS ogranicza odczyt do firmy; funkcje mutujące sprawdzają tę samą organizację. Odczyt kalendarza redaguje cudze poufne szczegóły.
6. Pracownik nie zmienia samodzielnie roli ani członkostwa. Pierwszy administrator powstaje w transakcji tworzenia organizacji. Zaproszenia nadają tylko rolę pracownika.
7. Constraint wykluczający zakresy [początek, koniec) blokuje jednoczesne konflikty. Sąsiadujące terminy są dozwolone.
8. W razie utraty danych potrzebne jest odtworzenie backupu, nie sam rollback kodu. Retencja i praktyczne odtworzenie kopii nie zostały zweryfikowane.
## Trzy najważniejsze ryzyka
- Niezweryfikowane odtwarzanie kopii oraz parametry SLA/retencji.
- Brak wymuszonego MFA, limitów prób biznesowych i monitoringu z alertami.
- Przed obsługą 100 firm: testy obciążeniowe, limity/stronicowanie długich historii, monitoring, backupy i proces zarządzania incydentami.
## Ograniczenia MVP
Jeden użytkownik należy do jednej organizacji. Kalendarz Cloud obejmuje ostatnie 90 dni i następny rok; statystyki odnoszą się do tego okna. Zaproszenia są jednorazowe, przekazywane ręcznie, wygasają po 7 dniach. Brak automatycznej wysyłki zaproszeń, płatności, eksportu danych użytkownika oraz trwałych preferencji motywu.
