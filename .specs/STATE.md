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
- **Decisão**: Desacoplar o bloco tipográfico (`.hero-content`) do container da fotografia (`.hero-photo-wrapper`) no Hero Editorial, mantendo a fotografia visível com borda branca no modo `high-contrast` (`ADR-003-hero-editorial.md`).
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

## Auditoria de Cobertura por Feature (Matriz de Rastreabilidade)

Todas as 9 especificações formais estão 100% implementadas no código-fonte e cobertas por testes automatizados:

| Feature | Escopo e Regras de Negócio | Implementação | Prova Automatizada | Status |
| :--- | :--- | :--- | :--- | :---: |
| **FEAT-001**<br/>Hero Editorial | • `.hero-content` desacoplado de `.hero-photo-wrapper`<br/>• Retrato `src/assets/yvonne.png` sem texto sobre o rosto<br/>• Borda branca no modo Alto Contraste | `index.html`<br/>`src/css/layout.css` | `tests/accessibility-and-dom.test.js` | Verified |
| **FEAT-002**<br/>Navegação & Atalhos | • Skip link `#conteudo` no início do `<body>`<br/>• Menu hambúrguer com `aria-expanded`<br/>• Atalhos globais `Alt+1` a `Alt+4` | `index.html`<br/>`src/js/navigation.js` | `tests/navigation.test.js`<br/>`tests/accessibility-and-dom.test.js` | Verified |
| **FEAT-003**<br/>Escala de Fonte | • Limites de 80% a 150% com passo de 10%<br/>• Sanitização contra entradas corrompidas<br/>• Anúncio em `#a11y-announcer` (`aria-live`) | `src/js/font-scale.js`<br/>`src/js/safe-storage.js` | `tests/font-scale.test.js` | Verified |
| **FEAT-004**<br/>Alto Contraste | • Alternância via `data-theme="high-contrast"`<br/>• Atualização de `aria-pressed`<br/>• Degradação silenciosa em `Map` na memória | `src/js/theme-contrast.js`<br/>`src/js/safe-storage.js` | `tests/theme-contrast.test.js` | Verified |
| **FEAT-005**<br/>Conteúdo Editorial | • Seções semânticas com `aria-labelledby`<br/>• Destaque visual `.crimson-callout`<br/>• Links externos com `rel="noopener noreferrer"` | `index.html`<br/>`src/css/components.css` | `tests/accessibility-and-dom.test.js` | Verified |
| **FEAT-006**<br/>Vídeos Responsivos | • Iframes com `loading="lazy"` e títulos WAI-ARIA<br/>• Container com `aspect-ratio: 16 / 9` nativo<br/>• Descrição semântica em `<figcaption>` | `index.html`<br/>`src/css/components.css` | `tests/accessibility-and-dom.test.js` | Verified |
| **FEAT-007**<br/>Linha do Tempo | • 8 marcos cronológicos decrescentes (2021 a 1998)<br/>• Datas marcadas com `<time datetime="...">`<br/>• Marcadores visuais em CSS puro | `index.html`<br/>`src/css/components.css` | `tests/accessibility-and-dom.test.js` | Verified |
| **FEAT-008**<br/>VLibras | • Marcação oficial do avatar no fim do `<body>`<br/>• Guarda defensiva `window.VLibras.Widget`<br/>• Isolamento contra falhas de rede | `index.html`<br/>`src/js/main.js` | `tests/accessibility-and-dom.test.js` | Verified |
| **FEAT-009**<br/>Design System | • Razão de contraste W3C: Branco/Fundo > 19:1 (AAA)<br/>• Alto contraste: Amarelo/Preto > 19:1 (AAA)<br/>• Hover em alto contraste com fundo `#ffff00` e texto `#000000` | `src/css/tokens.css`<br/>`src/css/base.css` | `tests/accessibility-and-dom.test.js` | Verified |

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
