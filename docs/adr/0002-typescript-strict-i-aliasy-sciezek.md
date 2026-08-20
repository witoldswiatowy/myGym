# ADR 0002: TypeScript w trybie strict i aliasy ścieżek

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

Model danych aplikacji jest relacyjny i będzie rósł (ćwiczenia, mięśnie, dni
treningowe, serie, supersety). Wiele encji łączy się przez identyfikatory.
Błędy typu „literówka w nazwie pola” albo „undefined zamiast liczby” są w takim
modelu kosztowne. Zespół ma tło obiektowe (Java/Angular), gdzie statyczne typy
są standardem i pomagają w refaktorach.

## Decyzja

Włączamy **TypeScript w trybie `strict`** i rozszerzamy bazową konfigurację Expo
(zob. [`tsconfig.json`](../../tsconfig.json)):

```jsonc
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

- **`strict: true`** — pełny zestaw rygorystycznych reguł (m.in. `strictNullChecks`).
- **Alias `@/*`** mapowany na katalog główny — importy bezwzględne zamiast
  kruchych ścieżek względnych, np. `@/src/models/Exercise` zamiast `../../models/Exercise`.
- Modele domenowe opisujemy jako `interface` / `type` w [`src/models`](../../src/models).

## Konsekwencje

### Pozytywne

- Wczesne wykrywanie błędów (null/undefined, niezgodność kształtu danych).
- Czytelne, stabilne importy odporne na przenoszenie plików.
- Lepsze podpowiedzi IDE i bezpieczniejsze refaktory.

### Negatywne / kompromisy

- Więcej „ceremonii” typowej — czasem trzeba jawnie mapować typy
  (np. model formularza ze stringami ↔ model domenowy z liczbami, zob. [ADR 0006](0006-logika-ekranow-w-custom-hookach.md)).
- `strictNullChecks` wymusza obsługę przypadków `null`/`undefined`, co bywa
  dodatkową pracą przy polach opcjonalnych.
