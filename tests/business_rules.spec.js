import { describe, it, expect, beforeEach } from 'vitest';
import {
  BUSINESS_ERROR_CODES,
  validarRutaActiva,
  validarFinalizacionAlmacen,
  validarCierreOrdenCliente,
  validarFormularioCierreOT,
  validarDesactivacionRuta
} from '../src/core/businessRules.js';

import { authState } from '../src/core/auth.js';
import { almacenState, resetAlmacenFlow } from '../src/flows/almacen/useAlmacenFlow.js';
import { mapaCalorState, useMapaCalorFlow } from '../src/flows/mapa_calor/useMapaCalorFlow.js';
import { planillaNotasState, resetPlanillaNotasFlow } from '../src/flows/planilla_notas/usePlanillaNotasFlow.js';
import { cierreState, resetCierreFlow } from '../src/flows/cierre/useCierreFlow.js';

describe('Reglas de Negocio Operativas OFSC / Claro WFM', () => {
  const { resetMapaCalorFlow } = useMapaCalorFlow();

  beforeEach(() => {
    resetAlmacenFlow();
    resetMapaCalorFlow();
    resetPlanillaNotasFlow();
    resetCierreFlow();
    if (!authState.currentUser) {
      authState.currentUser = { rutaActivada: false, actividades: [] };
    } else {
      authState.currentUser.rutaActivada = false;
    }
  });

  describe('Regla: Validación de Ruta Activa (OFSC-301)', () => {
    it('debe rechazar si la ruta no está activada', () => {
      authState.currentUser.rutaActivada = false;
      const res = validarRutaActiva();
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.RUTA_NO_ACTIVADA);
    });

    it('debe aprobar cuando la ruta fue activada', () => {
      authState.currentUser.rutaActivada = true;
      const res = validarRutaActiva();
      expect(res.valido).toBe(true);
    });
  });

  describe('Regla: Validación de Check de Almacén (OFSC-202)', () => {
    it('debe rechazar finalizar almacén si no se realizó el Check de Inicio', () => {
      almacenState.checkRealizado = false;
      const res = validarFinalizacionAlmacen();
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.CHECK_ALMACEN_PENDIENTE);
    });

    it('debe permitir finalizar almacén cuando el Check de Inicio fue completado', () => {
      almacenState.checkRealizado = true;
      const res = validarFinalizacionAlmacen();
      expect(res.valido).toBe(true);
    });
  });

  describe('Regla: Precondiciones de Cierre de OT del Cliente (OFSC-402 y OFSC-405)', () => {
    it('debe bloquear el cierre si falta certificar la Cobertura WiFi (H&B)', () => {
      mapaCalorState.certificacionEnviada = false;
      planillaNotasState.planillaEnviada = true;

      const res = validarCierreOrdenCliente();
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.WIFI_NO_CERTIFICADO);
      expect(res.mensaje).toContain('Error OFSC-402');
      expect(res.accionRuta).toBe('/cobertura-wifi');
    });

    it('debe bloquear el cierre si falta enviar la Planilla de Notas a la Delta por Colaboración', () => {
      mapaCalorState.certificacionEnviada = true;
      planillaNotasState.planillaEnviada = false;

      const res = validarCierreOrdenCliente();
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.PLANILLA_NO_ENVIADA);
      expect(res.mensaje).toContain('Error OFSC-405');
      expect(res.accionRuta).toBe('/chat');
    });

    it('debe autorizar el cierre únicamente cuando Cobertura WiFi y Planilla están completas', () => {
      mapaCalorState.certificacionEnviada = true;
      planillaNotasState.planillaEnviada = true;

      const res = validarCierreOrdenCliente();
      expect(res.valido).toBe(true);
    });
  });

  describe('Regla: Captura de Coordenadas GPS en Cierre (OFSC-101)', () => {
    it('debe impedir presionar OK si las coordenadas GPS no fueron capturadas', () => {
      cierreState.formData.coordenadasCapturadas = false;
      const res = validarFormularioCierreOT();
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.GPS_NO_CAPTURADO);
    });

    it('debe permitir liquidar cuando las coordenadas GPS están capturadas', () => {
      cierreState.formData.coordenadasCapturadas = true;
      const res = validarFormularioCierreOT();
      expect(res.valido).toBe(true);
    });
  });

  describe('Regla: Desactivación de Ruta (OFSC-501)', () => {
    it('debe impedir desactivar la ruta si hay OTs de cliente incompletas', () => {
      const actividades = [
        { id: '1', tipo: 'cliente', estado: 'comenzado' }
      ];
      cierreState.otCompletada = false;

      const res = validarDesactivacionRuta(actividades);
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.ACTIVIDADES_PENDIENTES);
    });

    it('debe permitir desactivar la ruta cuando todas las OTs están cerradas', () => {
      const actividades = [
        { id: '1', tipo: 'cliente', estado: 'cerrado' }
      ];
      cierreState.otCompletada = true;

      const res = validarDesactivacionRuta(actividades);
      expect(res.valido).toBe(true);
    });
  });
});
