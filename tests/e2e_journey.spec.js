import { describe, it, expect, beforeEach } from 'vitest';

// Módulos de Flujos Operativos
import {
  activacionRutaState,
  resetActivacionRutaFlow,
  confirmarActivacionRuta
} from '../src/flows/activacion_ruta/useActivacionRutaFlow.js';

import {
  almacenState,
  resetAlmacenFlow,
  confirmarInicioAlmacen,
  guardarCheckInicio,
  finalizarActividadAlmacen
} from '../src/flows/almacen/useAlmacenFlow.js';

import {
  desplazamientoState,
  resetDesplazamientoFlow,
  iniciarViajeWaze,
  finalizarDesplazamiento
} from '../src/flows/desplazamiento/useDesplazamientoFlow.js';

import {
  activacionState,
  resetActivacionFlow,
  advanceActivacionStep
} from '../src/flows/activacion/useActivacionFlow.js';

import {
  mapaCalorState,
  useMapaCalorFlow
} from '../src/flows/mapa_calor/useMapaCalorFlow.js';

import {
  planillaNotasState,
  resetPlanillaNotasFlow,
  enviarMensajePrivado
} from '../src/flows/planilla_notas/usePlanillaNotasFlow.js';

import {
  cierreState,
  resetCierreFlow,
  capturarCoordenadasGPS,
  completarOrdenTrabajo,
  desactivarRutaTrabajo
} from '../src/flows/cierre/useCierreFlow.js';

describe('Jornada Completa del Técnico (End-to-End Operational Lifecycle)', () => {
  const {
    resetMapaCalorFlow,
    abrirMenuDetalles,
    abrirCoberturaWifi,
    seleccionarPlantilla,
    confirmarMapeado,
    distribuirServicios,
    abrirInfoPredio,
    guardarDatosPredio,
    enviarCertificacion
  } = useMapaCalorFlow();

  beforeEach(() => {
    resetActivacionRutaFlow();
    resetAlmacenFlow();
    resetDesplazamientoFlow();
    resetActivacionFlow();
    resetMapaCalorFlow();
    resetPlanillaNotasFlow();
    resetCierreFlow();
  });

  it('debe completar el ciclo de vida de la jornada laboral de 8 etapas sin inconsistencias', () => {
    // 1. Activar Ruta
    confirmarActivacionRuta();
    expect(activacionRutaState.rutaConfirmada).toBe(true);

    // 2. Almacén (Inicio, Check Vehículo y Finalización)
    confirmarInicioAlmacen();
    expect(almacenState.iniciado).toBe(true);

    guardarCheckInicio();
    expect(almacenState.checkRealizado).toBe(true);

    finalizarActividadAlmacen();
    expect(almacenState.currentStep).toBe(9);

    // 3. Desplazamiento a Predio Cliente
    iniciarViajeWaze();
    expect(desplazamientoState.wazeEnViaje).toBe(true);

    finalizarDesplazamiento();
    expect(desplazamientoState.completado).toBe(true);

    // 4. Activación de Equipos
    activacionState.selectedTvDecoSerial = '254871673753';
    activacionState.selectedModemSerial = '38:3F:B3:97:5C:1B';
    advanceActivacionStep(3);
    expect(activacionState.stepNumber).toBe(3);

    // 5. Cobertura WiFi y Mapa de Calor (H&B)
    abrirMenuDetalles();
    abrirCoberturaWifi();
    seleccionarPlantilla();
    confirmarMapeado();
    distribuirServicios();
    abrirInfoPredio();
    guardarDatosPredio('casa', 120);
    enviarCertificacion();
    expect(mapaCalorState.certificacionEnviada).toBe(true);

    // 6. Planilla de Notas al Delta de Soporte
    enviarMensajePrivado('Se instalan 1 módem y 2 decos. Solicito facturación.');
    expect(planillaNotasState.planillaEnviada).toBe(true);

    // 7. Cierre de Orden de Trabajo del Cliente
    capturarCoordenadasGPS();
    expect(cierreState.formData.coordenadasCapturadas).toBe(true);

    completarOrdenTrabajo();
    expect(cierreState.otCompletada).toBe(true);

    // 8. Desactivación de Ruta (Fin de Turno)
    desactivarRutaTrabajo();
    expect(cierreState.rutaDesactivada).toBe(true);
  });
});
