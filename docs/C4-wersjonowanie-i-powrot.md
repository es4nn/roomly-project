# C4 — Wersjonowanie i powrót
## Wersje prototypów
v1: lista dwóch sal i trzech rezerwacji, wybór symulowanej roli.
v2: wszystko z v1 oraz tworzenie rezerwacji z kontrolą nakładania terminów.
v3: wszystko z v2 oraz administracja sal: dodawanie, edytowanie, aktywacja/dezaktywacja.
Pliki: public/prototypy/v1.html, v2.html, v3.html. Każdy działa samodzielnie, także lokalnie, bez zależności.
## Testy przed wdrożeniem
Testy jednostkowe walidacji, testy obu ról, próby API poza UI, jednoczesne rezerwacje, izolacja tenantów, odświeżenie i wylogowanie, telefon oraz sprawdzenie błędów kompilacji.
## Przywrócenie v2 po błędzie v3
Zachować wszystkie trzy pliki. Użyć v2.html zamiast v3.html lub przywrócić poprzednią wersję kodu w historii projektu Lovable i opublikować ją. Demo traci dane przy odświeżeniu niezależnie od wersji.
## Prawdziwa aplikacja
Zmiany zapisywać w Git; późniejszą synchronizację użytkownik łączy w Ustawienia projektu → Git. Kod i historia są niezależne od publikacji. Sprawdzona wersja trafia na natywny hosting Lovable.
## Rollback nie jest odtworzeniem danych
Powrót kodu nie cofa migracji ani usuniętych rekordów. Stosować addytywne migracje kompatybilne z poprzednim kodem. Usunięcie tabel lub kolumn wymaga backupu, planu przeniesienia i wskazania utraty danych. Odtworzenie bazy może utracić operacje wykonane po punkcie odtworzenia.
