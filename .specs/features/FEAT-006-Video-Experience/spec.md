# FEAT-006: Especificação da Experiência de Vídeo Lazy-Loaded

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-001: CSS em 4 Camadas](../../decisions/ADR-001-css-layers.md), [ADR-006: Design System](../../decisions/ADR-006-design-system-wcag-palette.md) |
| **Implementação** | `index.html`, `src/css/components.css` |
| **Verificação** | `tests/accessibility-and-dom.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

O acervo audiovisual histórico da Dra. Yvonne Mascarenhas (entrevistas da USP e pronunciamentos) enriquece a narrativa biográfica. A incorporação dos vídeos deve priorizar o desempenho de renderização, garantindo proporção `16:9` para eliminar saltos de layout (CLS = 0) e carregamento sob demanda (`loading="lazy"`).

### História de Usuário (User Story)

**Como** leitor ou estudante que prefere absorver conteúdos também em formato audiovisual,

**Eu quero** assistir às entrevistas históricas da Dra. Yvonne Mascarenhas sem que a página trave ou mude de posição durante o carregamento,

**Para que** eu possa assistir aos depoimentos com alta definição visual e sem atrasos na navegação do artigo.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Proporção nativa `aspect-ratio: 16 / 9` nos cartões de vídeo | Elimina deslocamento cumulativo de layout (CLS = 0) | Player de vídeo proprietário hospedado localmente | O YouTube provê infraestrutura de streaming e transcrição |
| Atributo `loading="lazy"` em todos os iframes | Adia o carregamento de recursos pesados até que estejam próximos do viewport | Reprodução automática com áudio (autoplay) | Viola normas WCAG e causa ruído cognitivo ao leitor |
| Legendas explicativas e títulos descritivos em cada iframe | Facilita a identificação do conteúdo para tecnologias assistivas | Download direto do arquivo de vídeo | Fora do modelo de incorporação do acervo da USP |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Proporção Responsiva):** O container `.video-frame` DEVE definir estritamente `aspect-ratio: 16 / 9` em CSS para reservar espaço prévio na renderização.
- **RN-02 (Carregamento Otimizado):** Todos os elementos `<iframe>` de vídeo DEVEM conter o atributo `loading="lazy"`.
- **RN-03 (Identificação Acessível):** Todos os elementos `<iframe>` DEVEM possuir atributo `title` descritivo em português informando o conteúdo histórico daquele vídeo.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato DOM:** `<div class="video-card"><div class="video-frame"><iframe title="..." loading="lazy" ...></iframe></div><p>...</p></div>`.
- **Invariantes e SLAs:** CLS = 0, carregamento sob demanda, responsividade em todas as larguras.
- **Dependências Internas:** Tokens CSS (`src/css/tokens.css`) e componentes (`src/css/components.css`).

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que a seção de vídeos é renderizada, **Quando** o navegador carregar o layout, **Então** o sistema DEVE manter proporção 16/9 e aplicar `loading="lazy"` nos iframes.
- **CA-02:** **Dado** que os 3 vídeos históricos são renderizados, **Quando** inspecionados por leitores de tela, **Então** o sistema DEVE fornecer títulos acessíveis e legendas descritivas.

### Casos de Borda (Edge Cases)

- **EC-01:** Caso o leitor esteja offline, a moldura do vídeo DEVE manter suas dimensões sem colapsar a estrutura da página.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01, RN-02, RN-03 / CA-01, CA-02 | `index.html`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` -> FEAT-006 |
