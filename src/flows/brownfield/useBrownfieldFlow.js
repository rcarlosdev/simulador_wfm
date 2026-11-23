import { reactive } from 'vue';

/**
 * Módulo del Proceso: Activación Brownfield (Migración FTTH con Reutilización)
 * Basado en ACTIVACION BRONMFIELD.pdf
 * Regla de Oro: En migración Brownfield, el MTA/ONT de Internet se instala PRIMERO
 * antes que Televisión o Desinstalación. La migración ejecuta la desinstalación
 * automática de los equipos viejos del cliente y permite reutilizar decodificadores
 * ejecutando el comando 'Cambiar servicio' en el portal de comandos.
 */

export function getInitialBrownfieldState() {
  return {
    stepNumber: 1, // 1: ONT Internet, 2: Inventario/Desinstalación, 3: TV, 4: UltraWiFi, 5: Reutilización comando, 6: Cierre
    ontInstalada: false,
    desinstalacionAutomaticaVerificada: false,
    tvInstalada: false,
    ultraWifiInstalado: false,
    reutilizacionComandoEjecutado: false,
    selectedServiceBrownfield: null,
    advertenciaMigracionVisible: false,
    advertenciaMensaje: 'Advertencia: La orden es una migracion por favor instale el MTA/ONT en el servicio de internet correspondiente y valide que el resultado de la activacion sea exitoso',

    // Datos del equipo cliente para reutilización
    equipoReutilizado: {
      serial: '254889543645',
      tipo: 'ITV N2P 6',
      modelo: 'NL 6105RC',
      fabricante: 'N2P',
      mac: 'A8:F4:70:C2:84:89',
      chip: '37555E55C5',
      idCortoActual: 2,
      idCortoNuevo: 1,
      servicioActual: '2 - ARR DECO ADI;TV IP DIG PL',
      servicioNuevo: '1 - TV IP DIG PL;WIN+',
      estado: 'Pendiente de comando',
      ok: false
    },

    // Equipos viejos a desinstalar automáticamente en inventario
    equiposDesinstalados: [
      { id: 1, nombre: 'DBV OVI 7', modelo: 'OVI', serial: '254871673753', tiempo: 45, ok: true },
      { id: 2, nombre: 'DBV NL3 8', modelo: 'NL3', serial: '254871678602', tiempo: 50, ok: true },
      { id: 3, nombre: 'MTA RTA 9', modelo: 'RTA', serial: '38:3F:B3:97:5C:1B', tiempo: 60, ok: true },
      { id: 4, nombre: 'CAR NGR NGR', modelo: 'NAGRA', serial: '25487167375V', tiempo: 30, ok: true },
      { id: 5, nombre: 'CAR NGR NGR', modelo: 'NAGRA', serial: '25487167860V', tiempo: 30, ok: true }
    ],

    // Equipos nuevos instalados
    equiposInstalados: []
  };
}

export const brownfieldState = reactive(getInitialBrownfieldState());

export function resetBrownfieldFlow() {
  Object.assign(brownfieldState, getInitialBrownfieldState());
}

export function setBrownfieldStep(step) {
  brownfieldState.stepNumber = step;
}

export function advanceBrownfieldStep(step) {
  if (step > brownfieldState.stepNumber) {
    brownfieldState.stepNumber = step;
  }
}

/**
 * Activación exitosa de ONT de Internet (Etapa 1)
 */
export function activarOntInternet() {
  brownfieldState.ontInstalada = true;
  brownfieldState.advertenciaMigracionVisible = false;
  // Agregar ONT a instalados
  if (!brownfieldState.equiposInstalados.some(e => e.serial === 'C0:94:AD:45:B2:98')) {
    brownfieldState.equiposInstalados.push({
      id: 'ONT-1',
      tipo: 'CPE FZG F680',
      modelo: 'F680',
      serial: 'C0:94:AD:45:B2:98',
      mac: 'ZT:EG:CE:85:EF:69',
      servicio: '10 - INT150+150MB;MODEM WIFI;TELEF LOC FO -',
      ubicacion: 'Alcoba Principal',
      tiempo: 80,
      ok: true
    });
  }
  advanceBrownfieldStep(2);
}

/**
 * Verificación de desinstalación automática en inventario (Etapa 2)
 */
export function verificarDesinstalacionAutomatica() {
  brownfieldState.desinstalacionAutomaticaVerificada = true;
  advanceBrownfieldStep(3);
}

/**
 * Activación exitosa de Televisión / Deco Nuevo (Etapa 3)
 */
export function activarTvDeco() {
  brownfieldState.tvInstalada = true;
  if (!brownfieldState.equiposInstalados.some(e => e.serial === '230619887780')) {
    brownfieldState.equiposInstalados.push({
      id: 'DECO-1',
      tipo: 'ITV JIP DTC9432',
      modelo: 'DTC9432',
      serial: '230619887780',
      mac: '00:15:c0:7d:17:9f',
      servicio: '4 - ARR DECO ADI;TV IP DIG PL',
      ubicacion: 'Alcoba Principal',
      tiempo: 45,
      ok: true
    });
  }
  advanceBrownfieldStep(4);
}

/**
 * Activación exitosa de UltraWiFi Mesh (Etapa 4)
 */
export function activarUltraWifi() {
  brownfieldState.ultraWifiInstalado = true;
  if (!brownfieldState.equiposInstalados.some(e => e.serial === '695DDE8910F48BD5')) {
    brownfieldState.equiposInstalados.push({
      id: 'MESH-1',
      tipo: 'CPE FHS MESHFRSR120C',
      modelo: 'MESHFRSR120C',
      serial: '695DDE8910F48BD5',
      servicio: '1 - SRV ULTRAWIF',
      ubicacion: 'Alcoba Auxiliar 1',
      tiempo: 35,
      ok: true
    });
  }
  advanceBrownfieldStep(5);
}

/**
 * Ejecución del comando Cambiar servicio para reutilizar el equipo del cliente (Etapa 5)
 */
export function ejecutarComandoCambiarServicio(idCorto = 1) {
  brownfieldState.reutilizacionComandoEjecutado = true;
  brownfieldState.equipoReutilizado.idCortoActual = idCorto;
  brownfieldState.equipoReutilizado.estado = 'EXITOSO - Asociado';
  brownfieldState.equipoReutilizado.ok = true;
  advanceBrownfieldStep(6);
}

export function useBrownfieldFlow() {
  return {
    brownfieldState,
    resetBrownfieldFlow,
    setBrownfieldStep,
    advanceBrownfieldStep,
    activarOntInternet,
    verificarDesinstalacionAutomatica,
    activarTvDeco,
    activarUltraWifi,
    ejecutarComandoCambiarServicio
  };
}
