/**
 * @fileoverview Módulo de Navegação Semântica e Menu Responsivo (`src/js/navigation.js`).
 * Consolida o controle de menu hambúrguer (`aria-expanded`, detecção de quebra de linha única)
 * e os atalhos de teclado de acessibilidade (`Alt+1` a `Alt+4`).
 */

export const SHORTCUT_DEFINITIONS = Object.freeze({
  '1': Object.freeze({
    id: 'content',
    key: '1',
    targetSelector: '#conteudo',
    label: 'Conteúdo principal',
    announcement: 'Navegando para o conteúdo principal',
  }),
  '2': Object.freeze({
    id: 'navigation',
    key: '2',
    targetSelector: '#navegacao-principal',
    label: 'Menu de navegação principal',
    announcement: 'Navegando para o menu principal',
  }),
  '3': Object.freeze({
    id: 'accessibility',
    key: '3',
    targetSelector: '#btn-a11y-contrast',
    label: 'Controles de acessibilidade',
    announcement: 'Navegando para os controles de acessibilidade',
  }),
  '4': Object.freeze({
    id: 'footer',
    key: '4',
    targetSelector: '#rodape',
    label: 'Rodapé institucional',
    announcement: 'Navegando para o rodapé',
  }),
});

/**
 * Extrai o dígito do atalho ('1'..'4') de um evento de teclado.
 * @param {{ key?: string, code?: string }} eventLike
 */
function normalizeShortcutDigit(eventLike) {
  if (!eventLike) return null;
  if (typeof eventLike.key === 'string' && /^[1-4]$/.test(eventLike.key)) {
    return eventLike.key;
  }
  if (typeof eventLike.code === 'string') {
    const match = /^(?:Digit|Numpad)([1-4])$/.exec(eventLike.code);
    if (match) return match[1];
  }
  return null;
}

/**
 * Resolve um evento de teclado para a definição de atalho quando Alt+1..4 é acionado sem outros modificadores.
 * @param {{ altKey?: boolean, ctrlKey?: boolean, metaKey?: boolean, shiftKey?: boolean, key?: string, code?: string } | null | undefined} eventLike
 */
export function resolveShortcut(eventLike) {
  if (!eventLike || !eventLike.altKey) return null;
  if (eventLike.ctrlKey || eventLike.metaKey || eventLike.shiftKey) return null;

  const digit = normalizeShortcutDigit(eventLike);
  return digit ? SHORTCUT_DEFINITIONS[digit] || null : null;
}

/**
 * Move o foco para o marco semântico indicado pelo seletor e rola suavemente até ele.
 * @param {Document | null} doc
 * @param {string} selector
 */
export function focusLandmark(doc, selector) {
  if (!doc || !selector) return false;

  const id = selector.startsWith('#') ? selector.slice(1) : null;
  const target = id
    ? doc.getElementById?.(id)
    : doc.querySelector?.(selector);

  if (!target) return false;

  const tagName = (target.tagName || '').toUpperCase();
  const naturallyFocusable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tagName);

  if (!naturallyFocusable && !target.getAttribute?.('tabindex')) {
    target.setAttribute?.('tabindex', '-1');
  }

  target.focus?.({ preventScroll: false });
  target.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  return true;
}

/**
 * Inicializa o menu responsivo e os atalhos globais de navegação (`Alt+1..4`).
 * @param {{ doc?: Document | null, win?: Window | null }} [options]
 */
export function initNavigation({
  doc = typeof document !== 'undefined' ? document : null,
  win = typeof window !== 'undefined' ? window : null,
} = {}) {
  function announce(message) {
    const announcer = doc?.getElementById?.('a11y-announcer');
    if (announcer) announcer.textContent = message;
  }

  function handleKeyDown(event) {
    const shortcut = resolveShortcut(event);
    if (!shortcut) return { handled: false, shortcut: null };

    const focused = focusLandmark(doc, shortcut.targetSelector);
    if (!focused) return { handled: false, shortcut };

    event?.preventDefault?.();
    announce(shortcut.announcement);
    return { handled: true, shortcut };
  }

  const header =
    doc?.querySelector?.('.header') ||
    doc?.getElementById?.('navegacao-principal') ||
    null;
  const btnToggle = doc?.getElementById?.('btn-menu-toggle') || null;
  const navLinks =
    doc?.getElementById?.('menu-navegacao') ||
    doc?.querySelector?.('.nav-links') ||
    null;

  function checkOverflow() {
    if (!header || !navLinks || !header.classList || typeof navLinks.querySelectorAll !== 'function') {
      return;
    }

    if (win && win.innerWidth < 992) {
      header.classList.remove('nav-forced-desktop');
      return;
    }

    const links = navLinks.querySelectorAll('.nav-link');
    if (links.length > 1) {
      header.classList.remove('nav-collapsed');
      const first = links[0].getBoundingClientRect?.();
      const last = links[links.length - 1].getBoundingClientRect?.();
      if (!first || !last) return;

      const wraps = Math.abs(last.top - first.top) > 6;
      const overflows = navLinks.scrollWidth > navLinks.clientWidth + 4;

      if (wraps || overflows) {
        header.classList.add('nav-collapsed');
      } else {
        header.classList.remove('nav-collapsed');
      }
    }
  }

  function toggleMenu(forceOpen) {
    if (!header || !btnToggle || !header.classList) return false;
    const isCurrentlyOpen = header.classList.contains('nav-open');
    const willOpen = typeof forceOpen === 'boolean' ? forceOpen : !isCurrentlyOpen;

    if (willOpen) {
      header.classList.add('nav-open');
      btnToggle.setAttribute('aria-expanded', 'true');
      btnToggle.setAttribute('aria-label', 'Fechar menu de navegação');
      announce('Menu de navegação expandido');
    } else {
      header.classList.remove('nav-open');
      btnToggle.setAttribute('aria-expanded', 'false');
      btnToggle.setAttribute('aria-label', 'Abrir menu de navegação');
      announce('Menu de navegação recolhido');
    }
    return willOpen;
  }

  btnToggle?.addEventListener?.('click', (e) => {
    e?.stopPropagation?.();
    toggleMenu();
  });

  btnToggle?.addEventListener?.('keydown', (e) => {
    if (e.key === 'Escape' && header?.classList?.contains('nav-open')) {
      toggleMenu(false);
    }
  });

  navLinks?.addEventListener?.('click', (event) => {
    if (event?.target?.tagName === 'A') {
      toggleMenu(false);
    }
  });

  navLinks?.addEventListener?.('keydown', (e) => {
    if (e.key === 'Escape' && header?.classList?.contains('nav-open')) {
      toggleMenu(false);
      btnToggle?.focus?.();
    }
  });

  header?.addEventListener?.('keydown', (e) => {
    if (e.key === 'Escape' && header?.classList?.contains('nav-open')) {
      toggleMenu(false);
      btnToggle?.focus?.();
    }
  });

  win?.addEventListener?.('resize', checkOverflow);
  win?.addEventListener?.('keydown', (event) => handleKeyDown(event));

  doc?.addEventListener?.('click', (event) => {
    if (header?.classList?.contains('nav-open') && header.contains && !header.contains(event.target)) {
      toggleMenu(false);
    }
  });

  checkOverflow();

  return Object.freeze({
    toggleMenu,
    checkOverflow,
    handleKeyDown,
  });
}
