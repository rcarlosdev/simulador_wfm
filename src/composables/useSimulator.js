import { reactive, watch } from 'vue';
import router from '../router';
import { SIMULADOR_DATA } from '../js/data.js';

const STORAGE_KEY = 'ofsc_simulador_state_v2';

function getInitialState() {
  const defaultUser = JSON.parse(JSON.stringify(SIMULADOR_DATA.usuarios_prueba[0]));
  const defaultAct = (defaultUser.actividades && defaultUser.actividades.length > 1)
    ? defaultUser.actividades[1]
    : (defaultUser.actividades ? defaultUser.actividades[0] : null);

  return {
    currentUser: defaultUser,
    currentActivityId: defaultAct?.id || null,
    currentActivity: defaultAct,
    fullscreen: false,
    clockTime: '07:15',
    timerSeconds: 1760, // 29:20
    chatTimerStr: '29:20',
    drawerOpen: false,
    contextMenuOpen: false,
    colorimetriaModalOpen: false,
    modal: {
      isOpen: false,
      title: '',
      bodyHtml: '',
      confirmCallback: null,
      okText: 'OK',
      cancelText: 'Cancelar'
    },
    toast: {
      visible: false,
      message: '',
      type: 'normal'
    },
    chatMessages: [
      {
        id: 1,
        sender: 'delta',
        author: 'DELTA ALIADO EZENTIS',
        text: 'LES RECUERDO ESTA ES LA PLANTILLA DE RAZÓN:\nEstado: RAZON (LETRA)\nCuenta:\nOT:\nNodo:\nMarket:\nDirección:\nDescripción:\nNombre titular:\nObservación: (NOTAS DE POR QUÉ SE RAZONA ESPECIFICANDO SI LO ATIENDEN O NO)',
        time: '08:31 AM'
      },
      {
        id: 2,
        sender: 'delta',
        author: 'DELTA ALIADO EZENTIS',
        text: 'Buen día compañero, por favor confirmar cuando inicie la actividad de almacén y reporte seriales.',
        time: '08:45 AM'
      }
    ],
    // Persistencia del flujo y pasos de activación técnica
    activacionProgress: {
      stepNumber: 1,
      selectedService: null,
      ubicacionTvSelected: 'Seleccione una ubicacion',
      selectedTvServicioId: null,
      tvModificarUbicacion: false,
      tvPredioUbicacion: 'Alcoba Auxiliar 1',
      tvMostrarMasTec: false,
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
    }
  };
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error leyendo localStorage:', e);
    return null;
  }
}

// Inicializar estado reactivo
const baseInitial = getInitialState();
const savedData = loadPersistedState();

if (savedData) {
  if (savedData.currentUser !== undefined) baseInitial.currentUser = savedData.currentUser;
  if (savedData.currentActivityId !== undefined) baseInitial.currentActivityId = savedData.currentActivityId;
  if (savedData.fullscreen !== undefined) baseInitial.fullscreen = savedData.fullscreen;
  if (savedData.timerSeconds !== undefined) baseInitial.timerSeconds = savedData.timerSeconds;
  if (savedData.chatTimerStr !== undefined) baseInitial.chatTimerStr = savedData.chatTimerStr;
  if (savedData.chatMessages !== undefined) baseInitial.chatMessages = savedData.chatMessages;
  if (savedData.activacionProgress !== undefined) {
    baseInitial.activacionProgress = Object.assign({}, baseInitial.activacionProgress, savedData.activacionProgress);
  }

  // Vincular la referencia de actividad activa a partir de las actividades del usuario
  if (baseInitial.currentUser?.actividades?.length > 0) {
    const found = baseInitial.currentUser.actividades.find(a => a.id === baseInitial.currentActivityId);
    baseInitial.currentActivity = found || baseInitial.currentUser.actividades[0];
  }
}

const state = reactive(baseInitial);

