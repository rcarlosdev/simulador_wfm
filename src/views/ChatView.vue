<template>
  <div class="simulator-screen screen-colaboracion screen-active" id="screen-colaboracion">

    <!-- ====================================================================
         CABECERA GENERAL OFSC DE COLABORACIÓN (Barra Blanca con Iconos)
         ==================================================================== -->
    <div class="colab-top-bar">
      <div class="colab-top-left">
        <span class="colab-main-title">Colaboración</span>
      </div>
      <div class="colab-top-right">
        <!-- Botón Mensajes / Nueva Conversación (Páginas 2, 4, 5) -->
        <button
          type="button"
          class="btn-colab-icon"
          :class="{ 'target-highlight': planillaNotasState.currentStep === 4 && planillaNotasState.subView === 'chat_delta_general' }"
          title="Nuevo Mensaje"
          @click="handleBotonMensajes"
        >
          <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2zM21 6h-2v2h2V6zm0-4h-2v2h2V2z"/></svg>
        </button>

        <!-- Botón Cerrar (✕) para regresar a los detalles de la orden -->
        <button
          type="button"
          class="btn-colab-icon"
          title="Cerrar Colaboración"
          @click="cerrarColaboracion"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 1: LISTADO DE CHATS DE COLABORACIÓN (Páginas 2 y 3)
         ==================================================================== -->
    <div v-if="planillaNotasState.subView === 'lista'" class="colab-subview-wrapper">
      <div class="colab-list-body screen-scroll-body">
        <!-- Item 1: DELTA ALIADO EZENTIS (Paso 3) -->
        <div
          class="colab-chat-item"
          :class="{ 'item-target-highlight': planillaNotasState.currentStep === 3 }"
          @click="seleccionarChatDelta"
        >
          <div class="chat-item-avatar">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <div class="chat-item-content">
            <div class="chat-item-header">
              <span class="chat-item-name">DELTA ALIADO EZENTIS</span>
              <span class="chat-item-time">06:31 AM</span>
            </div>
            <div class="chat-item-sub">Con: EZENTIS_ARIAS DELGADO DUVAN AL...</div>
            <div class="chat-item-snippet">
              <span>No se encontraron mensajes</span>
              <span class="chat-unread-badge">1</span>
            </div>
          </div>
        </div>

        <!-- Item 2: Conferencia -->
        <div class="colab-chat-item" @click="showToast('Selecciona el chat Delta aliado')">
          <div class="chat-item-avatar">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <div class="chat-item-content">
            <div class="chat-item-header">
              <span class="chat-item-name">Conferencia</span>
              <span class="chat-item-time">05:51 PM</span>
            </div>
            <div class="chat-item-sub">Con: EZENTIS_ARIAS DELGADO DUVAN ALE...</div>
            <div class="chat-item-snippet">
              <span>EZENTIS_MONTEALEGRE LEAL IVAN MAUR...</span>
              <span class="chat-unread-badge">5</span>
            </div>
          </div>
        </div>

        <!-- Item 3: ALIADO EZENTIS DELTA -->
        <div class="colab-chat-item" @click="showToast('Selecciona el chat Delta aliado')">
          <div class="chat-item-avatar">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <div class="chat-item-content">
            <div class="chat-item-header">
              <span class="chat-item-name">ALIADO EZENTIS DELTA</span>
              <span class="chat-item-time">04:17 PM</span>
            </div>
            <div class="chat-item-sub">Con: EZENTIS_ARIAS DELGADO DUVAN AL...</div>
            <div class="chat-item-snippet">
              <span>No se encontraron mensajes</span>
              <span class="chat-unread-badge">3</span>
            </div>
          </div>
        </div>

        <!-- Item 4: EZENTIS_LOPEZ DUARTE LUIS HERIBERTO -->
        <div class="colab-chat-item">
          <div class="chat-item-avatar avatar-user">
            <span class="avatar-tag-text">EL</span>
            <span class="online-dot"></span>
          </div>
          <div class="chat-item-content">
            <div class="chat-item-header">
              <span class="chat-item-name">EZENTIS_LOPEZ DUARTE LUIS HERIBERTO</span>
              <span class="chat-item-time">Ayer</span>
            </div>
            <div class="chat-item-snippet">
              <span>sus confirmo la visita</span>
            </div>
          </div>
        </div>

        <!-- Item 5: Conferencia -->
        <div class="colab-chat-item">
          <div class="chat-item-avatar">
            <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <div class="chat-item-content">
            <div class="chat-item-header">
              <span class="chat-item-name">Conferencia</span>
              <span class="chat-item-time">Ayer</span>
            </div>
            <div class="chat-item-sub">Con: EZENTIS_DIAZ REYES ALISSON NATALLY ...</div>
          </div>
        </div>
      </div>

      <!-- Barra Inferior de Pestañas (Chats / Historia / Notificaciones) -->
      <div class="colab-tab-bar">
        <div
          class="colab-tab-item active"
          @click="planillaNotasState.activeTab = 'chats'"
        >
          <div style="position:relative;display:inline-block;">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            <span class="tab-badge">3</span>
          </div>
          <span>Chats</span>
        </div>

        <div class="colab-tab-item" @click="showToast('Historial de chats')">
          <svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
          <span>Historia</span>
        </div>

        <div class="colab-tab-item" @click="showToast('Notificaciones')">
          <div style="position:relative;display:inline-block;">
            <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
            <span class="tab-badge">3</span>
          </div>
          <span>Notificaciones</span>
        </div>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 2: CHAT GENERAL DELTA ALIADO EZENTIS (Páginas 4 y 5)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'chat_delta_general'" class="colab-subview-wrapper">
      <!-- Subheader del Chat -->
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'lista'">
          ‹
        </button>
        <div class="chat-header-avatar">
          <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        </div>
        <div class="chat-header-info">
          <div class="chat-header-name">DELTA ALIADO EZENTIS</div>
          <div class="chat-header-sub">Con: EZENTIS_ARIAS DELGADO DUVAN AL... <span style="color:#0288d1;cursor:pointer;">Mostrar</span></div>
        </div>
        <div class="chat-header-actions">
          <button type="button" class="btn-head-act" title="Invitar">👤+</button>
          <button type="button" class="btn-head-act" title="Opciones">⋮</button>
        </div>
      </div>

      <!-- Área de Mensajes del Chat General -->
      <div class="chat-messages-scroll screen-scroll-body">
        <div class="chat-date-divider">Hoy</div>

        <!-- Mensaje de la Delta con las Plantillas Oficiales -->
        <div class="chat-bubble-general">
          <div class="msg-sender-name">EZENTIS_DIAZ REYES ALISSON N...</div>
          <pre class="msg-plantilla-text">{{ planillaNotasState.plantillaReferenciaTexto }}</pre>
        </div>
      </div>

      <!-- Barra Inferior de Entrada (Página 4) -->
      <div class="chat-bottom-input-bar">
        <input
          type="text"
          class="chat-text-field"
          placeholder="Introducir mensaje"
          disabled
        />
        <button type="button" class="btn-attach-clip" title="Adjuntar">📎</button>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 3: INFORMACIÓN DE USUARIO DELTA (Página 6)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'info_usuario'" class="colab-subview-wrapper">
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'chat_delta_general'">
          ‹
        </button>
        <div class="chat-header-name" style="font-size:0.95rem;">Información de usuario</div>
      </div>

      <div class="user-info-body screen-scroll-body">
        <!-- Tarjeta de Perfil de la Delta -->
        <div class="user-profile-header">
          <div class="user-avatar-large">
            <span>{{ planillaNotasState.deltaUser.initials }}</span>
            <span class="user-status-online"></span>
          </div>
          <div class="user-display-name">
            {{ planillaNotasState.deltaUser.nombre }}
          </div>
        </div>

        <!-- Botón Nueva Conversación (Paso 5) -->
        <div style="margin-top:20px;padding:0 12px;">
          <button
            type="button"
            class="btn-nueva-conversacion"
            :class="{ 'item-target-highlight': planillaNotasState.currentStep === 5 }"
            @click="irAChatPrivado"
          >
            <span class="conv-icon">💬</span>
            <span>Nueva conversación</span>
          </button>
        </div>

        <div style="margin-top:24px;padding:0 16px;color:#888;font-size:0.75rem;">
          Historia
        </div>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 4: CHAT PRIVADO CON LA DELTA ALISSON (Página 7)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'chat_delta_privado'" class="colab-subview-wrapper">
      <!-- Subheader del Chat Privado -->
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'info_usuario'">
          ‹
        </button>
        <div class="user-avatar-small">
          <span>{{ planillaNotasState.deltaUser.initials }}</span>
          <span class="user-status-online-small"></span>
        </div>
        <div class="chat-header-info">
          <div class="chat-header-name">{{ planillaNotasState.deltaUser.nombre }}</div>
        </div>
        <div class="chat-header-actions">
          <button type="button" class="btn-head-act" title="Invitar">👤+</button>
          <button type="button" class="btn-head-act" title="Opciones">⋮</button>
        </div>
      </div>

      <!-- Área de Mensajes Privados con la Planilla (Paso 6) -->
      <div class="chat-messages-scroll screen-scroll-body" ref="privadoBoxRef">
        <!-- Burbujas Rosadas Oficiales (Página 7 del PDF) -->
        <div
          v-for="msg in planillaNotasState.mensajesPrivados"
          :key="msg.id"
          class="chat-bubble-privado"
        >
          <pre class="msg-plantilla-text" style="color:#222;">{{ msg.text }}</pre>
          <div class="msg-time-status">
            <span>{{ msg.time }}</span>
            <span style="font-size:0.75rem;margin-left:3px;">✉</span>
          </div>
        </div>
      </div>

      <!-- Barra de Entrada Interactiva con Botón Enviar -->
      <div class="chat-bottom-input-bar">
        <input
          type="text"
          class="chat-text-field"
          v-model="mensajeInput"
          placeholder="Introducir mensaje"
          @keyup.enter="handleEnviarMensaje"
        />
        <button
          type="button"
          class="btn-send-privado"
          title="Enviar Mensaje"
          @click="handleEnviarMensaje"
        >
          ➤
        </button>
        <button type="button" class="btn-attach-clip" title="Adjuntar">📎</button>
      </div>
    </div>

    <!-- ====================================================================
         PISTAS FLOTANTES OFICIALES (FlowHintBox)
         ==================================================================== -->
    <!-- Paso 3 (PLANILLA DE NOTAS.pdf Pág 3) -->
    <FlowHintBox
      v-if="planillaNotasState.currentStep === 3 && planillaNotasState.subView === 'lista'"
      step="3"
      title="Paso 3 - Selección de Chat"
    >
      Selecciona uno de los chats. En este caso, <strong>Delta aliado</strong>.
    </FlowHintBox>

    <!-- Paso 4 (PLANILLA DE NOTAS.pdf Pág 5) -->
    <FlowHintBox
      v-else-if="planillaNotasState.currentStep === 4 && planillaNotasState.subView === 'chat_delta_general'"
      step="4"
      title="Paso 4 - Botón de Mensajes"
    >
      Luego presiona el botón de mensajes (<strong>[💬+]</strong>) ubicado en la esquina superior derecha.
    </FlowHintBox>

    <!-- Paso 5 (PLANILLA DE NOTAS.pdf Pág 6) -->
    <FlowHintBox
      v-else-if="planillaNotasState.currentStep === 5 && planillaNotasState.subView === 'info_usuario'"
      step="5"
      title="Paso 5 - Nueva Conversación"
    >
      A continuación, pulsa la opción <strong>Nueva conversación</strong>.
    </FlowHintBox>

    <!-- Paso 6 (PLANILLA DE NOTAS.pdf Pág 7) -->
    <FlowHintBox
      v-else-if="planillaNotasState.currentStep === 6 && planillaNotasState.subView === 'chat_delta_privado'"
      step="6"
      title="Paso 6 - Registro de Observaciones"
    >
      En este espacio registra las <strong>observaciones</strong> realizadas durante el proceso de instalación y solicita la facturación.
    </FlowHintBox>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import { usePlanillaNotasFlow } from '../flows/planilla_notas/usePlanillaNotasFlow';
