<template>
  <div class="simulator-layout">
    <main class="simulator-stage">
      <!-- Barra Superior de Control General del Simulador -->
      <simulator-top-bar />

      <!-- DISPOSITIVO MÓVIL SIMULADO (SMARTPHONE MOCKUP) -->
      <div
        class="device-container"
        :class="{ 'mode-fullscreen': state.fullscreen }"
        id="device-container"
      >
        <!-- Barra de Estado Android / Móvil -->
        <device-status-bar />

        <!-- Viewport Móvil -->
        <div class="device-screen">
          <router-view />

          <!-- Drawer Lateral, Modales y Toast del Sistema -->
          <app-drawer />
          <app-modals />
          <app-toast />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useSimulator } from './composables/useSimulator';
import SimulatorTopBar from './components/SimulatorTopBar.vue';
import DeviceStatusBar from './components/DeviceStatusBar.vue';
import AppDrawer from './components/AppDrawer.vue';
import AppModals from './components/AppModals.vue';
import AppToast from './components/AppToast.vue';

const { state } = useSimulator();
</script>
