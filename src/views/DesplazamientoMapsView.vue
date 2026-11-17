<template>
  <div class="simulator-screen screen-maps screen-active" id="screen-maps">
    <!-- Barra Superior Oficial Google Maps (Páginas 10 y 11) -->
    <div class="maps-top-header">
      <div class="maps-search-box">
        <button type="button" class="btn-maps-back" title="Volver" @click="handleBack">
          <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>

        <div class="maps-inputs-col">
          <div class="maps-input-row">
            <span class="dot-origin"></span>
            <span class="maps-input-text">Tu ubicación</span>
          </div>
          <div class="maps-input-row" style="margin-top: 6px;">
            <span class="pin-dest"></span>
            <span class="maps-input-text">4°40'54.5"N 74°10'03.9"W</span>
          </div>
        </div>

        <button type="button" class="btn-maps-dots" title="Opciones">
          <svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>

      <!-- Selector de Modos de Transporte -->
      <div class="maps-transport-row">
        <div class="transport-tab">
          <span class="t-icon">🚗</span>
          <span class="t-label">28 min</span>
        </div>
        <div class="transport-tab active">
          <span class="t-icon">🏍️</span>
          <span class="t-label">22 min</span>
        </div>
        <div class="transport-tab">
          <span class="t-icon">🚌</span>
          <span class="t-label">1 h</span>
        </div>
        <div class="transport-tab">
          <span class="t-icon">🚶</span>
          <span class="t-label">2 h 7</span>
        </div>
        <div class="transport-tab">
          <span class="t-icon">🚕</span>
          <span class="t-label">28</span>
        </div>
      </div>
    </div>

    <!-- Mapa Interactivo Google Maps (Páginas 10 y 11) -->
    <div
      class="maps-canvas"
      :class="{ 'target-map-pulse': currentStep === 6 }"
      @click="handleMapClick"
    >
      <svg viewBox="0 0 400 480" class="maps-svg">
        <!-- Fondo base mapa Google Maps (Colores auténticos) -->
        <rect width="400" height="480" fill="#e8ece9" />

        <!-- Zonas Verdes / Parques -->
        <path d="M 200 40 L 260 40 L 260 80 L 200 80 Z" fill="#c8e6c9" />
        <path d="M 90 420 L 140 420 L 140 470 L 90 470 Z" fill="#c8e6c9" />
        <circle cx="108" cy="445" r="7" fill="#81c784" />

        <!-- Río / Canal Bogotá (Celeste) -->
        <path d="M 50 180 Q 90 200 130 180 T 210 200 T 300 190 T 380 230" fill="none" stroke="#b3e5fc" stroke-width="8" />

        <!-- Red vial secundaria (Gris claro) -->
        <g stroke="#ffffff" stroke-width="2.5">
          <line x1="30" y1="20" x2="380" y2="20" />
          <line x1="30" y1="90" x2="380" y2="90" />
          <line x1="30" y1="160" x2="380" y2="160" />
          <line x1="30" y1="250" x2="380" y2="250" />
          <line x1="30" y1="330" x2="380" y2="330" />
          <line x1="30" y1="410" x2="380" y2="410" />

          <line x1="70" y1="10" x2="70" y2="460" />
          <line x1="150" y1="10" x2="150" y2="460" />
          <line x1="230" y1="10" x2="230" y2="460" />
          <line x1="310" y1="10" x2="310" y2="460" />
        </g>

        <!-- Avenidas principales (Amarillo suave / Blanco ancho) -->
        <path d="M 180 20 L 140 150 L 150 320 L 220 460" fill="none" stroke="#fff9c4" stroke-width="6" />
        <path d="M 30 140 L 380 280" fill="none" stroke="#fff9c4" stroke-width="6" />

        <!-- POIs y Rótulos Bogotá -->
        <text x="130" y="60" class="maps-label airport-label">Aeropuerto Internacional</text>
        <text x="130" y="74" class="maps-label airport-label">El Dorado - Bogotá (BOG)</text>
        <circle cx="118" cy="65" r="7" fill="#1976d2" />
        <text x="118" y="69" text-anchor="middle" font-size="9" fill="#fff">✈</text>

        <text x="210" y="145" class="maps-label">Diverplaza Centro Comercial</text>
        <text x="280" y="165" class="maps-label">SICTE</text>
        <text x="245" y="200" class="maps-label bold">BODEGA OPEGIN</text>
        <text x="205" y="225" class="maps-label">Calidad De En...</text>
        <text x="120" y="295" class="maps-label">Conjunto Castelo Apartamentos PH</text>
        <text x="50" y="335" class="maps-label">Conjunto Residencial Castilla Imperial</text>
        <text x="220" y="345" class="maps-label bold">Centro Comercial Plaza Central</text>
        
        <text x="130" y="375" class="maps-label sector-label">KENNEDY</text>
        <text x="200" y="420" class="maps-label sector-label">PUENTE ARANDA</text>

        <!-- Ruta Alternativa (Gris con badge 26 min) -->
        <path d="M 255 190 L 210 260 L 160 300 L 80 180" fill="none" stroke="#90a4ae" stroke-width="6" stroke-linecap="round" />
        <g transform="translate(185, 275)">
          <rect x="0" y="0" width="54" height="20" rx="10" fill="#ffffff" stroke="#cfd8dc" />
          <text x="27" y="14" text-anchor="middle" font-size="10" font-weight="700" fill="#455a64">26 min</text>
        </g>

        <!-- Ruta Principal Google Maps (Azul brillante) -->
        <path d="M 255 190 L 180 230 L 120 270 L 90 210 L 78 185" fill="none" stroke="#1a73e8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Badge de tiempo ruta activa (22 min) -->
        <g transform="translate(255, 205)">
          <rect x="0" y="0" width="56" height="22" rx="11" fill="#1a73e8" />
          <text x="28" y="15" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">22 min</text>
        </g>

        <!-- Origen (Moto / Técnico) -->
        <circle cx="255" cy="190" r="10" fill="#1976d2" stroke="#ffffff" stroke-width="2.5" />
        <text x="255" y="194" text-anchor="middle" font-size="10" fill="#fff">🏍</text>

        <!-- Destino (Pin Rojo Google Maps) -->
        <g transform="translate(74, 165)">
          <path d="M 10 0 C 4.5 0 0 4.5 0 10 C 0 17 10 26 10 26 C 10 26 20 17 20 10 C 20 4.5 15.5 0 10 0 Z" fill="#ea4335" />
          <circle cx="10" cy="9" r="4" fill="#ffffff" />
        </g>

        <!-- Botones de mapa flotantes (Capas / Brújula) -->
        <circle cx="360" cy="80" r="16" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
        <text x="360" y="85" text-anchor="middle" font-size="14" fill="#5f6368">🥞</text>

        <circle cx="360" cy="140" r="16" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
        <text x="360" y="145" text-anchor="middle" font-size="14" fill="#5f6368">🔍</text>

        <circle cx="355" cy="380" r="16" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
        <text x="355" y="385" text-anchor="middle" font-size="14" fill="#1a73e8">🎯</text>
      </svg>
    </div>

    <!-- Panel Inferior Google Maps (Páginas 10 y 11) -->
    <div class="maps-bottom-panel" @click="handleMapClick">
      <div class="panel-pill-handle"></div>
      
      <div class="panel-time-title">
        <span class="time-big">22 min</span>
        <span class="dist-light">(12 km)</span>
      </div>
      <div class="panel-traffic-desc">La ruta más rápida debido al estado del tráfico</div>

      <div class="panel-actions-row">
        <button type="button" class="btn-maps-action primary" @click="handleMapClick">
          <span style="font-size: 1.1rem; margin-right: 4px;">▲</span> Iniciar
        </button>
        <button type="button" class="btn-maps-action" @click="handleMapClick">
          <span style="font-size: 1.1rem; margin-right: 4px;">≡</span> Pasos
        </button>
        <button type="button" class="btn-maps-action" @click="handleMapClick">
          <span style="font-size: 1.1rem; margin-right: 4px;">📌</span> Fijar
        </button>
      </div>
    </div>

    <!-- PISTA FLOTANTE PASO 6 (DESPLAZAMIENTO.pdf Pág 11) -->
    <FlowHintBox
      v-if="currentStep === 6"
      step="6"
      position="top"
    >
      También te permitirá visualizar la ruta desde Google Maps. Pulsa sobre el <strong>mapa</strong> para continuar.
    </FlowHintBox>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  showScreen,
  finalizarDesplazamiento
} = useSimulator();

