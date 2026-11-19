<template>
  <div class="simulator-screen screen-cobertura-wifi screen-active" id="screen-cobertura-wifi">

    <!-- ====================================================================
         BARRA SUPERIOR OFICIAL H&B: DOCK DE HERRAMIENTAS HORIZONTAL
         (Páginas 3 a 9 del PDF: Mapa, Router, Cables, Wifi, Info, Salir)
         ==================================================================== -->
    <div class="hnb-top-header">
      <!-- Dock Flotante Superior de 6 Herramientas -->
      <div class="hnb-top-dock">
        <!-- 1. Plano / Pisos y Certificación (Paso 8: Destacado en Rojo) -->
        <button
          type="button"
          class="btn-dock-tool"
          :class="{
            'tool-tutorial-highlight': mapaCalorState.currentStep === 8 && !mapaCalorState.modalCertificacionAbierto
          }"
          title="Plano y Certificación"
          @click="handleBotonCertificacion"
        >
          <IconMapPin :size="20" :stroke="1.8" />
        </button>

        <!-- 2. Equipos / Router (Paso 5: Destacado en Rojo) -->
        <button
          type="button"
          class="btn-dock-tool"
          :class="{
            'tool-tutorial-highlight': mapaCalorState.currentStep === 5
          }"
          title="Equipos y Servicios"
          @click="activarModoEquipos"
        >
          <IconRouter :size="20" :stroke="1.8" />
        </button>

        <!-- 3. Cableado / Acometida -->
        <button
          type="button"
          class="btn-dock-tool"
          title="Capa de Cableado"
          @click="showToast('Capa de cableado activa')"
        >
          <IconPlug :size="20" :stroke="1.8" />
        </button>

        <!-- 4. Wifi / Cobertura y Mapa de Calor (Paso 6: Destacado en Rojo) -->
        <button
          type="button"
          class="btn-dock-tool"
          :class="{
            'tool-tutorial-highlight': mapaCalorState.currentStep === 6
          }"
          title="Mapa de Calor WiFi"
          @click="toggleMapaCalor"
        >
          <IconWifi :size="20" :stroke="1.8" />
        </button>

        <!-- 5. Info del Predio (Paso 7: Destacado en Rojo) -->
        <button
          type="button"
          class="btn-dock-tool"
          :class="{
            'tool-tutorial-highlight': mapaCalorState.currentStep === 7 && !mapaCalorState.infoModalAbierto
          }"
          title="Información del Predio"
          @click="abrirInfoPredio"
        >
          <IconDeviceMobile :size="20" :stroke="1.8" />
        </button>

        <!-- 6. Salir / Regresar a Detalles de Actividad -->
        <button
          type="button"
          class="btn-dock-tool btn-dock-exit"
          title="Salir a Detalles de Actividad"
          @click="salirCoberturaWifi"
        >
          <IconArrowUp :size="20" :stroke="2" />
        </button>
      </div>

      <!-- Número de Orden en la esquina superior derecha -->
      <div class="hnb-order-label">
        Orden: {{ state.currentActivity?.ot || '372634147' }}
      </div>
    </div>

    <!-- ====================================================================
         ÁREA PRINCIPAL DE TRABAJO (LIENZO + PISOS + BARRA LATERAL DERECHA)
         ==================================================================== -->
    <div class="hnb-main-workspace">

      <!-- Badge de Piso a la Izquierda (Pág. 3 y 4 del PDF) -->
      <div class="hnb-piso-pill">
        <div class="piso-number">1</div>
        <div class="piso-text">Piso</div>
      </div>

      <!-- LIENZO CENTRAL CON CUADRÍCULA MILIMÉTRICA -->
      <div class="hnb-canvas-container" @click="handleCanvasClick">

        <!-- PLANO DE HABITACIONES (Pasos 4 a 8) -->
        <div
          v-if="mapaCalorState.plantillaCargada"
          class="hnb-floorplan-box"
          :class="{
            'plan-tutorial-highlight': mapaCalorState.currentStep === 4 || mapaCalorState.currentStep === 6
          }"
        >
          <!-- Fila Superior de Habitaciones: Baño, Habitac 2474, Habitac 9010 -->
          <div class="plan-top-row">
            <!-- Baño (Izquierda) -->
            <div class="room-cell room-bano">
              <span class="room-tag">Baño</span>
            </div>

            <!-- Habitación 2474 (Centro con Módem MTA y Deco 2474) -->
            <div class="room-cell room-hab2474">
              <span class="room-tag">Habitac 2474</span>

              <!-- Equipos ubicados en Habitación 2474 (Paso 5) -->
              <div v-if="mapaCalorState.serviciosDistribuidos" class="devices-cluster">
                <div class="device-chip chip-mta" title="Módem MTA 47:BB">
                  <IconRouter :size="16" :stroke="1.8" />
                  <span>47:BB</span>
                </div>
                <div class="device-chip chip-deco" title="Decodificador 2474">
                  <IconDeviceTv :size="16" :stroke="1.8" />
                  <span>2474</span>
                </div>
              </div>
            </div>

            <!-- Habitación 9010 (Derecha con Deco 9010 y Ondas de Calor en Paso 6) -->
            <div class="room-cell room-hab9010">
              <span class="room-tag">Habitac 9010</span>

              <!-- Deco 9010 ubicado (Paso 5) -->
              <div v-if="mapaCalorState.serviciosDistribuidos" class="devices-cluster">
                <div class="device-chip chip-deco" title="Decodificador 9010">
                  <IconDeviceTv :size="16" :stroke="1.8" />
                  <span>9010</span>
                </div>
              </div>

              <!-- TAG Y ONDAS CONCÉNTRICAS DE MAPA DE CALOR WIFI (Página 6 del PDF) -->
              <div v-if="mapaCalorState.mapaCalorVisible" class="wifi-verification-zone">
                <div class="wifi-check-badge">
                  <IconWifi :size="14" :stroke="2" />
                  <span>Verificación wifi ✓</span>
                </div>

                <!-- Ondas Térmicas Concéntricas (Rojo -> Naranja -> Amarillo) -->
                <div class="heat-rings-wrapper">
                  <div class="heat-ring ring-center"></div>
                  <div class="heat-ring ring-mid"></div>
                  <div class="heat-ring ring-outer"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fila Inferior de Habitaciones: Cocina y Sala Comedor -->
          <div class="plan-bottom-row">
            <!-- Cocina -->
            <div class="room-cell room-cocina">
              <span class="room-tag">Cocina</span>
            </div>

            <!-- Sala Comedor -->
            <div class="room-cell room-sala">
              <span class="room-tag">Sala Comedor</span>
            </div>
          </div>

          <!-- Línea Azul Horizontal de Cableado / Acometida (Páginas 4, 5, 6 del PDF) -->
          <div class="hnb-cable-line">
            <span class="cable-endpoint endpoint-left"></span>
            <span class="cable-endpoint endpoint-right"></span>
          </div>

          <!-- BARRA DE ESCALA dBm OFICIAL AL PIE DEL PLANO (Página 6 del PDF) -->
          <div v-if="mapaCalorState.mapaCalorVisible" class="hnb-dbm-bar-strip">
            <div class="dbm-title">dBm</div>
            <div class="dbm-segments-row">
              <div class="dbm-segment seg-excelente">
                <span class="seg-label">Excelente</span>
                <span class="seg-range">a -45</span>
              </div>
              <div class="dbm-segment seg-bueno">
                <span class="seg-label">Bueno</span>
                <span class="seg-range">-46 a -60</span>
              </div>
              <div class="dbm-segment seg-regular">
                <span class="seg-label">Regular</span>
                <span class="seg-range">-61 a -67</span>
              </div>
              <div class="dbm-segment seg-malo">
                <span class="seg-label">Malo</span>
                <span class="seg-range">-67 a -100</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Indicador si el plano aún no ha sido cargado (Paso 3) -->
        <div v-else class="hnb-empty-state">
          <IconLayout2 :size="36" :stroke="1.5" class="empty-icon" />
          <div class="empty-title">Plano del Predio Vacío</div>
          <div class="empty-sub">Presiona <strong>Plantillas</strong> a la derecha para mapear los servicios</div>
        </div>

      </div>

      <!-- ====================================================================
           PANEL LATERAL DERECHO (Páginas 3, 4 y 5 del PDF)
           ==================================================================== -->
      <div class="hnb-right-sidebar">
        <!-- Botón Pantalla Completa / Expandir -->
        <button type="button" class="btn-expand-panel" title="Expandir">
          <IconArrowsMaximize :size="18" :stroke="1.8" />
        </button>

        <!-- MODO 1: BOTONES DE PLANTILLAS Y HABITACIÓN (Pasos 3 y 4 del PDF) -->
        <div v-if="!mapaCalorState.serviciosDistribuidos" class="tools-vertical-stack">
          <!-- Botón Plantillas (Paso 3: Destacado con Recuadro Rojo) -->
          <button
            type="button"
            class="btn-side-card"
            :class="{
              'side-tutorial-highlight': mapaCalorState.currentStep === 3
            }"
            title="Seleccionar Plantilla"
            @click="handleSeleccionarPlantilla"
          >
            <div class="side-card-icon-box">
              <IconLayout2 :size="24" :stroke="1.8" />
            </div>
            <span class="side-card-label">Plantillas</span>
          </button>

          <!-- Botón Habitación -->
          <button type="button" class="btn-side-card" title="Habitación" @click="showToast('Herramienta Habitación')">
            <div class="side-card-icon-box">
              <IconSquare :size="24" :stroke="1.8" />
            </div>
            <span class="side-card-label">Habitación</span>
          </button>

          <!-- Botón Puerta / Muro -->
          <button type="button" class="btn-side-card" title="Muros y accesos" @click="showToast('Herramienta Muros')">
            <div class="side-card-icon-box">
              <IconDoor :size="24" :stroke="1.8" />
            </div>
          </button>
        </div>

        <!-- MODO 2: LISTA DE EQUIPOS A DISTRIBUIR (Paso 5 del PDF - Pág 5) -->
        <div
          v-else-if="mapaCalorState.currentStep === 5"
          class="devices-vertical-stack"
          :class="{
            'side-tutorial-highlight': mapaCalorState.currentStep === 5
          }"
          @click="handleDistribuirEquipos"
        >
          <!-- Item 1: MTA 47:BB (con cruz roja de ubicado) -->
          <div class="device-card-item">
            <div class="device-icon-wrapper">
              <IconRouter :size="24" :stroke="1.8" />
              <span class="red-cross-overlay">✕</span>
            </div>
            <span class="device-card-label">MTA<br/>47:BB</span>
          </div>

          <!-- Item 2: DECODIFICADOR 2474 (con cruz roja de ubicado) -->
          <div class="device-card-item">
            <div class="device-icon-wrapper">
              <IconDeviceTv :size="24" :stroke="1.8" />
              <span class="red-cross-overlay">✕</span>
            </div>
            <span class="device-card-label">DECODIFICADOR<br/>2474</span>
          </div>

          <!-- Item 3: DECODIFICADOR 9010 (con cruz roja de ubicado) -->
          <div class="device-card-item">
            <div class="device-icon-wrapper">
              <IconDeviceTv :size="24" :stroke="1.8" />
              <span class="red-cross-overlay">✕</span>
            </div>
            <span class="device-card-label">DECODIFICADOR<br/>9010</span>
          </div>
        </div>

        <!-- MODO 3: EQUIPOS YA DISTRIBUIDOS (Pasos 6 a 8) -->
        <div v-else class="tools-vertical-stack">
          <button type="button" class="btn-side-card" title="Plantillas" @click="showToast('Plantilla activa')">
            <div class="side-card-icon-box">
              <IconLayout2 :size="24" :stroke="1.8" />
            </div>
            <span class="side-card-label">Plantillas</span>
          </button>
          <button type="button" class="btn-side-card" title="Habitación">
            <div class="side-card-icon-box">
              <IconSquare :size="24" :stroke="1.8" />
            </div>
            <span class="side-card-label">Habitación</span>
          </button>
        </div>

        <!-- Logo Claro Oficial al pie derecho (Páginas 3 a 9 del PDF) -->
        <div class="claro-brand-bottom">
          <span class="claro-pill-text">Claro<span class="claro-dot">•</span></span>
        </div>
      </div>

    </div>

    <!-- ====================================================================
         MODAL 1: INFORMACIÓN DEL PREDIO (Paso 7 - Página 7 del PDF)
         ==================================================================== -->
    <div v-if="mapaCalorState.infoModalAbierto" class="hnb-modal-backdrop" @click.self="mapaCalorState.infoModalAbierto = false">
      <div class="hnb-modal-dialog">
        <!-- Pestañas: Predio, Actividad, Inventario (Página 7) -->
        <div class="modal-tabs-bar">
          <button type="button" class="modal-tab active">Predio</button>
          <button type="button" class="modal-tab" @click="showToast('Pestaña Actividad')">Actividad</button>
          <button type="button" class="modal-tab" @click="showToast('Pestaña Inventario')">Inventario</button>
        </div>

        <div class="modal-content-area">
          <!-- Fila de Metros: 120 (en rojo bold oficial) -->
          <div class="metros-row">
            <span class="metros-title">Metros:</span>
            <span class="metros-num-red">{{ mapaCalorState.metrosCuadrados }}</span>
          </div>

          <!-- Selector de Tipo de Predio -->
          <div class="predio-picker-container">
            <div class="picker-label">Tipo de Predio:</div>
            <div class="predio-cards-grid">
              <!-- Tarjeta CASA (Paso 7: Destacada con recuadro rojo tutorial) -->
              <div
                class="predio-selection-card"
                :class="{
                  selected: mapaCalorState.tipoPredio === 'casa',
                  'card-tutorial-highlight': mapaCalorState.currentStep === 7
                }"
                @click="seleccionarTipoPredio('casa')"
              >
                <div class="card-title">Casa</div>
                <div class="card-icon-wrap">
                  <IconHome :size="36" :stroke="1.8" />
                </div>
                <div v-if="mapaCalorState.tipoPredio === 'casa'" class="check-pill-green">✓</div>
              </div>

              <!-- Tarjeta APARTAMENTO -->
              <div
                class="predio-selection-card"
                :class="{ selected: mapaCalorState.tipoPredio === 'apartamento' }"
                @click="seleccionarTipoPredio('apartamento')"
              >
                <div class="card-title">Apartamento</div>
                <div class="card-icon-wrap">
                  <IconBuilding :size="36" :stroke="1.8" />
                </div>
                <div v-if="mapaCalorState.tipoPredio === 'apartamento'" class="check-pill-green">✓</div>
              </div>
            </div>
          </div>

          <!-- Botón de Confirmación -->
          <button
            type="button"
            class="btn-save-predio"
            @click="confirmarPredio"
          >
            Guardar Información
          </button>
        </div>
      </div>
    </div>

    <!-- ====================================================================
         MODAL 2: ENVIANDO CERTIFICACIÓN (Paso 8 - Páginas 8 y 9 del PDF)
         ==================================================================== -->
    <div v-if="mapaCalorState.modalCertificacionAbierto" class="hnb-modal-backdrop">
      <div
        class="cert-success-dialog"
        :class="{ 'dialog-tutorial-highlight': mapaCalorState.currentStep === 8 }"
      >
        <div class="cert-modal-title">Enviando certificacion</div>
        <div class="cert-modal-success">Certificado enviado exitosamente</div>
        <div class="cert-modal-closing">La app se cerrara</div>
        <button
          type="button"
          class="btn-cert-accept"
          @click="finalizarCertificacionYVolver"
        >
          Finalizar
        </button>
      </div>
    </div>

    <!-- ====================================================================
         PISTAS FLOTANTES OFICIALES (FlowHintBox)
         ==================================================================== -->
    <!-- Paso 3 (MAPA DE CALOR app H&B.pdf Pág 3) -->
    <FlowHintBox
      v-if="mapaCalorState.currentStep === 3"
      step="3"
      title="Paso 3 - Plantillas"
    >
      Ubícate en la parte superior de la pantalla y selecciona la opción <strong>Plantillas</strong>.
    </FlowHintBox>

    <!-- Paso 4 (MAPA DE CALOR app H&B.pdf Pág 4) -->
    <FlowHintBox
      v-else-if="mapaCalorState.currentStep === 4"
      step="4"
      title="Paso 4 - Mapeado de Servicios"
    >
      Realiza un <strong>mapeado</strong> de cómo se encuentran instalados los servicios en el predio.
    </FlowHintBox>

    <!-- Paso 5 (MAPA DE CALOR app H&B.pdf Pág 5) -->
    <FlowHintBox
      v-else-if="mapaCalorState.currentStep === 5"
      step="5"
      title="Paso 5 - Distribución de Servicios"
    >
      Luego de que realices el diseño, haz la <strong>distribución de los servicios</strong> (MTA y Decos) en el plano de la app.
    </FlowHintBox>

    <!-- Paso 6 (MAPA DE CALOR app H&B.pdf Pág 6) -->
    <FlowHintBox
      v-else-if="mapaCalorState.currentStep === 6"
      step="6"
      title="Paso 6 - Cobertura WiFi"
    >
      Valida cómo se visualizan los servicios del predio en la <em>app</em>. Luego presiona el icono de <strong>Información</strong> (📱) en el dock superior.
    </FlowHintBox>

    <!-- Paso 7 (MAPA DE CALOR app H&B.pdf Pág 7) -->
    <FlowHintBox
      v-else-if="mapaCalorState.currentStep === 7"
      step="7"
      title="Paso 7 - Datos del Predio"
    >
      Escoge el <strong>tipo de predio</strong> (Casa) y añade el tamaño estimado de la vivienda (120 m²).
    </FlowHintBox>

    <!-- Paso 8 (MAPA DE CALOR app H&B.pdf Pág 8 y 9) -->
    <FlowHintBox
      v-else-if="mapaCalorState.currentStep === 8 && !mapaCalorState.modalCertificacionAbierto"
      step="8"
      title="Paso 8 - Certificación de Servicio"
    >
      Como resultado, obtendrás la <strong>certificación del servicio</strong> alojada en la app. Presiona el primer icono del dock superior para enviar.
    </FlowHintBox>

  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';
