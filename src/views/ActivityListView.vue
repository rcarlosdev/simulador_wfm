<template>
  <div class="simulator-screen screen-activity-list screen-active" id="screen-activity-list">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn btn-open-drawer" title="Menú principal (Gestionar)" @click="openDrawer">
        <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
      </button>
      <div class="app-bar-actions">
        <button type="button" class="app-bar-btn" title="Buscar" @click="showToast('Búsqueda rápida activada')">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
        <div class="chat-badge-container btn-open-chat" title="Smart Collaboration - Chat con Deltas" @click="showScreen('/chat')">
          <button type="button" class="app-bar-btn" style="padding:2px 4px;">
            <svg viewBox="0 0 24 24" style="width:22px;height:22px;"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            <span class="chat-badge">2</span>
          </button>
          <span class="chat-timer-label">{{ state.chatTimerStr }}</span>
        </div>
      </div>
    </div>

    <!-- Subheader Oficial con Selector de Fecha y Menú Contextual (Pág 1 y 2 PDF) -->
    <div class="ofs-sub-header" style="position: relative;">
      <div class="sub-header-left">
        <span class="sub-header-title">Lista de actividades</span>
      </div>

      <div class="sub-header-right" style="display: flex; align-items: center; gap: 8px;">
        <!-- Selector de Fecha Oficial (Páginas 1 y 2 del PDF) -->
        <button
          type="button"
          class="btn-date-header"
          :class="{ 'target-highlight': currentRutaStep === 2 && !rutaActivada }"
          title="Seleccionar Fecha"
          @click="handleOpenCalendar"
        >
          <span>{{ fechaTextoHeader }}</span>
          <span style="font-size: 0.65rem; margin-left: 2px;">▼</span>
        </button>

        <!-- Botón Tres Puntos Oficial -->
        <button
          type="button"
          class="btn-dots-menu"
          :class="{
            'target-highlight': (!rutaActivada && currentRutaStep === 4) || (cierreState.otCompletada && !cierreState.rutaDesactivada && cierreState.iniciado)
          }"
          title="Opciones de Lista"
          @click.stop="toggleMenuLista"
        >
          <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>

      <!-- Menú Desplegable de Tres Puntos Oficial (Páginas 5 y 6 del PDF / Desactivar Ruta Pág 9) -->
      <div v-if="menuListaAbierto" class="list-dropdown-menu" @click.stop>
        <div
          v-if="!rutaActivada"
          class="list-dropdown-item"
          :class="{ 'item-target': currentRutaStep === 4 }"
          @click="irAActivarRuta"
        >
          Activar ruta
        </div>
        <div
          v-else-if="cierreState.otCompletada && !cierreState.rutaDesactivada"
          class="list-dropdown-item"
          :class="{ 'item-target': cierreState.otCompletada }"
          style="color:#d32f2f;font-weight:700;"
          @click="irADesactivarRuta"
        >
          Desactivar Ruta
        </div>
        <div class="list-dropdown-item" @click="verMapa">
          Mapa
        </div>
        <div class="list-dropdown-item" @click="irAInventario">
          Inventario
        </div>
      </div>
    </div>

    <!-- Contenedor scrollable interno de actividades -->
    <div class="activity-list-content screen-scroll-body" @click="menuListaAbierto = false">

      <!-- Acordeón: Pendiente -->
      <div class="activity-accordion" :class="{ 'is-collapsed': collapsed.pendiente }">
        <div class="accordion-header" @click="toggleAccordion('pendiente')">
          <span class="accordion-arrow">
            <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6 6-6 1.41-1.41z"/></svg>
          </span>
          <span class="accordion-title">
            <span style="width:12px;height:12px;background:#fbc02d;border-radius:2px;display:inline-block;"></span>
            Pendiente <span>({{ pendientes.length }})</span>
          </span>
        </div>
        <div class="accordion-body" v-show="!collapsed.pendiente">
          <div
            v-for="act in pendientes"
            :key="act.id"
            class="activity-card"
            :class="[
              act.tipo === 'almacen' ? 'color-almacen-pendiente' : 'color-pendiente',
              { 'card-target-highlight': state.almacenProgress?.iniciado && currentAlmacenStep === 1 && act.tipo === 'almacen' }
            ]"
            @click="handleSelectActivity(act)"
          >
            <div class="activity-card-text">
              <div
                class="activity-status-tag"
                :class="act.tipo === 'almacen' ? 'tag-brown' : 'tag-yellow'"
              >
                PENDIENTE
              </div>
              <div v-html="formatTitle(act.titulo)"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acordeón: En ruta -->
      <div class="activity-accordion" :class="{ 'is-collapsed': collapsed.enRuta }">
        <div class="accordion-header" @click="toggleAccordion('enRuta')">
          <span class="accordion-arrow">
            <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6 6-6 1.41-1.41z"/></svg>
          </span>
          <span class="accordion-title">
            <span style="width:12px;height:12px;background:#00e5ff;border-radius:2px;display:inline-block;"></span>
            En ruta <span>({{ enRuta.length }})</span>
          </span>
        </div>
        <div class="accordion-body" v-show="!collapsed.enRuta">
          <div
            v-for="act in enRuta"
            :key="act.id"
            class="activity-card color-en-ruta"
            @click="handleSelectActivity(act)"
          >
            <div class="activity-card-text">
              <div class="activity-status-tag tag-aguamarina">
                EN RUTA <span>• {{ formatDuration(act.rutaElapsedSec || 0) }}</span>
              </div>
              <div v-html="formatTitle(act.titulo)"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acordeón: Comenzado / Ejecución -->
      <div class="activity-accordion" :class="{ 'is-collapsed': collapsed.comenzado }">
        <div class="accordion-header" @click="toggleAccordion('comenzado')">
          <span class="accordion-arrow">
            <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6 6-6 1.41-1.41z"/></svg>
          </span>
          <span class="accordion-title">
            <span style="width:12px;height:12px;background:#76ff03;border-radius:2px;display:inline-block;"></span>
            Comenzado / Ejecución <span>({{ comenzados.length }})</span>
          </span>
        </div>
        <div class="accordion-body" v-show="!collapsed.comenzado">
          <div
            v-for="act in comenzados"
            :key="act.id"
            class="activity-card color-comenzado"
            :class="[
              { 'card-target-highlight': currentAlmacenStep === 4 && act.tipo === 'almacen' },
              { 'card-target-highlight': state.softCloseProgress?.iniciado && state.softCloseProgress?.currentStep === 17 && act.tipo === 'cliente' }
            ]"
            @click="handleSelectActivity(act)"
          >
            <div class="activity-card-text">
              <div class="activity-status-tag tag-green">
                INICIADA <span>• {{ formatDuration(act.actElapsedSec || 0) }}</span>
              </div>
              <div v-html="formatTitle(act.titulo)"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acordeón: Cerrado -->
      <div class="activity-accordion" :class="{ 'is-collapsed': collapsed.cerrado }">
        <div class="accordion-header" @click="toggleAccordion('cerrado')">
          <span class="accordion-arrow">
            <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6 6-6 1.41-1.41z"/></svg>
          </span>
          <span class="accordion-title">
            <span style="width:12px;height:12px;background:#00bcd4;border-radius:2px;display:inline-block;"></span>
            Cerrado <span>({{ cerrados.length }})</span>
          </span>
        </div>
        <div class="accordion-body" v-show="!collapsed.cerrado">
          <div
            v-for="act in cerrados"
            :key="act.id"
            class="activity-card"
            :class="act.tipo === 'almacen' ? 'color-almacen-cerrado' : 'color-cerrado'"
            @click="handleSelectActivity(act)"
          >
            <div class="activity-card-text">
              <div
                class="activity-status-tag"
                :class="act.tipo === 'almacen' ? 'tag-cyan' : 'tag-darkgreen'"
              >
                FINALIZADA
                <span v-if="act.actElapsedSec" style="opacity:0.85;">
                  ({{ Math.ceil(act.actElapsedSec / 60) }} min)
                </span>
              </div>
              <div v-html="formatTitle(act.titulo)"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- PANTALLA MODAL DE CALENDARIO INTERACTIVO (Páginas 3 y 4 del PDF) -->
    <div v-if="calendarioAbierto" class="calendar-screen-overlay">
      <div class="calendar-container">
        <!-- Barra Superior con Volver / Atrás -->
        <div class="calendar-top-bar">
          <button type="button" class="btn-cal-back" @click="cerrarCalendario">
            <svg viewBox="0 0 24 24" style="width:18px;height:18px;"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            <span>Atrás</span>
          </button>
        </div>

        <!-- Encabezado de Navegación del Mes -->
        <div class="calendar-month-header">
          <button type="button" class="btn-cal-nav" @click="mesAnterior">‹</button>
          <span class="cal-month-title">{{ tituloMesActual }}</span>
          <button type="button" class="btn-cal-nav" @click="mesSiguiente">›</button>
        </div>

        <!-- Matriz de Días de la Semana -->
        <div class="calendar-weekdays">
          <span>D</span>
          <span>L</span>
          <span>M</span>
          <span>M</span>
          <span>J</span>
          <span>V</span>
          <span>Sab</span>
        </div>

        <!-- Matriz de Días del Mes Dinámica -->
        <div
          class="calendar-days-grid"
          :class="{ 'grid-target-highlight': currentRutaStep === 3 }"
        >
          <!-- Celdas vacías previas al día 1 -->
          <span v-for="n in celdasVaciasPrevias" :key="'empty-' + n" class="cal-day empty"></span>

          <!-- Días del mes -->
          <span
            v-for="dia in totalDiasMes"
            :key="'dia-' + dia"
            class="cal-day"
            :class="{ 'day-active-target': esDiaHoy(dia) }"
            @click="handleDayClick(dia)"
          >
            {{ dia }}
          </span>
        </div>
      </div>
    </div>

    <!-- PISTAS FLOTANTES DEL PROCESO DE ACTIVACIÓN DE RUTA -->
    <!-- Paso 2 (ACTIVACION RUTA.pdf Pág 2) -->
    <FlowHintBox
      v-if="!rutaActivada && currentRutaStep === 2 && !calendarioAbierto"
      step="2"
    >
      Ubica la opción de Fecha que se encuentra en la parte superior derecha. Pulsa en ella para desplegar el calendario.
    </FlowHintBox>

    <!-- Paso 3 (ACTIVACION RUTA.pdf Pág 4) -->
    <FlowHintBox
      v-else-if="!rutaActivada && (calendarioAbierto || currentRutaStep === 3)"
      step="3"
    >
      A continuación, selecciona la fecha en curso, para este caso, <strong>{{ fechaTextoLargoActual }}</strong>.
    </FlowHintBox>

    <!-- Paso 4 (ACTIVACION RUTA.pdf Pág 6) -->
    <FlowHintBox
      v-else-if="!rutaActivada && currentRutaStep === 4"
      step="4"
    >
      Para el proceso de activación de ruta, pulsa los tres puntos que se encuentran en la parte superior derecha y pulsa la opción <strong>Activar ruta</strong>.
    </FlowHintBox>

    <!-- PISTA FLOTANTE PASO 17 (SoftClose) - Solo si el proceso SoftClose está activo -->
    <FlowHintBox
      v-else-if="state.softCloseProgress?.iniciado && state.softCloseProgress?.currentStep === 17"
      step="17"
    >
      El aplicativo actualizará los cambios realizados en la OT. Después, en <strong>Lista de actividades</strong>, selecciona la OT del cliente.
    </FlowHintBox>

    <!-- Paso 5 (CIERRE OT y RUTA WFM.pdf Pág 8-9) - Solo si cierre está activo -->
    <FlowHintBox
      v-else-if="cierreState.iniciado && cierreState.otCompletada && !cierreState.rutaDesactivada"
      step="5"
      title="Paso 5 - Desactivar Ruta"
    >
      Todas tus actividades han finalizado. Pulsa los tres puntos (···) de la parte superior derecha y selecciona <strong>Desactivar Ruta</strong>.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSimulator, formatDuration } from '../composables/useSimulator';
