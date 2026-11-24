/**
 * Fachada Principal del Simulador WFM (Facade Pattern)
 * Centraliza y orquesta los módulos de arquitectura:
 * - Core: Auth, Activities, UI, Chat, Persistence
 * - Flows: Activación de Equipos, SoftClose e Inventarios
 */

import { reactive, watch } from 'vue';
import { SIMULADOR_DATA } from '../js/data.js';

// Módulos Core
import { loadStoredData, saveStoredData, clearStoredData } from '../core/persistence.js';
import { authState, setAuthenticatedUser, findUserByCredentials } from '../core/auth.js';
import {
  activitiesState,
  formatDuration,
  updateLiveTimers,
  selectActivity,
  iniciarRutaIndividual,
  iniciarActividadPredio,
  completarActividad
} from '../core/activities.js';
import {
  uiState,
  showToast,
  showScreen,
  openModal,
  closeModal,
  confirmModal,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  openContextMenu,
  closeContextMenu,
  toggleContextMenu,
  openColorimetria,
  closeColorimetria,
  toggleFullscreen,
  setModoGuiado,
  toggleModoGuiado
} from '../core/ui.js';
import { chatState, tickChatTimer, sendChatMessage } from '../core/chat.js';

// Módulos de Procesos Técnicos (Flows)
import {
  activacionState,
  resetActivacionFlow,
  setActivacionStep,
  advanceActivacionStep
} from '../flows/activacion/useActivacionFlow.js';

import {
  softCloseState,
  resetSoftCloseFlow,
  setSoftCloseStep,
  advanceSoftCloseStep,
  submitSoftClose
} from '../flows/softclose/useSoftCloseFlow.js';

import {
  activacionRutaState,
  resetActivacionRutaFlow,
  setActivacionRutaStep,
  advanceActivacionRutaStep,
  confirmarActivacionRuta,
  formatOfscHeaderDate,
  formatOfscLongDate
} from '../flows/activacion_ruta/useActivacionRutaFlow.js';

import {
  almacenState,
  resetAlmacenFlow,
  setAlmacenStep,
  advanceAlmacenStep,
  confirmarInicioAlmacen,
  guardarCheckInicio,
  finalizarActividadAlmacen
} from '../flows/almacen/useAlmacenFlow.js';

import {
  desplazamientoState,
  resetDesplazamientoFlow,
  setDesplazamientoStep,
  advanceDesplazamientoStep,
  iniciarViajeWaze,
  cambiarAGoogleMaps,
  finalizarDesplazamiento
} from '../flows/desplazamiento/useDesplazamientoFlow.js';

import {
  cierreState,
  resetCierreFlow,
  setCierreStep,
  advanceCierreStep,
  capturarCoordenadasGPS,
  completarOrdenTrabajo,
  desactivarRutaTrabajo
} from '../flows/cierre/useCierreFlow.js';

import {
  planillaNotasState,
  resetPlanillaNotasFlow,
  setPlanillaStep,
  advancePlanillaStep,
  abrirListaColaboracion,
  abrirChatDeltaGeneral,
  abrirInfoUsuario,
  iniciarConversacionPrivada,
  enviarMensajePrivado
} from '../flows/planilla_notas/usePlanillaNotasFlow.js';

import {
  mapaCalorState,
  useMapaCalorFlow
} from '../flows/mapa_calor/useMapaCalorFlow.js';

import {
  brownfieldState,
  useBrownfieldFlow,
  resetBrownfieldFlow,
  setBrownfieldStep,
  advanceBrownfieldStep,
  activarOntInternet,
  verificarDesinstalacionAutomatica,
  activarTvDeco,
  activarUltraWifi,
  ejecutarComandoCambiarServicio
} from '../flows/brownfield/useBrownfieldFlow.js';

