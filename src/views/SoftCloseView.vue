<template>
  <div class="simulator-screen screen-softclose screen-active" id="screen-softclose">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar" :class="{ 'app-bar-submitting': state.softCloseProgress?.isSubmitting }">
      <button type="button" class="app-bar-btn" title="Volver" @click="handleBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>

      <span class="app-bar-title">
        {{ state.softCloseProgress?.isSubmitting ? 'Enviando datos...' : 'SoftClose' }}
      </span>

      <div class="app-bar-actions">
        <button type="button" class="app-bar-btn" title="Documentos">
          <svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
        </button>
      </div>
    </div>

    <!-- Contenido Scrollable con el Formulario de Cierre -->
    <div class="screen-scroll-body" style="padding: 14px 16px 180px 16px;">
      <div class="softclose-card" :class="{ 'card-target-highlight': currentStep === 19 && !hasSigned }">

        <!-- Actividad peligrosa completada -->
        <div class="softclose-field">
          <label class="softclose-label">Actividad peligrosa completada</label>
          <div class="status-ok-label">OK</div>
        </div>

        <!-- Recibido a satisfacción por -->
        <div class="softclose-field">
          <label class="softclose-label">Recibido a satisfacción por</label>
          <input
            type="text"
            class="softclose-input"
            v-model="formData.recibidoSatisfaccion"
            placeholder="Nombre completo de quien recibe"
            @focus="handleInputFocus"
          />
        </div>

        <!-- Tipo ID -->
        <div class="softclose-field">
          <label class="softclose-label">Tipo ID</label>
          <select class="softclose-select" v-model="formData.tipoId" @change="handleInputFocus">
            <option value="Cédula Ciudadanía">Cédula Ciudadanía</option>
            <option value="Cédula Extranjería">Cédula Extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="NIT">NIT</option>
          </select>
        </div>

        <!-- Identificación -->
        <div class="softclose-field">
          <label class="softclose-label">Identificación</label>
          <input
            type="text"
            class="softclose-input"
            v-model="formData.identificacion"
            placeholder="Número de documento"
            @focus="handleInputFocus"
          />
        </div>

        <!-- Teléfono Encuesta -->
        <div class="softclose-field">
          <label class="softclose-label">Telefono Encuesta</label>
          <input
            type="tel"
            class="softclose-input"
            v-model="formData.telefonoEncuesta"
            placeholder="Número de celular para encuesta"
            @focus="handleInputFocus"
          />
        </div>

        <!-- Email del contacto -->
        <div class="softclose-field">
          <label class="softclose-label">Email del contacto</label>
          <div class="softclose-email">{{ formData.emailContacto }}</div>
        </div>

        <!-- Firma del cliente * (Canvas Interactivo) -->
        <div class="softclose-field" style="margin-top: 14px;">
          <label class="softclose-label" style="font-weight: 700;">
            Firma del cliente *
          </label>
          <div
            class="canvas-wrapper"
            :class="{ 'canvas-target': currentStep === 20 || (!hasSigned && currentStep >= 19) }"
          >
            <canvas
              ref="signatureCanvas"
              class="signature-canvas"
              width="360"
              height="180"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart.passive="startDrawingTouch"
              @touchmove.passive="drawTouch"
              @touchend.passive="stopDrawing"
            ></canvas>
          </div>

          <div style="display: flex; justify-content: flex-start; margin-top: 8px;">
            <button
              type="button"
              class="btn-clear-sig"
              @click="clearSignature"
            >
              Borrar
            </button>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="softclose-actions">
          <button
            type="button"
            class="btn-sc-cancel"
            @click="handleBack"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="btn-sc-accept"
            :class="{ 'btn-highlight': currentStep === 20 }"
            :disabled="state.softCloseProgress?.isSubmitting"
            @click="confirmarSoftClose"
          >
            {{ state.softCloseProgress?.isSubmitting ? 'Enviando...' : 'Aceptar' }}
          </button>
        </div>

      </div>
    </div>

    <!-- PISTAS FLOTANTES -->
    <!-- Paso 19 (SotfClose.pdf Pág 25) -->
    <FlowHintBox
      v-if="currentStep === 19 && !hasSigned"
      step="19"
    >
      Diligencia los datos solicitados. Haz clic en la zona señalada para continuar y añade la firma.
    </FlowHintBox>

    <!-- Paso 20 (SotfClose.pdf Pág 27) -->
    <FlowHintBox
      v-else-if="currentStep === 20 || hasSigned"
      step="20"
    >
      Pide al usuario que añada su firma en el campo <strong>Firma del cliente</strong>, y presiona <strong>Aceptar</strong>.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  showScreen,
  showToast,
  advanceSoftCloseStep,
  submitSoftClose
} = useSimulator();

const signatureCanvas = ref(null);
const isDrawing = ref(false);
const hasSigned = ref(false);

const currentStep = computed(() => state.softCloseProgress?.currentStep || 19);

const formData = reactive({
  recibidoSatisfaccion: state.softCloseProgress?.softCloseFormData?.recibidoSatisfaccion || 'ALEJANDRINA RODRIGUEZ',
  tipoId: state.softCloseProgress?.softCloseFormData?.tipoId || 'Cédula Ciudadanía',
  identificacion: state.softCloseProgress?.softCloseFormData?.identificacion || '1098765432',
  telefonoEncuesta: state.softCloseProgress?.softCloseFormData?.telefonoEncuesta || '3101234567',
  emailContacto: state.softCloseProgress?.softCloseFormData?.emailContacto || 'rodriguezalejandrina@gmail.com'
});

