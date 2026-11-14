# FEAT-001: Especificação do Hero Editorial Desacoplado

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-001: CSS em 4 Camadas](../../decisions/ADR-001-css-layers.md), [ADR-003: Hero Editorial Desacoplado](../../decisions/ADR-003-hero-editorial.md), [ADR-006: Design System](../../decisions/ADR-006-design-system-wcag-palette.md) |
| **Implementação** | `index.html`, `src/css/layout.css`, `src/assets/yvonne.png` |
| **Verificação** | `tests/accessibility-and-dom.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

O topo editorial de uma homenagem científica biográfica deve apresentar a homenageada com máxima dignidade e clareza visual. O layout desacopla o retrato da Dra. Yvonne Mascarenhas de qualquer bloco tipográfico sobreposto, preservando a visualização nítida de seu rosto e dos diagramas de difração de raios-X em todas as resoluções de tela.

### História de Usuário (User Story)

**Como** estudante ou pesquisador interessado na biografia e pioneirismo científico da Dra. Yvonne Mascarenhas,

**Eu quero** visualizar o retrato oficial da cientista e os títulos do artigo de forma nítida e harmoniosa,

**Para que** eu possa reconhecer a homenageada imediatamente e iniciar a leitura do artigo sem obstruções visuais sobre a fotografia.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Bloco tipográfico `.hero-content` com título semântico, tags, subtítulo e metadados de autoria | Estabelece autoridade e contexto editorial rigoroso | Carrossel de fotos ou animações em tela cheia | Polui a apresentação e prejudica o tempo de carregamento (LCP) |
| Container `.hero-photo-wrapper` isolado para a fotografia oficial | Garante que o rosto da homenageada jamais receba textos sobrepostos | Edição ou recorte dinâmico via scripts JavaScript | Resolução tratada nativamente por CSS sem custo computacional |
| Borda contrastante no modo de Alto Contraste | Garante visibilidade da imagem sobre fundo preto no tema de acessibilidade | Ocultação da foto no modo de Alto Contraste | A imagem não possui textos sobrepostos e deve ser preservada |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Separação Estrutural):** O sistema DEVE estruturar o topo editorial dividindo a seção `.hero` em dois elementos irmãos independentes: `.hero-content` (para tipografia) e `.hero-photo-wrapper` (para a imagem oficial).
- **RN-02 (Semântica e Metadados):** O bloco `.hero-content` DEVE conter o título principal `<h2>`, tags temáticas ("Ciência", "Educação", "Brasil"), subtítulo ("Senhora dos Cristais") e linha de autoria com data ("Por Juliana Chaves Palm ▪ 20 nov. 2023").
- **RN-03 (Preservação no Alto Contraste):** QUANDO o atributo `data-theme="high-contrast"` for ativado no elemento raiz, o sistema NÃO DEVE ocultar a fotografia oficial e DEVE aplicar borda nítida de `2px solid #ffffff` ao redor da imagem.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato DOM/CSS:** `<section class="hero"><div class="hero-content">...</div><div class="hero-photo-wrapper"><img class="hero-photo" ...></div></section>`.
- **Invariantes e SLAs:** Proporção responsiva sem distorção angular, LCP < 2.0s, razão de contraste no texto primário > 18:1 (WCAG 2.2 AAA).
- **Dependências Internas:** Tokens de cores (`src/css/tokens.css`) e regras de layout (`src/css/layout.css`).

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que o visitante acessa a página em qualquer resolução de tela, **Quando** o topo editorial for renderizado, **Então** o sistema DEVE exibir o bloco `.hero-content` separado de `.hero-photo-wrapper`, preservando a visibilidade total do retrato da cientista.
- **CA-02:** **Dado** que a seção do topo é carregada, **Quando** os elementos textuais forem exibidos, **Então** o sistema DEVE apresentar a linha de autoria com data ("Por Juliana Chaves Palm ▪ 20 nov. 2023").
- **CA-03:** **Dado** que o tema de Alto Contraste está ativo (`data-theme="high-contrast"`), **Quando** o visitante visualizar a seção `.hero`, **Então** o sistema DEVE manter a fotografia visível e aplicar borda contrastante branca.

### Casos de Borda (Edge Cases)

- **EC-01:** Em janelas com largura superior a 1440px (ultrawide), o container DEVE manter o grid editorial alinhado sem esticar a imagem além da sua densidade ótima.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01 / CA-01 | `index.html`, `src/css/layout.css` | `tests/accessibility-and-dom.test.js` -> FEAT-001 |
| RN-02 / CA-02 | `index.html` | `tests/accessibility-and-dom.test.js` -> FEAT-001 |
| RN-03 / CA-03 | `src/css/layout.css` | `tests/accessibility-and-dom.test.js` -> FEAT-001 |
