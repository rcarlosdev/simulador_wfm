/**
 * Validador de Reglas de Negocio Operativas OFSC / Claro WFM
 * Aplica los requisitos obligatorios definidos en los documentos oficiales
 * y proporciona feedback pedagógico y operativo cuando se omiten pasos clave.
 */

import { authState } from './auth.js';
import { uiState, openModal, showToast, showScreen } from './ui.js';
import { mapaCalorState } from '../flows/mapa_calor/useMapaCalorFlow.js';
import { planillaNotasState } from '../flows/planilla_notas/usePlanillaNotasFlow.js';
import { cierreState } from '../flows/cierre/useCierreFlow.js';
import { almacenState } from '../flows/almacen/useAlmacenFlow.js';

export const BUSINESS_ERROR_CODES = {
  RUTA_NO_ACTIVADA: 'OFSC-301',
  WIFI_NO_CERTIFICADO: 'OFSC-402',
  PLANILLA_NO_ENVIADA: 'OFSC-405',
  GPS_NO_CAPTURADO: 'OFSC-101',
  ACTIVIDADES_PENDIENTES: 'OFSC-501',
  CHECK_ALMACEN_PENDIENTE: 'OFSC-202',
  MIGRACION_ONT_PRIMERO: 'OFSC-601'
};

/**
 * Valida si la ruta de trabajo está activa
 */
export function validarRutaActiva() {
  if (!authState.currentUser?.rutaActivada) {
    return {
      valido: false,
      codigo: BUSINESS_ERROR_CODES.RUTA_NO_ACTIVADA,
      titulo: 'Validación OFSC - Ruta No Activada',
      mensaje: 'La ruta de trabajo no ha sido activada para la jornada actual. Debe activar su ruta desde el menú principal o calendario.',
      accionRuta: '/activar-ruta',
      accionTexto: 'Activar Ruta'
    };
  }
  return { valido: true };
}

/**
 * Valida si la actividad de almacén cumplió con el Check de Inicio
 */
export function validarFinalizacionAlmacen() {
  if (!almacenState.checkRealizado) {
    return {
      valido: false,
      codigo: BUSINESS_ERROR_CODES.CHECK_ALMACEN_PENDIENTE,
      titulo: 'Validación OFSC - Check de Inicio Pendiente',
      mensaje: 'Debe diligenciar y guardar el Check de Inicio de Operación (vehículo, herramientas y célula de apoyo) antes de finalizar la actividad de almacén.',
      accionRuta: '/check-inicio',
      accionTexto: 'Ir a Check de Inicio'
    };
  }
  return { valido: true };
}

/**
 * Valida las precondiciones obligatorias antes de permitir el Cierre / Completar la OT del cliente
 * Reglas según MAPA DE CALOR app H&B.pdf y PLANILLA DE NOTAS.pdf
 */
export function validarCierreOrdenCliente() {
  // Regla 1: Cobertura WiFi certificada en App H&B
  if (!mapaCalorState.certificacionEnviada) {
    return {
      valido: false,
      codigo: BUSINESS_ERROR_CODES.WIFI_NO_CERTIFICADO,
      titulo: 'Validación OFSC - Cobertura WiFi Requerida',
      mensaje: '<strong>Error OFSC-402:</strong> Es obligatorio certificar la Cobertura WiFi en la app <em>Home & Building</em> antes de proceder con el cierre de la orden.<br><br>Por favor diseñe el plano térmico y envíe la certificación correspondiente.',
      accionRuta: '/cobertura-wifi',
      accionTexto: 'Ir a Cobertura WiFi'
    };
  }

  // Regla 2: Planilla de Notas de instalación enviada a la Delta por Colaboración
  if (!planillaNotasState.planillaEnviada) {
    return {
      valido: false,
      codigo: BUSINESS_ERROR_CODES.PLANILLA_NO_ENVIADA,
      titulo: 'Validación OFSC - Planilla de Facturación Requerida',
      mensaje: '<strong>Error OFSC-405:</strong> No se registra la solicitud de facturación con la Delta aliada. Debe ingresar a <strong>Colaboración</strong> y enviar la planilla de notas con los equipos instalados y puntos realizados.',
      accionRuta: '/chat',
      accionTexto: 'Abrir Colaboración'
    };
  }

  return { valido: true };
}

