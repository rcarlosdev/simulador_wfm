<template>
  <div class="simulator-screen screen-colaboracion screen-active" id="screen-colaboracion">

    <!-- ====================================================================
         CABECERA GENERAL OFSC DE COLABORACIÓN (Barra Oscura con Iconos)
         ==================================================================== -->
    <div class="colab-top-bar">
      <div class="colab-top-left">
        <span class="colab-main-title">Colaboración</span>
      </div>
      <div class="colab-top-right">
        <!-- En vista de lista: Botón 'Nueva conversación' con IconMessagePlus y texto (Imagen 2) -->
        <button
          v-if="planillaNotasState.subView === 'lista'"
          type="button"
          class="btn-nuevo-mensaje-header"
          title="Iniciar nueva conversación"
          aria-label="Iniciar nueva conversación"
          @click="handleBotonMensajes"
        >
          <IconMessagePlus :size="20" :stroke="1.8" class="svg-chat-plus" />
          <span class="btn-nuevo-label">Nueva conversación</span>
        </button>

        <!-- En vistas de conversación: Botón de mensajes sin texto (IconMessageDots) (Imágenes 1 y 4) -->
        <button
          v-else
          type="button"
          class="btn-icon-mensaje-header"
          :class="{
            'btn-tutorial-highlight': planillaNotasState.iniciado && planillaNotasState.currentStep === 4 && planillaNotasState.subView === 'chat_delta_general'
          }"
          title="Mensajería"
          aria-label="Mensajería"
          @click="handleBotonMensajes"
        >
          <IconMessageDots :size="20" :stroke="1.8" class="svg-chat-dots" />
        </button>

        <!-- Botón Cerrar (✕) con Tabler Icon: IconX -->
        <button
          type="button"
          class="btn-colab-close"
          title="Cerrar Colaboración"
          aria-label="Cerrar Colaboración"
          @click="cerrarColaboracion"
        >
          <IconX :size="20" :stroke="2" class="svg-close-icon" />
        </button>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 1: LISTADO DE CHATS DE COLABORACIÓN (Páginas 2 y 3 - Dark Theme)
         ==================================================================== -->
    <div v-if="planillaNotasState.subView === 'lista'" class="colab-subview-wrapper">
      <div class="colab-list-body screen-scroll-body">
        <!-- Item 1: DELTA ALIADO EZENTIS (Paso 3) -->
        <div
          class="colab-chat-item"
          :class="{ 'item-target-highlight': planillaNotasState.iniciado && planillaNotasState.currentStep === 3 }"
          @click="seleccionarChatDelta"
        >
          <div class="chat-item-avatar-line">
            <IconUsers :size="26" :stroke="1.8" class="svg-group-line" />
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
          <div class="chat-item-avatar-line">
            <IconUsers :size="26" :stroke="1.8" class="svg-group-line" />
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
          <div class="chat-item-avatar-line">
            <IconUsers :size="26" :stroke="1.8" class="svg-group-line" />
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
          <div class="chat-user-squircle">
            <span class="squircle-initials">EL</span>
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
          <div class="chat-item-avatar-line">
            <IconUsers :size="26" :stroke="1.8" class="svg-group-line" />
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

      <!-- Barra Inferior de Pestañas (Chats / Historia / Notificaciones con Tabler Icons) -->
      <div class="colab-tab-bar">
        <div
          class="colab-tab-item"
          :class="{ active: planillaNotasState.activeTab === 'chats' }"
          @click="planillaNotasState.activeTab = 'chats'"
        >
          <div style="position:relative;display:inline-block;">
            <IconMessages :size="22" :stroke="1.8" class="svg-tab-icon" />
            <span class="tab-badge">3</span>
          </div>
          <span>Chats</span>
        </div>

        <div class="colab-tab-item" @click="showToast('Historial de chats')">
          <IconHistory :size="22" :stroke="1.8" class="svg-tab-icon" />
          <span>Historia</span>
        </div>

        <div class="colab-tab-item" @click="showToast('Notificaciones')">
          <div style="position:relative;display:inline-block;">
            <IconBell :size="22" :stroke="1.8" class="svg-tab-icon" />
            <span class="tab-badge">3</span>
          </div>
          <span>Notificaciones</span>
        </div>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 2: CHAT GENERAL DELTA ALIADO EZENTIS (Páginas 4 y 5 - Dark Theme)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'chat_delta_general'" class="colab-subview-wrapper">
      <!-- Subheader del Chat (Dark Theme con Tabler Icons) -->
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'lista'" title="Volver">
          <IconChevronLeft :size="22" :stroke="2.2" class="svg-back-chevron" />
        </button>

        <!-- Ícono lineal de grupo (Tabler Icon: IconUsers) -->
        <div class="chat-header-avatar-line">
          <IconUsers :size="24" :stroke="1.8" class="svg-group-line" />
        </div>

        <div class="chat-header-info">
          <div class="chat-header-name">DELTA ALIADO EZENTIS</div>
        </div>

        <div class="chat-header-actions">
          <!-- Ícono lineal persona con signo + (Tabler Icon: IconUserPlus) -->
          <button type="button" class="btn-head-act" title="Invitar persona" @click="showToast('Invitar participante')">
            <IconUserPlus :size="22" :stroke="1.8" class="svg-user-add-line" />
          </button>
          <!-- Ícono opciones 3 puntos (Tabler Icon: IconDotsVertical) -->
          <button type="button" class="btn-head-act" title="Opciones" @click="showToast('Opciones del chat')">
            <IconDotsVertical :size="20" :stroke="1.8" class="svg-dots-vertical" />
          </button>
        </div>
      </div>

      <!-- Fila de participantes: Con: ... Mostrar -->
      <div class="chat-participants-row">
        <span class="participants-text">Con: EZENTIS_ARIAS DELGADO DUVAN AL...</span>
        <span class="link-mostrar" @click="showToast('Participantes de la conversación')">Mostrar</span>
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

      <!-- Barra Inferior de Entrada (Página 4 - Dark Theme) -->
      <div class="chat-bottom-input-bar">
        <input
          type="text"
          class="chat-text-field"
          placeholder="Introducir mensaje"
          disabled
        />
        <button type="button" class="btn-attach-clip" title="Adjuntar">
          <IconPaperclip :size="20" :stroke="1.8" class="svg-clip-icon" />
        </button>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 3: INFORMACIÓN DE USUARIO DELTA (Página 6 - Dark Theme)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'info_usuario'" class="colab-subview-wrapper">
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'chat_delta_general'" title="Volver">
          <IconChevronLeft :size="22" :stroke="2.2" class="svg-back-chevron" />
        </button>
        <div class="chat-header-name" style="font-size:0.95rem;">Información de usuario</div>
      </div>

      <div class="user-info-body screen-scroll-body">
        <!-- Tarjeta de Perfil de la Delta -->
        <div class="user-profile-header-card">
          <div class="user-squircle-avatar">
            <span>{{ planillaNotasState.deltaUser.initials }}</span>
            <span class="user-status-online-dot"></span>
          </div>
          <div class="user-display-name">
            {{ planillaNotasState.deltaUser.nombre }}
          </div>
        </div>

        <!-- Botón Nueva Conversación (Paso 5 - Tabler Icon: IconMessage) -->
        <div class="btn-nueva-conv-container">
          <button
            type="button"
            class="btn-nueva-conversacion-ofsc"
            :class="{
              'btn-tutorial-highlight': planillaNotasState.iniciado && planillaNotasState.currentStep === 5
            }"
            @click="irAChatPrivado"
          >
            <IconMessage :size="22" :stroke="1.8" class="svg-chat-line" />
            <span class="conv-btn-text">Nueva conversación</span>
          </button>
        </div>

        <!-- Pestañas y Opciones inferiores (Página 6 - Dark Theme) -->
        <div class="user-info-options">
          <div class="option-item-row" @click="showToast('Historial con el usuario')">
            <span class="option-title-blue">Historia</span>
          </div>
          <div class="option-item-row" @click="showToast('Opción de libreta de direcciones')">
            <span class="option-text-regular">Agregar a libro de dirección</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 4: CHAT PRIVADO CON LA DELTA ALISSON (Página 7 - Dark Theme)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'chat_delta_privado'" class="colab-subview-wrapper">
      <!-- Subheader del Chat Privado (Dark Theme con Tabler Icons) -->
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'info_usuario'" title="Volver">
          <IconChevronLeft :size="22" :stroke="2.2" class="svg-back-chevron" />
        </button>
        <div class="user-squircle-small">
          <span>{{ planillaNotasState.deltaUser.initials }}</span>
          <span class="user-status-online-dot-small"></span>
        </div>
        <div class="chat-header-info">
          <div class="chat-header-name">{{ planillaNotasState.deltaUser.nombre }}</div>
        </div>
        <div class="chat-header-actions">
          <button type="button" class="btn-head-act" title="Invitar persona" @click="showToast('Invitar participante')">
            <IconUserPlus :size="22" :stroke="1.8" class="svg-user-add-line" />
          </button>
          <button type="button" class="btn-head-act" title="Opciones" @click="showToast('Opciones del chat')">
            <IconDotsVertical :size="20" :stroke="1.8" class="svg-dots-vertical" />
          </button>
        </div>
      </div>

      <!-- Área de Mensajes Privados con la Planilla (Paso 6 - Dark Theme) -->
      <div class="chat-messages-scroll screen-scroll-body" ref="privadoBoxRef">
        <!-- Burbujas Oscuras con Borde Suave Oficial -->
        <div
          v-for="msg in planillaNotasState.mensajesPrivados"
          :key="msg.id"
          class="chat-bubble-privado"
        >
          <pre class="msg-plantilla-text">{{ msg.text }}</pre>
          <div class="msg-time-status">
            <span>{{ msg.time }}</span>
            <span class="envelope-icon">✉</span>
          </div>
        </div>
      </div>

      <!-- Barra de Entrada Interactiva con Botón Enviar (Dark Theme) -->
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
          <IconSend :size="16" :stroke="2" />
        </button>
        <button type="button" class="btn-attach-clip" title="Adjuntar">
          <IconPaperclip :size="20" :stroke="1.8" class="svg-clip-icon" />
        </button>
      </div>
    </div>

    <!-- ====================================================================
         PISTAS FLOTANTES OFICIALES (FlowHintBox)
         ==================================================================== -->
    <template v-if="planillaNotasState.iniciado">
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
        Luego presiona el botón <strong>Nueva conversación</strong> (<strong>[💬+]</strong>) ubicado en la esquina superior derecha.
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
    </template>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import { usePlanillaNotasFlow } from '../flows/planilla_notas/usePlanillaNotasFlow';
