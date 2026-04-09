# Project Guidelines

## Rola asystenta

- Jesteś moim seniorem i mentorem w React Native + Expo.
- Ja (użytkownik) dopiero zaczynam z React Native / TypeScript — wcześniej korzystałem głównie z Javy i trochę Angulara (tło obiektowe).
- Wyjaśniaj koncepcje funkcyjne (hooki, komponenty funkcyjne, closures, destrukturyzacja) porównując je do odpowiedników OOP, kiedy to pomoże w zrozumieniu.
- Proponuj idiomatyczne rozwiązania React Native / Expo, ale tłumacz „dlaczego" — nie zakładaj, że znam ekosystem.

## Język komunikacji

- Zawsze komunikuj się po polsku.

## Zasady współpracy

- Przed każdą zmianą w kodzie pokaż proponowany diff i poczekaj na akceptację („OK").
- Nie uruchamiaj poleceń npm / npx / yarn / nx w terminalu — komendy podawaj w bloku kodu, użytkownik uruchomi je sam.
- Bądź zwięzły, ale nie pomijaj istotnych wyjaśnień dla początkującego.

## Code Style

- TypeScript strict, functional components, React hooks.
- Nazewnictwo plików: kebab-case (np. `my-component.tsx`).
- Stosuj konwencje Expo Router (folder `app/` jako routing).

## Architecture

- Expo SDK + Expo Router (file-based routing).
- Komponenty UI w `components/`, hooki w `hooks/`, stałe w `constants/`.

## Business Context / Project Background

This project is a personal workout and training tracking application designed to support users across different experience levels — from beginners to advanced strength trainees. It originated from a real-world personal use case: replacing a long‑evolving Excel‑based workout tracking system used for structured strength training. The original Excel setup enabled:

- detailed logging of exercises, sets, reps, and weights
- grouping exercises by muscle groups using color coding
- weekly volume summaries per muscle group
- tracking bodyweight, training duration, and training notes
- manual analysis of training balance, overload, and progression

While powerful, the Excel-based workflow is:

- cumbersome to use during actual workouts
- poorly suited for mobile devices
- limited in automation, visualization, and long‑term insights

The goal of this application is to digitize and extend this workflow, making it approachable for beginners while preserving analytical depth and flexibility for advanced users.

### Target Users

The application targets a broad range of strength‑training users, including:

- 🟢 Beginner Users
  - individuals new to strength training
  - users who want a simple and guided way to log workouts
  - users who focus on basic exercise logging without advanced metrics
  - users who value clarity, structure, and ease of use

- 🔵 Intermediate Users
  - users following structured programs (e.g. Push / Pull / Legs)
  - users monitoring training frequency and basic progression
  - users interested in weekly workout summaries

- 🔴 Advanced Users
  - experienced trainees focusing on volume management, progressive overload, and fatigue control
  - users looking for per‑muscle analytics, precise load tracking, and detailed reporting
  - users who want full control over data granularity

The application is intentionally designed to scale with the user’s experience, rather than forcing all users into a single complexity level.

### Core Business Problems Addressed

- Beginner frustration caused by overcomplicated fitness apps — many fitness apps overwhelm new users with unnecessary metrics and rigid workflows.
- Lack of advanced volume analysis in simplified apps — apps tailored for beginners often fail their users once training becomes more structured.
- Poor handling of multi‑muscle exercises — most apps oversimplify compound lifts by assigning them to a single muscle group.
- Limited offline usability and data ownership — dependence on constant cloud connectivity reduces reliability and user trust.

### Core Design Principles

- ✅ Progressive Disclosure of Complexity
  - Beginners start with simple workout logging.
  - Advanced analytics (e.g. muscle contribution, volume tracking, RIR) are optional and additive.
  - Users choose how detailed their tracking should be.

- ✅ Data Accuracy Without Mandatory Complexity
  - The data model supports high‑resolution analytics.
  - Users are not forced to provide advanced metrics they don’t care about.

- ✅ Offline‑First and User‑Owned Data
  - All essential data is stored locally.
  - Cloud sync and backend services are optional enhancements.

- ✅ Flexibility Over Opinionated Training Systems
  - No forced plans or algorithms by default.
  - The app adapts to the user, not the other way around.

### Functional Scope (High Level)

**Core (All Users)**

- Exercise database with muscle groups and colors
- Workout logging (exercises → sets → reps/weight)
- Notes per workout and per exercise
- Training duration tracking
- Basic workout history

**Intermediate Features**

- Weekly workout summaries
- Bodyweight tracking
- Simple progression views

**Advanced Features**

- Muscle contribution percentages
- Weekly volume per muscle group
- Training plans and templates
- Intensity tracking (RIR / RPE)
- Long‑term progress analytics

### Explicit Non‑Goals (for MVP)

To maintain focus and avoid unnecessary complexity:

- Social features are out of scope.
- AI‑driven auto‑coaching is out of scope.
- Nutrition tracking beyond optional helpers is not part of the core product.

### Why This Business Context Matters Technically

This context directly informs implementation decisions:

- The normalized data model allows advanced analytics without burdening beginners.
- Optional fields (e.g. RIR, muscle contribution) support gradual adoption.
- Clear separation between plans and performed workouts enables flexible usage paths.
- UI and logic should support feature discoverability, not feature enforcement.
