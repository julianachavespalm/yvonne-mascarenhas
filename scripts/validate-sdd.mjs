#!/usr/bin/env node
/**
 * @fileoverview Validador de Gates SDD Determinístico (`scripts/validate-sdd.mjs`)
 * Aplica as regras de conformidade de Spec-Driven Development (SDD)
 * em Node.js nativo para execução local e em CI.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SPECS_DIR = path.join(ROOT, '.specs');
const FEATURES_DIR = path.join(SPECS_DIR, 'features');
const DECISIONS_DIR = path.join(SPECS_DIR, 'decisions');

// 6 Seções obrigatórias da especificação SDD
const REQUIRED_SPEC_SECTIONS = [
  /(Governança SDD|Tabela de Governança)/i,
  /(Contexto e Declaração de Valor|História[s]? de Usuário|User Stories)/i,
  /(Escopo e Fronteiras do Sistema|Out of Scope|Fora de Escopo)/i,
  /(Especificação Funcional e Regras de Negócio|Regras de Negócio)/i,
  /(Contrato Técnico e Semântica de Interface|Contrato Técnico)/i,
  /(Critérios de Aceitação|Acceptance Criteria|Matriz de Rastreabilidade)/i,
];

// Seções obrigatórias do plano de tarefas
const REQUIRED_TASKS_SECTIONS = [
  /(Test Coverage Matrix|Matriz de Cobertura de Testes)/i,
  /(Gate Check Commands|Comandos de Verificação do Gate)/i,
  /(Execution Plan|Plano de Execução)/i,
  /(Task Breakdown|Detalhamento de Tarefas)/i,
  /(Checks|Verificações)/i,
];

const errors = [];
const warnings = [];

function checkDecisionsDir() {
  if (!fs.existsSync(DECISIONS_DIR)) {
    errors.push('Diretório .specs/decisions ausente');
    return;
  }
  const adrFiles = fs.readdirSync(DECISIONS_DIR).sort();
  const expectedAdrs = [
    'ADR-001-css-layers.md',
    'ADR-002-data-theme.md',
    'ADR-003-hero-editorial.md',
    'ADR-004-lean-modular-architecture.md',
    'ADR-005-vlibras-official.md',
    'ADR-006-design-system-wcag-palette.md',
  ];
  if (adrFiles.length !== 6 || !expectedAdrs.every((f) => adrFiles.includes(f))) {
    errors.push(`.specs/decisions deve conter exatamente as 6 ADRs sequenciais (ADR-001 a ADR-006). Encontradas: ${adrFiles.join(', ')}`);
  }
}

function checkStateFile() {
  const statePath = path.join(SPECS_DIR, 'STATE.md');
  if (!fs.existsSync(statePath)) {
    errors.push('Arquivo .specs/STATE.md ausente');
    return;
  }
  const content = fs.readFileSync(statePath, 'utf8');
  if (!/(## Decisions|## Decisões)/i.test(content)) {
    errors.push('.specs/STATE.md não contém a seção ## Decisões (## Decisions)');
  }
  if (!/(## Handoff|## Transição)/i.test(content)) {
    errors.push('.specs/STATE.md não contém a seção ## Transição (## Handoff)');
  }
  const adMatches = content.match(/### AD-\d{3}/g) || [];
  if (adMatches.length !== 6) {
    errors.push(`.specs/STATE.md deve registrar exatamente as 6 decisões ativas AD-001 a AD-006 (encontradas ${adMatches.length})`);
  }
}

function validateFeatureSpec(featureName, featureDir) {
  const specPath = path.join(featureDir, 'spec.md');
  if (!fs.existsSync(specPath)) {
    errors.push(`${featureName}: spec.md ausente`);
    return;
  }
  const text = fs.readFileSync(specPath, 'utf8');
  const lines = text.split(/\r?\n/);

  if (!/Juliana Chaves Palm/i.test(text)) {
    errors.push(`${featureName}/spec.md: autoria de Juliana Chaves Palm ausente`);
  }

  for (const pattern of REQUIRED_SPEC_SECTIONS) {
    const rx = new RegExp(`^#{1,3}\\s+.*${pattern.source}.*$`, 'm');
    if (!rx.test(text)) {
      errors.push(`${featureName}/spec.md: seção obrigatória ausente compatível com ${pattern}`);
    }
  }

  // Validação da estrutura de User Story
  if (!/\*\*Como\*\*/.test(text) || !/\*\*Eu quero\*\*/.test(text) || !/\*\*Para que\*\*/.test(text)) {
    errors.push(`${featureName}/spec.md: História de usuário fora do padrão com **Como**, **Eu quero** e **Para que**`);
  }

  // Validação do padrão EARS (DEVE / SHALL) nos Critérios de Aceitação
  let inAc = false;
  lines.forEach((ln, idx) => {
    const stripped = ln.trim();
    if (/^\*{0,2}(Acceptance Criteria|Critérios de Aceitação|Critérios de Aceitação \(BDD\))\*{0,2}\s*:?\s*$/i.test(stripped)) {
      inAc = true;
      return;
    }
    if (inAc) {
      const m = /^\s*(?:\d+\.|\bCA-\d+:?)\s+(.*)$/.exec(ln);
      if (m) {
        const item = m[1].trim();
        if (!/\b(SHALL|DEVE)\b/i.test(item)) {
          errors.push(`${featureName}/spec.md L${idx + 1}: Critério de aceitação sem SHALL/DEVE (fora do formato normativo EARS): ${item}`);
        }
      } else if (stripped === '' || /^#{1,3}\s/.test(ln) || stripped.startsWith('**Casos de Borda') || stripped.startsWith('## ')) {
        inAc = false;
      }
    }
  });
}

