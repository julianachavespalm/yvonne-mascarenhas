/**
 * @fileoverview Módulo de Escala Tipográfica (`src/js/font-scale.js`).
 * Consolida os limites de escala (`80%` a `150%`, passo `10%`, padrão `100%`),
 * sanitização de valores inválidos, controles de aumentar/diminuir/resetar fonte,
 * anúncio em `aria-live` e persistência via `safe-storage.js`.
 */

import { safeStorage } from './safe-storage.js';

export const FONT_STORAGE_KEY = 'fontSize';

export const FONT_SCALE_CONSTRAINTS = Object.freeze({
  MIN: 80,
  MAX: 150,
  STEP: 10,
  DEFAULT: 100,
});

/**
 * Sanitiza qualquer entrada bruta em uma escala inteira válida entre 80% e 150%.
 * @param {unknown} rawValue
 * @returns {number}
 */
export function sanitizeFontScale(rawValue) {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return FONT_SCALE_CONSTRAINTS.DEFAULT;
  }

  const parsed = typeof rawValue === 'number' ? rawValue : Number.parseInt(String(rawValue), 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return FONT_SCALE_CONSTRAINTS.DEFAULT;
  }

  return Math.max(
    FONT_SCALE_CONSTRAINTS.MIN,
    Math.min(
      FONT_SCALE_CONSTRAINTS.MAX,
      Math.round(parsed / FONT_SCALE_CONSTRAINTS.STEP) * FONT_SCALE_CONSTRAINTS.STEP
    )
  );
}

/**
 * Cria um descritor imutável do estado de escala tipográfica.
 * @param {unknown} [rawScale=100]
 */
export function createFontScaleState(rawScale = FONT_SCALE_CONSTRAINTS.DEFAULT) {
  const scale = sanitizeFontScale(rawScale);
  return Object.freeze({
    scale,
    cssValue: `${scale}%`,
    canIncrease: scale < FONT_SCALE_CONSTRAINTS.MAX,
    canDecrease: scale > FONT_SCALE_CONSTRAINTS.MIN,
    isDefault: scale === FONT_SCALE_CONSTRAINTS.DEFAULT,
  });
}

/**
 * Calcula o próximo estado de escala para um comando ('increase' | 'decrease' | 'reset').
 * @param {unknown} currentScale
 * @param {'increase' | 'decrease' | 'reset'} command
 */
export function calculateNextFontScale(currentScale, command) {
  const base = sanitizeFontScale(currentScale);
  switch (command) {
    case 'increase':
      return createFontScaleState(base + FONT_SCALE_CONSTRAINTS.STEP);
    case 'decrease':
      return createFontScaleState(base - FONT_SCALE_CONSTRAINTS.STEP);
    case 'reset':
      return createFontScaleState(FONT_SCALE_CONSTRAINTS.DEFAULT);
    default:
      return createFontScaleState(base);
  }
}

/**
 * Aplica o estado de escala tipográfica ao DOM e atualiza atributos ARIA dos botões.
 * @param {Document | null} doc
 * @param {ReturnType<typeof createFontScaleState>} state
 * @param {string | null} [announcement=null]
 */
export function applyFontScaleToDom(doc, state, announcement = null) {
  if (!doc) return;

  if (doc.documentElement?.style) {
    doc.documentElement.style.fontSize = state.cssValue;
    doc.documentElement.style.setProperty?.('--user-font-scale', String(state.scale / 100));
  }
  if (doc.body?.style) {
    doc.body.style.fontSize = state.cssValue;
  }

  const btnIncrease = doc.getElementById?.('btn-increase-font') || doc.getElementById?.('btn-a11y-plus');
  const btnDecrease = doc.getElementById?.('btn-decrease-font') || doc.getElementById?.('btn-a11y-minus');
  const btnReset = doc.getElementById?.('btn-reset-font') || doc.getElementById?.('btn-a11y-reset');

  if (btnIncrease) btnIncrease.setAttribute('aria-disabled', state.canIncrease ? 'false' : 'true');
  if (btnDecrease) btnDecrease.setAttribute('aria-disabled', state.canDecrease ? 'false' : 'true');
  if (btnReset) btnReset.setAttribute('data-scale', state.cssValue);

  if (announcement) {
    const announcer = doc.getElementById?.('a11y-announcer');
    if (announcer) announcer.textContent = announcement;
  }
}

/**
 * Inicializa o controle de escala de fonte com injeção opcional de dependências.
 * @param {{ doc?: Document | null, storage?: typeof safeStorage }} [options]
 */
export function initFontScale({
  doc = typeof document !== 'undefined' ? document : null,
  storage = safeStorage,
} = {}) {
  let currentState = createFontScaleState(storage.get(FONT_STORAGE_KEY));
  applyFontScaleToDom(doc, currentState, null);
  storage.set(FONT_STORAGE_KEY, String(currentState.scale));

  function commit(nextState) {
    currentState = nextState;
    storage.set(FONT_STORAGE_KEY, String(currentState.scale));
    applyFontScaleToDom(doc, currentState, `Tamanho da fonte ajustado para ${currentState.scale}%`);
    return currentState;
  }

  function increase() {
    const nextState = calculateNextFontScale(currentState.scale, 'increase');
    if (nextState.scale === currentState.scale) {
      applyFontScaleToDom(doc, currentState, `Tamanho máximo da fonte atingido (${currentState.scale}%)`);
      return currentState;
    }
    return commit(nextState);
  }

  function decrease() {
    const nextState = calculateNextFontScale(currentState.scale, 'decrease');
    if (nextState.scale === currentState.scale) {
      applyFontScaleToDom(doc, currentState, `Tamanho mínimo da fonte atingido (${currentState.scale}%)`);
      return currentState;
    }
    return commit(nextState);
  }

  function reset() {
    return commit(calculateNextFontScale(currentState.scale, 'reset'));
  }

  if (doc) {
    const btnIncrease = doc.getElementById?.('btn-increase-font') || doc.getElementById?.('btn-a11y-plus');
    const btnDecrease = doc.getElementById?.('btn-decrease-font') || doc.getElementById?.('btn-a11y-minus');
    const btnReset = doc.getElementById?.('btn-reset-font') || doc.getElementById?.('btn-a11y-reset');

    btnIncrease?.addEventListener?.('click', () => increase());
    btnDecrease?.addEventListener?.('click', () => decrease());
    btnReset?.addEventListener?.('click', () => reset());
  }

  return Object.freeze({
    increase,
    decrease,
    reset,
    getState: () => currentState,
  });
}
