<template>
  <div class="simulator-screen screen-inventario screen-active" id="screen-inventario">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="showScreen('/activity')">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Lista de inventarios</span>
      <div class="app-bar-actions">
        <button
          type="button"
          class="app-bar-btn btn-refresh-inv"
          :class="{ 'btn-highlight': isBrownfield && state.brownfieldProgress?.ontInstalada && !state.brownfieldProgress?.desinstalacionAutomaticaVerificada }"
          title="Actualizar inventarios"
          @click="refrescarInventarios"
        >
          <span :class="{ 'spin-anim': isRefreshing }">🔄</span>
        </button>
        <button type="button" class="app-bar-btn" title="Buscar" @click="showToast('Búsqueda en inventarios')">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
    </div>

    <!-- Lista de Inventarios Estilo OFSC -->
    <div class="screen-scroll-body" style="padding: 12px 14px 180px 14px;">

      <!-- ====================================================================
           MODALIDAD BROWNFIELD (MIGRACIÓN FTTH CON REUTILIZACIÓN)
           ==================================================================== -->
      <template v-if="isBrownfield">
        <!-- Grupo: Instalado -->
        <div class="inv-group-header">
          <span class="inv-icon-checked">✔</span>
          <span class="inv-group-title">Instalado</span>
          <span class="inv-group-count">{{ brownfieldEquiposInstaladosCount }}</span>
        </div>

        <div v-if="brownfieldEquiposInstaladosCount === 0" style="font-size:0.8rem;color:#888;padding:8px 4px;font-style:italic;">
          No hay equipos instalados todavía. Diríjase a Activacion Servicios e instale la ONT de Internet primero.
        </div>

        <!-- ONT Instalada -->
        <div v-if="state.brownfieldProgress?.ontInstalada" class="inv-item-card">
          <div class="inv-item-content">
            <div class="inv-item-name" style="font-weight:700;">CPE FZG F680</div>
            <div class="inv-item-codes">
              <span style="color:#fff;font-weight:600;">C0:94:AD:45:B2:98</span>
              <span>ZT:EG:CE:85:EF:69</span>
              <span class="inv-item-status ok">Ok, Tiempo (seg): 80.</span>
            </div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <!-- TV Deco Nuevo Instalado -->
        <div v-if="state.brownfieldProgress?.tvInstalada" class="inv-item-card">
          <div class="inv-item-content">
            <div class="inv-item-name" style="font-weight:700;">ITV JIP DTC9432</div>
            <div class="inv-item-codes">
              <span style="color:#fff;font-weight:600;">230619887780</span>
              <span class="code-danger">23061988778V</span>
              <span class="inv-item-status ok">Ok, Tiempo (seg): 45.</span>
            </div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <!-- UltraWiFi Mesh Instalado -->
        <div v-if="state.brownfieldProgress?.ultraWifiInstalado" class="inv-item-card">
          <div class="inv-item-content">
            <div class="inv-item-name" style="font-weight:700;">CPE FHS MESHFRSR120C</div>
            <div class="inv-item-codes">
              <span style="color:#fff;font-weight:600;">695DDE8910F48BD5</span>
              <span class="inv-item-status ok">Ok, Tiempo (seg): 35.</span>
            </div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <!-- Grupo: Desinstalado 5 (Desinstalación Automática por Migración) -->
        <div v-if="state.brownfieldProgress?.ontInstalada" class="inv-group-header" style="margin-top: 22px;">
          <span class="inv-icon-checked" style="background:#2e7d32;">✔</span>
          <span class="inv-group-title">Desinstalado</span>
          <span class="inv-group-count">5</span>
        </div>

        <template v-if="state.brownfieldProgress?.ontInstalada">
          <div class="inv-item-card">
            <div class="inv-item-content">
              <div class="inv-item-name">DBV OVI 7</div>
              <div class="inv-item-codes">
                <span>254871673753</span>
                <span class="inv-item-status ok">Ok - Desinstalado Cliente si</span>
              </div>
            </div>
            <div class="inv-qty">1</div>
          </div>

          <div class="inv-item-card">
            <div class="inv-item-content">
              <div class="inv-item-name">DBV NL3 8</div>
              <div class="inv-item-codes">
                <span>254871678602</span>
                <span class="inv-item-status ok">Ok - Desinstalado Cliente si</span>
              </div>
            </div>
            <div class="inv-qty">1</div>
          </div>

          <div class="inv-item-card">
            <div class="inv-item-content">
              <div class="inv-item-name">MTA RTA 9</div>
              <div class="inv-item-codes">
                <span>38:3F:B3:97:5C:1B</span>
                <span class="inv-item-status ok">Ok - Desinstalado Cliente si</span>
              </div>
            </div>
            <div class="inv-qty">1</div>
          </div>

          <div class="inv-item-card">
            <div class="inv-item-content">
              <div class="inv-item-name">CAR NGR NGR</div>
              <div class="inv-item-codes">
                <span>25487167375V</span>
                <span class="inv-item-status ok">Ok - Desinstalado Cliente si</span>
              </div>
            </div>
            <div class="inv-qty">1</div>
          </div>

          <div class="inv-item-card">
            <div class="inv-item-content">
              <div class="inv-item-name">CAR NGR NGR</div>
              <div class="inv-item-codes">
                <span>25487167860V</span>
                <span class="inv-item-status ok">Ok - Desinstalado Cliente si</span>
              </div>
            </div>
            <div class="inv-qty">1</div>
          </div>
        </template>

        <!-- Grupo: Cliente 2 (Equipo a Reutilizar con Comando) -->
        <div class="inv-group-header" style="margin-top: 22px;">
          <span class="inv-icon-checked" :style="{ background: state.brownfieldProgress?.reutilizacionComandoEjecutado ? '#2e7d32' : '#f57c00' }">
            {{ state.brownfieldProgress?.reutilizacionComandoEjecutado ? '✔' : '👤' }}
          </span>
          <span class="inv-group-title">Cliente</span>
          <span class="inv-group-count">2</span>
        </div>

        <div
          class="inv-item-card inv-item-clickable"
          :class="{ 'inv-highlight-target': state.brownfieldProgress?.ultraWifiInstalado && !state.brownfieldProgress?.reutilizacionComandoEjecutado }"
          @click="seleccionarEquipoClienteBrownfield"
        >
          <div class="inv-item-content">
            <div class="inv-item-name" style="font-weight:700;">ITV N2P 6 · NL 6105RC (Reutilizable)</div>
            <div class="inv-item-codes">
              <span style="color:#fff;font-weight:600;">254889543645</span>
              <span>A8:F4:70:C2:84:89</span>
              <span v-if="state.brownfieldProgress?.reutilizacionComandoEjecutado" class="inv-item-status ok">
                ✔ Ok, Tiempo (seg): 20. (Id Corto: 1)
              </span>
              <span v-else class="inv-item-status" style="color:#ffb74d;font-weight:600;">
                ⚠ Pendiente: Ejecutar comando "Cambiar servicio"
              </span>
            </div>
          </div>
          <div class="inv-qty">1</div>
        </div>
      </template>

      <!-- ====================================================================
           MODALIDAD ESTÁNDAR HFC / DTH (ORIGINAL)
           ==================================================================== -->
      <template v-else>
        <!-- Grupo: Instalado 5 -->
        <div class="inv-group-header">
          <span class="inv-icon-checked">✔</span>
          <span class="inv-group-title">Instalado</span>
          <span class="inv-group-count">5</span>
        </div>

        <!-- Subgrupo DECO HD -->
        <div class="inv-subgroup-title">
          <span class="inv-arrow">◢</span> DECO HD NEWLAND NL-6105RB &nbsp;<span class="inv-badge">2</span>
        </div>

        <div class="inv-item-card">
          <div class="inv-item-content">
            <div class="inv-item-name">ITV NIP NL-6105RB</div>
            <div class="inv-item-codes">
              <span>254871673753</span> <span class="code-danger">25487167375V</span>
            </div>
            <div class="inv-item-status ok">Ok, Tiempo (seg): 25,</div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <div class="inv-item-card">
          <div class="inv-item-content">
            <div class="inv-item-name">ITV NIP NL-6105RB</div>
            <div class="inv-item-codes">
              <span>254871678602</span> <span class="code-danger">25487167860V</span>
            </div>
            <div class="inv-item-status ok">Ok, Tiempo (seg): 25,</div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <!-- Subgrupo Tarjeta NAGRA -->
        <div class="inv-subgroup-title" style="margin-top: 14px;">
          <span class="inv-arrow">◢</span> Tarjeta NAGRA &nbsp;<span class="inv-badge">2</span>
        </div>

        <div class="inv-item-card">
          <div class="inv-item-content">
            <div class="inv-item-name">CAR NGR NGR 25487167375V</div>
            <div class="inv-item-codes">
              <span class="code-danger">254871673753</span> <span class="inv-item-status ok" style="display:inline;">Ok, Tiempo (seg): 25,</span>
            </div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <div class="inv-item-card">
          <div class="inv-item-content">
            <div class="inv-item-name">CAR NGR NGR 25487167860V</div>
            <div class="inv-item-codes">
              <span class="code-danger">254871678602</span> <span class="inv-item-status ok" style="display:inline;">Ok, Tiempo (seg): 25,</span>
            </div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <!-- Subgrupo MTA CG1 CGA0112 (Target de Selección - Paso 4) -->
        <div
          class="inv-item-card inv-item-clickable"
          :class="{ 'inv-highlight-target': state.softCloseProgress?.iniciado && state.softCloseProgress?.currentStep === 4 }"
          @click="seleccionarMTA"
        >
          <div class="inv-item-content">
            <div class="inv-item-name" style="font-weight: 700;">MTA CG1 CGA0112</div>
            <div class="inv-item-codes">
              <span style="color: #fff; font-weight: 600;">38:3F:B3:97:5C:1B</span>
              <span class="inv-item-status ok" style="margin-left: 6px;">Ok, Tiempo (seg): 49,</span>
            </div>
          </div>
          <div class="inv-qty">1</div>
        </div>

        <!-- Grupo: Recurso 173 -->
        <div class="inv-group-header" style="margin-top: 24px;">
          <span class="inv-icon-truck">🚚</span>
          <span class="inv-group-title">Recurso</span>
          <span class="inv-group-count">173</span>
        </div>

        <div class="inv-subgroup-title">
          <span class="inv-arrow">◢</span> CPE REF &nbsp;<span class="inv-badge">2</span>
        </div>
      </template>

    </div>

    <!-- Pistas de FlowHintBox -->
    <!-- Flujo Brownfield -->
    <template v-if="isBrownfield">
      <FlowHintBox
        v-if="!state.brownfieldProgress?.ontInstalada"
        step="1"
      >
        ⚠️ <strong>Regla de Oro Brownfield:</strong> En una migración debes instalar el <strong>MTA/ONT de Internet PRIMERO</strong> en Activacion Servicios.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="state.brownfieldProgress?.ontInstalada && !state.brownfieldProgress?.desinstalacionAutomaticaVerificada"
        step="2"
      >
        Presiona el botón de <strong>actualizar inventarios (🔄)</strong> en la barra superior para reflejar la <strong>desinstalación automática</strong> de los 5 equipos viejos.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="state.brownfieldProgress?.desinstalacionAutomaticaVerificada && !state.brownfieldProgress?.tvInstalada"
        step="3"
      >
        Los 5 equipos han sido desinstalados. Ahora regresa a detalles y abre <strong>Activacion Servicios</strong> para instalar el decodificador de Televisión.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="state.brownfieldProgress?.tvInstalada && !state.brownfieldProgress?.ultraWifiInstalado"
        step="4"
      >
        Deco nuevo instalado. Ahora ingresa a <strong>Activacion Servicios</strong> para asociar el servicio adicional <strong>UltraWiFi Mesh</strong>.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="state.brownfieldProgress?.ultraWifiInstalado && !state.brownfieldProgress?.reutilizacionComandoEjecutado"
        step="5"
      >
        Para reutilizar el decodificador existente del cliente, <strong>haz clic sobre el equipo ITV N2P 6 (254889543645)</strong> en la sección Cliente.
      </FlowHintBox>

      <FlowHintBox
        v-else-if="state.brownfieldProgress?.reutilizacionComandoEjecutado"
        step="6"
      >
        ✓ ¡Migración y reutilización completadas exitosamente! Todos los servicios presentan estado OK. Ya puedes proceder al cierre de la orden.
      </FlowHintBox>
    </template>

    <!-- Flujo SoftClose Estándar (Paso 4) -->
    <FlowHintBox
      v-else-if="state.softCloseProgress?.iniciado && state.softCloseProgress?.currentStep === 4"
      step="4"
    >
      Valida que los servicios presenten estado <strong>OK</strong>. Luego presiona la opción <strong>MTA</strong>.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  showScreen,
  showToast,
  advanceSoftCloseStep,
  verificarDesinstalacionAutomatica
} = useSimulator();