const currentStep = computed(() => state.desplazamientoProgress?.currentStep || 6);

const handleBack = () => {
  showScreen('/activity');
};

const handleMapClick = () => {
  finalizarDesplazamiento(() => {
    showScreen('/activity');
  });
};
</script>

<style scoped>
.screen-maps {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: #212121;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Encabezado de búsqueda de Google Maps */
.maps-top-header {
  background: #ffffff;
  padding: 10px 14px 6px 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 10;
}

.maps-search-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-maps-back,
.btn-maps-dots {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #5f6368;
  display: flex;
  align-items: center;
}

.btn-maps-back svg,
.btn-maps-dots svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.maps-inputs-col {
  flex: 1;
}

.maps-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f3f4;
  padding: 6px 10px;
  border-radius: 6px;
}

.dot-origin {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #1a73e8;
  display: inline-block;
}

.pin-dest {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ea4335;
  display: inline-block;
}

.maps-input-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3c4043;
}

/* Selector de Modo de Transporte */
.maps-transport-row {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f1f3f4;
}

.transport-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 18px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #5f6368;
  cursor: pointer;
}

.transport-tab.active {
  background: #e8f0fe;
  color: #1a73e8;
  font-weight: 700;
}

/* Canvas del Mapa Google Maps */
.maps-canvas {
  flex: 1;
  position: relative;
  background: #e8ece9;
  cursor: pointer;
}

