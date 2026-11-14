# FEAT-006: Design da Experiência de Vídeo Lazy-Loaded

**Spec**: `.specs/features/FEAT-006-Video-Experience/spec.md`
**Status**: Approved

---

## Visão Geral da Arquitetura (Architecture Overview)

O componente `.video-card` utiliza CSS moderno com `aspect-ratio: 16 / 9` e atributo `loading="lazy"` para incorporar vídeos históricos do YouTube mantendo alto desempenho e zero impacto de CLS.

---

## Componentes (Components)

### VideoCard
- **Objetivo**: Renderizar vídeos com proporção fixa e carregamento eficiente.
- **Localização**: `index.html` e `src/css/components.css`
- **Interfaces**: Elementos HTML e classes CSS.
- **Dependências**: `src/css/tokens.css`.

---

## Estratégia de Tratamento de Erros (Error Handling Strategy)
- Se a conexão falhar, a moldura preta reserva o espaço de 16/9 sem desorganizar a leitura.

---

## Riscos e Preocupações (Risks & Concerns)
- Cumulative Layout Shift (CLS) antes de carregar o vídeo: mitigado pelo uso de aspect-ratio 16/9 nativo no container.
