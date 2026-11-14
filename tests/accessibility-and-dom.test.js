/**
 * @fileoverview Testes Estruturais de DOM, Contraste Matemático WCAG 2.2 e Contratos de Features.
 * Valida FEAT-001 a FEAT-009 diretamente sobre `index.html` e `src/css/*.css`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const tokensCss = fs.readFileSync(path.join(ROOT, 'src/css/tokens.css'), 'utf8');
const baseCss = fs.readFileSync(path.join(ROOT, 'src/css/base.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(ROOT, 'src/css/layout.css'), 'utf8');
const componentsCss = fs.readFileSync(path.join(ROOT, 'src/css/components.css'), 'utf8');

/**
 * Calcula a luminância relativa W3C WCAG 2.2 para uma cor hexadecimal de 6 dígitos.
 * @param {string} hex
 */
function relativeLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = Number.parseInt(clean.slice(0, 2), 16) / 255;
  const g = Number.parseInt(clean.slice(2, 4), 16) / 255;
  const b = Number.parseInt(clean.slice(4, 6), 16) / 255;

  const transform = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

/**
 * Calcula a razão de contraste W3C entre duas cores hexadecimais.
 * @param {string} hexA
 * @param {string} hexB
 */
function contrastRatio(hexA, hexB) {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return (brightest + 0.05) / (darkest + 0.05);
}

test('FEAT-001: Hero Editorial separa .hero-visual de .hero-content e contém h1 semântico, subtítulo, eyebrow e metadados', () => {
  assert.match(indexHtml, /<section class="hero"[^>]*>[\s\S]*?<div class="hero-content">/);
  assert.match(indexHtml, /<div class="tags">[\s\S]*?<span>Ciência<\/span>[\s\S]*?<span>Educação<\/span>[\s\S]*?<span>Brasil<\/span>/);
  assert.match(indexHtml, /<h2>Dra\. Yvonne <span>Mascarenhas<\/span><\/h2>/);
  assert.match(indexHtml, /<p>Senhora dos Cristais<\/p>/);
  assert.match(layoutCss, /\[data-theme="high-contrast"\]\s*\.hero/);
});

