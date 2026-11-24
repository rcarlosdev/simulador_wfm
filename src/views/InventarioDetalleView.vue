<template>
  <div class="simulator-screen screen-inventario-detalle screen-active">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="handleBack">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div style="display:flex; flex-direction:column; overflow:hidden;">
        <span class="app-bar-title" style="line-height: 1.2;">Detalle de inventario</span>
        <span v-if="isBrownfield" style="font-size: 0.68rem; color: #ffcdd2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ITV - N2P - NL 6105RC - 254889543645 - {{ state.brownfieldProgress?.reutilizacionComandoEjecutado ? 'Ok, Tiempo (seg): 20.' : 'Cliente' }}
        </span>
        <span v-else style="font-size: 0.68rem; color: #ffcdd2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          MTA - CG1 - CGA0112 - 38:3F:B3:97:5C:1B - Ok,Tiempo (seg): 49,
        </span>
      </div>
      <div class="app-bar-actions">
        <button
          type="button"
          class="app-bar-btn btn-dots"
          :class="{ 'btn-highlight': isBrownfield ? (state.brownfieldProgress?.iniciado && !state.brownfieldProgress?.reutilizacionComandoEjecutado) : (state.softCloseProgress?.iniciado && (currentStep === 6 || currentStep === 11)) }"
          title="Menú de opciones"
          @click="toggleMenu"
        >
          <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>
    </div>

    <!-- Menú Contextual Desplegable de Tres Puntos -->
    <div v-if="menuOpen" class="inv-dropdown-menu" @click.stop>
      <div
        class="inv-dropdown-item"
        :class="{ 'item-target': !isBrownfield && state.softCloseProgress?.iniciado && currentStep === 12 }"
        @click="irAAcciones"
      >
        Acciones
      </div>
      <div class="inv-dropdown-item" @click="mostrarHistorial">
        Historial
      </div>
      <div
        class="inv-dropdown-item"
        :class="{ 'item-target': isBrownfield ? (state.brownfieldProgress?.iniciado && !state.brownfieldProgress?.reutilizacionComandoEjecutado) : (state.softCloseProgress?.iniciado && currentStep === 6) }"
        @click="irAComandos"
      >
        Comandos Activacion
      </div>
    </div>

    <!-- Contenido Scrollable con Metadatos del Equipo -->
    <div class="screen-scroll-body" style="padding: 14px 16px 180px 16px;" @click="menuOpen = false">

      <!-- Metadatos de Equipo en Brownfield (Reutilización Cliente) -->
      <template v-if="isBrownfield">
        <div class="inv-field-group">
          <div class="inv-field-label">Agrupación de inventarios</div>
          <div class="inv-field-value">cliente</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Tipo Inventario</div>
          <div class="inv-field-value">NEWLAND NL 6105RC</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Tipo Inventario</div>
          <div class="inv-field-value">ITV</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Serial</div>
          <div class="inv-field-value">254889543645</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Modelo</div>
          <div class="inv-field-value">NL 6105RC</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Fabricante</div>
          <div class="inv-field-value">N2P</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">MAC Address</div>
          <div class="inv-field-value">A8:F4:70:C2:84:89</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Id Corto del servicio</div>
          <div class="inv-field-value">{{ state.brownfieldProgress?.reutilizacionComandoEjecutado ? 1 : 2 }}</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Descripcion Servicio</div>
          <div class="inv-field-value">{{ state.brownfieldProgress?.reutilizacionComandoEjecutado ? '1 - TV IP DIG PL;WIN+' : '2 - ARR DECO ADI;TV IP DIG PL' }}</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Estado Actual</div>
          <div class="inv-field-value" :style="{ color: state.brownfieldProgress?.reutilizacionComandoEjecutado ? '#81c784' : '#ffb74d' }">
            {{ state.brownfieldProgress?.reutilizacionComandoEjecutado ? 'EXITOSO - Asociado' : 'Cliente (Reutilizable)' }}
          </div>
        </div>
      </template>

      <!-- Metadatos de Equipo Estándar (MTA) -->
      <template v-else>
        <div class="inv-field-group">
          <div class="inv-field-label">Agrupación de inventarios</div>
          <div class="inv-field-value">instalado</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Tipo Inventario</div>
          <div class="inv-field-value">TECHNICOLOR CGA0112</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Tipo Inventario</div>
          <div class="inv-field-value">MTA</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Serial</div>
          <div class="inv-field-value">38:3F:B3:97:5C:1B</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Modelo</div>
          <div class="inv-field-value">CGA0112</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Fabricante</div>
          <div class="inv-field-value">CG1</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">MAC Address</div>
          <div class="inv-field-value">38:3F:B3:97:5C:1C</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Id Corto del servicio</div>
          <div class="inv-field-value">3</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Descripcion Servicio</div>
          <div class="inv-field-value">INT 5+95 MB;MODEM WIFI;TELEFONIA</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Estado Actual</div>
          <div class="inv-field-value">Instalado</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Fuente</div>
          <div class="inv-field-value">FUENTE 12V 2500MA 2.5X5.5X9.5MM</div>
        </div>

        <div class="inv-field-group">
          <div class="inv-field-label">Puerto 1</div>
          <div class="inv-field-value">+576019353116</div>
        </div>
      </template>

      <!-- SECCIÓN TRAS VALIDAR NIVELES MTA (Páginas 19 y 20 - Paso 16) -->
      <div v-if="state.softCloseProgress?.mtaNivelesValidados" class="tech-params-section">
        <div class="tech-section-title">Ubicación</div>
        <div class="inv-field-group">
          <div class="inv-field-label">Torre</div>
          <div class="inv-field-value">NO APLICA</div>
        </div>
        <div class="inv-field-group">
          <div class="inv-field-label">Piso</div>
          <div class="inv-field-value">NO APLICA</div>
        </div>
        <div class="inv-field-group">
          <div class="inv-field-label">Habitación</div>
          <div class="inv-field-value">Alcoba Principal</div>
        </div>

        <div class="tech-section-title" style="margin-top: 18px; color: #ffcdd2;">
          Parámetros Técnicos
        </div>

        <div class="tech-param-card" :class="{ 'card-target': state.softCloseProgress?.iniciado && currentStep === 16 }">
          <div class="tech-param-header">
            <span class="tech-param-name">RX</span>
            <span class="tech-param-val">-1.7 dBm</span>
          </div>
          <div class="tech-param-optimo">Valor optimo RX entre -5 dBm y +10 dBm</div>

          <div class="tech-param-header" style="margin-top: 10px;">
            <span class="tech-param-name">TX</span>
            <span class="tech-param-val">41.5 dBmV</span>
          </div>
          <div class="tech-param-optimo">Valor optimo TX entre +40 dBm y +49 dBm</div>

          <div class="tech-param-header" style="margin-top: 10px;">
            <span class="tech-param-name">SNR DOWN</span>
            <span class="tech-param-val">40.5 dB</span>
          </div>
          <div class="tech-param-optimo">Valor optimo SNR DOWN > 30 dB</div>

          <div class="tech-param-header" style="margin-top: 10px;">
            <span class="tech-param-name">SNR UP</span>
            <span class="tech-param-val">32.1 dB</span>
          </div>
          <div class="tech-param-optimo">Valor optimo SNR UP > 30 dB</div>
        </div>

        <button
          type="button"
          class="btn-ofs-primary"
          style="margin-top: 16px; width: 100%;"
          @click="irAListaActividades"
        >
          Continuar a Lista de Actividades
        </button>
      </div>
    </div>

    <!-- Pistas Flotantes según el Paso -->
    <!-- Flujo Brownfield (Reutilización de equipo cliente) -->
    <template v-if="isBrownfield && state.brownfieldProgress?.iniciado">
      <FlowHintBox
        v-if="!menuOpen && !state.brownfieldProgress?.reutilizacionComandoEjecutado"
        step="5"
      >
        Despliega el menú a través de los tres puntos (...) ubicados en la parte superior derecha y selecciona <strong>Comandos Activacion</strong>.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="menuOpen && !state.brownfieldProgress?.reutilizacionComandoEjecutado"
        step="5"
      >
        Allí selecciona la opción <strong>Comandos Activacion</strong> para abrir el portal de comandos.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="state.brownfieldProgress?.reutilizacionComandoEjecutado"
        step="6"
      >
        ✓ Decodificador reutilizado exitosamente con Id Corto 1. Presiona la flecha atrás para volver al inventario.
      </FlowHintBox>
    </template>

    <!-- Flujo Estándar HFC (SoftClose) -->
    <template v-else-if="!isBrownfield && state.softCloseProgress?.iniciado">
      <!-- Paso 6 (SotfClose.pdf Pág 5) -->
      <FlowHintBox
        v-if="currentStep === 6 && !menuOpen"
        step="6"
      >
        Despliega el menú a través de los tres puntos ubicados en la parte superior derecha y selecciona <strong>Comandos activación</strong>.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="currentStep === 6 && menuOpen"
        step="6"
      >
        Allí selecciona la opción <strong>Comandos activación</strong>.
      </FlowHintBox>

      <!-- Paso 11 (SotfClose.pdf Pág 12) -->
      <FlowHintBox
        v-else-if="currentStep === 11 && !menuOpen"
        step="11"
      >
        En la pantalla <strong>Detalle de inventario</strong>, despliega de nuevo el menú a través de los tres puntos ubicados en la parte superior derecha.
      </FlowHintBox>

      <!-- Paso 12 (SotfClose.pdf Pág 13) -->
      <FlowHintBox
        v-else-if="(currentStep === 11 || currentStep === 12) && menuOpen"
        step="12"
      >
        Allí selecciona la opción <strong>Acciones</strong>.
      </FlowHintBox>

      <!-- Paso 16 (SotfClose.pdf Pág 20) -->
      <FlowHintBox
        v-else-if="currentStep === 16"
        step="16"
      >
        En la sección <strong>Parámetros técnicos</strong>, valida que los niveles sean óptimos.
      </FlowHintBox>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const { state, showScreen, showToast, advanceSoftCloseStep } = useSimulator();

