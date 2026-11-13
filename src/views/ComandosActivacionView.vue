<template>
  <div class="simulator-screen screen-comandos-act screen-active" id="screen-comandos-act">
    <div class="ofs-app-bar">
      <button type="button" class="app-bar-btn" @click="showScreen('/inventario')">
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <span class="app-bar-title">Comandos Activación</span>
      <div style="width:36px;"></div>
    </div>

    <div class="screen-scroll-body" style="padding:12px;">
      <div style="background:#262626;border:1px solid #3d3d3d;border-radius:4px;padding:10px;margin-bottom:12px;">
        <div style="font-size:0.76rem;color:#aaa;">Orden: {{ state.currentActivity?.ot || '371940209' }} · Usuario: {{ state.currentUser?.cedula || '1082939957' }}</div>
        <div style="font-size:0.85rem;font-weight:700;color:#fff;margin-top:2px;">EQUIPOS - SERIAL: 383FB3975C1B</div>
        <div style="font-size:0.76rem;color:#81c784;">DOCSIS 3.0 DOBLE BANDA · FABRICANTE: CG1</div>
      </div>

      <div class="form-card-container">
        <div class="form-group-field">
          <label>Acción / Comando de Red</label>
          <select class="form-control-select" v-model="selectedCommand">
            <option value="Niveles">Niveles (Telemetría RF Módem)</option>
            <option value="Consultar">Consultar Equipo</option>
            <option value="Telefonia">Puerto Telefonía OFSC</option>
            <option value="Wifi">Comandos WiFi</option>
            <option value="Cambiar">Cambiar Servicio</option>
          </select>
        </div>
        <button
          type="button"
          class="btn-ofs-primary"
          @click="ejecutarComando"
        >
          Ejecutar Comando
        </button>
      </div>

      <!-- Tabla de Niveles RF Oficial (Página 33 PDF) -->
      <div v-if="mostrarNiveles" style="margin-top:14px;">
        <div style="font-weight:700;font-size:0.9rem;color:#ffd54f;margin-bottom:6px;text-align:center;">
          NIVELES DE SEÑAL CABLE MÓDEM
        </div>
        <table class="rf-levels-table">
          <thead>
            <tr>
              <th>Nombre Nivel</th>
              <th>Valor Nivel</th>
              <th>Evaluación Nivel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>snr_up</strong></td>
              <td>36.1 dB</td>
              <td class="rf-eval-ok">OK</td>
            </tr>
            <tr>
              <td><strong>tx</strong></td>
              <td>46.5 dBmV</td>
              <td class="rf-eval-ok">OK</td>
            </tr>
            <tr>
              <td><strong>rx</strong></td>
              <td>3.9 dBmV</td>
              <td class="rf-eval-ok">OK</td>
            </tr>
            <tr>
              <td><strong>snr_down</strong></td>
              <td>41.9 dB</td>
              <td class="rf-eval-ok">OK</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSimulator } from '../composables/useSimulator';

const { state, showScreen, showToast } = useSimulator();

const selectedCommand = ref('Niveles');
const mostrarNiveles = ref(false);

const ejecutarComando = () => {
  if (selectedCommand.value === 'Niveles') {
    showToast('Consultando telemetría de niveles...', 'normal');
    setTimeout(() => {
      mostrarNiveles.value = true;
      showToast('Lectura de niveles RF completada. Todos en OK.', 'success');
    }, 800);
  } else {
    showToast(`Comando "${selectedCommand.value}" ejecutado correctamente.`);
  }
};
</script>
