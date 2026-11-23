import { describe, it, expect, beforeEach } from 'vitest';
import {
  desplazamientoState,
  resetDesplazamientoFlow,
  setDesplazamientoStep,
  advanceDesplazamientoStep,
  iniciarViajeWaze,
  cambiarAGoogleMaps,
  finalizarDesplazamiento
} from '../../src/flows/desplazamiento/useDesplazamientoFlow.js';

describe('Flujo 3: Desplazamiento y Navegación (DESPLAZAMIENTO.pdf)', () => {
  beforeEach(() => {
    resetDesplazamientoFlow();
  });

  it('debe iniciar en paso 1 con app de navegación por defecto', () => {
    expect(desplazamientoState.currentStep).toBe(1);
    expect(desplazamientoState.wazeEnViaje).toBe(false);
    expect(desplazamientoState.completado).toBe(false);
  });

  it('debe iniciar viaje en Waze y avanzar de paso', () => {
    iniciarViajeWaze();
    expect(desplazamientoState.wazeEnViaje).toBe(true);
    expect(desplazamientoState.appSeleccionada).toBe('waze');
    expect(desplazamientoState.currentStep).toBe(5);
  });

  it('debe cambiar de Waze a Google Maps manteniendo la sincronización', () => {
    cambiarAGoogleMaps();
    expect(desplazamientoState.appSeleccionada).toBe('maps');
    expect(desplazamientoState.currentStep).toBe(6);
  });

  it('debe registrar la llegada al predio y finalizar el desplazamiento', () => {
    let callbackEjecutado = false;
    finalizarDesplazamiento(() => {
      callbackEjecutado = true;
    });

    expect(desplazamientoState.completado).toBe(true);
    expect(desplazamientoState.currentStep).toBe(7);
    expect(callbackEjecutado).toBe(true);
  });
});