onMounted(() => {
  nextTick(() => {
    initCanvas();
  });
});

const initCanvas = () => {
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#212121';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Si ya había una firma previa dibujada en el PDF de ejemplo
  drawInitialSignaturePlaceholder(ctx);
};

const drawInitialSignaturePlaceholder = (ctx) => {
  // Trazar firma de ejemplo "ALEJANDRINA" como en el PDF pág 26
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  // Letra A
  ctx.moveTo(30, 140);
  ctx.lineTo(55, 40);
  ctx.lineTo(80, 140);
  ctx.moveTo(40, 95);
  ctx.lineTo(70, 95);
  // Letra L
  ctx.moveTo(90, 45);
  ctx.lineTo(90, 138);
  ctx.lineTo(125, 138);
  // Letra E
  ctx.moveTo(135, 45);
  ctx.lineTo(135, 138);
  ctx.moveTo(135, 45);
  ctx.lineTo(165, 45);
  ctx.moveTo(135, 90);
  ctx.lineTo(160, 90);
  ctx.moveTo(135, 138);
  ctx.lineTo(165, 138);
  // Trazo curvo J-A-N-D-R-I-N-A
  ctx.moveTo(175, 50);
  ctx.lineTo(185, 145);
  ctx.lineTo(170, 145);
  ctx.moveTo(195, 135);
  ctx.lineTo(215, 60);
  ctx.lineTo(235, 135);
  ctx.moveTo(245, 135);
  ctx.lineTo(245, 50);
  ctx.lineTo(275, 135);
  ctx.lineTo(275, 50);
  ctx.moveTo(285, 50);
  ctx.bezierCurveTo(320, 50, 320, 135, 285, 135);
  ctx.lineTo(285, 50);
  ctx.stroke();

  hasSigned.value = true;
};

// Canvas Mouse Events
const startDrawing = (e) => {
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  isDrawing.value = true;
  hasSigned.value = true;
  advanceSoftCloseStep(20);
};

const draw = (e) => {
  if (!isDrawing.value) return;
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const ctx = canvas.getContext('2d');
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
};

const stopDrawing = () => {
  isDrawing.value = false;
};

// Canvas Touch Events (Mobile)
const startDrawingTouch = (e) => {
  const canvas = signatureCanvas.value;
  if (!canvas || !e.touches || e.touches.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  isDrawing.value = true;
  hasSigned.value = true;
  advanceSoftCloseStep(20);
};

const drawTouch = (e) => {
  if (!isDrawing.value) return;
  const canvas = signatureCanvas.value;
  if (!canvas || !e.touches || e.touches.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const ctx = canvas.getContext('2d');
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
};

const clearSignature = () => {
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSigned.value = false;
  showToast('Firma borrada. Añada una nueva firma.');
};

const handleInputFocus = () => {
  advanceSoftCloseStep(20);
};

const handleBack = () => {
  showScreen('/activity');
};

const confirmarSoftClose = () => {
  if (!hasSigned.value) {
    showToast('Debe ingresar la firma del cliente antes de aceptar.', 'error');
    return;
  }

  // Guardar datos en el estado del simulador
  state.softCloseProgress.softCloseFormData = { ...formData };

  // Ejecutar cierre con simulación de "Enviando datos..."
  submitSoftClose(() => {
    showScreen('/activities');
  });
};
</script>

<style scoped>
.app-bar-submitting {
  background: #9945cc !important;
}

.softclose-card {
  background: #ffffff;
  color: #212121;
  border-radius: 6px;
  padding: 18px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.softclose-field {
  margin-bottom: 14px;
}

.softclose-label {
  display: block;
  font-size: 0.8rem;
  color: #616161;
  margin-bottom: 4px;
}

.status-ok-label {
  font-size: 0.95rem;
  font-weight: 800;
  color: #2e7d32;
}

.softclose-input, .softclose-select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 0.88rem;
  color: #212121;
  background: #fafafa;
}

.softclose-input:focus, .softclose-select:focus {
  outline: none;
  border-color: #0288d1;
  background: #ffffff;
}

.softclose-email {
  font-size: 0.88rem;
  color: #0277bd;
  font-weight: 600;
}

.canvas-wrapper {
  background: #fafafa;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  overflow: hidden;
  touch-action: none;
}

.canvas-wrapper.canvas-target {
  border: 2px dashed #0288d1;
  box-shadow: 0 0 10px rgba(2, 136, 209, 0.25);
}

.signature-canvas {
  width: 100%;
  height: 170px;
  display: block;
  cursor: crosshair;
}

.btn-clear-sig {
  background: #e0e0e0;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #424242;
  cursor: pointer;
}

.btn-clear-sig:hover {
  background: #d5d5d5;
}

.softclose-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-sc-cancel {
  flex: 1;
  padding: 11px;
  background: #eeeeee;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #424242;
  cursor: pointer;
}

.btn-sc-accept {
  flex: 1;
  padding: 11px;
  background: #0277bd;
  border: none;
  border-radius: 4px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sc-accept:hover {
  background: #01579b;
}

.btn-sc-accept.btn-highlight {
  box-shadow: 0 0 14px rgba(2, 136, 209, 0.7);
  animation: pulseBtn 1.5s infinite;
}

@keyframes pulseBtn {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.card-target-highlight {
  border: 1.5px solid #ef5350 !important;
}
</style>
