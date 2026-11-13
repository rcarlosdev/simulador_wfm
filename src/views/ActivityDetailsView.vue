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
        <div class="chat-badge-container btn-open-chat" title="Chat" @click="showScreen('/chat')">
          <button type="button" class="app-bar-btn" style="padding:2px 4px;">
            <svg viewBox="0 0 24 24" style="width:22px;height:22px;"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            <span class="chat-badge">2</span>
          </button>
          <span class="chat-timer-label">{{ state.chatTimerStr }}</span>
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

        <button type="button" class="btn-dots-menu" title="Opciones (...)" @click.stop="toggleContextMenu">
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
          <div v-if="act.estado === 'pendiente'" class="context-menu-item" @click="handleAction('iniciar_almacen')">Iniciar</div>
          <template v-else-if="act.estado === 'comenzado'">
            <div class="context-menu-item" @click="handleAction('completar')">Completar</div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div class="context-menu-item" style="color:#ffd54f;font-weight:700;" @click="handleAction('check_inicio')">Check Inicio Operación</div>
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
            <div class="context-menu-item" style="color:#00e5ff;font-weight:700;" @click="handleAction('iniciar_ruta')">🚗 Iniciar ruta (Desplazamiento)</div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
          </template>
          <template v-else-if="act.estado === 'en-ruta' || act.estado === 'en_ruta'">
            <div class="context-menu-item" style="color:#76ff03;font-weight:700;" @click="handleAction('iniciar_predio')">🟢 Iniciar actividad (Llegada al predio)</div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
          </template>
          <template v-else-if="act.estado === 'comenzado'">
            <div class="context-menu-item" @click="handleAction('completar')">Completar actividad</div>
            <div class="context-menu-item" @click="handleAction('acciones')">Acciones</div>
            <div class="context-menu-item" style="color:#4fc3f7;font-weight:700;" @click="handleAction('activacion_auto')">Activacion Servicios</div>
            <div class="context-menu-item" @click="handleAction('ajustar_tiempo')">Ajustar tiempo</div>
            <div class="context-menu-item" style="color:#81c784;font-weight:700;" @click="handleAction('cobertura_wifi')">Cobertura Wifi</div>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('inventario')">Inventario</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
            <div class="context-menu-item" @click="handleAction('verificacion')">Verificacion Cliente</div>
          </template>
          <template v-else>
            <div class="context-menu-item" @click="handleAction('historial')">Historial Acciones</div>
            <div class="context-menu-item" @click="handleAction('inventario')">Inventario</div>
            <div class="context-menu-item" @click="handleAction('mapa')">Mapa</div>
            <div class="context-menu-item" @click="handleAction('verificacion')">Verificacion Cliente</div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSimulator, formatDuration } from '../composables/useSimulator';

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
  completarActividad
} = useSimulator();

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
    `<strong>Cliente:</strong> ${act.value?.cliente || 'DANIELA CRUZ'}<br>
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
    case 'iniciar_almacen':
      iniciarActividadPredio(current);
      break;

    case 'completar':
      completarActividad(current);
      break;

    case 'check_inicio':
      showScreen('/check-inicio');
      break;

    case 'activacion_auto':
      showScreen('/activacion-auto');
      break;

    case 'cobertura_wifi':
      showScreen('/cobertura-wifi');
      break;

    case 'inventario':
      showScreen('/inventario');
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

    case 'mapa':
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
