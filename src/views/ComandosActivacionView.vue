<template>
  <div class="simulator-screen screen-comandos-act screen-active" id="screen-comandos-act">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button
        type="button"
        class="app-bar-btn"
        :class="{ 'btn-highlight': state.softCloseProgress?.iniciado && currentStep === 10 }"
        title="Volver"
        @click="handleBack"
      >
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Comandos Activacion</span>
      <div class="app-bar-actions">
        <button type="button" class="app-bar-btn" title="Buscar">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
    </div>

    <div class="screen-scroll-body" style="padding: 10px 12px 180px 12px;">
      <!-- Banner Verde: EJECUCIÓN DE COMANDOS -->
      <div class="cmd-green-banner">
        <span>EJECUCIÓN DE COMANDOS</span>
        <span class="cmd-warn-icon">⚠</span>
      </div>

      <!-- Datos de Orden -->
      <div class="cmd-meta-row">
        <div>
          <span class="cmd-meta-label">Orden:</span> {{ isBrownfield ? (state.currentActivity?.cuenta || '381122773') : '371940209' }} &nbsp;&nbsp;
          <span class="cmd-meta-label">Tipo orden:</span> 0
        </div>
        <button type="button" class="btn-refresh-icon" @click="showToast('Actualizando telemetría...')">🔄</button>
      </div>
      <div class="cmd-meta-row" style="margin-top: 2px;">
        <div>
          <span class="cmd-meta-label">ActivityId:</span> 93713911 &nbsp;&nbsp;
          <span class="cmd-meta-label">Usuario:</span> {{ state.currentUser?.cedula || '1234567890' }}
        </div>
      </div>

      <!-- Sección Verde: EQUIPOS -->
      <div class="cmd-section-bar">
        EQUIPOS - SERIAL: {{ isBrownfield ? '254889543645' : '383FB3975C1B' }}
      </div>

      <div class="cmd-equipment-details">
        <div v-if="isBrownfield" class="cmd-eq-grid">
          <div><span class="cmd-bold">Tipo:</span> ITV</div>
          <div><span class="cmd-bold">Fabricante:</span> N2P</div>
          <div><span class="cmd-bold">Mac:</span> A8:F4:70:C2:84:89</div>
          <div><span class="cmd-bold">Serial:</span> 254889543645</div>
          <div style="grid-column: span 2;"><span class="cmd-bold">Tecnología:</span> IPTV NEWLAND NL 6105RC</div>
          <div style="grid-column: span 2;"><span class="cmd-bold">Familia:</span> TELEVISION</div>
          <div style="grid-column: span 2; color: #ffb74d;"><span class="cmd-bold">Ubicación:</span> No se puedo encontrar la ubicación del equipo</div>
        </div>

        <div v-else class="cmd-eq-grid">
          <div><span class="cmd-bold">Tipo:</span> MTA</div>
          <div><span class="cmd-bold">Fabricante:</span> CG1</div>
          <div><span class="cmd-bold">Mac:</span> 38:3F:B3:97:5C:1C</div>
          <div><span class="cmd-bold">Serial:</span> 383FB3975C1B</div>
          <div style="grid-column: span 2;"><span class="cmd-bold">Tecnología:</span> DOCSIS 3.0 DOBLE BANDA</div>
          <div style="grid-column: span 2;"><span class="cmd-bold">Familia:</span> INT_TEL</div>
          <div style="grid-column: span 2; color: #ffb74d;"><span class="cmd-bold">Ubicación:</span> No se puedo encontrar la ubicación del equipo</div>
        </div>
      </div>

      <!-- Sección Verde: SERVICIOS -->
      <div class="cmd-section-bar" style="margin-top: 10px;">
        SERVICIOS - CUENTA: {{ isBrownfield ? (state.currentActivity?.cuenta || '23852718') : '7730852' }}
      </div>

      <div class="cmd-tabs-bar">
        <button type="button" class="cmd-tab active">SERVICIOS</button>
        <button type="button" class="cmd-tab">SERVICIOS ADICIONALES</button>
      </div>

      <table class="cmd-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Familia</th>
            <th>Línea</th>
            <th>Puerto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="5" style="text-align: center; color: #999; padding: 10px;">
              No se encontraron registros
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Selector de Acción -->
      <div class="cmd-action-box">
        <label class="cmd-action-label">Acción</label>
        <div class="cmd-select-wrapper">
          <select
            class="cmd-select-control"
            :class="{
              'select-target': (!isBrownfield && state.softCloseProgress?.iniciado && currentStep === 8) || (isBrownfield && state.brownfieldProgress?.iniciado && !state.brownfieldProgress?.reutilizacionComandoEjecutado)
            }"
            v-model="selectedAction"
            @change="handleActionChange"
          >
            <option value="" disabled>Seleccione</option>
            <option value="Consultar">Consultar Equipo</option>
            <option value="Puerto">Puerto Telefonia OFSC</option>
            <option value="Niveles">Niveles</option>
            <option value="Wifi">Comandos WIFI</option>
            <option value="Cambiar">Cambiar servicio</option>
          </select>
        </div>
      </div>

      <!-- ALERTA VERDE OFSC / COMANDOS CLARO (Página 62 del PDF) -->
      <div v-if="state.brownfieldProgress?.reutilizacionComandoEjecutado" style="background:#1b5e20;color:#c8e6c9;padding:10px 14px;border-radius:4px;margin-top:14px;font-weight:700;display:flex;align-items:center;gap:8px;">
        <span style="font-size:1.1rem;">✔</span>
        <span>Ejecución de Comando: CAMBIAR_SERVICIO exitoso</span>
      </div>

      <!-- REGISTRO DE ACCIONES PARA CAMBIAR SERVICIO (BROWNFIELD) -->
      <div v-if="state.brownfieldProgress?.reutilizacionComandoEjecutado" class="cmd-results-block">
        <div class="cmd-section-bar" style="margin-top: 14px; text-align: center;">
          REGISTRO DE ACCIONES
        </div>
        <div class="cmd-action-log">
          <div class="cmd-log-row">
            <span class="cmd-log-label">Resultado</span>
            <span class="cmd-log-val ok-check">✔</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Comando</span>
            <span class="cmd-log-val">CAMBIAR_SERVICIO</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Acción</span>
            <span class="cmd-log-val">CAMBIAR_SERVICIO</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Detalle</span>
            <span class="cmd-log-val">Id Corto: 1 - TV IP DIG PL;WIN+ aplicado correctamente</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Estado</span>
            <span class="cmd-log-val" style="color: #81c784; font-weight: 700;">EXITOSO</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Fecha Inicio Ejecución</span>
            <span class="cmd-log-val">15/02/2023 10:25:40</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Fecha Fin Ejecución</span>
            <span class="cmd-log-val">15/02/2023 10:25:42</span>
          </div>
        </div>
      </div>

      <!-- RESULTADOS DE NIVELES (Páginas 10 y 11 del PDF) -->
      <div v-if="state.softCloseProgress?.nivelesEjecutados" class="cmd-results-block">
        <!-- Barra Verde: NIVELES -->
        <div class="cmd-section-bar" style="margin-top: 14px; text-align: center;">
          NIVELES
        </div>

        <table class="cmd-levels-table">
          <thead>
            <tr>
              <th>Nombre Nivel</th>
              <th>Valor Nivel</th>
              <th>Evaluación Nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>snr_up</td>
              <td>36.1</td>
              <td class="eval-ok">ok</td>
            </tr>
            <tr>
              <td>tx</td>
              <td>46.5</td>
              <td class="eval-ok">ok</td>
            </tr>
            <tr>
              <td>rx</td>
              <td>3.9</td>
              <td class="eval-ok">ok</td>
            </tr>
            <tr>
              <td>snr_down</td>
              <td>41.9</td>
              <td class="eval-ok">ok</td>
            </tr>
          </tbody>
        </table>

        <!-- Barra Verde: REGISTRO DE ACCIONES -->
        <div class="cmd-section-bar" style="margin-top: 14px; text-align: center;">
          REGISTRO DE ACCIONES
        </div>

        <div class="cmd-action-log">
          <div class="cmd-log-row">
            <span class="cmd-log-label">Resultado</span>
            <span class="cmd-log-val ok-check">✔</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Comando</span>
            <span class="cmd-log-val">NIVELES</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Acción</span>
            <span class="cmd-log-val">NIVELES</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Detalle</span>
            <span class="cmd-log-val">Aplicado correctamente</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Estado</span>
            <span class="cmd-log-val" style="color: #81c784; font-weight: 700;">EXITOSO</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Fecha Inicio Ejecución</span>
            <span class="cmd-log-val">15/02/2023 10:25:40</span>
          </div>
          <div class="cmd-log-row">
            <span class="cmd-log-label">Fecha Fin Ejecución</span>
            <span class="cmd-log-val">15/02/2023 10:25:42</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL POPUP: LABEL NIVELES (Página 9 - Paso 9) -->
    <div v-if="modalNivelesOpen" class="cmd-modal-backdrop" @click="modalNivelesOpen = false">
      <div class="cmd-modal-dialog" @click.stop>
        <div class="cmd-modal-header">
          <span class="cmd-modal-title">Label Niveles</span>
          <button type="button" class="cmd-modal-close" @click="modalNivelesOpen = false">Cerrar</button>
        </div>

        <div class="cmd-modal-body">
          <div class="cmd-modal-field">
            <label>* Serial</label>
            <input type="text" class="cmd-modal-input" value="38:3F:B3:97:5C:1B" readonly />
          </div>

          <div class="cmd-modal-field">
            <label>* Id Inventario</label>
            <input type="text" class="cmd-modal-input" value="93311928" readonly />
          </div>
        </div>

        <div class="cmd-modal-footer">
          <button type="button" class="cmd-btn-cancel" @click="modalNivelesOpen = false">
            Cancelar
          </button>
          <button
            type="button"
            class="cmd-btn-execute"
            :class="{ 'btn-highlight': currentStep === 9 }"
            @click="confirmarEjecucionNiveles"
          >
            Ejecutar
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL POPUP: CAMBIAR SERVICIO (BROWNFIELD Páginas 58 a 61) -->
    <div v-if="modalCambiarServicioOpen" class="cmd-modal-backdrop" @click="modalCambiarServicioOpen = false">
      <div class="cmd-modal-dialog" @click.stop style="max-width:440px;">
        <div class="cmd-modal-header">
          <span class="cmd-modal-title">Cambiar Servicio</span>
          <button type="button" class="cmd-modal-close" @click="modalCambiarServicioOpen = false">✕</button>
        </div>

        <div class="cmd-modal-body">
          <p style="font-size:0.82rem;color:#424242;margin-bottom:10px;">
            Seleccione el servicio destino al que migrará el decodificador reutilizado:
          </p>

          <div
            style="border:1.5px solid #0288d1;border-radius:4px;padding:10px 12px;background:#e1f5fe;display:flex;align-items:center;gap:10px;cursor:pointer;"
          >
            <input type="radio" checked name="target-servicio" />
            <div>
              <div style="font-size:0.88rem;font-weight:700;color:#01579b;">Id Corto: 1</div>
              <div style="font-size:0.8rem;color:#0277bd;">TV IP DIG PL;WIN+ (PRINCIPAL)</div>
            </div>
          </div>
        </div>

        <div class="cmd-modal-footer">
          <button type="button" class="cmd-btn-cancel" @click="modalCambiarServicioOpen = false">
            Cancelar
          </button>
          <button
            type="button"
            class="cmd-btn-execute"
            :class="{ 'btn-highlight': isBrownfield && state.brownfieldProgress?.iniciado && !state.brownfieldProgress?.reutilizacionComandoEjecutado }"
            @click="confirmarCambiarServicio"
          >
            Ejecutar
          </button>
        </div>
      </div>
    </div>

    <!-- PISTAS FLOTANTES -->
    <!-- Flujo Brownfield (Comando Cambiar Servicio) -->
    <template v-if="isBrownfield && state.brownfieldProgress?.iniciado">
      <FlowHintBox
        v-if="!state.brownfieldProgress?.reutilizacionComandoEjecutado && !modalCambiarServicioOpen"
        step="5"
      >
        Despliega el selector de <strong>Acción</strong> y selecciona la opción <strong>Cambiar servicio</strong>.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="modalCambiarServicioOpen"
        step="5"
      >
        Verifica la selección del servicio destino con <strong>Id Corto: 1</strong> y haz clic sobre el botón <strong>Ejecutar</strong>.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="state.brownfieldProgress?.reutilizacionComandoEjecutado"
        step="5"
      >
        ✓ ¡Comando CAMBIAR_SERVICIO ejecutado exitosamente! Presiona la flecha atrás en la barra superior para volver al inventario.
      </FlowHintBox>
    </template>

    <!-- Flujo Estándar HFC (Niveles SoftClose) -->
    <template v-else-if="!isBrownfield && state.softCloseProgress?.iniciado">
      <!-- Paso 8 (SotfClose.pdf Pág 8) -->
      <FlowHintBox
        v-if="currentStep === 8 && !modalNivelesOpen"
        step="8"
      >
        Enseguida, selecciona la opción <strong>Niveles</strong>.
      </FlowHintBox>

      <!-- Paso 9 (SotfClose.pdf Pág 9) -->
      <FlowHintBox
        v-else-if="currentStep === 9 || modalNivelesOpen"
        step="9"
      >
        En la previsualización, haz clic sobre la opción <strong>Ejecutar</strong>.
      </FlowHintBox>

      <!-- Paso 10 (SotfClose.pdf Pág 11) -->
      <FlowHintBox
        v-else-if="currentStep === 10"
        step="10"
      >
        En la sección <strong>Niveles</strong>, verifica que la columna <strong>Evaluación nivel</strong> esté OK y presiona la flecha para volver a la pantalla anterior.
      </FlowHintBox>
    </template>
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
  advanceSoftCloseStep,
  ejecutarComandoCambiarServicio
} = useSimulator();

