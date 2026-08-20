# Architecture Decision Records (ADR)

Ten katalog zawiera **Architecture Decision Records** — krótkie dokumenty opisujące
istotne decyzje architektoniczne podjęte w projekcie myGym wraz z ich kontekstem
i konsekwencjami.

## Po co ADR-y?

> Tło dla osoby z ekosystemu OOP/Java: ADR to odpowiednik „decyzji projektowej”
> zapisanej na trwałe — zamiast trzymać uzasadnienia w głowie albo w komentarzach,
> spisujemy je raz, w jednym miejscu. Dzięki temu po miesiącach wiadomo *dlaczego*
> coś wygląda tak, a nie inaczej.

Każdy ADR odpowiada na trzy pytania:

1. **Kontekst** — jaki problem / jaka sytuacja wymusza decyzję?
2. **Decyzja** — co konkretnie wybieramy?
3. **Konsekwencje** — co na tym zyskujemy i co tracimy?

## Format i status

- Plik na decyzję, numerowany rosnąco: `NNNN-krotki-tytul.md`.
- Status: `Proponowany` → `Zaakceptowany` → (`Wycofany` / `Zastąpiony przez ADR-XXXX`).
- ADR-ów **nie edytujemy wstecz** poza zmianą statusu. Zmiana decyzji = nowy ADR,
  który zastępuje poprzedni.

## Spis decyzji

| Nr | Tytuł | Status |
|----|-------|--------|
| [0001](0001-platforma-expo-i-expo-router.md) | Platforma Expo i routing oparty o pliki (Expo Router) | Zaakceptowany |
| [0002](0002-typescript-strict-i-aliasy-sciezek.md) | TypeScript w trybie strict i aliasy ścieżek | Zaakceptowany |
| [0003](0003-offline-first-z-asyncstorage.md) | Trwałość offline-first oparta o AsyncStorage | Zaakceptowany |
| [0004](0004-wzorzec-repository.md) | Izolacja dostępu do danych wzorcem Repository | Zaakceptowany |
| [0005](0005-relacyjny-model-danych.md) | Znormalizowany, relacyjny model danych | Zaakceptowany |
| [0006](0006-logika-ekranow-w-custom-hookach.md) | Logika ekranów w custom hookach i model formularza | Zaakceptowany |
| [0007](0007-struktura-projektu-i-konwencje.md) | Struktura projektu i konwencje kodu | Zaakceptowany |
| [0008](0008-dwujezyczne-wyszukiwanie-cwiczen.md) | Dwujęzyczne, tolerancyjne wyszukiwanie ćwiczeń | Zaakceptowany |

## Jak dodać nowy ADR

1. Skopiuj strukturę z dowolnego istniejącego pliku.
2. Nadaj kolejny numer i opisowy tytuł w kebab-case.
3. Dopisz wiersz do tabeli powyżej.
