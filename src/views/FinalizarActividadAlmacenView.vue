<template>
  <div class="simulator-screen screen-finalizar-actividad screen-active" id="screen-finalizar-actividad">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="handleBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Finalizar actividad</span>
      <div style="width: 36px;"></div>
    </div>

    <!-- Contenido Scrollable según Páginas 15 y 16 del PDF -->
    <div class="screen-scroll-body" style="padding: 16px 16px 180px 16px; max-width: 460px; margin: 0 auto;">
      <div class="finalizar-card">
        <!-- Tipo de Actividad -->
        <div class="info-row">
          <div class="info-label">Tipo</div>
          <div class="info-value">Actividades de Almacen</div>
        </div>

        <!-- Capturar Coordenadas -->
        <div class="coords-box">
          <div class="coords-title">Capturar Coordenadas</div>
          <p class="coords-subtitle">Por favor presione el botón para capturar las coordenadas</p>
          <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
            <button
              type="button"
              class="btn-gps"
              @click="capturarGps"
            >
              <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor;"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
              <span>{{ coordsCapturadas ? 'Coordenadas Capturadas' : 'Capturar GPS' }}</span>
            </button>
            <span v-if="coordsCapturadas" class="coords-badge">✓ OK</span>
          </div>
          <div v-if="coordsCapturadas" class="coords-text">
            Lat: 6.2442 | Lng: -75.5812
          </div>
        </div>

        <!-- Próxima Actividad Asignada -->
        <div class="proxima-box">
          <div class="proxima-title">Próxima Actividad</div>
          <div class="proxima-card">
            <div class="proxima-badge">PENDIENTE</div>
            <div class="proxima-time">06:30 AM - 07:30 AM</div>
            <div class="proxima-desc">
              <strong>00:24 - Instalaciones</strong> · {{ nextActivityName }}
            </div>
            <div class="proxima-ot">OT No: {{ nextActivityOt }}</div>
          </div>
        </div>

        <!-- Tiempo de Viaje -->
        <div class="viaje-box">
          <label class="field-label">
            Tiempo de viaje <span class="req-star">*</span>
          </label>
          <select v-model="tiempoViaje" class="form-control-select">
            <option value="10 min">10 min</option>
            <option value="13 min">13 min</option>
            <option value="15 min">15 min</option>
            <option value="20 min">20 min</option>
            <option value="30 min">30 min</option>
          </select>
        </div>

        <!-- Botones de Acción -->
        <div class="finalizar-buttons-group">
          <button
            type="button"
            class="btn-cancel"
            @click="handleBack"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn-ok"
            :class="{ 'btn-highlight': isStep8 }"
            @click="handleConfirm"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- PISTA FLOTANTE PASO 8 (ACTIVIDADES ALMACEN.pdf Pág 16) -->
    <FlowHintBox
      v-if="isStep8"
      step="8"
    >
      Pulsa <strong>OK</strong> en la pantalla Finalizar actividad.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  showScreen,
  showToast,
  finalizarActividadAlmacen
} = useSimulator();

const coordsCapturadas = ref(true);
const tiempoViaje = ref(state.almacenProgress?.finalizarFormData?.tiempoViaje || '13 min');

const isStep8 = computed(() => state.almacenProgress?.currentStep === 8);

const nextActivity = computed(() => {
  const acts = state.currentUser?.actividades || [];
  return acts.find(a => a.tipo !== 'almacen') || null;
});

const nextActivityName = computed(() => {
  const cliente = nextActivity.value?.cliente;
  if (!cliente) return 'CLIENTE DEMO';
  return typeof cliente === 'string' ? cliente : (cliente.nombre || 'CLIENTE DEMO');
});
const nextActivityOt = computed(() => nextActivity.value?.cliente?.ot || '481787893_O_CO_661');

const capturarGps = () => {
  coordsCapturadas.value = true;
  showToast('Coordenadas GPS actualizadas correctamente.', 'success');
};

const handleBack = () => {
  showScreen('/activity');
};

const handleConfirm = () => {
  finalizarActividadAlmacen({
    coordenadasCapturadas: coordsCapturadas.value,
    tiempoViaje: tiempoViaje.value
  }, () => {
    showScreen('/activities');
  });
};
</script>

<style scoped>
.finalizar-card {
  background: #252830;
  border-radius: 4px;
  padding: 18px;
  border: 1px solid #333842;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.info-row {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333842;
}

.info-label {
  font-size: 0.78rem;
  color: #9e9e9e;
  margin-bottom: 2px;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
}

.coords-box {
  background: #1c1e24;
  border: 1px dashed #4a5060;
  border-radius: 4px;
  padding: 14px;
  margin-bottom: 16px;
}

.coords-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fbc02d;
  margin-bottom: 4px;
}

.coords-subtitle {
  font-size: 0.78rem;
  color: #aaaaaa;
  margin: 0;
}

.btn-gps {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #37474f;
  color: #eceff1;
  border: 1px solid #546e7a;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-gps:hover {
  background: #455a64;
}

.coords-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4caf50;
  background: rgba(76, 175, 80, 0.15);
  padding: 3px 8px;
  border-radius: 3px;
}

.coords-text {
  font-size: 0.75rem;
  color: #90caf9;
  margin-top: 8px;
  font-family: monospace;
}

.proxima-box {
  margin-bottom: 16px;
}

.proxima-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #bdbdbd;
  margin-bottom: 8px;
}

.proxima-card {
  background: #1c1e24;
  border-left: 4px solid #00acc1;
  border-radius: 4px;
  padding: 12px 14px;
}

.proxima-badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  color: #00acc1;
  background: rgba(0, 172, 193, 0.15);
  padding: 2px 6px;
  border-radius: 2px;
  margin-bottom: 4px;
}

.proxima-time {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

.proxima-desc {
  font-size: 0.8rem;
  color: #cccccc;
  margin-top: 2px;
}

.proxima-ot {
  font-size: 0.74rem;
  color: #888888;
  margin-top: 4px;
  font-family: monospace;
}

.viaje-box {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 0.78rem;
  color: #bbb;
  margin-bottom: 6px;
  font-weight: 600;
}

.req-star {
  color: #e53935;
  font-weight: bold;
}

.form-control-select {
  width: 100%;
  background: #1c1e24;
  color: #ffffff;
  border: 1px solid #4a5060;
  border-radius: 3px;
  padding: 8px 10px;
  font-size: 0.88rem;
  font-weight: 600;
  outline: none;
}

.finalizar-buttons-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn-cancel {
  padding: 8px 18px;
  background: #333842;
  color: #e0e0e0;
  border: 1px solid #4a5060;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.86rem;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #3d424e;
}

.btn-ok {
  padding: 8px 26px;
  background: #0288d1;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.86rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ok:hover {
  background: #0277bd;
}

.btn-ok.btn-highlight {
  box-shadow: 0 0 14px rgba(2, 136, 209, 0.8);
  animation: pulseBtn 1.5s infinite;
}

@keyframes pulseBtn {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
</style>
