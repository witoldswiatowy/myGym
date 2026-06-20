# COST.md — Dziennik kosztów eksperymentu migracji

> Pół-ręczny. Po każdym uruchomieniu agenta dopisz wiersz.
> Liczby premium requests odczytaj z dashboardu Copilota
> (GitHub → Settings → Copilot → Usage) lub z licznika w VS Code.
>
> Modele (opcja A — mieszana):
>
> - Opus 4.8 (drogi): Analityk, Planner, Final Reviewer
> - Sonnet 4.5 (tańszy): Orchestrator, Implementator, Reviewer-Fixer
>   Budżet eksperymentu: ~250 000 kredytów.

## Log

| #   | data       | agent        | krok (id) | model           | premium req. (z dashboardu) | iteracje                                   | uwagi | stan początkowy credytów | stan po logu |
| --- | ---------- | ------------ | --------- | --------------- | --------------------------- | ------------------------------------------ | ----- | ------------------------ | ------------ |
| 0   | 19.06.2026 |              |           | Claude Opus 4.8 | około 200                   | przygotowanie agentów                      |       |                          | 800          |
| 1   | 20.06.2026 | Orchestrator |           | Claude Opus 4.8 |                             | stworzenie mapping                         |       | 800                      | 925          |
| 2   | 20.06.2026 |              |           | Claude Opus 4.8 | 36                          | ocena mappingu w innym oknie kontekstowym  |       |                          |              |
| 3   | 20.06.2026 | Orchestrator |           | Claude Opus 4.8 | 57                          | zapisanie mappingu i odpowiedzi na pytanie |       |                          | 1000         |
| 4   | 20.06.2026 | Orchestrator | --------- | Claude Opus 4.8 | 185                         | ------------------------------------------ | ----- | 1000                     | 1200         |
| 5   | ---------- | ------------ | --------- | --------------- | --------------------------- | ------------------------------------------ | ----- | ------------------------ | ------------ |
| 6   | ---------- | ------------ | --------- | --------------- | --------------------------- | ------------------------------------------ | ----- | ------------------------ | ------------ |

## Podsumowania per checkpoint

| checkpoint | suma premium req. | liczba kroków | śr. na krok | wnioski |
| ---------- | ----------------- | ------------- | ----------- | ------- |
| CP1        |                   |               |             |         |
| CP2        |                   |               |             |         |
| CP3        |                   |               |             |         |
| CP4        |                   |               |             |         |

## Wnioski końcowe

(uzupełnij po zakończeniu eksperymentu: czy migracja multi-agentem się udała,
całkowity koszt, gdzie mocny model był konieczny, gdzie wystarczył tańszy)
