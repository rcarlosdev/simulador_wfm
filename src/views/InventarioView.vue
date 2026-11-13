<template>
  <div class="simulator-screen screen-inventario screen-active" id="screen-inventario">
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" @click="showScreen('/activity')">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <span class="app-bar-title">Lista de Inventarios</span>
      <div style="width:36px;"></div>
    </div>

    <div class="screen-scroll-body" style="padding:12px;">
      <div style="font-size:0.88rem;font-weight:700;color:var(--ofs-cyan);margin-bottom:8px;">Instalado (5)</div>

      <div class="activity-card" style="margin:4px 0 8px 0;">
        <div style="font-weight:700;font-size:0.82rem;color:var(--ofs-text-white);">DECO HD NEWLAND NL-6105RB</div>
        <div style="font-size:0.75rem;color:var(--ofs-text-muted);">SN: 254871675753 · Tarjeta: 25487167575V</div>
        <div style="font-size:0.7rem;color:var(--ofs-green-light);">Ok, Tiempo: 25 seg</div>
      </div>

      <!-- Cable Módem MTA (Clic para Comandos / Niveles RF) -->
      <div
        class="activity-card"
        style="margin:4px 0 12px 0;border:1px solid var(--ofs-border-light);cursor:pointer;"
        @click="showScreen('/comandos-act')"
      >
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-weight:700;font-size:0.84rem;color:var(--ofs-text-white);">MTA CG1 CGA0112 (TECHNICOLOR)</div>
          <span style="font-size:0.7rem;background:var(--ofs-red);color:#ffffff;padding:2px 8px;border-radius:3px;font-weight:700;">Ver Niveles</span>
        </div>
        <div style="font-size:0.76rem;color:var(--ofs-text-muted);">MAC: 38:3F:B3:97:5C:1B · Serial: 383FB3975C1B</div>
        <div style="font-size:0.72rem;color:var(--ofs-green-light);">Ok, Tiempo: 49 seg · En línea</div>
      </div>

      <div style="font-size:0.88rem;font-weight:700;color:var(--ofs-yellow);margin:16px 0 8px 0;">Recursos en Furgón (173)</div>
      <div class="activity-card" style="margin:4px 0 8px 0;">
        <div style="font-weight:700;font-size:0.82rem;color:var(--ofs-text-white);">CPE REF 2 · MÓDEMS Y DECODIFICADORES</div>
        <div style="font-size:0.74rem;color:var(--ofs-text-muted);">Disponibles para asociar en visitas agendadas.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { showScreen } = useSimulator();
</script>