// Persistir automáticamente ante cualquier cambio de estado
let saveDebounceTimer = null;
function persistState() {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(() => {
    try {
      const payload = {
        currentUser: state.currentUser,
        currentActivityId: state.currentActivity?.id || state.currentActivityId,
        fullscreen: state.fullscreen,
        timerSeconds: state.timerSeconds,
        chatTimerStr: state.chatTimerStr,
        chatMessages: state.chatMessages,
        activacionProgress: state.activacionProgress
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Error persistiendo estado en localStorage:', e);
    }
  }, 100);
}

watch(
  () => [
    state.currentUser,
    state.currentActivity,
    state.currentActivityId,
    state.fullscreen,
    state.chatMessages,
    state.activacionProgress
  ],
  () => {
    persistState();
  },
  { deep: true }
);

// Reloj y temporizadores en vivo (actualizan transcurrido según marcas de tiempo reales)
let clockInterval = null;
let toastTimeout = null;

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

function updateLiveTimers() {
  if (!state.currentUser || !state.currentUser.actividades) return;

  state.currentUser.actividades.forEach(act => {
    if (act.estado === 'en-ruta' || act.estado === 'en_ruta') {
      if (!act.rutaStartTime) act.rutaStartTime = Date.now();
      act.rutaElapsedSec = Math.floor((Date.now() - act.rutaStartTime) / 1000);
      if (state.currentActivity && state.currentActivity.id === act.id) {
        state.currentActivity.rutaElapsedSec = act.rutaElapsedSec;
      }
    } else if (act.estado === 'comenzado') {
      if (!act.actStartTime) act.actStartTime = Date.now();
      act.actElapsedSec = Math.floor((Date.now() - act.actStartTime) / 1000);
      if (state.currentActivity && state.currentActivity.id === act.id) {
        state.currentActivity.actElapsedSec = act.actElapsedSec;
      }
    }
  });
}

function initTimers() {
  if (clockInterval) return;

  const updateClock = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    state.clockTime = `${h}:${m}`;
  };
  updateClock();

  clockInterval = setInterval(() => {
    updateClock();
    if (state.timerSeconds > 0) {
      state.timerSeconds--;
      const mins = Math.floor(state.timerSeconds / 60);
      const secs = state.timerSeconds % 60;
      state.chatTimerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    updateLiveTimers();
  }, 1000);
}

// Mapa de pantallas a rutas del router
const screenRoutes = {
  'screen-login': '/login',
  'login': '/login',
  'screen-activity-list': '/activities',
  'activities': '/activities',
  'screen-activity-details': '/activity',
  'activity': '/activity',
  'screen-servicios-ot': '/servicios-ot',
  'servicios-ot': '/servicios-ot',
  'screen-check-inicio': '/check-inicio',
  'check-inicio': '/check-inicio',
  'screen-activacion-auto': '/activacion-auto',
  'activacion-auto': '/activacion-auto',
  'screen-cobertura-wifi': '/cobertura-wifi',
  'cobertura-wifi': '/cobertura-wifi',
  'screen-inventario': '/inventario',
  'inventario': '/inventario',
  'screen-comandos-act': '/comandos-act',
  'comandos-act': '/comandos-act',
  'screen-chat': '/chat',
  'chat': '/chat'
};

export function useSimulator() {
  initTimers();

  const showToast = (message, type = 'normal') => {
    if (toastTimeout) clearTimeout(toastTimeout);
    state.toast.message = message;
    state.toast.type = type;
    state.toast.visible = true;
    toastTimeout = setTimeout(() => {
      state.toast.visible = false;
    }, 3200);
  };

  const showScreen = (screenIdOrPath) => {
    state.contextMenuOpen = false;
    state.drawerOpen = false;
    const targetRoute = screenRoutes[screenIdOrPath] || screenIdOrPath;
    if (targetRoute && router.currentRoute.value.path !== targetRoute) {
      router.push(targetRoute);
    }
  };

  const login = (cedula, password) => {
    const users = SIMULADOR_DATA.usuarios_prueba;
    const user = users.find(u =>
      (u.cedula === cedula.trim() || (u.email && u.email.toLowerCase() === cedula.trim().toLowerCase())) &&
      u.password === password.trim()
    );

    if (user) {
      state.currentUser = JSON.parse(JSON.stringify(user));
      if (state.currentUser.actividades && state.currentUser.actividades.length > 0) {
        state.currentActivity = state.currentUser.actividades[0];
        state.currentActivityId = state.currentActivity.id;
      }
      persistState();
      showScreen('/activities');
      showToast(`Bienvenido, ${state.currentUser.nombre}`, 'success');
    } else {
      showToast('Credenciales incorrectas. Selecciona un técnico de prueba.', 'error');
    }
  };

  const logout = () => {
    // Al cerrar sesión se limpia la persistencia
    localStorage.removeItem(STORAGE_KEY);
    state.currentUser = null;
    state.currentActivity = null;
    state.currentActivityId = null;
    state.drawerOpen = false;
    state.activacionProgress = getInitialState().activacionProgress;
    showScreen('/login');
    showToast('Sesión cerrada.');
  };

  const resetSimulator = () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = getInitialState();
    Object.assign(state, fresh);
    persistState();
    showToast('Simulador restablecido a los valores iniciales de prueba.', 'info');
    showScreen('/activities');
  };

  const openDrawer = () => { state.drawerOpen = true; };
  const closeDrawer = () => { state.drawerOpen = false; };
  const toggleDrawer = () => { state.drawerOpen = !state.drawerOpen; };

  const openContextMenu = () => { state.contextMenuOpen = true; };
  const closeContextMenu = () => { state.contextMenuOpen = false; };
  const toggleContextMenu = () => { state.contextMenuOpen = !state.contextMenuOpen; };

  const openModal = (title, bodyHtml, onConfirm, okText = 'OK', cancelText = 'Cancelar') => {
    state.modal.title = title;
    state.modal.bodyHtml = bodyHtml;
    state.modal.confirmCallback = onConfirm;
    state.modal.okText = okText;
    state.modal.cancelText = cancelText;
    state.modal.isOpen = true;
  };

  const closeModal = () => {
    state.modal.isOpen = false;
    state.modal.confirmCallback = null;
  };

  const confirmModal = () => {
    if (typeof state.modal.confirmCallback === 'function') {
      state.modal.confirmCallback();
    }
    closeModal();
  };

  const openColorimetria = () => {
    state.drawerOpen = false;
    state.colorimetriaModalOpen = true;
  };

  const closeColorimetria = () => {
    state.colorimetriaModalOpen = false;
  };

  const toggleFullscreen = () => {
    state.fullscreen = !state.fullscreen;
    persistState();
  };

  const selectActivity = (act) => {
    const found = state.currentUser?.actividades?.find(a => a.id === act.id);
    state.currentActivity = found || act;
    state.currentActivityId = state.currentActivity.id;
    persistState();
    showScreen(`/activity/${act.id}`);
  };

  // Flujo 1: Iniciar Ruta (Aguamarina)
  const iniciarRutaIndividual = (act) => {
    openModal(
      'Iniciar Ruta / Desplazamiento',
      `<div style="font-size:0.86rem;line-height:1.5;">
         ¿Iniciar desplazamiento hacia la orden del cliente <strong>${act.cliente}</strong>?<br><br>
         <div style="padding:8px;background:#00363a;border-left:3px solid #00bcd4;border-radius:4px;color:#e0f7fa;font-size:0.78rem;">
           📍 La actividad pasará a estado <strong>En Ruta</strong> (Color Aguamarina) registrando el tiempo de viaje con geolocalización de manera independiente. El temporizador de ruta iniciará en este instante.
         </div>
       </div>`,
      () => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        act.estado = 'en-ruta';
        act.horaRuta = timeStr;
        act.rutaStartTime = Date.now();
        act.rutaElapsedSec = 0;
        if (state.currentUser) {
          state.currentUser.rutaActivada = true;
        }
        updateLiveTimers();
        persistState();
        showToast(`Ruta iniciada a las ${timeStr}. Temporizador de desplazamiento activo.`, 'info');
      },
      'Iniciar Ruta',
      'Cancelar'
    );
  };

  // Flujo 2: Iniciar Actividad en Predio (Verde Claro)
  const iniciarActividadPredio = (act) => {
    const isAlmacen = act.tipo === 'almacen';
    const tituloModal = isAlmacen ? 'Iniciar Actividad de Almacén' : 'Inicio de Actividad en Predio';
    const msgModal = isAlmacen
      ? `¿Desea dar inicio a las actividades de almacén en bodega? (Color Verde Claro). Recuerde que debe realizar el <strong>Check de Inicio de Operación</strong> antes de completarla. El temporizador de actividad comenzará a contar el tiempo de ejecución.`
      : `¿Ha llegado al predio de <strong>${act.cliente}</strong>? La ruta se detendrá y la orden pasará a ejecución oficial (Color Verde Claro). Iniciará el temporizador de tiempo en predio.`;

    openModal(
      tituloModal,
      `<div style="font-size:0.86rem;line-height:1.5;">${msgModal}</div>`,
      () => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        act.estado = 'comenzado';
        act.horaInicio = timeStr;
        act.actStartTime = Date.now();
        act.actElapsedSec = 0;
        updateLiveTimers();
        persistState();
        showToast(`Actividad iniciada a las ${timeStr}. Temporizador de ejecución activo.`, 'success');
      },
      'OK',
      'Cancelar'
    );
  };

  // Flujo 3: Completar Actividad
  const completarActividad = (act) => {
    if (act.tipo === 'almacen' && !act.checkRealizado) {
      openModal(
        'Requisito Obligatorio (Página 4)',
        `<div style="font-size:0.85rem;line-height:1.5;">
           <span style="color:#ffb74d;font-weight:700;">⚠️ Check de Inicio de Operación Pendiente:</span><br><br>
           Para completar actividades de almacén debe realizar primero el <strong>Check de Inicio de Operación</strong>. Si no se diligencia este requisito, no se dejará completar la actividad.
         </div>`,
        () => {
          showScreen('/check-inicio');
        },
        'Hacer Check Ahora',
        'Cancelar'
      );
      return;
    }

    const isAlmacen = act.tipo === 'almacen';
    const tituloModal = isAlmacen ? 'Finalizar Almacén' : 'Completar Orden de Trabajo';
    const msgModal = isAlmacen
      ? `¿Desea dar por finalizadas las actividades de almacén? La actividad quedará cerrada en <strong>Color Cian</strong> (Página 5) y se procederá al primer servicio.`
      : `¿Desea cerrar la orden de trabajo de <strong>${act.cliente}</strong>? El servicio quedará finalizado satisfactoriamente en <strong>Color Verde Oscuro</strong>.`;

    openModal(
      tituloModal,
      `<div style="font-size:0.86rem;line-height:1.5;">${msgModal}</div>`,
      () => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        act.estado = 'cerrado';
        act.horaFin = timeStr;
        updateLiveTimers();
        persistState();
        const colorNotif = isAlmacen ? 'Color Cian' : 'Color Verde Oscuro';
        showToast(`Actividad finalizada exitosamente (${colorNotif}).`, 'success');
      },
      'Completar',
      'Cancelar'
    );
  };

  // Chat
  const sendChatMessage = (text) => {
    if (!text || !text.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    state.chatMessages.push({
      id: Date.now(),
      sender: 'technician',
      author: state.currentUser?.nombre || 'TÉCNICO',
      text: text.trim(),
      time: timeStr
    });
    persistState();

    setTimeout(() => {
      state.chatMessages.push({
        id: Date.now() + 1,
        sender: 'delta',
        author: 'DELTA ALIADO EZENTIS',
        text: 'Recibido compañero, datos verificados y validados en el sistema. Puedes proceder con la certificación.',
        time: timeStr
      });
      persistState();
      showToast('Nuevo mensaje del Delta recibido.');
    }, 1500);
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
    selectActivity,
    iniciarRutaIndividual,
    iniciarActividadPredio,
    completarActividad,
    sendChatMessage
  };
}
