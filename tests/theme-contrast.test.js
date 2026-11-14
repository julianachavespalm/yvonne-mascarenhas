/**
 * @fileoverview Testes unitários e de integração do módulo de Alto Contraste (`src/js/theme-contrast.js`)
 * e persistência resiliente (`src/js/safe-storage.js`).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createSafeStorage } from '../src/js/safe-storage.js';
import {
  CONTRAST_STORAGE_KEY,
  THEMES,
  createThemeState,
  initThemeContrast,
  resolveThemeFromStorage,
  toggleThemeState,
} from '../src/js/theme-contrast.js';

function createThemeDomMock() {
  const attrs = new Map();
  const btnAttrs = new Map();
  let clickHandler = null;
  const announcer = { textContent: '' };

  const btn = {
    setAttribute: (k, v) => btnAttrs.set(k, String(v)),
    getAttribute: (k) => (btnAttrs.has(k) ? btnAttrs.get(k) : null),
    addEventListener: (type, fn) => {
      if (type === 'click') clickHandler = fn;
    },
    click: () => clickHandler?.(),
  };

  return {
    documentElement: {
      setAttribute: (k, v) => attrs.set(k, String(v)),
      getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
      removeAttribute: (k) => attrs.delete(k),
    },
    getElementById: (id) => {
      if (id === 'btn-high-contrast' || id === 'btn-a11y-contrast') return btn;
      if (id === 'a11y-announcer') return announcer;
      return null;
    },
    btn,
    announcer,
  };
}

test('FEAT-004: resolveThemeFromStorage e toggleThemeState alternam entre padrão e high-contrast', () => {
  const initialDefault = resolveThemeFromStorage(null);
  assert.equal(initialDefault.theme, THEMES.DEFAULT);
  assert.equal(initialDefault.isHighContrast, false);
  assert.equal(initialDefault.ariaPressed, 'false');
  assert.equal(initialDefault.dataThemeAttr, null);
  assert.equal(initialDefault.storageValue, 'false');

  // Valores inesperados retornam com segurança para o tema padrão
  assert.equal(resolveThemeFromStorage('valor-invalido').isHighContrast, false);

  const initialActive = resolveThemeFromStorage('true');
  assert.equal(initialActive.theme, THEMES.HIGH_CONTRAST);
  assert.equal(initialActive.isHighContrast, true);
  assert.equal(initialActive.ariaPressed, 'true');
  assert.equal(initialActive.dataThemeAttr, 'high-contrast');

  const toggledOn = toggleThemeState(initialDefault);
  assert.equal(toggledOn.isHighContrast, true);
  assert.equal(toggledOn.dataThemeAttr, 'high-contrast');

  const toggledOff = toggleThemeState(toggledOn);
  assert.equal(toggledOff.isHighContrast, false);
  assert.equal(toggledOff.dataThemeAttr, null);

  assert.equal(createThemeState(true).ariaPressed, 'true');
});

test('FEAT-004: initThemeContrast alterna atributo data-theme para high-contrast, atualiza aria-pressed, anuncia em aria-live e persiste no safeStorage', () => {
  const doc = createThemeDomMock();
  const storage = createSafeStorage(null);

  const controller = initThemeContrast({ doc, storage });
  assert.equal(controller.getState().isHighContrast, false);
  assert.equal(doc.btn.getAttribute('aria-pressed'), 'false');

  // Aciona alternância via clique no botão
  doc.btn.click();
  assert.equal(controller.getState().isHighContrast, true);
  assert.equal(doc.documentElement.getAttribute('data-theme'), 'high-contrast');
  assert.equal(doc.btn.getAttribute('aria-pressed'), 'true');
  assert.equal(storage.get(CONTRAST_STORAGE_KEY), 'true');
  assert.match(doc.announcer.textContent, /ativado/i);

  // Aciona nova alternância para desativar
  doc.btn.click();
  assert.equal(controller.getState().isHighContrast, false);
  assert.equal(doc.documentElement.getAttribute('data-theme'), null);
  assert.equal(doc.btn.getAttribute('aria-pressed'), 'false');
  assert.equal(storage.get(CONTRAST_STORAGE_KEY), 'false');
  assert.match(doc.announcer.textContent, /desativado/i);
});

test('FEAT-004: createSafeStorage degrada silenciosamente para Map em memória quando localStorage lança SecurityError ou QuotaExceededError', () => {
  const throwingStorage = {
    getItem() {
      const err = new Error('Blocked');
      err.name = 'SecurityError';
      throw err;
    },
    setItem() {
      const err = new Error('Quota');
      err.name = 'QuotaExceededError';
      throw err;
    },
    removeItem() {
      throw new Error('Blocked');
    },
  };

  const storage = createSafeStorage(throwingStorage);
  assert.equal(storage.set('highContrast', 'true'), false);
  assert.equal(storage.get('highContrast'), 'true');

  assert.equal(storage.remove('highContrast'), false);
  assert.equal(storage.get('highContrast'), null);
});
