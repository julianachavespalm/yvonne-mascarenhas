# ADR-005: Integração Oficial e Resiliente do Widget VLibras

- **Status**: Aceito (Ativo — sincronizado com `AD-005` em `.specs/STATE.md`)
- **Data**: 2026-11-13
- **Decisores**: Juliana Chaves Palm (Software Engineer & Solution Designer)

---

## 1. Contexto e Declaração do Problema
A inclusão de pessoas surdas cujo primeiro idioma é a Língua Brasileira de Sinais (Libras) requer tradução do conteúdo da página. Entretanto, scripts de terceiros podem bloquear a renderização inicial ou falhar caso a CDN externa esteja indisponível.

## 2. Decisão e Justificativa
1. Posicionar os containers exigidos pelo VLibras (`[vw]`, `[vw-access-button]`, `[vw-plugin-wrapper]`) e a tag `<script src="https://vlibras.gov.br/app/vlibras-plugin.js">` imediatamente antes do fechamento de `</body>`.
2. Encapsular a instanciação em uma verificação defensiva (`if (window.VLibras && typeof window.VLibras.Widget === 'function')`), tanto no script inline do HTML quanto na função `initVLibras` do ponto de entrada (`src/js/main.js`), garantindo que oscilações de rede na CDN externa jamais interrompam a execução da página.

## 3. Consequências e Verificação
- **Positivas**: Acessibilidade em Libras sem impacto no LCP e com isolamento completo contra falhas de terceiros.
- **Verificação Automatizada**: Testado em `tests/accessibility-and-dom.test.js`.
