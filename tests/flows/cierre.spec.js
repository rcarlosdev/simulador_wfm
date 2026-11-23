import { describe, it, expect, beforeEach } from 'vitest';
import {
  cierreState,
  resetCierreFlow,
  setCierreStep,
  advanceCierreStep,
  capturarCoordenadasGPS,
  completarOrdenTrabajo,
  desactivarRutaTrabajo
} from '../../src/flows/cierre/useCierreFlow.js';

describe('Flujo 8: Cierre de OT y Desactivación de Ruta (CIERRE OT y RUTA WFM.pdf)', () => {
  beforeEach(() => {
    resetCierreFlow();
  });

  it('debe iniciar en paso 3 con formulario oficial', () => {
    expect(cierreState.currentStep).toBe(3);
    expect(cierreState.otCompletada).toBe(false);
    expect(cierreState.rutaDesactivada).toBe(false);
    expect(cierreState.formData.coordenadasCapturadas).toBe(false);
  });

  it('debe capturar coordenadas GPS exitosamente', () => {
    capturarCoordenadasGPS();
    expect(cierreState.formData.coordenadasCapturadas).toBe(true);
    expect(cierreState.formData.coordenadasTexto).toContain('Lat:');
    expect(cierreState.formData.coordenadasTexto).toContain('Lng:');
  });

  it('debe completar la orden de trabajo', () => {
    let callbackEjecutado = false;
    completarOrdenTrabajo(() => {
      callbackEjecutado = true;
    });

    expect(cierreState.otCompletada).toBe(true);
    expect(cierreState.currentStep).toBe(5);
    expect(callbackEjecutado).toBe(true);
  });

  it('debe desactivar la ruta de trabajo finalizando la jornada laboral', () => {
    let callbackEjecutado = false;
    desactivarRutaTrabajo(() => {
      callbackEjecutado = true;
    });

    expect(cierreState.rutaDesactivada).toBe(true);
    expect(cierreState.currentStep).toBe(6);
    expect(callbackEjecutado).toBe(true);
  });
});
