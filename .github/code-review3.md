# Code Review — myGym

> Odtworzone z zachowanego review z poprzedniej części konwersacji. Analiza obejmowała kod `app/`, `src/`, `package.json`, `app.json`, `tsconfig.json`, `copilot-instructions.md`, `roadmap.md` i `docs/product-context.md`. Nie modyfikowano kodu produkcyjnego.

## Streszczenie

Projekt ma dobrą bazę MVP: sensowny podział na `models`, `repositories`, `hooks`, `components` i `data`; zapis treningu z debounce; normalizację wyszukiwania PL/EN; TypeScript strict; Expo Router z typed routes. Ocena: **6.5/10 jako MVP w budowie**.

Najważniejsze problemy:

- 🔴 ekran `Workout` jest jednocześnie zakładką i ekranem szczegółów wymagającym `id`;
- 🔴 `reset-project` w `package.json` wskazuje na nieistniejący plik;
- 🔴 `app/menu/index.tsx` jest pustym, praktycznie nieosiągalnym ekranem;
- 🔴 tymczasowe ID `new-*` serii są zapisywane trwale, a repozytorium nie obsługuje usuwania;
- 🟠 duplikacja typów `SetType`, jednostek i targetów modali;
- 🟠 `FlatList` jest zagnieżdżony w poziomym `ScrollView`;
- 🟠 listy nie odświeżają się po powrocie na ekran (`useFocusEffect`);
- 🟠 brak centralnej palety kolorów;
- 🟠 duplikacja logiki AsyncStorage i brak walidacji danych runtime;
- 🟡 niespójny język UI, `any`, inline styles, komentarze-dziennik, utrata pól domenowych podczas mapowania.

## Mocne strony

- Podział warstw jest zgodny z kierunkiem architektury aplikacji.
- `useWorkoutScreen` wydziela logikę ekranu poza komponent.
- Debounce 500 ms i batchowe `updateSets` ograniczają liczbę zapisów.
- `filterExercises` jest czystą, testowalną funkcją i obsługuje diakrytykę oraz aliasy PL/EN.
- Model domenowy jest znormalizowany i przygotowany do późniejszego SQLite.
- Pola zaawansowane (`rpe`, `distance`, `durationSec`, `note`) są opcjonalne.
- `strict: true`, alias `@/*`, `typedRoutes` i React Compiler są dobrymi decyzjami dla tego etapu.

## React Compiler

`app.json` ma włączone `experiments.reactCompiler`. Brak ręcznego `useMemo`/`useCallback` nie jest sam w sobie problemem. Compiler nie rozwiązuje jednak problemów poprawności danych, architektury list, odświeżania po focusie ani duplikacji stylów.

## Problemy krytyczne

### K1 — Workout wymaga `id`, którego zakładka nie przekazuje

**Pliki:** `app/_layout.tsx`, `app/workout/index.tsx`

`WorkoutScreen` odczytuje `id` z parametrów i bez niego pokazuje „Nie znaleziono dnia treningowego”. Jednocześnie `workout/index` jest stałą zakładką, która nie przekazuje `id`. Kliknięcie zakładki zawsze prowadzi więc do pustego stanu błędu. Ekran miesza rolę aktywnego treningu z rolą szczegółów dnia, co narusza SRP.

**Rozwiązania:**

1. Zalecane: `app/workout/[id].tsx` dla szczegółów i osobny ekran/launcher zakładki Workout.
2. Minimalne: ukryć Workout z Tabs przez `href: null` i otwierać go tylko z Historii.
3. Doraźne: dla braku `id` pokazywać sensowny stan pusty zamiast błędu.

### K2 — Zepsuty `reset-project`

**Plik:** `package.json`

Skrypt wskazuje `node ./scripts/reset-project.js`, ale plik istnieje tylko w `app-example/scripts/`. `npm run reset-project` zakończy się błędem.

**Rozwiązania:** usunąć skrypt wraz z `app-example`; poprawić ścieżkę; albo przenieść skrypt do głównego `scripts/`.

### K3 — Puste menu

**Plik:** `app/menu/index.tsx`

Ekran renderuje pusty `Pressable`, a `_layout.tsx` przechwytuje `tabPress` i otwiera modal. Plik jest martwy i mylący.

**Rozwiązania:** usunąć ekran i wydzielić modal do komponentu; zrobić z menu prawdziwy ekran; tymczasowo dodać etykietę, choć nie rozwiązuje to problemu architektury.

### K4 — Tymczasowe ID serii i brak delete

**Pliki:** `src/hooks/use-workout-screen.ts`, `src/repositories/workout.repository.ts`

Nowe serie otrzymują `new-${workoutExerciseId}-${index}` i po debounce są zapisywane do AsyncStorage. Po ponownym wejściu tymczasowe ID staje się trwałe, a kolejne serie mogą kolidować. `updateSets` robi upsert, ale nie usuwa serii.

**Rozwiązania:**

1. Generować prawdziwe ID przez `expo-crypto` `randomUUID()`.
2. Nie zapisywać pustych szkiców, dopóki użytkownik nie wprowadzi danych.
3. Dodać `addSet`, `deleteSet` i zapis pełnego zbioru serii danego ćwiczenia.

## Problemy wysokie

### W1 — Duplikacja typów

`SetType` występuje w modelu, hooku, `workout-set-row.tsx` i modalu. Jednostki wagi oraz typ targetu modali są również powielone. To łamie DRY/SSOT.

**Rozwiązania:** importować uniony z `WorkoutSet`; wydzielić `WeightUnit` i `SetSelectTarget`; stworzyć jeden moduł typów workout.

### W2 — `FlatList` w `ScrollView`

