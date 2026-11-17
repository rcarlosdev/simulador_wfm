<template>
  <div class="simulator-screen screen-check-inicio screen-active" id="screen-check-inicio">
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="handleBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Check Inicio Operación</span>
      <div style="width: 36px;"></div>
    </div>

    <div class="screen-scroll-body" style="padding: 14px 16px 180px 16px;">
      <!-- SECCIÓN 1: KIT HERRAMIENTA -->
      <div class="form-section-card">
        <div class="section-title">Kit Herramienta</div>
        <div class="form-group-field">
          <label class="field-label">
            Kit Herramienta <span class="req-star">*</span>
          </label>
          <select v-model="formData.kitHerramientas" class="form-control-select">
            <option value="Cumple">Cumple</option>
            <option value="No Cumple">No Cumple</option>
          </select>
        </div>
      </div>

      <!-- SECCIÓN 2: REGISTRO MEDIDOR DE CAMPO -->
      <div class="form-section-card">
        <div class="section-title">Registro medidor de campo</div>
        <div class="form-group-field">
          <label class="field-label">Medidor de Campo</label>
          <select v-model="formData.medidorModelo" class="form-control-select">
            <option value="Televes">Televes</option>
            <option value="Viavi">Viavi</option>
            <option value="Deviser">Deviser</option>
          </select>
        </div>

        <div class="form-group-field">
          <label class="field-label">Serial</label>
          <input
            type="text"
            v-model="formData.medidorSerial"
            class="form-control-input"
            placeholder="Ej: TEL-98124"
          />
        </div>

        <div class="form-group-field">
          <label class="field-label">Mac</label>
          <input
            type="text"
            v-model="formData.medidorMac"
            class="form-control-input"
            placeholder="Ej: 00:1E:C2:5A:8B:10"
          />
        </div>
      </div>

      <!-- SECCIÓN 3: CÉLULA OPERATIVA -->
      <div class="form-section-card">
        <div class="section-title">Célula Operativa</div>
        <div class="form-group-field">
          <label class="field-label">
            Supervisor de campo <span class="req-star">*</span>
          </label>
          <select v-model="formData.supervisorEstado" class="form-control-select">
            <option value="Asignado">Asignado</option>
            <option value="No Asignado">No Asignado</option>
          </select>
        </div>

        <div class="form-group-field">
          <label class="field-label">Nombre supervisor asignado</label>
          <input
            type="text"
            v-model="formData.supervisorNombre"
            class="form-control-input"
            placeholder="Nombre del supervisor"
          />
        </div>

        <div class="form-group-field">
          <label class="field-label">
            Móvil de apoyo <span class="req-star">*</span>
          </label>
          <select v-model="formData.movilApoyoEstado" class="form-control-select">
            <option value="Asignado">Asignado</option>
            <option value="No Asignado">No Asignado</option>
          </select>
        </div>

        <div class="form-group-field">
          <label class="field-label">Nombre técnico de apoyo</label>
          <input
            type="text"
            v-model="formData.movilApoyoNombre"
            class="form-control-input"
            placeholder="Nombre del técnico de apoyo"
          />
        </div>

        <div class="form-group-field">
          <label class="field-label">Contacto CND</label>
          <select v-model="formData.contactoCnd" class="form-control-select">
            <option value="Línea CND 018000">Línea CND 018000</option>
            <option value="CND Regional Occidente">CND Regional Occidente</option>
            <option value="CND Soporte Nacional">CND Soporte Nacional</option>
          </select>
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN (Cancelar / OK) -->
      <div class="form-action-footer">
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
          :class="{ 'btn-highlight': isStep6 }"
          @click="handleSubmit"
        >
          OK
        </button>
      </div>
    </div>

    <!-- PISTA FLOTANTE PASO 6 (ACTIVIDADES ALMACEN.pdf Pág 12) -->
    <FlowHintBox
      v-if="isStep6"
      step="6"
    >
      Diligencia los datos correspondientes y pulsa <strong>OK</strong> al finalizar.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  showScreen,
  guardarCheckInicio
} = useSimulator();

const formData = reactive({
  kitHerramientas: state.almacenProgress?.checkFormData?.kitHerramientas || 'Cumple',
  medidorModelo: state.almacenProgress?.checkFormData?.medidorModelo || 'Televes',
  medidorSerial: state.almacenProgress?.checkFormData?.medidorSerial || 'TEL-98124',
  medidorMac: state.almacenProgress?.checkFormData?.medidorMac || '00:1E:C2:5A:8B:10',
  supervisorEstado: state.almacenProgress?.checkFormData?.supervisorEstado || 'Asignado',
  supervisorNombre: state.almacenProgress?.checkFormData?.supervisorNombre || 'CARLOS MARIO ZAPATA',
  movilApoyoEstado: state.almacenProgress?.checkFormData?.movilApoyoEstado || 'Asignado',
  movilApoyoNombre: state.almacenProgress?.checkFormData?.movilApoyoNombre || 'JORGE ELIECER OCAMPO',
  contactoCnd: state.almacenProgress?.checkFormData?.contactoCnd || 'Línea CND 018000'
});

const isStep6 = computed(() => {
  return state.almacenProgress?.currentStep === 6 || (!state.almacenProgress?.checkRealizado && state.currentActivity?.tipo === 'almacen');
});

const handleBack = () => {
  showScreen('/activity');
};

const handleSubmit = () => {
  guardarCheckInicio(formData, () => {
    showScreen('/activity');
  });
};
</script>

<style scoped>
.form-section-card {
  background: #252830;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid #333842;
}

.section-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #f5f5f5;
  margin-bottom: 14px;
  border-bottom: 1px solid #3d424e;
  padding-bottom: 6px;
}

.form-group-field {
  margin-bottom: 14px;
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

.form-control-select,
.form-control-input {
  width: 100%;
  box-sizing: border-box;
  background: #1c1e24;
  color: #ffffff;
  border: 1px solid #4a5060;
  border-radius: 3px;
  padding: 8px 10px;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-control-select:focus,
.form-control-input:focus {
  border-color: #0288d1;
}

.form-action-footer {
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
