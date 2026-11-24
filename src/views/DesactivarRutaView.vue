<template>
  <div class="simulator-screen screen-desactivar-ruta screen-active" id="screen-desactivar-ruta">
    <!-- OFSC Barra Superior Roja Oficial -->
    <div class="ofsc-header-bar" style="background:#cc0000;border-bottom:none;">
      <div class="ofsc-header-left">
        <button type="button" class="btn-header-back" @click="handleBack" title="Atrás">
          ↑
        </button>
      </div>
      <div class="ofsc-header-title" style="color:#ffffff;font-size:1.05rem;font-weight:600;">
        Desactivar ruta de trabajo
      </div>
      <div class="ofsc-header-right">
        <span class="ofsc-header-time" style="color:#ffffff;">{{ state.clockTime }}</span>
      </div>
    </div>

    <!-- Franja Subrayado Oficial -->
    <div style="height:3px;background:var(--ofs-primary, #ba74e6);width:100%;"></div>

    <!-- Contenido Central Oficial (Página 10 del PDF) -->
    <div class="screen-scroll-body" style="padding:40px 24px 180px 24px;background:#ffffff;color:#222222;min-height:100%;">

      <div v-if="!cierreState.rutaDesactivada" class="desactivar-confirm-box">
        <div class="desactivar-question">
          ¿Desactivar ruta ya?
        </div>

        <div class="desactivar-btn-row">
          <button type="button" class="btn-desact-cancelar" @click="handleBack">
            Cancelar
          </button>
          <button type="button" class="btn-desact-ok" @click="confirmDesactivar">
            OK
          </button>
        </div>
      </div>

      <!-- Pantalla Final de Jornada Concluida Exitosamente -->
      <div v-else class="jornada-concluida-box">
        <div class="jornada-check-icon">✓</div>
        <div class="jornada-title">Ruta de Trabajo Desactivada</div>
        <div class="jornada-desc">
          Has completado todas las actividades programadas en tu ruta de hoy y la jornada técnica ha sido cerrada oficialmente en OFSC.
        </div>

        <div class="jornada-summary-card">
          <div class="sum-row"><span>Estado Ruta:</span> <strong style="color:#2e7d32;">Desactivada</strong></div>
          <div class="sum-row"><span>Órdenes Completadas:</span> <strong>100%</strong></div>
          <div class="sum-row"><span>Almacén & Inventarios:</span> <strong>Conciliados</strong></div>
          <div class="sum-row"><span>Hora de Cierre:</span> <strong>{{ state.clockTime }}</strong></div>
        </div>

        <div style="margin-top:24px;text-align:center;">
          <button type="button" class="btn-desact-ok" style="padding:10px 28px;" @click="irAInicio">
            Regresar al Inicio
          </button>
        </div>
      </div>

    </div>

    <!-- PISTA FLOTANTE INFORMATIVA -->
    <FlowHintBox
      v-if="!cierreState.rutaDesactivada"
      step="6"
      title="Paso 6 - Desactivar Ruta"
    >
      Pulsa <strong>OK</strong> para confirmar la desactivación de tu ruta de trabajo y concluir la jornada laboral en OFSC.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';
import { useCierreFlow } from '../flows/cierre/useCierreFlow';
import FlowHintBox from '../components/FlowHintBox.vue';

const { state, showScreen, showToast } = useSimulator();
const { cierreState, desactivarRutaTrabajo } = useCierreFlow();

const handleBack = () => {
  showScreen('/activities');
};

const confirmDesactivar = () => {
  desactivarRutaTrabajo(() => {
    showToast('Jornada finalizada exitosamente.', 'success');
  });
};

const irAInicio = () => {
  showScreen('/activities');
};
</script>

<style scoped>
.screen-desactivar-ruta {
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

.desactivar-confirm-box {
  margin-top: 20px;
}

.desactivar-question {
  font-size: 1rem;
  color: #444444;
  margin-bottom: 28px;
  line-height: 1.4;
}

.desactivar-btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-desact-cancelar {
  background: #ffffff;
  border: 1px solid #b0bec5;
  color: #455a64;
  padding: 8px 22px;
  border-radius: 4px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-desact-ok {
  background: #0288d1;
  border: 1px solid #0277bd;
  color: #ffffff;
  padding: 8px 30px;
  border-radius: 4px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.btn-desact-ok:hover {
  background: #0277bd;
}

.jornada-concluida-box {
  text-align: center;
  padding: 20px 10px;
}

.jornada-check-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 2.2rem;
  font-weight: 700;
  border-radius: 50%;
  margin-bottom: 14px;
}

.jornada-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #212121;
  margin-bottom: 8px;
}

.jornada-desc {
  font-size: 0.82rem;
  color: #555555;
  line-height: 1.45;
  margin-bottom: 18px;
}

.jornada-summary-card {
  background: #f7f9fa;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  padding: 14px;
  text-align: left;
  max-width: 340px;
  margin: 0 auto;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #455a64;
  padding: 4px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.sum-row:last-child {
  border-bottom: none;
}
</style>
