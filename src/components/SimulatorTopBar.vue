<template>
  <div class="simulator-topbar">
    <div class="topbar-left">
      <!-- Selector de Modo de Simulación: Guiado vs Libre -->
      <div class="mode-switch-group" role="group" aria-label="Modo de Simulación">
        <button
          type="button"
          class="btn-mode-tab"
          :class="{ active: state.ui.modoGuiado }"
          @click="setModoGuiado(true)"
          title="Modo Guiado: Muestra pistas oficiales y resaltados paso a paso"
        >
          🧭 Guiado
        </button>
        <button
          type="button"
          class="btn-mode-tab"
          :class="{ active: !state.ui.modoGuiado }"
          @click="setModoGuiado(false)"
          title="Modo Libre: Oculta pistas y resaltados para evaluación y práctica real"
        >
          🎯 Libre
        </button>
      </div>
    </div>
    <div class="topbar-right">
      <button
        type="button"
        class="btn-tool"
        @click="resetSimulator"
        title="Reiniciar todos los procesos a valores iniciales"
      >
        🔄 Reiniciar
      </button>
      <button
        type="button"
        class="btn-tool btn-fullscreen-toggle"
        @click="toggleFullscreen"
        :title="state.fullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'"
      >
        {{ state.fullscreen ? '📱 Celular' : '🖥️ Completa' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { state, toggleFullscreen, resetSimulator, setModoGuiado } = useSimulator();
</script>

<style scoped>
.mode-switch-group {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.btn-mode-tab {
  background: transparent;
  border: none;
  color: #a0a0a0;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  user-select: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-mode-tab:hover {
  color: #ffffff;
}

.btn-mode-tab.active {
  background: #2e7d32;
  color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.btn-mode-tab:last-child.active {
  background: #ba74e6;
  color: #ffffff;
}

@media (max-width: 480px) {
  .btn-mode-tab {
    font-size: 0.68rem;
    padding: 3px 7px;
  }
}
</style>
