<template>
  <div class="simulator-screen screen-finalizar-ot screen-active" id="screen-finalizar-ot">
    <!-- OFSC Barra Superior Roja Oficial -->
    <div class="ofsc-header-bar" style="background:#cc0000;border-bottom:none;">
      <div class="ofsc-header-left">
        <button type="button" class="btn-header-back" @click="handleBack" title="Atrás">
          ↑
        </button>
      </div>
      <div class="ofsc-header-title" style="color:#ffffff;font-size:1.05rem;font-weight:600;">
        Finalizar actividad
      </div>
      <div class="ofsc-header-right">
        <span class="ofsc-header-time" style="color:#ffffff;">{{ state.clockTime }}</span>
      </div>
    </div>

    <!-- Franja Subrayado Oficial -->
    <div style="height:3px;background:var(--ofs-primary, #ba74e6);width:100%;"></div>

    <!-- Cuerpo desplazable del formulario -->
    <div class="screen-scroll-body" style="padding:14px 16px 180px 16px;background:#ffffff;color:#222222;">

      <!-- Pregunta de Confirmación -->
      <div style="font-size:0.86rem;color:#444444;margin-bottom:14px;line-height:1.4;">
        ¿Está Seguro que desea Completar esta Orden de Trabajo?
      </div>

      <!-- Datos Inmutables del Cliente y OT -->
      <div class="cierre-static-group">
        <div class="cierre-field-label">Ot No</div>
        <div class="cierre-field-val">{{ currentActivity?.ot || '371940209_O_CO_7' }}</div>

        <div class="cierre-field-label">Tipo</div>
        <div class="cierre-field-val">{{ currentActivity?.tipo || 'Instalaciones' }}</div>

        <div class="cierre-field-label">Nombre</div>
        <div class="cierre-field-val">{{ currentActivity?.cliente || 'ALEJANDRIN RODRIGUEZ' }}</div>

        <div class="cierre-field-label">Segundo Apellido</div>
        <div class="cierre-field-val">NORIEGA</div>

        <div class="cierre-field-label">Primer Apellido</div>
        <div class="cierre-field-val">RODRIGUEZ</div>
      </div>

      <!-- E-mail de Contacto -->
      <div class="cierre-input-group">
        <label class="cierre-label">E-mail de Contacto</label>
        <input
          type="email"
          class="cierre-text-input"
          v-model="cierreState.formData.emailContacto"
          placeholder="ejemplo@correo.com"
        />
      </div>

      <!-- Se entregó Cartilla servicio Internet (Requerido) -->
      <div class="cierre-input-group">
        <label class="cierre-label">Se entregó Cartilla servicio Internet</label>
        <select class="cierre-select-input" v-model="cierreState.formData.cartillaInternet">
          <option value="NO">NO</option>
          <option value="SI">SI</option>
        </select>
        <span class="cierre-req-tag">Requerido</span>
      </div>

      <!-- Notas (Requerido) -->
      <div class="cierre-input-group" style="margin-top:10px;">
        <label class="cierre-label">Notas</label>
        <textarea
          class="cierre-textarea-input"
          rows="4"
          v-model="cierreState.formData.notas"
          placeholder="Observaciones de la instalación..."
        ></textarea>
        <span class="cierre-req-tag">Requerido</span>
      </div>

      <!-- SECCIÓN EVIDENCIA: PLACA - DIRECCIÓN DEL PREDIO -->
      <div class="cierre-section-box">
        <div class="cierre-sec-heading">PLACA - DIRECCIÓN DEL PREDIO</div>
        <div class="cierre-sec-desc">
          Recuerde que la fotografía se debe tomar dando click sobre el botón adjuntar, la imagen debe mostrar la placa de la casa, edificio o conjunto y debe ser clara o nítida. Recuerde que esta información es auditable por las áreas de la compañía.
        </div>

        <div style="font-size:0.75rem;color:#555;margin:8px 0 4px 0;font-weight:600;">
          Foto - placa (Dirección)
        </div>

        <!-- Marco de foto con la placa de la dirección de ejemplo (Pág. 5 del PDF) -->
        <div class="cierre-photo-frame">
          <div class="cierre-photo-mock">
            <div class="placa-house-facade">
              <div class="placa-roof-line"></div>
              <div class="placa-metal-box">
                <span class="placa-text">{{ cierreState.formData.placaTexto }}</span>
              </div>
              <div class="placa-window-grid">
                <span v-for="n in 12" :key="n" class="window-pane"></span>
              </div>
            </div>
          </div>
          <div style="font-size:0.68rem;color:#2e7d32;font-weight:600;margin-top:4px;">
            ✓ Fotografía de placa 42A-81 adjuntada correctamente
          </div>
        </div>
      </div>

      <!-- SECCIÓN EVIDENCIA: INFORMACIÓN DE NIVELES -->
      <div class="cierre-section-box">
        <div class="cierre-sec-heading">INFORMACIÓN DE NIVELES</div>
        <div class="cierre-sec-desc">
          Recuerde adjuntar el screenshot de GWN donde se muestren los niveles de señal que se encuentran en este momento en la prestación del servicio. Recuerde que esta información es auditable por las áreas de la compañía.
        </div>

        <div style="font-size:0.75rem;color:#555;margin:8px 0 4px 0;font-weight:600;">
          Evidencias Niveles de Señal
        </div>

        <div class="cierre-levels-mock">
          <div class="levels-header">GWN TELEMETRÍA RF - NIVELES DE SEÑAL</div>
          <div class="levels-grid">
            <div class="level-cell"><span>SNR UP:</span> <strong>36.1 dB</strong> <span class="tag-ok">OK</span></div>
            <div class="level-cell"><span>TX:</span> <strong>46.5 dBmV</strong> <span class="tag-ok">OK</span></div>
            <div class="level-cell"><span>RX:</span> <strong>3.9 dBm</strong> <span class="tag-ok">OK</span></div>
            <div class="level-cell"><span>SNR DOWN:</span> <strong>41.9 dB</strong> <span class="tag-ok">OK</span></div>
          </div>
        </div>
        <div style="font-size:0.68rem;color:#2e7d32;font-weight:600;margin-top:4px;">
          ✓ Screenshot de niveles GWN adjuntado
        </div>
      </div>

      <!-- Evidencias Adicionales y Anexos -->
      <div style="margin-top:14px;">
        <div class="cierre-field-label" style="font-weight:600;">Evidencia Ubicación Equipo</div>
        <button type="button" class="btn-cierre-adjuntar" @click="showToast('Evidencia de ubicación precargada')">
          + Agregar imagen
        </button>

        <div class="cierre-field-label" style="font-weight:600;margin-top:8px;">Evidencia Adicional</div>
        <button type="button" class="btn-cierre-adjuntar" @click="showToast('Evidencia adicional precargada')">
          + Agregar archivo
        </button>

        <div class="cierre-field-label" style="font-weight:600;margin-top:8px;">Anexos</div>
        <button type="button" class="btn-cierre-adjuntar" @click="showToast('Anexos precargados')">
          + Agregar imagen
        </button>
      </div>

      <!-- SECCIÓN: CAPTURAR COORDENADAS -->
      <div class="cierre-section-box">
        <div class="cierre-sec-heading">Capturar Coordenadas</div>
        <div class="cierre-sec-desc">
          Por favor presione el botón para capturar las coordenadas
        </div>

        <div style="margin-top:8px;">
          <div style="font-size:0.72rem;color:#666;margin-bottom:4px;">Test Geo Sp End</div>
          <button
            type="button"
            class="btn-cierre-coords"
            :class="{ 'btn-coords-success': cierreState.formData.coordenadasCapturadas }"
            @click="onCapturarCoordenadas"
          >
            {{ cierreState.formData.coordenadasCapturadas ? '✓ Coordenadas Capturadas' : 'Buscar Coordenadas' }}
          </button>
          <div v-if="cierreState.formData.coordenadasCapturadas" style="font-size:0.72rem;color:#2e7d32;margin-top:4px;font-family:monospace;">
            {{ cierreState.formData.coordenadasTexto }}
          </div>
        </div>
      </div>

      <!-- SECCIÓN: VENTA TÉCNICO -->
      <div class="cierre-section-box">
        <div class="cierre-sec-heading">Venta Tecnico</div>
        <div class="cierre-input-group" style="margin-top:6px;">
          <label class="cierre-label">¿Realizó una venta?</label>
          <select class="cierre-select-input" v-model="cierreState.formData.realizoVenta">
            <option value="NO">NO</option>
            <option value="SI">SI</option>
          </select>
          <span class="cierre-req-tag">Requerido</span>
        </div>
      </div>

      <!-- Próxima Actividad -->
      <div class="cierre-input-group" style="margin-top:14px;">
        <label class="cierre-label">Próxima Actividad</label>
        <div class="cierre-static-val" style="color:#555555;background:#f5f5f5;border:1px solid #ddd;padding:8px 10px;border-radius:4px;">
          {{ cierreState.formData.proximaActividad }}
        </div>
      </div>

      <!-- Botones Inferiores de Acción (Cancelar / OK) -->
      <div class="cierre-btn-row">
        <button type="button" class="btn-cierre-cancelar" @click="handleBack">
          Cancelar
        </button>
        <button type="button" class="btn-cierre-ok" @click="handleCompletar">
          OK
        </button>
      </div>

    </div>

    <!-- PISTA FLOTANTE INFORMATIVA -->
    <FlowHintBox
      step="4"
      title="Paso 4 - Finalizar Actividad"
    >
      Diligencia los campos obligatorios de la finalización, adjunta las evidencias y pulsa <strong>OK</strong> para completar la orden en OFSC.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import { useCierreFlow } from '../flows/cierre/useCierreFlow';