import { useCierreFlow } from '../flows/cierre/useCierreFlow';
import { validarDesactivacionRuta, ejecutarValidacionConFeedback } from '../core/businessRules';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  openDrawer,
  showScreen,
  selectActivity,
  openModal,
  showToast,
  advanceSoftCloseStep,
  advanceAlmacenStep,
  advanceDesplazamientoStep
} = useSimulator();

const { cierreState, advanceCierreStep } = useCierreFlow();

const collapsed = ref({
  pendiente: false,
  enRuta: false,
  comenzado: false,
  cerrado: false
});

const toggleAccordion = (key) => {
  collapsed.value[key] = !collapsed.value[key];
};

// Nombres oficiales de meses en español
const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Estado del flujo de ruta
const rutaActivada = computed(() => !!state.currentUser?.rutaActivada);
const currentRutaStep = computed(() => state.activacionRutaProgress?.currentStep || 2);
const fechaTextoHeader = computed(() => state.activacionRutaProgress?.fechaTextoHeader || 'Hoy');
const fechaTextoLargoActual = computed(() => state.activacionRutaProgress?.fechaTextoLargo || 'la fecha actual');

// Estado del flujo de almacén
const currentAlmacenStep = computed(() => state.almacenProgress?.currentStep || 1);
const actAlmacen = computed(() => (state.currentUser?.actividades || []).find(a => a.tipo === 'almacen'));

