import { reactive } from 'vue';
import { activitiesState, updateLiveTimers } from '../../core/activities.js';
import { showToast } from '../../core/ui.js';

/**
 * Módulo del Proceso: SoftClose, Validación de Inventarios y Telemetría RF (SotfClose.pdf)
 */

export function getInitialSoftCloseState() {
  return {
    iniciado: false, // Solo se activa cuando el usuario elige el proceso
    currentStep: 0,
    mtaSelected: false,
    nivelesEjecutados: false,
    solicitudAccionSelected: '',
    mtaNivelesValidados: false,
    softCloseFormData: {
      recibidoSatisfaccion: 'ALEJANDRINA RODRIGUEZ',
      tipoId: 'Cédula Ciudadanía',
      identificacion: '1098765432',
      telefonoEncuesta: '3101234567',
      emailContacto: 'rodriguezalejandrina@gmail.com',
      firmaDataUrl: ''
    },
    isSubmitting: false,
    isCompleted: false
  };
}

export const softCloseState = reactive(getInitialSoftCloseState());

export function resetSoftCloseFlow() {
  Object.assign(softCloseState, getInitialSoftCloseState());
}

export function setSoftCloseStep(step) {
  softCloseState.currentStep = step;
}

export function advanceSoftCloseStep(step) {
  if (step > (softCloseState.currentStep || 0)) {
    softCloseState.currentStep = step;
  }
}

export function submitSoftClose(onComplete) {
  softCloseState.isSubmitting = true;
  showToast('Enviando datos al servidor OFSC...', 'normal');

  setTimeout(() => {
    softCloseState.isSubmitting = false;
    softCloseState.isCompleted = true;

    if (activitiesState.currentActivity) {
      activitiesState.currentActivity.estado = 'cerrado';
      const now = new Date();
      activitiesState.currentActivity.horaFin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    updateLiveTimers();
    showToast('SoftClose completado con éxito. Actividad cerrada a satisfacción.', 'success');
    if (typeof onComplete === 'function') onComplete();
  }, 1500);
}

export function useSoftCloseFlow() {
  return {
    softCloseState,
    resetSoftCloseFlow,
    setSoftCloseStep,
    advanceSoftCloseStep,
    submitSoftClose
  };
}
