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
        <!-- Botón Mensajes / Iniciar Nueva Conversación (Páginas 2, 4, 5 del PDF) -->
        <button
          type="button"
          class="btn-nuevo-mensaje-header"
          :class="{
            'btn-tutorial-highlight': planillaNotasState.currentStep === 4 && planillaNotasState.subView === 'chat_delta_general'
          }"
          title="Iniciar nueva conversación"
          aria-label="Iniciar nueva conversación"
          @click="handleBotonMensajes"
        >
          <!-- SVG Lineal Idéntico al PDF: Bocadillo rectangular con líneas internas y signo (+) -->
          <svg viewBox="0 0 24 24" class="svg-chat-plus" fill="none" stroke="currentColor">
            <path d="M4 4h13a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5.5l-3.5 3.5V13H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="6" y1="7.5" x2="13.5" y2="7.5" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="6" y1="10" x2="12" y2="10" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="19.5" y1="15" x2="19.5" y2="21" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="16.5" y1="18" x2="22.5" y2="18" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          <span class="btn-nuevo-label">Nueva conversación</span>
        </button>

        <!-- Botón Cerrar (✕) para regresar a los detalles de la orden -->
        <button
          type="button"
          class="btn-colab-close"
          title="Cerrar Colaboración"
          aria-label="Cerrar Colaboración"
          @click="cerrarColaboracion"
        >
          <svg viewBox="0 0 24 24" class="svg-close-icon">
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
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
          <div class="chat-item-avatar-line">
            <svg viewBox="0 0 24 24" class="svg-group-line">
              <circle cx="8.5" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 18.5v-0.8a5.5 5.5 0 0 1 11 0v0.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M14.5 6a3 3 0 0 1 0 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M15.5 14.5a5.5 5.5 0 0 1 5 3.5v0.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
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
            <svg viewBox="0 0 24 24" class="svg-group-line">
              <circle cx="8.5" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 18.5v-0.8a5.5 5.5 0 0 1 11 0v0.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M14.5 6a3 3 0 0 1 0 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M15.5 14.5a5.5 5.5 0 0 1 5 3.5v0.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
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
            <svg viewBox="0 0 24 24" class="svg-group-line">
              <circle cx="8.5" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 18.5v-0.8a5.5 5.5 0 0 1 11 0v0.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M14.5 6a3 3 0 0 1 0 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M15.5 14.5a5.5 5.5 0 0 1 5 3.5v0.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
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
            <svg viewBox="0 0 24 24" class="svg-group-line">
              <circle cx="8.5" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 18.5v-0.8a5.5 5.5 0 0 1 11 0v0.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M14.5 6a3 3 0 0 1 0 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M15.5 14.5a5.5 5.5 0 0 1 5 3.5v0.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
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
            <svg viewBox="0 0 24 24" class="svg-tab-icon"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            <span class="tab-badge">3</span>
          </div>
          <span>Chats</span>
        </div>

        <div class="colab-tab-item" @click="showToast('Historial de chats')">
          <svg viewBox="0 0 24 24" class="svg-tab-icon"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
          <span>Historia</span>
        </div>

        <div class="colab-tab-item" @click="showToast('Notificaciones')">
          <div style="position:relative;display:inline-block;">
            <svg viewBox="0 0 24 24" class="svg-tab-icon"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
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
      <!-- Subheader del Chat (Idéntico a la Pág. 4 y 5 del PDF) -->
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'lista'" title="Volver">
          <svg viewBox="0 0 24 24" class="svg-back-chevron">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Ícono lineal de grupo (dos siluetas finas, sin fondo tosco) -->
        <div class="chat-header-avatar-line">
          <svg viewBox="0 0 24 24" class="svg-group-line">
            <circle cx="8.5" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <path d="M3 18.5v-0.8a5.5 5.5 0 0 1 11 0v0.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M14.5 6a3 3 0 0 1 0 4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M15.5 14.5a5.5 5.5 0 0 1 5 3.5v0.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>

        <div class="chat-header-info">
          <div class="chat-header-name">DELTA ALIADO EZENTIS</div>
        </div>

        <div class="chat-header-actions">
          <!-- Ícono lineal persona con signo + (invitar) idéntico al PDF -->
          <button type="button" class="btn-head-act" title="Invitar persona" @click="showToast('Invitar participante')">
            <svg viewBox="0 0 24 24" class="svg-user-add-line">
              <circle cx="8.5" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 18.5v-0.8a5.5 5.5 0 0 1 11 0v0.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="18.5" y1="8" x2="18.5" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="15.5" y1="11" x2="21.5" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button type="button" class="btn-head-act" title="Opciones" @click="showToast('Opciones del chat')">
            <svg viewBox="0 0 24 24" class="svg-dots-vertical">
              <circle cx="12" cy="5" r="1.6" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.6" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.6" fill="currentColor"/>
            </svg>
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

      <!-- Barra Inferior de Entrada (Página 4) -->
      <div class="chat-bottom-input-bar">
        <input
          type="text"
          class="chat-text-field"
          placeholder="Introducir mensaje"
          disabled
        />
        <button type="button" class="btn-attach-clip" title="Adjuntar">
          <svg viewBox="0 0 24 24" class="svg-clip-icon">
            <path d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ====================================================================
         VISTA 3: INFORMACIÓN DE USUARIO DELTA (Página 6)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'info_usuario'" class="colab-subview-wrapper">
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'chat_delta_general'" title="Volver">
          <svg viewBox="0 0 24 24" class="svg-back-chevron">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="chat-header-name" style="font-size:0.95rem;">Información de usuario</div>
      </div>

      <div class="user-info-body screen-scroll-body">
        <!-- Tarjeta de Perfil de la Delta (Idéntica a la Pág. 6 del PDF) -->
        <div class="user-profile-header-card">
          <div class="user-squircle-avatar">
            <span>{{ planillaNotasState.deltaUser.initials }}</span>
            <span class="user-status-online-dot"></span>
          </div>
          <div class="user-display-name">
            {{ planillaNotasState.deltaUser.nombre }}
          </div>
        </div>

        <!-- Botón Nueva Conversación (Paso 5 - Recuadro Rosado Tutorial Oficial) -->
        <div class="btn-nueva-conv-container">
          <button
            type="button"
            class="btn-nueva-conversacion-ofsc"
            :class="{
              'btn-tutorial-highlight': planillaNotasState.currentStep === 5
            }"
            @click="irAChatPrivado"
          >
            <!-- Bocadillo de conversación lineal -->
            <svg viewBox="0 0 24 24" class="svg-chat-line">
              <path d="M4 4h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6l-4 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              <line x1="6" y1="11" x2="12" y2="11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <span class="conv-btn-text">Nueva conversación</span>
          </button>
        </div>

        <!-- Pestañas y Opciones inferiores (Página 6) -->
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
         VISTA 4: CHAT PRIVADO CON LA DELTA ALISSON (Página 7)
         ==================================================================== -->
    <div v-else-if="planillaNotasState.subView === 'chat_delta_privado'" class="colab-subview-wrapper">
      <!-- Subheader del Chat Privado (Idéntico a la Pág. 7 del PDF) -->
      <div class="chat-view-header">
        <button type="button" class="btn-chat-back" @click="planillaNotasState.subView = 'info_usuario'" title="Volver">
          <svg viewBox="0 0 24 24" class="svg-back-chevron">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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
            <svg viewBox="0 0 24 24" class="svg-user-add-line">
              <circle cx="8.5" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 18.5v-0.8a5.5 5.5 0 0 1 11 0v0.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="18.5" y1="8" x2="18.5" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="15.5" y1="11" x2="21.5" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button type="button" class="btn-head-act" title="Opciones" @click="showToast('Opciones del chat')">
            <svg viewBox="0 0 24 24" class="svg-dots-vertical">
              <circle cx="12" cy="5" r="1.6" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.6" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.6" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Área de Mensajes Privados con la Planilla (Paso 6 - Pág. 7 del PDF) -->
      <div class="chat-messages-scroll screen-scroll-body" ref="privadoBoxRef">
        <!-- Burbujas Rosadas Oficiales (Página 7 del PDF) -->
        <div
          v-for="msg in planillaNotasState.mensajesPrivados"
          :key="msg.id"
          class="chat-bubble-privado"
        >
          <pre class="msg-plantilla-text" style="color:#212121;">{{ msg.text }}</pre>
          <div class="msg-time-status">
            <span>{{ msg.time }}</span>
            <span class="envelope-icon">✉</span>
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
        <button type="button" class="btn-attach-clip" title="Adjuntar">
          <svg viewBox="0 0 24 24" class="svg-clip-icon">
            <path d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
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

