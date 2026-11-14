# FEAT-003-Font-Control: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas desta especificação segundo o fluxo de Spec-Driven Development (SDD).

---

**Design**: `.specs/features/FEAT-003-Font-Control/design.md`
**Status**: Done
**Spec Owner**: Juliana Chaves Palm
**Build**: `node scripts/validate-sdd.mjs`
**Run unit**: `node --test`

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| --- | --- | --- | --- | --- |
| `src/js/font-scale.js` | unit / integration | Limites 80%..150%, sanitização e persistência | `tests/` | `node --test` |

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| --- | --- | --- |
| Quick | Após testes unitários | `node --test` |
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

### T1: Implementação do Módulo de Escala de Fonte
**O que**: Implementar limites, sanitização e manipulação do DOM em `src/js/font-scale.js`.
**Onde**: `src/js/font-scale.js`, `src/js/safe-storage.js`
**Depende de**: Nenhum
**Reutiliza**: `src/js/safe-storage.js`
**Requisito**: FEAT-003

**Concluído quando**:
- [x] Regras de negócio implementadas com sucesso
- [x] Verificação de gate aprovada

**Testes**: unit / integration
**Gate**: quick

---

### T2: Validação Automatizada de Escala Tipográfica
**O que**: Validar funções puras e integração de escala com testes em português.
**Onde**: `tests/font-scale.test.js`
**Depende de**: T1
**Reutiliza**: Runner nativo do Node.js
**Requisito**: FEAT-003

**Concluído quando**:
- [x] Todos os testes passando com sucesso
- [x] Verificação de gate aprovada: `node --test`

**Testes**: unit / integration
**Gate**: build

---

## Verificações (Checks)

**C1** - Limites de escala, sanitização e transição de passos
Proof: run unit | ✔ FEAT-003: sanitizeFontScale e calculateNextFontScale aplicam limites de 80% a 150%, passo de 10% e sanitizam entradas corrompidas

**C2** - Orquestração de aumento, diminuição, reset e persistência no safeStorage
Proof: run unit | ✔ FEAT-003: initFontScale orquestra aumento, diminuição, reset, anúncio em aria-live e persistência no safeStorage

---

## Transição (Handoff)

**Resolvido durante o build:** Módulo de escala tipográfica implementado e testado segundo as diretrizes SDD.
**Despachado:** Validado e aprovado com sucesso.
**Auditado:** Confirmado via testes automatizados.
