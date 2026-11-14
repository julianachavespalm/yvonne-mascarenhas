# FEAT-002-Navigation: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas desta especificação segundo o fluxo de Spec-Driven Development (SDD).

---

**Design**: `.specs/features/FEAT-002-Navigation/design.md`
**Status**: Done
**Spec Owner**: Juliana Chaves Palm
**Build**: `node scripts/validate-sdd.mjs`
**Run unit**: `node --test`

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| --- | --- | --- | --- | --- |
| `src/js/navigation.js` & `index.html` | unit / integration | Atalhos Alt+1..4, menu responsivo e marcos no DOM | `tests/` | `node --test` |

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| --- | --- | --- |
| Quick | Após testes unitários de navegação | `node --test` |
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

### T1: Implementação do Módulo de Navegação
**O que**: Implementar o controle de menu responsivo e o despachante de atalhos em `src/js/navigation.js`.
**Onde**: `src/js/navigation.js`, `src/js/main.js`
**Depende de**: Nenhum
**Reutiliza**: Estilos de `src/css/components.css`
**Requisito**: FEAT-002

**Concluído quando**:
- [x] Regras de negócio implementadas com sucesso
- [x] Verificação de gate aprovada

**Testes**: unit / integration
**Gate**: quick

---

### T2: Validação Automatizada de Navegação
**O que**: Validar atalhos e menu com testes unitários em português.
**Onde**: `tests/navigation.test.js`, `tests/accessibility-and-dom.test.js`
**Depende de**: T1
**Reutiliza**: Runner nativo do Node.js
**Requisito**: FEAT-002

**Concluído quando**:
- [x] Todos os testes passando com sucesso
- [x] Verificação de gate aprovada: `node --test`

**Testes**: unit / integration
**Gate**: build

---

## Verificações (Checks)

**C1** - Mapeamento puro de atalhos Alt+1..4 e rejeição de modificadores conflitantes
Proof: run unit | ✔ FEAT-002: resolveShortcut mapeia Alt+1..4 para marcos semânticos e rejeita modificadores conflitantes

**C2** - Controle de menu hambúrguer, foco em marcos e inicialização via bootstrapApp
Proof: run unit | ✔ FEAT-002: initNavigation alterna aria-expanded no menu hambúrguer, foca marcos via atalhos e bootstrapApp inicializa os módulos

**C3** - Marcos semânticos, skip link e alvos de atalho no DOM
Proof: run unit | ✔ FEAT-002: Marcos de navegação, skip-link e alvos de atalhos de teclado existem em index.html

---

## Transição (Handoff)

**Resolvido durante o build:** Módulo de navegação implementado e testado segundo as diretrizes SDD.
**Despachado:** Validado e aprovado com sucesso.
**Auditado:** Confirmado via testes automatizados.
