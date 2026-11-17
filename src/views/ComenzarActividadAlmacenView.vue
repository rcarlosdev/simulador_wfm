<template>
  <div class="simulator-screen screen-comenzar-actividad screen-active" id="screen-comenzar-actividad">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="handleBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Comenzar actividad</span>
      <div style="width: 36px;"></div>
    </div>

    <!-- Contenido de Confirmación según Páginas 5 y 6 del PDF -->
    <div class="screen-scroll-body" style="padding: 24px 20px 180px 20px; max-width: 440px; margin: 0 auto;">
      <div class="comenzar-card">
        <div class="comenzar-field">
          <div class="field-label">Tipo de Actividad</div>
          <div class="field-value">Actividades de Almacen</div>
        </div>

        <div class="comenzar-field" style="margin-top: 14px;">
          <div class="field-label">Reincidencias:</div>
        </div>

        <div class="comenzar-buttons-group">
          <button
            type="button"
            class="btn-cancel-act"
            @click="handleBack"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn-ok-act"
            :class="{ 'btn-highlight': currentStep === 3 }"
            @click="handleConfirm"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- PISTA FLOTANTE PASO 3 (ACTIVIDADES ALMACEN.pdf Pág 6) -->
    <FlowHintBox
      v-if="currentStep === 3"
      step="3"
    >
      En la pantalla <strong>Comenzar actividad</strong>, pulsa <strong>OK</strong> para confirmar el inicio de la actividad.
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
  confirmarInicioAlmacen
} = useSimulator();

const currentStep = computed(() => state.almacenProgress?.currentStep || 3);

const handleBack = () => {
  showScreen('/activity');
};

const handleConfirm = () => {
  confirmarInicioAlmacen(() => {
    showScreen('/activities');
  });
};
</script>

<style scoped>
.comenzar-card {
  background: #ffffff;
  color: #212121;
  border-radius: 4px;
  padding: 24px 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.comenzar-field {
  margin-bottom: 12px;
}

.field-label {
  font-size: 0.8rem;
  color: #616161;
  margin-bottom: 2px;
}

.field-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #212121;
}

.comenzar-buttons-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

.btn-cancel-act {
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

.btn-cancel-act:hover {
  background: #f5f5f5;
}

.btn-ok-act {
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

.btn-ok-act:hover {
  background: #01579b;
}

.btn-ok-act.btn-highlight {
  box-shadow: 0 0 14px rgba(2, 136, 209, 0.7);
  animation: pulseBtn 1.5s infinite;
}

@keyframes pulseBtn {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
</style>
