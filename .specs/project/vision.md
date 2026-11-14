# Visão Executiva do Produto — Homenagem Editorial à Dra. Yvonne Mascarenhas

## 1. Declaração de Propósito e Problema
A trajetória de cientistas brasileiras pioneiras frequentemente carece de registros digitais que combinem **rigor histórico, arquitetura de software enxuta e acessibilidade universal plena**. Esta aplicação resolve essa lacuna ao prestar tributo à **Dra. Yvonne Primerano Mascarenhas** (1931–), matriarca da cristalografia estrutural por difração de raios-X no Brasil, Professora Emérita da USP/CNPq e defensora histórica da participação de mulheres nas áreas STEM.

O projeto foi concebido como uma **referência de engenharia de software front-end**, demonstrando na prática:
1. **Spec-Driven Development (SDD)** com histórias de usuário padronizadas (**Como / Eu quero / Para que**), critérios **Dado / Quando / Então** e rastreabilidade ponta a ponta até os testes automatizados.
2. **Arquitetura Modular Enxuta (`ADR-004`)** em JavaScript ES6 nativo (5 módulos coesos orientados a features em `src/js/`, eliminando over-engineering).
3. **Test-Driven Development (TDD)** sem dependências externas de runtime, utilizando o runner nativo do Node.js (`node --test`).
4. **Design System & Acessibilidade Universal (WCAG 2.2 AA e AAA)** com tokens semânticos auditados matematicamente (`FEAT-009-Design-System`).

---

## 2. Personas e Perfis de Uso

| Persona | Necessidade Principal | Requisitos Críticos Atendidos |
| :--- | :--- | :--- |
| **Pesquisadores, Estudantes e Educadores STEM** | Consultar biografia verificada, linha do tempo de honrarias científicas, vídeos históricos da USP/CNPq e referências primárias (ABNT, ABC, FAPESP, Lattes). | Hierarquia editorial escaneável (`FEAT-001`, `FEAT-005`), vídeos responsivos lazy-loaded (`FEAT-006`) e linha do tempo semântica (`FEAT-007`). |
| **Pessoas com Baixa Visão ou Fotofobia** | Ampliar a tipografia sem quebra de layout e alternar para tema de Alto Contraste real (WCAG 2.2 AAA ≥ 7:1) com persistência entre visitas. | Escala tipográfica fluida e persistente (`FEAT-003`), Alto Contraste AAA `21:1` com foto preservada (`FEAT-004`) e Design System calibrado (`FEAT-009`). |
| **Leitores com Navegação por Teclado e Leitores de Tela** | Navegar rapidamente por marcos semânticos usando Skip Link, menu responsivo e atalhos dedicados (`Alt+1` a `Alt+4`), com feedback auditivo em região `aria-live`. | Barra de navegação responsiva em linha única ou menu hambúrguer, Skip Link e atalhos `Alt+1..4` (`FEAT-002`). |
| **Comunidade Surda (Usuários de Libras)** | Traduzir o conteúdo textual científico para a Língua Brasileira de Sinais (Libras) sem degradação da página. | Integração não-bloqueante e resiliente do widget oficial VLibras (`FEAT-008`). |
| **Avaliadores Técnicos, Arquitetos e Engenheiros** | Auditar a rastreabilidade entre especificação (`.specs/`), decisões arquiteturais (`STATE.md` / ADRs), código enxuto (`src/js/`) e testes (`tests/`). | Ciclo SDD completo validado por scripts automatizados (`npm run validate:specs` e `npm test`). |

---

## 3. Indicadores de Sucesso (SLIs / KPIs de Engenharia)

| Indicador | Meta (Target) | Mecanismo de Verificação |
| :--- | :--- | :--- |
| **Rastreabilidade SDD** | 100% dos requisitos mapeados em `spec.md` → `design.md` → `tasks.md` → testes automatizados | `npm run validate:specs` (`node scripts/validate-sdd.mjs`) |
| **Cobertura de Módulos e Features** | 100% dos módulos (`theme-contrast`, `font-scale`, `navigation`, `safe-storage`, `main`) cobertos por testes | `npm test` (`node --test`) |
| **Razão de Contraste Visual (Tema Padrão)** | ≥ 4.5:1 para texto normal (AA), atingindo `> 18:1` (AAA) no texto primário | Auditoria de luminância em `tests/accessibility-and-dom.test.js` |
| **Razão de Contraste Visual (Alto Contraste)** | ≥ 7.0:1 em todos os elementos e estados `:hover` (AAA, atingindo `19.56:1` a `21:1`) | Auditoria de luminância em `tests/accessibility-and-dom.test.js` |
| **Performance de Renderização** | `LCP < 2.5s`, `CLS < 0.1`, `INP < 200ms`, zero scripts síncronos bloqueantes no `<head>` | Testes estruturais de HTML/DOM em `tests/accessibility-and-dom.test.js` |