/* ====================================================================
   CABECERA SUPERIOR BLANCA (Colaboración)
   ==================================================================== */
.colab-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  min-height: 48px;
}

.colab-main-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
}

.colab-top-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Botón Nuevo Mensaje en la Cabecera (Páginas 4 y 5 del PDF) */
.btn-nuevo-mensaje-header {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  color: #212121;
  transition: all 0.2s ease;
}

.btn-nuevo-mensaje-header:hover {
  background: #f5f5f5;
}

.btn-nuevo-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #212121;
  white-space: nowrap;
}

/* Resaltado del Tutorial Oficial (Página 5 del PDF) */
.btn-tutorial-highlight {
  background: #fce4ec !important;
  border: 1.5px solid #e57373 !important;
  border-radius: 8px !important;
  animation: pulseTutorial 1.6s infinite ease-in-out;
}

.btn-tutorial-highlight .btn-nuevo-label {
  color: #c62828 !important;
  font-weight: 700;
}

.btn-tutorial-highlight .svg-chat-plus {
  color: #c62828 !important;
}

@keyframes pulseTutorial {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(229, 115, 115, 0.4);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 0 6px rgba(229, 115, 115, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(229, 115, 115, 0);
  }
}

.svg-chat-plus {
  width: 20px;
  height: 20px;
  color: #212121;
  flex-shrink: 0;
}

/* Botón Cerrar (✕) */
.btn-colab-close {
  background: none;
  border: none;
  color: #212121;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.svg-close-icon {
  width: 18px;
  height: 18px;
  stroke: #212121;
}