import FlowHintBox from '../components/FlowHintBox.vue';

const { showScreen, showToast } = useSimulator();
const {
  planillaNotasState,
  abrirChatDeltaGeneral,
  abrirInfoUsuario,
  iniciarConversacionPrivada,
  enviarMensajePrivado
} = usePlanillaNotasFlow();

const mensajeInput = ref('');
const privadoBoxRef = ref(null);

const cerrarColaboracion = () => {
  showScreen('/activity');
};

const seleccionarChatDelta = () => {
  abrirChatDeltaGeneral();
};

const handleBotonMensajes = () => {
  if (planillaNotasState.subView === 'chat_delta_general') {
    abrirInfoUsuario();
  } else {
    abrirInfoUsuario();
  }
};

const irAChatPrivado = () => {
  iniciarConversacionPrivada();
  nextTick(() => {
    if (privadoBoxRef.value) {
      privadoBoxRef.value.scrollTop = privadoBoxRef.value.scrollHeight;
    }
  });
};

const handleEnviarMensaje = () => {
  if (!mensajeInput.value.trim()) return;
  enviarMensajePrivado(mensajeInput.value.trim());
  mensajeInput.value = '';
  nextTick(() => {
    if (privadoBoxRef.value) {
      privadoBoxRef.value.scrollTop = privadoBoxRef.value.scrollHeight;
    }
  });
};
</script>

