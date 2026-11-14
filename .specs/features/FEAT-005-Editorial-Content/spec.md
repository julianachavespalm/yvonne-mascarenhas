# FEAT-005: Especificação do Conteúdo Editorial Semântico

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-001: CSS em 4 Camadas](../../decisions/ADR-001-css-layers.md), [ADR-006: Design System](../../decisions/ADR-006-design-system-wcag-palette.md) |
| **Implementação** | `index.html`, `src/css/layout.css`, `src/css/components.css` |
| **Verificação** | `tests/accessibility-and-dom.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

O artigo biográfico sobre a Dra. Yvonne Mascarenhas abrange sua trajetória pioneira na cristalografia, formação acadêmica, contribuições educacionais, prêmios e referências primárias. As seções devem possuir rotulagem semântica inequívoca (`aria-labelledby`), citações no padrão científico ABNT e links externos seguros.

### História de Usuário (User Story)

**Como** leitor interessado na história da ciência brasileira e no papel das mulheres na pesquisa,

**Eu quero** ler um artigo estruturado com títulos claros, citações científicas e referências verificadas,

**Para que** eu possa compreender a relevância das contribuições da homenageada com fidelidade histórica e rigor conceitual.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Estruturação semântica com 6 seções identificadas por `aria-labelledby` | Facilita a navegação de leitores de tela via landmarks semânticos | Paginação artificial em múltiplas páginas | Artigo biográfico deve ser lido de forma contínua |
| Caixa de citação científica no padrão ABNT | Facilita a citação acadêmica em pesquisas | Sistema de comentários ou fórum de discussão | O escopo do projeto é puramente editorial |
| Links externos protegidos com `rel="noopener noreferrer"` | Impede vulnerabilidades de segurança como tabnabbing reverso | Abertura de links externos em popups ou iframes | Viola convenções de acessibilidade e segurança |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Semântica de Seções):** O sistema DEVE estruturar as 6 seções principais (`#introducao`, `#cristalografia`, `#formacao`, `#premios`, `#conclusao`, `#referencias`) vinculadas a títulos correspondentes via atributo `aria-labelledby`.
- **RN-02 (Citação Científica):** A seção de referências DEVE conter caixa de citação no padrão ABNT contendo título, autoria de Juliana Chaves Palm e data de publicação (20 nov. 2023).
- **RN-03 (Segurança em Links):** Todos os hiperlinks direcionados a sites externos com `target="_blank"` DEVEM conter estritamente `rel="noopener noreferrer"`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato DOM:** Seções vinculadas via `<section id="x" aria-labelledby="titulo-x"><h3 id="titulo-x">...`.
- **Invariantes e SLAs:** Leitura fluida com largura de coluna confortável (`max-width: 840px`), zero bordas desnecessárias em textos.
- **Dependências Internas:** Tokens CSS (`src/css/tokens.css`) e componentes (`src/css/components.css`).

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que as 6 seções editoriais são renderizadas, **Quando** o leitor de tela inspecionar os marcos da página, **Então** o sistema DEVE apresentar cada seção com seu rótulo acessível via `aria-labelledby`.
- **CA-02:** **Dado** que o artigo possui hiperlinks externos, **Quando** o código HTML for inspecionado, **Então** o sistema DEVE conter `rel="noopener noreferrer"` em todos os links externos.

### Casos de Borda (Edge Cases)

- **EC-01:** Links externos com protocolo seguro `https://` DEVEM ser utilizados para garantir integridade na navegação.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01, RN-03 / CA-01, CA-02 | `index.html` | `tests/accessibility-and-dom.test.js` -> FEAT-005 |
