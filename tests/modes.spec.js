import { describe, it, expect, beforeEach } from 'vitest';
import { uiState, setModoGuiado, toggleModoGuiado } from '../src/core/ui.js';

describe('Sistema de Modos: Guiado vs Libre', () => {
  beforeEach(() => {
    uiState.modoGuiado = true;
  });

  it('debe iniciar en Modo Guiado por defecto', () => {
    expect(uiState.modoGuiado).toBe(true);
  });

  it('debe alternar a Modo Libre correctamente', () => {
    setModoGuiado(false);
    expect(uiState.modoGuiado).toBe(false);
    expect(uiState.toast.message).toContain('Modo Libre activado');
  });

  it('debe alternar entre modos con toggleModoGuiado', () => {
    toggleModoGuiado();
    expect(uiState.modoGuiado).toBe(false);

    toggleModoGuiado();
    expect(uiState.modoGuiado).toBe(true);
    expect(uiState.toast.message).toContain('Modo Guiado activado');
  });
});
