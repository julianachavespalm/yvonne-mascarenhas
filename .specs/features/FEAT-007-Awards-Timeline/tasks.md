# FEAT-007-Awards-Timeline: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas desta especificação segundo o fluxo de Spec-Driven Development (SDD).

---

**Design**: `.specs/features/FEAT-007-Awards-Timeline/design.md`
**Status**: Done
**Spec Owner**: Juliana Chaves Palm
**Build**: `node scripts/validate-sdd.mjs`
**Run unit**: `node --test`

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| --- | --- | --- | --- | --- |
| `index.html` & `src/css/components.css` | unit / integration | Cronologia de anos e marcadores CSS | `tests/` | `node --test` |

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| --- | --- | --- |
| Quick | Após alterações na linha do tempo | `node --test` |
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

### T1: Implementação da Linha do Tempo
**O que**: Estruturar os marcos temporais e marcadores CSS em `index.html` e `src/css/components.css`.
**Onde**: `index.html`, `src/css/components.css`
**Depende de**: Nenhum
**Reutiliza**: Tokens CSS
**Requisito**: FEAT-007

**Concluído quando**:
- [x] Regras de negócio implementadas com sucesso
- [x] Verificação de gate aprovada

**Testes**: unit / integration
**Gate**: quick

---

### T2: Validação Automatizada de Prêmios
**O que**: Validar presença de todos os marcos históricos com testes automatizados.
**Onde**: `tests/accessibility-and-dom.test.js`
**Depende de**: T1
**Reutiliza**: Runner nativo do Node.js
**Requisito**: FEAT-007

**Concluído quando**:
- [x] Todos os testes passando com sucesso
- [x] Verificação de gate aprovada: `node --test`

**Testes**: unit / integration
**Gate**: build

---

## Verificações (Checks)

**C1** - Linha do tempo de prêmios contém todos os 8 marcos históricos em ordem cronológica decrescente (2021 a 1998)
Proof: run unit | ✔ FEAT-007: Linha do tempo de prêmios contém todos os 8 marcos históricos em ordem cronológica decrescente (2021 a 1998)

---

## Transição (Handoff)

**Resolvido durante o build:** Linha do tempo histórica estruturada e validada segundo as diretrizes SDD.
**Despachado:** Validado e aprovado com sucesso.
**Auditado:** Confirmado via testes automatizados.
