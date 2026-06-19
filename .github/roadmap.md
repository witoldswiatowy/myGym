# 🗺️ Roadmapa projektu myGym

> Plan rozwoju aplikacji od stanu obecnego do pełnoprawnego produktu.
> Zasada przewodnia: **„Make it work → make it right → make it fast"**.
> Cel nadrzędny: **MVP, którego sam używasz na siłowni zamiast Excela przez 2 tygodnie**.

---

## 🎯 Definicja MVP

**MVP = aplikacja, którą Ty osobiście używasz na siłowni zamiast Excela przez 2 tygodnie i jest wygodniejsza.**

To brutalnie pragmatyczny test. Jeśli sam wracasz do Excela — MVP nie jest skończony. Jeśli Ty (= najbardziej wymagający użytkownik) jesteś zadowolony — można dawać znajomym i myśleć o publikacji.

### Funkcjonalny zakres MVP

| Feature                              | Stan obecny                 | W MVP?                   |
| ------------------------------------ | --------------------------- | ------------------------ |
| Biblioteka ćwiczeń (CRUD)            | częściowo (R + częściowy C) | ✅ pełne CRUD            |
| Logowanie treningu (set/reps/weight) | UI gotowe, **brak zapisu**  | ✅ pełny zapis           |
| Historia treningów                   | lista jest                  | ✅ + przejście do edycji |
| Tworzenie nowego dnia treningowego   | **brak**                    | ✅ musi być              |
| Notatki + czas trwania treningu      | częściowo                   | ✅ edytowalne            |
| Mięśnie + kolory + grupy             | jest seed                   | ✅ wystarczy seed        |
| Sprzęt + tagi                        | jest seed                   | ✅ wystarczy seed        |
| Planner                              | pusty ekran                 | ❌ poza MVP              |
| Wykresy / analytics                  | nic                         | ❌ poza MVP              |
| Eksport CSV                          | nic                         | ⚠️ nice‑to‑have          |
| Bodyweight tracking                  | nic                         | ❌ poza MVP              |

**Wniosek:** MVP to ~3–4 brakujące rzeczy + naprawa zapisu. Reszta to V1+.

---

## 📋 Plan ogólny (fazowy)