.maps-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.maps-label {
  font-family: Roboto, -apple-system, sans-serif;
  font-size: 8px;
  fill: #5f6368;
}

.maps-label.bold {
  font-weight: 700;
  fill: #3c4043;
}

.airport-label {
  font-size: 8.5px;
  font-weight: 700;
  fill: #1976d2;
}

.sector-label {
  font-size: 11px;
  font-weight: 800;
  fill: rgba(0, 0, 0, 0.25);
  letter-spacing: 1.5px;
}

.target-map-pulse {
  animation: pulseMap 1.8s infinite;
}

@keyframes pulseMap {
  0% { box-shadow: inset 0 0 0 2px rgba(26, 115, 232, 0.4); }
  50% { box-shadow: inset 0 0 20px 4px rgba(26, 115, 232, 0.7); }
  100% { box-shadow: inset 0 0 0 2px rgba(26, 115, 232, 0.4); }
}

/* Panel Inferior */
.maps-bottom-panel {
  background: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -3px 12px rgba(0,0,0,0.12);
  padding: 8px 18px 24px 18px;
  z-index: 10;
  cursor: pointer;
}

.panel-pill-handle {
  width: 36px;
  height: 4px;
  background: #dadce0;
  border-radius: 2px;
  margin: 0 auto 10px auto;
}

.panel-time-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.time-big {
  font-size: 1.45rem;
  font-weight: 800;
  color: #188038;
}

.dist-light {
  font-size: 0.95rem;
  color: #70757a;
}

.panel-traffic-desc {
  font-size: 0.8rem;
  color: #70757a;
  margin-top: 2px;
  margin-bottom: 12px;
}

.panel-actions-row {
  display: flex;
  gap: 10px;
}

.btn-maps-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #dadce0;
  background: #ffffff;
  color: #1a73e8;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
}

.btn-maps-action.primary {
  background: #1a73e8;
  color: #ffffff;
  border: none;
}
</style>