const isBrownfield = computed(() => state.currentActivity?.subtipo === 'BROWNFIELD' || state.currentActivity?.isBrownfield === true);

const selectedAction = ref(
  isBrownfield.value
    ? (state.brownfieldProgress?.reutilizacionComandoEjecutado ? 'Cambiar' : '')
    : (state.softCloseProgress?.nivelesEjecutados ? 'Niveles' : '')
);
const modalNivelesOpen = ref(false);
const modalCambiarServicioOpen = ref(false);

const currentStep = computed(() => state.softCloseProgress?.currentStep || 0);

const handleActionChange = () => {
  if (selectedAction.value === 'Niveles') {
    modalNivelesOpen.value = true;
    advanceSoftCloseStep(9);
  } else if (selectedAction.value === 'Cambiar') {
    modalCambiarServicioOpen.value = true;
  } else {
    showToast(`Comando "${selectedAction.value}" disponible.`);
  }
};

const confirmarEjecucionNiveles = () => {
  modalNivelesOpen.value = false;
  state.softCloseProgress.nivelesEjecutados = true;
  advanceSoftCloseStep(10);
  showToast('Comando NIVELES aplicado correctamente.', 'success');
};

const confirmarCambiarServicio = () => {
  modalCambiarServicioOpen.value = false;
  ejecutarComandoCambiarServicio(1);
  showToast('Ejecución de Comando: CAMBIAR_SERVICIO exitoso', 'success');
};