```
┌──────────────────────────────────────────────────────────────┐
│ FAZA 0: Fundament (1–2 sesje)                                │
│ Cel: app działa end-to-end na Twoim telefonie                │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ FAZA 1: MVP (4–6 sesji)                                      │
│ Cel: Zastąpienie Excela. Używasz codziennie.                 │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 🧪 2 TYGODNIE TESTÓW NA SIŁOWNI                              │
│ Notuj UX bugi w .github/ux-notes.md. Retrospektywa.          │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ FAZA 2: Stabilizacja (2–3 sesje)                             │
│ Cel: Refaktor długu z przeglądu kodu + testy                 │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ FAZA 3: Intermediate features (4–6 sesji)                    │
│ Cel: Podsumowania tygodniowe, bodyweight, prosta progresja   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ FAZA 4: Advanced analytics (otwarte)                         │
│ Cel: Wolumeny per mięsień, plany treningowe, RIR/RPE         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 Plan szczegółowy

### **FAZA 0 — Fundament** ⏳ zacznij tu

Cel: minimalna zmiana, by reszta budowy miała sens.

#### 0.1 — Persystencja treningu 🚨 KRYTYCZNE

- [ ] Rozszerzyć `WorkoutRepository` o `updateSet`, `addSet`, `deleteSet`, `updateTrainingDay`
- [ ] W `WorkoutScreen` zapisywać zmiany przy każdej edycji (debounced ~500ms)
- [ ] Generowanie ID przez `expo-crypto` `randomUUID()` (dodać paczkę)
- [ ] Manualny test: edytuj serie, zamknij ekran, wróć — dane mają być

**Po tej zmianie:** możesz zacząć używać app na siłowni „w trybie testowym".

#### 0.2 — Sprzątanie martwego kodu

- [ ] `app-example/` → do kosza
- [ ] `app/menu/index.tsx` → przenieś logikę menu poza `_layout.tsx` albo zrób z tego prawdziwy ekran
- [ ] `src/hooks/use-workout-screen.ts` → usuń pusty hook

**Czas:** 1–2 sesje.
**Efekt:** masz aplikację, która faktycznie zapisuje dane.

---

### **FAZA 1 — MVP**

Cel: pełen flow „od pustej apki do zapisanego treningu".

#### 1.1 — Tworzenie nowego dnia treningowego

- [ ] Nowy ekran/modal: „+ Nowy trening" na ekranie History
- [ ] Formularz: data (domyślnie dziś), notatka, czas trwania
- [ ] Po zapisie → przejście do `WorkoutScreen` dla nowo utworzonego dnia

#### 1.2 — Dodawanie ćwiczeń do dnia

- [ ] W `WorkoutScreen`: przycisk „+ Dodaj ćwiczenie"
- [ ] Modal z listą ćwiczeń (z search — wykorzystaj `filterExercises`)
- [ ] Po wyborze: ćwiczenie pojawia się w widoku ze startowymi 3 seriami

#### 1.3 — Operacje na seriach

- [ ] Przycisk „+ Dodaj serię" pod każdym ćwiczeniem
- [ ] Swipe / długie naciśnięcie → usuń serię
- [ ] Reorder (przeciągnij) — **nice‑to‑have, można zostawić na V1.1**

#### 1.4 — Edycja danych dnia w trakcie treningu

- [ ] Pole notatki edytowalne
- [ ] Pole czasu trwania (np. stoper z prostym start/stop albo ręczne wpisanie)

#### 1.5 — Polski język w całym UI

- Decyzja: **PL dla MVP** (sam jesteś userem)
- [ ] Wytrzyj „Polglish" („Add exercise", „Save", „Cancel") → PL
- ❌ Nie wprowadzaj jeszcze i18n — to over‑engineering

#### 1.6 — Walidacja podstawowa

- [ ] Nie można zapisać serii bez wagi i powtórzeń (chyba że typ = warmup)
- [ ] Komunikat błędu zamiast crasha

**Czas:** 4–6 sesji.
**Efekt:** używasz aplikacji w realu na siłowni. **Zacznij 2‑tygodniowy test.**

---

### 🧪 **PRZERWA — Test na siłowni**

- 2 tygodnie używania w realu
- Notuj UX bugi w `.github/ux-notes.md` **na żywo** (po każdym treningu)
- Po 2 tygodniach: retrospektywa, decyzja co priorytetowo poprawić w Fazie 2

---

### **FAZA 2 — Stabilizacja (post‑MVP)**

Cel: spłata długu technicznego z przeglądu kodu, zanim ruszysz dalej.

#### Z przeglądu kodu wybieram najważniejsze:

- [ ] **2.1 — `useFocusEffect` w listach** (exercises, history) — bo bez tego po dodaniu dnia w historii nie widać
- [ ] **2.2 — Centralna paleta kolorów** `src/theme/colors.ts` — bo dodawanie kolejnych ekranów bez tego = lawina śmieci
- [ ] **2.3 — Rozszerzenie komponentu `Screen`** o `title` + logo + SafeArea — bo dodawanie kolejnych ekranów bez tego = copy‑paste
- [ ] **2.4 — Walidacja danych z `AsyncStorage`** (Zod) — bo zaraz zaczniesz zmieniać modele i pierwsza migracja zrobi crash
- [ ] **2.5 — Pierwsze testy jednostkowe** dla `filterExercises` i `useDebouncedValue` — dla nauki Jest + RN Testing Library na czymś prostym
- [ ] **2.6 — `ErrorBoundary` + loadery** — bo zaraz idziesz na zewnątrz z apką

**Czas:** 2–3 sesje.

---

### **FAZA 3 — Intermediate features**

Cel: rzeczy z sekcji „Intermediate Users" w copilot-instructions.

#### 3.1 — Podsumowania tygodniowe

- [ ] Nowy ekran lub sekcja w History: „Ten tydzień / poprzedni tydzień"
- [ ] Liczby: ilość treningów, sumaryczny tonaż (Σ weight × reps), czas spędzony

#### 3.2 — Bodyweight tracking

- [ ] Nowy model `BodyweightEntry { id, date, weightKg }`
- [ ] Prosty ekran: lista wpisów + przycisk „Dodaj dzisiejszą wagę"
- [ ] Wykres? — najprościej `react-native-svg` + ręcznie, albo `victory-native`/`react-native-gifted-charts`. **Na początek lista wystarczy.**

#### 3.3 — Prosta progresja

- [ ] Na ekranie ćwiczenia: ostatnie 5 treningów z tym ćwiczeniem
- [ ] Najcięższa seria + najwyższy 1RM (wzór Brzyckiego: `weight × (36 / (37 - reps))`)

#### 3.4 — Edycja istniejących ćwiczeń

- [ ] W `ExercisesScreen`: tap na wiersz → edytuj (ten sam form co Add)

**Czas:** 4–6 sesji.

---

### **FAZA 4 — Advanced (otwarta)**

Tu już planujesz incrementalnie, decydujesz na podstawie własnego użytkowania:

- **Wolumen per mięsień** — Twój killer feature z briefu. Wymaga modelu `MuscleContribution` (np. wyciskanie sztangi: pierś 60%, tricep 25%, barki 15%). Pole `secondaryMuscleIds` masz, ale bez wag. Decyzja modelowa.
- **Plany treningowe / szablony** — `WorkoutTemplate` jako oddzielny model. „Zacznij trening z szablonu Push".
- **RIR/RPE** — pole już jest w `WorkoutSet`. Trzeba dodać UI (chip 1–10).
- **Wykresy progresji długoterminowej**.
- **Eksport CSV** (wsteczna kompatybilność z Twoim Excelem).
- **Backup do pliku** (`expo-file-system` + share).
- **Migracja na `expo-sqlite`** — gdy `AsyncStorage` zacznie boleć.

---

## 🧠 Koncepcyjne decyzje projektowe

To nie są zadania, tylko **decyzje**, które wpłyną na resztę. Warto je podjąć świadomie zanim się zhardkoduje rozwiązanie.

### 1. Plany vs wykonane treningi — różne byty

W brief'ie masz „plans and templates" jako advanced. To **fundamentalnie inny model** niż wykonany trening:

- `WorkoutTemplate` → opis „co powinno być" (3 ćwiczenia, 4 serie każde)
- `TrainingDay` → opis „co było" (3 ćwiczenia, ale dziś 3 serie bo zmęczenie)

**Decyzja:** czy `TrainingDay` może być utworzony **z** szablonu (kopia), czy referencja do szablonu? **Sugeruję kopia** — bo szablon może się zmienić, a historia musi pokazać co naprawdę zrobiłeś.

### 2. Multi‑muscle exercises — Twój killer feature

Masz to w brief'ie jako rozróżnik („Poor handling of multi‑muscle exercises"). Aktualnie masz tylko `primaryMuscleId` + `secondaryMuscleIds[]`. Żeby to było wartością dodaną:

- Dodaj **wagi procentowe** dla mięśni: `muscleContributions: { muscleId, percent }[]` (suma = 100)
- Wtedy „tonaż na klatkę" = sum (set.weight × set.reps × 0.6) dla wyciskania

**Decyzja:** kiedy dodać te procenty? **Sugeruję przed Fazą 4**, ale modelowo zaplanuj już w Fazie 2 (migracja schematu).

### 3. Storage — `AsyncStorage` ma swoje granice

`AsyncStorage` to klucz‑wartość JSON. Dla 1000 treningów × 8 ćwiczeń × 5 serii = 40 000 obiektów to zaczyna boleć (każde `getAll` = parsowanie całego JSON‑a).

**Granica:** ~kilkadziesiąt treningów to OK. Powyżej 100 — myśl o migracji.

**Opcje migracji:**

- `expo-sqlite` — relacyjna baza, idealnie pasuje do Twojego znormalizowanego modelu. Najbliżej Javy/JPA. **Polecam.**
- `MMKV` — szybkie KV, ale wciąż KV
- WatermelonDB — moc, ale dużo nauki

**Decyzja:** SQLite jako cel długoterminowy. Ale teraz `AsyncStorage` jest OK na MVP.

### 4. Nawigacja — Tabs vs Stack vs Modal

Aktualnie wszystko jest w Tabs. To się złamie, gdy dodasz:

- Ekran „Edytuj ćwiczenie" → przyciemnione tło, przyciski wstecz
- Ekran „Wybór ćwiczenia do dodania do treningu" → modal slide‑up
- Ekran „Szczegóły serii" → push z prawej

**Idiomatycznie w Expo Router:** mieszanka. Główny `_layout` to Tabs, ale każdy tab może być Stackiem (zagnieżdżonym).

**Decyzja:** w Fazie 2 zrób przegląd nawigacji i ułóż hierarchię zanim dodasz nowe ekrany.

### 5. Stan globalny — kiedy go potrzebujesz?

Aktualnie nie masz stanu globalnego — każdy ekran ładuje swoje dane z repo. To jest **dobre** dla MVP.

Pojawi się problem gdy:

- Edytujesz ćwiczenie w jednym ekranie, w drugim widzisz starą wersję (do czasu re‑fetch)
- Chcesz pokazać badge „aktywny trening trwa" w tab barze

**Wtedy zastanów się nad:**

- `Zustand` (lekki, polecany dla RN, brak boilerplate)
- `Jotai` (atomy, jeszcze lżejszy)
- React Context (wbudowany, dla małej skali)

❌ **Nie używaj Redux ani RxJS.** Pierwszy to over‑engineering dla Twojej skali, drugi (RxJS) — wiem że znasz z Angulara, ale w RN to nie ekosystem.

**Decyzja:** odłóż do Fazy 3.

### 6. Backup i bezpieczeństwo danych

App offline‑first = jak telefon padnie, Twoje 2 lata treningów znikają. **W Fazie 2 lub 3** dodaj:

- **Eksport** całego storage do JSON pliku (`expo-file-system` + `expo-sharing`)
- **Import** z pliku
- **Sync z Google Drive / iCloud** — to już V2 feature

### 7. Testowanie na własnej skórze

Najlepszy test = używanie. Ale nie ufaj sobie:

- **Po Fazie 1 — 2 tygodnie używania na siłowni** zanim ruszysz Fazę 2
- Notuj UX bugi w `.github/ux-notes.md` na żywo
- Po 2 tygodniach zrób retrospektywę: co bolało? Co byś zmienił? To kieruje priorytetami.

---

## 🎓 Plan nauki równolegle

To, co dobrze byłoby ogarnąć **w trakcie tej pracy**, koncepcyjnie:

| Faza | Czego się uczysz                                                                        |
| ---- | --------------------------------------------------------------------------------------- |
| 0    | `useEffect` + cleanup, async/await w React, `expo-router` params                        |
| 1    | Forms w RN, kontrola `TextInput`, `FlatList` vs `ScrollView`, modale, navigation params |
| 2    | `useCallback`/`useMemo` (kiedy NIE używać), Context API, custom hooks, Zod, Jest        |
| 3    | Wykresy (`react-native-svg`), daty (`date-fns`), pickery                                |
| 4    | SQLite, migracje schematu, performance profiling                                        |

---

## 💡 Rekomendowana sekwencja startowa

Pierwsze 4 kroki, w kolejności:

1. **Naprawa zapisu treningu** (Faza 0.1) — przygotuję diff
2. **Sprzątanie martwego kodu** (Faza 0.2) — 5 minut
3. **Tworzenie nowego dnia treningowego** (Faza 1.1) — pierwsza prawdziwa nowa funkcja
4. **Dodawanie ćwiczeń do dnia** (Faza 1.2) — drugi kawałek puzzla

Po tych 4 krokach masz **w pełni używalną aplikację**. Reszta to polish.

---

## 📝 Konwencje pracy

- Każdy task zaczynam od propozycji diffa (zgodnie z `copilot-instructions.md`)
- Commit'y robisz Ty, ja proponuję wiadomości w formacie `feat: ...` / `fix: ...` / `refactor: ...`
- Komendy `npm`/`expo` w bloku kodu, uruchamiasz lokalnie
- Bugi z używania → `.github/ux-notes.md` (do założenia po Fazie 1)
- Roadmapa żyje — aktualizujemy `[ ]` → `[x]` w miarę postępów

---

> **Pierwszy krok do wyboru:** Faza 0.1 (zapis treningu) albo Faza 0.2 (sprzątanie). Sugerowane: **0.1**, bo bez tego cała reszta nie ma sensu na realnym sprzęcie.
