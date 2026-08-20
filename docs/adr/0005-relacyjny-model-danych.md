# ADR 0005: Znormalizowany, relacyjny model danych

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

Kontekst produktowy stawia kilka wymagań wobec modelu danych
(zob. [docs/product-context.md](../product-context.md)):

- analityka zaawansowana **bez obciążania początkujących**,
- pola zaawansowane mają być **opcjonalne**,
- wyraźny **podział między planem a wykonanym treningiem**,
- poprawne modelowanie ćwiczeń złożonych (np. supersety), nie „na skróty”.

## Decyzja

Stosujemy **znormalizowany, relacyjny model** — osobne encje powiązane przez
identyfikatory, zamiast zagnieżdżonych, zduplikowanych struktur. Encje w
[`src/models`](../../src/models):

- **Słowniki:** `Exercise`, `Muscle`, `MuscleGroup`, `Equipment`, `Tag`.
- **Plan treningu:** `TrainingDay`, `WorkoutExercise` (łącznik dzień ↔ ćwiczenie,
  z polami `order`, `supersetGroupId`), `Superset`.
- **Wykonanie:** `WorkoutSet` (z `index`, `type`, `done` oraz opcjonalnymi metrykami).

Kluczowe zasady:

- **Referencje przez `*Id`** — np. `WorkoutExercise.exerciseId`,
  `WorkoutSet.workoutExerciseId`, `Exercise.primaryMuscleId`.
- **Rozdział plan ↔ wykonanie** — `TrainingDay`/`WorkoutExercise` opisują plan,
  a wykonanie wyraża `WorkoutSet` (m.in. flaga `done`).
- **Pola zaawansowane jako opcjonalne i „future-proof”** — w `WorkoutSet` opcjonalne
  są `weight`, `reps`, `rpe`, `note`, `distance`, `durationSec`. Początkujący ich
  nie wypełnia; analityka może z nich skorzystać później.
- **Wartości domenowe jako unie literałów** — np. `type: "warmup" | "working" | "drop" | "failure"`,
  `weightUnit: "kg" | "lb"`.

## Konsekwencje

### Pozytywne

- Elastyczność i gotowość pod zaawansowaną analitykę (objętość, progres, intensywność).
- Czysty rozdział planu od wykonania zgodny z założeniami produktu.
- Stopniowe odkrywanie złożoności — pola opcjonalne nie przytłaczają początkującego.
- Brak duplikacji danych (jedno źródło prawdy dla ćwiczeń, mięśni itd.).

### Negatywne / kompromisy

- **Łączenie (join) odbywa się w pamięci** — np. `getWorkoutDetails` ręcznie buduje
  mapę `setsByExerciseId`, scalając serie z ćwiczeniami.
- Więcej kodu do złożenia spójnego widoku ekranu niż przy modelu zagnieżdżonym.
- Spójność referencji (`*Id`) nie jest egzekwowana przez bazę — odpowiada za nią
  kod aplikacji.
