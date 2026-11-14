# FEAT-001: Design do Hero Editorial Desacoplado

**Spec**: `.specs/features/FEAT-001-Hero-Editorial/spec.md`
**Status**: Approved

---

## Visão Geral da Arquitetura (Architecture Overview)

O componente `<section class="hero">` organiza o topo editorial na primeira coluna do grid `.hero-intro-grid` (`ADR-003`):
- **`.hero-content`**: Bloco contendo a tipografia editorial (título com spans destacados, tags, subtítulo e linha editorial de autoria e data).
- **`.hero-photo-wrapper`**: Container da fotografia da cientista (`src/assets/yvonne.png`), garantindo enquadramento ideal sem texto sobreposto ao rosto.
- **Modo Alto Contraste**: Em `[data-theme="high-contrast"]`, a imagem recebe borda contrastante `2px solid #ffffff`.

---

## Componentes (Components)

### HeroSection (`.hero`)
- **Objetivo**: Apresentar o retrato e a identificação da cientista com clareza editorial.
- **Localização**: `index.html` e `src/css/layout.css`
- **Interfaces**: Estrutura semântica HTML e classes CSS.
- **Dependências**: `src/css/tokens.css`, `src/assets/yvonne.png`.

---

## Estratégia de Tratamento de Erros (Error Handling Strategy)
- Resoluções atípicas mantêm a proporção fluida da imagem através de regras CSS nativas (`width: 100%`, `height: auto`, `max-width: 600px`).

---

## Riscos e Preocupações (Risks & Concerns)
- Sobreposição de texto sobre o rosto: eliminada estruturalmente com o desacoplamento em elementos irmãos independentes.
