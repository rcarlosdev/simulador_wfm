import { describe, it, expect, beforeEach } from 'vitest';
import {
  activacionRutaState,
  resetActivacionRutaFlow,
  setActivacionRutaStep,
  advanceActivacionRutaStep,
  confirmarActivacionRuta,
  formatOfscHeaderDate,
  formatOfscLongDate
} from '../../src/flows/activacion_ruta/useActivacionRutaFlow.js';

describe('Flujo 1: Activación de Ruta (ACTIVACION RUTA.pdf)', () => {
  beforeEach(() => {
    resetActivacionRutaFlow();
  });

  it('debe iniciar con el estado predeterminado y paso 2', () => {
    expect(activacionRutaState.currentStep).toBe(2);
    expect(activacionRutaState.rutaConfirmada).toBe(false);
    expect(activacionRutaState.calendarioAbierto).toBe(false);
  });

  it('debe avanzar el paso correctamente', () => {
    advanceActivacionRutaStep(3);
    expect(activacionRutaState.currentStep).toBe(3);

    advanceActivacionRutaStep(4);
    expect(activacionRutaState.currentStep).toBe(4);
  });

  it('no debe retroceder paso con advanceActivacionRutaStep', () => {
    setActivacionRutaStep(4);
    advanceActivacionRutaStep(2);
    expect(activacionRutaState.currentStep).toBe(4);
  });

  it('debe formatear la fecha para cabecera OFSC correctamente', () => {
    const testDate = new Date(2026, 1, 18); // 18 de Febrero
    const formatted = formatOfscHeaderDate(testDate);
    expect(formatted).toBe('Feb 18. °');
  });

  it('debe formatear la fecha larga en español correctamente', () => {
    const testDate = new Date(2026, 1, 18);
    const formatted = formatOfscLongDate(testDate);
    expect(formatted.toLowerCase()).toContain('febrero');
    expect(formatted).toContain('18');
  });

  it('debe confirmar la activación de ruta exitosamente', () => {
    let callbackEjecutado = false;
    confirmarActivacionRuta(() => {
      callbackEjecutado = true;
    });

    expect(activacionRutaState.rutaConfirmada).toBe(true);
    expect(activacionRutaState.currentStep).toBe(6);
    expect(callbackEjecutado).toBe(true);
  });
});
