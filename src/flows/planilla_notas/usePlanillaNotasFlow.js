import { reactive } from 'vue';
import { showToast } from '../../core/ui.js';

/**
 * Módulo del Proceso: Colaboración y Plantilla de Notas al Delta (PLANILLA DE NOTAS.pdf)
 */

export function getInitialPlanillaNotasState() {
  return {
    iniciado: false,
    currentStep: 2, // Inicia en Paso 2 (pulsar mensajería en Detalles de actividad)
    subView: 'lista', // 'lista' | 'chat_delta_general' | 'info_usuario' | 'chat_delta_privado'
    activeTab: 'chats', // 'chats' | 'historia' | 'notificaciones'
    deltaUser: {
      nombre: 'EZENTIS_DIAZ REYES ALISSON NATALLY',
      shortName: 'EZENTIS_DIAZ REYES ALI...',
      initials: 'ED',
      rol: 'Soporte Delta Aliado',
      online: true
    },
    // Plantilla de referencia del chat general (Págs 4 y 5)
    plantillaReferenciaTexto: `BUEN DIA, COMPAÑEROS EL DIA DE HOY QUEDO CON USTEDES CON APOYO DELTA RECORDAR QUE TODO SE HACE POR INTERNO W.F Y ESTA COFENRECIA NO LA TOMO PARA GESTIONES

LES RECUERDO ESTA ES LA PLANTILLA DE RAZON
Estado: RAZON (LETRA)
Cuenta:
OT:
Nodo:
Market:
Dirrección:

Descripcion: (DE PREDIO)

Nombre titular:

Observación: (NOTAS DE POR QUE SE RAZONA EXPECICANDO SI LO ATIENDEN O NO)

Tecnico:
Cedula:
Supervisor:
Celular: (DE SUPERVISOR)

ESTA PLANTILLA PARA LOS ERRORES
Para errores

Ot
Cuenta
Tecnico`,

    // Mensajes del chat privado con la Delta Alisson (Pág 7)
    mensajesPrivados: [
      {
        id: 1,
        sender: 'tecnico',
        author: 'Joseb Garcia',
        time: '10:46 AM',
        text: `Equipos Recogidos: No

Servicio: Instalacion

Equipos instalados:
Modem: 38:3F:B3:97:5C:1B

Deco 1: 254871673753
Card: 25487167375V

Deco 2: 254871678602
Card: 25487167860V

1 Punto de datos:
2 Punto de datos:
1 Punto de telefono: 2 mts
2 Punto de telefono: 5 mts

Tecnico: Joseb garcia
Sap: 219544

Cliente: ALEJANDRINA RODRIGUEZ
Atiende: ALEJANDRINA RODRIGUEZ
Cc: 1020849050
Celular: 3134355872

Supervisor: Roger encizo

OBSERVACIONES: Se realiza instalacion no cabliada de 1 modem, 2 decos, 2 punto de telefono. se entregan 2 controles configurados. Se dejan unos puntos sueltos a peticion del usuario.`
      },
      {
        id: 2,
        sender: 'tecnico',
        author: 'Joseb Garcia',
        time: '10:46 AM',
        text: 'Buenos dias compañera me regala facturacion porfa'
      }
    ],
    planillaEnviada: false
  };
}

export const planillaNotasState = reactive(getInitialPlanillaNotasState());

export function resetPlanillaNotasFlow() {
  Object.assign(planillaNotasState, getInitialPlanillaNotasState());
}

export function setPlanillaStep(step) {
  planillaNotasState.currentStep = step;
}

export function advancePlanillaStep(step) {
  if (step > (planillaNotasState.currentStep || 0)) {
    planillaNotasState.currentStep = step;
  }
}

export function abrirListaColaboracion() {
  planillaNotasState.iniciado = true;
  planillaNotasState.subView = 'lista';
  advancePlanillaStep(3);
}

export function abrirChatDeltaGeneral() {
  planillaNotasState.subView = 'chat_delta_general';
  advancePlanillaStep(4);
}

export function abrirInfoUsuario() {
  planillaNotasState.subView = 'info_usuario';
  advancePlanillaStep(5);
}

export function iniciarConversacionPrivada() {
  planillaNotasState.subView = 'chat_delta_privado';
  advancePlanillaStep(6);
}

export function enviarMensajePrivado(texto) {
  if (!texto || !texto.trim()) return;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
  planillaNotasState.mensajesPrivados.push({
    id: Date.now(),
    sender: 'tecnico',
    author: 'Joseb Garcia',
    time: timeStr,
    text: texto
  });
  planillaNotasState.planillaEnviada = true;
  showToast('✓ Mensaje y planilla enviados a la Delta de soporte.', 'success');
}

export function usePlanillaNotasFlow() {
  return {
    planillaNotasState,
    resetPlanillaNotasFlow,
    setPlanillaStep,
    advancePlanillaStep,
    abrirListaColaboracion,
    abrirChatDeltaGeneral,
    abrirInfoUsuario,
    iniciarConversacionPrivada,
    enviarMensajePrivado
  };
}
