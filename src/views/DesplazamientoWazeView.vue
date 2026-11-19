<template>
  <div class="simulator-screen screen-waze screen-active" id="screen-waze">
    <!-- MODO 1: PRE-VIAJE (Páginas 6 y 7 de DESPLAZAMIENTO.pdf) -->
    <template v-if="!wazeEnViaje">
      <!-- Barra superior Waze -->
      <div class="waze-top-bar">
        <button type="button" class="btn-waze-back" title="Volver a la orden" @click="handleBackToActivity">
          <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <div class="waze-location-header">
          <span class="waze-loc-origin">Tu ubicación</span>
          <span class="waze-loc-arrow">→</span>
          <span class="waze-loc-dest">Received location</span>
        </div>
      </div>

      <!-- Mapa interactivo de rutas Waze (Vectorial / SVG) -->
      <div class="waze-map-canvas">
        <svg viewBox="0 0 400 480" class="waze-map-svg">
          <!-- Fondo de calles / cuadrícula Bogotá -->
          <rect width="400" height="480" fill="#f4f5f0" />
          
          <!-- Bloques urbanos / Manzanas -->
          <g fill="#e8eae2" stroke="#d5d8cc" stroke-width="1.5">
            <rect x="20" y="40" width="80" height="60" rx="3" />
            <rect x="120" y="30" width="110" height="70" rx="3" />
            <rect x="250" y="40" width="120" height="60" rx="3" />
            
            <rect x="30" y="130" width="90" height="80" rx="3" />
            <rect x="140" y="120" width="100" height="90" rx="3" />
            <rect x="260" y="120" width="110" height="80" rx="3" />

            <rect x="20" y="240" width="90" height="90" rx="3" />
            <rect x="130" y="230" width="120" height="90" rx="3" />
            <rect x="270" y="220" width="100" height="100" rx="3" />

            <rect x="40" y="350" width="100" height="80" rx="3" />
            <rect x="160" y="340" width="110" height="90" rx="3" />
            <rect x="290" y="340" width="80" height="90" rx="3" />
          </g>

          <!-- Nombres de calles y barrios -->
          <text x="50" y="35" class="map-text street-name" transform="rotate(-30 50 35)">Carrera 91</text>
          <text x="260" y="35" class="map-text street-name" transform="rotate(30 260 35)">Calle 37 sur</text>
          <text x="280" y="85" class="map-text poi-name">Canal Calle 38 Sur</text>
          <text x="140" y="150" class="map-text poi-name bold">Canal Tintal II</text>
          <text x="210" y="165" class="map-text poi-name">EDS Petrobras</text>
          <text x="95" y="200" class="map-text poi-name">Margaritas Etapa 9 Conjunto Residencial</text>
          <text x="100" y="225" class="map-text poi-name">Margaritas 1 Conjunto Residencial</text>
          <text x="160" y="270" class="map-text poi-name bold">Portal de Las Américas</text>
          <text x="265" y="280" class="map-text poi-name">Centro Comercial Milenio Plaza</text>
          <text x="120" y="325" class="map-text poi-name">Alameda de San Pedro Conjunto Residencial</text>
          <text x="160" y="385" class="map-text city-name">Bogotá</text>

          <!-- Rutas alternativas grises -->
          <path d="M 130 80 L 70 180 L 100 310 L 140 370" fill="none" stroke="#b0bec5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 130 80 L 250 160 L 280 270 L 200 370" fill="none" stroke="#b0bec5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Ruta Principal Morada Waze -->
          <path d="M 130 80 L 160 140 L 160 170 L 180 220 L 150 290 L 150 330" fill="none" stroke="#330072" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 130 80 L 160 140 L 160 170 L 180 220 L 150 290 L 150 330" fill="none" stroke="#5b22b4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Punto de Origen (Círculo azul) -->
          <circle cx="130" cy="80" r="7" fill="#ffffff" stroke="#007aff" stroke-width="4" />
          <circle cx="130" cy="80" r="3" fill="#007aff" />

          <!-- Punto de Destino (Bandera a cuadros) -->
          <g transform="translate(140, 320)">
            <circle cx="10" cy="10" r="10" fill="#ffffff" stroke="#212121" stroke-width="2" />
            <path d="M 6 6 L 10 6 L 10 10 L 6 10 Z" fill="#212121" />
            <path d="M 10 6 L 14 6 L 14 10 L 10 10 Z" fill="#ffffff" />
            <path d="M 6 10 L 10 10 L 10 14 L 6 14 Z" fill="#ffffff" />
            <path d="M 10 10 L 14 10 L 14 14 L 10 14 Z" fill="#212121" />
          </g>

          <!-- Badges de Tiempo Flotantes sobre el Mapa -->
          <!-- 10 min -->
          <g transform="translate(50, 250)">
            <rect x="0" y="0" width="56" height="24" rx="12" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
            <text x="28" y="16" text-anchor="middle" font-size="11" font-weight="700" fill="#37474f">10 min</text>
          </g>

          <!-- 7 min Mejor (Seleccionado) -->
          <g transform="translate(105, 250)">
            <rect x="0" y="0" width="68" height="36" rx="8" fill="#330072" filter="drop-shadow(0 3px 6px rgba(51,0,114,0.4))" />
            <text x="34" y="18" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff">7 min</text>
            <text x="34" y="30" text-anchor="middle" font-size="9" font-weight="700" fill="#69f0ae">Mejor</text>
          </g>

          <!-- 17 min -->
          <g transform="translate(245, 250)">
            <rect x="0" y="0" width="56" height="24" rx="12" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
            <text x="28" y="16" text-anchor="middle" font-size="11" font-weight="700" fill="#37474f">17 min</text>
          </g>
        </svg>
      </div>

      <!-- Panel Inferior Waze Pre-viaje -->
      <div class="waze-bottom-panel">
        <div class="waze-route-summary">
          <div class="waze-time-dist">
            <span class="waze-time-bold">7 min</span>
            <span class="waze-dist-km">2.4 km</span>
          </div>
          <div class="waze-via-street">vía Carrera 88 C Bogota</div>
          <div class="waze-traffic-info">Mejor ruta, tráfico habitual</div>
          
          <div class="waze-alert-row">
            <span class="waze-alert-icon">⚠️</span>
            <span class="waze-alert-text">La ruta requiere Pico y Placa Bogotá</span>
          </div>
          <div class="waze-alert-row">
            <span class="waze-alert-icon">⚠️</span>
            <span class="waze-alert-text">Restricción de matrículas</span>
          </div>

          <!-- Botón Iniciar viaje Oficial (Paso 4) -->
          <button
            type="button"
            class="btn-waze-iniciar"
            :class="{ 'btn-target-pulse': currentStep === 4 }"
            @click="handleStartTrip"
          >
            Iniciar viaje
          </button>
        </div>
      </div>

      <!-- PISTA FLOTANTE PASO 4 (DESPLAZAMIENTO.pdf Pág 7) -->
      <FlowHintBox
        v-if="currentStep === 4"
        step="4"
        position="top"
      >
        En este caso, se seleccionó Waze. Pulsa en <strong>Iniciar viaje</strong> para continuar.
      </FlowHintBox>
    </template>

    <!-- MODO 2: NAVEGACIÓN ACTIVA WAZE (Páginas 8 y 9 de DESPLAZAMIENTO.pdf) -->
    <template v-else>
      <!-- Franja Superior Negra de Giro / Instrucción -->
      <div class="waze-turn-header">
        <div class="turn-icon-box">
          <svg viewBox="0 0 24 24" class="svg-turn"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" transform="rotate(90 12 12)"/></svg>
        </div>
        <div class="turn-info-stack">
          <div class="turn-dist-title">650 m</div>
          <div class="turn-street-title">Carrera 91</div>
        </div>
      </div>

      <div class="waze-next-turn-bar">
        Av. Ciudad de Villavicencio &gt; Oriente
      </div>

      <!-- Mapa Perspectiva 3D Waze -->
      <div class="waze-nav-canvas" @click="handleArrowClick">
        <svg viewBox="0 0 380 440" class="waze-nav-svg">
          <!-- Fondo de calles 3D -->
          <rect width="380" height="440" fill="#f0f2eb" />

          <!-- Manzanas en perspectiva -->
          <g fill="#e3e6dc" stroke="#cdd2c4" stroke-width="1.5">
            <rect x="30" y="50" width="110" height="60" rx="3" />
            <rect x="230" y="50" width="120" height="60" rx="3" />

            <rect x="20" y="130" width="120" height="70" rx="3" />
            <rect x="230" y="130" width="130" height="70" rx="3" />

            <rect x="20" y="220" width="120" height="70" rx="3" />
            <rect x="230" y="220" width="130" height="70" rx="3" />

            <rect x="20" y="310" width="120" height="70" rx="3" />
            <rect x="230" y="310" width="130" height="70" rx="3" />
          </g>

          <!-- Nombres de calles cruzadas -->
          <g fill="#ffffff" font-size="11" font-weight="700">
            <rect x="135" y="65" width="110" height="20" rx="10" fill="#330072" />
            <text x="190" y="79" text-anchor="middle">Calle 42 G Sur</text>

            <rect x="138" y="145" width="104" height="20" rx="10" fill="#330072" />
            <text x="190" y="159" text-anchor="middle">Carrera 91</text>
          </g>

          <text x="75" y="175" class="map-text-3d">Carrera 93 A</text>
          <text x="280" y="175" class="map-text-3d">Carrera 93</text>
          <text x="90" y="245" class="map-text-3d">Carrera 94 A</text>
          <text x="90" y="285" class="map-text-3d">Carrera 95</text>
          <text x="285" y="285" class="map-text-3d">Carrera 95 A</text>
          <text x="80" y="335" class="map-text-3d">Carrera 96 Bis</text>
          <text x="285" y="335" class="map-text-3d">Carrera 96</text>
          <text x="80" y="365" class="map-text-3d">Carrera 96 B</text>
          <text x="285" y="365" class="map-text-3d">Carrera 96 A</text>

          <!-- Trazado de Ruta Morada Perspectiva -->
          <path d="M 180 390 L 180 150 L 230 150 L 230 40 L 270 40" fill="none" stroke="#5b22b4" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 180 390 L 180 150 L 230 150 L 230 40 L 270 40" fill="none" stroke="#7e57c2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Flecha de giro sobre la ruta -->
          <path d="M 180 160 L 205 160 L 200 155 M 205 160 L 200 165" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round" />

          <!-- Etiqueta Calle 42 F Sur (Ubicación actual) -->
          <g transform="translate(125, 385)">
            <rect x="0" y="0" width="110" height="20" rx="10" fill="#330072" />
            <text x="55" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">Calle 42 F Sur</text>
          </g>

          <!-- Flecha de Navegación 3D (Elemento Objetivo del Paso 5) -->
          <g
            class="nav-arrow-group"
            :class="{ 'target-highlight-pulse': currentStep === 5 }"
            transform="translate(180, 330)"
          >
            <!-- Halo o zona de clic grande -->
            <circle cx="0" cy="0" r="28" fill="rgba(0, 150, 255, 0.2)" stroke="rgba(0, 150, 255, 0.5)" stroke-width="2" />
            <circle cx="0" cy="0" r="18" fill="rgba(0, 122, 255, 0.4)" />
            <!-- Cono de navegación azul -->
            <polygon points="0,-16 12,12 0,6 -12,12" fill="#007aff" stroke="#ffffff" stroke-width="2" />
          </g>
        </svg>

        <!-- Botón flotante de alertas Waze (Naranja) -->
        <button type="button" class="btn-waze-report" title="Reportar">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </button>
      </div>

      <!-- Barra Inferior de Navegación Waze -->
      <div class="waze-nav-footer">
        <button type="button" class="btn-footer-icon" title="Buscar">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>

        <div class="nav-footer-center">
          <div class="nav-arrival-time">11:44 AM</div>
          <div class="nav-eta-dist">9 min • 2.3 km</div>
        </div>

        <div class="nav-footer-right">
          <button type="button" class="btn-footer-icon" title="Sonido">
            <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          </button>
          <button type="button" class="btn-footer-icon" title="Opciones" @click="handleArrowClick">
            <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
          </button>
        </div>
      </div>

      <!-- PISTA FLOTANTE PASO 5 (DESPLAZAMIENTO.pdf Pág 9) -->
      <FlowHintBox
        v-if="currentStep === 5"
        step="5"
      >
        El aplicativo te dará las instrucciones para llegar al lugar de destino. Pulsa sobre la <strong>flecha</strong> para continuar con el contenido.
      </FlowHintBox>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';