import { useMapaCalorFlow } from '../flows/mapa_calor/useMapaCalorFlow';
import FlowHintBox from '../components/FlowHintBox.vue';

// Tabler Icons oficiales
import {
  IconMapPin,
  IconRouter,
  IconPlug,
  IconWifi,
  IconDeviceMobile,
  IconArrowUp,
  IconArrowsMaximize,
  IconLayout2,
  IconSquare,
  IconDoor,
  IconDeviceTv,
  IconHome,
  IconBuilding
} from '@tabler/icons-vue';

const { state, showScreen, showToast } = useSimulator();
const {
  mapaCalorState,
  seleccionarPlantilla,
  confirmarMapeado,
  distribuirServicios,
  abrirInfoPredio,
  guardarDatosPredio,
  enviarCertificacion,
  cerrarModalCertificacion
} = useMapaCalorFlow();

const salirCoberturaWifi = () => {
  showScreen('/activity');
};

const handleSeleccionarPlantilla = () => {
  seleccionarPlantilla();
  showToast('Plantilla del predio cargada correctamente');
};

const handleCanvasClick = () => {
  if (mapaCalorState.currentStep === 4) {
    confirmarMapeado();
    showToast('Mapeado de servicios confirmado');
  }
};

const activarModoEquipos = () => {
  mapaCalorState.activeLeftTab = 'equipos';
  if (mapaCalorState.currentStep === 4) {
    confirmarMapeado();
  } else if (mapaCalorState.currentStep === 5) {
    handleDistribuirEquipos();
  }
};

