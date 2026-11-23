import { describe, it, expect, beforeEach } from 'vitest';
import {
  brownfieldState,
  resetBrownfieldFlow,
  activarOntInternet,
  verificarDesinstalacionAutomatica,
  activarTvDeco,
  activarUltraWifi,
  ejecutarComandoCambiarServicio,
  advanceBrownfieldStep
} from '../../src/flows/brownfield/useBrownfieldFlow.js';
import {
  validarReglaMigracionBrownfield,
  BUSINESS_ERROR_CODES
} from '../../src/core/businessRules.js';

describe('Flujo de Activación Brownfield (ACTIVACION BRONMFIELD.pdf)', () => {
  beforeEach(() => {
    resetBrownfieldFlow();
  });

  describe('Regla de Oro Brownfield (Páginas 4 a 13)', () => {
    it('bloquea el intento de instalar Television si la ONT de Internet no ha sido instalada', () => {
      const res = validarReglaMigracionBrownfield('tv', true, false);
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.MIGRACION_ONT_PRIMERO);
      expect(res.codigo).toBe('OFSC-601');
      expect(res.mensaje).toContain('La orden es una migracion por favor instale el MTA/ONT en el servicio de internet correspondiente');
    });

    it('bloquea el intento de Desinstalación si la ONT de Internet no ha sido instalada', () => {
      const res = validarReglaMigracionBrownfield('desinst', true, false);
      expect(res.valido).toBe(false);
      expect(res.codigo).toBe(BUSINESS_ERROR_CODES.MIGRACION_ONT_PRIMERO);
    });

    it('permite la instalación de Internet/Telefonía desde el inicio', () => {
      const res = validarReglaMigracionBrownfield('int', true, false);
      expect(res.valido).toBe(true);
    });

    it('permite Television una vez la ONT ha sido instalada exitosamente', () => {
      const res = validarReglaMigracionBrownfield('tv', true, true);
      expect(res.valido).toBe(true);
    });

    it('no aplica bloqueo si la actividad no es de tipo Brownfield / migración', () => {
      const res = validarReglaMigracionBrownfield('tv', false, false);
      expect(res.valido).toBe(true);
    });
  });

  describe('Secuencia Operativa Oficial Brownfield', () => {
    it('Etapa 1: Instala la ONT de Internet (CPE FZG F680)', () => {
      expect(brownfieldState.ontInstalada).toBe(false);
      expect(brownfieldState.equiposInstalados.length).toBe(0);

      activarOntInternet();

      expect(brownfieldState.ontInstalada).toBe(true);
      expect(brownfieldState.equiposInstalados.length).toBe(1);
      const ont = brownfieldState.equiposInstalados[0];
      expect(ont.serial).toBe('C0:94:AD:45:B2:98');
      expect(ont.tipo).toBe('CPE FZG F680');
      expect(ont.ok).toBe(true);
      expect(brownfieldState.stepNumber).toBe(2);
    });

    it('Etapa 2: Verifica la desinstalación automática en inventarios', () => {
      activarOntInternet();
      expect(brownfieldState.desinstalacionAutomaticaVerificada).toBe(false);

      verificarDesinstalacionAutomatica();

      expect(brownfieldState.desinstalacionAutomaticaVerificada).toBe(true);
      expect(brownfieldState.equiposDesinstalados.length).toBe(5);
      expect(brownfieldState.equiposDesinstalados.every(e => e.ok)).toBe(true);
      expect(brownfieldState.stepNumber).toBe(3);
    });

    it('Etapa 3: Instala el Decodificador Nuevo de TV (ITV JIP DTC9432)', () => {
      activarOntInternet();
      verificarDesinstalacionAutomatica();

      activarTvDeco();

      expect(brownfieldState.tvInstalada).toBe(true);
      expect(brownfieldState.equiposInstalados.some(e => e.serial === '230619887780')).toBe(true);
      expect(brownfieldState.stepNumber).toBe(4);
    });

    it('Etapa 4: Instala el Extensor UltraWiFi Mesh (CPE FHS MESHFRSR120C)', () => {
      activarOntInternet();
      verificarDesinstalacionAutomatica();
      activarTvDeco();

      activarUltraWifi();

      expect(brownfieldState.ultraWifiInstalado).toBe(true);
      expect(brownfieldState.equiposInstalados.some(e => e.serial === '695DDE8910F48BD5')).toBe(true);
      expect(brownfieldState.stepNumber).toBe(5);
    });

    it('Etapa 5: Reutilización de equipo cliente mediante comando Cambiar servicio', () => {
      activarOntInternet();
      verificarDesinstalacionAutomatica();
      activarTvDeco();
      activarUltraWifi();

      expect(brownfieldState.reutilizacionComandoEjecutado).toBe(false);
      expect(brownfieldState.equipoReutilizado.ok).toBe(false);
      expect(brownfieldState.equipoReutilizado.serial).toBe('254889543645');

      ejecutarComandoCambiarServicio(1);

      expect(brownfieldState.reutilizacionComandoEjecutado).toBe(true);
      expect(brownfieldState.equipoReutilizado.ok).toBe(true);
      expect(brownfieldState.equipoReutilizado.idCortoActual).toBe(1);
      expect(brownfieldState.equipoReutilizado.estado).toContain('EXITOSO');
      expect(brownfieldState.stepNumber).toBe(6);
    });
  });
});
