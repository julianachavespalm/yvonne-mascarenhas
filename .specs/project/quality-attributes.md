# Atributos de Qualidade (SLAs, SLIs e Garantias de Engenharia)

## 1. Acessibilidade (WCAG 2.2 Níveis AA e AAA)
A acessibilidade é tratada como invariante arquitetural verificada por testes automatizados (`tests/accessibility-and-dom.test.js`, `tests/theme-contrast.test.js`, `tests/font-scale.test.js` e `tests/navigation.test.js`).

| Requisito WCAG 2.2 | Critério | Meta Quantitativa (SLI) | Implementação e Prova |
| :--- | :--- | :--- | :--- |
| **1.4.3 Contrast (Minimum) — AA** | Contraste de texto normal no tema padrão (`--bg: #0b0e14`) | `≥ 4.5:1` (Texto primário `#ffffff` atinge **`> 18:1`**; Texto secundário `#9ba1a6` atinge **`> 6:1`**; Destaque `#e63946` atinge **`> 4.5:1`**) | Calculado pela fórmula de luminância relativa da W3C em `tests/accessibility-and-dom.test.js`. |
| **1.4.6 Contrast (Enhanced) — AAA** | Contraste no modo `data-theme="high-contrast"` (`#000000`) | `≥ 7.0:1` (Texto branco `#ffffff` atinge **`21.0:1`**; Destaques `#ffff00` atingem **`19.56:1`**; Links `#00ffff` atingem **`16.75:1`**) | Verificado matematicamente na suíte de testes e aplicado via `src/css/tokens.css` e `src/js/theme-contrast.js`. |
| **1.4.4 Resize Text — AA** | Escalonamento de fonte sem perda de conteúdo ou funcionalidade | Suporte fluido ao zoom nativo e limites de `80%` a `150%` em passos de `10%` com sanitização de estado | `src/js/font-scale.js` + anúncio em `aria-live="polite"` + testes em `tests/font-scale.test.js`. |
| **2.1.1 Keyboard & 2.4.1 Bypass Blocks — A** | Operabilidade integral via teclado e salto de blocos repetitivos | Skip Link visível no `Tab` inicial + menu hambúrguer acessível + atalhos globais `Alt+1` a `Alt+4` | `src/js/navigation.js` + atributos `accesskey` nativos + testes em `tests/navigation.test.js`. |
| **2.4.11 Focus Appearance & 2.5.8 Target Size — AA** | Indicador de foco inequívoco e área mínima de toque/clique | Foco `3px solid` com `outline-offset: 3px`; controles interativos com área confortável | `src/css/base.css` e `src/css/components.css`. |
| **2.3.3 Animation from Interactions — AAA** | Respeito à preferência de movimento reduzido do sistema operacional | Desativação instantânea de `scroll-behavior: smooth` e transições sob `@media (prefers-reduced-motion: reduce)` | `src/css/base.css`. |

---

## 2. Performance e Eficiência Operacional (Core Web Vitals)

| Métrica | Meta (SLO) | Estratégia de Engenharia |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 2.5s` | Zero JavaScript bloqueante no `<head>`, `preconnect` para fontes, CSS modular nativo sem etapa de build. |
| **CLS (Cumulative Layout Shift)** | `< 0.1` | Proporção explícita `aspect-ratio: 16 / 9` nos containers `.video-frame` antes do carregamento dos iframes. |
| **INP (Interaction to Next Paint)** | `< 200ms` | Manipulação cirúrgica de atributos DOM (`data-theme`, `aria-expanded`, `style.fontSize`) em complexidade $O(1)$ nos 5 módulos enxutos (`ADR-004`). |
| **Isolamento de Terceiros** | Não-bloqueante | Iframes do YouTube com `loading="lazy"` e widget VLibras carregado apenas no fechamento do `<body>`. |

---

## 3. Resiliência, Confiabilidade e Tolerância a Falhas

- **Degradação Silenciosa de Armazenamento (`src/js/safe-storage.js`)**: Caso `window.localStorage` lance `SecurityError` ou `QuotaExceededError` (ex.: navegação anônima restrita ou bloqueio de cookies), `safe-storage.js` captura a exceção e opera silenciosamente com um `Map` em memória durante a sessão sem interromper a experiência do usuário.
- **Saneamento de Estado Corrompido**: Valores inválidos gravados manualmente no `localStorage` (como `"NaN"`, `"999"`, `"-50"` ou strings arbitrárias) são sanitizados por `sanitizeFontScale` (`src/js/font-scale.js`) e `resolveThemeFromStorage` (`src/js/theme-contrast.js`), retornando ao estado seguro padrão (`100%` / `default`).
- **Isolamento de Widget Externo (VLibras)**: A inicialização verifica defensivamente a presença de `window.VLibras.Widget` antes de instanciar o widget (`index.html` e `src/js/main.js`), impedindo que falhas de rede na CDN governamental afetem os módulos locais.

---

## 4. Testabilidade Determinística (`ADR-004`)

- **Suíte Orientada a Features**: Os 4 arquivos de teste (`tests/accessibility-and-dom.test.js`, `tests/theme-contrast.test.js`, `tests/font-scale.test.js` e `tests/navigation.test.js`) validam diretamente as regras puras, a integração com o DOM e os contratos de acessibilidade em menos de `300ms` via `node --test`.
