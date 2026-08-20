# ADR 0004: Izolacja dostępu do danych wzorcem Repository

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

Warstwą trwałości w MVP jest AsyncStorage ([ADR 0003](0003-offline-first-z-asyncstorage.md)),
ale jest to wybór taktyczny — w przyszłości realne jest przejście na SQLite lub
inne rozwiązanie. Gdyby komponenty UI i hooki odwoływały się bezpośrednio do
AsyncStorage, taka migracja oznaczałaby zmiany rozsiane po całej aplikacji.
Zespół z tłem Java/Angular zna i ceni wzorzec repozytorium (odpowiednik
`@Repository` / serwisu danych).

## Decyzja

Cały dostęp do danych przechodzi przez **moduły-repozytoria** udostępniane jako
obiekty z metodami asynchronicznymi:

- [`ExerciseRepository`](../../src/repositories/exercise.repository.ts) — `getAll`,
  `add`, `resetToSeed`.
- [`WorkoutRepository`](../../src/repositories/workout.repository.ts) — `getTrainingDays`,
  `getExercisesForTrainingDay`, `getSetsForWorkoutExercise`, `updateSet`,
  `updateSets`, `getWorkoutDetails`.

Zasady:

- UI i custom hooki **nie wołają AsyncStorage bezpośrednio** — korzystają wyłącznie
  z repozytoriów.
- Repozytoria zwracają **modele domenowe** z [`src/models`](../../src/models).
- Szczegóły trwałości (klucze, serializacja JSON, seedowanie) są ukryte wewnątrz
  repozytorium.

## Konsekwencje

### Pozytywne

- Jeden punkt zmiany przy migracji storage (np. AsyncStorage → SQLite).
- Czytelny podział: UI = prezentacja, repozytorium = dane.
- Łatwiejsze testowanie logiki danych w izolacji.

### Negatywne / kompromisy

- Dodatkowa warstwa pośrednia.
- Obecnie repozytoria realizują też **filtrowanie i sortowanie** (np. po `order`,
  `index`) — to mieszanie odpowiedzialności „dostęp do danych” z „logiką zapytań”,
  wynikające z braku zapytań w AsyncStorage.
- Repozytoria są **statycznymi obiektami** (brak interfejsów / wstrzykiwania
  zależności). Jeśli pojawi się potrzeba mockowania w testach, warto rozważyć
  wprowadzenie abstrakcji/interfejsu.
