<template>
  <div class="simulator-topbar">
    <div class="topbar-left">
      <span style="font-size:0.8rem;font-weight:700;color:var(--ofs-text-white);display:flex;align-items:center;gap:6px;">
        <span style="width:8px;height:8px;border-radius:50%;background:var(--ofs-green);display:inline-block;"></span>
        Simulador OFSC amx-res-co
      </span>
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
      <button type="button" class="btn-tool" @click="toggleFullscreen">
        {{ state.fullscreen ? '📱 Modo Celular' : '🖥️ Pantalla Completa' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { state, toggleFullscreen, resetSimulator } = useSimulator();
</script>