const handleBack = () => {
  if (!isBrownfield.value && state.softCloseProgress?.nivelesEjecutados) {
    advanceSoftCloseStep(11);
  }
  showScreen('/inventario-detalle');
};
</script>

<style scoped>
.cmd-green-banner {
  background: #388e3c;
  color: #000;
  font-weight: 800;
  font-size: 0.95rem;
  padding: 8px 12px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.5px;
}

.cmd-warn-icon {
  font-size: 1.1rem;
}

.cmd-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: #cfd8dc;
  margin-top: 6px;
}

.cmd-meta-label {
  color: #90a4ae;
}

.btn-refresh-icon {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #ffffff;
}

.cmd-section-bar {
  background: #2e7d32;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.86rem;
  padding: 6px 10px;
  margin-top: 8px;
  border-radius: 2px;
  letter-spacing: 0.3px;
}

.cmd-equipment-details {
  background: #1e1e1e;
  border: 1px solid #333;
  padding: 8px 10px;
}

.cmd-eq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 10px;
  font-size: 0.76rem;
  color: #eceff1;
}

.cmd-bold {
  font-weight: 700;
  color: #fff;
}

.cmd-tabs-bar {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.cmd-tab {
  background: #263238;
  color: #90a4ae;
  border: 1px solid #37474f;
  padding: 6px 12px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 3px 3px 0 0;
}

.cmd-tab.active {
  background: #0277bd;
  color: #ffffff;
  border-color: #0277bd;
}

.cmd-table {
  width: 100%;
  border-collapse: collapse;
  background: #1e1e1e;
  border: 1px solid #333;
  font-size: 0.75rem;
}

.cmd-table th {
  background: #262626;
  color: #b0bec5;
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid #333;
  font-weight: 600;
}

.cmd-action-box {
  margin-top: 14px;
}

.cmd-action-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
  text-align: center;
}