import FlowHintBox from '../components/FlowHintBox.vue';

// Tabler Icons oficiales (@tabler/icons-vue)
import {
  IconMessagePlus,
  IconMessageDots,
  IconX,
  IconUsers,
  IconChevronLeft,
  IconUserPlus,
  IconDotsVertical,
  IconPaperclip,
  IconMessage,
  IconMessages,
  IconHistory,
  IconBell,
  IconSend
} from '@tabler/icons-vue';

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
  background: var(--ofs-bg-darker, #141414);
  color: var(--ofs-text-white, #ffffff);
}

/* ====================================================================
   CABECERA SUPERIOR OSCURA (Colaboración)
   ==================================================================== */
.colab-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #202020;
  border-bottom: 1px solid #333333;
  min-height: 48px;
}

.colab-main-title {
  font-size: 1.12rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.2px;
}

.colab-top-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Botón Nuevo Mensaje en la Cabecera (Páginas 4 y 5 del PDF - Dark Theme) */
.btn-nuevo-mensaje-header {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  color: #e0e0e0;
  transition: all 0.2s ease;
}

.btn-nuevo-mensaje-header:hover {
  background: #2a2a2a;
  color: #ffffff;
}

.btn-nuevo-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #e0e0e0;
  white-space: nowrap;
}

