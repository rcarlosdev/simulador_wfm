import { describe, it, expect } from 'vitest';
import { SIMULADOR_DATA } from '../src/js/data.js';

describe('Orden Cronológico Ascendente de Actividades', () => {
  function parseHorarioToMinutes(act) {
    if (!act) return 9999;
    const timeStr = act.horario || act.inicio_fin || act.ventana_entrega || act.titulo || '';
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return 9999;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  it('verifica que las actividades del único técnico de prueba están ordenadas en orden horario ascendente', () => {
    expect(SIMULADOR_DATA.usuarios_prueba.length).toBe(1);
    const user = SIMULADOR_DATA.usuarios_prueba.find(u => u.cedula === '1234567890');
    expect(user).toBeDefined();

    const acts = user.actividades;
    expect(acts.length).toBe(4);

    // 1. Almacén 07:00 AM
    expect(acts[0].id).toBe('ACT-ALM-1');
    expect(acts[0].horario).toContain('07:00 AM');

    // 2. Cliente Traslados 07:30 AM
    expect(acts[1].id).toBe('ACT-CLI-1');
    expect(acts[1].horario).toContain('07:30 AM');

    // 3. Cliente Brownfield 08:00 AM
    expect(acts[2].id).toBe('ACT-CLI-BROWNFIELD');
    expect(acts[2].horario).toContain('08:00 AM');

    // 4. Cliente DTH 12:30 PM
    expect(acts[3].id).toBe('ACT-CLI-2');
    expect(acts[3].horario).toContain('12:30 PM');

    // Validar minutos ascendentes estrictos
    const minutos = acts.map(parseHorarioToMinutes);
    for (let i = 0; i < minutos.length - 1; i++) {
      expect(minutos[i]).toBeLessThanOrEqual(minutos[i + 1]);
    }
  });

  it('ordena dinámicamente cualquier conjunto desordenado de actividades por fecha/hora ascendente', () => {
    const desordenadas = [
      { id: 'A3', horario: '12:30 PM - 01:30 PM' },
      { id: 'A1', horario: '07:00 AM - 07:30 AM' },
      { id: 'A4', horario: '04:00 PM - 05:00 PM' },
      { id: 'A2', horario: '08:00 AM - 11:30 AM' }
    ];

    const ordenadas = [...desordenadas].sort((a, b) => parseHorarioToMinutes(a) - parseHorarioToMinutes(b));
    expect(ordenadas.map(a => a.id)).toEqual(['A1', 'A2', 'A3', 'A4']);
  });
});
