<template>
  <div v-if="visible" class="flow-hint-wrapper" :class="[computedPosition, { 'is-minimized': isMinimized }]">
    <!-- Versión Minimizada (Píldora compacta que no tapa nada) -->
    <div v-if="isMinimized" class="flow-hint-pill" @click="toggleMinimize" title="Expandir sugerencia">
      <span class="pill-bulb">💡</span>
      <span class="pill-step">{{ title || `Paso ${step}` }}</span>
      <span class="pill-icon">▲</span>
    </div>

    <!-- Versión Completa de la Pista -->
    <div v-else class="flow-hint-box">
      <div class="flow-hint-header">
        <div class="flow-hint-title-group">
          <span class="hint-bulb">💡</span>
          <span class="flow-hint-step">{{ title || `Paso ${step}` }}</span>
        </div>

        <div class="flow-hint-actions">
          <!-- Botón para alternar posición (Arriba / Abajo) -->
          <button
            type="button"
            class="flow-hint-btn"
            :title="computedPosition === 'pos-bottom' ? 'Mover arriba' : 'Mover abajo'"
            @click.stop="togglePosition"
          >
            <span v-if="computedPosition === 'pos-bottom'">↑ Arriba</span>
            <span v-else>↓ Abajo</span>
          </button>

          <!-- Botón Minimizar -->
          <button
            type="button"
            class="flow-hint-btn btn-icon"
            title="Minimizar sugerencia"
            @click.stop="toggleMinimize"
          >
            —
          </button>

          <!-- Botón Cerrar (opcional) -->
          <button
            v-if="dismissible"
            type="button"
            class="flow-hint-close"
            title="Ocultar pista"
            @click.stop="visible = false"
          >
            ×
          </button>
        </div>
      </div>

      <div class="flow-hint-body">
        <slot>{{ text }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  step: {
    type: [Number, String],
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'bottom' // 'bottom' | 'top'
  }
});

const visible = ref(true);
const isMinimized = ref(false);
const userPosition = ref(null); // 'top' | 'bottom' | null

const computedPosition = computed(() => {
  const pos = userPosition.value || props.position || 'bottom';
  return pos === 'top' ? 'pos-top' : 'pos-bottom';
});

const togglePosition = () => {
  if (computedPosition.value === 'pos-bottom') {
    userPosition.value = 'top';
  } else {
    userPosition.value = 'bottom';
  }
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
};
</script>

<style scoped>
.flow-hint-wrapper {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 420px;
  z-index: 1000;
  pointer-events: auto;
  transition: top 0.25s ease, bottom 0.25s ease, transform 0.25s ease;
}

.flow-hint-wrapper.pos-bottom {
  bottom: 16px;
}

.flow-hint-wrapper.pos-top {
  top: 54px;
}

/* Píldora Minimizada */
.flow-hint-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(20, 20, 20, 0.94);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 6px 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  margin: 0 auto;
  animation: pillPop 0.2s ease-out;
}

.flow-hint-pill:hover {
  background: rgba(35, 35, 35, 0.98);
  border-color: rgba(255, 255, 255, 0.45);
}

.pill-bulb {
  font-size: 0.95rem;
}

.pill-step {
  color: #ffd54f;
  letter-spacing: 0.3px;
}

.pill-icon {
  font-size: 0.65rem;
  color: #aaaaaa;
}

/* Caja de Pista Completa */
.flow-hint-box {
  background: rgba(28, 30, 34, 0.97);
  border: 1.5px solid rgba(255, 213, 79, 0.45);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  animation: hintFadeIn 0.22s ease-out;
}

@keyframes hintFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flow-hint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 5px;
}

.flow-hint-title-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hint-bulb {
  font-size: 0.9rem;
}

.flow-hint-step {
  font-size: 0.88rem;
  font-weight: 800;
  color: #ffd54f;
  letter-spacing: 0.3px;
}

.flow-hint-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.flow-hint-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 4px;
  padding: 3px 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.flow-hint-btn:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}

.flow-hint-btn.btn-icon {
  padding: 2px 7px;
  font-size: 0.8rem;
  line-height: 1;
}

.flow-hint-close {
  background: none;
  border: none;
  color: #9e9e9e;
  font-size: 1.15rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}

.flow-hint-close:hover {
  color: #ffffff;
}

.flow-hint-body {
  font-size: 0.84rem;
  color: #f0f0f0;
  line-height: 1.4;
}

:deep(strong) {
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: rgba(255, 213, 79, 0.6);
  text-underline-offset: 2px;
}

:deep(em) {
  font-style: italic;
  color: #81d4fa;
}
</style>
