import { describe, it, expect, beforeEach } from 'vitest';
import {
  planillaNotasState,
  resetPlanillaNotasFlow,
  abrirListaColaboracion,
  abrirChatDeltaGeneral,
  abrirInfoUsuario,
  iniciarConversacionPrivada,
  enviarMensajePrivado
} from '../../src/flows/planilla_notas/usePlanillaNotasFlow.js';

describe('Flujo 5: Colaboración y Planilla de Notas (PLANILLA DE NOTAS.pdf)', () => {
  beforeEach(() => {
    resetPlanillaNotasFlow();
  });

  it('debe iniciar en paso 2 con las plantillas de referencia cargadas', () => {
    expect(planillaNotasState.currentStep).toBe(2);
    expect(planillaNotasState.subView).toBe('lista');
    expect(planillaNotasState.plantillaReferenciaTexto).toContain('ESTA ES LA PLANTILLA DE RAZON');
    expect(planillaNotasState.planillaEnviada).toBe(false);
  });

  it('debe transicionar por las vistas: lista -> chat_general -> info_usuario -> chat_privado', () => {
    // Abrir lista (Paso 3)
    abrirListaColaboracion();
    expect(planillaNotasState.subView).toBe('lista');
    expect(planillaNotasState.currentStep).toBe(3);

    // Seleccionar Delta Aliado (Paso 4)
    abrirChatDeltaGeneral();
    expect(planillaNotasState.subView).toBe('chat_delta_general');
    expect(planillaNotasState.currentStep).toBe(4);

    // Abrir información de usuario (Paso 5)
    abrirInfoUsuario();
    expect(planillaNotasState.subView).toBe('info_usuario');
    expect(planillaNotasState.currentStep).toBe(5);

    // Iniciar conversación privada (Paso 6)
    iniciarConversacionPrivada();
    expect(planillaNotasState.subView).toBe('chat_delta_privado');
    expect(planillaNotasState.currentStep).toBe(6);
  });

  it('debe registrar y enviar el mensaje privado solicitando facturación', () => {
    const cantInicial = planillaNotasState.mensajesPrivados.length;
    enviarMensajePrivado('Buenas tardes compañera, se finaliza instalación. Solicito facturación por favor.');

    expect(planillaNotasState.mensajesPrivados.length).toBe(cantInicial + 1);
    expect(planillaNotasState.planillaEnviada).toBe(true);
    const ultimo = planillaNotasState.mensajesPrivados[planillaNotasState.mensajesPrivados.length - 1];
    expect(ultimo.sender).toBe('tecnico');
    expect(ultimo.text).toContain('Solicito facturación');
  });
});
