export type Theme = 'dark' | 'light';

export const themeStorageKey = 'specops-theme';

export function readTheme(): Theme {
  try {
    return window.localStorage.getItem(themeStorageKey) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f8f9fb' : '#090a0b');
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The in-memory choice still applies when device storage is unavailable.
  }
}