// Restaurar datos guardados
function initializeState() {
  const saved = loadStoredData();
  if (saved) {
    if (saved.currentUser !== undefined) authState.currentUser = saved.currentUser;
    if (saved.currentActivityId !== undefined) activitiesState.currentActivityId = saved.currentActivityId;
    if (saved.fullscreen !== undefined) uiState.fullscreen = saved.fullscreen;
    if (saved.modoGuiado !== undefined) uiState.modoGuiado = saved.modoGuiado;
    if (saved.timerSeconds !== undefined) chatState.timerSeconds = saved.timerSeconds;
    if (saved.chatTimerStr !== undefined) chatState.chatTimerStr = saved.chatTimerStr;
    if (saved.chatMessages !== undefined) chatState.chatMessages = saved.chatMessages;
    if (saved.activacionProgress !== undefined) {
      Object.assign(activacionState, saved.activacionProgress);
    }
    if (saved.activacionRutaProgress !== undefined) {
      Object.assign(activacionRutaState, saved.activacionRutaProgress);
      if (activacionRutaState.fechaTextoHeader === 'Feb 18. °') {
        const now = new Date();
        activacionRutaState.fechaTextoHeader = formatOfscHeaderDate(now);
        activacionRutaState.fechaTextoLargo = formatOfscLongDate(now);
      }
    }
    if (saved.almacenProgress !== undefined) {
      Object.assign(almacenState, saved.almacenProgress);
    }
    if (saved.desplazamientoProgress !== undefined) {
      Object.assign(desplazamientoState, saved.desplazamientoProgress);
    }
    if (saved.cierreProgress !== undefined) {
      Object.assign(cierreState, saved.cierreProgress);
    }
    if (saved.planillaNotasProgress !== undefined) {
      Object.assign(planillaNotasState, saved.planillaNotasProgress);
    }
    if (saved.mapaCalorProgress !== undefined) {
      Object.assign(mapaCalorState, saved.mapaCalorProgress);
    }
    if (saved.brownfieldProgress !== undefined) {
      Object.assign(brownfieldState, saved.brownfieldProgress);
    }
    if (saved.softCloseProgress !== undefined) {
      Object.assign(softCloseState, saved.softCloseProgress);
      // Evitar que arranquen con sugerencias del paso 3 si no se ha iniciado explícitamente
      if (!softCloseState.iniciado || softCloseState.currentStep <= 3) {
        softCloseState.iniciado = false;
        softCloseState.currentStep = 0;
      }
    }
  }

  // Vincular la actividad actual inicial
  if (authState?.currentUser?.actividades?.length > 0 && activitiesState) {
    const found = authState.currentUser.actividades.find(a => a && a.id === activitiesState.currentActivityId);
    activitiesState.currentActivity = found || authState.currentUser.actividades[0];
    activitiesState.currentActivityId = activitiesState.currentActivity?.id;
  }
}

initializeState();

// Objeto reactivo unificado con getters y setters para mantener 100% de compatibilidad
export const state = reactive({
  // Módulos internos
  auth: authState,
  ui: uiState,
  activities: activitiesState,
  chat: chatState,
  activacion: activacionState,
  softClose: softCloseState,
  activacionRuta: activacionRutaState,
  almacen: almacenState,
  desplazamiento: desplazamientoState,
  cierre: cierreState,
  planillaNotas: planillaNotasState,
  mapaCalor: mapaCalorState,

  // Getters / Setters de compatibilidad con componentes existentes
  get currentUser() { return authState.currentUser; },
  set currentUser(v) { authState.currentUser = v; },

  get currentActivity() { return activitiesState.currentActivity; },
  set currentActivity(v) { activitiesState.currentActivity = v; },

  get currentActivityId() { return activitiesState.currentActivityId; },
  set currentActivityId(v) { activitiesState.currentActivityId = v; },

  get fullscreen() { return uiState.fullscreen; },
  set fullscreen(v) { uiState.fullscreen = v; },

  get modoGuiado() { return uiState.modoGuiado; },
  set modoGuiado(v) { uiState.modoGuiado = v; },

  get clockTime() { return uiState.clockTime; },
  set clockTime(v) { uiState.clockTime = v; },

  get timerSeconds() { return chatState.timerSeconds; },
  set timerSeconds(v) { chatState.timerSeconds = v; },

  get chatTimerStr() { return chatState.chatTimerStr; },
  set chatTimerStr(v) { chatState.chatTimerStr = v; },

  get drawerOpen() { return uiState.drawerOpen; },
  set drawerOpen(v) { uiState.drawerOpen = v; },

  get contextMenuOpen() { return uiState.contextMenuOpen; },
  set contextMenuOpen(v) { uiState.contextMenuOpen = v; },

  get colorimetriaModalOpen() { return uiState.colorimetriaModalOpen; },
  set colorimetriaModalOpen(v) { uiState.colorimetriaModalOpen = v; },

  get modal() { return uiState.modal; },
  get toast() { return uiState.toast; },
  get chatMessages() { return chatState.chatMessages; },
  get activacionProgress() { return activacionState; },
  get softCloseProgress() { return softCloseState; },
  get activacionRutaProgress() { return activacionRutaState; },
  get almacenProgress() { return almacenState; },
  get desplazamientoProgress() { return desplazamientoState; },
  get cierreProgress() { return cierreState; },
  get planillaNotasProgress() { return planillaNotasState; },
  get mapaCalorProgress() { return mapaCalorState; },
  get brownfieldProgress() { return brownfieldState; }
});