const handleDistribuirEquipos = () => {
  distribuirServicios();
  showToast('Equipos MTA y Decos ubicados en el plano', 'success');
};

const toggleMapaCalor = () => {
  mapaCalorState.activeLeftTab = 'wifi';
  mapaCalorState.mapaCalorVisible = true;
  if (mapaCalorState.currentStep === 6) {
    showToast('Validando visualización de señal y escala dBm');
  }
};

const seleccionarTipoPredio = (tipo) => {
  mapaCalorState.tipoPredio = tipo;
};

const confirmarPredio = () => {
  guardarDatosPredio(mapaCalorState.tipoPredio, 120);
  showToast('Información de vivienda y 120 m² guardada');
};

const handleBotonCertificacion = () => {
  enviarCertificacion();
};

const finalizarCertificacionYVolver = () => {
  cerrarModalCertificacion();
  showToast('Certificación del servicio completada exitosamente', 'success');
  showScreen('/activity');
};
</script>

<style scoped>
.screen-cobertura-wifi {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--ofs-bg-darker, #141414);
  color: var(--ofs-text-white, #ffffff);
  overflow: hidden;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* ====================================================================
   CABECERA SUPERIOR CLARO H&B: DOCK DE HERRAMIENTAS
   (Páginas 3 a 9 del PDF: Barra Blanca Flotante con 6 Iconos)
   ==================================================================== */
.hnb-top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #1c1c1c;
  border-bottom: 1px solid #2e2e2e;
  min-height: 48px;
  z-index: 10;
}

.hnb-top-dock {
  display: flex;
  align-items: center;
  background: #262626;
  border: 1px solid #3c3c3c;
  border-radius: 8px;
  padding: 3px 6px;
  gap: 6px;
}

.btn-dock-tool {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #303030;
  border: 1px solid #444444;
  color: #cfd8dc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  padding: 0;
}

.btn-dock-tool:hover {
  background: #3c3c3c;
  color: #ffffff;
}

.btn-dock-exit {
  background: #3a1a1e;
  border-color: #66222a;
  color: #ef5350;
}

.btn-dock-exit:hover {
  background: #4a2228;
}

.tool-tutorial-highlight {
  border: 2px solid #ef5350 !important;
  background: rgba(229, 57, 53, 0.3) !important;
  color: #ff8a80 !important;
  animation: pulseDockTool 1.5s infinite;
}

@keyframes pulseDockTool {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.hnb-order-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #cfd8dc;
}

/* ====================================================================
   ÁREA PRINCIPAL DE TRABAJO
   ==================================================================== */
.hnb-main-workspace {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Badge "1 Piso" a la izquierda */
.hnb-piso-pill {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #252525;
  border: 1px solid #3c3c3c;
  border-radius: 6px;
  padding: 6px 10px;
  text-align: center;
  z-index: 5;
}

.piso-number {
  font-size: 0.95rem;
  font-weight: 900;
  color: #ffffff;
}

.piso-text {
  font-size: 0.62rem;
  color: #9e9e9e;
}

/* LIENZO CENTRAL CON CUADRÍCULA */
.hnb-canvas-container {
  flex: 1;
  margin-left: 56px;
  margin-right: 76px;
  position: relative;
  background-color: #141414;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 16px 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* PLANO DEL PREDIO (Distribución oficial según Páginas 4 a 6) */
.hnb-floorplan-box {
  width: 92%;
  height: 84%;
  background: #1c2226;
  border: 2px solid #546e7a;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 6px;
}

.plan-tutorial-highlight {
  border: 2px solid #ef5350 !important;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.3) !important;
  animation: pulsePlan 1.6s infinite ease-in-out;
}

@keyframes pulsePlan {
  0% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(229, 57, 53, 0); }
  100% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); }
}

