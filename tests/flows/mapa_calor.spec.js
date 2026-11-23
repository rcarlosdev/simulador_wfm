import { describe, it, expect, beforeEach } from 'vitest';
import {
  mapaCalorState,
  useMapaCalorFlow
} from '../../src/flows/mapa_calor/useMapaCalorFlow.js';

describe('Flujo 6: Cobertura WiFi y Mapa de Calor (MAPA DE CALOR app H&B.pdf)', () => {
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
    resetMapaCalorFlow();
  });

  it('debe iniciar en el Paso 1 con estado sin certificar', () => {
    expect(mapaCalorState.currentStep).toBe(1);
    expect(mapaCalorState.plantillaCargada).toBe(false);
    expect(mapaCalorState.serviciosDistribuidos).toBe(false);
    expect(mapaCalorState.mapaCalorVisible).toBe(false);
    expect(mapaCalorState.certificacionEnviada).toBe(false);
  });

  it('debe completar secuencialmente los 8 pasos oficiales', () => {
    // Paso 1 -> 2: Abrir menú de detalles
    abrirMenuDetalles();
    expect(mapaCalorState.currentStep).toBe(2);
    expect(mapaCalorState.menuDetallesAbierto).toBe(true);

    // Paso 2 -> 3: Abrir Cobertura WiFi
    abrirCoberturaWifi();
    expect(mapaCalorState.currentStep).toBe(3);

    // Paso 3 -> 4: Seleccionar Plantillas
    seleccionarPlantilla();
    expect(mapaCalorState.currentStep).toBe(4);
    expect(mapaCalorState.plantillaCargada).toBe(true);

    // Paso 4 -> 5: Confirmar Mapeado
    confirmarMapeado();
    expect(mapaCalorState.currentStep).toBe(5);
    expect(mapaCalorState.activeLeftTab).toBe('equipos');

    // Paso 5 -> 6: Distribuir Servicios (MTA y Decos)
    distribuirServicios();
    expect(mapaCalorState.currentStep).toBe(6);
    expect(mapaCalorState.serviciosDistribuidos).toBe(true);
    expect(mapaCalorState.mapaCalorVisible).toBe(true);
    expect(mapaCalorState.activeLeftTab).toBe('wifi');

    // Paso 6 -> 7: Abrir Información de Predio
    abrirInfoPredio();
    expect(mapaCalorState.currentStep).toBe(7);
    expect(mapaCalorState.infoModalAbierto).toBe(true);

    // Paso 7 -> 8: Guardar datos de Predio (Casa, 120 m²)
    guardarDatosPredio('casa', 120);
    expect(mapaCalorState.currentStep).toBe(8);
    expect(mapaCalorState.tipoPredio).toBe('casa');
    expect(mapaCalorState.metrosCuadrados).toBe(120);
    expect(mapaCalorState.infoModalAbierto).toBe(false);

    // Paso 8: Enviar Certificación
    enviarCertificacion();
    expect(mapaCalorState.certificacionEnviada).toBe(true);
    expect(mapaCalorState.modalCertificacionAbierto).toBe(true);
  });
});
