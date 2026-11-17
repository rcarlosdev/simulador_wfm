import { reactive } from 'vue';
import { authState } from '../../core/auth.js';
import { activitiesState, updateLiveTimers } from '../../core/activities.js';
import { showToast, showScreen } from '../../core/ui.js';

/**
 * Módulo del Proceso: Actividades de Almacén (ACTIVIDADES ALMACEN.pdf)
 * Gestiona el ciclo completo de almacén: inicio oficial, check de célula operativa y finalización con tiempo de viaje.
 */

export function getInitialAlmacenState() {
  return {
    iniciado: false,
    currentStep: 1, // Pasos 1 al 9 según el documento
    checkRealizado: false,
    checkFormData: {
      kitHerramientas: 'Cumple',
      medidorModelo: 'Televes',
      medidorSerial: 'TEL-98124',
      medidorMac: '00:1E:C2:5A:8B:10',
      supervisorEstado: 'Asignado',
      supervisorNombre: 'CARLOS MARIO ZAPATA',
      movilApoyoEstado: 'Asignado',
      movilApoyoNombre: 'JORGE ELIECER OCAMPO',
      contactoCnd: 'Línea CND 018000'
    },
    finalizarFormData: {
      coordenadasCapturadas: true,
      coordenadasTexto: '6.2442, -75.5812 (GPS Base Almacén)',
      tiempoViaje: '13 min'
    }
  };
}

export const almacenState = reactive(getInitialAlmacenState());

export function resetAlmacenFlow() {
  Object.assign(almacenState, getInitialAlmacenState());
}

export function setAlmacenStep(step) {
  almacenState.currentStep = step;
}

export function advanceAlmacenStep(step) {
  if (step > (almacenState.currentStep || 0)) {
    almacenState.currentStep = step;
  }
}

/**
 * Confirmar inicio de actividad de almacén (Paso 3)
 */
export function confirmarInicioAlmacen(onSuccess = null) {
  const acts = authState.currentUser?.actividades;
  const actAlm = acts ? acts.find(a => a.tipo === 'almacen') : null;

  if (actAlm) {
    actAlm.estado = 'comenzado';
    actAlm.actStartTimestamp = Date.now();
    actAlm.actElapsedSec = 0;
    const now = new Date();
    actAlm.horaInicio = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  almacenState.iniciado = true;
  almacenState.currentStep = 4; // Avanzar a Paso 4: en lista de actividades
  updateLiveTimers();
  showToast('Actividades de almacén iniciadas en base.', 'info');

  if (typeof onSuccess === 'function') {
    onSuccess();
  } else {
    showScreen('/activities');
  }
}

/**
 * Guardar formulario oficial de Check Inicio (Paso 6)
 */
export function guardarCheckInicio(formData, onSuccess = null) {
  if (formData) {
    Object.assign(almacenState.checkFormData, formData);
  }
  almacenState.checkRealizado = true;

  const acts = authState.currentUser?.actividades;
  const actAlm = acts ? acts.find(a => a.tipo === 'almacen') : null;
  if (actAlm) {
    actAlm.checkRealizado = true;
  }

  almacenState.currentStep = 7; // Avanza al Paso 7: Completar actividad
  showToast('Check de inicio completado y validado satisfactoriamente.', 'success');

  if (typeof onSuccess === 'function') {
    onSuccess();
  } else {
    showScreen('/activity');
  }
}

/**
 * Finalizar oficialmente actividad de almacén (Paso 8)
 */
export function finalizarActividadAlmacen(formData, onSuccess = null) {
  if (formData) {
    Object.assign(almacenState.finalizarFormData, formData);
  }

  const acts = authState.currentUser?.actividades;
  const actAlm = acts ? acts.find(a => a.tipo === 'almacen') : null;

  if (actAlm) {
    actAlm.estado = 'cerrado';
    const now = new Date();
    actAlm.horaFin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  almacenState.currentStep = 9; // Paso 9: Ver primer evento en página principal
  updateLiveTimers();
  showToast('Actividad de almacén finalizada con éxito (Color Cian).', 'success');

  if (typeof onSuccess === 'function') {
    onSuccess();
  } else {
    showScreen('/activities');
  }
}

export function useAlmacenFlow() {
  return {
    almacenState,
    resetAlmacenFlow,
    setAlmacenStep,
    advanceAlmacenStep,
    confirmarInicioAlmacen,
    guardarCheckInicio,
    finalizarActividadAlmacen
  };
}
