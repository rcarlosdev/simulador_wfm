<template>
  <div class="simulator-screen screen-inventario screen-active" id="screen-inventario">
    <!-- OFSC App Bar Roja -->
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" title="Volver" @click="showScreen('/activity')">
        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <span class="app-bar-title">Lista de inventarios</span>
      <div class="app-bar-actions">
        <button type="button" class="app-bar-btn" title="Buscar" @click="showToast('Búsqueda en inventarios')">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
    </div>

    <!-- Lista de Inventarios Estilo OFSC -->
    <div class="screen-scroll-body" style="padding: 12px 14px 180px 14px;">
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
    </div>

    <!-- Pista del Paso 4 (SotfClose.pdf Pág 3) -->
    <FlowHintBox
      v-if="state.softCloseProgress?.iniciado && state.softCloseProgress?.currentStep === 4"
      step="4"
    >
      Valida que los servicios presenten estado <strong>OK</strong>. Luego presiona la opción <strong>MTA</strong>.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const { state, showScreen, advanceSoftCloseStep } = useSimulator();

onMounted(() => {
  if (state.softCloseProgress?.iniciado && (!state.softCloseProgress.currentStep || state.softCloseProgress.currentStep < 4)) {
    advanceSoftCloseStep(4);
  }
});

const seleccionarMTA = () => {
  state.softCloseProgress.iniciado = true;
  state.softCloseProgress.mtaSelected = true;
  advanceSoftCloseStep(6);
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