/* Botón Icono Mensaje en la Cabecera dentro de un Chat (Imágenes 1 y 4 - Dark Theme) */
.btn-icon-mensaje-header {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 6px;
  cursor: pointer;
  color: #b0b0b0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon-mensaje-header:hover {
  background: #2a2a2a;
  color: #ffffff;
}

.svg-chat-dots {
  color: currentColor;
  flex-shrink: 0;
}

/* Resaltado del Tutorial Oficial (Página 5 del PDF - Dark Theme) */
.btn-tutorial-highlight {
  background: rgba(229, 57, 53, 0.25) !important;
  border: 1.5px solid #ef5350 !important;
  border-radius: 8px !important;
  animation: pulseTutorial 1.6s infinite ease-in-out;
}

.btn-tutorial-highlight .btn-nuevo-label {
  color: #ff8a80 !important;
  font-weight: 700;
}

.btn-tutorial-highlight .svg-chat-plus,
.btn-tutorial-highlight .svg-chat-dots {
  color: #ff8a80 !important;
}

@keyframes pulseTutorial {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 83, 80, 0.45);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 0 6px rgba(239, 83, 80, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 83, 80, 0);
  }
}

.svg-chat-plus {
  color: currentColor;
  flex-shrink: 0;
}

/* Botón Cerrar (✕) */
.btn-colab-close {
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.btn-colab-close:hover {
  color: #ffffff;
}

.svg-close-icon {
  color: currentColor;
}

/* ====================================================================
   VISTA 1: LISTA DE CHATS (Dark Theme)
   ==================================================================== */
.colab-subview-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: #181818;
}

