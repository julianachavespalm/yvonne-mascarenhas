# ADR-002: Máquina de Estados de Tema via Atributo `data-theme` no `<html>`

- **Status**: Aceito (Ativo — sincronizado com `AD-002` em `.specs/STATE.md`)
- **Data**: 2026-11-13
- **Decisores**: Juliana Chaves Palm (Software Engineer & Solution Designer)

---

## 1. Contexto e Declaração do Problema
Usuários com baixa visão, catarata ou fotofobia severa necessitam de um modo de Alto Contraste que atenda ao nível **WCAG 2.2 AAA** (razão de contraste ≥ 7:1). Implementações tradicionais alternam classes CSS em múltiplos elementos ou carregam folhas de estilo separadas, gerando Flash of Unstyled Content (FOUC) e inconsistência de estado com leitores de tela.

## 2. Direcionadores de Decisão
- **Conformidade WCAG 2.2 AAA**: Contraste mínimo de `7:1` em todos os textos e controles (atingindo `21:1` entre branco `#ffffff` e preto `#000000`, e `19.56:1` no amarelo `#ffff00`).
- **Acessibilidade Semântica (WAI-ARIA)**: O controle acionador deve informar seu estado exato a leitores de tela via `aria-pressed="true|false"`.
- **Desacoplamento de Componentes**: Nenhum componente JS deve recalcular cores manualmente.

## 3. Opções Consideradas
1. **Opção A — Folha de estilo condicional carregada via JS**: Causa atraso de rede e FOUC na troca de tema.
2. **Opção B — Classe no `<body>` com seletores descendentes por componente**: Alta duplicação de CSS.
3. **Opção C (Escolhida) — Atributo `data-theme="high-contrast"` no elemento raiz `<html>` (`document.documentElement`)**: Redefine os tokens semânticos diretamente em `tokens.css`.

## 4. Decisão e Justificativa
Adotamos a **Opção C**. Quando o módulo `src/js/theme-contrast.js` ativa o Alto Contraste:
1. Define `document.documentElement.setAttribute('data-theme', 'high-contrast')`.
2. Atualiza `#btn-a11y-contrast` / `#btn-high-contrast` com `aria-pressed="true"`.
3. Dispara anúncio vocal na região `aria-live="polite"` (*"Modo de alto contraste ativado"*).
4. Todos os componentes herdam automaticamente os valores AAA (`#000000`, `#ffffff`, `#ffff00`, `#00ffff`).

## 5. Consequências e Verificação
- **Positivas**: Propagação instantânea sem reflow complexo; zero acoplamento entre JavaScript e valores hexadecimais de cor.
- **Verificação Automatizada**: Coberto por testes unitários em `tests/theme-contrast.test.js` e auditoria matemática de luminância em `tests/accessibility-and-dom.test.js`.