<style scoped>
.screen-colaboracion {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #f4f6f8;
}

.colab-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.colab-main-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #212121;
}

.colab-top-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-colab-icon {
  background: none;
  border: none;
  color: #455a64;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-colab-icon svg {
  width: 22px;
  height: 22px;
  fill: #37474f;
}

.colab-subview-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* LISTA DE CHATS */
.colab-list-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 180px;
}

.colab-chat-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  cursor: pointer;
  transition: background 0.15s ease;
}

.colab-chat-item:hover {
  background: #f9f9f9;
}

.chat-item-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.chat-item-avatar svg {
  width: 22px;
  height: 22px;
  fill: #555555;
}

.avatar-user {
  background: #78909c;
  color: #ffffff;
  position: relative;
  font-weight: 700;
  font-size: 0.8rem;
}

.online-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #4caf50;
  border: 1.5px solid #ffffff;
}

.chat-item-content {
  flex: 1;
  min-width: 0;
}

.chat-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}

.chat-item-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #212121;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-time {
  font-size: 0.68rem;
  color: #d32f2f;
  margin-left: 6px;
}

.chat-item-sub {
  font-size: 0.72rem;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-snippet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  color: #9e9e9e;
  margin-top: 2px;
}

.chat-unread-badge {
  background: #d32f2f;
  color: #ffffff;
  font-size: 0.66rem;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 6px;
}

