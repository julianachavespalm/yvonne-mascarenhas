# FEAT-008: Especificação da Integração do Widget VLibras

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-004: Arquitetura Modular Enxuta](../../decisions/ADR-004-lean-modular-architecture.md), [ADR-005: Integração Oficial VLibras](../../decisions/ADR-005-vlibras-official.md) |
| **Implementação** | `index.html`, `src/js/main.js` |
| **Verificação** | `tests/accessibility-and-dom.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

Pessoas da comunidade surda usuárias da Língua Brasileira de Sinais (Libras) necessitam de suporte acessível para consumir conteúdos científicos biográficos em português. O widget oficial VLibras é integrado no fechamento do `<body>` de forma não-bloqueante e protegido por guarda defensiva para garantir que instabilidades de rede na CDN governamental não afetem a página.

### História de Usuário (User Story)

**Como** pessoa surda usuária da Língua Brasileira de Sinais (Libras),

**Eu quero** acionar o avatar do VLibras na lateral da página para traduzir o artigo,

**Para que** eu possa acessar os conteúdos sobre a vida da cientista na minha língua primária com autonomia.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Integração oficial do widget governamental VLibras | Ferramenta pública padrão e amplamente adotada no Brasil | Criação de dicionário próprio de Libras | O Governo Federal mantém a base oficial e os modelos 3D |
| Posicionamento ao final do `<body>` com guarda defensiva | Impede bloqueio do parser HTML e isola falhas de terceiros | Carregamento síncrono no `<head>` | Bloquearia o carregamento inicial (FCP e LCP) |
| Compatibilidade com os módulos de acessibilidade locais | O widget opera paralelamente ao Alto Contraste e à escala | Customização profunda dos shaders do avatar | A biblioteca oficial não expõe API para alteração de shaders |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Marcação e Script):** O sistema DEVE posicionar os containers `[vw]`, `[vw-access-button]` e `[vw-plugin-wrapper]` e a tag do script oficial `https://vlibras.gov.br/app/vlibras-plugin.js` ao final do `<body>`.
- **RN-02 (Guarda Defensiva):** A inicialização do widget DEVE ser protegida condicionalmente com `if (window.VLibras && typeof window.VLibras.Widget === 'function')`.
- **RN-03 (Isolamento de Falhas):** QUANDO a CDN do VLibras estiver offline ou bloqueada, o sistema NÃO DEVE lançar exceções não tratadas no console que interrompam os módulos locais.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato Módulo:** `src/js/main.js` exporta `initVLibras(win)` retornando booleano de disponibilidade.
- **Invariantes e SLAs:** Zero impacto no First Contentful Paint (FCP), isolamento total de erros externos.
- **Dependências Externas:** Script CDN governamental (`https://vlibras.gov.br/app/vlibras-plugin.js`).

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que a página é carregada, **Quando** o documento for interpretado, **Então** o sistema DEVE conter a marcação oficial do VLibras e a guarda defensiva de instanciação.
- **CA-02:** **Dado** que a biblioteca `window.VLibras` está disponível, **Quando** a função `initVLibras` for executada, **Então** o sistema DEVE instanciar o widget e registrar estado de inicialização.

### Casos de Borda (Edge Cases)

- **EC-01:** Em ambientes de teste ou sem conexão à internet, a ausência de `window.VLibras` DEVE ser tratada sem lançar erro.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01, RN-02, RN-03 / CA-01, CA-02 | `index.html`, `src/js/main.js` | `tests/accessibility-and-dom.test.js` -> FEAT-008 |
