<template>
  <div class="simulator-screen screen-activity-list screen-active" id="screen-activity-list">
    <!-- App Bar Roja -->
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

    <!-- Subheader Oscuro -->
    <div class="ofs-sub-header">
      <div class="sub-header-left">
        <span class="sub-header-title">Lista de actividades</span>
      </div>
      <button type="button" class="btn-dots-menu" id="btn-list-menu" title="Opciones" @click="openOptionsMenu">
        <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </button>
    </div>

    <!-- Contenedor scrollable interno de actividades -->
    <div class="activity-list-content screen-scroll-body">

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
            :class="act.tipo === 'almacen' ? 'color-almacen-pendiente' : 'color-pendiente'"
            @click="selectActivity(act)"
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
            @click="selectActivity(act)"
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
            @click="selectActivity(act)"
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
            @click="selectActivity(act)"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSimulator, formatDuration } from '../composables/useSimulator';

const {
  state,
  openDrawer,
  showScreen,
  selectActivity,
  openModal,
  closeModal,
  openColorimetria,
  showToast
} = useSimulator();

const collapsed = ref({
  pendiente: false,
  enRuta: false,
  comenzado: false,
  cerrado: false
});

const toggleAccordion = (key) => {
  collapsed.value[key] = !collapsed.value[key];
};

const formatTitle = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
};

const actividades = computed(() => {
  return state.currentUser?.actividades || [];
});

const pendientes = computed(() => actividades.value.filter(a => a.estado === 'pendiente'));
const enRuta = computed(() => actividades.value.filter(a => a.estado === 'en-ruta' || a.estado === 'en_ruta'));
const comenzados = computed(() => actividades.value.filter(a => a.estado === 'comenzado'));
const cerrados = computed(() => actividades.value.filter(a => a.estado === 'cerrado'));

const openOptionsMenu = () => {
  openModal(
    'Opciones de Lista (OFSC)',
    `<div style="display:flex;flex-direction:column;gap:8px;padding-top:4px;">
       <button type="button" class="detail-btn-action" id="vue-opt-inventario" style="margin:0;">
         Inventario (Bodega Virtual - Pág. 8)
       </button>
       <button type="button" class="detail-btn-action" id="vue-opt-colorimetria" style="margin:0;">
         Colorimetría OFSC (11 Estados)
       </button>
     </div>`,
    null,
    'Cerrar',
    ''
  );

  setTimeout(() => {
    const optInv = document.getElementById('vue-opt-inventario');
    const optCol = document.getElementById('vue-opt-colorimetria');
    if (optInv) {
      optInv.onclick = () => {
        closeModal();
        showScreen('/inventario');
      };
    }
    if (optCol) {
      optCol.onclick = () => {
        closeModal();
        openColorimetria();
      };
    }
  }, 50);
};
</script>