/* ====================================================================
   VISTA 1: LISTA DE CHATS
   ==================================================================== */
.colab-subview-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
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
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
  cursor: pointer;
  transition: background 0.15s ease;
}

.colab-chat-item:hover {
  background: #f9f9f9;
}

.chat-item-avatar-line {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  color: #37474f;
}

.chat-user-squircle {
  width: 36px;
  height: 36px;
  background: #607d8b;
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

/* Barra Inferior de Pestañas (Chats / Historia / Notificaciones) */
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

.svg-tab-icon {
  width: 22px;
  height: 22px;
  fill: #757575;
}

.colab-tab-item.active {
  color: #d32f2f;
  font-weight: 700;
}

.colab-tab-item.active .svg-tab-icon {
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

/* ====================================================================
   SUBHEADER DEL CHAT (Páginas 4, 5, 7)
   ==================================================================== */
.chat-view-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  min-height: 44px;
}

.btn-chat-back {
  background: none;
  border: none;
  color: #424242;
  cursor: pointer;
  padding: 2px 8px 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-back-chevron {
  width: 20px;
  height: 20px;
  stroke: #424242;
}

.chat-header-avatar-line {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #212121;
}

.svg-group-line {
  width: 24px;
  height: 24px;
  color: #212121;
}

.chat-header-info {
  flex: 1;
  min-width: 0;
}

.chat-header-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #212121;
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-head-act {
  background: none;
  border: none;
  color: #212121;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-user-add-line {
  width: 22px;
  height: 22px;
  color: #212121;
}

.svg-dots-vertical {
  width: 20px;
  height: 20px;
  color: #212121;
}

/* Fila de Participantes (Con: ... Mostrar) */
.chat-participants-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 14px;
  background: #fafafa;
  border-bottom: 1px solid #eeeeee;
}

.participants-text {
  font-size: 0.72rem;
  color: #616161;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.link-mostrar {
  font-size: 0.72rem;
  color: #0288d1;
  cursor: pointer;
  font-weight: 500;
}

.link-mostrar:hover {
  text-decoration: underline;
}

/* ====================================================================
   ÁREA DE MENSAJES Y BURBUJAS
   ==================================================================== */
.chat-messages-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px 180px 14px;
  background: #f7f9fa;
}

.chat-date-divider {
  text-align: center;
  font-size: 0.72rem;
  color: #888888;
  margin: 6px 0 12px 0;
}

.chat-bubble-general {
  background: #ffffff;
  border-radius: 6px;
  padding: 12px 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  max-width: 92%;
  margin-bottom: 12px;
  border: 1px solid #ebebeb;
}

.msg-sender-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0288d1;
  margin-bottom: 6px;
}

.msg-plantilla-text {
  font-family: inherit;
  font-size: 0.75rem;
  color: #212121;
  line-height: 1.45;
  white-space: pre-wrap;
  margin: 0;
}

/* ====================================================================
   CHAT PRIVADO (Página 7 del PDF)
   ==================================================================== */
.user-squircle-small {
  width: 28px;
  height: 28px;
  background: #546e7a;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 700;
  color: #ffffff;
  margin-right: 8px;
  position: relative;
  flex-shrink: 0;
}

.user-status-online-dot-small {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 7px;
  height: 7px;
  background: #4caf50;
  border-radius: 50%;
  border: 1px solid #ffffff;
}

.chat-bubble-privado {
  background: #fbebee;
  border: 1px solid #f8bbd0;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.msg-time-status {
  text-align: right;
  font-size: 0.65rem;
  color: #888888;
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.envelope-icon {
  font-size: 0.75rem;
  color: #9e9e9e;
}

/* Barra Inferior de Entrada */
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
  padding: 8px 14px;
  border: 1px solid #cfd8dc;
  border-radius: 20px;
  font-size: 0.8rem;
  outline: none;
  background: #ffffff;
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
  color: #616161;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-clip-icon {
  width: 20px;
  height: 20px;
  stroke: #616161;
}

/* ====================================================================
   VISTA 3: INFORMACIÓN DE USUARIO (Página 6 del PDF)
   ==================================================================== */
.user-info-body {
  flex: 1;
  background: #ffffff;
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
  background: #546e7a;
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
  border: 1.5px solid #ffffff;
}

.user-display-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: #212121;
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
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1a237e;
}

.btn-nueva-conversacion-ofsc:hover {
  background: #f5f5f5;
}

.svg-chat-line {
  width: 22px;
  height: 22px;
  color: #212121;
  flex-shrink: 0;
}

.conv-btn-text {
  font-size: 0.88rem;
  font-weight: 500;
  color: #1a237e;
}

.user-info-options {
  border-top: 1px solid #eeeeee;
  padding: 12px 16px;
}

.option-item-row {
  padding: 8px 0;
  cursor: pointer;
}

.option-title-blue {
  font-size: 0.82rem;
  font-weight: 600;
  color: #0288d1;
}

.option-text-regular {
  font-size: 0.82rem;
  color: #424242;
}

/* ====================================================================
   RESALTADOS Y ANIMACIONES
   ==================================================================== */
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
