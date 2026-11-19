import { describe, it, expect, beforeEach } from 'vitest';
import {
  activacionState,
  resetActivacionFlow,
  setActivacionStep,
  advanceActivacionStep
} from '../../src/flows/activacion/useActivacionFlow.js';

describe('Flujo 4: Instalación Automática y Activación (instalacion automatica.pdf)', () => {
  beforeEach(() => {
    resetActivacionFlow();
  });

  it('debe iniciar en paso 1 con estado limpio', () => {
    expect(activacionState.stepNumber).toBe(1);
    expect(activacionState.selectedService).toBeNull();
    expect(activacionState.selectedTvDecoSerial).toBeNull();
    expect(activacionState.selectedModemSerial).toBeNull();
  });

  it('debe permitir seleccionar equipos y avanzar en el aprovisionamiento', () => {
    activacionState.selectedTvDecoSerial = '254871673753';
    activacionState.selectedModemSerial = '38:3F:B3:97:5C:1B';
    advanceActivacionStep(2);

    expect(activacionState.stepNumber).toBe(2);
    expect(activacionState.selectedTvDecoSerial).toBe('254871673753');
    expect(activacionState.selectedModemSerial).toBe('38:3F:B3:97:5C:1B');
  });

  it('no debe retroceder con advanceActivacionStep', () => {
    setActivacionStep(5);
    advanceActivacionStep(3);
    expect(activacionState.stepNumber).toBe(5);
  });
});
