# FEAT-005: Design do Conteúdo Editorial Semântico

**Spec**: `.specs/features/FEAT-005-Editorial-Content/spec.md`
**Status**: Approved

---

## Visão Geral da Arquitetura (Architecture Overview)

O conteúdo editorial reside no container principal `<main id="conteudo">` e é composto por 6 seções semânticas estruturadas com acessibilidade e ritmo de leitura confortável.

---

## Componentes (Components)

### EditorialSections
- **Objetivo**: Fornecer leitura estruturada e navegável por tecnologias assistivas.
- **Localização**: `index.html`, `src/css/layout.css` e `src/css/components.css`
- **Interfaces**: Elementos semânticos `<section>`, `<h3>`, `<p>` e `<cite>`.
- **Dependências**: `src/css/tokens.css`.

---

## Estratégia de Tratamento de Erros (Error Handling Strategy)
- Uso de `rel="noopener noreferrer"` protege contra exploração do objeto `window.opener`.

---

## Riscos e Preocupações (Risks & Concerns)
- Vulnerabilidades de segurança em links externos: mitigadas pelo uso de rel="noopener noreferrer" em todos os links externos.