import { validarFormularioCierreOT, ejecutarValidacionConFeedback } from '../core/businessRules';
import FlowHintBox from '../components/FlowHintBox.vue';

const { state, showScreen, showToast } = useSimulator();
const { cierreState, capturarCoordenadasGPS, completarOrdenTrabajo } = useCierreFlow();

const currentActivity = computed(() => state.currentActivity);

const handleBack = () => {
  showScreen('/activity');
};

const onCapturarCoordenadas = () => {
  capturarCoordenadasGPS();
};

const handleCompletar = () => {
  const valForm = validarFormularioCierreOT();
  if (!ejecutarValidacionConFeedback(valForm)) return;

  completarOrdenTrabajo(() => {
    // Redirige a la lista de actividades donde ahora aparece en el grupo "Cerrado"
    showScreen('/activities');
  });
};
</script>

<style scoped>
.screen-finalizar-ot {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #ffffff;
}

.btn-header-back {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0 8px;
}

.cierre-static-group {
  margin-bottom: 12px;
}

.cierre-field-label {
  font-size: 0.72rem;
  color: #666666;
  margin-top: 6px;
}

.cierre-field-val {
  font-size: 0.88rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 4px;
}

.cierre-input-group {
  margin-bottom: 12px;
}

.cierre-label {
  display: block;
  font-size: 0.74rem;
  color: #333333;
  margin-bottom: 4px;
}