.colab-list-body {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 180px;
}

.colab-chat-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  background: #222222;
  border-bottom: 1px solid #2d2d2d;
  cursor: pointer;
  transition: background 0.15s ease;
}

.colab-chat-item:hover {
  background: #2b2b2b;
}

.chat-item-avatar-line {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  color: #cfd8dc;
}

.chat-user-squircle {
  width: 36px;
  height: 36px;
  background: #455a64;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
}

.squircle-initials {
  color: #ffffff;
  font-weight: 700;
  font-size: 0.75rem;
}

.online-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
  border: 1.5px solid #222222;
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
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-time {
  font-size: 0.68rem;
  color: #ef5350;
  margin-left: 6px;
}

.chat-item-sub {
  font-size: 0.72rem;
  color: #9e9e9e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-snippet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.72rem;
  color: #757575;
  margin-top: 2px;
}

.chat-unread-badge {
  background: #c61d15;
  color: #ffffff;
  font-size: 0.66rem;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 6px;
}

/* Barra Inferior de Pestañas (Chats / Historia / Notificaciones - Dark Theme) */
.colab-tab-bar {
  display: flex;
  justify-content: space-around;
  background: #202020;
  border-top: 1px solid #333333;
  padding: 6px 0;
}

.colab-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.68rem;
  color: #888888;
  cursor: pointer;
  padding: 4px 14px;
  transition: color 0.15s ease;
}

.svg-tab-icon {
  color: currentColor;
}

.colab-tab-item:hover {
  color: #cfd8dc;
}

.colab-tab-item.active {
  color: #ef5350;
  font-weight: 700;
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  background: #c61d15;
  color: #ffffff;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0 4px;
}

/* ====================================================================
   SUBHEADER DEL CHAT (Páginas 4, 5, 7 - Dark Theme)
   ==================================================================== */
.chat-view-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #202020;
  border-bottom: 1px solid #333333;
  min-height: 44px;
}