.plan-top-row {
  display: flex;
  flex: 1;
  gap: 6px;
  border-bottom: 1.5px solid #37474f;
  padding-bottom: 4px;
}

.plan-bottom-row {
  display: flex;
  flex: 1.2;
  gap: 6px;
  padding-top: 4px;
}

.room-cell {
  background: #21292e;
  border: 1px solid #37474f;
  border-radius: 4px;
  padding: 4px 6px;
  position: relative;
  overflow: hidden;
}

.room-bano { flex: 0.8; }
.room-hab2474 { flex: 1.2; }
.room-hab9010 { flex: 1.4; position: relative; }
.room-cocina { flex: 1; }
.room-sala { flex: 2; }

.room-tag {
  font-size: 0.6rem;
  font-weight: 700;
  color: #cfd8dc;
  display: block;
}

/* Dispositivos ubicados en habitaciones */
.devices-cluster {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.device-chip {
  display: flex;
  align-items: center;
  gap: 3px;
  background: #2a353c;
  border: 1px solid #546e7a;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.58rem;
  font-weight: 700;
  color: #eceff1;
}

.chip-mta {
  border-color: #ef5350;
  color: #ff8a80;
}

/* ONDAS CONCÉNTRICAS DE MAPA DE CALOR WIFI (Página 6) */
.wifi-verification-zone {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 4;
}

.wifi-check-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  background: #2e3b2e;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.56rem;
  font-weight: 700;
  color: #81c784;
}

