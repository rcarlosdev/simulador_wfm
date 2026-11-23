<template>
  <div class="simulator-screen screen-activity-details screen-active" id="screen-activity-details" v-if="act">
    <!-- App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn btn-open-drawer" title="Menú" @click="openDrawer">
        <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
      </button>
      <div class="app-bar-actions">
        <button type="button" class="app-bar-btn" title="Buscar" @click="showToast('Búsqueda rápida activada')">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
        <div
          class="chat-badge-container btn-open-chat"
          :class="{ 'target-highlight': act.tipo !== 'almacen' && act.estado === 'comenzado' && mapaCalorState.certificacionEnviada && !planillaNotasState.planillaEnviada && currentPlanillaStep === 2 }"
          title="Colaboración / Mensajería"
          @click="irAColaboracion"
        >
          <button type="button" class="app-bar-btn" style="padding:2px 4px;">
            <svg viewBox="0 0 24 24" style="width:22px;height:22px;"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            <span class="chat-badge">6</span>
          </button>
          <span class="chat-timer-label">{{ state.chatTimerStr || '19:40' }}</span>
        </div>
      </div>
    </div>

    <!-- Subheader Oscuro con < y ... -->
    <div class="ofs-sub-header">
      <div class="sub-header-left">
        <button type="button" class="btn-back btn-back-to-list" title="Volver a la lista de actividades" @click="showScreen('/activities')">
          <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <div class="sub-header-titles-stack">
          <span class="sub-header-title">Detalles de actividad</span>
          <span class="sub-header-subtitle tech-name-display">{{ state.currentUser?.nombre || 'TÉCNICO' }}</span>
        </div>
      </div>
      <div class="sub-header-right-group" style="display:flex;align-items:center;gap:6px;">
        <div
          v-if="act.estado === 'en-ruta' || act.estado === 'en_ruta'"
          class="activity-live-timer-badge badge-en-ruta"
        >
          <span class="timer-badge-icon">🚗</span>
          <span class="timer-badge-val">En ruta: {{ formatDuration(act.rutaElapsedSec || 0) }}</span>
        </div>
        <div
          v-else-if="act.estado === 'comenzado'"
          class="activity-live-timer-badge badge-comenzado"
        >
          <span class="timer-badge-icon">⏱️</span>
          <span class="timer-badge-val">En ejecución: {{ formatDuration(act.actElapsedSec || 0) }}</span>
        </div>

        <button
          type="button"
          class="btn-dots-menu"
          :class="{
            'target-highlight': (act.estado === 'comenzado' && !mapaCalorState.certificacionEnviada && currentMapaCalorStep === 1) ||
                                (act.estado === 'comenzado' && mapaCalorState.certificacionEnviada && planillaNotasState.planillaEnviada && !cierreState.otCompletada && cierreState.currentStep === 3)
          }"
          title="Opciones (...)"
          @click.stop="handleToggleContextMenu"
        >
          <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>
    </div>

    <!-- Contenido Scrollable con Toda la Información (Imágenes 1, 2 y 3) -->
    <div class="details-scrollable screen-scroll-body">

      <!-- SECCIÓN: INFORMACIÓN CLIENTE -->
      <div class="details-section-title">Información Cliente</div>

      <div class="detail-field">
        <div class="detail-field-label">Cuenta</div>
        <div class="detail-field-value">{{ act.cuenta }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">OT No</div>
        <div class="detail-field-value">{{ act.ot }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Nombre</div>
        <div class="detail-field-value">{{ act.cliente }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Dir</div>
        <div class="detail-field-value" v-html="formatDir(act.direccion)"></div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Ciudad</div>
        <div class="detail-field-value">{{ act.ciudad || 'MEDELLIN' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Nodo</div>
        <div class="detail-field-value">{{ act.nodo || 'HMEDE1' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Tipo OT</div>
        <div class="detail-field-value">{{ act.tipoOT || 'INSTALACIONES DTH' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Subtipo</div>
        <div class="detail-field-value">{{ act.subtipo || 'Instalaciones Basica DTH Postpago' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">SLA C</div>
        <div class="detail-field-value">{{ act.sla_c ?? '48' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">SLA S</div>
        <div class="detail-field-value">{{ act.sla_s ?? '36' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Intervalos de tiempo</div>
        <div class="detail-field-value">{{ act.intervalos || '13-18' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Inicio/Fin</div>
        <div class="detail-field-value">{{ act.inicio_fin || '11:52 AM - 01:52 PM' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Ventana Entrega</div>
        <div class="detail-field-value">{{ act.ventana_entrega || act.ventana || '12:30 PM - 01:30 PM' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Notas</div>
        <div class="detail-field-value">{{ act.notas || 'TV Estrato 1' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Calidad</div>
        <div class="detail-field-value">{{ act.calidad ?? '0' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Servicios</div>
        <div class="detail-field-value">{{ act.servicios ?? '0' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Agenda</div>
        <div class="detail-field-value">{{ act.agenda ?? '1' }}</div>
      </div>

      <div class="detail-field">
        <div class="detail-field-label">Tipo Marker</div>
        <div class="detail-field-value">{{ act.tipo_marker || 'Tipo2' }}</div>
      </div>

      <!-- Botón Marker -->
      <button type="button" class="detail-btn-action" style="margin-top:6px;" @click="showToast('Marker registrado: ' + (act.tipo_marker || 'Tipo2'))">
        Marker
      </button>

      <!-- SECCIÓN: SUSCRIPTOR -->
      <div class="details-section-title" style="margin-top:22px;">Suscriptor</div>
      <button type="button" class="detail-btn-action" @click="verDatosSuscriptor">
        Suscriptor
      </button>
      <button type="button" class="detail-btn-action" @click="showScreen('/servicios-ot')">
        Servicios OT
      </button>

      <!-- SECCIÓN: RED EXTERNA -->
      <div class="details-section-title" style="margin-top:22px;">Red Externa</div>
      <button type="button" class="detail-btn-action" @click="showToast('Cuenta Matriz: ' + act.cuenta + ' · Troncal Principal Activa')">
        Cuenta Matriz
      </button>
      <button type="button" class="detail-btn-action" @click="showToast('Sin fallas masivas reportadas en el nodo', 'success')">
        Falla Masiva
      </button>

      <!-- SECCIÓN: INFORMACIÓN TÉCNICO -->
      <div class="details-section-title" style="margin-top:22px;">Información Técnico</div>
      <div class="detail-field">
        <div class="detail-field-label">Técnico Asignado</div>
        <div class="detail-field-value">{{ state.currentUser?.nombre }}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">Móvil / Cuadrante</div>
        <div class="detail-field-value">{{ state.currentUser?.movil }}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">Estado de Ruta</div>
        <div
          class="detail-field-value"
          :style="{ color: state.currentUser?.rutaActivada ? '#81c784' : '#fbc02d', fontWeight: '700' }"
        >
          {{ state.currentUser?.rutaActivada ? 'Ruta Activada' : 'Pendiente de Activar' }}
        </div>
      </div>
      <div style="height:30px;"></div>
    </div>

    <!-- Menú Contextual Desplegable (...) -->
    <div
      class="ofs-context-menu-backdrop"
      :class="{ 'is-open': state.contextMenuOpen }"
      @click="closeContextMenu"
    >
      <div class="ofs-context-menu" @click.stop>
        <!-- Franja Superior Coral con Cronómetro/Vehículo y Temporizador -->
        <div class="context-menu-header-banner">
          <div class="context-menu-banner-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 11h-2V7h2v6zm6.5 2.5l-1.5-1.5V11h3v3.5h-1.5zM4 17h16v2H4v-2z"/>
            </svg>
          </div>
          <span class="context-menu-banner-timer">{{ currentTimerFormatted }}</span>
        </div>

        <!-- Opciones dinámicas para Almacén -->
        <template v-if="act.tipo === 'almacen'">
          <div
            v-if="act.estado === 'pendiente'"
            class="context-menu-item"
            :class="{ 'item-target-highlight': currentAlmacenStep === 2 }"
            @click="handleAction('iniciar_almacen')"
          >
            Iniciar
          </div>
          <template v-else-if="act.estado === 'comenzado'">
            <div
              class="context-menu-item"
              :class="{ 'item-target-highlight': currentAlmacenStep === 7 && state.almacenProgress?.checkRealizado }"
              @click="handleAction('completar_almacen')"
            >
              Completar
            </div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div
              class="context-menu-item"
              :class="{ 'item-target-highlight': currentAlmacenStep === 5 && !state.almacenProgress?.checkRealizado }"
              style="color:#ffd54f;font-weight:700;"
              @click="handleAction('check_inicio')"
            >
              Check Inicio Operación
            </div>
            <div class="context-menu-item" @click="handleAction('ajustar_tiempo')">Ajustar tiempo</div>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
            <div class="context-menu-item" @click="handleAction('incidente')">Consulta Incidente</div>
            <div class="context-menu-item" @click="handleAction('verificacion')">Verificacion Cliente</div>
          </template>
          <template v-else>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
          </template>
        </template>

        <!-- Opciones dinámicas para Cliente -->
        <template v-else>
          <template v-if="act.estado === 'pendiente'">
            <div class="context-menu-item" style="color:#00e5ff;font-weight:700;" @click="handleAction('iniciar_ruta')">🚗 Iniciar Desplazamiento</div>
            <div class="context-menu-item" style="color:#76ff03;font-weight:700;" @click="handleAction('iniciar_predio')">🟢 Iniciar actividad (Comenzar en predio)</div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div class="context-menu-item" style="color:#4fc3f7;font-weight:700;" @click="handleAction('activacion_auto')">Activacion Servicios</div>
            <div class="context-menu-item" @click="handleAction('inventario')">Inventario</div>
            <div class="context-menu-item" @click="handleAction('ir_a')">Ir a</div>
            <div
              class="context-menu-item"
              :class="{ 'item-target-highlight': currentDesplazamientoStep === 2 }"
              @click="handleAction('mapa')"
            >
              Mapa
            </div>
            <div
              class="context-menu-item"
              :class="{ 'item-target-highlight': currentDesplazamientoStep === 3 }"
              @click="handleAction('navegacion')"
            >
              Navegación
            </div>
            <div class="context-menu-item" @click="handleAction('falla_masiva')">Verifica Falla Masiva</div>
            <div class="context-menu-item" @click="handleAction('incidente')">Consulta Incidente</div>
            <div class="context-menu-item" @click="handleAction('verificacion')">Verificacion Cliente</div>
          </template>
          <template v-else-if="act.estado === 'en-ruta' || act.estado === 'en_ruta'">
            <div class="context-menu-item" style="color:#76ff03;font-weight:700;" @click="handleAction('iniciar_predio')">🟢 Iniciar actividad (Llegada al predio)</div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
          </template>
          <template v-else-if="act.estado === 'comenzado'">
            <div
              class="context-menu-item"
              :class="{
                'item-target-highlight': mapaCalorState.certificacionEnviada && planillaNotasState.planillaEnviada && !cierreState.otCompletada && cierreState.currentStep === 3
              }"
              style="color:#d32f2f;font-weight:700;"
              @click="handleAction('completar')"
            >
              Completar
            </div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div class="context-menu-item" style="color:#4fc3f7;font-weight:700;" @click="handleAction('activacion_auto')">Activacion Servicios</div>
            <div class="context-menu-item" @click="handleAction('ajustar_tiempo')">Ajustar tiempo</div>
            <div
              class="context-menu-item"
              :class="{
                'item-target-highlight': act.estado === 'comenzado' && !mapaCalorState.certificacionEnviada && currentMapaCalorStep === 2
              }"
              style="color:#81c784;font-weight:700;"
              @click="handleAction('cobertura_wifi')"
            >
              Cobertura Wifi
            </div>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('inventario')">Inventario</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
            <div
              class="context-menu-item"
              :class="{ 'item-target-highlight': state.softCloseProgress?.iniciado && state.softCloseProgress?.currentStep === 18 }"
              style="color:#e53935;font-weight:700;"
              @click="handleAction('softclose')"
            >
              SoftClose
            </div>
            <div class="context-menu-item" @click="handleAction('verificacion')">Verificacion Cliente</div>
          </template>
          <template v-else>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('inventario')">Inventario</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
            <div
              class="context-menu-item"
              style="color:#e53935;font-weight:700;"
              @click="handleAction('softclose')"
            >
              SoftClose
            </div>
            <div class="context-menu-item" @click="handleAction('verificacion')">Verificacion Cliente</div>
          </template>
        </template>
      </div>
    </div>

    <!-- PISTAS FLOTANTES DEL PROCESO DE ACTIVIDADES DE ALMACÉN -->
    <!-- Paso 2 (ACTIVIDADES ALMACEN.pdf Pág 4) -->
    <FlowHintBox
      v-if="act.tipo === 'almacen' && act.estado === 'pendiente' && currentAlmacenStep === 2"
      step="2"
    >
      En el menú de tres puntos (...) de la esquina superior derecha, pulsa <strong>Iniciar</strong>.
    </FlowHintBox>

    <!-- Paso 5 (ACTIVIDADES ALMACEN.pdf Pág 10) -->
    <FlowHintBox
      v-else-if="act.tipo === 'almacen' && act.estado === 'comenzado' && currentAlmacenStep === 5"
      step="5"
    >
      En el menú de tres puntos (...), pulsa <strong>Check Inicio Operación</strong>.
    </FlowHintBox>

    <!-- Paso 7 (ACTIVIDADES ALMACEN.pdf Pág 14) -->
    <FlowHintBox
      v-else-if="act.tipo === 'almacen' && act.estado === 'comenzado' && currentAlmacenStep === 7"
      step="7"
    >
      En el menú de tres puntos (...), pulsa <strong>Completar</strong> para finalizar la actividad de almacén.
    </FlowHintBox>

    <!-- Pistas para actividad Brownfield en estado pendiente -->
    <FlowHintBox
      v-else-if="act.tipo !== 'almacen' && act.estado === 'pendiente' && (act.subtipo === 'BROWNFIELD' || act.isBrownfield)"
      step="0"
      title="Actividad Brownfield - Por Iniciar"
    >
      Orden <strong>BROWNFIELD (Migración FTTH)</strong> pendiente. Despliega el menú (···) y a tu discreción puedes:
      <br>• <strong>Iniciar Desplazamiento</strong> para simular el viaje en Waze/Maps.
      <br>• <strong>Iniciar actividad (Comenzar en predio)</strong> para empezar de inmediato.
      <br>• O acceder directamente a <strong>Activacion Servicios</strong> o <strong>Inventario</strong> para repasar el flujo.
    </FlowHintBox>

    <!-- PISTAS FLOTANTES DEL PROCESO DE DESPLAZAMIENTO -->
    <!-- Paso 2 (DESPLAZAMIENTO.pdf Pág 3) -->
    <FlowHintBox
      v-else-if="act.tipo !== 'almacen' && act.estado === 'pendiente' && currentDesplazamientoStep === 2"
      step="2"
    >
      En el menú desplegable, pulsa la opción <strong>Mapa</strong> para visualizar el lugar de la visita.
    </FlowHintBox>

    <!-- Paso 3 (DESPLAZAMIENTO.pdf Pág 5) -->
    <FlowHintBox
      v-else-if="act.tipo !== 'almacen' && act.estado === 'pendiente' && currentDesplazamientoStep === 3"
      step="3"
    >
      También puedes pulsar la opción <strong>Navegación</strong> para visualizar el destino desde la <em>app</em> de tu preferencia.
    </FlowHintBox>

    <!-- PISTAS FLOTANTES (Solo cuando el usuario está en el proceso de SoftClose en el Paso 18) -->
    <FlowHintBox
      v-else-if="state.softCloseProgress?.iniciado && state.softCloseProgress?.currentStep === 18"
      step="18"
    >
      En la OT del cliente, despliega el menú con los tres puntos de la parte superior derecha, y selecciona <strong>SoftClose</strong>.
    </FlowHintBox>

    <!-- ====================================================================
         SECUENCIA OPERATIVA: MAPA DE CALOR -> PLANILLA DE NOTAS -> CIERRE OT
         ==================================================================== -->
    <!-- 1. Paso 1 Cobertura WiFi (MAPA DE CALOR app H&B.pdf Pág 1) -->
    <FlowHintBox
      v-else-if="act.tipo !== 'almacen' && act.estado === 'comenzado' && !mapaCalorState.certificacionEnviada && currentMapaCalorStep === 1 && !state.contextMenuOpen"
      step="1"
      title="Paso 1 - Menú de Opciones"
    >
      En la pantalla <strong>Detalles de actividad</strong>, despliega el menú presionando los <strong>tres puntos</strong> ubicados en la parte superior derecha.
    </FlowHintBox>

    <!-- 1. Paso 2 Cobertura WiFi (MAPA DE CALOR app H&B.pdf Pág 2) -->
    <FlowHintBox
      v-else-if="act.tipo !== 'almacen' && act.estado === 'comenzado' && !mapaCalorState.certificacionEnviada && currentMapaCalorStep === 2 && state.contextMenuOpen"
      step="2"
      title="Paso 2 - Cobertura Wifi"
    >
      En el menú desplegado, selecciona la opción <strong>Cobertura wifi</strong>.
    </FlowHintBox>

    <!-- 2. Paso 2 Planilla de Notas (PLANILLA DE NOTAS.pdf Pág 1) - Tras certificar Cobertura WiFi -->
    <FlowHintBox
      v-else-if="act.tipo !== 'almacen' && act.estado === 'comenzado' && mapaCalorState.certificacionEnviada && !planillaNotasState.planillaEnviada && currentPlanillaStep === 2"
      step="2"
      title="Paso 2 - Plantilla de Notas"
    >
      Para acceder a la plantilla de notas, pulsa el <strong>botón de mensajería</strong> ubicado en la parte superior derecha.
    </FlowHintBox>

    <!-- 3. Paso 3 Cierre de OT (CIERRE OT y RUTA WFM.pdf Pág 1) - Tras enviar Planilla de Notas -->
    <FlowHintBox
      v-else-if="act.tipo !== 'almacen' && act.estado === 'comenzado' && mapaCalorState.certificacionEnviada && planillaNotasState.planillaEnviada && !cierreState.otCompletada && cierreState.currentStep === 3"
      step="3"
      title="Paso 3 - Completar OT"
    >
      En el menú de tres puntos (···) de la parte superior derecha, selecciona la opción <strong>Completar</strong>.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSimulator, formatDuration } from '../composables/useSimulator';
import { useCierreFlow } from '../flows/cierre/useCierreFlow';
import { usePlanillaNotasFlow } from '../flows/planilla_notas/usePlanillaNotasFlow';
import { useMapaCalorFlow } from '../flows/mapa_calor/useMapaCalorFlow';
import {
  validarCierreOrdenCliente,
  validarFinalizacionAlmacen,
  ejecutarValidacionConFeedback
} from '../core/businessRules';
import FlowHintBox from '../components/FlowHintBox.vue';

const route = useRoute();
const {
  state,
  openDrawer,
  showScreen,
  toggleContextMenu,
  closeContextMenu,
  openModal,
  closeModal,
  showToast,
  iniciarRutaIndividual,
  iniciarActividadPredio,
  completarActividad,
  advanceSoftCloseStep,
  advanceAlmacenStep,
  advanceDesplazamientoStep
} = useSimulator();

const { cierreState, advanceCierreStep } = useCierreFlow();
const { planillaNotasState, advancePlanillaStep, abrirListaColaboracion } = usePlanillaNotasFlow();
const { mapaCalorState, abrirMenuDetalles, abrirCoberturaWifi } = useMapaCalorFlow();

const currentPlanillaStep = computed(() => planillaNotasState.currentStep);
const currentMapaCalorStep = computed(() => mapaCalorState.currentStep);

const handleToggleContextMenu = () => {
  if (currentMapaCalorStep.value === 1 && act.value?.estado === 'comenzado') {
    abrirMenuDetalles();
  }
  toggleContextMenu();
};

const irAColaboracion = () => {
  abrirListaColaboracion();
  showScreen('/chat');
};

const currentAlmacenStep = computed(() => state.almacenProgress?.currentStep || 1);
const currentDesplazamientoStep = computed(() => state.desplazamientoProgress?.currentStep || 1);

const syncActivityFromRoute = () => {
  const paramId = route.params.id;
  if (paramId && state.currentUser?.actividades) {
    const found = state.currentUser.actividades.find(a => a.id === paramId);
    if (found) {
      state.currentActivity = found;
      return;
    }
  }
  // Si no hay actividad actual pero sí usuario, tomar la primera
  if (!state.currentActivity && state.currentUser?.actividades?.length > 0) {
    state.currentActivity = state.currentUser.actividades[0];
  }
};

onMounted(syncActivityFromRoute);
watch(() => route.params.id, syncActivityFromRoute);

const act = computed(() => {
  if (!state.currentActivity && state.currentUser?.actividades?.length > 0) {
    state.currentActivity = state.currentUser.actividades[0];
  }
  return state.currentActivity;
});

const formatDir = (dir) => {
  if (!dir) return '';
  return dir.replace(/\n/g, '<br>');
};

const currentTimerFormatted = computed(() => {
  if (!act.value) return '--:--';
  if (act.value.estado === 'en-ruta' || act.value.estado === 'en_ruta') {
    return formatDuration(act.value.rutaElapsedSec || 0);
  }
  if (act.value.estado === 'comenzado') {
    return formatDuration(act.value.actElapsedSec || 0);
  }
  if (act.value.estado === 'cerrado') {
    return act.value.actElapsedSec ? formatDuration(act.value.actElapsedSec) : '00:00';
  }
  return '--:--';
});

const verDatosSuscriptor = () => {
  openModal(
    'Datos del Suscriptor',
    `<strong>Cliente:</strong> ${act.value?.cliente || 'CLIENTE DEMO'}<br>
     <strong>Cuenta:</strong> ${act.value?.cuenta || '63993686'}<br>
     <strong>Dirección:</strong> ${(act.value?.direccion || '').replace(/\n/g, ' ')}<br>
     <strong>Estado Suscriptor:</strong> Activo · Sin bloqueos`,
    null,
    'Cerrar',
    ''
  );
};

const handleAction = (actionKey) => {
  closeContextMenu();
  const current = act.value;
  if (!current) return;

  switch (actionKey) {
    case 'iniciar_ruta':
      iniciarRutaIndividual(current);
      break;

    case 'iniciar_predio':
      iniciarActividadPredio(current);
      break;

    case 'iniciar_almacen':
      advanceAlmacenStep(3);
      showScreen('/comenzar-actividad');
      break;

    case 'completar':
      if (current.tipo === 'almacen') {
        const valAlmacen = validarFinalizacionAlmacen();
        if (!ejecutarValidacionConFeedback(valAlmacen)) return;
        advanceAlmacenStep(8);
        showScreen('/finalizar-actividad');
      } else {
        const valCliente = validarCierreOrdenCliente();
        if (!ejecutarValidacionConFeedback(valCliente)) return;
        advanceCierreStep(4);
        showScreen('/completar-ot');
      }
      break;

    case 'completar_almacen':
      advanceAlmacenStep(8);
      showScreen('/finalizar-actividad');
      break;

    case 'check_inicio':
      advanceAlmacenStep(6);
      showScreen('/check-inicio');
      break;

    case 'activacion_auto':
      showScreen('/activacion-auto');
      break;

    case 'cobertura_wifi':
      abrirCoberturaWifi();
      showScreen('/cobertura-wifi');
      break;

    case 'inventario':
      if (activity.value?.subtipo !== 'BROWNFIELD' && !activity.value?.isBrownfield) {
        state.softCloseProgress.iniciado = true;
        state.softCloseProgress.currentStep = 4;
      }
      showScreen('/inventario');
      break;

    case 'softclose':
      advanceSoftCloseStep(19);
      showScreen('/softclose');
      break;

    case 'ajustar_tiempo':
      openModal(
        'Ajustar Tiempo',
        `<div style="font-size:0.85rem;line-height:1.5;">
           ¿Desea solicitar extensión de tiempo estimado para la actividad?<br><br>
           <div class="form-group-field">
             <label>Tiempo Adicional Requerido</label>
             <select class="form-control-select">
               <option>+15 minutos (Novedad acometida)</option>
               <option>+30 minutos (Dificultad de paso)</option>
               <option>+45 minutos (Validación planta)</option>
             </select>
           </div>
         </div>`,
        () => showToast('Tiempo de actividad ajustado en agenda OFSC.', 'success'),
        'Guardar Ajuste',
        'Cancelar'
      );
      break;

    case 'incidente':
      openModal(
        'Consulta de Incidente',
        `<div style="font-size:0.85rem;line-height:1.5;">
           <strong>OT:</strong> ${current.ot}<br>
           <strong>Estado de Red:</strong> <span style="color:#81c784;">Normal - Sin degradación</span><br>
           <strong>Tickets Abiertos:</strong> 0 reportes en el nodo ${current.nodo}
         </div>`,
        null,
        'Cerrar',
        ''
      );
      break;

    case 'acciones':
      const isAlm = current.tipo === 'almacen';
      const accionesHtml = isAlm
        ? `<div style="display:flex;flex-direction:column;gap:8px;padding-top:4px;">
             <button type="button" class="detail-btn-action" id="vue-modal-check" style="margin:0;">Check Inicio Operación</button>
             <button type="button" class="detail-btn-action" id="vue-modal-completar" style="margin:0;background:#1b5e20;border-color:#2e7d32;">Completar Actividad</button>
           </div>`
        : `<div style="display:flex;flex-direction:column;gap:8px;padding-top:4px;">
             <button type="button" class="detail-btn-action" id="vue-modal-activacion" style="margin:0;">Activación Automática de Equipos</button>
             <button type="button" class="detail-btn-action" id="vue-modal-wifi" style="margin:0;">Cobertura WiFi (Mapa de Calor H&B)</button>
             <button type="button" class="detail-btn-action" id="vue-modal-rf" style="margin:0;">Niveles RF / Parámetros Señal</button>
             <button type="button" class="detail-btn-action" id="vue-modal-completar" style="margin:0;background:#1b5e20;border-color:#2e7d32;">Completar Actividad</button>
           </div>`;

      openModal(
        'Acciones Disponibles',
        accionesHtml,
        null,
        'Cerrar',
        ''
      );

      setTimeout(() => {
        const btnAct = document.getElementById('vue-modal-activacion');
        const btnWifi = document.getElementById('vue-modal-wifi');
        const btnRf = document.getElementById('vue-modal-rf');
        const btnChk = document.getElementById('vue-modal-check');
        const btnComp = document.getElementById('vue-modal-completar');

        if (btnAct) btnAct.onclick = () => { closeModal(); showScreen('/activacion-auto'); };
        if (btnWifi) btnWifi.onclick = () => { closeModal(); showScreen('/cobertura-wifi'); };
        if (btnRf) btnRf.onclick = () => { closeModal(); showScreen('/comandos-act'); };
        if (btnChk) btnChk.onclick = () => { closeModal(); showScreen('/check-inicio'); };
        if (btnComp) btnComp.onclick = () => {
          closeModal();
          completarActividad(current);
        };
      }, 50);
      break;

    case 'historial':
      openModal(
        'Historial de Acciones',
        `<div style="font-size:0.8rem;line-height:1.5;">
           <div style="border-bottom:1px solid #333;padding:6px 0;"><strong>07:15 AM:</strong> Ruta Activada por el técnico</div>
           <div style="border-bottom:1px solid #333;padding:6px 0;"><strong>11:52 AM:</strong> Notificación de proximidad al predio</div>
           <div style="border-bottom:1px solid #333;padding:6px 0;"><strong>12:28 PM:</strong> Desplazamiento finalizado en dirección</div>
           <div style="padding:6px 0;color:#81c784;"><strong>${current.horaInicio || '12:30 PM'}:</strong> Estado actual: ${current.estado.toUpperCase()}</div>
         </div>`,
        null,
        'Cerrar',
        ''
      );
      break;

    case 'navegacion':
      advanceDesplazamientoStep(4);
      showScreen('/desplazamiento-waze');
      break;

    case 'ir_a':
      showToast(`Navegando a: ${(current.direccion || '').replace(/\n/g, ' ')}`);
      break;

    case 'falla_masiva':
      showToast('Sin fallas masivas reportadas en el nodo', 'success');
      break;

    case 'mapa':
      if (currentDesplazamientoStep.value === 2) {
        advanceDesplazamientoStep(3);
      }
      openModal(
        'Mapa de Ubicación',
        `<div style="background:#111;border:1px solid #333;border-radius:4px;padding:12px;text-align:center;">
           <div style="font-size:0.82rem;font-weight:700;color:#00e5ff;margin-bottom:6px;">Coordenadas: 6.2442, -75.5812</div>
           <div style="font-size:0.78rem;color:#ccc;">${(current.direccion || '').replace(/\n/g, ' ')}</div>
           <div style="font-size:0.72rem;color:#888;margin-top:6px;">Nodo: ${current.nodo} · Cuadrante UME Medellín</div>
           <div style="margin-top:10px;padding:12px;background:#1a2332;border-radius:4px;color:#7ee787;font-size:0.78rem;">
             📍 Ubicación en predio verificada por GPS
           </div>
         </div>`,
        null,
        'Cerrar',
        ''
      );
      break;

    case 'verificacion':
      openModal(
        'Verificación de Cliente',
        `<div style="font-size:0.82rem;">
           <div style="margin-bottom:8px;"><strong>Titular:</strong> ${current.cliente}</div>
           <div style="margin-bottom:8px;"><strong>Documento:</strong> CC ${current.cuenta}</div>
           <div style="margin-bottom:8px;"><strong>Teléfono de contacto:</strong> 312 456 7890</div>
           <div style="margin-bottom:8px;"><strong>Dirección en contrato:</strong> ${(current.direccion || '').replace(/\n/g, ' ')}</div>
           <div style="padding:8px;background:#1b2f21;border:1px solid #2e7d32;border-radius:4px;color:#a5d6a7;">
             ✓ Identidad validada satisfactoriamente
           </div>
         </div>`,
        null,
        'Cerrar',
        ''
      );
      break;
  }
};
</script>

<style scoped>
.item-target-highlight {
  background: rgba(198, 40, 40, 0.25) !important;
  border-left: 3px solid #ef5350 !important;
  color: #ffcdd2 !important;
  font-weight: 700 !important;
}
</style>
