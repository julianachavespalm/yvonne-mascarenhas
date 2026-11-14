# ADR-006: Engenharia de Tokens do Design System e Calibração Luminosa WCAG 2.2 AA/AAA

- **Status**: Aceito (Ativo — sincronizado com `AD-006` em `.specs/STATE.md`)
- **Data**: 2026-11-13
- **Decisores**: Juliana Chaves Palm (Software Engineer & Solution Designer)

---

## 1. Contexto e Declaração do Problema
Sistemas editoriais em tema escuro frequentemente falham nos critérios de contraste da WCAG 2.2 quando utilizam tons de cor sem verificação matemática de luminância. Além disso, no modo de Alto Contraste (WCAG AAA), o uso indiscriminado de bordas coloridas em textos prejudica a leitura fluida, e estados `:hover` mal calibrados podem reduzir o contraste dos controles ativos.

## 2. Direcionadores de Decisão
- **Conformidade Matemática WCAG 2.2 AA e AAA**: Aplicar a equação de razão de contraste da W3C $CR = (L_{\text{claro}} + 0.05) / (L_{\text{escuro}} + 0.05)$ a todos os pares de cores do Design System.
- **Ergonomia de Leitura**: Eliminar bordas decorativas desnecessárias em títulos, citações e listas, mantendo contornos de alto contraste apenas em controles interativos (`<button>`).
- **Invariância de Contraste em `:hover`**: Garantir que o estado `:hover` no modo `high-contrast` mantenha contraste $\ge 19.5:1$ tanto em botões inativos quanto no botão ativo (`[aria-pressed="true"]`).

## 3. Decisão e Justificativa
Estruturamos `src/css/tokens.css` (`FEAT-009-Design-System`) com tokens centralizados:
1. **Tema Padrão (`:root`)**:
   - `--bg: #0b0e14` ($L = 0.0125$) — Fundo principal escuro profundo.
   - `--surface: #131823` — Superfície de controles e cartões.
   - `--text: #ffffff` ($L = 1.0000$) — Texto primário e títulos ($CR \ge 18.0:1$, AAA).
   - `--text-muted: #9ba1a6` — Texto secundário e legendas ($CR \ge 6.0:1$, AA).
   - `--accent-red: #e63946` — Acento tipográfico e anel de foco ($CR \ge 4.5:1$, AA).
   - `--accent-blue: #4a90e2` — Acento secundário.
   - `--border-timeline: #2a3446` — Divisórias estruturais.
2. **Tema de Alto Contraste (`[data-theme="high-contrast"]`)**:
   - Fundo preto absoluto `--bg: #000000` com texto branco `--text: #ffffff` ($21:1$, AAA).
   - Destaques em amarelo `--accent-red: #ffff00` ($19.56:1$, AAA) e ciano `--accent-blue: #00ffff` ($16.75:1$, AAA).
   - Botões com borda de alto contraste e estado `:hover` invertendo para fundo amarelo `#ffff00` com texto preto `#000000` ($19.56:1$, AAA).

## 4. Consequências e Verificação
- **Positivas**: Design editorial moderno, leitura limpa e contraste auditado matematicamente em todos os estados.
- **Verificação Automatizada**: Validado em `tests/accessibility-and-dom.test.js`.
