# FEAT-007: Especificação da Linha do Tempo de Prêmios e Honrarias

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

A Dra. Yvonne Mascarenhas acumulou dezenas de títulos e prêmios históricos ao longo de mais de seis décadas dedicadas à ciência brasileira. A linha do tempo organiza os marcos em ordem cronológica decrescente (de 2021 até 1991), com leitura escaneável, marcadores elegantes e alto contraste.

### História de Usuário (User Story)

**Como** pesquisador ou estudante interessado nas condecorações científicas da pioneira,

**Eu quero** consultar uma linha do tempo organizada cronologicamente com anos e honrarias destacados,

**Para que** eu possa compreender a evolução histórica e o reconhecimento institucional da cientista com rapidez.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Linha do tempo editorial com marcos de 2021 a 1991 | Estabelece leitura cronológica intuitiva para pesquisa histórica | Filtro interativo complexo por tipo de prêmio | O volume de honrarias é ideal para visualização em página única |
| Marcadores visuais semânticos em CSS (`::before`) | Constrói a estética de linha do tempo com zero scripts JS | Animação de entrada dos itens no scroll | Reduz acessibilidade para usuários com sensibilidade a movimento |
| Suporte total a Alto Contraste com texto de alto contraste | Garante contraste WCAG 2.2 AAA em todos os marcos | Caixas de texto coloridas com bordas decorativas | Poluem visualmente a leitura no modo de acessibilidade |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Ordem Cronológica):** O sistema DEVE ordenar os marcos históricos em ordem cronológica decrescente, iniciando em 2021 e encerrando em 1991.
- **RN-02 (Marcos Históricos Essenciais):** A linha do tempo DEVE conter os marcos de 2021, 2019, 2017, 2014, 2013, 2006, 2000, 1998 e 1991.
- **RN-03 (Estilo Editorial sem Ruído):** O sistema DEVE destacar os anos com tipografia em negrito (`.timeline-year`) sem utilizar bordas decorativas em torno dos parágrafos no modo de Alto Contraste.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato DOM:** `<div class="timeline"><div class="timeline-item"><div class="timeline-year">YYYY</div><p class="timeline-text">...</p></div>...</div>`.
- **Invariantes e SLAs:** Leitura contínua em mobile e desktop, contraste no ano >= 4.5:1 (padrão) e >= 19:1 (alto contraste).
- **Dependências Internas:** Tokens de cores (`src/css/tokens.css`) e componentes (`src/css/components.css`).

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que a seção de prêmios é renderizada, **Quando** a linha do tempo for inspecionada, **Então** o sistema DEVE apresentar os marcos cronológicos em ordem decrescente contendo os anos de 2021 a 1991.
- **CA-02:** **Dado** que o tema de Alto Contraste está ativo, **Quando** a linha do tempo for exibida, **Então** o sistema DEVE manter os marcadores e textos legíveis com contraste WCAG 2.2 AAA.

### Casos de Borda (Edge Cases)

- **EC-01:** Anos com mais de uma homenagem (como 2021 e 2013) DEVEM agrupar as condecorações dentro do mesmo bloco temporal.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01, RN-02, RN-03 / CA-01, CA-02 | `index.html`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` -> FEAT-007 |
