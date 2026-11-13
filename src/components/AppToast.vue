<template>
  <div
    class="toast-notification"
    :class="[state.toast.type || 'normal', { 'is-visible': state.toast.visible }]"
    id="toast-notification"
    role="status"
    aria-live="polite"
  >
    <div class="toast-content">
      <span class="toast-icon" v-if="state.toast.type === 'success'">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </span>
      <span class="toast-icon" v-else-if="state.toast.type === 'error'">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      </span>
      <span class="toast-icon" v-else-if="state.toast.type === 'info'">
        <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      </span>
      <span class="toast-text">{{ state.toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { state } = useSimulator();
</script>
