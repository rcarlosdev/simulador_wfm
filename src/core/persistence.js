/**
 * Gestor Centralizado de Persistencia en localStorage
 * Permite guardar y recuperar el estado de los módulos de forma segura y con debounce.
 */

const STORAGE_KEY = 'ofsc_simulador_state_v2';

export function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('[Persistence] Error al leer el estado guardado en localStorage:', error);
    return null;
  }
}

let debounceTimer = null;

export function saveStoredData(dataGetter, delayMs = 120) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      const payload = dataGetter();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn('[Persistence] Error al guardar el estado en localStorage:', error);
    }
  }, delayMs);
}

export function clearStoredData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[Persistence] Error al limpiar localStorage:', error);
  }
}
