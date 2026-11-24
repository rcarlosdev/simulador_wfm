<template>
  <div class="simulator-screen screen-inventario-acciones screen-active">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="handleBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Acciones Inventario</span>
      <div style="width: 36px;"></div>
    </div>

    <div class="screen-scroll-body" style="padding: 16px 16px 180px 16px; max-width: 460px; margin: 0 auto;">
      <div class="form-group-field" style="margin-bottom: 18px;">
        <label style="font-size: 0.82rem; color: #cfd8dc; font-weight: 600; display: block; margin-bottom: 6px;">
          Tipo solicitud
        </label>
        <div class="select-wrapper">
          <select
            class="form-control-select"
            :class="{ 'select-target': state.softCloseProgress?.iniciado && (currentStep === 13 || currentStep === 14) }"
            v-model="tipoSolicitud"
            @change="handleSelectChange"
          >
            <option value="Cambiar Clave de Red">Cambiar Clave de Red</option>
            <option value="Cambiar Nombre de Red">Cambiar Nombre de Red</option>
            <option value="Reenviar activación Internet">Reenviar activación Internet</option>
            <option value="Valida Niveles MTA">Valida Niveles MTA</option>
          </select>
        </div>
        <div style="text-align: right; font-size: 0.74rem; color: #90a4ae; margin-top: 4px;">Requerido</div>
      </div>

      <!-- Campos dinámicos si se elige otra opción -->
      <template v-if="tipoSolicitud === 'Cambiar Clave de Red'">
        <div class="form-group-field" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; color: #cfd8dc; margin-bottom: 4px; display: block;">Banda WIFI</label>
          <select class="form-control-select">
            <option>2.4 GHz</option>
            <option>5.0 GHz Dual Band</option>
          </select>
        </div>
        <div class="form-group-field" style="margin-bottom: 18px;">
          <label style="font-size: 0.8rem; color: #cfd8dc; margin-bottom: 4px; display: block;">Cambiar Clave de Red</label>
          <input type="text" class="form-control-input" placeholder="Nueva contraseña de red" />
        </div>
      </template>

      <!-- Botones de Acción Cancelar y OK -->
      <div style="display: flex; gap: 12px; margin-top: 24px;">
        <button
          type="button"
          class="btn-ofs-secondary"
          style="flex: 1; padding: 10px; background: #ffffff; color: #212121; border-radius: 4px; font-weight: 700;"
          @click="handleBack"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn-ofs-primary"
          :class="{ 'btn-highlight': state.softCloseProgress?.iniciado && currentStep === 15 }"
          style="flex: 1; padding: 10px; background: #0277bd; color: #ffffff; border-radius: 4px; font-weight: 700; border: none; cursor: pointer;"
          @click="confirmarAccion"
        >
          OK
        </button>
      </div>
    </div>

    <!-- PISTAS FLOTANTES (Solo si SoftClose fue iniciado) -->
    <template v-if="state.softCloseProgress?.iniciado">
      <!-- Paso 13 (SotfClose.pdf Pág 15) -->
      <FlowHintBox
        v-if="currentStep === 13 && tipoSolicitud !== 'Valida Niveles MTA'"
        step="13"
      >
        Luego despliega el menú <strong>Tipo de solicitud</strong>.
      </FlowHintBox>

      <!-- Paso 14 (SotfClose.pdf Pág 17) -->
      <FlowHintBox
        v-else-if="currentStep === 14 || (currentStep === 13 && tipoSolicitud === 'Cambiar Clave de Red')"
        step="14"
      >
        Selecciona la opción <strong>Valida niveles MTA</strong>.
      </FlowHintBox>

      <!-- Paso 15 (SotfClose.pdf Pág 18) -->
      <FlowHintBox
        v-else-if="currentStep === 15 || tipoSolicitud === 'Valida Niveles MTA'"
        step="15"
      >
        Confirma la acción haciendo clic sobre <strong>OK</strong>.
      </FlowHintBox>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const { state, showScreen, showToast, advanceSoftCloseStep } = useSimulator();

const tipoSolicitud = ref(
  state.softCloseProgress?.solicitudAccionSelected ||
  (state.softCloseProgress?.mtaNivelesValidados ? 'Valida Niveles MTA' : 'Cambiar Clave de Red')
);

const currentStep = computed(() => state.softCloseProgress?.currentStep || 0);

const handleSelectChange = () => {
  state.softCloseProgress.solicitudAccionSelected = tipoSolicitud.value;
  if (tipoSolicitud.value === 'Valida Niveles MTA') {
    advanceSoftCloseStep(15);
  }
};

const handleBack = () => {
  showScreen('/inventario-detalle');
};

const confirmarAccion = () => {
  if (tipoSolicitud.value === 'Valida Niveles MTA') {
    state.softCloseProgress.mtaNivelesValidados = true;
    advanceSoftCloseStep(16);
    showToast('Validación de niveles MTA confirmada. Parámetros técnicos cargados.', 'success');
    showScreen('/inventario-detalle');
  } else {
    showToast(`Solicitud "${tipoSolicitud.value}" enviada.`);
    showScreen('/inventario-detalle');
  }
};
</script>

<style scoped>
.select-target {
  background: rgba(186, 116, 230, 0.25) !important;
  border: 1.5px solid #ba74e6 !important;
  box-shadow: 0 0 10px rgba(186, 116, 230, 0.35);
}

.btn-highlight {
  background: #0288d1 !important;
  box-shadow: 0 0 14px rgba(2, 136, 209, 0.6) !important;
  animation: pulseButton 1.5s infinite;
}

@keyframes pulseButton {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style>
