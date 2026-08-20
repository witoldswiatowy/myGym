# ADR 0008: Dwujęzyczne, tolerancyjne wyszukiwanie ćwiczeń

- **Status:** Zaakceptowany
- **Data:** 2026-06-30
- **Decydenci:** zespół myGym

## Kontekst

Użytkownicy są polskojęzyczni, ale terminologia treningowa jest często angielska
(„shoulders”, „chest”, „lats”) — ta sama partia mięśniowa bywa nazywana na kilka
sposobów w obu językach. Ćwiczenia mają w modelu `name`, `nameEn` oraz `aliases`.
Wyszukiwarka powinna być **tolerancyjna**: ignorować polskie znaki diakrytyczne i
działać niezależnie od języka wpisanego hasła. Całość ma działać offline
([ADR 0003](0003-offline-first-z-asyncstorage.md)).

## Decyzja

Implementujemy **własny moduł filtrujący** po stronie klienta:
[`src/search/filter-exercises.ts`](../../src/search/filter-exercises.ts).

Mechanizm:

- **Normalizacja tekstu** — `NFD` + usunięcie znaków diakrytycznych
  (`/[\u0300-\u036f]/g`), `toLowerCase`, `trim`. Dzięki temu „barki” == „bárki” == „BARKI”.
- **Budowanie tekstu wyszukiwania** dla ćwiczenia z: `name`, `nameEn`, `aliases`
  oraz nazw mięśnia w wersji PL i EN.
- **Słownik aliasów międzyjęzykowych** `CROSS_LANG_ALIASES`
  (np. `barki ↔ shoulders / delts / deltoids`, `klatka ↔ chest / pecs`) i
  **ekspansja zapytania** — wpisanie „shoulders” znajdzie też ćwiczenia opisane „barki”.
- **Filtrowanie w pamięci** na liście ćwiczeń; wejście (`query`) jest debounce'owane
  na poziomie hooka ([ADR 0006](0006-logika-ekranow-w-custom-hookach.md)).

## Konsekwencje

### Pozytywne

- Tolerancyjne, dwujęzyczne wyszukiwanie bez połączenia z siecią.
- Brak zależności od zewnętrznych usług/bibliotek wyszukiwania.
- Pełna kontrola nad regułami dopasowania (aliasy, diakrytyki).

### Negatywne / kompromisy

- **Ręczne utrzymanie** słownika `CROSS_LANG_ALIASES` — nowe synonimy trzeba dopisywać.
- Brak **fuzzy matchingu** / tolerancji literówek (dopasowanie po `includes`).
- Złożoność **liniowa** względem liczby ćwiczeń — wystarczająca dla setek pozycji,
  ale nie dla bardzo dużych zbiorów.

## Rozważane alternatywy

- **Biblioteka fuzzy (np. Fuse.js)** — dałaby tolerancję literówek i ranking trafności;
  możliwa do wprowadzenia później, jeśli pojawi się taka potrzeba.
- **Wyszukiwanie po stronie bazy (np. SQLite FTS)** — sensowne dopiero po migracji
  trwałości z AsyncStorage na SQLite.