**Plik:** `app/exercises/index.tsx`

`FlatList` znajduje się wewnątrz poziomego `ScrollView`, przez co wirtualizacja może zostać utracona, a lista będzie renderować wszystkie elementy. Przy rosnącej bibliotece ćwiczeń pogorszy to pamięć i wydajność.

**Rozwiązania:** jeden właściwie zorganizowany `FlatList` z nagłówkiem; świadomie użyć `.map()` dla małego MVP; zmienić tabelę na responsywne karty.

### W3 — Brak odświeżania po focusie

**Pliki:** `app/history/index.tsx`, `app/exercises/index.tsx`

Dane są ładowane tylko w `useEffect(..., [])`. Tab screens pozostają zamontowane, więc po powrocie użytkownik może nie zobaczyć nowych danych.

**Rozwiązania:** `useFocusEffect`; później store Zustand/Context; przejściowo parametr odświeżenia w nawigacji.

### W4 — Brak centralnej palety

Kolory są rozsiane po `app.style.ts`, `layout.style.ts`, stylach komponentów i inline JSX. Roadmap słusznie wskazuje `src/theme/colors.ts`.

**Rozwiązania:** semantyczne tokeny kolorów; pełne tokeny `colors/radius/typography`; wykorzystać i uporządkować theme z `app-example`.

### W5 — AsyncStorage bez wspólnego helpera i walidacji

`exercise.repository.ts` i `workout.repository.ts` powielają get-or-seed. `JSON.parse(...) as T` nie zapewnia walidacji runtime, więc migracja modelu może spowodować błędy.

**Rozwiązania:** generyczny `loadOrSeed`; schematy Zod; fabryka kolekcji `getAll/saveAll/resetToSeed`.

### W6 — Root layout miesza routing i menu

`app/_layout.tsx` zawiera definicję Tabs, stan modala, nawigację i UI menu.

**Rozwiązania:** `AppMenuModal`; prawdziwa trasa menu; konfiguracja pozycji menu jako danych.

## Problemy średnie

- **Język UI:** miks PL/EN mimo decyzji roadmapy o polskim MVP. Ujednolicić na PL; opcjonalnie wydzielić stałe tekstów bez wdrażania pełnego i18n.
- **`any`:** `details.exercises.map((exercise: any) => ...)` w strict TypeScript. Usunąć adnotację albo użyć znanego typu; włączyć `no-explicit-any`.
- **Duplikacja `SET_TYPE_LABEL`:** umieścić mapę w jednym module lub słowniku tekstów.
- **Inline styles:** przenieść style ekranów do `*.style.ts`; pozostawić inline tylko dla wartości dynamicznych.
- **Komentarze-dziennik:** usunąć zakomentowany kod i komentarze opisujące oczywiste działanie; zachować wyłącznie komentarze wyjaśniające „dlaczego”.
- **Chip selectors:** cztery podobne bloki w `exercise-form.tsx` wydzielić do `ChipSelector` single/multi.
- **Podwójny nagłówek Workout:** `Screen title` oraz drugi tytuł daty powinny zostać ujednolicone przez `Screen`/slot nagłówka.
- **Rozjazd modeli:** `SetForm`, `WorkoutSet` i `WorkoutSetRowData` są uzasadnione jako warstwa formularza, ale mapper `toWorkoutSet` nie zachowuje pól `rpe`, `note`, `distance` i `durationSec`, więc mogą one zginąć przy zapisie.

## Problemy niskie

- Usunąć `app-example/` po wyjęciu ewentualnie potrzebnych elementów.
- `Screen.tsx` łamie ustaloną konwencję kebab-case.
- Poprawić literówki i polskie znaki w etykietach/danych.
- Dodać stany loading/error i `.catch` w ekranach; docelowo ErrorBoundary.
- Ustalić regułę default vs named exports.
- Ujednolicić `index` serii w seedach: obecnie występują duplikaty `index: 0`.

## Ocena zasad

| Zasada       | Ocena                                                                              |
| ------------ | ---------------------------------------------------------------------------------- |
| KISS         | Dobra; rozwiązania są adekwatne do MVP.                                            |
| DRY          | Do poprawy: typy, storage, kolory, chipy i etykiety.                               |
| SOLID/SRP    | Do poprawy: RootLayout i dualna rola Workout.                                      |
| Clean Code   | Średnia: dobry podział, ale `any`, komentarze-dziennik i niespójne style.          |
| React Native | Do poprawy: lista w ScrollView, brak focus refresh i loaderów.                     |
| Expo Router  | Dobry fundament, ale potrzebna trasa dynamiczna `[id]` i uporządkowane Stack/Tabs. |

## Roadmapa i product-context

Roadmapa jest częściowo nieaktualna: `use-workout-screen.ts` nie jest pusty, a zapis serii już istnieje. Należy zaktualizować opis stanu.

Zgodność z product-context jest dobra w obszarze offline-first, opcjonalnych pól i modelu relacyjnego. Największe ryzyko dla założeń produktu dotyczy poprawności danych: K4 oraz brak walidacji storage.

## Zalecana kolejność

1. Naprawić K2, K3 i usunąć `app-example`.
2. Rozdzielić trasę Workout (`[id]` lub ukrycie zakładki).
3. Naprawić generowanie ID i CRUD serii.
4. Ujednolicić typy oraz mappery.
5. Dodać `useFocusEffect`.
6. Wprowadzić `colors.ts` przed kolejnymi ekranami.
7. Wydzielić helper storage i dodać walidację.
8. Uporządkować listy, menu, język, style i komentarze.
9. Dodać testy `filterExercises`, debounce, mapperów i repozytoriów.
