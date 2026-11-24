<template>
  <div
    class="ofs-drawer-backdrop"
    :class="{ 'is-open': state.drawerOpen }"
    @click="closeDrawer"
  ></div>

  <div class="ofs-drawer" :class="{ 'is-open': state.drawerOpen }">
    <div class="drawer-header">
      <div class="drawer-profile-row">
        <img src="../assets/img/logo-5inco-circle.png" alt="5inco" class="drawer-profile-avatar" />
        <div class="drawer-profile-text">
          <div class="drawer-user-name">{{ state.currentUser?.nombre || 'TÉCNICO' }}</div>
          <div class="drawer-user-info">
            {{ state.currentUser ? `${state.currentUser.cedula} · ${state.currentUser.movil}` : 'Cédula y Móvil' }}
          </div>
        </div>
      </div>
      <div class="drawer-instance-tag">Instancia: amx-res-co · 5inco WFM</div>
    </div>

    <!-- Selector de Modo de Simulación en Menú Lateral -->
    <div class="drawer-mode-section">
      <div class="drawer-mode-title">Modo de Simulación:</div>
      <div class="drawer-mode-tabs">
        <button
          type="button"
          class="btn-drawer-mode"
          :class="{ active: state.ui.modoGuiado }"
          @click="setModoGuiado(true)"
        >
          🧭 Guiado
        </button>
        <button
          type="button"
          class="btn-drawer-mode libre"
          :class="{ active: !state.ui.modoGuiado }"
          @click="setModoGuiado(false)"
        >
          🎯 Libre
        </button>
      </div>
    </div>

    <div class="drawer-menu-list">
      <div class="drawer-item" @click="goToActivityList">
        <svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
        Gestionar / Mi ruta
      </div>
      <div class="drawer-item" @click="openColorimetria">
        <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 18.5c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l.9-1c1.53 1.17 3.44 1.89 5.34 1.99 4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
        Colorimetría OFSC
      </div>
      <div class="drawer-item" @click="goToChat">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        Smart Collaboration
      </div>
      <div class="drawer-item" @click="handleResetSimulator">
        <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        Reiniciar Simulación
      </div>
      <div style="height:1px;background:#333;margin:8px 0;"></div>
      <div class="drawer-item" @click="logout" style="color:#ef5350;">
        <svg viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        Cerrar Sesión
      </div>

      <!-- Pie Corporativo 5inco -->
      <div class="drawer-footer-brand">
        <div class="drawer-footer-card">
          <img src="../assets/img/logo-5inco.png" alt="5inco - Compañía Integral Negocios de Colombia" class="drawer-footer-img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const {
  state,
  closeDrawer,
  logout,
  resetSimulator,
  showScreen,
  openColorimetria,
  setModoGuiado
} = useSimulator();

const goToActivityList = () => {
  closeDrawer();
  showScreen('/activities');
};

const goToChat = () => {
  closeDrawer();
  showScreen('/chat');
};

const handleResetSimulator = () => {
  closeDrawer();
  resetSimulator();
};
</script>

<style scoped>
.drawer-mode-section {
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-mode-title {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9e9e9e;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.drawer-mode-tabs {
  display: flex;
  gap: 6px;
}

.btn-drawer-mode {
  flex: 1;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: #b0b0b0;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn-drawer-mode.active {
  background: #2e7d32;
  color: #ffffff;
  border-color: #4caf50;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.btn-drawer-mode.libre.active {
  background: #ba74e6;
  color: #ffffff;
  border-color: #c991ed;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.drawer-profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-profile-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  object-fit: cover;
}

.drawer-profile-text {
  overflow: hidden;
}

.drawer-instance-tag {
  color: #ffd54f;
  margin-top: 8px;
  font-size: 0.72rem;
  font-weight: 600;
}

.drawer-footer-brand {
  padding: 16px 14px 20px 14px;
  margin-top: 14px;
}

.drawer-footer-card {
  background: #ffffff;
  border-radius: 6px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.drawer-footer-img {
  max-height: 28px;
  max-width: 100%;
  object-fit: contain;
  display: block;
}
</style>