.heat-rings-wrapper {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 90px;
  height: 90px;
  pointer-events: none;
  transform: translate(20%, -20%);
}

.heat-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.ring-center {
  width: 26px;
  height: 26px;
  background: rgba(229, 57, 53, 0.65);
}

.ring-mid {
  width: 58px;
  height: 58px;
  background: rgba(245, 124, 0, 0.45);
}

.ring-outer {
  width: 92px;
  height: 92px;
  background: rgba(251, 192, 45, 0.3);
}

/* Línea Azul de Cableado / Acometida (Horizontal a través del muro) */
.hnb-cable-line {
  position: absolute;
  top: 45%;
  left: 12%;
  right: 12%;
  height: 2px;
  background: #0288d1;
  box-shadow: 0 0 4px #0288d1;
  z-index: 3;
}

.cable-endpoint {
  position: absolute;
  top: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0288d1;
  border: 1.5px solid #ffffff;
}

.endpoint-left { left: 0; }
.endpoint-right { right: 0; }

/* BARRA DE ESCALA dBm OFICIAL (Página 6 del PDF) */
.hnb-dbm-bar-strip {
  position: absolute;
  bottom: 4px;
  left: 10px;
  right: 10px;
  background: rgba(24, 24, 24, 0.9);
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  padding: 3px 6px;
  z-index: 6;
}

