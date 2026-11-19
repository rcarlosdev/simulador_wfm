import { describe, it, expect, beforeEach } from 'vitest';
import {
  almacenState,
  resetAlmacenFlow,
  setAlmacenStep,
  advanceAlmacenStep,
  confirmarInicioAlmacen,
  guardarCheckInicio,
  finalizarActividadAlmacen
} from '../../src/flows/almacen/useAlmacenFlow.js';

describe('Flujo 2: Actividades de Almacén (ACTIVIDADES ALMACEN.pdf)', () => {
  beforeEach(() => {
    resetAlmacenFlow();
  });

  it('debe iniciar en paso 1 con formulario de check inicial vacío o por defecto', () => {
    expect(almacenState.currentStep).toBe(1);
    expect(almacenState.iniciado).toBe(false);
    expect(almacenState.checkRealizado).toBe(false);
  });

  it('debe confirmar el inicio de la actividad de almacén', () => {
    let callbackEjecutado = false;
    confirmarInicioAlmacen(() => {
      callbackEjecutado = true;
    });

    expect(almacenState.iniciado).toBe(true);
    expect(almacenState.currentStep).toBe(4);
    expect(callbackEjecutado).toBe(true);
  });

  it('debe guardar el Check de Inicio de Operación y actualizar el estado', () => {
    let callbackEjecutado = false;
    guardarCheckInicio(() => {
      callbackEjecutado = true;
    });

    expect(almacenState.checkRealizado).toBe(true);
    expect(almacenState.currentStep).toBe(7);
    expect(callbackEjecutado).toBe(true);
  });

  it('debe finalizar la actividad de almacén y marcar el cierre', () => {
    let callbackEjecutado = false;
    finalizarActividadAlmacen(() => {
      callbackEjecutado = true;
    });

    expect(almacenState.currentStep).toBe(9);
    expect(callbackEjecutado).toBe(true);
  });
});
