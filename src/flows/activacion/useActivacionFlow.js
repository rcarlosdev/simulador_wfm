import { reactive } from 'vue';

/**
 * Módulo del Proceso: Activación de Equipos y Servicios (TV / Internet / Telefonía)
 */

export function getInitialActivacionState() {
  return {
    stepNumber: 1,
    selectedService: null,
    ubicacionTvSelected: 'Seleccione una ubicacion',
    selectedTvServicioId: null,
    tvModificarUbicacion: false,
    tvPredioUbicacion: 'Alcoba Auxiliar 1',
    tvMostrarMasTec: false,
    tvTarjetasMostrarMasTec: false,
    selectedTvDecoSerial: null,
    selectedTvControl: 'Seleccione un control',
    selectedTvTarjetaSerial: null,
    ubicacionIntSelected: 'Seleccione una ubicacion',
    selectedIntServicioId: null,
    intModificarUbicacion: false,
    intPredioUbicacion: 'Alcoba Auxiliar 2',
    intMostrarMasTec: false,
    selectedModemSerial: null,
    selectedIntLinea: 'Seleccione una línea',
    selectedIntFuente: 'Seleccione fuente de poder',
    showAlertCheckUbicacion: false,
    showAlertServiciosAsocOk: false,
    showAlertServiciosInstOfsc: false
  };
}

export const activacionState = reactive(getInitialActivacionState());

export function resetActivacionFlow() {
  Object.assign(activacionState, getInitialActivacionState());
}

export function setActivacionStep(step) {
  activacionState.stepNumber = step;
}

export function advanceActivacionStep(step) {
  if (step > activacionState.stepNumber) {
    activacionState.stepNumber = step;
  }
}

export function useActivacionFlow() {
  return {
    activacionState,
    resetActivacionFlow,
    setActivacionStep,
    advanceActivacionStep
  };
}
