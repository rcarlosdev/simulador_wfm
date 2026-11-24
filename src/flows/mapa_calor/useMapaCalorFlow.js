import { reactive } from 'vue';

const initialState = {
  iniciado: false, // Solo se activa cuando el usuario abre explícitamente Cobertura WiFi
  currentStep: 1, // Pasos del 1 al 8 según MAPA DE CALOR app H&B.pdf
  menuDetallesAbierto: false,
  plantillaCargada: false, // Paso 4: Mapeado de predio cargado
  serviciosDistribuidos: false, // Paso 5: Equipos MTA y Decos distribuidos
  mapaCalorVisible: false, // Paso 6: Visualización de mapa de calor y escala dBm
  activeLeftTab: 'plantilla', // 'plantilla', 'info', 'wifi', 'cables', 'equipos', 'plano'
  infoModalAbierto: false, // Paso 7: Modal de información de predio
  tipoPredio: 'casa', // 'casa' o 'apartamento'
  metrosCuadrados: 120, // 120 m² según Pág. 7
  certificacionEnviada: false, // Paso 8: Certificación enviada
  modalCertificacionAbierto: false
};

export const mapaCalorState = reactive({ ...initialState });

export function useMapaCalorFlow() {
  const resetMapaCalorFlow = () => {
    Object.assign(mapaCalorState, initialState);
  };

  const setMapaCalorStep = (step) => {
    mapaCalorState.currentStep = step;
  };

  const advanceMapaCalorStep = () => {
    if (mapaCalorState.currentStep < 8) {
      mapaCalorState.currentStep++;
    }
  };

  // Paso 1: Abrir menú tres puntos en Detalles de Actividad
  const abrirMenuDetalles = () => {
    mapaCalorState.menuDetallesAbierto = true;
    if (mapaCalorState.currentStep === 1) {
      mapaCalorState.currentStep = 2;
    }
  };

  // Paso 2: Seleccionar Cobertura Wifi en el menú
  const abrirCoberturaWifi = () => {
    mapaCalorState.iniciado = true;
    mapaCalorState.menuDetallesAbierto = false;
    mapaCalorState.currentStep = 3;
  };

  // Paso 3 y 4: Seleccionar opción Plantillas y cargar mapeado
  const seleccionarPlantilla = () => {
    mapaCalorState.plantillaCargada = true;
    if (mapaCalorState.currentStep === 3) {
      mapaCalorState.currentStep = 4;
    }
  };

  const confirmarMapeado = () => {
    mapaCalorState.plantillaCargada = true;
    mapaCalorState.activeLeftTab = 'equipos';
    if (mapaCalorState.currentStep === 4) {
      mapaCalorState.currentStep = 5;
    }
  };

  // Paso 5: Distribuir servicios en el plano
  const distribuirServicios = () => {
    mapaCalorState.serviciosDistribuidos = true;
    mapaCalorState.activeLeftTab = 'wifi';
    mapaCalorState.mapaCalorVisible = true;
    if (mapaCalorState.currentStep === 5) {
      mapaCalorState.currentStep = 6;
    }
  };

  // Paso 6: Validar mapa de calor y abrir Info de predio
  const abrirInfoPredio = () => {
    mapaCalorState.activeLeftTab = 'info';
    mapaCalorState.infoModalAbierto = true;
    if (mapaCalorState.currentStep === 6) {
      mapaCalorState.currentStep = 7;
    }
  };

  // Paso 7: Guardar datos de predio (Casa/Apto y metros)
  const guardarDatosPredio = (tipo = 'casa', metros = 120) => {
    mapaCalorState.tipoPredio = tipo;
    mapaCalorState.metrosCuadrados = metros;
    mapaCalorState.infoModalAbierto = false;
    mapaCalorState.activeLeftTab = 'plano';
    if (mapaCalorState.currentStep === 7) {
      mapaCalorState.currentStep = 8;
    }
  };

  // Paso 8: Enviar certificación
  const enviarCertificacion = () => {
    mapaCalorState.modalCertificacionAbierto = true;
    mapaCalorState.certificacionEnviada = true;
  };

  const cerrarModalCertificacion = () => {
    mapaCalorState.modalCertificacionAbierto = false;
  };

  return {
    mapaCalorState,
    resetMapaCalorFlow,
    setMapaCalorStep,
    advanceMapaCalorStep,
    abrirMenuDetalles,
    abrirCoberturaWifi,
    seleccionarPlantilla,
    confirmarMapeado,
    distribuirServicios,
    abrirInfoPredio,
    guardarDatosPredio,
    enviarCertificacion,
    cerrarModalCertificacion
  };
}
