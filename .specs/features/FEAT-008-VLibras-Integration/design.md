# FEAT-008: Design da Integração do Widget VLibras

**Spec**: `.specs/features/FEAT-008-VLibras-Integration/spec.md`
**Status**: Approved

---

## Visão Geral da Arquitetura (Architecture Overview)

Conforme as decisões `ADR-004` e `ADR-005`, a integração é tratada com padrão Circuit Guard defensivo:
- Script externo posicionado no final do `<body>`.
- Guarda condicional impede `ReferenceError` caso a CDN falhe.
- Função `initVLibras` exportada em `src/js/main.js` para testes e inicialização segura.

---

## Componentes (Components)

### VLibrasBootstrap
- **Objetivo**: Inicializar o tradutor de Libras com resiliência.
- **Localização**: `index.html` e `src/js/main.js`
- **Interfaces**: `initVLibras(win): boolean`.
- **Dependências**: CDN pública `vlibras.gov.br`.

---

## Estratégia de Tratamento de Erros (Error Handling Strategy)
- Falhas de rede na CDN externa são absorvidas silenciosamente sem afetar os scripts da página.

---

## Riscos e Preocupações (Risks & Concerns)
- Indisponibilidade de script externo: mitigada pelo carregamento deferido no final do body e checagem defensiva de existência da API.