.dbm-title {
  font-size: 0.58rem;
  font-weight: 700;
  color: #9e9e9e;
  text-align: center;
  margin-bottom: 2px;
}

.dbm-segments-row {
  display: flex;
  height: 18px;
  border-radius: 3px;
  overflow: hidden;
}

.dbm-segment {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.52rem;
  font-weight: 700;
}

.seg-excelente { background: #388e3c; color: #ffffff; }
.seg-bueno { background: #fbc02d; color: #212121; }
.seg-regular { background: #f57c00; color: #ffffff; }
.seg-malo { background: #d32f2f; color: #ffffff; }

/* Estado sin plano */
.hnb-empty-state {
  text-align: center;
  color: #78909c;
}

.empty-icon {
  margin-bottom: 6px;
  color: #607d8b;
}

.empty-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #cfd8dc;
}

.empty-sub {
  font-size: 0.68rem;
  color: #90a4ae;
}

/* ====================================================================
   PANEL LATERAL DERECHO (Páginas 3 a 9 del PDF)
   ==================================================================== */
.hnb-right-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 72px;
  background: #1e1e1e;
  border-left: 1px solid #2e2e2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  z-index: 8;
}

.btn-expand-panel {
  background: none;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  color: #cfd8dc;
  padding: 4px;
  cursor: pointer;
  margin-bottom: 8px;
}

.tools-vertical-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
}

.btn-side-card {
  width: 58px;
  background: #282828;
  border: 1.5px solid #3c3c3c;
  border-radius: 6px;
  padding: 6px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #cfd8dc;
  transition: all 0.15s ease;
}

.btn-side-card:hover {
  background: #333333;
  color: #ffffff;
}

.side-card-icon-box {
  margin-bottom: 2px;
}

.side-card-label {
  font-size: 0.58rem;
  font-weight: 600;
  text-align: center;
}

.side-tutorial-highlight {
  border: 2px solid #ef5350 !important;
  background: rgba(229, 57, 53, 0.25) !important;
  color: #ff8a80 !important;
  animation: pulseTool 1.5s infinite;
}

/* Lista de Equipos a Ubicar (Paso 5 - Página 5) */
.devices-vertical-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}

