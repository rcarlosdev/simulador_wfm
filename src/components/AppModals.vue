<template>
  <!-- Modal Universal de Diálogos -->
  <div class="ofs-modal-backdrop" :class="{ 'is-open': state.modal.isOpen }">
    <div class="ofs-modal">
      <div class="ofs-modal-header">{{ state.modal.title }}</div>
      <div class="ofs-modal-body" v-html="state.modal.bodyHtml"></div>
      <div class="ofs-modal-footer">
        <button
          v-if="state.modal.cancelText"
          type="button"
          class="ofs-modal-btn"
          @click="closeModal"
        >
          {{ state.modal.cancelText }}
        </button>
        <button
          type="button"
          class="ofs-modal-btn primary"
          @click="confirmModal"
        >
          {{ state.modal.okText }}
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Colorimetría Oficial OFSC -->
  <div class="ofs-modal-backdrop" :class="{ 'is-open': state.colorimetriaModalOpen }">
    <div class="ofs-modal" style="max-width:380px;">
      <div class="ofs-modal-header" style="background:var(--ofs-red);">COLORIMETRÍA OFSC</div>
      <div class="ofs-modal-body" style="font-size:0.78rem;">
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#00e5ff;border-radius:2px;display:inline-block;"></span>
            <span><strong>Aguamarina:</strong> Técnico en desplazamiento</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#fbc02d;border-radius:2px;display:inline-block;"></span>
            <span><strong>Amarillo:</strong> Orden o actividad Pendiente</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#ff9800;border-radius:2px;display:inline-block;"></span>
            <span><strong>Naranja:</strong> En Peligro por tiempo</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#76ff03;border-radius:2px;display:inline-block;"></span>
            <span><strong>Verde Claro:</strong> Orden o actividad Iniciada</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#2e7d32;border-radius:2px;display:inline-block;"></span>
            <span><strong>Verde Oscuro:</strong> Orden o Lls Finalizada Ok</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#8e24aa;border-radius:2px;display:inline-block;"></span>
            <span><strong>Morado:</strong> Orden o Lls Cancelada</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#d32f2f;border-radius:2px;display:inline-block;"></span>
            <span><strong>Rojo:</strong> Orden Lls Razonada</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#795548;border-radius:2px;display:inline-block;"></span>
            <span><strong>Café:</strong> Actividad Interna Pendiente</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#00bcd4;border-radius:2px;display:inline-block;"></span>
            <span><strong>Azul Cian:</strong> Actividad Interna Completada</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#9e9e9e;border-radius:2px;display:inline-block;"></span>
            <span><strong>Gris:</strong> Suspendido no Ordenado</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:14px;height:14px;background:#1565c0;border-radius:2px;display:inline-block;"></span>
            <span><strong>Azul Oscuro:</strong> Orden Lls Suspendida</span>
          </div>
        </div>
      </div>
      <div class="ofs-modal-footer">
        <button type="button" class="ofs-modal-btn primary" @click="closeColorimetria">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSimulator } from '../composables/useSimulator';

const { state, closeModal, confirmModal, closeColorimetria } = useSimulator();
</script>
