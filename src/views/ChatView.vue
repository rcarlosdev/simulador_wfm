<template>
  <div class="simulator-screen screen-chat screen-active" id="screen-chat">
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" @click="showScreen('/activities')">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <span class="app-bar-title">DELTA ALIADO EZENTIS</span>
      <button type="button" class="app-bar-btn" title="Insertar Plantilla de Notas" @click="insertarPlantilla">
        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
      </button>
    </div>

    <div class="chat-container">
      <div class="chat-messages-area screen-scroll-body" ref="chatBoxRef">
        <div
          v-for="msg in state.chatMessages"
          :key="msg.id"
          class="chat-bubble"
          :class="msg.sender === 'delta' ? 'msg-delta' : 'msg-technician'"
        >
          <div
            style="font-weight:700;font-size:0.75rem;margin-bottom:2px;"
            :style="{ color: msg.sender === 'delta' ? '#00bcd4' : '#81c784' }"
          >
            {{ msg.author }}
          </div>
          <div v-html="formatMsg(msg.text)"></div>
          <span class="chat-time-tag">{{ msg.time }}</span>
        </div>
      </div>

      <div class="chat-input-bar">
        <input
          type="text"
          class="chat-input-text"
          v-model="inputMsg"
          placeholder="Escribir mensaje al delta..."
          @keyup.enter="handleSend"
        />
        <button type="button" class="btn-send-msg" @click="handleSend">
          <svg style="width:18px;height:18px;fill:#fff;" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import { useSimulator } from '../composables/useSimulator';

const { state, showScreen, sendChatMessage } = useSimulator();

const inputMsg = ref('');
const chatBoxRef = ref(null);

const formatMsg = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
    }
  });
};

watch(() => state.chatMessages.length, () => {
  scrollToBottom();
});

const insertarPlantilla = () => {
  const act = state.currentActivity || (state.currentUser && state.currentUser.actividades[1]);
  if (act) {
    inputMsg.value = `Cuenta: ${act.cuenta}\nOT: ${act.ot}\nNodo: ${act.nodo}\nDirección: ${act.direccion}\nSeriales instalados: MTA TECHNICOLOR CGA0112 (383FB3975C1B)`;
  }
};

const handleSend = () => {
  const txt = inputMsg.value.trim();
  if (!txt) return;
  sendChatMessage(txt);
  inputMsg.value = '';
  scrollToBottom();
};
</script>
