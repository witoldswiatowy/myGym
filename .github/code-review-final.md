# 🏁 Code Review — myGym (wersja finalna, scalona)

> Konsolidacja trzech iteracji przeglądu ([code-review.md](code-review.md), [code-review-2.md](code-review-2.md), [code-review3.md](code-review3.md)) w jeden spójny dokument.
> **Perspektywa:** senior/architekt React Native + Expo, w roli mentora dla osoby uczącej się TS/RN (tło Java/Angular).
> **Priorytety:** 1) poprawność aplikacji → 2) edukacja („dlaczego") → 3) adekwatność wzorca do poziomu.
> **Charakter:** wyłącznie analiza — **żaden plik produkcyjny nie został zmodyfikowany**.
> **Data:** 2026-06-22
>
> Wszystkie defekty oznaczone jako 🔴/🟠 zostały **zweryfikowane wprost w kodzie**.

---

## Spis treści

1. [Streszczenie (TL;DR)](#streszczenie-tldr)
2. [Mocne strony — zachować](#mocne-strony--zachować)
3. [Ważny kontekst: React Compiler](#ważny-kontekst-react-compiler)
4. [Legenda priorytetów](#legenda-priorytetów)
5. [🔴 Krytyczne (defekty poprawności)](#-krytyczne-defekty-poprawności)
6. [🟠 Wysokie (dług, który się propaguje)](#-wysokie-dług-który-się-propaguje)
7. [🟡 Średnie (spójność / czytelność)](#-średnie-spójność--czytelność)
8. [🟢 Niskie (kosmetyka / porządki)](#-niskie-kosmetyka--porządki)
9. [Zgodność z zasadami](#zgodność-z-zasadami)
10. [Zgodność z roadmapą i product-context](#zgodność-z-roadmapą-i-product-context)
11. [Rekomendowana kolejność działań](#rekomendowana-kolejność-działań)
12. [Mentorska puenta](#mentorska-puenta)

---

## Streszczenie (TL;DR)

Projekt jest **zdrowy jak na MVP w budowie** i widać świadome decyzje (debounce zapisu, normalizacja wyszukiwania PL/EN, warstwy `models` / `repositories` / `hooks` / `components`). Persystencja treningu — największy zarzut z pierwszej iteracji — **działa**. Zostały głównie:

- **cztery realne defekty poprawności** (przecinek w wadze, ekran treningu, puste serie, pusty Menu),
- **dług architektoniczny**, który będzie się propagował przy kolejnych ekranach (duplikacja typów, kolory, anty-wzorzec list).

| #   | Obszar                                                              | Waga | Krótko                                                |
| --- | ------------------------------------------------------------------- | ---- | ----------------------------------------------------- |
| C1  | Przecinek w wadze gubi ułamek (`parseFloat`)                        | 🔴   | `72,5 kg` zapisuje się jako `72`                      |
| C2  | Zakładka „Workout" wymaga `id`, którego nie dostaje                 | 🔴   | Klik w zakładkę zawsze pokazuje „Nie znaleziono dnia" |
| C3  | Brak stanu `loading` na ekranie treningu                            | 🔴   | Miganie „Nie znaleziono" w czasie ładowania           |
| C4  | Auto-zapis pustych serii + tymczasowe ID `new-...` w storage        | 🔴   | Śmieci w bazie przy samym wejściu; ryzyko kolizji ID  |
| C5  | Pusty, niedostępny `MenuScreen` + menu zaszyte w `RootLayout`       | 🔴   | Martwy plik + naruszenie SRP                          |
| W1  | Duplikacja typów (`SetType`, `WeightUnit`, target) 4–5×             | 🟠   | Łamanie SSOT/DRY                                      |
| W2  | `toWorkoutSet` gubi pola (`rpe`, `note`, `distance`, `durationSec`) | 🟠   | Cicha utrata danych przy zapisie                      |
| W3  | `FlatList` zagnieżdżony w `ScrollView`                              | 🟠   | Utrata wirtualizacji                                  |
| W4  | Brak `useFocusEffect` — listy nie odświeżają się                    | 🟠   | Po dodaniu danych nie widać zmian                     |
| W5  | Hardcodowane kolory w całym kodzie                                  | 🟠   | Brak palety, łamanie DRY                              |
| W6  | Brak walidacji danych z `AsyncStorage` + duplikacja warstwy storage | 🟠   | Ryzyko crasha po migracji modelu                      |
| W7  | `any` w `use-workout-screen` (sprzeczne z `strict`)                 | 🟠   | Wyłączone typowanie w kluczowym miejscu               |

**Ocena ogólna:** solidny fundament, miejscami **powyżej** poziomu „początkujący" (debounce, normalizacja wyszukiwania, warstwowość). Najpilniejsze to **C1–C4** (poprawność danych — wprost uderza w priorytet z `product-context.md`).

---

## Mocne strony — zachować

To robi dobre wrażenie i należy **zachować**:

- ✅ **Czysty podział warstwowy** — `models` (typy domenowe), `repositories` (dostęp do danych), `hooks` (logika ekranu), `components` (UI), `data` (seed). Bliskie temu, co znasz z Javy (model / repository / service).
- ✅ **Debounce w dwóch miejscach** — wyszukiwarka (200 ms) i zapis treningu (500 ms). Dojrzała decyzja.
- ✅ **`updateSets` z upsertem przez `Map`** — jeden batchowy zapis, świadome unikanie race condition z pierwszej iteracji. 👏
- ✅ **Wyszukiwarka** [src/search/filter-exercises.ts](../src/search/filter-exercises.ts) — normalizacja diakrytyków (`NFD`), aliasy PL/EN. Czysta, testowalna funkcja.
- ✅ **`weight != null`** zamiast `weight ?` w [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L26) — poprawna obsługa wartości `0` (częsty błąd początkujących, tu zrobiony dobrze).
- ✅ **Model danych** znormalizowany (referencje po `id`), z polami „na przyszłość" (`rpe`, `distance`, `durationSec`) — zgodny z „prosty start, stopniowa złożoność" z [docs/product-context.md](../docs/product-context.md).
- ✅ **`use-debounced-value`** — wzorcowa implementacja z `clearTimeout` w cleanup.
- ✅ **`typedRoutes` + `reactCompiler`** włączone w [app.json](../app.json) — nowoczesny stack.

---

## Ważny kontekst: React Compiler

W [app.json](../app.json) masz `experiments.reactCompiler: true`. To istotne dla interpretacji uwag o wydajności:

> React Compiler **automatycznie memoizuje** komponenty i wartości, więc klasyczne rady „owiń to w `useMemo`/`useCallback`/`React.memo`" są w dużej mierze **zbędne**. W tym przeglądzie **nie** traktuję braku ręcznej memoizacji jako błędu.

Czego Compiler **nie** załatwia (i dlatego nadal jest w uwagach):

- **Inline-obiekty stylów** — to wciąż realokacja przy renderze i problem **spójności/DRY**, nie tylko wydajności.
- **`FlatList` w `ScrollView`** — to architektura list i wirtualizacja, nie memoizacja.
- **`useFocusEffect`** — to **poprawność** (świeżość danych), nie optymalizacja.

> 💡 **Dla początkującego (Java):** React Compiler to jakby kompilator sam dodawał `@Cached` na metody. Konsekwencja: pisz prosty kod, kompilator zajmie się wydajnością. **Nie nadużywaj `useMemo`/`useCallback`.**

---

## Legenda priorytetów

| Symbol           | Znaczenie                                                                  |
| ---------------- | -------------------------------------------------------------------------- |
| 🔴 **Krytyczny** | Realny defekt / zachowanie sprzeczne z intencją. Naprawić jak najszybciej. |
| 🟠 **Wysoki**    | Dług, który propaguje się przy każdym nowym ekranie. Spłacić w Fazie 2.    |
| 🟡 **Średni**    | Czytelność / spójność / utrzymywalność. Spłacać przyrostowo.               |
| 🟢 **Niski**     | Kosmetyka, drobiazgi, sprzątanie.                                          |

---

## 🔴 Krytyczne (defekty poprawności)

### C1 — Przecinek w wadze gubi ułamek

**Lokalizacja:** [src/components/workout/workout-set-row.tsx](../src/components/workout/workout-set-row.tsx#L52), [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L60)

**Problem:** Pole wagi dopuszcza przecinek:

```tsx
onChangeText={(text) => onChangeWeight(text.replace(/[^0-9.,]/g, ""))}
```

…ale konwersja na liczbę używa `parseFloat`, które **nie rozumie przecinka**:

```ts
weight: formSet.weight ? parseFloat(formSet.weight) : undefined,
```

`parseFloat("72,5")` → **`72`** (ucina od przecinka). Polski użytkownik wpisze `72,5 kg`, a zapisze się `72`. To bezpośrednie naruszenie „poprawności danych" z `product-context.md`.

**Fix:** znormalizuj przecinek przed parsowaniem (jedna funkcja, użyta dla wagi):

```ts
function parseDecimal(value: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isNaN(parsed) ? undefined : parsed;
}
// …
weight: parseDecimal(formSet.weight),
```

> 💡 **Nauka:** w JS `parseFloat` nie jest „locale-aware" (inaczej niż `NumberFormat` w Javie). Standard: dane trzymasz z kropką dziesiętną, przecinek to wyłącznie warstwa wejścia/prezentacji.

---

### C2 — Zakładka „Workout" wymaga `id`, którego nigdy nie dostaje

**Lokalizacja:** [app/\_layout.tsx](../app/_layout.tsx#L47-L60), [app/workout/index.tsx](../app/workout/index.tsx#L19-L42)

**Problem:** `WorkoutScreen` czyta `const { id } = useLocalSearchParams<{ id: string }>()` i jeśli `day === null`, renderuje „Nie znaleziono dnia treningowego". Tymczasem w layoutcie `workout/index` jest **stałą zakładką** w pasku Tab (bez `href: null`):

```tsx
<Tabs.Screen name="workout/index" options={{ title: "Workout" /* … */ }} />
```

Kliknięcie zakładki **nigdy nie przekazuje `id`** → `trainingDayId` jest `undefined` → `useEffect` robi `if (!trainingDayId) return;` → `day` zostaje `null` → ekran **zawsze** pokazuje komunikat o błędzie. Ten sam ekran pełni dwie sprzeczne role: (a) zakładka „aktywny trening" oraz (b) szczegóły dnia otwierane z Historii przez `router.push({ pathname: "/workout", params: { id } })`. To naruszenie SRP i realny defekt UX.

**Propozycje (od najlepszej):**

1. **Trasa dynamiczna `app/workout/[id].tsx` + osobny launcher w zakładce (zalecane).** Zakładka `Workout` zostaje ekranem-launcherem („Rozpocznij/wznów trening" lub lista dni), a szczegóły idą do `[id]`. `router.push("/workout/" + day.id)` jest wtedy typowane przez `typedRoutes`. Idiomatyczne dla Expo Router.
2. **Ukryj `Workout` z paska** (`options={{ href: null }}`, jak `exercises`/`about-me`) i wchodź tylko z Historii. Najmniejsza zmiana, ale tracisz wpis w pasku.
3. **Stan pusty zamiast błędu** — gdy brak `id`, pokaż zachętę („Wybierz trening z Historii albo utwórz nowy"). To tylko plaster (nie usuwa dualnej roli), ale natychmiast poprawia UX.

> 💡 **Dla początkującego (Expo Router):** plik = trasa. Folder `[id]` w nawiasach kwadratowych to **segment dynamiczny** — odpowiednik `:id` w Angular Router. Jeden ekran nie powinien być jednocześnie „zakładką bez parametru" i „widokiem szczegółów z parametrem".

---

### C3 — Brak stanu `loading` → miganie „Nie znaleziono"

**Lokalizacja:** [app/workout/index.tsx](../app/workout/index.tsx#L34-L42), [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L70)

**Problem:** `day` startuje jako `null` **także podczas ładowania** (`useState<TrainingDay | null>(null)`). Nawet po naprawie C2 (gdy `id` jest poprawnie przekazane z Historii), zanim `await` z repozytorium wróci, użytkownik na ułamek sekundy widzi „Nie znaleziono" — choć dzień istnieje. `null` znaczy tu jednocześnie „ładuję" **i** „nie ma" — to dwie różne rzeczy.

**Fix:** rozróżnij trzy jawne stany:

```ts
const [status, setStatus] = useState<"loading" | "ready" | "missing">(
  "loading",
);
// w .then(): setStatus(details.day ? "ready" : "missing");
```

```tsx
if (status === "loading")
  return (
    <Screen>
      <ActivityIndicator />
    </Screen>
  );
if (status === "missing")
  return (
    <Screen>
      <Text>Nie znaleziono…</Text>
    </Screen>
  );
```

> 💡 **Nauka:** `null` jako „brak" **i** „jeszcze nie wczytane" to klasyczna pułapka. W Javie też nie mieszasz `Optional.empty()` z „ładowaniem". To wzorzec **state machine** — trzy jawne stany zamiast jednego niejednoznacznego `null`.

---

### C4 — Auto-zapis pustych serii + tymczasowe ID `new-...` trafiają do storage

**Lokalizacja:** [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L35-L51), [src/repositories/workout.repository.ts](../src/repositories/workout.repository.ts)

**Problem (dwa sprzężone):**

1. **Pętla `useEffect`.** Pierwszy efekt ładuje dane i dla ćwiczeń bez serii tworzy **syntetyczne szkielety** `[0, 1, 2].map((i) => mapSetOrCreate(undefined, exercise.id, i))` z `weight: ""`, `reps: ""`. Drugi efekt (debounced) zapisuje **wszystko** — łącznie z tymi szkieletami, których użytkownik nie dotknął. Dla treningu 5 ćwiczeń × 3 serie to **15 pustych rekordów przy samym otwarciu ekranu**.
2. **Kruche ID.** Te szkielety dostają ID `new-${workoutExerciseId}-${index}` i po debounced-zapisie trafiają do `AsyncStorage` **jako trwałe**. Po ponownym wejściu indeks `new-...-0/1/2` może się **powtórzyć** i nadpisać/zduplikować dane.

**Fix (łącznie):**

1. **Nie zapisuj „szkiców"** — zapisuj tylko serie „dotknięte" (flaga `dirty` w `updateSetField`) albo odfiltruj przed zapisem serie całkowicie puste i nieoznaczone `done`:
   ```ts
   const allSets = Object.values(debouncedSetsByExerciseId)
     .flat()
     .filter((s) => s.weight !== "" || s.reps !== "" || s.done)
     .map(toWorkoutSet);
   ```
2. **Prawdziwe ID przy materializacji serii** zamiast `new-...`:
   ```ts
   import * as Crypto from "expo-crypto";
   id: Crypto.randomUUID(),
   ```
3. **Dodaj `addSet`/`deleteSet`** do repozytorium (zapisuj pełną listę serii ćwiczenia, nie tylko merge), żeby usunięcia były odzwierciedlane — domyka CRUD wymagany w MVP.

> 💡 **Nauka:** `useEffect` reagujący na stan, który **sam** przed chwilą ustawił, to częsta „pętla sprzężenia". W Angularze odpowiednikiem byłoby `valueChanges` odpalające się od programatycznego `setValue`. Zawsze pytaj: „czy ten efekt powinien działać przy **pierwszym** ustawieniu danych?". A ID oparte o czas/indeks tylko „wydają się" unikalne — UUID to standard globalnej unikalności (jak `UUID.randomUUID()` w Javie).

---

### C5 — Pusty, niedostępny `MenuScreen` + menu zaszyte w `RootLayout`

**Lokalizacja:** [app/menu/index.tsx](../app/menu/index.tsx), [app/\_layout.tsx](../app/_layout.tsx#L86-L142)

**Problem (trzy naraz):**

- **a) `MenuScreen` to plik-zombie** — renderuje `<Pressable>` **bez żadnych dzieci**, do którego i tak **nigdy nie docierasz**, bo `tabPress` jest przechwytywany w layoutcie. Martwy, mylący kod.
- **b) Hack `e.preventDefault()` na zakładce „Menu"** — zakładka udaje przycisk i otwiera modal. Czytający kod nie rozumie, czemu klik „nic nie nawiguje".
- **c) Menu w `RootLayout`** — stan `isMenuOpen`, `<Modal>`, `goToExercises`/`goToAboutMe` żyją w korzeniu. Layout (odpowiedzialny za strukturę nawigacji) bierze na siebie też prezentację i logikę menu (naruszenie SRP). Każda nowa pozycja menu puchnie ten plik.

**Propozycje:**

1. **Wydziel `<AppMenuModal>`** do `src/components/common/` (stan + lista pozycji), a layout tylko go osadza. Najmniejszy, czysty krok.
2. **Albo zrób z menu prawdziwy ekran modalny** (`app/menu.tsx` z `options={{ presentation: "modal" }}`) i usuń przechwytywanie `tabPress` — domyka też (a).
3. **Konfiguracja menu jako dane** — lista `{ label, href }[]` w osobnym module, renderowana generycznie. Dodanie pozycji = jeden wpis w tablicy (DRY).

W każdym wariancie: **usuń [app/menu/index.tsx](../app/menu/index.tsx) w obecnej formie.**

---

## 🟠 Wysokie (dług, który się propaguje)

### W1 — Duplikacja typów domenowych (`SetType`, `WeightUnit`, target)

**Lokalizacja:** [src/models/WorkoutSet.ts](../src/models/WorkoutSet.ts) (źródło prawdy), a kopie w [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L9-L18), [src/components/workout/workout-set-row.tsx](../src/components/workout/workout-set-row.tsx#L5-L6), [workout-set-type-modal.tsx](../src/components/workout/workout-set-type-modal.tsx), [workout-weight-unit-modal.tsx](../src/components/workout/workout-weight-unit-modal.tsx)

**Problem:** Union `"warmup" | "working" | "drop" | "failure"` jest powtórzony **4–5 razy**. Analogicznie `{ exerciseId: string; setId: string }` (target wyboru) występuje w hooku i obu modalach. Dodanie typu `"amrap"` = zmiana w 5 miejscach; pominięcie jednego → ciche błędy.

**Fix:** importuj uniony z modelu wszędzie; wyeksportuj `WeightUnit` z modelu; wydziel `export type SetSelectTarget = { exerciseId: string; setId: string }` do jednego modułu.

> 💡 **Nauka:** Single Source of Truth — jeden typ, jedno miejsce. To samo, co robisz w Javie z `enum SetType`.

---

### W2 — `toWorkoutSet` gubi pola domenowe przy zapisie

**Lokalizacja:** [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L54-L64)

**Problem:** `WorkoutSet` ma pola `rpe`, `note`, `distance`, `durationSec`, ale `SetForm` (model formularza) ich nie przenosi, a `toWorkoutSet` ich nie ustawia. Gdy w przyszłości seria będzie miała `rpe`/`note`, przy każdym debounced-zapisie te pola **znikną** (nadpisane wartością bez nich).

**Fix:** scalaj ze źródłowym `WorkoutSet` zamiast budować od zera — spread istniejącego + nadpisanie edytowanych pól:

```ts
function toWorkoutSet(formSet: SetForm, original?: WorkoutSet): WorkoutSet {
  return {
    ...original, // zachowaj rpe / note / distance / durationSec
    id: formSet.id,
    workoutExerciseId: formSet.workoutExerciseId,
    index: formSet.index,
    type: formSet.type,
    weight: parseDecimal(formSet.weight),
    weightUnit: formSet.weightUnit,
    reps: formSet.reps ? parseInt(formSet.reps, 10) : undefined,
    done: formSet.done,
  };
}
```

> 💡 **Nauka:** rozdział „model formularza" (stringi z inputów) od „modelu domeny" (liczby) jest **słuszny**. Pułapka pojawia się, gdy mapper z formularza do domeny „nie wie" o polach, których formularz nie edytuje — i je kasuje. Mapper powinien **uzupełniać**, nie **zastępować**.

---

### W3 — `FlatList` zagnieżdżony w `ScrollView` (anty-wzorzec RN)

**Lokalizacja:** [app/exercises/index.tsx](../app/exercises/index.tsx)

**Problem:** Struktura `<ScrollView horizontal>` → `<View>` → `<FlatList>` (pionowy). Orientacje są różne, więc nie zobaczysz najtwardszego warningu, ale **`FlatList` traci wirtualizację** — rośnie w nieograniczonej wysokości rodzica, więc wszystkie wiersze renderują się naraz. Przy bazie kilkuset ćwiczeń (a ma rosnąć) — realny spadek FPS i pamięci. React Compiler tego **nie** naprawia.

**Propozycje:**

1. **`FlatList` jako kontener** z `ListHeaderComponent={<ExerciseTableHeader/>}`, całość owinięta jednym `ScrollView horizontal` (tabela szersza niż ekran, przewijana poziomo jako całość). Zachowuje wirtualizację.
2. **Dla MVP — świadomie `.map()` w `ScrollView`** (skoro przy zagnieżdżeniu i tak nie ma wirtualizacji, `FlatList` nie daje korzyści — prostsze i bardziej KISS). Udokumentuj decyzję.
3. **Tabela responsywna bez poziomego scrolla** (1 ćwiczenie = 1 karta) — `FlatList` pionowy działa natywnie z pełną wirtualizacją; lepsze UX na wąskich ekranach.

> 💡 **Nauka:** `FlatList` to „leniwa lista" — renderuje tylko widoczne elementy (jak wirtualne przewijanie w ag-Grid). Stąd słynne ostrzeżenie RN „VirtualizedLists should never be nested…".

---

### W4 — Brak `useFocusEffect` — listy nie odświeżają się po powrocie

**Lokalizacja:** [app/history/index.tsx](../app/history/index.tsx), [app/exercises/index.tsx](../app/exercises/index.tsx)

**Problem:** Dane ładowane w `useEffect(() => { …getAll().then(set) }, [])` — czyli **raz, przy montażu**. W nawigacji zakładkowej ekran **nie odmontowuje się** przy zmianie taba, więc po dodaniu ćwiczenia/dnia i powrocie widać **stare** dane. To problem **poprawności**, nie wydajności.

**Fix:**

```ts
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

useFocusEffect(
  useCallback(() => {
    WorkoutRepository.getTrainingDays().then(setTrainingDays);
  }, []),
);
```

> 💡 **Nauka:** `useEffect([])` = „raz, przy montażu". W appce zakładkowej ekrany żyją w tle. `useFocusEffect` = „za każdym razem, gdy ekran staje się aktywny" — jak `ionViewWillEnter` w Ionic/Angular albo `OnResume`.

---

### W5 — Hardcodowane kolory w całym kodzie (brak palety)

**Lokalizacja:** m.in. [app/app.style.ts](../app/app.style.ts) (`"orange"`, `"#ffc457"`), [app/history/index.tsx](../app/history/index.tsx) (`"#ffc457"` inline), [src/components/exercises/exercises.style.ts](../src/components/exercises/exercises.style.ts) (`"#1570EF"`, `"#D0D5DD"`, `"#101828"`…), [src/components/workout/workout.style.ts](../src/components/workout/workout.style.ts) (`"#fff8ee"`, `"#f0d8b5"`)

**Problem:** Dziesiątki literałów kolorów rozsianych po stylach i inline w JSX. `"orange"` (nazwa CSS) miesza się z hexami. Każdy nowy ekran = kolejne kopie; zmiana motywu = polowanie po repo.

**Fix:** masz już [src/theme/spacing.ts](../src/theme/spacing.ts) — idź tym tropem i dodaj `src/theme/colors.ts`:

```ts
export const colors = {
  brand: { primary: "#FFA500", secondary: "#FFC457", surface: "#FFF8EE" },
  text: { primary: "#101828", secondary: "#475467", muted: "#98A2B3" },
  border: { default: "#D0D5DD", subtle: "#E4E7EC" },
  feedback: { success: "#12B76A", info: "#1570EF" },
} as const;
```

> 💡 **Nauka:** to odpowiednik zmiennych SCSS / Material theme. Jeden punkt prawdy = łatwy dark mode (masz już `userInterfaceStyle: "automatic"` w [app.json](../app.json)) i rebranding.

---

### W6 — Brak walidacji danych z `AsyncStorage` + duplikacja warstwy storage

**Lokalizacja:** [src/repositories/exercise.repository.ts](../src/repositories/exercise.repository.ts#L11-L13), [src/repositories/workout.repository.ts](../src/repositories/workout.repository.ts)

**Problem (dwie sprawy):**

- **Bezpieczeństwo runtime:** `JSON.parse(stored) as T` — **ślepe rzutowanie**. Po pierwszej zmianie modelu stare dane w `AsyncStorage` nie pasują do nowego typu, a TS o tym nie wie → crash przy renderze, nie przy odczycie. Klucze są wersjonowane (`.v1`), więc migracje są przewidziane — ale bez walidacji pierwsza migracja realnie wywróci aplikację.
- **DRY:** wzorzec „pobierz klucz → `JSON.parse` → seed jeśli pusto → `catch` → zwróć seed" jest w `exercise.repository` (`getAll`) i powielony jako `getOrSeed` w `workout.repository`.

**Fix:**

1. **Generyczny helper** `loadOrSeed<T>(key, seed)` w `src/repositories/storage.ts` — usuwa duplikację.
2. **Walidacja Zod** przy odczycie (tylko na granicy I/O!):
   ```ts
   const parsed = ExerciseSchema.array().safeParse(JSON.parse(stored));
   if (!parsed.success) return EXERCISES; // fallback do seedu
   ```

> 💡 **Nauka:** TypeScript znika po kompilacji — nie chroni przed „brudnymi" danymi w runtime (inaczej niż typy Javy weryfikowane przez JVM). Na granicach (sieć, storage) typy to obietnica, nie gwarancja. **Nie dodawaj** walidacji wszędzie — tylko na granicach systemu.

---

### W7 — `any` w hooku (sprzeczne z `strict`)

**Lokalizacja:** [src/hooks/use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L134)

**Problem:** `details.exercises.map((exercise: any) => …)` w pliku z `strict: true`. Typ jest w pełni znany (`WorkoutExerciseWithName`), więc `any` tylko wyłącza kontrolę i „zaraża" wszystko, czego dotknie.

**Fix:** usuń adnotację (TS sam wywnioskuje typ) albo wpisz `WorkoutExerciseWithName`. Rozważ regułę ESLint `@typescript-eslint/no-explicit-any`.

> 💡 **Nauka:** `any` to „wyłącz typy dla tej wartości i wszystkiego, co z niej wynika" — jak rzutowanie na `Object` i refleksja w Javie. Jeśli już musisz, użyj `unknown` (zmusza do zawężenia).

---

## 🟡 Średnie (spójność / czytelność)

### S1 — Niespójność językowa UI (Polglish)

UI miesza PL i EN w jednym ekranie: „Workout Day", „Add exercise", „Save", „Exercise Library" obok „Wróć", „Szukaj", „powt.", „Czas". Roadmap 1.5 decyduje: **PL dla MVP, bez i18n**.
**Fix:** ujednolić na PL (bez biblioteki i18n — to byłoby over-engineering). Opcjonalnie teksty do `src/i18n/pl.ts` jako prosty obiekt stałych (jedno miejsce na napisy, nie framework).

### S2 — Duplikacja `SET_TYPE_LABEL`

Mapa etykiet istnieje w [app/workout/index.tsx](../app/workout/index.tsx#L11-L16) i [workout-set-type-modal.tsx](../src/components/workout/workout-set-type-modal.tsx). Zmiana w jednym miejscu nie propaguje się do drugiego.
**Fix:** jedna stała obok `SetType` w `src/models/` lub funkcja `formatSetType(type)`.

### S3 — Inline-style + magiczne liczby w JSX

[app/history/index.tsx](../app/history/index.tsx) (`style={{ gap: 8, marginTop: 16 }}`, `style={{ padding: 12, backgroundColor: "#ffc457" }}`), inline w [app/workout/index.tsx](../app/workout/index.tsx). Reszta projektu trzyma style w `*.style.ts` — to też niespójność.
**Fix:** przenieś do `*.style.ts` + użyj `spacing`. Inline zostaw tylko dla prawdziwie dynamicznych wartości (`paddingTop: insets.top`).

### S4 — Magiczne `-16` w nagłówku `Screen`

[app/app.style.ts](../app/app.style.ts) używa `marginHorizontal: -16, marginTop: -16`, sprzężone na odległość z `padding: spacing.md` (=16) w [src/components/common/Screen.tsx](../src/components/common/Screen.tsx). Zmienisz `spacing.md` → nagłówek się rozjedzie.
**Fix:** `marginHorizontal: -spacing.md` (jedno źródło), albo renderuj nagłówek przed paddingiem.

### S5 — Podwójny / niespójny nagłówek

[app/workout/index.tsx](../app/workout/index.tsx#L44-L53) renderuje `<Screen title="Workout Day">` (header `myGym` + tytuł), a zaraz potem **drugi** nagłówek z datą przez `styles.headerTitle`. Home ma jeszcze inny nagłówek (logo-obrazek) — trzy ekrany, trzy koncepcje.
**Fix:** rozbuduj `Screen` o opcjonalny `subtitle`/slot i przekaż datę tam; ujednolić nagłówki wszystkich ekranów (roadmap 2.3).

### S6 — Duplikacja 4 bloków „chipów" w formularzu ćwiczenia

[src/components/exercises/exercise-form.tsx](../src/components/exercises/exercise-form.tsx) — „Primary muscle", „Secondary muscles", „Equipment", „Tags" to cztery niemal identyczne bloki `items.map(...) → <Pressable> chip`. ~120 linii powtórzeń.
**Fix:** komponent `<ChipSelector mode="single" | "multi" items selectedIds onChange />`. Cztery bloki → cztery wywołania.

### S7 — Komentarze-dziennik, notatki edukacyjne i `console.log` w kodzie

[workout-set-type-modal.tsx](../src/components/workout/workout-set-type-modal.tsx) (długi blok o `!!typeSelectTarget`), [workout-weight-unit-modal.tsx](../src/components/workout/workout-weight-unit-modal.tsx) (`//bylo animationType="fade"`), zakomentowane warianty w [use-workout-screen.ts](../src/hooks/use-workout-screen.ts#L24-L29), `console.log("Exercise added…")` w repo.
**Fix:** zostaw komentarze **„dlaczego"** (np. uzasadnienie debounce), usuń **„co"** i zakomentowany kod (od tego jest git). Notatki edukacyjne → `docs/notes.md` lub pamięć projektu. Wytnij `console.log` sukcesu (zostaw `console.error`).

### S8 — Lawina `useMemo` dla stałych modułu

[app/exercises/index.tsx](../app/exercises/index.tsx) — 6 słowników z `MUSCLES`/`EQUIPMENT`/`TAGS`. To **stałe importowane**, nie zmieniają się nigdy — można policzyć **raz, poza komponentem**:

```ts
const MUSCLE_NAME_BY_ID = Object.fromEntries(
  MUSCLES.map((m) => [m.id, m.name]),
);
```

Zero `useMemo`, zero zależności. (Z React Compilerem `useMemo` i tak jest tu głównie szumem.)

---

## 🟢 Niskie (kosmetyka / porządki)

### N1 — Zepsuty skrypt `reset-project`

**Lokalizacja:** [package.json](../package.json#L7) → `"reset-project": "node ./scripts/reset-project.js"`

**Problem:** W katalogu głównym **nie ma** `scripts/reset-project.js` (plik istnieje tylko w [app-example/scripts/reset-project.js](../app-example/scripts/reset-project.js)). `npm run reset-project` → `Cannot find module`.

> ⚠️ **Korekta priorytetu względem wcześniejszego przeglądu:** to realny błąd, ale to **dev-helper niewidoczny dla użytkownika końcowego** — nie „krytyczny". Naprawa trywialna i bezryzykowna.

**Fix:** usuń skrypt z `package.json` (skoro `app-example/` i tak do kasacji — N2), albo popraw ścieżkę.

### N2 — Martwy katalog `app-example/`

Cały szablon Expo nieużywany — myli TS i linter. **Fix:** wyciągnij użyteczne (`constants/theme.ts` → W5) i usuń folder.

### N3 — `Screen.tsx` łamie kebab-case

[src/components/common/Screen.tsx](../src/components/common/Screen.tsx) jest PascalCase, a `copilot-instructions.md` ustala kebab-case. **Fix:** zmień plik na `screen.tsx` (komponent `Screen` zostaje PascalCase — zmienia się tylko nazwa pliku).

### N4 — Literówki w etykietach i danych

[exercise-form.tsx](../src/components/exercises/exercise-form.tsx) („Nazwa cwiczenia" → „ćwiczenia"), [muscles.data.ts](../src/data/muscles.data.ts) (brak polskich znaków: „gorna czesc plecow"). **Fix:** popraw widoczne etykiety; ustal konwencję pełnych polskich znaków w danych (`localeCompare("pl")` i tak je obsłuży).

### N5 — `console.*` jako jedyna obsługa błędów + brak loaderów

`.then(set)` bez `.catch` w [history/index.tsx](../app/history/index.tsx), [exercises/index.tsx](../app/exercises/index.tsx); brak stanu `isLoading`/`ActivityIndicator`. **Fix:** stany `isLoading`/`error` + prosty loader; `ErrorBoundary` na poziomie layoutu (roadmap 2.6).

### N6 — Niespójny styl eksportów (default vs named)

Komponenty mieszają `export default function` i `export function`. Ekrany Expo Router **muszą** mieć default (to OK), ale komponenty wewnętrzne bez reguły. **Fix:** „komponenty reużywalne — named; ekrany tras — default".

### N7 — Nieunikalne `index` w seedach serii

[src/data/training-days.data.ts](../src/data/training-days.data.ts) — sekwencja per ćwiczenie to `0,0,1,2,3` (dwie serie warmup mają `index: 0`), a `mapSetOrCreate` nadaje `0,1,2` — inna konwencja. **Fix:** `index` = pozycja w obrębie ćwiczenia (unikalny, ciągły `0..n`); przeliczaj przy zapisie na podstawie kolejności w tablicy.

---

## Zgodność z zasadami

| Zasada                        |     Ocena     | Komentarz                                                                                                       |
| ----------------------------- | :-----------: | --------------------------------------------------------------------------------------------------------------- |
| **KISS**                      |   🟢 dobra    | Rozwiązania proste i adekwatne do MVP. Lekkie ryzyko nadmiaru komentarzy (S7).                                  |
| **DRY**                       | 🟠 do poprawy | Duplikacja typów (W1), `SET_TYPE_LABEL` (S2), kolorów (W5), warstwy storage (W6), bloków chipów (S6).           |
| **SOLID — SRP**               | 🟠 do poprawy | `RootLayout` miesza nawigację z UI menu (C5); `WorkoutScreen` ma dualną rolę (C2).                              |
| **SOLID — OCP/DIP**           |  🟡 średnia   | Repozytoria bez abstrakcji — trudniejsze do mockowania. Na MVP akceptowalne (W6 propozycja helpera to łagodzi). |
| **Clean Code**                |  🟡 średnia   | Dobre nazwy, krótkie funkcje; minusy: komentarze-dziennik (S7), `any` (W7), literówki (N4).                     |
| **Idiomy React Native**       | 🟠 do poprawy | `FlatList` w `ScrollView` (W3), brak `useFocusEffect` (W4), inline-style (S3).                                  |
| **Idiomy Expo / Expo Router** |  🟡 średnia   | Dobre: typedRoutes, reactCompiler, `Tabs`. Do poprawy: dualna rola `workout` (C2), martwy `menu` (C5).          |

---

## Zgodność z roadmapą i product-context

**Rozbieżności roadmapy ze stanem kodu (do aktualizacji w `roadmap.md`):**

- Roadmap mówi „`use-workout-screen.ts` → usuń pusty hook", a hook jest **w pełni zaimplementowany** (debounce, mapowanie, zapis). Roadmapa nieaktualna.
- Roadmap deklaruje „Logowanie treningu — UI gotowe, **brak zapisu**", ale zapis serii **istnieje** (debounced `updateSets`). Stan faktyczny jest dalej niż tabela MVP.

**Zgodność z [docs/product-context.md](../docs/product-context.md):**

- ✅ **Offline-first** — `AsyncStorage` + seed.
- ✅ **Pola zaawansowane opcjonalne** — `WorkoutSet` (`rpe`, `distance`, `durationSec`, `note`), `Exercise.secondaryMuscleIds`.
- ⚠️ **Poprawność danych** — zagrożona przez C1 (przecinek), C4 (ID `new-...`, brak usuwania) i W6 (brak walidacji). To wprost uderza w priorytet produktu.
- ⚠️ **Plan vs wykonanie** — `TrainingDay` to wykonanie; brak `WorkoutTemplate` (świadomie poza MVP). Model `Superset` istnieje, ale nieużywany — obserwuj, by nie stał się martwym bytem.

**Brakuje względem zakresu „Core" (mapa drogowa, nie błędy):** dodawanie/edycja dni treningowych z UI, dodawanie ćwiczeń do dnia, Planner (placeholder). Ważne, że **model danych już to udźwignie**.

---

## Rekomendowana kolejność działań

Kolejność: najpierw defekty poprawności, potem dług blokujący rozwój.

**🔴 Najpierw (poprawność danych — priorytet z product-context):**

1. **C1** — fix przecinka w wadze (`parseDecimal`). Najtańszy, a chroni realne dane.
2. **C4** — nie zapisuj pustych serii + UUID zamiast `new-...` + `addSet`/`deleteSet`.
3. **C2** — rozdziel rolę ekranu `Workout` (trasa `[id]` lub `href: null`).
4. **C3** — stan `loading | ready | missing` na ekranie treningu.

**🟠 Potem (odblokowanie przyszłości — Faza 2):**

5. **C5** — wydziel menu z `RootLayout`, usuń martwy `MenuScreen`.
6. **W1 + W2** — konsolidacja typów serii + `toWorkoutSet` zachowujący pola.
7. **W4** — `useFocusEffect` na listach (history, exercises).
8. **W5** — `src/theme/colors.ts` (zrób **przed** kolejnymi ekranami).
9. **W6** — helper storage + walidacja Zod.
10. **W3** — architektura listy w `exercises`. **W7** — usuń `any`.

**🟡🟢 Przyrostowo (w miarę dotykania plików):**

11. S1–S8 (język, style, komentarze, `ChipSelector`, nagłówki, `useMemo`).
12. N1–N7 (porządki: `reset-project`, `app-example/`, kebab-case, literówki, loadery).
13. **Pierwsze testy** — zacznij od czystych funkcji: `filterExercises`, `parseDecimal`, `toWorkoutSet`.

---

## Mentorska puenta

Twój kod jest **lepszy niż przeciętny projekt początkującego w React Native**. Widać separation of concerns (repozytoria, modele, search, hooks), poprawne użycie TypeScript (generyki w `getOrSeed`, dyskryminowane unie w `SetType`) i planowanie domeny z głową. Persystencja, race condition i podział na komponenty — rzeczy z pierwszej iteracji — **dojrzały**.

Trzy „przeskoki mentalne" z Javy/Angular, które domykasz:

1. **Stan vs persystencja** — w Angularze serwisy z RxJS „pamiętają". W RN każdy `useState` ginie z komponentem — musisz świadomie zapisywać (i **nie** zapisywać szkieletów — C4).
2. **Lifecycle nawigacji ≠ lifecycle komponentu** — ekran może istnieć w pamięci, ale być niewidoczny. `useEffect([])` ≠ „onResume". Stąd `useFocusEffect` (W4) i stan `loading` (C3).
3. **Komponent = funkcja, nie klasa** — nie szukaj `AbstractScreen`. Robisz to przez `Screen` jako wrapper + props (kompozycja, nie dziedziczenie). W Javie „favor composition over inheritance" to zalecenie; w React to **jedyny** sposób.

> **Pierwszy krok:** **C1 (przecinek)** — najtańszy fix, a dotyka rdzenia obietnicy produktu: poprawnego zapisu ciężaru. Zaraz po nim **C2–C4**, bo to wciąż poprawność. Reszta to spokojna, stopniowa higiena, którą roadmap słusznie przewiduje w Fazie 2.