// Estado del flujo de desplazamiento
const currentDesplazamientoStep = computed(() => state.desplazamientoProgress?.currentStep || 1);

const calendarioAbierto = ref(false);
const menuListaAbierto = ref(false);

// Navegación del calendario según fecha real
const fechaActualHoy = new Date();
const viewYear = ref(fechaActualHoy.getFullYear());
const viewMonth = ref(fechaActualHoy.getMonth());

const tituloMesActual = computed(() => {
  return `${NOMBRES_MESES[viewMonth.value]} ${viewYear.value}`;
});

const totalDiasMes = computed(() => {
  return new Date(viewYear.value, viewMonth.value + 1, 0).getDate();
});

const celdasVaciasPrevias = computed(() => {
  const diaSemanaInicio = new Date(viewYear.value, viewMonth.value, 1).getDay(); // 0 = Domingo
  return diaSemanaInicio;
});

const esDiaHoy = (dia) => {
  return (
    dia === fechaActualHoy.getDate() &&
    viewMonth.value === fechaActualHoy.getMonth() &&
    viewYear.value === fechaActualHoy.getFullYear()
  );
};

const mesAnterior = () => {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
};

const mesSiguiente = () => {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
};

const toggleMenuLista = () => {
  menuListaAbierto.value = !menuListaAbierto.value;
};

