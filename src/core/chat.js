import { reactive } from 'vue';
import { authState } from './auth.js';
import { showToast } from './ui.js';

/**
 * Módulo de Chat y Colaboración con la Mesa de Ayuda (Delta)
 */

export const chatState = reactive({
  timerSeconds: 1760, // 29:20
  chatTimerStr: '29:20',
  chatMessages: [
    {
      id: 1,
      sender: 'delta',
      author: 'DELTA ALIADO EZENTIS',
      text: 'LES RECUERDO ESTA ES LA PLANTILLA DE RAZÓN:\nEstado: RAZON (LETRA)\nCuenta:\nOT:\nNodo:\nMarket:\nDirección:\nDescripción:\nNombre titular:\nObservación: (NOTAS DE POR QUÉ SE RAZONA ESPECIFICANDO SI LO ATIENDEN O NO)',
      time: '08:31 AM'
    },
    {
      id: 2,
      sender: 'delta',
      author: 'DELTA ALIADO EZENTIS',
      text: 'Buen día compañero, por favor confirmar cuando inicie la actividad de almacén y reporte seriales.',
      time: '08:45 AM'
    }
  ]
});

export function tickChatTimer() {
  if (chatState.timerSeconds > 0) {
    chatState.timerSeconds--;
    const mins = Math.floor(chatState.timerSeconds / 60);
    const secs = chatState.timerSeconds % 60;
    chatState.chatTimerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

export function sendChatMessage(text) {
  if (!text || !text.trim()) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  chatState.chatMessages.push({
    id: Date.now(),
    sender: 'technician',
    author: authState.currentUser?.nombre || 'TÉCNICO',
    text: text.trim(),
    time: timeStr
  });

  setTimeout(() => {
    chatState.chatMessages.push({
      id: Date.now() + 1,
      sender: 'delta',
      author: 'DELTA ALIADO EZENTIS',
      text: 'Recibido compañero, datos verificados y validados en el sistema. Puedes proceder con la certificación.',
      time: timeStr
    });
    showToast('Nuevo mensaje del Delta recibido.');
  }, 1500);
}