import FlowHintBox from '../components/FlowHintBox.vue';

const {
  state,
  showScreen,
  iniciarViajeWaze,
  cambiarAGoogleMaps
} = useSimulator();

const currentStep = computed(() => state.desplazamientoProgress?.currentStep || 4);
const wazeEnViaje = computed(() => !!state.desplazamientoProgress?.wazeEnViaje);

const handleBackToActivity = () => {
  showScreen('/activity');
};

const handleStartTrip = () => {
  iniciarViajeWaze();
};

const handleArrowClick = () => {
  cambiarAGoogleMaps();
};
</script>

<style scoped>
.screen-waze {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: #212121;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Barra superior Waze */
.waze-top-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 10px 14px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  z-index: 10;
}

.btn-waze-back {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: #424242;
}

.btn-waze-back svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.waze-location-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  font-size: 0.88rem;
}

.waze-loc-origin {
  font-weight: 700;
  color: #212121;
}

.waze-loc-arrow {
  color: #757575;
}

.waze-loc-dest {
  color: #424242;
}

/* Canvas del Mapa Pre-viaje */
.waze-map-canvas {
  flex: 1;
  position: relative;
  background: #f4f5f0;
  overflow: hidden;
}

.waze-map-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.map-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  fill: #78909c;
}

.street-name {
  font-size: 10px;
  font-weight: 600;
}