.cmd-select-control {
  width: 100%;
  background: #0277bd;
  color: #ffffff;
  border: 1px solid #01579b;
  border-radius: 4px;
  padding: 9px 12px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
}

.cmd-select-control.select-target {
  background: #9945cc !important;
  border: 1.5px solid #ba74e6 !important;
  box-shadow: 0 0 10px rgba(186, 116, 230, 0.4);
}

.cmd-levels-table {
  width: 100%;
  border-collapse: collapse;
  background: #1e1e1e;
  border: 1px solid #333;
  font-size: 0.8rem;
  margin-top: 4px;
}

.cmd-levels-table th, .cmd-levels-table td {
  padding: 6px 10px;
  border: 1px solid #333;
  text-align: center;
}

.cmd-levels-table th {
  background: #262626;
  color: #cfd8dc;
  font-weight: 700;
}

.cmd-levels-table td {
  color: #ffffff;
}

.eval-ok {
  color: #81c784 !important;
  font-weight: 700;
}

.cmd-action-log {
  background: #1e1e1e;
  border: 1px solid #333;
  padding: 8px 12px;
  margin-top: 4px;
  font-size: 0.78rem;
}

.cmd-log-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #282828;
}

.cmd-log-label {
  color: #90a4ae;
}

.cmd-log-val {
  color: #ffffff;
  font-weight: 600;
}

