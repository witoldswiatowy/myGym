# ADR 0007: Struktura projektu i konwencje kodu

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

Projekt ma rosnąć od MVP do aplikacji z analityką. Potrzebny jest przewidywalny
układ katalogów i spójne konwencje, żeby kod pozostał czytelny i łatwy w nawigacji,
a granice odpowiedzialności (UI / logika / dane) były wyraźne.

## Decyzja

### Podział katalogów

- **[`app/`](../../app)** — wyłącznie **routing** Expo Router (ekrany jako pliki
  `index.tsx`, layouty `_layout.tsx`). Brak logiki domenowej.
- **[`src/`](../../src)** — kod aplikacji w warstwach:
  - `components/` — UI, z podziałem na `common/` (współdzielone, np. `Screen`)
    oraz foldery per funkcja (`exercises/`, `workout/`).
  - `data/` — dane seed (`*.data.ts`).
  - `hooks/` — logika ekranów / reużywalne hooki.
  - `models/` — typy domenowe.
  - `repositories/` — dostęp do danych ([ADR 0004](0004-wzorzec-repository.md)).
  - `search/` — logika wyszukiwania ([ADR 0008](0008-dwujezyczne-wyszukiwanie-cwiczen.md)).
  - `theme/` — tokeny stylów (np. [`spacing.ts`](../../src/theme/spacing.ts)).

### Style

- Style trzymamy w **dedykowanych plikach `*.style.ts`** (React Native `StyleSheet`),
  obok komponentu — np. [`workout.style.ts`](../../src/components/workout/workout.style.ts).
- Wartości powtarzalne (odstępy) pochodzą z **tokenów** w `src/theme`, zamiast
  „magicznych liczb” rozsianych po kodzie.

### Nazewnictwo

- Pliki w **kebab-case** (`add-exercise-modal.tsx`, `use-workout-screen.ts`).
- **Wyjątek:** pliki modeli w `src/models` używają **PascalCase**, odpowiadając
  nazwie eksportowanego typu (`Exercise.ts`, `WorkoutSet.ts`).

### Jakość kodu

- Lint przez **ESLint we flat config** z `eslint-config-expo`
  (zob. [`eslint.config.js`](../../eslint.config.js)).

### Boilerplate referencyjny

- Katalog [`app-example/`](../../app-example) to wygenerowany przez Expo szablon
  startowy, zachowany **jako referencja**. Docelowo do usunięcia, gdy własne wzorce
  się ustabilizują.

## Konsekwencje

### Pozytywne

- Przewidywalna lokalizacja kodu — łatwo zgadnąć, gdzie coś leży.
- Wyraźna separacja routingu, UI, logiki i danych.
- Spójne odstępy i style dzięki tokenom i plikom `*.style.ts`.

### Negatywne / kompromisy

- **Dwie konwencje nazewnicze** (kebab-case + PascalCase dla modeli) — wymaga
  świadomości wyjątku.
- `app-example/` **zaśmieca repozytorium** do czasu usunięcia i może mylić przy
  wyszukiwaniu w kodzie.
