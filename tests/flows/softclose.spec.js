import { describe, it, expect, beforeEach } from 'vitest';
import {
  softCloseState,
  resetSoftCloseFlow,
  setSoftCloseStep,
  advanceSoftCloseStep
} from '../../src/flows/softclose/useSoftCloseFlow.js';

describe('Flujo 7: SoftClose y Telemetría (SotfClose.pdf)', () => {
  beforeEach(() => {
    resetSoftCloseFlow();
  });

  it('debe iniciar inactivo hasta que el usuario lo active', () => {
    expect(softCloseState.iniciado).toBe(false);
    expect(softCloseState.currentStep).toBe(0);
    expect(softCloseState.isCompleted).toBe(false);
  });

  it('debe avanzar los pasos del formulario de SoftClose', () => {
    softCloseState.iniciado = true;
    setSoftCloseStep(1);
    expect(softCloseState.currentStep).toBe(1);

    advanceSoftCloseStep(4);
    expect(softCloseState.currentStep).toBe(4);

    advanceSoftCloseStep(18);
    expect(softCloseState.currentStep).toBe(18);
  });
});