.device-card-item {
  width: 58px;
  background: #282828;
  border: 1px solid #444444;
  border-radius: 6px;
  padding: 4px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.device-icon-wrapper {
  position: relative;
  display: inline-block;
  color: #cfd8dc;
}

.red-cross-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ef5350;
  font-weight: 900;
  font-size: 1.1rem;
  line-height: 1;
}

.device-card-label {
  font-size: 0.54rem;
  font-weight: 700;
  color: #b0bec5;
  margin-top: 2px;
  line-height: 1.1;
}

/* Logo Claro al pie */
.claro-brand-bottom {
  margin-top: auto;
  background: #c61d15;
  border-radius: 4px;
  padding: 3px 6px;
  text-align: center;
}

.claro-pill-text {
  font-size: 0.72rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.2px;
}

.claro-dot {
  color: #ffffff;
  margin-left: 1px;
}

/* ====================================================================
   MODALES (Paso 7 y Paso 8)
   ==================================================================== */
.hnb-modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  padding: 12px;
}

/* Modal Info del Predio (Paso 7) */
.hnb-modal-dialog {
  background: #222222;
  border: 1.5px solid #3c3c3c;
  border-radius: 10px;
  width: 100%;
  max-width: 310px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.7);
}

.modal-tabs-bar {
  display: flex;
  background: #1a1a1a;
  border-bottom: 1px solid #333333;
}

