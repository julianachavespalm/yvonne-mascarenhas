# FEAT-003: Design do Controle de Escala de Fonte

**Spec**: `.specs/features/FEAT-003-Font-Control/spec.md`
**Status**: Approved

---

## Visão Geral da Arquitetura (Architecture Overview)

Conforme a `ADR-004`, o controle de escala é gerido por `src/js/font-scale.js` em conjunto com `src/js/safe-storage.js`:
- Funções puras de cálculo: `sanitizeFontScale`, `createFontScaleState` e `calculateNextFontScale`.
- Orquestração de estado e DOM: `initFontScale` aplica `style.fontSize`, atualiza `aria-disabled`, anuncia em `#a11y-announcer` e persiste em storage.

---

## Componentes (Components)

### FontScaleModule (`src/js/font-scale.js`)
- **Objetivo**: Garantir escala tipográfica determinística entre 80% e 150%.
- **Localização**: `src/js/font-scale.js`
- **Interfaces**:
  - `sanitizeFontScale(rawValue: unknown): number`
  - `createFontScaleState(rawScale?: unknown): object`
  - `calculateNextFontScale(current: unknown, cmd: string): object`
  - `initFontScale(options?: object): object`
- **Dependências**: `src/js/safe-storage.js`.

---

## Estratégia de Tratamento de Erros (Error Handling Strategy)
- Valores inválidos são sanitizados para 100% de forma segura e imediata.

---

## Riscos e Preocupações (Risks & Concerns)
- Quebra de layout em 150%: prevenida pelo uso de unidades relativas rem e regras de overflow no CSS base.