.ok-check {
  color: #81c784;
  font-size: 1.05rem;
}

/* Modal Popup Label Niveles */
.cmd-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.cmd-modal-dialog {
  background: #ffffff;
  color: #212121;
  border-radius: 6px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  animation: modalScaleUp 0.15s ease-out;
}

@keyframes modalScaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.cmd-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #e0e0e0;
}

.cmd-modal-title {
  font-size: 1rem;
  font-weight: 800;
  color: #212121;
}

.cmd-modal-close {
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  cursor: pointer;
}

.cmd-modal-body {
  padding: 14px;
}

.cmd-modal-field {
  margin-bottom: 12px;
}

.cmd-modal-field label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #424242;
  margin-bottom: 4px;
}

.cmd-modal-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  background: #f5f5f5;
  color: #212121;
  font-size: 0.88rem;
}

.cmd-modal-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px 14px 14px;
}

.cmd-btn-cancel {
  width: 100%;
  padding: 9px;
  background: #e0e0e0;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-weight: 700;
  color: #424242;
  cursor: pointer;
}

.cmd-btn-execute {
  width: 100%;
  padding: 9px;
  background: #cfd8dc;
  border: 1px solid #b0bec5;
  border-radius: 4px;
  font-weight: 800;
  color: #263238;
  cursor: pointer;
}

.btn-highlight {
  background: #ba74e6 !important;
  color: #ffffff !important;
  border-color: #9945cc !important;
  animation: pulseButton 1.5s infinite;
}

@keyframes pulseButton {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
</style>
