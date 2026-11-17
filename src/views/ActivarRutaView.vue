<template>
  <div class="simulator-screen screen-activar-ruta screen-active" id="screen-activar-ruta">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="handleBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Activar ruta de trabajo</span>
      <div style="width: 36px;"></div>
    </div>

    <!-- Contenido de Confirmación según Páginas 7 y 8 del PDF -->
    <div class="screen-scroll-body" style="padding: 24px 20px 180px 20px; max-width: 440px; margin: 0 auto;">
      <div class="confirm-prompt-card">
        <div class="confirm-prompt-title">¿Activar ruta ya?</div>

        <div class="confirm-buttons-group">
          <button
            type="button"
            class="btn-cancel-route"
            @click="handleBack"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn-ok-route"
            :class="{ 'btn-highlight': currentStep === 5 || !rutaActivada }"
            @click="handleConfirm"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- PISTA FLOTANTE PASO 5 (ACTIVACION RUTA.pdf Pág 8) -->
    <FlowHintBox
      v-if="currentStep === 5 || !rutaActivada"
      step="5"
    >
      Finalmente, el aplicativo te solicitará confirmar la activación de la ruta. Pulsa la opción <strong>OK</strong>.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  showScreen,
  confirmarActivacionRuta
} = useSimulator();

const currentStep = computed(() => state.activacionRutaProgress?.currentStep || 5);
const rutaActivada = computed(() => !!state.currentUser?.rutaActivada);

const handleBack = () => {
  showScreen('/activities');
};

const handleConfirm = () => {
  confirmarActivacionRuta(() => {
    showScreen('/activities');
  });
};
</script>

<style scoped>
.confirm-prompt-card {
  background: #ffffff;
  color: #212121;
  border-radius: 4px;
  padding: 28px 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.confirm-prompt-title {
  font-size: 0.95rem;
  color: #424242;
  margin-bottom: 24px;
  text-align: left;
}

.confirm-buttons-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel-route {
  padding: 8px 18px;
  background: #ffffff;
  color: #424242;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-cancel-route:hover {
  background: #f5f5f5;
}

.btn-ok-route {
  padding: 8px 24px;
  background: #0277bd;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ok-route:hover {
  background: #01579b;
}

.btn-ok-route.btn-highlight {
  box-shadow: 0 0 14px rgba(2, 136, 209, 0.7);
  animation: pulseButton 1.5s infinite;
}

@keyframes pulseButton {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
</style>
