import { reactive } from 'vue';
import { activitiesState, updateLiveTimers } from '../../core/activities.js';
import { showToast } from '../../core/ui.js';

/**
 * Módulo del Proceso: Cierre de Orden de Trabajo y Desactivación de Ruta (CIERRE OT y RUTA WFM.pdf)
 */

export function getInitialCierreState() {
  return {
    iniciado: false,
    currentStep: 3, // Inicia en Paso 3 (Seleccionar Completar en Detalles de actividad)
    formData: {
      emailContacto: 'rodriguezalejandrina@gmail.com',
      cartillaInternet: 'NO',
      notas: 'OBSERVACIONES: Se realiza instalación no cableada de 1 módem, 2 decos, 2 punto de teléfono. se entregan 2 controles configurados. Se dejan unos puntos sueltos a petición del usuario.',
      fotoPlacaAdjunta: true,
      placaTexto: '42A-81',
      evidenciaNivelesAdjunta: true,
      evidenciaUbicacionAdjunta: false,
      coordenadasCapturadas: false,
      coordenadasTexto: '',
      realizoVenta: 'NO',
      proximaActividad: '-Almuerzo 4 - 00:00 - Almuerzo'
    },
    otCompletada: false,
    rutaDesactivada: false
  };
}

export const cierreState = reactive(getInitialCierreState());

export function resetCierreFlow() {
  Object.assign(cierreState, getInitialCierreState());
}

export function setCierreStep(step) {
  cierreState.currentStep = step;
}

export function advanceCierreStep(step) {
  if (step > (cierreState.currentStep || 0)) {
    cierreState.currentStep = step;
  }
}

export function capturarCoordenadasGPS() {
  cierreState.formData.coordenadasCapturadas = true;
  cierreState.formData.coordenadasTexto = 'Lat: 4.60971, Lng: -74.08175 (Precisión: 5m)';
  showToast('✓ Coordenadas GPS capturadas con éxito', 'success');
}

export function completarOrdenTrabajo(onComplete) {
  cierreState.otCompletada = true;
  cierreState.currentStep = 5; // Avanza a lista de actividades en estado cerrado

  if (activitiesState.currentActivity) {
    activitiesState.currentActivity.estado = 'cerrado';
    const now = new Date();
    activitiesState.currentActivity.horaFin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  updateLiveTimers();
  showToast('✓ Orden de Trabajo finalizada y completada en OFSC', 'success');
  if (typeof onComplete === 'function') onComplete();
}

export function desactivarRutaTrabajo(onComplete) {
  cierreState.rutaDesactivada = true;
  cierreState.currentStep = 6;
  showToast('✓ Ruta de trabajo desactivada correctamente. Jornada finalizada.', 'success');
  if (typeof onComplete === 'function') onComplete();
}

export function useCierreFlow() {
  return {
    cierreState,
    resetCierreFlow,
    setCierreStep,
    advanceCierreStep,
    capturarCoordenadasGPS,
    completarOrdenTrabajo,
    desactivarRutaTrabajo
  };
}