const handleOpenCalendar = () => {
  viewYear.value = fechaActualHoy.getFullYear();
  viewMonth.value = fechaActualHoy.getMonth();
  calendarioAbierto.value = true;
  if (state.activacionRutaProgress) {
    state.activacionRutaProgress.currentStep = 3;
  }
};

const cerrarCalendario = () => {
  calendarioAbierto.value = false;
};

const handleDayClick = (day) => {
  const fechaElegida = new Date(viewYear.value, viewMonth.value, day);
  const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const MESES_LARGO_MIN = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  if (state.activacionRutaProgress) {
    state.activacionRutaProgress.fechaTextoHeader = `${MESES_CORTO[viewMonth.value]} ${day}. °`;
    state.activacionRutaProgress.fechaTextoLargo = `${day} de ${MESES_LARGO_MIN[viewMonth.value]} del ${viewYear.value}`;
    state.activacionRutaProgress.fechaSeleccionada = `${String(day).padStart(2, '0')}/${String(viewMonth.value + 1).padStart(2, '0')}/${viewYear.value}`;
    state.activacionRutaProgress.currentStep = 4;
  }
  cerrarCalendario();
  showToast(`Fecha ${state.activacionRutaProgress?.fechaTextoHeader} seleccionada para la jornada.`);
};

const irAActivarRuta = () => {
  menuListaAbierto.value = false;
  if (state.activacionRutaProgress) {
    state.activacionRutaProgress.currentStep = 5;
  }
  showScreen('/activar-ruta');
};

const irADesactivarRuta = () => {
  menuListaAbierto.value = false;
  const acts = state.currentUser?.actividades || [];
  const valRuta = validarDesactivacionRuta(acts);
  if (!ejecutarValidacionConFeedback(valRuta)) return;

  advanceCierreStep(6);
  showScreen('/desactivar-ruta');
};

const verMapa = () => {
  menuListaAbierto.value = false;
  openModal(
    'Mapa de Rutas (OFSC)',
    '<div style="text-align:center;padding:12px;color:#ccc;font-size:0.85rem;">Vista general de zonificación y cuadrantes técnicos de la ciudad.</div>',
    null,
    'Cerrar',
    ''
  );
};

const irAInventario = () => {
  menuListaAbierto.value = false;
  showScreen('/inventario');
};

