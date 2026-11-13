<template>
  <div class="simulator-screen screen-servicios-ot screen-active" id="screen-servicios-ot">
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" @click="showScreen('/activity')">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <span class="app-bar-title">Servicios OT</span>
      <div style="width:36px;"></div>
    </div>

    <div class="screen-scroll-body" style="padding:12px;">
      <div style="font-size:0.95rem;font-weight:700;color:var(--ofs-text-white);margin-bottom:8px;">Servicios de la Orden de Trabajo</div>
      <div style="overflow-x:auto;margin-bottom:14px;border:1px solid var(--ofs-border);border-radius:4px;">
        <table style="width:100%;border-collapse:collapse;font-size:0.75rem;background:var(--ofs-bg-card);color:var(--ofs-text-white);">
          <thead>
            <tr style="background:var(--ofs-bg-card-hover);color:#ffffff;text-align:left;">
              <th style="padding:8px;border:1px solid var(--ofs-border);">Código</th>
              <th style="padding:8px;border:1px solid var(--ofs-border);">Descripción</th>
              <th style="padding:8px;border:1px solid var(--ofs-border);text-align:center;">Cambios</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);"><strong>NDO</strong></td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);">ARR DECO ADI</td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);text-align:center;font-weight:700;color:var(--ofs-green-light);">2</td>
            </tr>
            <tr>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);"><strong>CVD</strong></td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);">SUSC CLARO V</td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);text-align:center;font-weight:700;color:var(--ofs-green-light);">2</td>
            </tr>
            <tr>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);"><strong>DGH</strong></td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);">TV DIG AVANA</td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);text-align:center;font-weight:700;color:var(--ofs-green-light);">2</td>
            </tr>
            <tr>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);"><strong>RWH</strong></td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);">TAR WIN E1Y2</td>
              <td style="padding:7px 8px;border:1px solid var(--ofs-border);text-align:center;font-weight:700;color:var(--ofs-green-light);">2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { showScreen } = useSimulator();
</script>
