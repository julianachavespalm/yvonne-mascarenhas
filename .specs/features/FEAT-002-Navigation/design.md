# FEAT-002: Design de Navegação Semântica, Menu Responsivo e Atalhos

**Spec**: `.specs/features/FEAT-002-Navigation/spec.md`
**Status**: Approved

---

## Visão Geral da Arquitetura (Architecture Overview)

Conforme a `ADR-004`, o módulo `src/js/navigation.js` consolida o menu responsivo e o despachante de atalhos de teclado de acessibilidade:
- **`resolveShortcut`**: Função pura que avalia eventos de teclado e valida modificadores.
- **`focusLandmark`**: Garante foco acessível em marcos do DOM com atribuição dinâmica de `tabindex="-1"`.
- **`initNavigation`**: Gerencia listeners de clique, teclado e redimensionamento de janela.

---

## Componentes (Components)

### NavigationModule (`src/js/navigation.js`)
- **Objetivo**: Controlar o menu responsivo e os atalhos de teclado.
- **Localização**: `src/js/navigation.js`
- **Interfaces**:
  - `resolveShortcut(eventLike): object | null`
  - `focusLandmark(doc, selector): boolean`
  - `initNavigation({ doc, win }): object`
- **Dependências**: Nenhuma dependência externa.

---

## Estratégia de Tratamento de Erros (Error Handling Strategy)
- Marcos ausentes no DOM não causam exceção; `focusLandmark` retorna `false` defensivamente.

---

## Riscos e Preocupações (Risks & Concerns)
- Colisão com atalhos de navegador: mitigada pelo bloqueio estrito de eventos com `ctrlKey`, `metaKey` ou `shiftKey`.
