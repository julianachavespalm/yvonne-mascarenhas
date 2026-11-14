# ADR-001: Arquitetura CSS Nativa em 4 Camadas Isoladas (ITCSS Simplificado)

- **Status**: Aceito (Ativo — sincronizado com `AD-001` em `.specs/STATE.md`)
- **Data**: 2026-11-13
- **Decisores**: Juliana Chaves Palm (Software Engineer & Solution Designer)

---

## 1. Contexto e Declaração do Problema
Aplicações web editoriais frequentemente sofrem com dois extremos: ou adotam pipelines de build complexos para páginas que não exigem transpilação pesada, ou mantêm arquivos CSS monolíticos com colisões de especificidade, uso excessivo de `!important` e dificuldade de manutenção de temas de acessibilidade.

Como organizar a camada de apresentação para garantir isolamento de responsabilidades, suporte nativo a múltiplos temas (Padrão e Alto Contraste WCAG AAA) e carregamento imediato (`LCP < 2.5s`) sem etapa de build?

## 2. Direcionadores de Decisão (Decision Drivers)
- **Previsibilidade de Cascata**: Evitar guerras de especificidade entre regras globais, estruturais e de componentes.
- **Zero-Build / Performance Nativa**: Servir folhas de estilo diretamente pelo navegador via HTTP/2 sem necessidade de empacotamento.
- **Manutenibilidade de Tokens**: Isolar variáveis de cor, tipografia e espaçamento em um único ponto de verdade (`FEAT-009-Design-System`).

## 3. Decisão e Justificativa
Dividimos `src/css/` em quatro camadas carregadas sequencialmente no `<head>`:
1. `src/css/tokens.css`: Variáveis CSS (`:root` e `[data-theme="high-contrast"]`) sem gerar regras de renderização direta.
2. `src/css/base.css`: Reset box-sizing, tipografia base fluida, estados globais de `:focus-visible`, `.skip-link` e `@media (prefers-reduced-motion: reduce)`.
3. `src/css/layout.css`: Estruturas macro da página (`.hero`, `.hero-photo-wrapper`, `.hero-content`, `.content-wrapper`, seções).
4. `src/css/components.css`: Componentes coesos e reutilizáveis (`.header`, `.nav-links`, `.a11y-btn`, `.crimson-callout`, `.video-card`, `.timeline`).

## 4. Consequências e Verificação
- **Positivas**: Troca instantânea de tema (`O(1)`) apenas alterando `data-theme` no `<html>`; ausência total de arquivos legados conflitantes.
- **Verificação Automatizada**: Testado em `tests/accessibility-and-dom.test.js` verificando a presença e ordem exata dos `<link rel="stylesheet">` no `index.html`.
