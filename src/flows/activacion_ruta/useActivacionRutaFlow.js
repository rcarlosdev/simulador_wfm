import { reactive } from 'vue';
import { authState } from '../../core/auth.js';
import { showToast, showScreen } from '../../core/ui.js';

/**
 * Módulo del Proceso: Activación de Ruta de Trabajo (ACTIVACION RUTA.pdf)
 * Utiliza la fecha actual real del sistema para máxima fidelidad y realismo operativo.
 */

const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const MESES_LARGO = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export function formatOfscHeaderDate(date = new Date()) {
  const day = date.getDate();
  const m = MESES_CORTO[date.getMonth()];
  return `${m} ${day}. °`;
}

export function formatOfscLongDate(date = new Date()) {
  const day = date.getDate();
  const m = MESES_LARGO[date.getMonth()];
  const y = date.getFullYear();
  return `${day} de ${m} del ${y}`;
}

export function getInitialActivacionRutaState() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return {
    currentStep: 2, // Paso 2: Ubicar selector de fecha
    fechaSeleccionada: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
    fechaTextoHeader: formatOfscHeaderDate(now),
    fechaTextoLargo: formatOfscLongDate(now),
    selectedDay: day,
    selectedMonth: now.getMonth(),
    selectedYear: year,
    calendarioAbierto: false,
    menuListaAbierto: false,
    rutaConfirmada: false
  };
}

export const activacionRutaState = reactive(getInitialActivacionRutaState());

export function resetActivacionRutaFlow() {
  Object.assign(activacionRutaState, getInitialActivacionRutaState());
}

export function setActivacionRutaStep(step) {
  activacionRutaState.currentStep = step;
}

export function advanceActivacionRutaStep(step) {
  if (step > (activacionRutaState.currentStep || 0)) {
    activacionRutaState.currentStep = step;
  }
}

export function abrirCalendario() {
  activacionRutaState.calendarioAbierto = true;
  advanceActivacionRutaStep(3);
}

export function cerrarCalendario() {
  activacionRutaState.calendarioAbierto = false;
}

export function seleccionarFecha(dia, mesIndex, anio) {
  const d = new Date(anio, mesIndex, dia);
  activacionRutaState.fechaSeleccionada = `${String(dia).padStart(2, '0')}/${String(mesIndex + 1).padStart(2, '0')}/${anio}`;
  activacionRutaState.fechaTextoHeader = formatOfscHeaderDate(d);
  activacionRutaState.fechaTextoLargo = formatOfscLongDate(d);
  activacionRutaState.selectedDay = dia;
  activacionRutaState.selectedMonth = mesIndex;
  activacionRutaState.selectedYear = anio;
  cerrarCalendario();
  advanceActivacionRutaStep(4);
  showToast(`Fecha ${activacionRutaState.fechaTextoHeader} seleccionada para la jornada.`);
}

export function abrirMenuLista() {
  activacionRutaState.menuListaAbierto = true;
}

export function cerrarMenuLista() {
  activacionRutaState.menuListaAbierto = false;
}

export function toggleMenuLista() {
  activacionRutaState.menuListaAbierto = !activacionRutaState.menuListaAbierto;
}

export function confirmarActivacionRuta(onSuccess = null) {
  if (authState.currentUser) {
    authState.currentUser.rutaActivada = true;
  }
  activacionRutaState.rutaConfirmada = true;
  activacionRutaState.currentStep = 6; // Completado
  showToast('Ruta de trabajo activada exitosamente.', 'success');

  if (typeof onSuccess === 'function') {
    onSuccess();
  } else {
    showScreen('/activities');
  }
}

export function useActivacionRutaFlow() {
  return {
    activacionRutaState,
    resetActivacionRutaFlow,
    setActivacionRutaStep,
    advanceActivacionRutaStep,
    abrirCalendario,
    cerrarCalendario,
    seleccionarFecha,
    abrirMenuLista,
    cerrarMenuLista,
    toggleMenuLista,
    confirmarActivacionRuta
  };
}
