import { reactive } from 'vue';
import { authState } from './auth.js';
import { showToast, showScreen, openModal } from './ui.js';

/**
 * Módulo de Gestión de Actividades, Órdenes de Trabajo y Cronómetros OFSC
 */

export const activitiesState = reactive({
  currentActivityId: null,
  currentActivity: null
});

export function formatDuration(totalSec) {
  if (isNaN(totalSec) || totalSec < 0) totalSec = 0;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);

  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function updateLiveTimers() {
  const now = Date.now();
  const acts = authState.currentUser?.actividades;
  if (!Array.isArray(acts)) return;

  acts.forEach(act => {
    // Cronómetro en ruta
    if ((act.estado === 'en-ruta' || act.estado === 'en_ruta') && act.rutaStartTimestamp) {
      act.rutaElapsedSec = Math.floor((now - act.rutaStartTimestamp) / 1000);
    }
    // Cronómetro en ejecución
    if (act.estado === 'comenzado' && act.actStartTimestamp) {
      act.actElapsedSec = Math.floor((now - act.actStartTimestamp) / 1000);
    }
  });

  // Mantener sincronizada la referencia
  if (activitiesState.currentActivity) {
    const found = acts.find(a => a.id === activitiesState.currentActivity.id);
    if (found) activitiesState.currentActivity = found;
  }
}

export function selectActivity(act) {
  activitiesState.currentActivity = act;
  activitiesState.currentActivityId = act.id;
  showScreen(`/activity/${act.id}`);
}

export function iniciarRutaIndividual(act) {
  if (!act) return;
  const user = authState.currentUser;
  if (!user?.rutaActivada) {
    openModal(
      'Ruta no activada',
      '<div style="font-size:0.86rem;line-height:1.5;">Debe activar su jornada laboral en el menú lateral antes de iniciar desplazamientos hacia el predio.</div>',
      null,
      'Entendido',
      ''
    );
    return;
  }

  act.estado = 'en-ruta';
  act.rutaStartTimestamp = Date.now();
  act.rutaElapsedSec = 0;
  const now = new Date();
  act.horaInicio = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  showToast(`Desplazamiento iniciado hacia la orden ${act.ot || act.id}.`);
  updateLiveTimers();
}

export function iniciarActividadPredio(act) {
  if (!act) return;
  const isAlmacen = act.tipo === 'almacen';

  if (isAlmacen) {
    act.estado = 'comenzado';
    act.actStartTimestamp = Date.now();
    act.actElapsedSec = 0;
    const now = new Date();
    act.horaInicio = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    showToast('Actividades de almacén iniciadas en base.', 'info');
    updateLiveTimers();
    return;
  }

  // Actividad de cliente
  if (act.estado === 'en-ruta' || act.estado === 'en_ruta') {
    if (act.rutaStartTimestamp) {
      act.rutaElapsedSec = Math.floor((Date.now() - act.rutaStartTimestamp) / 1000);
    }
  }

  act.estado = 'comenzado';
  act.actStartTimestamp = Date.now();
  act.actElapsedSec = 0;
  const now = new Date();
  act.horaInicio = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  showToast(`Llegada a predio confirmada. Ejecución iniciada (${act.ot || act.id}).`, 'success');
  updateLiveTimers();
}

export function completarActividad(act) {
  if (!act) return;
  const isAlmacen = act.tipo === 'almacen';

  if (isAlmacen && !act.checkRealizado) {
    openModal(
      'Check Pendiente',
      `<div style="font-size:0.86rem;line-height:1.5;">
         Para completar la actividad de almacén debe realizar primero el <strong>Check de Inicio de Operación</strong>.
       </div>`,
      () => showScreen('/check-inicio'),
      'Ir al Check',
      'Cancelar'
    );
    return;
  }

  const msgModal = isAlmacen
    ? '¿Confirma que ha completado la dotación de herramientas y revisión en almacén?'
    : `¿Confirma que desea completar la actividad <strong>${act.ot}</strong> para el cliente <strong>${act.cliente}</strong>?`;

  openModal(
    'Completar Actividad',
    `<div style="font-size:0.86rem;line-height:1.5;">${msgModal}</div>`,
    () => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      act.estado = 'cerrado';
      act.horaFin = timeStr;
      updateLiveTimers();
      const colorNotif = isAlmacen ? 'Color Cian' : 'Color Verde Oscuro';
      showToast(`Actividad finalizada exitosamente (${colorNotif}).`, 'success');
    },
    'Completar',
    'Cancelar'
  );
}