.modal-tab {
  flex: 1;
  padding: 8px 0;
  background: none;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  color: #757575;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.modal-tab.active {
  color: #ef5350;
  border-bottom-color: #ef5350;
  background: #222222;
}

.modal-content-area {
  padding: 14px;
}

.metros-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}

.metros-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #cfd8dc;
}

.metros-num-red {
  font-size: 1.25rem;
  font-weight: 900;
  color: #ef5350;
}

.predio-picker-container {
  margin-bottom: 16px;
}

.picker-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #9e9e9e;
  margin-bottom: 6px;
}

.predio-cards-grid {
  display: flex;
  gap: 10px;
}

.predio-selection-card {
  flex: 1;
  background: #2a2a2a;
  border: 1.5px solid #444444;
  border-radius: 8px;
  padding: 10px 6px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

.predio-selection-card:hover {
  background: #333333;
}

.predio-selection-card.selected {
  border-color: #29b6f6;
  background: #1e2832;
}

.card-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.card-icon-wrap {
  color: #cfd8dc;
  margin-bottom: 2px;
}

.check-pill-green {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4caf50;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-tutorial-highlight {
  border: 2px solid #ef5350 !important;
  background: rgba(229, 57, 53, 0.25) !important;
  animation: pulseTool 1.5s infinite;
}

.btn-save-predio {
  width: 100%;
  background: #c61d15;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  padding: 9px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-save-predio:hover {
  background: #d32f2f;
}

/* Modal Enviando Certificación (Paso 8 - Páginas 8 y 9) */
.cert-success-dialog {
  background: #242424;
  border: 1px solid #3c3c3c;
  border-radius: 12px;
  width: 100%;
  max-width: 270px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.7);
}

.dialog-tutorial-highlight {
  border: 2px solid #ef5350 !important;
  animation: pulseTool 1.5s infinite;
}

.cert-modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.cert-modal-success {
  font-size: 0.84rem;
  color: #81c784;
  font-weight: 600;
  margin-bottom: 6px;
}

.cert-modal-closing {
  font-size: 0.74rem;
  color: #9e9e9e;
  margin-bottom: 18px;
}

.btn-cert-accept {
  background: #c61d15;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  padding: 8px 22px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-cert-accept:hover {
  background: #d32f2f;
}
</style>