const menuOpen = ref(false);
const isBrownfield = computed(() => state.currentActivity?.subtipo === 'BROWNFIELD' || state.currentActivity?.isBrownfield === true);
const currentStep = computed(() => state.softCloseProgress?.currentStep || 0);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value && currentStep.value === 11) {
    advanceSoftCloseStep(12);
  }
};

const handleBack = () => {
  showScreen('/inventario');
};

const irAComandos = () => {
  menuOpen.value = false;
  advanceSoftCloseStep(8);
  showScreen('/comandos-act');
};

const irAAcciones = () => {
  menuOpen.value = false;
  advanceSoftCloseStep(13);
  showScreen('/inventario-acciones');
};

const mostrarHistorial = () => {
  menuOpen.value = false;
  showToast('Historial de cambios: Equipo asociado correctamente.', 'info');
};

const irAListaActividades = () => {
  advanceSoftCloseStep(17);
  showScreen('/activities');
};
</script>

<style scoped>
.btn-highlight {
  background: rgba(255, 255, 255, 0.25) !important;
  border-radius: 50%;
  animation: pulseHighlight 1.5s infinite;
}

@keyframes pulseHighlight {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

.inv-dropdown-menu {
  position: absolute;
  top: 56px;
  right: 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.7);
  z-index: 100;
  min-width: 190px;
  overflow: hidden;
  animation: menuFadeIn 0.15s ease-out;
}