// Validación de prerrequisito al seleccionar actividad
const handleSelectActivity = (act) => {
  if (!rutaActivada.value) {
    openModal(
      'Ruta no activada',
      `<div style="font-size:0.86rem;line-height:1.5;">
         Para gestionar y atender órdenes de trabajo debe primero <strong>Activar su ruta de trabajo</strong>.<br><br>
         ¿Desea activar su jornada de trabajo ahora?
       </div>`,
      () => {
        if (state.activacionRutaProgress) {
          state.activacionRutaProgress.currentStep = 5;
        }
        showScreen('/activar-ruta');
      },
      'Activar Ruta',
      'Cancelar'
    );
    return;
  }

  if (state.softCloseProgress?.currentStep === 17) {
    advanceSoftCloseStep(18);
  }

  if (act.tipo === 'almacen') {
    state.almacenProgress.iniciado = true;
    if (act.estado === 'pendiente') {
      advanceAlmacenStep(2);
    } else if (act.estado === 'comenzado') {
      if (!state.almacenProgress?.checkRealizado) {
        advanceAlmacenStep(5);
      } else {
        advanceAlmacenStep(7);
      }
    }
  }

  selectActivity(act);
};

const formatTitle = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
};

function parseHorarioToMinutes(act) {
  if (!act) return 9999;
  const timeStr = act.horario || act.inicio_fin || act.ventana_entrega || act.titulo || '';
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 9999;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

const actividades = computed(() => {
  const acts = [...(state.currentUser?.actividades || [])];
  return acts.sort((a, b) => parseHorarioToMinutes(a) - parseHorarioToMinutes(b));
});

const pendientes = computed(() => actividades.value.filter(a => a.estado === 'pendiente'));
const enRuta = computed(() => actividades.value.filter(a => a.estado === 'en-ruta' || a.estado === 'en_ruta'));
const comenzados = computed(() => actividades.value.filter(a => a.estado === 'comenzado'));
const cerrados = computed(() => actividades.value.filter(a => a.estado === 'cerrado'));
</script>

<style scoped>
.btn-date-header {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-date-header:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.target-highlight {
  background: rgba(198, 40, 40, 0.3) !important;
  border: 1.5px solid #ef5350 !important;
  box-shadow: 0 0 10px rgba(239, 83, 80, 0.5) !important;
  animation: pulseTarget 1.5s infinite;
}

@keyframes pulseTarget {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}

.list-dropdown-menu {
  position: absolute;
  top: 50px;
  right: 12px;
  background: #ffffff;
  color: #212121;
  border-radius: 4px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
  z-index: 100;
  min-width: 170px;
  overflow: hidden;
  animation: menuDrop 0.15s ease-out;
}

@keyframes menuDrop {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.list-dropdown-item {
  padding: 11px 16px;
  font-size: 0.88rem;
  color: #212121;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s ease;
}

.list-dropdown-item:last-child {
  border-bottom: none;
}

.list-dropdown-item:hover {
  background: #eeeeee;
}

.list-dropdown-item.item-target {
  background: #ffebee !important;
  color: #c62828 !important;
  font-weight: 700;
  border-left: 3px solid #ef5350;
}

/* Pantalla / Modal de Calendario */
.calendar-screen-overlay {
  position: fixed;
  inset: 0;
  background: #ffffff;
  color: #212121;
  z-index: 120;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.calendar-container {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 20px 80px 20px;
}

.calendar-top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.btn-cal-back {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.95rem;
  color: #424242;
  cursor: pointer;
  font-weight: 600;
  padding: 4px 0;
}

.calendar-month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.cal-month-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #212121;
}

.btn-cal-nav {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #757575;
  cursor: pointer;
  padding: 0 10px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.82rem;
  color: #757575;
  font-weight: 600;
  margin-bottom: 14px;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px 6px;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
}

.grid-target-highlight {
  background: rgba(239, 83, 80, 0.08);
  border: 1px solid rgba(239, 83, 80, 0.4);
}

.cal-day {
  font-size: 0.92rem;
  color: #424242;
  padding: 6px 0;
  cursor: pointer;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin: 0 auto;
}

.cal-day:hover {
  background: #f0f0f0;
}

.cal-day.empty {
  cursor: default;
}

.cal-day.day-active-target {
  background: #2e7d32 !important;
  color: #ffffff !important;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.4);
  position: relative;
}

.cal-day.day-active-target::after {
  content: '•';
  position: absolute;
  bottom: 0px;
  font-size: 0.75rem;
  color: #ffffff;
}

.card-target-highlight {
  box-shadow: 0 0 14px rgba(239, 83, 80, 0.5) !important;
  border: 1.5px solid #ef5350 !important;
  animation: pulseCard 1.5s infinite;
}

@keyframes pulseCard {
  0% { transform: scale(1); }
  50% { transform: scale(1.015); }
  100% { transform: scale(1); }
}
</style>
