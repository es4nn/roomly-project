# Roomly — ćwiczenie 04: dziennik zmian

Prototypy są niezależnymi plikami HTML. Każdy zawiera własny CSS i JavaScript, działa bez serwera i zaczyna od tych samych pięciu fikcyjnych rekordów: dwóch sal i trzech rezerwacji. Dane utworzone podczas pracy znikają po ponownym otwarciu lub odświeżeniu pliku. Wygląd kolejnych wersji zachowuje układ, kolory, logo i karty v1.

| Wersja | Zmiana | Pracownik | Administrator | Lokalizacja |
| --- | --- | --- | --- | --- |
| v1 | Pierwsza wersja: wybór roli, przegląd sal i rezerwacji | Przegląda pięć rekordów demonstracyjnych | Przegląda te same rekordy | `v1.html` |
| v2 | Dodano tworzenie rezerwacji i kontrolę konfliktów | Rezerwuje salę | Rezerwuje salę | `v2.html` |
| v3 | Dodano administracyjne zarządzanie salami | Przegląda sale i rezerwuje, bez narzędzi zarządzania | Dodaje, edytuje i dezaktywuje sale; może też rezerwować | `v3.html` |

## Wyniki testów

Testy wykonano przez uruchomienie skryptów z plików HTML w Node.js w osobnych kontekstach z imitacją elementów DOM i zdarzeń formularzy. Sprawdzono także zawartość plików pod kątem zewnętrznych skryptów, arkuszy stylów, API i trwałego zapisu. Testy logiki przeszły; nie wykonano wizualnego testu w przeglądarce. Próba zrzutu przez Edge w trybie headless nie utworzyła obrazu.

| Wersja / przypadek | Oczekiwano | Faktycznie uzyskano |
| --- | --- | --- |
| v2 — dane początkowe | 2 sale i 3 rezerwacje | 2 sale i 3 rezerwacje |
| v2 — poprawna rezerwacja pracownika | Nowy wpis na liście i komunikat sukcesu | Liczba rezerwacji wzrosła z 3 do 4; wyświetlono komunikat sukcesu |
| v2 — konflikt tej samej sali i daty | Odrzucenie nakładającego się terminu | Liczba wpisów nie wzrosła; wyświetlono komunikat o konflikcie |
| v2 — styk przedziałów | Początek o 13:00 po zakończeniu poprzedniej o 13:00 jest dozwolony | Rezerwacja została dodana |
| v2 — inna data i błędna data | Ta sama godzina w innym dniu jest dozwolona; nieistniejąca data jest odrzucana | Rezerwację w innym dniu dodano; `2026-02-30` odrzucono |
| v2 — rola Administrator | Formularz działa również dla administratora | Rezerwacja administratora została dodana |
| v3 — funkcje v2 | Nadal można rezerwować; konflikt jest odrzucany | Obie operacje dały oczekiwany wynik dla pracownika i administratora |
| v3 — dodanie sali | Nowa sala pojawia się na kartach i w wyborze rezerwacji | Liczba sal wzrosła z 2 do 3; nowa sala pojawiła się w obu miejscach |
| v3 — edycja sali | Nazwa, lokalizacja i pojemność zmieniają się | Wszystkie trzy wartości zostały zaktualizowane |
| v3 — dezaktywacja sali | Sala pozostaje widoczna, ale nie przyjmuje nowych rezerwacji | Stan sali zmienił się na nieaktywny, znikła z wyboru; próba rezerwacji została odrzucona |
| v3 — niedozwolona operacja pracownika | Brak narzędzi w interfejsie i brak zmiany danych | Moduł i przyciski były ukryte; wywołanie formularza oraz zachowanych wcześniej obsług zdarzeń nie zmieniło sal |
| v3 — nowe uruchomienie skryptu | Powrót do danych początkowych | W nowym kontekście ponownie były 2 sale i 3 rezerwacje |
| v2 i v3 — samodzielność | Po jednym wewnętrznym arkuszu stylów i skrypcie; brak zależności i trwałego zapisu | Kontrola plików potwierdziła te warunki |

## Audyt bezpieczeństwa demonstracyjnego HTML — 8 punktów

| Punkt | Wynik i ograniczenie |
| --- | --- |
| 1. Uwierzytelnianie | Nie istnieje. Każdy może wybrać rolę Administrator bez hasła. To świadoma symulacja dydaktyczna. |
| 2. Autoryzacja | Formularz i przyciski administratora są ukrywane dla pracownika, a obsługi zdarzeń ponownie sprawdzają wybraną rolę. Te kontrole działają tylko w interfejsie użytkownika. |
| 3. Obejście w DevTools | Kod, wybrana rola i tablice danych są dostępne w kontekście strony. Użytkownik może zmienić rolę albo dane z konsoli. Test przez wykonanie kodu w kontekście skryptu potwierdził bezpośrednią zmianę nazwy sali. Kontrola ról nie jest zabezpieczeniem. |
| 4. Dane i sekrety | W plikach są wyłącznie fikcyjne rekordy; nie ma kluczy ani połączenia z produkcyjną bazą. Mimo to dane wpisane przez użytkownika są jawne dla jego przeglądarki. |
| 5. Walidacja formularzy | Skrypt sprawdza datę, godziny, tytuł, salę i pojemność. Walidację po stronie klienta można ominąć w DevTools, więc nie może chronić usługi produkcyjnej. |
| 6. Konflikty rezerwacji | Sprawdzenie nakładania dotyczy tylko lokalnej tablicy. Nie zapewnia spójności między użytkownikami ani atomowego zapisu. System SaaS wymaga sprawdzania konfliktu po stronie serwera i bazy. |
| 7. Wstawianie tekstu | Dynamiczne nazwy i tytuły trafiają do DOM przez `textContent`, bez `innerHTML`, co ogranicza ryzyko wykonania wpisanego HTML w tym prototypie. |
| 8. Trwałość i ślad zmian | Brak `localStorage`, API i bazy; dane znikają po odświeżeniu. Nie ma audytu operacji, kopii zapasowej ani odzyskiwania zmian. |

## Powrót z v3 do v2

Otwórz bezpośrednio `v2.html` zamiast `v3.html`. Poprzednia wersja jest osobnym, niezmienionym plikiem i nie wymaga migracji ani nadpisania. Dane dodane podczas pracy w v3 nie przechodzą do v2, ponieważ każda strona trzyma je tylko w swojej pamięci JavaScript.
