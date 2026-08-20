# ADR 0003: Trwałość offline-first oparta o AsyncStorage

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

Jednym z kluczowych założeń produktu jest **offline-first** — użytkownik loguje
trening na siłowni, gdzie sieć bywa zawodna, a dane muszą być natychmiast dostępne
i pod jego kontrolą (zob. [docs/product-context.md](../product-context.md)). W fazie
MVP nie ma backendu ani kont użytkowników. Potrzebny jest prosty, lokalny mechanizm
trwałości danych: ćwiczeń, dni treningowych i serii.

## Decyzja

Jako warstwę trwałości wybieramy **`@react-native-async-storage/async-storage`**
(klucz–wartość, serializacja JSON). Wprowadzamy spójne wzorce użycia:

- **Wzorzec „get-or-seed”** — przy pierwszym odczycie, jeśli pod kluczem nic nie ma,
  zapisujemy dane startowe (seed) i je zwracamy. Zob. `getOrSeed` w
  [`src/repositories/workout.repository.ts`](../../src/repositories/workout.repository.ts).
- **Wersjonowane klucze** — `exercises.v1`, `training-days.v1`, `workout-exercises.v1`,
  `workout-sets.v1`. Sufiks `.vN` daje furtkę na przyszłe zmiany formatu.
- **Dane seed w kodzie** — pliki [`src/data/*.data.ts`](../../src/data) zawierają
  bazę startową (ćwiczenia, mięśnie, przykładowe dni). Dzięki temu aplikacja jest
  użyteczna „od pierwszego uruchomienia”, bez kreatora konfiguracji.
- **Cała kolekcja zapisywana naraz** — operacje typu `updateSets` odczytują kolekcję,
  modyfikują w pamięci (np. przez `Map` po `id`) i zapisują z powrotem.

## Konsekwencje

### Pozytywne

- Pełne działanie offline i dane lokalnie u użytkownika.
- Zero infrastruktury serwerowej — niższy koszt i złożoność MVP.
- Natychmiastowa użyteczność dzięki danym seed.

### Negatywne / kompromisy

- **Brak zapytań relacyjnych** — filtrowanie i sortowanie odbywa się w pamięci
  (zob. składanie `setsByExerciseId` w `getWorkoutDetails`).
- **Zapis całej kolekcji** jest nieoptymalny przy dużych zbiorach danych.
- **Brak prawdziwych migracji** — mamy tylko wersjonowanie kluczy; zmiana kształtu
  danych będzie wymagać dopisania logiki migracji lub nowej wersji klucza.
- **Brak synchronizacji** między urządzeniami (świadomy non-goal MVP).

## Rozważane alternatywy

- **expo-sqlite / SQLite** — realne zapytania i relacje; odrzucone na rzecz prostoty
  MVP, ale to naturalna ścieżka migracji, gdy dane urosną. Wzorzec Repository
  ([ADR 0004](0004-wzorzec-repository.md)) ma tę zmianę ułatwić.
- **WatermelonDB / MMKV** — wydajniejsze, ale wprowadzają dodatkową złożoność
  nieuzasadnioną na tym etapie.