function validateFeatureDesign(featureName, featureDir) {
  const designPath = path.join(featureDir, 'design.md');
  if (!fs.existsSync(designPath)) {
    errors.push(`${featureName}: design.md ausente`);
    return;
  }
  const text = fs.readFileSync(designPath, 'utf8');
  const requiredDesignSections = [
    /(Architecture Overview|Visão Geral da Arquitetura)/i,
    /(Components|Componentes)/i,
    /(Error Handling Strategy|Estratégia de Tratamento de Erros)/i,
    /(Risks & Concerns|Riscos e Preocupações)/i,
  ];

  for (const pattern of requiredDesignSections) {
    const rx = new RegExp(`^#{1,3}\\s+.*${pattern.source}.*$`, 'm');
    if (!rx.test(text)) {
      errors.push(`${featureName}/design.md: seção obrigatória ausente compatível com ${pattern}`);
    }
  }
}

function validateFeatureTasks(featureName, featureDir, testOutput) {
  const tasksPath = path.join(featureDir, 'tasks.md');
  if (!fs.existsSync(tasksPath)) {
    errors.push(`${featureName}: tasks.md ausente`);
    return;
  }
  const text = fs.readFileSync(tasksPath, 'utf8');
  const lines = text.split(/\r?\n/);

  if (!/\*\*Spec Owner\*\*:\s*Juliana Chaves Palm/i.test(text)) {
    errors.push(`${featureName}/tasks.md: linha **Spec Owner**: Juliana Chaves Palm ausente`);
  }

  for (const pattern of REQUIRED_TASKS_SECTIONS) {
    const rx = new RegExp(`^#{1,4}\\s+.*${pattern.source}.*`, 'm');
    if (!rx.test(text)) {
      errors.push(`${featureName}/tasks.md: seção obrigatória ausente compatível com ${pattern}`);
    }
  }

  // Verifica se cada linha de prova 'Proof: run unit | <esperado>' aparece na saída real dos testes
  const proofLines = lines
    .map((l) => l.trim())
    .filter((l) => /^(Proof|Prova):\s*(run\s+unit|executar\s+unidade)\s*\|\s*(.+)$/i.test(l));

  if (proofLines.length === 0) {
    errors.push(`${featureName}/tasks.md: nenhuma linha 'Proof: run unit | ...' encontrada nas verificações`);
  }

  for (const pl of proofLines) {
    const expected = pl.split('|').slice(1).join('|').trim();
    const words = expected.split(/\s+/).filter((w) => w !== '✔' && w !== '✓');
    const rx = new RegExp(words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*?'));
    if (testOutput && !rx.test(testOutput)) {
      errors.push(`${featureName}/tasks.md: Prova não encontrada na saída dos testes: "${expected}"`);
    }
  }
}

function main() {
  checkDecisionsDir();
  checkStateFile();

  if (!fs.existsSync(FEATURES_DIR)) {
    errors.push('Missing .specs/features directory');
  } else {
    const testRun = spawnSync(process.execPath, ['--test'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    const testOutput = `${testRun.stdout || ''}\n${testRun.stderr || ''}`;
    if (testRun.status !== 0) {
      errors.push(`Unit/Integration test suite failed with exit code ${testRun.status}`);
    }

    const features = fs
      .readdirSync(FEATURES_DIR)
      .filter((f) => fs.statSync(path.join(FEATURES_DIR, f)).isDirectory())
      .sort();

    for (const feat of features) {
      const fdir = path.join(FEATURES_DIR, feat);
      validateFeatureSpec(feat, fdir);
      validateFeatureDesign(feat, fdir);
      validateFeatureTasks(feat, fdir, testOutput);
    }

    console.log(`validate-sdd: audited ${features.length} features (${features.join(', ')})`);
  }

  for (const w of warnings) {
    console.warn(`  WARN  ${w}`);
  }
  for (const e of errors) {
    console.error(`  ERROR ${e}`);
  }

  console.log(`validate-sdd: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length > 0 ? 1 : 0);
}

main();
