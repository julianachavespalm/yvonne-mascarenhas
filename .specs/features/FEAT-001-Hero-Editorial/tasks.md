# FEAT-001-Hero-Editorial: Tarefas

## Protocolo de Execução (Execution Plan)

Implementar e validar as tarefas desta especificação segundo o fluxo de Spec-Driven Development (SDD).

---

**Design**: `.specs/features/FEAT-001-Hero-Editorial/design.md`
**Status**: Done
**Spec Owner**: Juliana Chaves Palm
**Build**: `node scripts/validate-sdd.mjs`
**Run unit**: `node --test`

---

## Matriz de Cobertura de Testes (Test Coverage Matrix)

| Camada de Código | Tipo de Teste Obrigatório | Cobertura Esperada | Padrão de Localização | Comando de Execução |
| --- | --- | --- | --- | --- |
| `index.html` e `src/css/layout.css` | unit / integration | Estrutura semântica, separação visual e metadados | `tests/` | `node --test` |

## Comandos de Verificação do Gate (Gate Check Commands)

| Nível do Gate | Quando Utilizar | Comando |
| --- | --- | --- |
| Quick | Após alterações em layout e marcação | `node --test` |
| Full | Validação de regressão completa | `node --test` |
| Build | Após conclusão das alterações | `node scripts/validate-sdd.mjs && node --test` |

---

## Plano de Execução (Execution Plan)

### Fase 1: Implementação e Verificação

```
T1 -> T2
```

---

## Detalhamento de Tarefas (Task Breakdown)

### T1: Implementação dos Componentes da Funcionalidade
**O que**: Implementar a marcação semântica do Hero com separação entre conteúdo tipográfico e container da foto.
**Onde**: `index.html`, `src/css/layout.css`
**Depende de**: Nenhum
**Reutiliza**: Tokens de design (`src/css/tokens.css`)
**Requisito**: FEAT-001

**Concluído quando**:
- [x] Regras de negócio implementadas com sucesso
- [x] Verificação de gate aprovada

**Testes**: unit / integration
**Gate**: quick

---

### T2: Validação Automatizada de Qualidade
**O que**: Validar estrutura no DOM e regras CSS através de testes automatizados.
**Onde**: `tests/accessibility-and-dom.test.js`
**Depende de**: T1
**Reutiliza**: Framework de testes nativo do Node.js
**Requisito**: FEAT-001

**Concluído quando**:
- [x] Teste de contrato aprovado
- [x] Verificação de gate aprovada: `node --test`

**Testes**: unit / integration
**Gate**: build

---

## Verificações (Checks)

**C1** - Hero Editorial separa .hero-photo-wrapper de .hero-content e contém h1 semântico, subtítulo, eyebrow e metadados
Proof: run unit | ✔ FEAT-001: Hero Editorial separa .hero-photo-wrapper de .hero-content e contém h1 semântico, subtítulo, eyebrow e metadados

---

## Transição (Handoff)

**Resolvido durante o build:** Estrutura editorial desacoplada e validada segundo as diretrizes SDD.
**Despachado:** Validado e aprovado com sucesso.
**Auditado:** Confirmado via testes automatizados.
