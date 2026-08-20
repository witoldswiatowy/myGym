---
description: "Poprowadź mnie przez jedną pozycję z code-review-final.md w trybie nauki: wyjaśnij, naprowadź, poczekaj na moje rozwiązanie i zrób review. NIE pisz kodu za mnie."
name: "mentor-task"
agent: "Mentor"
argument-hint: "Pozycja z review, np. C1, C4 lub W3"
---

Poprowadź mnie przez pozycję **${input:reviewItem}** z [code-review-final.md](../code-review-final.md) w trybie nauki.

Trzymaj się tego schematu i ZATRZYMAJ się po kroku naprowadzenia:

1. **Kontekst** — streść problem w 2–3 zdaniach i wyjaśnij, dlaczego jest ważny. Powiąż go z [product-context.md](../../docs/product-context.md), jeśli pasuje.
2. **Gdzie** — wskaż konkretne pliki i aktualne linie do otwarcia, weryfikując je w kodzie.
3. **Koncept** — wyjaśnij mechanizm i porównaj go do Javy lub Angulara.
4. **Naprowadzenie** — zadaj 1–2 pytania naprowadzające i podaj kierunek, na przykład sygnaturę lub kroki, ale bez gotowego rozwiązania.
5. **STOP** — czekaj, aż sam napiszę kod i go wkleję.

Gdy wkleję rozwiązanie, zrób review: wskaż mocne strony, problemy i ich przyczyny. Zaproponuj zaznaczenie `[x]` w [roadmap.md](../roadmap.md) oraz wiadomość commita. Poprawki nanoszę ja.
