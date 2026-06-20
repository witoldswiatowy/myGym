# DECISIONS.md — Rejestr decyzji migracji myGym → Angular

> Wiążący rejestr decyzji architektonicznych (PROCESS.md §9, §11).
> Każda niejednoznaczność rozstrzygnięta przez człowieka lub uzgodniona z agentem
> trafia tutaj. Format: ID, data, status, kontekst, decyzja, konsekwencje.

## Status decyzji

`zaproponowana` → `zaakceptowana` (przez człowieka) → `zrealizowana` (w kodzie)

---

## D1 — Routing parametru treningu

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** Źródło RN (Expo Router) używa query param: `/workout?id=...`.
- **Decyzja:** **Query param.** Zachowujemy `/workout?id=...`.
  Angular: `ActivatedRoute.queryParamMap` / `queryParams`.
- **Konsekwencje:** trasa `workout` bez segmentu parametrycznego; odczyt id z query.

## D2 — Biblioteka UI

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** RN korzysta z komponentów Expo (Checkbox, Picker, Modal, FlatList).
- **Decyzja:** **Angular Material (+ CDK).** Dialog, Checkbox, Select z Material;
  Overlay i Virtual Scroll z CDK.
- **Konsekwencje:** zależność `@angular/material` + `@angular/cdk`; konfiguracja
  motywu Material; modale → `MatDialog`.

## D3 — Silnik storage

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** Źródło używa `AsyncStorage` (async); product-context = offline-first.
- **Decyzja:** **IndexedDB** za abstrakcją `StorageService`.
- **Konsekwencje:** publiczne API repozytoriów pozostaje `Promise`-owe; dostęp do
  danych wyłącznie przez repozytoria → `StorageService`.

## D4 — Safe-area / layout mobilny

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** `useSafeAreaInsets` (RN) nie ma odpowiednika w przeglądarce.
- **Decyzja:** **Pomijamy.** Cel = aplikacja webowa (SPA). Bez warstwy safe-area
  i bez dedykowanej responsywności mobilnej.
- **Konsekwencje:** usuwamy logikę insetów; layout zorientowany na web.

## D5 — Nawigacja (tab bar / menu)

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** W RN „Menu" otwiera `Modal`, część ekranów jest poza paskiem zakładek.
- **Decyzja:** **Zwykła nawigacja `routerLink`** (trasy + linki). Bez wzorca
  Modal-jako-nawigacja.
- **Konsekwencje:** „Menu" staje się zwykłą trasą/listą linków; spójny Angular Router.

## D6 — Placeholdery (`planner`, `menu`)

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** Ekrany `planner` („In progress...") i `menu` są szczątkowe.
- **Decyzja:** **Migrujemy jako puste ekrany** (komponenty-placeholdery, 1:1).
- **Konsekwencje:** powstają minimalne komponenty bez logiki, gotowe do rozbudowy.

## D7 — Model `Superset`

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** Model `Superset` zdefiniowany, ale nieużywany w UI.
- **Decyzja:** **Przenosimy 1:1** bez logiki (wierność danych).
- **Konsekwencje:** powstaje `superset.model.ts`; brak komponentów/serwisów na razie.

## D8 — Wersja Angulara

- **Data:** 2026-06-20
- **Status:** zaakceptowana
- **Kontekst:** Trzeba ustalić wersję frameworka i zestaw nowoczesnych funkcji.
- **Decyzja:** **Najnowszy stabilny Angular** (min. v20+) pobrany przez `ng new`
  w chwili inicjalizacji repo docelowego `../myGym-angular`. Wymagane: standalone
  components, signals, nowy control flow (`@if` / `@for` / `@switch`),
  builder esbuild/vite.
- **Konsekwencje:** konkretny numer wersji zostaje „przypięty" w `package.json`
  repo docelowego przy inicjalizacji (krok inicjalizujący w PLAN.md). Wszyscy
  agenci stosują nowoczesną składnię (zakaz `*ngIf`/`*ngFor`, NgModules).

## D9 — Konwencja nazewnictwa plików (suffiksy typu)

- **Data:** 2026-06-20
- **Status:** zaakceptowana — **opcja A**
- **Kontekst:** Zainstalowany Angular 22 zmienił domyślną konwencję CLI: schematy
  `ng generate` generują pliki BEZ suffiksu typu (np. `home.ts` z klasą `Home`,
  `workout-screen.ts` z klasą `WorkoutScreen`), a root jako `app.ts` (klasa `App`)
  — zamiast historycznych `*.component.ts` / `*.service.ts`. MAPPING §4 mandatował
  wcześniej jawne suffiksy. To kolizja konwencji obejmująca całe repo.
- **Decyzja:** **A — nowa konwencja Angular 22 (bez suffiksów typu).** Nazwa pliku =
  kebab-case nazwy klasy; brak `.component`/`.service`/`.model`. Domyślne zachowanie
  `ng generate` (bez konfiguracji schematów). MAPPING §3/§4 zaktualizowane.
- **Zasady szczegółowe:**
  - Komponenty/serwisy/dyrektywy/pipe'y/guardy: bez suffiksu typu — `home.ts`,
    `workout-screen.ts` (klasy `Home`, `WorkoutScreen`).
  - Modele/interfejsy: bez suffiksu — `exercise.ts`, `muscle.ts` (w `models/`).
  - Repozytoria (wzorzec DDD, nie typ Angulara): `exercise-repository.ts`,
    `workout-repository.ts` (klasy `ExerciseRepository`, `WorkoutRepository`).
  - Storage: plik `storage.ts`; klasa **`StorageService`** — świadomy wyjątek, by
    uniknąć kolizji z globalnym `Storage` (DOM).
  - Dane seed: zachowujemy `*.data.ts` (to nie typ schematu Angulara, lecz dane).
  - Routing: `app.routes.ts`. Root: `app.ts` (klasa `App`).
- **Konsekwencje:** brak konfiguracji schematów w `angular.json` (opcja A = domyślna).
  Wszyscy Implementatorzy stosują nazwy bez suffiksów typu. Per-krok ścieżki docelowe
  w PLAN.md czyta się wg tej zasady (patrz notka w nagłówku PLAN.md).

## D10 — Wersja Node (notatka środowiskowa)

- **Data:** 2026-06-20
- **Status:** odnotowana (nie blokuje)
- **Kontekst:** Angular CLI 22 raportuje zainstalowany **Node v25.8.2 jako
  „Unsupported"** (wspierane: 22 / 24 / 26). `ng build` i `ng test` są zielone.
- **Decyzja:** Nie blokujemy migracji. Zalecane (do wykonania przez człowieka poza
  procesem AI): przejście na parzysty Node LTS (np. 24.x) dla środowiska docelowego.
- **Konsekwencje:** jeśli pojawią się błędy związane z Node, wraca jako blokada.
