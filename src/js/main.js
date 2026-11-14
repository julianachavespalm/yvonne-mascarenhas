/**
 * @fileoverview Ponto único de inicialização (Bootstrap) da aplicação (`src/js/main.js`).
 * Inicializa os módulos enxutos de acessibilidade e navegação (`ADR-004`)
 * e aplica guarda defensiva para o widget oficial VLibras (`ADR-005`).
 */

import { safeStorage } from './safe-storage.js';
import { initThemeContrast } from './theme-contrast.js';
import { initFontScale } from './font-scale.js';
import { initNavigation } from './navigation.js';

/**
 * Inicializa o widget oficial VLibras de forma defensiva caso não tenha sido instanciado.
 * @param {Window | null} [win]
 */
export function initVLibras(win = typeof window !== 'undefined' ? window : null) {
  if (!win || !win.VLibras || typeof win.VLibras.Widget !== 'function') {
    return false;
  }
  if (win.__VLIBRAS_INITIALIZED__) {
    return true;
  }
  try {
    new win.VLibras.Widget('https://vlibras.gov.br/app');
    win.__VLIBRAS_INITIALIZED__ = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Inicializa todos os módulos da página.
 * @param {{ doc?: Document, win?: Window, storage?: typeof safeStorage }} [env]
 */
export function bootstrapApp(env = {}) {
  const doc = env.doc || (typeof document !== 'undefined' ? document : null);
  const win = env.win || (typeof window !== 'undefined' ? window : null);
  const storage = env.storage || safeStorage;

  const fontScale = initFontScale({ doc, storage });
  const themeContrast = initThemeContrast({ doc, storage });
  const navigation = initNavigation({ doc, win });
  const vlibrasReady = initVLibras(win);

  return Object.freeze({
    fontScale,
    themeContrast,
    navigation,
    vlibrasReady,
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootstrapApp());
  } else {
    bootstrapApp();
  }
}