// Guardado reactivo en segundo plano ante cualquier cambio
watch(
  () => [
    authState?.currentUser,
    activitiesState?.currentActivity,
    activitiesState?.currentActivityId,
    uiState?.fullscreen,
    uiState?.modoGuiado,
    chatState?.chatMessages,
    activacionState,
    softCloseState,
    activacionRutaState,
    almacenState,
    desplazamientoState,
    cierreState,
    planillaNotasState,
    mapaCalorState,
    brownfieldState
  ],
  () => {
    saveStoredData(() => ({
      currentUser: authState?.currentUser,
      currentActivityId: activitiesState?.currentActivity?.id || activitiesState?.currentActivityId,
      fullscreen: uiState?.fullscreen,
      modoGuiado: uiState?.modoGuiado,
      timerSeconds: chatState?.timerSeconds,
      chatTimerStr: chatState?.chatTimerStr,
      chatMessages: chatState?.chatMessages,
      activacionProgress: activacionState,
      softCloseProgress: softCloseState,
      activacionRutaProgress: activacionRutaState,
      almacenProgress: almacenState,
      desplazamientoProgress: desplazamientoState,
      cierreProgress: cierreState,
      planillaNotasProgress: planillaNotasState,
      mapaCalorProgress: mapaCalorState,
      brownfieldProgress: brownfieldState
    }));
  },
  { deep: true }
);

// Temporizador central de la aplicación
let timerInterval = null;
function initTimers() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    const now = new Date();
    uiState.clockTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    tickChatTimer();
    updateLiveTimers();
  }, 1000);
}

// Re-exportar formatDuration para que los componentes puedan usarlo
export { formatDuration };

// Composable principal
export function useSimulator() {
  initTimers();

  const login = (cedula, password) => {
    const user = findUserByCredentials(cedula, password);
    if (user) {
      setAuthenticatedUser(user);
      if (user.actividades?.length > 0) {
        activitiesState.currentActivity = user.actividades[0];
        activitiesState.currentActivityId = user.actividades[0].id;
      }
      showScreen('/activities');
      showToast(`Bienvenido, ${authState.currentUser.nombre}`, 'success');
    } else {
      showToast('Credenciales incorrectas. Selecciona un técnico de prueba.', 'error');
    }
  };

  const logout = () => {
    clearStoredData();
    authState.currentUser = null;
    activitiesState.currentActivity = null;
    activitiesState.currentActivityId = null;
    uiState.drawerOpen = false;
    resetActivacionFlow();
    resetSoftCloseFlow();
    resetActivacionRutaFlow();
    resetAlmacenFlow();
    resetDesplazamientoFlow();
    resetCierreFlow();
    resetPlanillaNotasFlow();
    resetBrownfieldFlow();
    showScreen('/login');
    showToast('Sesión cerrada.');
  };

  const resetSimulator = () => {
    clearStoredData();
    authState.currentUser = null;
    activitiesState.currentActivity = null;
    activitiesState.currentActivityId = null;
    uiState.drawerOpen = false;
    resetActivacionFlow();
    resetSoftCloseFlow();
    resetActivacionRutaFlow();
    resetAlmacenFlow();
    resetDesplazamientoFlow();
    resetCierreFlow();
    resetPlanillaNotasFlow();
    resetBrownfieldFlow();
    showToast('Simulador restablecido. Inicia sesión para comenzar.', 'info');
    showScreen('/login');
  };

  return {
    state,
    users: SIMULADOR_DATA.usuarios_prueba,
    formatDuration,
    showToast,
    showScreen,
    login,
    logout,
    resetSimulator,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    openContextMenu,
    closeContextMenu,
    toggleContextMenu,
    openModal,
    closeModal,
    confirmModal,
    openColorimetria,
    closeColorimetria,
    toggleFullscreen,
    setModoGuiado,
    toggleModoGuiado,
    selectActivity,
    iniciarRutaIndividual,
    iniciarActividadPredio,
    completarActividad,
    sendChatMessage,
    // Métodos de SoftClose
    setSoftCloseStep,
    advanceSoftCloseStep,
    submitSoftClose,
    // Métodos de Activación
    setActivacionStep,
    advanceActivacionStep,
    // Métodos de Activación de Ruta
    setActivacionRutaStep,
    advanceActivacionRutaStep,
    confirmarActivacionRuta,
    // Métodos de Actividades de Almacén
    resetAlmacenFlow,
    setAlmacenStep,
    advanceAlmacenStep,
    confirmarInicioAlmacen,
    guardarCheckInicio,
    finalizarActividadAlmacen,
    // Métodos de Desplazamiento y Navegación
    resetDesplazamientoFlow,
    setDesplazamientoStep,
    advanceDesplazamientoStep,
    iniciarViajeWaze,
    cambiarAGoogleMaps,
    finalizarDesplazamiento,
    // Métodos de Cierre de OT y Desactivar Ruta
    resetCierreFlow,
    setCierreStep,
    advanceCierreStep,
    capturarCoordenadasGPS,
    completarOrdenTrabajo,
    desactivarRutaTrabajo,
    // Métodos de Planilla de Notas y Colaboración
    resetPlanillaNotasFlow,
    setPlanillaStep,
    advancePlanillaStep,
    abrirListaColaboracion,
    abrirChatDeltaGeneral,
    abrirInfoUsuario,
    iniciarConversacionPrivada,
    enviarMensajePrivado,
    // Métodos de Mapa de Calor (App H&B)
    mapaCalorState,
    ...useMapaCalorFlow(),
    // Métodos de Proceso Brownfield
    brownfieldState,
    ...useBrownfieldFlow()
  };
}
