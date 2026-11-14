/**
 * @fileoverview Testes unitários e de integração do módulo de Navegação (`src/js/navigation.js`)
 * e inicialização da aplicação (`src/js/main.js`).
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SHORTCUT_DEFINITIONS,
  initNavigation,
  resolveShortcut,
} from '../src/js/navigation.js';
import { bootstrapApp } from '../src/js/main.js';
import { createSafeStorage } from '../src/js/safe-storage.js';

function createNavigationDomMock() {
  const elements = new Map();
  const classSet = new Set();

  function makeElement(id, tagName = 'DIV') {
    const attrs = new Map();
    const listeners = new Map();
    const el = {
      id,
      tagName,
      style: {
        fontSize: '',
        setProperty(k, v) {
          this[k] = v;
        },
      },
      textContent: '',
      focused: false,
      scrolled: false,
      classList: {
        add: (c) => classSet.add(c),
        remove: (c) => classSet.delete(c),
        contains: (c) => classSet.has(c),
      },
      contains: () => false,
      querySelectorAll: () => [],
      setAttribute: (k, v) => attrs.set(k, String(v)),
      getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
      removeAttribute: (k) => attrs.delete(k),
      addEventListener: (type, fn) => listeners.set(type, fn),
      trigger: (type, event = {}) => listeners.get(type)?.(event),
      focus: () => {
        el.focused = true;
      },
      scrollIntoView: () => {
        el.scrolled = true;
      },
    };
    elements.set(id, el);
    return el;
  }

  const documentElement = makeElement('html', 'HTML');
  const body = makeElement('body', 'BODY');
  const header = makeElement('navegacao-principal', 'HEADER');
  makeElement('btn-menu-toggle', 'BUTTON');
  makeElement('menu-navegacao', 'NAV');
  makeElement('btn-a11y-contrast', 'BUTTON');
  makeElement('a11y-announcer', 'DIV');
  makeElement('conteudo', 'MAIN');
  makeElement('rodape', 'FOOTER');

  return {
    documentElement,
    body,
    elements,
    getElementById: (id) => elements.get(id) || null,
    querySelector: (sel) => {
      if (sel === '.header') return header;
      if (sel.startsWith('#')) return elements.get(sel.slice(1)) || null;
      return null;
    },
    addEventListener: () => {},
  };
}

test('FEAT-002: resolveShortcut mapeia Alt+1..4 para marcos semânticos e rejeita modificadores conflitantes', () => {
  const s1 = resolveShortcut({ altKey: true, key: '1' });
  assert.deepEqual(s1, SHORTCUT_DEFINITIONS['1']);
  assert.equal(s1.targetSelector, '#conteudo');

  const s2 = resolveShortcut({ altKey: true, code: 'Digit2' });
  assert.deepEqual(s2, SHORTCUT_DEFINITIONS['2']);
  assert.equal(s2.targetSelector, '#navegacao-principal');

  const s3 = resolveShortcut({ altKey: true, code: 'Numpad3' });
  assert.deepEqual(s3, SHORTCUT_DEFINITIONS['3']);
  assert.equal(s3.targetSelector, '#btn-a11y-contrast');

  const s4 = resolveShortcut({ altKey: true, key: '4' });
  assert.deepEqual(s4, SHORTCUT_DEFINITIONS['4']);
  assert.equal(s4.targetSelector, '#rodape');

  // Rejeita modificadores extras ou teclas fora do intervalo 1..4
  assert.equal(resolveShortcut(null), null);
  assert.equal(resolveShortcut({ altKey: false, key: '1' }), null);
  assert.equal(resolveShortcut({ altKey: true, ctrlKey: true, key: '1' }), null);
  assert.equal(resolveShortcut({ altKey: true, metaKey: true, key: '2' }), null);
  assert.equal(resolveShortcut({ altKey: true, shiftKey: true, key: '3' }), null);
  assert.equal(resolveShortcut({ altKey: true, key: '5' }), null);
});

test('FEAT-002: initNavigation alterna aria-expanded no menu hambúrguer, foca marcos via atalhos e bootstrapApp inicializa os módulos', () => {
  const doc = createNavigationDomMock();
  const winListeners = new Map();
  const win = {
    innerWidth: 768,
    addEventListener: (type, fn) => winListeners.set(type, fn),
  };
  const storage = createSafeStorage(null);

  const app = bootstrapApp({ doc, win, storage });

  // Testa abertura e fechamento do menu hambúrguer
  const btnMenu = doc.getElementById('btn-menu-toggle');
  btnMenu.trigger('click', { stopPropagation: () => {} });
  assert.equal(btnMenu.getAttribute('aria-expanded'), 'true');
  assert.equal(doc.getElementById('navegacao-principal').classList.contains('nav-open'), true);

  // Fechamento via tecla Escape
  btnMenu.trigger('keydown', { key: 'Escape' });
  assert.equal(btnMenu.getAttribute('aria-expanded'), 'false');
  assert.equal(doc.getElementById('navegacao-principal').classList.contains('nav-open'), false);

  // Testa atalho de teclado Alt+1 para focar #conteudo
  let defaultPrevented = false;
  const result = app.navigation.handleKeyDown({
    altKey: true,
    key: '1',
    preventDefault: () => {
      defaultPrevented = true;
    },
  });

  assert.equal(result.handled, true);
  assert.equal(defaultPrevented, true);
  assert.equal(doc.getElementById('conteudo').focused, true);
  assert.equal(doc.getElementById('conteudo').getAttribute('tabindex'), '-1');
  assert.match(doc.getElementById('a11y-announcer').textContent, /conteúdo principal/i);
});
