<template>
  <div class="simulator-screen screen-check-inicio screen-active" id="screen-check-inicio">
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" @click="showScreen('/activity')">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <span class="app-bar-title">Check Inicio Operación</span>
      <div style="width:36px;"></div>
    </div>

    <div class="screen-scroll-body" style="padding:14px;">
      <p style="font-size:0.8rem;color:#aaa;margin-bottom:12px;">
        Diligencia los requisitos obligatorios para completar actividades de almacén.
      </p>

      <div class="form-card-container">
        <div style="font-weight:700;font-size:0.88rem;color:#fbc02d;margin-bottom:10px;">Presentación Personal</div>
        <div class="form-group-field">
          <label>Presentación e higiene personal <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>Cumple - Adecuada</option>
            <option>No Cumple</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Dotación del periodo en curso <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>Completa y en buen estado</option>
            <option>Incompleta</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Estado Motocicleta / Vehículo <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>Óptimo - Preoperacional OK</option>
            <option>Con novedades</option>
          </select>
        </div>
      </div>

      <div class="form-card-container">
        <div style="font-weight:700;font-size:0.88rem;color:#00bcd4;margin-bottom:10px;">Elementos de Protección Personal</div>
        <div class="form-group-field">
          <label>Kit EPP (Casco, Botas, Arnés, Gafas) <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>Completo y certificado</option>
            <option>Incompleto</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Herramientas básicas según trabajo <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>Kit Herramienta Completo</option>
            <option>Faltan herramientas</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Registro medidor de campo <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>Medidor de Campo Calibrado</option>
            <option>Sin medidor</option>
          </select>
        </div>
      </div>

      <div class="form-card-container">
        <div style="font-weight:700;font-size:0.88rem;color:#81c784;margin-bottom:10px;">Célula Operativa</div>
        <div class="form-group-field">
          <label>Supervisor de campo <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>ROGER ENCIZO (Zona Norte)</option>
            <option>CARLOS RESTREPO (Zona Sur)</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Móvil de apoyo <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>Móvil 123 (Cuadrante)</option>
            <option>Móvil 104 (Auxiliar)</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Contacto CND <span class="req-badge">Requerido</span></label>
          <select class="form-control-select">
            <option>CND Centro - Mesa 14</option>
            <option>CND Regional Occidente</option>
            <option>CND Nacional Soporte</option>
          </select>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
        <button
          type="button"
          class="ofs-modal-btn"
          style="background:#444;color:#fff;border-radius:3px;padding:8px 18px;"
          @click="showScreen('/activity')"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="ofs-modal-btn primary"
          style="background:#0288d1;color:#fff;border-radius:3px;padding:8px 24px;font-weight:700;"
          @click="guardarCheck"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { state, showScreen, showToast } = useSimulator();

const guardarCheck = () => {
  if (state.currentActivity) {
    state.currentActivity.checkRealizado = true;
  }
  showToast('Check de Inicio de Operación guardado con éxito.', 'success');
  showScreen('/activity');
};
</script>
