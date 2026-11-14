# STATE

## Decisões

### AD-001
- **Decisão**: Adotar arquitetura CSS nativa em 4 camadas isoladas (`tokens.css` → `base.css` → `layout.css` → `components.css`) sem pré-processadores ou empacotadores (`ADR-001-css-layers.md`).
- **Motivo**: Garantir cascata previsível, separação estrita de responsabilidades (ITCSS simplificado) e carregamento imediato zero-build (`LCP < 2.5s`).
- **Trade-off**: Ausência de minificação por bundler, mitigada por arquivos CSS compactos e multiplexação HTTP/2.
- **Escopo**: `src/css/*`, `index.html`, `FEAT-001` a `FEAT-009`.
- **Data**: 2026-11-13
- **Status**: Active

### AD-002
- **Decisão**: Controlar o tema de Alto Contraste via atributo semântico `data-theme="high-contrast"` no elemento raiz `<html>` combinado com `aria-pressed` no controle acionador, sem adicionar bordas decorativas ao redor de elementos de texto (`ADR-002-data-theme.md`).
- **Motivo**: Permitir sobrescrita determinística de variáveis CSS (`:root` vs `[data-theme="high-contrast"]`) com conformidade WCAG 2.2 AAA (`21:1` em texto e `19.56:1` em estados ativos e `:hover`), preservando fluidez de leitura sem poluição visual.
- **Trade-off**: Exige que todos os componentes consumam exclusivamente tokens de `src/css/tokens.css`.
- **Escopo**: `src/css/tokens.css`, `src/css/components.css`, `src/js/theme-contrast.js`, `FEAT-004`, `FEAT-009`.
- **Data**: 2026-11-13
- **Status**: Active

### AD-003
- **Decisão**: Desacoplar o bloco tipográfico (`.hero-content`) do container da fotografia (`.hero-photo-wrapper` / `.hero-visual`) no Hero Editorial, mantendo a fotografia visível com borda branca no modo `high-contrast` (`ADR-003-hero-editorial.md`).
- **Motivo**: Garantir que o retrato da Dra. Yvonne Mascarenhas e os diagramas cristalográficos jamais sejam encobertos pelo título principal em qualquer resolução e preservar a imagem no modo de Alto Contraste já que não há texto sobreposto.
- **Trade-off**: Layout em 2 colunas no topo desktop (`.hero-intro-grid`) alinhando Hero e Introdução.
- **Escopo**: `index.html`, `src/css/layout.css`, `FEAT-001`, `FEAT-004`.
- **Data**: 2026-11-13
- **Status**: Active

### AD-004
- **Decisão**: Organizar a camada JavaScript em 5 módulos ES6 coesos e planos em `src/js/`: `safe-storage.js`, `theme-contrast.js`, `font-scale.js`, `navigation.js` e `main.js`, sem etapa de build (`ADR-004-lean-modular-architecture.md`).
- **Motivo**: Proporcionalidade de Solution Design para uma aplicação web editorial estática, mantendo 100% de acessibilidade WCAG 2.2 AAA, resiliência de `localStorage` com fallback em `Map` e testabilidade unitária determinística via injeção opcional de dependências.
- **Trade-off**: Módulos concentram lógica pura e acoplamento intencional com DOM no mesmo arquivo de feature, dispensando camadas abstratas intermediárias.
- **Escopo**: `src/js/*`, `tests/*`, `FEAT-002`, `FEAT-003`, `FEAT-004`.
- **Data**: 2026-11-14
- **Status**: Active

### AD-005
- **Decisão**: Integrar o widget oficial VLibras (`vlibras-plugin.js`) de forma não-bloqueante ao final do `<body>` com guarda defensiva de instanciação (`ADR-005-vlibras-official.md`).
- **Motivo**: Garantir tradução oficial para Língua Brasileira de Sinais (Libras) sem impactar o First Contentful Paint (FCP) nem falhar caso a CDN externa esteja indisponível.
- **Trade-off**: Dependência da CDN governamental (`vlibras.gov.br`) apenas para renderização do avatar 3D.
- **Escopo**: `index.html`, `src/js/main.js`, `FEAT-008`.
- **Data**: 2026-11-13
- **Status**: Active