.poi-name {
  font-size: 8px;
  fill: #546e7a;
}

.poi-name.bold {
  font-weight: 700;
  fill: #37474f;
}

.city-name {
  font-size: 16px;
  font-weight: 800;
  fill: rgba(0, 0, 0, 0.15);
  letter-spacing: 2px;
}

/* Panel Inferior Pre-viaje */
.waze-bottom-panel {
  background: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.12);
  padding: 16px 20px 24px 20px;
  z-index: 10;
}

.waze-time-dist {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 2px;
}

.waze-time-bold {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1b5e20;
}

.waze-dist-km {
  font-size: 1rem;
  font-weight: 600;
  color: #616161;
}

.waze-via-street {
  font-size: 0.88rem;
  font-weight: 700;
  color: #212121;
}

.waze-traffic-info {
  font-size: 0.8rem;
  color: #757575;
  margin-bottom: 8px;
}

.waze-alert-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #d32f2f;
  margin-top: 3px;
}

.waze-alert-icon {
  font-size: 0.85rem;
}

.btn-waze-iniciar {
  width: 100%;
  margin-top: 14px;
  background: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 24px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.35);
  transition: all 0.2s ease;
}

.btn-waze-iniciar:hover {
  background: #0063d1;
}

.btn-target-pulse {
  animation: pulseWazeBtn 1.5s infinite;
  box-shadow: 0 0 16px rgba(0, 122, 255, 0.8) !important;
}

