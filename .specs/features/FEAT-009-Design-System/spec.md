# FEAT-009: Especificação do Design System e Tokens WCAG 2.2 AA/AAA

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-001: CSS em 4 Camadas](../../decisions/ADR-001-css-layers.md), [ADR-002: data-theme no html](../../decisions/ADR-002-data-theme.md), [ADR-006: Design System](../../decisions/ADR-006-design-system-wcag-palette.md) |
| **Implementação** | `src/css/tokens.css`, `src/css/base.css`, `src/css/layout.css`, `src/css/components.css` |
| **Verificação** | `tests/accessibility-and-dom.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

Uma interface acessível e de alta qualidade estética exige um Design System formal, com tokens de cores e tipografia rigorosamente calibrados pelas fórmulas matemáticas de contraste da W3C. Este Design System governa tanto o tema padrão escuro quanto o tema de Alto Contraste AAA, eliminando o uso de bordas decorativas ao redor de textos para preservar a clareza da leitura.

### História de Usuário (User Story)

**Como** designer de interface ou auditor de conformidade de acessibilidade digital,

**Eu quero** contar com tokens de cores e tipografia auditados matematicamente para os temas padrão e de alto contraste,

**Para que** a aplicação mantenha harmonia visual e conformidade absoluta com as diretrizes WCAG 2.2 AA e AAA.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Definição centralizada de tokens em `src/css/tokens.css` | Ponto único de verdade para cores, fontes e espaçamento | Ferramentas de geração de tokens pesadas em build | A aplicação opera em modo nativo zero-build |
| Prova matemática automatizada das razões de contraste | Garante conformidade contra regressões visuais em CI | Troca arbitrária de fontes por preferências do usuário | A identidade visual editorial deve ser consistente |
| Eliminação de bordas decorativas em textos no Alto Contraste | Garante leitura limpa e fluida sem caixas amarelas poluindo | Bordas em controles interativos | Botões necessitam de delimitação para identificação |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Contraste no Tema Padrão):** O sistema DEVE garantir razão de contraste mínima de `18:1` para texto primário sobre fundo escuro (`#ffffff` sobre `#0b0e14`), `6:1` para texto secundário (`#9ba1a6`) e `4.5:1` para destaques (`#e63946`).
- **RN-02 (Contraste no Alto Contraste):** O sistema DEVE garantir razão de contraste de `21:1` para texto branco sobre fundo preto (`#ffffff` sobre `#000000`), `19.56:1` para acentos amarelos (`#ffff00`) e `16.75:1` para acentos cianos (`#00ffff`).
- **RN-03 (Interação em Hover):** No modo de Alto Contraste, botões em estado `:hover` DEVEM inverter para fundo amarelo `#ffff00` com texto preto `#000000` (`19.56:1`).
- **RN-04 (Ordem Estrita das 4 Camadas):** O sistema DEVE carregar as folhas de estilo na ordem sequencial: `tokens.css` -> `base.css` -> `layout.css` -> `components.css`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato CSS:** Tokens definidos em `:root` e sobrescritos em `[data-theme="high-contrast"]`.
- **Invariantes e SLAs:** WCAG 2.2 Nível AAA em textos principais e Alto Contraste; respeito a `prefers-reduced-motion: reduce`.
- **Dependências Internas:** `src/css/tokens.css`, `src/css/base.css`, `src/css/layout.css`, `src/css/components.css`.

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** o tema padrão ativo, **Quando** o contraste for calculado, **Então** o sistema DEVE apresentar contraste superior a 18:1 para texto primário e superior a 4.5:1 para elementos de destaque.
- **CA-02:** **Dado** o tema de Alto Contraste ativo, **Quando** o cursor passar sobre um botão de acessibilidade (`:hover`), **Então** o sistema DEVE inverter para fundo amarelo `#ffff00` e texto preto `#000000` mantendo contraste superior a 19:1.
- **CA-03:** **Dado** que a página carrega seus estilos, **Quando** a ordem dos links for verificada, **Então** o sistema DEVE vincular as 4 camadas CSS na ordem estrita definida na arquitetura.

### Casos de Borda (Edge Cases)

- **EC-01:** Sob preferência do sistema operacional por movimento reduzido (`prefers-reduced-motion: reduce`), todas as animações e o `scroll-behavior: smooth` DEVEM ser desativados.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01, RN-02, RN-03 / CA-01, CA-02 | `src/css/tokens.css`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` -> FEAT-009 & AD-006 |
| RN-04 / CA-03 | `index.html`, `src/css/base.css` | `tests/accessibility-and-dom.test.js` -> ADR-001 |