.btn-chat-back {
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 2px 8px 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.btn-chat-back:hover {
  color: #ffffff;
}

.svg-back-chevron {
  color: currentColor;
}

.chat-header-avatar-line {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #cfd8dc;
}

.svg-group-line {
  color: currentColor;
}

.chat-header-info {
  flex: 1;
  min-width: 0;
}

.chat-header-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-head-act {
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.btn-head-act:hover {
  color: #ffffff;
}

.svg-user-add-line {
  color: currentColor;
}

.svg-dots-vertical {
  color: currentColor;
}

/* Fila de Participantes (Con: ... Mostrar - Dark Theme) */
.chat-participants-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 14px;
  background: #1c1c1c;
  border-bottom: 1px solid #2d2d2d;
}

.participants-text {
  font-size: 0.72rem;
  color: #9e9e9e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.link-mostrar {
  font-size: 0.72rem;
  color: #29b6f6;
  cursor: pointer;
  font-weight: 500;
}

.link-mostrar:hover {
  text-decoration: underline;
}

/* ====================================================================
   ÁREA DE MENSAJES Y BURBUJAS (Ajustado al Dark Theme Oficial OFSC)
   ==================================================================== */
.chat-messages-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px 180px 14px;
  background: var(--ofs-bg-darker, #141414);
}

.chat-date-divider {
  text-align: center;
  font-size: 0.72rem;
  color: var(--ofs-text-dim, #757575);
  margin: 6px 0 14px 0;
}

/* Burbujas OFSC Dark Theme (Fondo Neutro Oscuro de Tarjeta, Cero Tonos Rojos) */
.chat-bubble-general,
.chat-bubble-privado {
  background: #252525 !important;
  border-radius: 6px;
  padding: 12px 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  max-width: 92%;
  margin-bottom: 14px;
  border: 1px solid #3c3c3c !important;
  position: relative;
}

/* Colita de bocadillo de chat adaptada al tema oscuro */
.chat-bubble-general::before,
.chat-bubble-privado::before {
  content: '';
  position: absolute;
  top: 10px;
  left: -6px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid #252525 !important;
}

.msg-sender-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #29b6f6;
  margin-bottom: 6px;
}

.msg-plantilla-text {
  font-family: inherit;
  font-size: 0.75rem;
  color: #f0f0f0 !important;
  line-height: 1.45;
  white-space: pre-wrap;
  margin: 0;
}

.chat-bubble-privado .msg-plantilla-text {
  color: #f0f0f0 !important;
}

.msg-time-status {
  text-align: right;
  font-size: 0.65rem;
  color: var(--ofs-text-dim, #888888);
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.envelope-icon {
  font-size: 0.75rem;
  color: var(--ofs-text-dim, #888888);
}

/* Barra Inferior de Entrada (Dark Theme) */
.chat-bottom-input-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #202020;
  border-top: 1px solid #333333;
  gap: 8px;
}

.chat-text-field {
  flex: 1;
  padding: 8px 14px;
  border: 1px solid #3c3c3c;
  background: #2a2a2a;
  color: #ffffff;
  border-radius: 20px;
  font-size: 0.8rem;
  outline: none;
}

.chat-text-field::placeholder {
  color: #757575;
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
  padding: 0;
  transition: background 0.15s ease;
}

.btn-send-privado:hover {
  background: #039be5;
}

.btn-attach-clip {
  background: none;
  border: none;
  color: #9e9e9e;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.btn-attach-clip:hover {
  color: #ffffff;
}

.svg-clip-icon {
  color: currentColor;
}

/* ====================================================================
   VISTA 3: INFORMACIÓN DE USUARIO (Página 6 del PDF - Dark Theme)
   ==================================================================== */
.user-info-body {
  flex: 1;
  background: #181818;
  padding: 24px 0 180px 0;
}

.user-profile-header-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px 20px 16px;
}

.user-squircle-avatar {
  width: 44px;
  height: 44px;
  background: #455a64;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  position: relative;
  flex-shrink: 0;
}

.user-status-online-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  border: 1.5px solid #181818;
}

.user-display-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
}

.btn-nueva-conv-container {
  padding: 0 16px;
  margin-bottom: 24px;
}

.btn-nueva-conversacion-ofsc {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: #242424;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #90caf9;
}

.btn-nueva-conversacion-ofsc:hover {
  background: #2c2c2c;
}

.svg-chat-line {
  color: #90caf9;
  flex-shrink: 0;
}

.conv-btn-text {
  font-size: 0.88rem;
  font-weight: 500;
  color: #90caf9;
}

.user-info-options {
  border-top: 1px solid #2d2d2d;
  padding: 12px 16px;
}

.option-item-row {
  padding: 8px 0;
  cursor: pointer;
}

.option-title-blue {
  font-size: 0.82rem;
  font-weight: 600;
  color: #29b6f6;
}

.option-text-regular {
  font-size: 0.82rem;
  color: #b0b0b0;
}

/* ====================================================================
   RESALTADOS Y ANIMACIONES
   ==================================================================== */
.item-target-highlight {
  border: 2px solid #ef5350 !important;
  background: rgba(229, 57, 53, 0.18) !important;
  animation: pulseHighlight 1.5s infinite;
}

@keyframes pulseHighlight {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style>
