import { reactive } from 'vue';
import { authState } from '../../core/auth.js';
import { activitiesState } from '../../core/activities.js';
import { showToast, showScreen } from '../../core/ui.js';

/**
 * Módulo del Proceso: Desplazamiento y Navegación (DESPLAZAMIENTO.pdf)
 * Gestiona el flujo guiado de consulta de mapa, visualización en Waze y Google Maps.
 */

export function getInitialDesplazamientoState() {
  return {
    iniciado: false,
    currentStep: 1, // Pasos 1 al 6 según el documento
    appSeleccionada: 'waze', // 'waze' | 'maps'
    wazeEnViaje: false,
    completado: false
  };
}

export const desplazamientoState = reactive(getInitialDesplazamientoState());

export function resetDesplazamientoFlow() {
  Object.assign(desplazamientoState, getInitialDesplazamientoState());
}

export function setDesplazamientoStep(step) {
  desplazamientoState.currentStep = step;
}

export function advanceDesplazamientoStep(step) {
  if (step > (desplazamientoState.currentStep || 0)) {
    desplazamientoState.currentStep = step;
  }
}

/**
 * Iniciar navegación en Waze (Paso 4 -> Paso 5)
 */
export function iniciarViajeWaze() {
  desplazamientoState.wazeEnViaje = true;
  desplazamientoState.currentStep = 5;
  showToast('Navegación Waze iniciada. Sigue las indicaciones GPS.', 'info');
}

/**
 * Cambiar a Google Maps (Paso 5 -> Paso 6)
 */
export function cambiarAGoogleMaps() {
  desplazamientoState.appSeleccionada = 'maps';
  desplazamientoState.currentStep = 6;
  showToast('Cambiando a Google Maps...', 'info');
  showScreen('/desplazamiento-maps');
}

/**
 * Finalizar el flujo de desplazamiento y volver a la OT
 */
export function finalizarDesplazamiento(onSuccess = null) {
  desplazamientoState.completado = true;
  desplazamientoState.currentStep = 7;
  showToast('Ruta de desplazamiento verificada correctamente.', 'success');

  if (typeof onSuccess === 'function') {
    onSuccess();
  } else {
    showScreen('/activity');
  }
}

export function useDesplazamientoFlow() {
  return {
    desplazamientoState,
    resetDesplazamientoFlow,
    setDesplazamientoStep,
    advanceDesplazamientoStep,
    iniciarViajeWaze,
    cambiarAGoogleMaps,
    finalizarDesplazamiento
  };
}