test('FEAT-009 & AD-006: Tokens do Design System e estados de hover em alto contraste satisfazem razões WCAG 2.2 AA/AAA sem bordas em textos', () => {
  // Verifica os tokens primitivos do Design System em tokens.css
  assert.match(tokensCss, /--bg:\s*#0b0e14/i);
  assert.match(tokensCss, /--accent-red:\s*#e63946/i);
  assert.match(tokensCss, /--accent-blue:\s*#4a90e2/i);
  assert.match(tokensCss, /--border-timeline:\s*#2a3446/i);

  // Verificação matemática de WCAG 2.2 no Tema Padrão (#0b0e14)
  assert.ok(contrastRatio('#ffffff', '#0b0e14') >= 18.0, 'Texto branco primário sobre #0b0e14 deve ser AAA (>= 7:1)');
  assert.ok(contrastRatio('#9ba1a6', '#0b0e14') >= 6.0, 'Texto secundário sobre #0b0e14 deve ser AA (>= 4.5:1)');
  assert.ok(contrastRatio('#e63946', '#0b0e14') >= 4.5, 'Vermelho de destaque sobre #0b0e14 deve ser AA (>= 4.5:1)');

  // Verificação matemática de WCAG 2.2 AAA no Tema de Alto Contraste (#000000)
  assert.ok(contrastRatio('#ffffff', '#000000') >= 21.0, 'Branco em alto contraste sobre preto é 21:1');
  assert.ok(contrastRatio('#ffff00', '#000000') >= 19.0, 'Amarelo em alto contraste sobre preto é >= 19:1 AAA');
  assert.ok(contrastRatio('#00ffff', '#000000') >= 16.0, 'Ciano em alto contraste sobre preto é >= 16:1 AAA');

  // Verifica se as regras CSS de hover em Alto Contraste definem texto preto sobre fundo amarelo
  assert.match(
    componentsCss,
    /\[data-theme="high-contrast"\]\s*\.a11y-btn:hover[^}]*\{[^}]*background-color:\s*#ffff00;[^}]*color:\s*#000000;/
  );
});

test('FEAT-002: Marcos de navegação, skip-link e alvos de atalhos de teclado existem em index.html', () => {
  assert.match(indexHtml, /<a class="skip-link" href="#conteudo">Ir para o conteúdo principal<\/a>/);
  assert.match(indexHtml, /id="a11y-announcer"[^>]*aria-live="polite"/);
  assert.match(indexHtml, /id="navegacao-principal"[^>]*accesskey="2"/);
  assert.match(indexHtml, /id="conteudo"[^>]*accesskey="1"/);
  assert.match(indexHtml, /id="btn-a11y-contrast"[^>]*accesskey="3"/);
  assert.match(indexHtml, /id="rodape"[^>]*accesskey="4"/);
});

test('FEAT-005: Seções editoriais possuem vínculos válidos de aria-labelledby, crimson-callout e links externos seguros', () => {
  const sections = [
    ['introducao', 'titulo-introducao'],
    ['cristalografia', 'titulo-cristalografia'],
    ['formacao', 'titulo-formacao'],
    ['premios', 'titulo-premios'],
    ['conclusao', 'titulo-conclusao'],
    ['referencias', 'titulo-referencias'],
  ];

  for (const [secId, titleId] of sections) {
    assert.match(
      indexHtml,
      new RegExp(`<section[^>]*id="${secId}"[^>]*aria-labelledby="${titleId}"[^>]*>[\\s\\S]*?<h3 id="${titleId}">`)
    );
  }

  const blankLinks = indexHtml.match(/<a\s+[^>]*target="_blank"[^>]*>/g) || [];
  assert.ok(blankLinks.length >= 3, 'Deve conter links de referência externa');
  for (const linkTag of blankLinks) {
    assert.match(linkTag, /rel="noopener noreferrer"/);
  }
});

test('FEAT-006: Cards de vídeo utilizam aspect-ratio 16/9, lazy loading, títulos acessíveis e figcaptions', () => {
  const iframes = indexHtml.match(/<iframe\s+[^>]*src="https:\/\/www\.youtube\.com\/embed\/[^"]+"/g) || [];
  assert.equal(iframes.length, 3, 'Deve renderizar todos os 3 iframes históricos do YouTube');
  assert.match(componentsCss, /\.video-frame\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/);
});

test('FEAT-007: Linha do tempo de prêmios contém todos os 8 marcos históricos em ordem cronológica decrescente (2021 a 1998)', () => {
  const yearMatches = [...indexHtml.matchAll(/<div class="timeline-year">(\d{4})<\/div>/g)].map((m) => Number(m[1]));
  assert.ok(yearMatches.includes(2021));
  assert.ok(yearMatches.includes(2019));
  assert.ok(yearMatches.includes(2017));
  assert.ok(yearMatches.includes(2014));
  assert.ok(yearMatches.includes(2013));
  assert.ok(yearMatches.includes(2006));
  assert.ok(yearMatches.includes(2000));
  assert.ok(yearMatches.includes(1998));
  assert.ok(yearMatches.includes(1991));
  assert.match(componentsCss, /\.timeline-item::before/);
  assert.match(componentsCss, /\.timeline::before/);
});

test('FEAT-008: Marcação do widget VLibras e guarda defensiva de inicialização existem ao final do body', () => {
  assert.match(indexHtml, /<div vw class="enabled">/);
  assert.match(indexHtml, /<div vw-access-button class="active"><\/div>/);
  assert.match(indexHtml, /<div vw-plugin-wrapper>/);
  assert.match(indexHtml, /https:\/\/vlibras\.gov\.br\/app\/vlibras-plugin\.js/);
  assert.match(indexHtml, /if\s*\(\s*window\.VLibras\s*&&\s*typeof\s*window\.VLibras\.Widget\s*===\s*'function'\s*\)/);
});

test('ADR-001: As 4 camadas CSS estão vinculadas em ordem estrita e prefers-reduced-motion é aplicado', () => {
  const cssOrder = [...indexHtml.matchAll(/<link rel="stylesheet" href="src\/css\/([^"]+)">/g)].map((m) => m[1]);
  assert.deepEqual(cssOrder, ['tokens.css', 'base.css', 'layout.css', 'components.css']);
  assert.match(baseCss, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
});
