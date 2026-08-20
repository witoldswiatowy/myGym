# ADR 0001: Platforma Expo i routing oparty o pliki (Expo Router)

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

myGym to mobilna aplikacja do śledzenia treningu siłowego, która ma docelowo
działać na iOS i Androidzie (a pomocniczo również w przeglądarce). Zespół jest
mały, a priorytetem jest **szybki start** i jak najmniej konfiguracji natywnej
(Xcode/Gradle). Potrzebny jest też przewidywalny, czytelny model nawigacji.

## Decyzja

Budujemy aplikację na **Expo SDK 54** z **React Native 0.81 / React 19** i
korzystamy z **Expo Router** (routing oparty o strukturę plików w katalogu
[`app/`](../../app)).

Konkretne ustawienia (zob. [`app.json`](../../app.json)):

- `newArchEnabled: true` — włączona Nowa Architektura React Native.
- `experiments.reactCompiler: true` — automatyczna memoizacja przez React Compiler.
- `experiments.typedRoutes: true` — typowane trasy (bezpieczeństwo nawigacji w czasie kompilacji).
- `scheme: "mygym"` — deep linking.
- Nawigacja główna oparta o `Tabs` z Expo Router (zob. [`app/_layout.tsx`](../../app/_layout.tsx)).

Każdy ekran to plik `index.tsx` w odpowiednim folderze (`app/workout/`,
`app/history/`, `app/exercises/` itd.) — ścieżka w systemie plików = ścieżka URL.

## Konsekwencje

### Pozytywne

- Minimum konfiguracji natywnej; szybkie uruchomienie (`expo start`) i wsparcie OTA.
- Cross-platform „za darmo” (iOS / Android / web) z jednego kodu.
- Mniej boilerplate'u nawigacji niż w ręcznie konfigurowanym React Navigation —
  routing wynika ze struktury folderów.
- Typowane trasy redukują błędy nawigacji.

### Negatywne / kompromisy

- Zależność od cyklu wydawniczego Expo i częściowy **vendor lock-in**.
- Moduły natywne spoza ekosystemu Expo wymagają dev/custom buildów.
- `newArchEnabled` oraz `reactCompiler` to ustawienia świeże/eksperymentalne —
  trzeba monitorować zgodność bibliotek.

## Rozważane alternatywy

- **Goły React Native (bare workflow)** — większa kontrola nad warstwą natywną,
  ale znacznie wyższy koszt utrzymania; odrzucone na rzecz szybkości MVP.
- **React Navigation konfigurowane ręcznie** — bardziej elastyczne, ale więcej
  kodu; Expo Router i tak korzysta z React Navigation pod spodem.
