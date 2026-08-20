# ADR 0006: Logika ekranów w custom hookach i model formularza

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

Ekrany takie jak trening potrafią mieć złożoną logikę: ładowanie danych z wielu
repozytoriów, edycja serii, modale wyboru typu serii / jednostki wagi, zapisywanie
zmian. Zespół ma tło OOP/Angular, gdzie naturalny jest podział na **widok** i
**logikę** (komponent vs serwis/kontroler). W React idiomatycznym odpowiednikiem
tego rozdziału są **custom hooki**.

## Decyzja

Logikę ekranów wydzielamy do **custom hooków** w [`src/hooks`](../../src/hooks),
a komponenty pozostają w większości prezentacyjne.

- [`use-workout-screen.ts`](../../src/hooks/use-workout-screen.ts) trzyma stan
  ekranu treningu i operacje na nim; komponent ekranu głównie renderuje wynik.
- **Osobny model formularza** — `SetForm` przechowuje pola edytowalne jako `string`
  (bo natywne pola tekstowe operują na stringach), a konwersja do/z modelu
  domenowego `WorkoutSet` (liczby) odbywa się przez funkcje `mapSet` / `toWorkoutSet`.
  Dzięki temu warstwa domenowa pozostaje „czysta” (liczby, typy unii), a UI ma
  wygodny dla inputów kształt danych.
- **Debounce** dla operacji reagujących na pisanie (np. wyszukiwanie) realizuje
  [`use-debounced-value.ts`](../../src/hooks/use-debounced-value.ts).

## Konsekwencje

### Pozytywne

- Logika jest testowalna w izolacji i odseparowana od JSX.
- Komponenty są krótkie i czytelne.
- Pełna kontrola nad polami tekstowymi (walidacja, puste wartości) dzięki modelowi
  formularza.

### Negatywne / kompromisy

- **Boilerplate mapowania** form ↔ domena (string ↔ number) — dodatkowy kod i
  miejsce na błędy konwersji.
- Stan jest **lokalny dla ekranu** (`useState`). Nie ma globalnego store'a — jeśli
  stan zacznie być współdzielony między ekranami, trzeba będzie rozważyć
  React Context lub bibliotekę typu Zustand (osobny, przyszły ADR).