### AD-006
- **Decisão**: Formalizar o Design System sobre uma paleta escura calibrada matematicamente (`--bg: #0b0e14`, `--surface: #131823`, `--accent-red: #e63946`, `--accent-blue: #4a90e2`, `--text: #ffffff`, `--text-muted: #9ba1a6`) e tokens de Alto Contraste AAA (`#000000`, `#ffffff`, `#ffff00`, `#00ffff`) (`ADR-006-design-system-wcag-palette.md`).
- **Motivo**: Garantir conformidade matemática WCAG 2.2 AA/AAA em todos os pares de cores do tema padrão e do tema de Alto Contraste.
- **Trade-off**: Governança centralizada de variáveis em `src/css/tokens.css`.
- **Escopo**: `src/css/tokens.css`, `tests/accessibility-and-dom.test.js`, `FEAT-009`.
- **Data**: 2026-11-13
- **Status**: Active

---

## Mapeamento de Features e Arquivos

| Feature ID | Nome | Status | Arquivos de Implementação | Arquivos de Teste |
| :--- | :--- | :--- | :--- | :--- |
| `FEAT-001` | Hero Editorial | Concluído (`Verificado`) | `index.html`, `src/css/layout.css`, `src/assets/yvonne.png` | `tests/accessibility-and-dom.test.js` |
| `FEAT-002` | Navegação Semântica, Menu e Atalhos | Concluído (`Verificado`) | `index.html`, `src/css/components.css`, `src/js/navigation.js`, `src/js/main.js` | `tests/navigation.test.js`, `tests/accessibility-and-dom.test.js` |
| `FEAT-003` | Redimensionamento Fluido & Escala de Fonte | Concluído (`Verificado`) | `src/css/base.css`, `src/js/font-scale.js`, `src/js/safe-storage.js` | `tests/font-scale.test.js` |
| `FEAT-004` | Modo de Alto Contraste AAA | Concluído (`Verificado`) | `src/css/tokens.css`, `src/css/components.css`, `src/js/theme-contrast.js`, `src/js/safe-storage.js` | `tests/theme-contrast.test.js`, `tests/accessibility-and-dom.test.js` |
| `FEAT-005` | Conteúdo Editorial Semântico | Concluído (`Verificado`) | `index.html`, `src/css/layout.css`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` |
| `FEAT-006` | Experiência de Vídeo Lazy-Loaded | Concluído (`Verificado`) | `index.html`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` |
| `FEAT-007` | Linha do Tempo de Prêmios | Concluído (`Verificado`) | `index.html`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` |
| `FEAT-008` | Integração Resiliente VLibras | Concluído (`Verificado`) | `index.html`, `src/js/main.js` | `tests/accessibility-and-dom.test.js` |
| `FEAT-009` | Design System & Tokens WCAG | Concluído (`Verificado`) | `src/css/tokens.css`, `src/css/base.css`, `src/css/layout.css`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` |

---

## Transição

- **Feature**: `FEAT-001` a `FEAT-009` (Ciclo completo SDD, Arquitetura Modular Enxuta `AD-004`, TDD, Design System e Acessibilidade WCAG 2.2 AA/AAA)
- **Fase**: Concluído
- **Concluídas**: `FEAT-001`, `FEAT-002`, `FEAT-003`, `FEAT-004`, `FEAT-005`, `FEAT-006`, `FEAT-007`, `FEAT-008`, `FEAT-009`
- **Em andamento**: nenhuma
- **Próximo passo**: Commit inicial de portfólio.
- **Bloqueios**: nenhum
- **Arquivos não commitados**: Prontos para commit inicial limpo.
- **Branch**: `main`