const isRefreshing = ref(false);

const isBrownfield = computed(() => {
  return state.currentActivity?.subtipo === 'BROWNFIELD' || state.currentActivity?.isBrownfield === true;
});

const brownfieldEquiposInstaladosCount = computed(() => {
  let count = 0;
  if (state.brownfieldProgress?.ontInstalada) count++;
  if (state.brownfieldProgress?.tvInstalada) count++;
  if (state.brownfieldProgress?.ultraWifiInstalado) count++;
  return count;
});

onMounted(() => {
  if (!isBrownfield.value && state.softCloseProgress?.iniciado && (!state.softCloseProgress.currentStep || state.softCloseProgress.currentStep < 4)) {
    advanceSoftCloseStep(4);
  }
});

const refrescarInventarios = () => {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    if (isBrownfield.value && state.brownfieldProgress?.ontInstalada) {
      verificarDesinstalacionAutomatica();
      showToast('✓ Inventarios actualizados: Desinstalación automática procesada en OFSC.', 'success');
    } else {
      showToast('Inventarios actualizados con éxito.');
    }
  }, 400);
};

const seleccionarMTA = () => {
  state.softCloseProgress.iniciado = true;
  state.softCloseProgress.mtaSelected = true;
  advanceSoftCloseStep(6);
  showScreen('/inventario-detalle');
};

