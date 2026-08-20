# Naruszenia SOLID w repozytorium myGym

> Dokument analityczny. Wskazuje miejsca w kodzie, które łamią (lub naginają)
> zasady SOLID, wyjaśnia **dlaczego** oraz proponuje kierunek naprawy.
> Część z tych kompromisów jest **świadoma i udokumentowana w ADR** — zaznaczam to
> przy konkretnych punktach. Celem nie jest „naprawić wszystko za wszelką cenę",
> lecz mieć mapę długu architektonicznego.

## Legenda priorytetów

- 🔴 **Wysoki** — realnie utrudnia rozwój/testowanie, warto zaplanować refaktor.
- 🟡 **Średni** — psuje się przy każdej rozbudowie danej funkcji.
- 🟢 **Niski / informacyjny** — kosmetyka lub ryzyko na przyszłość.

## Podsumowanie

| Zasada                        | Najważniejsze naruszenie                                                                | Priorytet |
| ----------------------------- | --------------------------------------------------------------------------------------- | --------- |
| **S** – Single Responsibility | `ExercisesScreen` jako „bóg-komponent" (dane + słowniki + sort + tworzenie modelu + UI) | 🔴        |
| **O** – Open/Closed           | Komparator sortowania jako `if/else if` po `sortKey`                                    | 🟡        |
| **L** – Liskov Substitution   | Brak hierarchii — zamiast tego zduplikowane, „przypadkiem zgodne" typy serii            | 🟢        |
| **I** – Interface Segregation | Komponenty dostają „grube" propsy i pełne settery stanu                                 | 🟡        |
| **D** – Dependency Inversion  | Twarda zależność od konkretnych repozytoriów / `AsyncStorage` / plików `*.data.ts`      | 🔴        |

---

## S — Single Responsibility Principle

> Moduł powinien mieć jeden powód do zmiany.

~~### S1. 🔴 `ExercisesScreen` robi „wszystko naraz"~~ **DONE**

**Lokalizacja:** [app/exercises/index.tsx](../app/exercises/index.tsx)

Komponent ekranu jednocześnie:

