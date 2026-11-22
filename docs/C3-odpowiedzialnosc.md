# C3 — Podział odpowiedzialności
## Klient organizacji
Chroni konta, stosuje mocne hasła, zatwierdza role i zaproszenia, prowadzi listę pracowników, usuwa uprawnienia niepotrzebnym osobom, klasyfikuje tytuły spotkań oraz stosuje własne zasady ochrony danych.
## Dostawca Roomly
Utrzymuje kod, izolację tenantów, uprawnienia i zgodność migracji; testuje konflikty i operacje administracyjne; usuwa błędy oraz prowadzi komunikację o awariach. Dziennik bazy zapisuje wybrane operacje rezerwacji, sal i zaproszeń.
## Lovable Cloud
Dostarcza PostgreSQL, konta, magazyn i natywny hosting. Dokładne SLA, region, retencja backupów i granice odpowiedzialności wynikają z wybranej usługi — nie zostały w tym projekcie potwierdzone.
## Konta, logowanie i MFA
E-mail/hasło są aktywne. Potwierdzanie e-mail pozostaje włączone. Demo nie jest logowaniem. MFA nie jest wdrożone ani wymuszone w interfejsie MVP.
## Udostępnianie
Administrator generuje jednorazowy kod zaproszenia; użytkownik po zalogowaniu dołącza tylko jako pracownik. Publiczne są demo, strona produktu i prototypy, nie dane organizacji.
## Dane, kopie i eksport
Backupy wymagają sprawdzenia konfiguracji Cloud i testu odtworzenia. Eksport bazy przez narzędzia platformy jest zadaniem dostawcy; dedykowany eksport w aplikacji nie jest zaimplementowany.
## Awaria
Dostawca diagnozuje usługę, informuje klientów i przywraca działanie. Klient ogranicza zmiany podczas awarii i zgłasza zakres utraconych operacji. Nie ma gwarancji czasu przywrócenia w akademickim MVP.
