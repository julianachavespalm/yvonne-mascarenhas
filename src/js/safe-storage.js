/**
 * @fileoverview Utilitário enxuto de persistência resiliente (`src/js/safe-storage.js`).
 * Encapsula `window.localStorage` (`get`, `set`, `remove`) em blocos `try/catch`
 * com fallback silencioso em `Map` na memória quando o armazenamento nativo falha.
 */

/**
 * Cria uma instância de armazenamento seguro com fallback em memória.
 * @param {Storage | null} [customStorage]
 */
export function createSafeStorage(
  customStorage = typeof globalThis !== 'undefined' && 'localStorage' in globalThis
    ? globalThis.localStorage
    : null
) {
  const memoryFallback = new Map();

  return Object.freeze({
    get(key) {
      try {
        const val = customStorage?.getItem?.(key);
        if (val !== null && val !== undefined) return val;
      } catch {
        // Fallback silencioso para memória quando localStorage lança SecurityError
      }
      return memoryFallback.has(key) ? memoryFallback.get(key) : null;
    },
    set(key, value) {
      const normalized = String(value);
      memoryFallback.set(key, normalized);
      try {
        if (customStorage?.setItem) {
          customStorage.setItem(key, normalized);
          return true;
        }
      } catch {
        // Fallback silencioso em caso de QuotaExceededError ou SecurityError
      }
      return false;
    },
    remove(key) {
      memoryFallback.delete(key);
      try {
        if (customStorage?.removeItem) {
          customStorage.removeItem(key);
          return true;
        }
      } catch {
        // Ignora erro de permissão no armazenamento nativo
      }
      return false;
    },
  });
}

export const safeStorage = createSafeStorage();
