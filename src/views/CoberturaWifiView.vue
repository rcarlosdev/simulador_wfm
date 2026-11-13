<template>
  <div class="simulator-screen screen-cobertura-wifi screen-active" id="screen-cobertura-wifi">
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" @click="showScreen('/activity')">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <span class="app-bar-title">Cobertura WiFi (H&B)</span>
      <div style="width:36px;"></div>
    </div>

    <div class="screen-scroll-body" style="padding:12px;">
      <div class="heatmap-canvas-container">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.75rem;font-weight:700;">
          <span>Orden: {{ state.currentActivity?.ot || '372634147' }}</span>
          <span style="color:#c61d15;">Claro • H&B</span>
        </div>

        <!-- Plano de Casa Interactivo -->
        <div class="heatmap-floor-plan">
          <div
            class="floor-room"
            style="background:rgba(76,175,80,0.2);"
            @click="testRoom('Sala Comedor', '-52 dBm (Óptimo)')"
          >
            Sala Comedor
            <div style="font-size:0.6rem;color:#81c784;margin-top:4px;">-52 dBm (Óptimo)</div>
          </div>
          <div
            class="floor-room"
            style="background:rgba(76,175,80,0.2);"
            @click="testRoom('Cocina', '-58 dBm (Óptimo)')"
          >
            Cocina
            <div style="font-size:0.6rem;color:#81c784;margin-top:4px;">-58 dBm (Óptimo)</div>
          </div>
          <div
            class="floor-room"
            style="background:rgba(255,235,59,0.18);"
            @click="testRoom('Baño', '-71 dBm (Regular)')"
          >
            Baño
            <div style="font-size:0.6rem;color:#ffd54f;margin-top:4px;">-71 dBm (Regular)</div>
          </div>
          <div
            class="floor-room"
            style="background:rgba(76,175,80,0.3);"
            @click="testRoom('Habitación Principal', '-45 dBm (Excelente)')"
          >
            Habitación Principal
            <div class="modem-point" title="Módem WiFi">📡</div>
            <div style="font-size:0.6rem;color:#81c784;margin-top:4px;">-45 dBm (Excelente)</div>
          </div>
        </div>

        <div class="heat-zone-indicator">
          <span class="heat-pill heat-good">Verde: Buena señal</span>
          <span class="heat-pill heat-med">Amarillo: Regular</span>
          <span class="heat-pill heat-bad">Rojo: Mala</span>
        </div>
      </div>

      <div class="form-card-container">
        <div style="font-weight:700;font-size:0.85rem;color:#fbc02d;margin-bottom:8px;">Tipo de Predio</div>
        <div class="form-group-field">
          <label>Tipo de Vivienda</label>
          <select class="form-control-select">
            <option>Casa (1 Piso)</option>
            <option>Apartamento</option>
            <option>Edificio / Comercial</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Metros Cuadrados Estimados</label>
          <input type="number" class="form-control-input" value="120">
        </div>
      </div>

      <button type="button" class="btn-ofs-primary" @click="enviarCertificacion">
        Enviar Certificación
      </button>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { state, showScreen, showToast, openModal } = useSimulator();

const testRoom = (roomName, nivel) => {
  showToast(`Verificando nivel WiFi en ${roomName}: ${nivel}`, 'success');
};

const enviarCertificacion = () => {
  openModal(
    'Enviando Certificación',
    '<div style="text-align:center;padding:12px 0;"><svg style="width:40px;height:40px;fill:#4caf50;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><div style="font-weight:700;margin-top:8px;">Certificado enviado exitosamente.</div><div style="font-size:0.8rem;color:#888;">La app de mapa de calor se cerrará.</div></div>',
    () => showScreen('/activity'),
    'Finalizar',
    ''
  );
};
</script>
