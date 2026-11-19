import { reactive } from 'vue';
import router from '../router';

/**
 * Módulo de Estado Global de Interfaz de Usuario (UI)
 */

export const uiState = reactive({
  fullscreen: false,
  clockTime: '07:15',
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
  }
});

let toastTimeout = null;

export function showToast(message, type = 'normal') {
  if (toastTimeout) clearTimeout(toastTimeout);
  uiState.toast.message = message;
  uiState.toast.type = type;
  uiState.toast.visible = true;
  toastTimeout = setTimeout(() => {
    uiState.toast.visible = false;
  }, 3200);
}

export function openModal(title, bodyHtml, onConfirm = null, okText = 'OK', cancelText = 'Cancelar') {
  uiState.modal.title = title;
  uiState.modal.bodyHtml = bodyHtml;
  uiState.modal.confirmCallback = onConfirm;
  uiState.modal.okText = okText;
  uiState.modal.cancelText = cancelText;
  uiState.modal.isOpen = true;
}

export function closeModal() {
  uiState.modal.isOpen = false;
  uiState.modal.confirmCallback = null;
}

export function confirmModal() {
  if (typeof uiState.modal.confirmCallback === 'function') {
    uiState.modal.confirmCallback();
  }
  closeModal();
}

export function openDrawer() { uiState.drawerOpen = true; }
export function closeDrawer() { uiState.drawerOpen = false; }
export function toggleDrawer() { uiState.drawerOpen = !uiState.drawerOpen; }

export function openContextMenu() { uiState.contextMenuOpen = true; }
export function closeContextMenu() { uiState.contextMenuOpen = false; }
export function toggleContextMenu() { uiState.contextMenuOpen = !uiState.contextMenuOpen; }

export function openColorimetria() { uiState.colorimetriaModalOpen = true; }
export function closeColorimetria() { uiState.colorimetriaModalOpen = false; }

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      uiState.fullscreen = true;
    }).catch(err => {
      console.warn('Pantalla completa no disponible:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      uiState.fullscreen = false;
    }).catch(err => {
      console.warn('Error al salir de pantalla completa:', err);
    });
  }
}

// Mapa de nombres de pantallas legacy a rutas de vue-router
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
  'screen-inventario-detalle': '/inventario-detalle',
  'inventario-detalle': '/inventario-detalle',
  'screen-inventario-acciones': '/inventario-acciones',
  'inventario-acciones': '/inventario-acciones',
  'screen-comandos-act': '/comandos-act',
  'comandos-act': '/comandos-act',
  'screen-softclose': '/softclose',
  'softclose': '/softclose',
  'screen-activar-ruta': '/activar-ruta',
  'activar-ruta': '/activar-ruta',
  'screen-comenzar-actividad': '/comenzar-actividad',
  'comenzar-actividad': '/comenzar-actividad',
  'screen-finalizar-actividad': '/finalizar-actividad',
  'finalizar-actividad': '/finalizar-actividad',
  'screen-desplazamiento-waze': '/desplazamiento-waze',
  'desplazamiento-waze': '/desplazamiento-waze',
  'screen-desplazamiento-maps': '/desplazamiento-maps',
  'desplazamiento-maps': '/desplazamiento-maps',
  'screen-chat': '/chat',
  'chat': '/chat'
};

export function showScreen(screenIdOrPath) {
  uiState.contextMenuOpen = false;
  uiState.drawerOpen = false;
  const targetRoute = screenRoutes[screenIdOrPath] || screenIdOrPath;
  router.push(targetRoute);
}