/**
 * Valida los campos obligatorios del formulario de liquidación de la orden
 * Regla según CIERRE OT y RUTA WFM.pdf
 */
export function validarFormularioCierreOT() {
  if (!cierreState.formData.coordenadasCapturadas) {
    return {
      valido: false,
      codigo: BUSINESS_ERROR_CODES.GPS_NO_CAPTURADO,
      titulo: 'Validación OFSC - Coordenadas GPS Obligatorias',
      mensaje: '<strong>Error OFSC-101:</strong> Debe capturar las coordenadas GPS del predio del cliente antes de presionar OK.',
      toast: true
    };
  }
  return { valido: true };
}

/**
 * Valida que no existan OTs activas antes de permitir la desactivación de ruta
 */
export function validarDesactivacionRuta(actividades = []) {
  const tienePendientes = actividades.some(a => a.tipo === 'cliente' && a.estado !== 'cerrado');
  if (tienePendientes && !cierreState.otCompletada) {
    return {
      valido: false,
      codigo: BUSINESS_ERROR_CODES.ACTIVIDADES_PENDIENTES,
      titulo: 'Validación OFSC - Actividades Pendientes',
      mensaje: '<strong>Error OFSC-501:</strong> No puede desactivar la ruta de trabajo mientras tenga actividades del cliente en curso o pendientes de cierre.',
      accionTexto: 'Entendido'
    };
  }
  return { valido: true };
}

/**
 * Valida la regla de oro para actividades de tipo Migración / Brownfield:
 * En una orden Brownfield, el MTA/ONT de Internet debe instalarse y activarse PRIMERO.
 * Si se intenta gestionar Televisión o Desinstalación antes, OFSC genera bloqueo con advertencia.
 * Regla según ACTIVACION BRONMFIELD.pdf (Pág 4 a 13)
 */
export function validarReglaMigracionBrownfield(servicioAInstalar, isBrownfield, ontInstalada) {
  if (isBrownfield && !ontInstalada) {
    const srv = String(servicioAInstalar || '').toLowerCase();
    if (srv === 'tv' || srv === 'television' || srv === 'desinst' || srv === 'desinstalacion') {
      return {
        valido: false,
        codigo: BUSINESS_ERROR_CODES.MIGRACION_ONT_PRIMERO,
        titulo: 'Advertencia OFSC - Migración Brownfield',
        mensaje: '<strong>Advertencia:</strong> La orden es una migracion por favor instale el MTA/ONT en el servicio de internet correspondiente y valide que el resultado de la activacion sea exitoso',
        accionTexto: 'Entendido'
      };
    }
  }
  return { valido: true };
}

/**
 * Helper que ejecuta la validación y, si falla, presenta el diálogo oficial OFSC
 * @returns {boolean} true si la validación pasa; false si fue bloqueado
 */
export function ejecutarValidacionConFeedback(resultadoValidacion) {
  if (resultadoValidacion.valido) return true;

  if (resultadoValidacion.toast) {
    showToast(resultadoValidacion.mensaje.replace(/<[^>]*>?/gm, ''), 'error');
  } else {
    openModal(
      resultadoValidacion.titulo,
      `<div style="font-size:0.86rem;line-height:1.55;color:#f5f5f5;">
         ${resultadoValidacion.mensaje}
       </div>`,
      resultadoValidacion.accionRuta
        ? () => showScreen(resultadoValidacion.accionRuta)
        : null,
      resultadoValidacion.accionTexto || 'Aceptar',
      'Cancelar'
    );
  }

  return false;
}