@keyframes pulseWazeBtn {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

/* MODO 2: Navegación activa */
.waze-turn-header {
  background: #111111;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 14px 18px;
  gap: 16px;
  z-index: 10;
}

.turn-icon-box {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-turn {
  width: 32px;
  height: 32px;
  fill: #ffffff;
}

.turn-dist-title {
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.5px;
}

.turn-street-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #69f0ae;
}

.waze-next-turn-bar {
  background: #5b22b4;
  color: #ffffff;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 6px 18px;
  z-index: 9;
}

.waze-nav-canvas {
  flex: 1;
  position: relative;
  background: #f0f2eb;
  overflow: hidden;
  cursor: pointer;
}

.waze-nav-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.map-text-3d {
  font-size: 9px;
  font-weight: 600;
  fill: #78909c;
  font-family: sans-serif;
}

.btn-waze-report {
  position: absolute;
  right: 16px;
  bottom: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ff9800;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-waze-report svg {
  width: 26px;
  height: 26px;
  fill: #ffffff;
}

.target-highlight-pulse {
  animation: pulseArrow 1.5s infinite;
  cursor: pointer;
}

@keyframes pulseArrow {
  0% { transform: translate(180px, 330px) scale(1); }
  50% { transform: translate(180px, 330px) scale(1.15); }
  100% { transform: translate(180px, 330px) scale(1); }
}

.waze-nav-footer {
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.06);
  z-index: 10;
}

.btn-footer-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #424242;
  display: flex;
  align-items: center;
}

.btn-footer-icon svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.nav-footer-center {
  text-align: center;
}

.nav-arrival-time {
  font-size: 1.15rem;
  font-weight: 800;
  color: #212121;
}

.nav-eta-dist {
  font-size: 0.8rem;
  color: #616161;
}

.nav-footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