.cierre-text-input,
.cierre-select-input,
.cierre-textarea-input {
  width: 100%;
  padding: 8px 10px;
  font-size: 0.82rem;
  color: #222222;
  background: #ffffff;
  border: 1px solid #c7c7c7;
  border-radius: 4px;
  box-sizing: border-box;
}

.cierre-text-input:focus,
.cierre-select-input:focus,
.cierre-textarea-input:focus {
  outline: none;
  border-color: #0288d1;
}

.cierre-req-tag {
  display: block;
  text-align: right;
  font-size: 0.68rem;
  color: #777777;
  margin-top: 2px;
}

.cierre-section-box {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eeeeee;
}

.cierre-sec-heading {
  font-size: 0.88rem;
  font-weight: 700;
  color: #222222;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.cierre-sec-desc {
  font-size: 0.72rem;
  color: #555555;
  line-height: 1.38;
}

.cierre-photo-frame {
  margin-top: 8px;
  border: 1px dashed #999999;
  border-radius: 4px;
  padding: 10px;
  background: #fbfbfb;
  text-align: center;
}

.cierre-photo-mock {
  display: flex;
  justify-content: center;
  align-items: center;
}

.placa-house-facade {
  background: #cfc29b;
  border: 1px solid #999;
  border-radius: 4px;
  width: 220px;
  padding: 8px;
  text-align: center;
}

.placa-roof-line {
  height: 8px;
  background: #1b5e20;
  border-radius: 2px;
  margin-bottom: 6px;
}

.placa-metal-box {
  background: #212121;
  color: #ffffff;
  padding: 3px 8px;
  display: inline-block;
  border-radius: 2px;
  border: 1px solid #444;
  margin-bottom: 6px;
}

.placa-text {
  font-family: monospace;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.placa-window-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  background: #ffffff;
  padding: 4px;
  border: 1px solid #888;
}

.window-pane {
  background: #bbdefb;
  height: 14px;
  border: 1px solid #e0e0e0;
}

.cierre-levels-mock {
  margin-top: 8px;
  background: #212121;
  color: #ffffff;
  border-radius: 4px;
  padding: 8px 10px;
}

.levels-header {
  font-size: 0.68rem;
  color: #ffb300;
  font-weight: 700;
  border-bottom: 1px solid #444;
  padding-bottom: 4px;
  margin-bottom: 6px;
}

.levels-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.level-cell {
  font-size: 0.72rem;
  color: #e0e0e0;
}

.tag-ok {
  background: #2e7d32;
  color: #ffffff;
  font-size: 0.6rem;
  padding: 1px 4px;
  border-radius: 2px;
  margin-left: 4px;
}

.btn-cierre-adjuntar {
  background: #ffffff;
  border: 1px solid #b0bec5;
  border-radius: 3px;
  color: #37474f;
  padding: 5px 12px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2px;
}

.btn-cierre-coords {
  background: #ffffff;
  border: 1px solid #0288d1;
  color: #0288d1;
  padding: 6px 14px;
  border-radius: 3px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-coords-success {
  background: #e8f5e9;
  border-color: #2e7d32;
  color: #2e7d32;
}

.cierre-btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid #e0e0e0;
}

.btn-cierre-cancelar {
  background: #ffffff;
  border: 1px solid #b0bec5;
  color: #455a64;
  padding: 7px 18px;
  border-radius: 4px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-cierre-ok {
  background: #0288d1;
  border: 1px solid #0277bd;
  color: #ffffff;
  padding: 7px 24px;
  border-radius: 4px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.btn-cierre-ok:hover {
  background: #0277bd;
}
</style>