const seleccionarEquipoClienteBrownfield = () => {
  showScreen('/inventario-detalle');
};
</script>

<style scoped>
.inv-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  padding: 6px 0 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
}

.inv-icon-checked {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #0288d1;
  color: #fff;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: bold;
}

.inv-group-title {
  color: #ffffff;
}

.inv-group-count {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin-left: 4px;
}

.inv-subgroup-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #cfd8dc;
  margin: 10px 0 6px 4px;
  display: flex;
  align-items: center;
}

.inv-arrow {
  font-size: 0.65rem;
  margin-right: 4px;
  color: #90a4ae;
}

.inv-badge {
  font-size: 0.8rem;
  color: #b0bec5;
}

.inv-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e1e1e;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 9px 12px;
  margin-bottom: 6px;
  transition: all 0.2s ease;
}

.inv-item-clickable {
  cursor: pointer;
}

.inv-item-clickable:hover {
  background: #282828;
  border-color: #555555;
}

.inv-highlight-target {
  background: rgba(198, 40, 40, 0.25) !important;
  border: 1.5px solid #ef5350 !important;
  box-shadow: 0 0 10px rgba(239, 83, 80, 0.35);
}

.inv-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.inv-item-name {
  font-size: 0.84rem;
  color: #e0e0e0;
}

.inv-item-codes {
  font-size: 0.76rem;
  color: #b0bec5;
  display: flex;
  gap: 8px;
  align-items: center;
}

.code-danger {
  color: #ef9a9a;
}

.inv-item-status.ok {
  color: #81c784;
  font-size: 0.74rem;
}

.inv-qty {
  font-size: 1.1rem;
  font-weight: 600;
  color: #b0bec5;
  padding-left: 10px;
}
</style>
