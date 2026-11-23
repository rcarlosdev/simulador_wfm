import { describe, it, expect, beforeEach } from 'vitest';
import { useSimulator } from '../src/composables/useSimulator.js';
import { authState } from '../src/core/auth.js';
import { activitiesState } from '../src/core/activities.js';
import { SIMULADOR_DATA } from '../src/js/data.js';

describe('Funcionalidad de Reiniciar Simulación (resetSimulator)', () => {
  const { login, resetSimulator } = useSimulator();

  beforeEach(() => {
    // Iniciar con usuario autenticado
    login('1234567890', 'Claro2026*');
  });

  it('al invocar resetSimulator debe limpiar usuario, actividad y redirigir a /login', () => {
    expect(authState.currentUser).not.toBeNull();

    resetSimulator();

    // La sesión debe quedar cerrada para obligar a iniciar desde el Login
    expect(authState.currentUser).toBeNull();
    expect(activitiesState.currentActivity).toBeNull();
    expect(activitiesState.currentActivityId).toBeNull();
  });
});
