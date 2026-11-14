/**
 * @fileoverview Módulo de Tema de Alto Contraste (`src/js/theme-contrast.js`).
 * Consolida validação de tema, mutação de `data-theme="high-contrast"` no `<html>`,
 * atualização de `aria-pressed`, anúncio em `aria-live="polite"` e persistência via `safe-storage.js`.
 */

import { safeStorage } from './safe-storage.js';

export const CONTRAST_STORAGE_KEY = 'highContrast';

export const THEMES = Object.freeze({
  DEFAULT: 'default',
  HIGH_CONTRAST: 'high-contrast',
});

/**
 * Cria um objeto de estado imutável para o tema de contraste.
 * @param {boolean} [isHighContrast=false]
 */
export function createThemeState(isHighContrast = false) {
  const active = Boolean(isHighContrast);
  return Object.freeze({
    theme: active ? THEMES.HIGH_CONTRAST : THEMES.DEFAULT,
    isHighContrast: active,
    ariaPressed: active ? 'true' : 'false',
    dataThemeAttr: active ? THEMES.HIGH_CONTRAST : null,
    storageValue: active ? 'true' : 'false',
    announcement: active
      ? 'Modo de alto contraste ativado'
      : 'Modo de alto contraste desativado',
  });
}

/**
 * Resolve o estado do tema a partir de um valor bruto armazenado.
 * @param {unknown} storedValue
 */
export function resolveThemeFromStorage(storedValue) {
  return createThemeState(storedValue === true || storedValue === 'true');
}

/**
 * Alterna entre o tema padrão e o modo de alto contraste.
 * @param {{ isHighContrast?: boolean } | boolean} currentState
 */
export function toggleThemeState(currentState) {
  const currentlyActive =
    typeof currentState === 'boolean'
      ? currentState
      : Boolean(currentState && currentState.isHighContrast);
  return createThemeState(!currentlyActive);
}

/**
 * Aplica o estado do tema diretamente no DOM e opcionalmente anuncia em `aria-live`.
 * @param {Document | null} doc
 * @param {ReturnType<typeof createThemeState>} state
 * @param {boolean} [shouldAnnounce=false]
 */
export function applyThemeToDom(doc, state, shouldAnnounce = false) {
  if (!doc || !doc.documentElement) return;

  if (state.dataThemeAttr) {
    doc.documentElement.setAttribute('data-theme', state.dataThemeAttr);
  } else {
    doc.documentElement.removeAttribute('data-theme');
  }

  const buttons = [
    doc.getElementById?.('btn-high-contrast'),
    doc.getElementById?.('btn-a11y-contrast'),
  ].filter(Boolean);

  for (const btn of buttons) {
    btn.setAttribute('aria-pressed', state.ariaPressed);
  }

  if (shouldAnnounce) {
    const announcer = doc.getElementById?.('a11y-announcer');
    if (announcer) {
      announcer.textContent = state.announcement;
    }
  }
}

/**
 * Inicializa o controle de Alto Contraste com injeção opcional de dependências.
 * @param {{ doc?: Document | null, storage?: typeof safeStorage }} [options]
 */
export function initThemeContrast({
  doc = typeof document !== 'undefined' ? document : null,
  storage = safeStorage,
} = {}) {
  let currentState = resolveThemeFromStorage(storage.get(CONTRAST_STORAGE_KEY));
  applyThemeToDom(doc, currentState, false);

  function toggle() {
    currentState = toggleThemeState(currentState);
    applyThemeToDom(doc, currentState, true);
    storage.set(CONTRAST_STORAGE_KEY, currentState.storageValue);
    return currentState;
  }

  function reset() {
    currentState = createThemeState(false);
    applyThemeToDom(doc, currentState, true);
    storage.set(CONTRAST_STORAGE_KEY, currentState.storageValue);
    return currentState;
  }

  if (doc) {
    const buttons = [
      doc.getElementById?.('btn-high-contrast'),
      doc.getElementById?.('btn-a11y-contrast'),
    ].filter(Boolean);

    for (const btn of buttons) {
      btn.addEventListener?.('click', () => toggle());
    }
  }

  return Object.freeze({
    toggle,
    reset,
    getState: () => currentState,
  });
}
