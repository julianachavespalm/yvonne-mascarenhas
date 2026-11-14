# FEAT-007: Design da Linha do Tempo de Prêmios e Honrarias

**Spec**: `.specs/features/FEAT-007-Awards-Timeline/spec.md`
**Status**: Approved

---

## Visão Geral da Arquitetura (Architecture Overview)

A `.timeline` é implementada puramente em CSS sobre elementos semânticos HTML:
- Cada `.timeline-item` possui seu `.timeline-year` e seus parágrafos `.timeline-text`.
- Uma linha vertical contínua conectada por pseudo-elementos `::before` conduz o olhar do leitor pelos marcos históricos.

---

## Componentes (Components)

### AwardsTimeline
- **Objetivo**: Apresentar a cronologia de reconhecimentos científicos da pioneira.
- **Localização**: `index.html` e `src/css/components.css`
- **Interfaces**: Estrutura HTML e classes CSS.
- **Dependências**: `src/css/tokens.css`.

---

## Estratégia de Tratamento de Erros (Error Handling Strategy)
- Em telas compactas, o layout preserva a legibilidade através de espaçamento proporcional sem sobreposição de textos.

---

## Riscos e Preocupações (Risks & Concerns)
- Perda da ordem cronológica dos prêmios: prevenida pela ordenação decrescente estrita de 2021 a 1998 com tags time semânticas.
