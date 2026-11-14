/**
 * @fileoverview Testes unitários e de integração do módulo de Escala Tipográfica (`src/js/font-scale.js`).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createSafeStorage } from '../src/js/safe-storage.js';
import {
  FONT_SCALE_CONSTRAINTS,
  FONT_STORAGE_KEY,
  calculateNextFontScale,
  createFontScaleState,
  initFontScale,
  sanitizeFontScale,
} from '../src/js/font-scale.js';

function createFontDomMock() {
  const buttons = new Map();
  const announcer = { textContent: '' };

  function makeBtn(id) {
    const attrs = new Map();
    let clickFn = null;
    const btn = {
      id,
      setAttribute: (k, v) => attrs.set(k, String(v)),
      getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
      addEventListener: (type, fn) => {
        if (type === 'click') clickFn = fn;
      },
      click: () => clickFn?.(),
    };
    buttons.set(id, btn);
    return btn;
  }

  makeBtn('btn-increase-font');
  makeBtn('btn-decrease-font');
  makeBtn('btn-reset-font');

  return {
    documentElement: {
      style: {
        fontSize: '',
        setProperty(k, v) {
          this[k] = v;
        },
      },
    },
    body: {
      style: { fontSize: '' },
    },
    getElementById: (id) => {
      if (id === 'a11y-announcer') return announcer;
      return buttons.get(id) || null;
    },
    buttons,
    announcer,
  };
}

test('FEAT-003: sanitizeFontScale e calculateNextFontScale aplicam limites de 80% a 150%, passo de 10% e sanitizam entradas corrompidas', () => {
  // Valores nulos, vazios ou corrompidos retornam 100%
  assert.equal(sanitizeFontScale(undefined), FONT_SCALE_CONSTRAINTS.DEFAULT);
  assert.equal(sanitizeFontScale(null), 100);
  assert.equal(sanitizeFontScale(''), 100);
  assert.equal(sanitizeFontScale('corrompido-nan'), 100);
  assert.equal(sanitizeFontScale(Number.NaN), 100);

  // Limites mínimo (80%) e máximo (150%) e arredondamento para passo de 10%
  assert.equal(sanitizeFontScale(20), 80);
  assert.equal(sanitizeFontScale('50'), 80);
  assert.equal(sanitizeFontScale(250), 150);
  assert.equal(sanitizeFontScale('190'), 150);
  assert.equal(sanitizeFontScale(114), 110);

  const minState = createFontScaleState(80);
  assert.equal(minState.scale, 80);
  assert.equal(minState.cssValue, '80%');
  assert.equal(minState.canDecrease, false);
  assert.equal(minState.canIncrease, true);

  const maxState = createFontScaleState(150);
  assert.equal(maxState.scale, 150);
  assert.equal(maxState.canIncrease, false);
  assert.equal(maxState.canDecrease, true);

  assert.equal(calculateNextFontScale(100, 'increase').scale, 110);
  assert.equal(calculateNextFontScale(150, 'increase').scale, 150);
  assert.equal(calculateNextFontScale(100, 'decrease').scale, 90);
  assert.equal(calculateNextFontScale(80, 'decrease').scale, 80);
  assert.equal(calculateNextFontScale(140, 'reset').scale, 100);
});

test('FEAT-003: initFontScale orquestra aumento, diminuição, reset, anúncio em aria-live e persistência no safeStorage', () => {
  const doc = createFontDomMock();
  const storage = createSafeStorage(null);
  storage.set(FONT_STORAGE_KEY, '110');

  const controller = initFontScale({ doc, storage });
  assert.equal(controller.getState().scale, 110);
  assert.equal(doc.body.style.fontSize, '110%');

  // Aumenta até o teto de 150%
  controller.increase(); // 120
  controller.increase(); // 130
  controller.increase(); // 140
  const atMax = controller.increase(); // 150
  assert.equal(atMax.scale, 150);
  assert.equal(atMax.canIncrease, false);
  assert.equal(storage.get(FONT_STORAGE_KEY), '150');
  assert.equal(doc.buttons.get('btn-increase-font').getAttribute('aria-disabled'), 'true');

  // Tentar ultrapassar 150% anuncia limite máximo
  controller.increase();
  assert.match(doc.announcer.textContent, /máximo/i);

  // Reset retorna para 100%
  doc.buttons.get('btn-reset-font').click();
  assert.equal(controller.getState().scale, 100);
  assert.equal(storage.get(FONT_STORAGE_KEY), '100');

  // Diminui até o piso de 80%
  doc.buttons.get('btn-decrease-font').click(); // 90
  const atMin = controller.decrease(); // 80
  assert.equal(atMin.scale, 80);
  assert.equal(atMin.canDecrease, false);
  assert.equal(doc.buttons.get('btn-decrease-font').getAttribute('aria-disabled'), 'true');

  controller.decrease();
  assert.match(doc.announcer.textContent, /mínimo/i);
});