@keyframes menuFadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.inv-dropdown-item {
  padding: 12px 16px;
  font-size: 0.88rem;
  color: #f5f5f5;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.15s ease;
}

.inv-dropdown-item:last-child {
  border-bottom: none;
}

.inv-dropdown-item:hover {
  background: #383838;
}

.inv-dropdown-item.item-target {
  background: rgba(198, 40, 40, 0.3) !important;
  color: #ffcdd2;
  font-weight: 700;
  border-left: 3px solid #e53935;
}

.inv-field-group {
  margin-bottom: 12px;
}

.inv-field-label {
  font-size: 0.76rem;
  color: #9e9e9e;
  margin-bottom: 2px;
}

.inv-field-value {
  font-size: 0.88rem;
  font-weight: 600;
  color: #ffffff;
  word-break: break-word;
}

.tech-params-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #333;
}

.tech-section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.tech-param-card {
  background: #1e1e1e;
  border: 1px solid #3d3d3d;
  border-radius: 6px;
  padding: 12px 14px;
  margin-top: 8px;
}

.tech-param-card.card-target {
  background: rgba(198, 40, 40, 0.15);
  border: 1.5px solid #ef5350;
  box-shadow: 0 0 12px rgba(239, 83, 80, 0.3);
}

.tech-param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tech-param-name {
  font-size: 0.86rem;
  font-weight: 700;
  color: #ffffff;
}

.tech-param-val {
  font-size: 0.88rem;
  font-weight: 700;
  color: #81c784;
}

.tech-param-optimo {
  font-size: 0.72rem;
  color: #9e9e9e;
  margin-top: 2px;
}
</style>
