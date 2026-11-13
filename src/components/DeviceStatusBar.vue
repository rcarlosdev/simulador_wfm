<template>
  <div class="device-status-bar">
    <span class="status-time" id="status-time-clock">{{ state.clockTime }}</span>
    <div class="status-icons">
      <!-- Wifi -->
      <svg class="status-icon-svg" viewBox="0 0 24 24">
        <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.32c3.78 0 7.23 1.5 9.77 3.93L12 18.9 2.23 11.25C4.77 8.82 8.22 7.32 12 7.32z"/>
      </svg>
      <!-- Signal -->
      <svg class="status-icon-svg" viewBox="0 0 24 24">
        <path d="M2 22h20V2L2 22z"/>
      </svg>
      <!-- Battery -->
      <svg class="status-icon-svg" viewBox="0 0 24 24">
        <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { state } = useSimulator();
</script>