/* BARRA INFERIOR DE PESTAÑAS */
.colab-tab-bar {
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 6px 0;
}

.colab-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.68rem;
  color: #757575;
  cursor: pointer;
  padding: 4px 14px;
}

.colab-tab-item svg {
  width: 22px;
  height: 22px;
  fill: #757575;
}

.colab-tab-item.active {
  color: #d32f2f;
  font-weight: 700;
}

.colab-tab-item.active svg {
  fill: #d32f2f;
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background: #d32f2f;
  color: #ffffff;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0 4px;
}

/* SUBHEADER DE CHAT */
.chat-view-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.btn-chat-back {
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: #555555;
  cursor: pointer;
  padding: 0 8px 0 0;
}

.chat-header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.chat-header-avatar svg {
  width: 20px;
  height: 20px;
  fill: #616161;
}

.chat-header-info {
  flex: 1;
  min-width: 0;
}

.chat-header-name {
  font-size: 0.86rem;
  font-weight: 700;
  color: #212121;
}

.chat-header-sub {
  font-size: 0.7rem;
  color: #757575;
}

.chat-header-actions {
  display: flex;
  gap: 8px;
}

.btn-head-act {
  background: none;
  border: none;
  color: #555555;
  font-size: 1.1rem;
  cursor: pointer;
}

/* ÁREA DE MENSAJES */
.chat-messages-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px 180px 14px;
  background: #f0f2f5;
}

.chat-date-divider {
  text-align: center;
  font-size: 0.72rem;
  color: #757575;
  margin: 8px 0 14px 0;
}

.chat-bubble-general {
  background: #ffffff;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  max-width: 90%;
  margin-bottom: 12px;
}

.msg-sender-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #0288d1;
  margin-bottom: 6px;
}

.msg-plantilla-text {
  font-family: inherit;
  font-size: 0.75rem;
  color: #333333;
  line-height: 1.42;
  white-space: pre-wrap;
  margin: 0;
}

/* CHAT PRIVADO */
.user-avatar-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #546e7a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  margin-right: 8px;
  position: relative;
}

.user-status-online-small {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  border: 1px solid #ffffff;
}

.chat-bubble-privado {
  background: #f8d7da;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  border-left: 3px solid #e57373;
}

.msg-time-status {
  text-align: right;
  font-size: 0.65rem;
  color: #888888;
  margin-top: 6px;
}

/* BARRA INFERIOR DE MENSAJE */
.chat-bottom-input-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
}

.chat-text-field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #cfd8dc;
  border-radius: 20px;
  font-size: 0.8rem;
  outline: none;
}

.btn-send-privado {
  background: #0288d1;
  border: none;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.btn-attach-clip {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #616161;
  cursor: pointer;
}

/* INFORMACIÓN DE USUARIO */
.user-info-body {
  flex: 1;
  background: #ffffff;
  padding: 24px 0 180px 0;
}

.user-profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.user-avatar-large {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #546e7a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  position: relative;
  margin-bottom: 12px;
}

.user-status-online {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background: #4caf50;
  border-radius: 50%;
  border: 2px solid #ffffff;
}

.user-display-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #212121;
  text-align: center;
}

.btn-nueva-conversacion {
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border: 1px solid #d32f2f;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 0.86rem;
  font-weight: 600;
  color: #d32f2f;
  cursor: pointer;
  gap: 12px;
}

.conv-icon {
  font-size: 1.2rem;
}

.item-target-highlight {
  border: 2px solid #d32f2f !important;
  background: #ffebee !important;
  animation: pulseHighlight 1.5s infinite;
}

@keyframes pulseHighlight {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style>
