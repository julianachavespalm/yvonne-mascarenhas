# FEAT-006-Video-Experience: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas desta especificação segundo o fluxo de Spec-Driven Development (SDD).

---

**Design**: `.specs/features/FEAT-006-Video-Experience/design.md`
**Status**: Done
**Spec Owner**: Juliana Chaves Palm
**Build**: `node scripts/validate-sdd.mjs`
**Run unit**: `node --test`

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| --- | --- | --- | --- | --- |
| `index.html` & `src/css/components.css` | unit / integration | Aspect-ratio 16/9, lazy loading e títulos acessíveis | `tests/` | `node --test` |

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| --- | --- | --- |
| Quick | Após alterações nos cards de vídeo | `node --test` |
| Full | Validação de integração completa | `node --test` |
| Build | Após conclusão das tarefas | `node scripts/validate-sdd.mjs && node --test` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Implementação e Verificação

```
T1 -> T2
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Implementação dos Componentes de Vídeo
**O que**: Implementar containers com `aspect-ratio: 16/9` e iframes com `loading="lazy"`.
**Onde**: `index.html`, `src/css/components.css`
**Depende de**: Nenhum
**Reutiliza**: Tokens CSS
**Requisito**: FEAT-006

**Concluído quando**:
- [x] Regras de negócio implementadas com sucesso
- [x] Verificação de gate aprovada

**Testes**: unit / integration
**Gate**: quick

---

### T2: Validação Automatizada de Vídeos
**O que**: Validar proporção e propriedades de carregamento sob demanda com testes automatizados.
**Onde**: `tests/accessibility-and-dom.test.js`
**Depende de**: T1
**Reutiliza**: Runner nativo do Node.js
**Requisito**: FEAT-006

**Concluído quando**:
- [x] Todos os testes passando com sucesso
- [x] Verificação de gate aprovada: `node --test`

**Testes**: unit / integration
**Gate**: build

---

## Verificações (Checks)

**C1** - Cards de vídeo utilizam aspect-ratio 16/9, lazy loading, títulos acessíveis e figcaptions
Proof: run unit | ✔ FEAT-006: Cards de vídeo utilizam aspect-ratio 16/9, lazy loading, títulos acessíveis e figcaptions

---

## Transição (Handoff)

**Resolvido durante o build:** Incorporação de vídeos otimizada e validada segundo as diretrizes SDD.
**Despachado:** Validado e aprovado com sucesso.
**Auditado:** Confirmado via testes automatizados.