- ładuje dane z repozytorium ([linia 38](../app/exercises/index.tsx#L38)),
- buduje 7 słowników lookup (`muscleNameById`, `muscleNameEnById`,
  `muscleGroupIndexById`, `muscleGroupIdByMuscleId`, `muscleColorById`,
  `equipmentNameById`, `tagNameById`) — [linie 40–73](../app/exercises/index.tsx#L40-L73),
- trzyma logikę sortowania ([handleSort, linia 76](../app/exercises/index.tsx#L76))
  i cały komparator ([sortedExercises, linie 95–145](../app/exercises/index.tsx#L95-L145)),
- generuje `id` i buduje model domenowy `Exercise`
  ([handleSaveExercise, linie 143–171](../app/exercises/index.tsx#L143-L171)),
- obsługuje reset danych do seeda ([linie 210–218](../app/exercises/index.tsx#L210-L218)),
- renderuje widok.

**Dlaczego łamie SRP:** ma wiele niezależnych powodów do zmiany (zmiana źródła
danych, zmiana reguł sortowania, zmiana sposobu generowania `id`, zmiana UI).

**Niespójność z ADR:** [ADR 0006](adr/0006-logika-ekranow-w-custom-hookach.md)
mówi, że logika ekranu ma trafiać do **custom hooka** (jak `use-workout-screen`),
a komponent ma być prezentacyjny. Tu hooka brakuje — cała logika jest „inline".

**Propozycja:** wydzielić `use-exercises-screen.ts` (ładowanie, stan, słowniki,
sortowanie) oraz osobny moduł sortowania; komponent zostawić jako widok.

### S2. 🟡 `WorkoutRepository` miesza dostęp do danych z logiką zapytań i prezentacją

**Lokalizacja:** [src/repositories/workout.repository.ts](../src/repositories/workout.repository.ts)

Oprócz czystego odczytu/zapisu repozytorium:

- filtruje i sortuje („logika zapytań") —
  [getExercisesForTrainingDay, linie 50–60](../src/repositories/workout.repository.ts#L50-L60),
  [getSetsForWorkoutExercise, linie 62–70](../src/repositories/workout.repository.ts#L62-L70),
- agreguje i **wzbogaca dane o nazwy ćwiczeń** (łączenie z `ExerciseRepository`
  i budowa `name`) —
  [getWorkoutDetailsWithExerciseInfo, linie 121–166](../src/repositories/workout.repository.ts#L121-L166).

**Dlaczego łamie SRP:** „skąd biorę dane" i „jak je zestawiam pod konkretny ekran"
to dwa różne powody do zmiany. `...WithExerciseInfo` to de facto warstwa
prezentacji/serwis aplikacyjny ubrany w repozytorium.

**Niespójność z ADR:** [ADR 0004](adr/0004-wzorzec-repository.md) sam wymienia to
w „Konsekwencjach negatywnych" jako świadomy kompromis (brak zapytań w AsyncStorage).
Punkt zostaje jako dług do rozważenia (np. osobny `WorkoutService`/selektory).

### S3. 🟡 `use-workout-screen` łączy mapowanie, stan UI i I/O

**Lokalizacja:** [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts)

W jednym module: konwersja formularz↔domena
([mapSet/mapSetOrCreate/toWorkoutSet, linie 21–66](../src/hooks/use-workout-screen.ts#L21-L66)),
stan modali wyboru (`typeSelectTarget`, `weightUnitSelectTarget`), ładowanie danych
oraz zapis z debounce.

**Propozycja:** wyciągnąć mapowanie do `set-form.mapper.ts` (czyste funkcje,
łatwe do testów); hook orkiestruje stan i I/O.

### S4. 🟢 Generowanie `id` wewnątrz handlera UI

**Lokalizacja:** [handleSaveExercise, linie 143–171](../app/exercises/index.tsx#L143-L171)

Tworzenie identyfikatora (`baseId` + `Date.now().toString(36)`) to reguła domenowa
zaszyta w komponencie. Powinna trafić do warstwy domeny/repozytorium
(np. `ExerciseRepository.create(values)`), aby UI nie znał strategii ID.

---

## O — Open/Closed Principle

> Otwarte na rozszerzanie, zamknięte na modyfikację.

### O1. 🟡 Komparator sortowania wymaga modyfikacji przy każdym nowym kluczu

**Lokalizacja:** [sortedExercises, linie 95–145](../app/exercises/index.tsx#L95-L145)

Sortowanie to rozgałęzienie `if (sortKey === "primaryMuscle") … else if
("equipment") … else if ("tags") …`. Dodanie nowej kolumny = ingerencja w istniejącą
funkcję.

**Propozycja:** mapa strategii `Record<SortKey, (a, b) => number>`; dodanie klucza
= dodanie wpisu, bez zmiany istniejącego kodu.

### O2. 🟡 Etykiety/typy serii zduplikowane w wielu miejscach

**Lokalizacja:**
[SET_TYPE_LABEL w app/workout/index.tsx (linie 12–17)](../app/workout/index.tsx#L12-L17)
oraz [SET_TYPE_LABEL w workout-set-type-modal.tsx (linie 8–13)](../src/components/workout/workout-set-type-modal.tsx#L8-L13).

Dodanie nowego typu serii (`SetType`) wymaga zmian w kilku plikach (etykiety,
opcje, mapowania w hooku). Brak jednego „źródła prawdy".

**Propozycja:** jeden moduł `set-type.ts` z listą typów + etykietami; reszta importuje.

### O3. 🟢 Słownik aliasów językowych wbity w moduł logiki

**Lokalizacja:** [CROSS_LANG_ALIASES, linie 9–22](../src/search/filter-exercises.ts#L9-L22)

Rozszerzenie wyszukiwania o kolejne synonimy/języki wymaga edycji kodu funkcji.
**Propozycja:** przenieść do danych/konfiguracji i wstrzykiwać przez `FilterOptions`.

---

## L — Liskov Substitution Principle

> Podtyp musi być w pełni zastępowalny za typ bazowy.

### L1. 🟢 Brak hierarchii — ryzyko „przypadkowej zgodności" typów

W projekcie nie ma dziedziczenia klas ani implementacji wspólnych interfejsów,
więc klasyczne naruszenie LSP **nie występuje**. Warto jednak odnotować ryzyko:
kształt pojedynczej serii jest zdefiniowany **niezależnie** w trzech miejscach —
[`WorkoutSet`](../src/models/WorkoutSet.ts),
[`SetForm` w use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L9-L19) oraz
[`WorkoutSetRowData` w workout-set-row.tsx](../src/components/workout/workout-set-row.tsx#L8-L15).

Dzięki strukturalnemu typowaniu TS „pasują do siebie" przez przypadek, a nie przez
wspólny kontrakt. Rozjazd jednej definicji złamie zastępowalność **po cichu**
(bez błędu kompilacji w oczywistym miejscu). **Propozycja:** wspólny typ bazowy
i typy pochodne (`Pick`/`Omit`) zamiast trzech niezależnych deklaracji.

---

## I — Interface Segregation Principle

> Nie zmuszaj klienta do zależności od rzeczy, których nie używa.

### I1. 🟡 `ExerciseTableRow` wymaga kompletu czterech słowników

**Lokalizacja:** [typ propsów, linie 5–11](../src/components/exercises/exercise-table-row.tsx#L5-L11)

Komponent przyjmuje `muscleNameById`, `muscleColorById`, `equipmentNameById`,
`tagNameById`. Każdy wywołujący musi dostarczyć wszystkie cztery (prop drilling).
„Gruby" interfejs wejściowy zwiększa sprzężenie z miejscem wywołania.

**Propozycja:** przekazać jeden, gotowy do renderu obiekt wiersza (view-model)
przygotowany wyżej, zamiast surowych słowników do rozwiązywania w komponencie.

### I2. 🟡 Modale dostają pełny setter stanu zamiast wąskiego callbacku

**Lokalizacja:**
[WorkoutSetTypeModalProps](../src/components/workout/workout-set-type-modal.tsx#L15-L21),
[WorkoutWeightUnitModalProps](../src/components/workout/workout-weight-unit-modal.tsx#L9-L14)

Propsy zawierają `React.Dispatch<React.SetStateAction<…>>`. Komponent dostaje
**całą** możliwość sterowania stanem rodzica, choć potrzebuje jedynie „zamknij"
i „wybrano opcję". To wyciek implementacji stanu rodzica do dziecka.

**Propozycja:** wąski kontrakt: `onClose: () => void` + `onSelect: (v) => void`.

### I3. 🟢 Repozytoria jako monolityczne obiekty (read + write razem)

**Lokalizacja:** [WorkoutRepository](../src/repositories/workout.repository.ts#L39)

Konsument tylko do odczytu (np.
[HistoryScreen](../app/history/index.tsx#L11) używa wyłącznie `getTrainingDays`)
„widzi" także metody zapisu/`resetToSeed`. Brak rozdzielenia ról (np. odczyt vs zapis).

---

## D — Dependency Inversion Principle

> Moduły wysokopoziomowe nie powinny zależeć od niskopoziomowych — oba od abstrakcji.

### D1. 🔴 Ekrany i hooki zależą od konkretnych repozytoriów (brak abstrakcji/DI)

**Lokalizacja:**
[ExercisesScreen → ExerciseRepository](../app/exercises/index.tsx#L14),
[HistoryScreen → WorkoutRepository](../app/history/index.tsx#L3),
[use-workout-screen → WorkoutRepository](../src/hooks/use-workout-screen.ts#L2-L5)

Repozytoria to **statyczne obiekty** importowane bezpośrednio. Nie ma interfejsu
(`ExerciseRepository` jako typ) ani wstrzykiwania zależności, więc wysokopoziomowa
logika jest „przyspawana" do konkretnej implementacji.

**Skutek:** utrudnione mockowanie w testach i podmiana implementacji.
**Niespójność z ADR:** [ADR 0004](adr/0004-wzorzec-repository.md) wprost wskazuje
to jako kompromis i sugeruje rozważenie interfejsu, gdy pojawi się potrzeba testów.
**Propozycja:** interfejsy repozytoriów + przekazywanie przez parametr/Context.

### D2. 🔴 UI sięga bezpośrednio do plików `*.data.ts`, omijając warstwę danych

**Lokalizacja:**
[ExercisesScreen — import EQUIPMENT/MUSCLE_GROUPS/MUSCLES/TAGS, linie 8–11](../app/exercises/index.tsx#L8-L11),
[AddExerciseModal — import EQUIPMENT/MUSCLES/TAGS, linie 2–4](../src/components/exercises/add-exercise-modal.tsx#L2-L4)

Dane referencyjne (mięśnie, sprzęt, tagi, grupy) są importowane wprost z modułów
danych. Dla ćwiczeń istnieje repozytorium, ale dla słowników — nie; UI zależy od
konkretnego źródła.

**Niespójność z ADR:** [ADR 0004](adr/0004-wzorzec-repository.md) mówi, że **cały**
dostęp do danych idzie przez repozytoria. **Propozycja:** dodać repozytoria/serwisy
słowników (np. `ReferenceDataRepository`) i pobierać dane przez nie.

### D3. 🟡 `WorkoutRepository` zależy bezpośrednio od `ExerciseRepository`

**Lokalizacja:**
[import, linia 8](../src/repositories/workout.repository.ts#L8),
[użycie w getWorkoutDetailsWithExerciseInfo, linie 121–166](../src/repositories/workout.repository.ts#L121-L166)

Zależność moduł→moduł na konkretach, nie przez abstrakcję — utrudnia testowanie i
zwiększa sprzężenie między repozytoriami.

### D4. 🟡 Twarda zależność od `AsyncStorage` i `console`

**Lokalizacja:**
[exercise.repository.ts](../src/repositories/exercise.repository.ts#L3),
[workout.repository.ts](../src/repositories/workout.repository.ts#L10)

Repozytoria bezpośrednio wołają `AsyncStorage` oraz `console.error/console.log`.
Mechanizm trwałości jest dobrze ukryty przed resztą aplikacji (plus), ale wewnątrz
brak abstrakcji `KeyValueStore`/loggera utrudnia podmianę (np. na SQLite) i testy.
**Propozycja:** cienki interfejs storage + wstrzykiwany logger.

---

## Co jest zrobione dobrze (świadomie nie ruszamy)

- **Wzorzec Repository** izoluje `AsyncStorage` od UI dla głównych encji
  ([ADR 0004](adr/0004-wzorzec-repository.md)) — kierunek prawidłowy.
- **Logika ekranu treningu w hooku** `use-workout-screen`
  ([ADR 0006](adr/0006-logika-ekranow-w-custom-hookach.md)) — dobre rozdzielenie
  widoku od logiki (warto powtórzyć ten wzorzec na ekranie ćwiczeń — patrz S1).
- **Czyste funkcje wyszukiwania** w
  [filter-exercises.ts](../src/search/filter-exercises.ts) — testowalne w izolacji.
- **`useDebouncedValue`** to mały, jednoodpowiedzialnościowy, reużywalny hook —
  wzorcowy przykład SRP.

## Rekomendowana kolejność działań

1. **D2** — przenieść dostęp do słowników za repozytorium/serwis (szybkie, spójne z ADR 0004).
2. **S1** — wydzielić `use-exercises-screen` + moduł sortowania (odciąża „bóg-komponent").
3. **D1** — wprowadzić interfejsy repozytoriów i DI (odblokowuje testy jednostkowe).
4. **O1 / O2** — strategie sortowania + jedno źródło typów serii.
5. **I2 / I1** — zwęzić kontrakty propsów (callbacki zamiast setterów, view-model wiersza).
6. Pozostałe (**S2/S3/S4, O3, D3/D4, L1**) — adresować przy okazji refaktorów danych funkcji.

> Uwaga: część punktów to świadomie zaakceptowane kompromisy MVP opisane w ADR.
> Przed większym refaktorem warto zaktualizować/rozszerzyć odpowiednie ADR.
