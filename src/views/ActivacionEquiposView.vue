<template>
  <div class="simulator-screen screen-activacion-auto screen-active" id="screen-activacion-auto">
    <!-- BARRA SUPERIOR OFSC -->
    <div class="ofsc-header-bar">
      <div class="ofsc-header-left">
        <span class="ofsc-header-menu-icon" @click="openDrawer" title="Menú lateral">☰</span>
        <span class="ofsc-header-search-icon" @click="showToast('Búsqueda rápida activada')">🔍</span>
      </div>
      <div class="ofsc-header-title">Activacion Servicios</div>
      <div class="ofsc-header-right">
        <span class="ofsc-header-time">{{ state.clockTime }}</span>
      </div>
    </div>

    <!-- Franja Verde Institucional Oficial -->
    <div class="ofsc-green-banner">
      <span>Inventarios de actividad</span>
    </div>

    <!-- Mensajes de Información del Sistema -->
    <div class="ofsc-alert-box ofsc-alert-info" v-if="showAlertCheckUbicacion">
      <span class="alert-icon">ℹ</span>
      <span>Informacion: Debe seleccionar el check de ubicaciones para seleccionar ubicacion</span>
    </div>

    <div class="ofsc-alert-box ofsc-alert-success" v-if="showAlertServiciosAsocOk">
      <span class="alert-icon">✓</span>
      <span>Informacion: Servicios asociados correctamente</span>
    </div>

    <div class="ofsc-alert-box ofsc-alert-success" v-if="showAlertServiciosInstOfsc">
      <span class="alert-icon">✓</span>
      <span>Informacion: Servicios instalados en OFSC correctamente</span>
    </div>

    <!-- Migas de Pan / Breadcrumbs Oficiales -->
    <div class="ofsc-breadcrumb-row">
      <span>Instalacion</span>
      <span v-if="selectedServiceLabel" style="margin-left:6px;font-weight:700;color:var(--ofs-red);">
        ▸ {{ selectedServiceLabel }}
      </span>
      <span v-if="stepNumber > 1" style="margin-left:6px;color:#888;">
        (Paso {{ stepNumber }})
      </span>
    </div>

    <!-- Barra de Menú y Número de OT -->
    <div class="ofsc-menu-bar">
      <div class="ofsc-menu-btn-wrap">
        <button
          type="button"
          class="btn-ofsc-menu-nav"
          @click.stop="navMenuOpen = !navMenuOpen"
        >
          Menu
        </button>

        <div class="ofsc-nav-dropdown" :class="{ 'is-open': navMenuOpen }">
          <div class="nav-drop-item" @click.stop="reiniciarProceso">
            <span>Reiniciar proceso</span>
          </div>
          <div class="nav-drop-item" @click.stop="showToast('Servicios de la orden cargados')">
            <span>Ver servicios OT</span>
          </div>
          <div class="nav-drop-item" @click.stop="cerrarFinal">
            <span>Regresar a OFSC</span>
          </div>
        </div>
      </div>

      <div class="ofsc-ot-label">
        Servicios OT: <strong>{{ state.currentActivity?.ot || '481787893_O_CO_661' }}</strong>
      </div>
    </div>

    <!-- Contenedor Desplazable del Formulario Paso a Paso -->
    <div class="ofsc-form-scroll-body" id="ofsc-form-scroll-body">

      <!-- ====================================================================
           PASO 1: SELECCIÓN DEL SERVICIO / TECNOLOGÍA EN EL SELECT DESPLEGABLE
           ==================================================================== -->
      <div class="ofsc-control-group" style="margin-bottom:14px;">
        <label class="ofsc-label" style="font-weight:700;">Servicio a Gestionar:</label>
        <div
          class="ofsc-select-box"
          @click="serviceDropdownOpen = !serviceDropdownOpen"
        >
          <span style="font-weight:600;">{{ selectedServiceLabel || 'Seleccione un servicio / tecnología' }}</span>
          <span class="select-arrow">▼</span>
        </div>

        <div class="ofsc-select-dropdown" v-if="serviceDropdownOpen" style="display:block;">
          <div
            class="select-drop-option"
            :class="{ 'selected': selectedService === 'tv' }"
            @click="onSelectServiceOption('tv')"
          >
            Television
          </div>
          <div
            class="select-drop-option"
            :class="{ 'selected': selectedService === 'int' }"
            @click="onSelectServiceOption('int')"
          >
            Internet/Telefonia
          </div>
          <div
            class="select-drop-option"
            :class="{ 'selected': selectedService === 'desinst' }"
            @click="onSelectServiceOption('desinst')"
          >
            Desinstalacion
          </div>
        </div>
      </div>

      <!-- PANTALLA INICIAL SI AÚN NO SE HA ELEGIDO SERVICIO -->
      <div v-if="stepNumber === 1 && !selectedService" class="ofsc-step-view">
        <div class="ofsc-control-group">
          <label class="ofsc-label">Ubicacion:</label>
          <div class="ofsc-select-box" @click="serviceDropdownOpen = true">
            <span>Seleccione una ubicacion</span>
            <span class="select-arrow">▼</span>
          </div>
        </div>
        <div class="ofsc-btn-row-bottom">
          <button type="button" class="btn-ofsc-cerrar-gray" @click="cerrarFinal">Cerrar</button>
        </div>
      </div>

      <!-- ====================================================================
           FLUJO TELEVISIÓN (PASOS DESBLOQUEADOS SECUENCIALMENTE)
           ==================================================================== -->
      <div v-if="selectedService === 'tv'">

        <!-- PASO 2 (TV): SELECCIÓN DE UBICACIÓN INICIAL -->
        <div class="ofsc-step-view" v-if="stepNumber === 2">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div
              class="ofsc-select-box"
              @click="ubicacionTvDropdownOpen = !ubicacionTvDropdownOpen"
            >
              <span>{{ ubicacionTvSelected }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <div class="ofsc-select-dropdown" v-if="ubicacionTvDropdownOpen" style="display:block;">
              <div class="select-drop-option" @click="onChooseTvUbicacion('Default')">Default</div>
              <div class="select-drop-option" @click="onChooseTvUbicacion('Alcoba Auxiliar 1')">Alcoba Auxiliar 1</div>
              <div class="select-drop-option" @click="onChooseTvUbicacion('Alcoba Auxiliar 2')">Alcoba Auxiliar 2</div>
              <div class="select-drop-option" @click="onChooseTvUbicacion('Sala')">Sala</div>
            </div>
          </div>
          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 1">Atrás</button>
          </div>
        </div>

        <!-- PASO 3 (TV): TABLA DE SERVICIOS TV -->
        <div class="ofsc-step-view" v-if="stepNumber === 3">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div class="ofsc-static-val">{{ ubicacionTvSelected }}</div>
          </div>

          <div class="ofsc-control-group">
            <label class="ofsc-label" style="font-weight:700;">Servicios Disponibles</label>
            <div class="ofsc-table-frame">
              <div class="table-frame-header">
                <span style="width:28px;"></span>
                <span>Id Corto - Descripcion</span>
                <span style="width:40px;">Tipo</span>
              </div>
              <div
                v-for="s in tvServiciosList"
                :key="s.id"
                class="table-frame-row"
                :class="{ 'selected': selectedTvServicioId === s.id }"
                @click="onChooseTvServicio(s.id)"
              >
                <span style="width:28px;text-align:center;">
                  <input type="radio" name="r-tv-serv" :checked="selectedTvServicioId === s.id">
                </span>
                <span :style="{ fontWeight: selectedTvServicioId === s.id ? '700' : 'normal' }">{{ s.nombre }}</span>
                <span class="tag-adi">{{ s.tipo }}</span>
              </div>
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 2">Atrás</button>
          </div>
        </div>

        <!-- PASO 4 (TV): MODIFICAR UBICACIÓN PREDIO -->
        <div class="ofsc-step-view" v-if="stepNumber === 4">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div class="ofsc-static-val">{{ ubicacionTvSelected }}</div>
          </div>

          <div class="ofsc-control-group">
            <label class="ofsc-label">Servicio Seleccionado:</label>
            <div class="ofsc-static-val" style="color:var(--ofs-green-light);">
              {{ tvServiciosList.find(s => s.id === selectedTvServicioId)?.nombre || '1- TV DIGI PLUS;ARR DECO' }}
            </div>
          </div>

          <div class="ofsc-checkbox-line">
            <label class="ofsc-chk-lbl">
              <input type="checkbox" v-model="tvModificarUbicacion">
              <span>Modificar Ubicacion</span>
            </label>
          </div>

          <div class="ofsc-control-group" v-if="tvModificarUbicacion" style="margin-top:8px;">
            <label class="ofsc-label">Ubicacion en Predio:</label>
            <div
              class="ofsc-select-box"
              @click="tvPredioDropdownOpen = !tvPredioDropdownOpen"
            >
              <span>{{ tvPredioUbicacion }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <div class="ofsc-select-dropdown" v-if="tvPredioDropdownOpen" style="display:block;">
              <div class="select-drop-option" @click="onChooseTvPredio('Alcoba Auxiliar 1')">Alcoba Auxiliar 1</div>
              <div class="select-drop-option" @click="onChooseTvPredio('Alcoba Auxiliar 2')">Alcoba Auxiliar 2</div>
              <div class="select-drop-option" @click="onChooseTvPredio('Alcoba Auxiliar 3')">Alcoba Auxiliar 3</div>
              <div class="select-drop-option" @click="onChooseTvPredio('Habitación Principal')">Habitación Principal</div>
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" style="margin-right:8px;" @click="stepNumber = 3">Atrás</button>
            <button type="button" class="btn-ofsc-activar-green" style="flex:none;padding:8px 18px;" @click="stepNumber = 5">Continuar al Inventario ▸</button>
          </div>
        </div>

        <!-- PASO 5 (TV): INVENTARIO DECO / MOSTRAR MÁS TECNOLOGÍAS -->
        <div class="ofsc-step-view" v-if="stepNumber === 5">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div class="ofsc-static-val">{{ tvPredioUbicacion }}</div>
          </div>

          <div class="ofsc-section-title-line">
            <span class="sec-title">Inventario Equipos Decodificadores</span>
          </div>

          <div class="ofsc-checkbox-line" style="margin-bottom:8px;">
            <label class="ofsc-chk-lbl">
              <input type="checkbox" v-model="tvMostrarMasTec">
              <span>Mostrar mas Tecnologias</span>
            </label>
          </div>

          <div style="font-size:0.68rem;color:#999;margin-bottom:4px;">
            Inventario: <strong>TECNICO</strong> | Tip-Fab-Mod-Ser-Chip-Mac-Est
          </div>

          <div class="ofsc-equipment-list">
            <div
              v-for="eq in tvDecosFiltrados"
              :key="eq.serial"
              class="eq-item"
              :class="{ 'selected': selectedTvDecoSerial === eq.serial }"
              @click="onChooseTvDeco(eq.serial)"
            >
              {{ eq.label }}
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 4">Atrás</button>
          </div>
        </div>

        <!-- PASO 6 (TV): CONTROL REMOTO -->
        <div class="ofsc-step-view" v-if="stepNumber === 6">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Decodificador Asociado:</label>
            <div class="ofsc-static-val" style="color:var(--ofs-green-light);font-family:monospace;font-size:0.75rem;">
              SN: {{ selectedTvDecoSerial }}
            </div>
          </div>

          <div class="ofsc-control-group" style="margin-top:12px;">
            <label class="ofsc-label">Control Remoto:</label>
            <div
              class="ofsc-select-box"
              @click="tvControlDropdownOpen = !tvControlDropdownOpen"
            >
              <span>{{ selectedTvControl }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <div class="ofsc-select-dropdown" v-if="tvControlDropdownOpen" style="display:block;">
              <div class="select-drop-option" @click="onChooseTvControl('Universal DVB, ATSC y DTH')">
                Universal DVB, ATSC y DTH
              </div>
              <div class="select-drop-option" @click="onChooseTvControl('Motorola DRC800')">
                Motorola DRC800
              </div>
              <div class="select-drop-option" @click="onChooseTvControl('Estándar Claro HD')">
                Estándar Claro HD
              </div>
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 5">Atrás</button>
          </div>
        </div>

        <!-- PASO 7 (TV): TARJETA VIRTUAL -->
        <div class="ofsc-step-view" v-if="stepNumber === 7">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Control Remoto:</label>
            <div class="ofsc-static-val">{{ selectedTvControl }}</div>
          </div>

          <div class="ofsc-section-title-line">
            <span class="sec-title">Inventario Tarjetas Virtuales</span>
          </div>
          <div style="font-size:0.68rem;color:#999;margin-bottom:4px;">
            Selecciona la tarjeta virtual de tu inventario:
          </div>

          <div class="ofsc-equipment-list">
            <div
              v-for="t in tvTarjetasList"
              :key="t.serial"
              class="eq-item"
              :class="{ 'selected': selectedTvTarjetaSerial === t.serial }"
              @click="onChooseTvTarjeta(t.serial)"
            >
              {{ t.label }}
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 6">Atrás</button>
          </div>
        </div>

        <!-- PASO 8 (TV): RESUMEN ASOCIADOS Y ACTIVAR -->
        <div class="ofsc-step-view" v-if="stepNumber === 8">
          <div class="ofsc-section-title-line">
            <span class="sec-title">SERVICIOS ASOCIADOS TV</span>
          </div>
          <div style="font-size:0.66rem;color:#888;margin-bottom:4px;">
            Ub-Tip-Fab-Mod-Ser-Smc-Chip-Serv-Cr-Ft-Ea-En
          </div>

          <div class="ofsc-asociados-card">
            {{ tvPredioUbicacion }} - ITV_NIP - NL-6105RB - SN:{{ selectedTvDecoSerial }} - SMC:{{ selectedTvTarjetaSerial }} - TV DIGI PLUS;ARR DECO ADI - {{ selectedTvControl }} - Tech - AS
          </div>

          <div class="ofsc-action-row">
            <button
              type="button"
              class="btn-ofsc-activar-green"
              @click="openConfirmModal('tv')"
            >
              Activar Servicios
            </button>
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 7">Atrás</button>
          </div>
        </div>

      </div>

      <!-- ====================================================================
           FLUJO INTERNET / TELEFONÍA (PASOS DESBLOQUEADOS SECUENCIALMENTE)
           ==================================================================== -->
      <div v-else-if="selectedService === 'int'">

        <!-- PASO 2 (INT): SELECCIÓN DE UBICACIÓN INTERNET -->
        <div class="ofsc-step-view" v-if="stepNumber === 2">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div
              class="ofsc-select-box"
              @click="ubicacionIntDropdownOpen = !ubicacionIntDropdownOpen"
            >
              <span>{{ ubicacionIntSelected }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <div class="ofsc-select-dropdown" v-if="ubicacionIntDropdownOpen" style="display:block;">
              <div class="select-drop-option" @click="onChooseIntUbicacion('Default')">Default</div>
              <div class="select-drop-option" @click="onChooseIntUbicacion('Alcoba Auxiliar 1')">Alcoba Auxiliar 1</div>
              <div class="select-drop-option" @click="onChooseIntUbicacion('Alcoba Auxiliar 2')">Alcoba Auxiliar 2</div>
              <div class="select-drop-option" @click="onChooseIntUbicacion('Sala')">Sala</div>
            </div>
          </div>
          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 1">Atrás</button>
          </div>
        </div>

        <!-- PASO 3 (INT): SERVICIOS INTERNET -->
        <div class="ofsc-step-view" v-if="stepNumber === 3">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div class="ofsc-static-val">{{ ubicacionIntSelected }}</div>
          </div>

          <div class="ofsc-control-group">
            <label class="ofsc-label" style="font-weight:700;">Servicios Internet / Telefonía</label>
            <div class="ofsc-table-frame">
              <div class="table-frame-header">
                <span style="width:28px;"></span>
                <span>Id Corto - Descripcion - Lineas</span>
              </div>
              <div
                v-for="s in intServiciosList"
                :key="s.id"
                class="table-frame-row"
                :class="{ 'selected': selectedIntServicioId === s.id }"
                @click="onChooseIntServicio(s.id)"
              >
                <span style="width:28px;text-align:center;">
                  <input type="radio" name="r-int-serv" :checked="selectedIntServicioId === s.id">
                </span>
                <span :style="{ fontWeight: selectedIntServicioId === s.id ? '700' : 'normal' }">{{ s.nombre }}</span>
              </div>
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 2">Atrás</button>
          </div>
        </div>

        <!-- PASO 4 (INT): MODIFICAR UBICACIÓN INTERNET -->
        <div class="ofsc-step-view" v-if="stepNumber === 4">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div class="ofsc-static-val">{{ ubicacionIntSelected }}</div>
          </div>

          <div class="ofsc-checkbox-line">
            <label class="ofsc-chk-lbl">
              <input type="checkbox" v-model="intModificarUbicacion">
              <span>Modificar Ubicacion</span>
            </label>
          </div>

          <div class="ofsc-control-group" v-if="intModificarUbicacion" style="margin-top:8px;">
            <label class="ofsc-label">Ubicacion en Predio:</label>
            <div
              class="ofsc-select-box"
              @click="intPredioDropdownOpen = !intPredioDropdownOpen"
            >
              <span>{{ intPredioUbicacion }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <div class="ofsc-select-dropdown" v-if="intPredioDropdownOpen" style="display:block;">
              <div class="select-drop-option" @click="onChooseIntPredio('Alcoba Auxiliar 1')">Alcoba Auxiliar 1</div>
              <div class="select-drop-option" @click="onChooseIntPredio('Alcoba Auxiliar 2')">Alcoba Auxiliar 2</div>
              <div class="select-drop-option" @click="onChooseIntPredio('Sala')">Sala</div>
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" style="margin-right:8px;" @click="stepNumber = 3">Atrás</button>
            <button type="button" class="btn-ofsc-activar-green" style="flex:none;padding:8px 18px;" @click="stepNumber = 5">Continuar a Módem ▸</button>
          </div>
        </div>

        <!-- PASO 5 (INT): INVENTARIO MÓDEM MTA -->
        <div class="ofsc-step-view" v-if="stepNumber === 5">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Ubicacion:</label>
            <div class="ofsc-static-val">{{ intPredioUbicacion }}</div>
          </div>

          <div class="ofsc-section-title-line">
            <span class="sec-title">Inventario: Cable Módems / MTA</span>
          </div>

          <div class="ofsc-checkbox-line" style="margin-bottom:8px;">
            <label class="ofsc-chk-lbl">
              <input type="checkbox" v-model="intMostrarMasTec">
              <span>Mostrar mas Tecnologias</span>
            </label>
          </div>

          <div style="font-size:0.68rem;color:#999;margin-bottom:4px;">
            Tip-Fab-Mod-Ser-Chip-Mac-Pt-Est
          </div>

          <div class="ofsc-equipment-list">
            <div
              v-for="m in modemsListFiltrados"
              :key="m.serial"
              class="eq-item"
              :class="{ 'selected': selectedModemSerial === m.serial }"
              @click="onChooseModem(m.serial)"
            >
              {{ m.label }}
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 4">Atrás</button>
          </div>
        </div>

        <!-- PASO 6 (INT): LÍNEA TELEFÓNICA ASOCIADA -->
        <div class="ofsc-step-view" v-if="stepNumber === 6">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Módem MTA Seleccionado:</label>
            <div class="ofsc-static-val" style="color:var(--ofs-green-light);font-family:monospace;font-size:0.75rem;">
              {{ selectedModemSerial }}
            </div>
          </div>

          <div class="ofsc-control-group" style="margin-top:12px;">
            <label class="ofsc-label">Lineas-Asociadas:</label>
            <div
              class="ofsc-select-box"
              @click="intLineaDropdownOpen = !intLineaDropdownOpen"
            >
              <span>{{ selectedIntLinea }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <div class="ofsc-select-dropdown" v-if="intLineaDropdownOpen" style="display:block;">
              <div class="select-drop-option" @click="onChooseIntLinea('+576019353116: PT1')">
                +576019353116: PT1
              </div>
              <div class="select-drop-option" @click="onChooseIntLinea('+576019353117: PT2')">
                +576019353117: PT2
              </div>
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 5">Atrás</button>
          </div>
        </div>

        <!-- PASO 7 (INT): FUENTE DE PODER -->
        <div class="ofsc-step-view" v-if="stepNumber === 7">
          <div class="ofsc-control-group">
            <label class="ofsc-label">Línea Telefónica:</label>
            <div class="ofsc-static-val">{{ selectedIntLinea }}</div>
          </div>

          <div class="ofsc-control-group" style="margin-top:12px;">
            <label class="ofsc-label">Fuentes De Poder:</label>
            <div
              class="ofsc-select-box"
              @click="intFuenteDropdownOpen = !intFuenteDropdownOpen"
            >
              <span>{{ selectedIntFuente }}</span>
              <span class="select-arrow">▼</span>
            </div>
            <div class="ofsc-select-dropdown" v-if="intFuenteDropdownOpen" style="display:block;">
              <div class="select-drop-option" @click="onChooseIntFuente('FUENTE 12V 2500MA 2.5X5.5X9.5MM')">
                FUENTE 12V 2500MA 2.5X5.5X9.5MM
              </div>
              <div class="select-drop-option" @click="onChooseIntFuente('FUENTE 12V 1500MA')">
                FUENTE 12V 1500MA
              </div>
            </div>
          </div>

          <div class="ofsc-btn-row-bottom">
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 6">Atrás</button>
          </div>
        </div>

        <!-- PASO 8 (INT): RESUMEN SERVICIOS ASOCIADOS INTERNET -->
        <div class="ofsc-step-view" v-if="stepNumber === 8">
          <div class="ofsc-section-title-line">
            <span class="sec-title">SERVICIOS ASOCIADOS INTERNET</span>
          </div>
          <div style="font-size:0.66rem;color:#888;margin-bottom:4px;">
            Ub-Tip-Fab-Mod-Ser-Mac-Serv-Ln-Ft-Ea-En
          </div>

          <div class="ofsc-asociados-card">
            {{ intPredioUbicacion }} - MTA_CG1 - CGA0112 - SN:{{ selectedModemSerial }} - INT 5+95 MB;MODEM WIFI;TELEFONIA - {{ selectedIntLinea }} - {{ selectedIntFuente }} - Tech - AS
          </div>

          <div class="ofsc-action-row">
            <button
              type="button"
              class="btn-ofsc-activar-green"
              @click="openConfirmModal('int')"
            >
              Activar Servicios
            </button>
            <button type="button" class="btn-ofsc-cerrar-gray" @click="stepNumber = 7">Atrás</button>
          </div>
        </div>

      </div>

      <!-- ====================================================================
           FLUJO DESINSTALACIÓN
           ==================================================================== -->
      <div v-else-if="selectedService === 'desinst'" class="ofsc-step-view">
        <div class="ofsc-section-title-line">
          <span class="sec-title">Módulo de Desinstalación</span>
        </div>
        <p style="font-size:0.8rem;color:#b0b0b0;margin:10px 0;">
          Selecciona el equipo a recuperar o dar de baja:
        </p>
        <div class="ofsc-equipment-list" style="margin-bottom:14px;">
          <div class="eq-item">DECO HD NEWLAND NL-6105RB · SN: 254871675753</div>
          <div class="eq-item">MTA CG1 CGA0112 · SN: 383FB3975C1B</div>
        </div>
        <div class="ofsc-action-row">
          <button
            type="button"
            class="btn-ofsc-activar-green"
            @click="showToast('Comandos de desinstalación enviados a OFSC.', 'success')"
          >
            Procesar Desinstalación
          </button>
          <button type="button" class="btn-ofsc-cerrar-gray" @click="cerrarFinal">Cerrar</button>
        </div>
      </div>

      <!-- ====================================================================
           PASO FINAL: SESIÓN COMPLETADA EXITOSAMENTE
           ==================================================================== -->
      <div v-if="stepNumber === 99" class="ofsc-step-view">
        <div class="ofsc-section-title-line" style="margin-top:16px;">
          <span class="sec-title" style="color:var(--ofs-green-light);">✓ Certificación Exitosa en OFSC</span>
        </div>
        <div style="font-size:0.85rem;color:#ccc;text-align:center;padding:18px 10px;line-height:1.5;">
          Todos los servicios requeridos de la orden han sido activados, instalados y certificados en OFSC correctamente.
        </div>
        <div class="ofsc-btn-row-bottom" style="text-align:center;">
          <button
            type="button"
            class="btn-ofsc-cerrar-gray"
            style="min-width:140px;padding:9px 24px;"
            @click="cerrarFinal"
          >
            Cerrar y Regresar
          </button>
        </div>
      </div>

    </div>

    <!-- MODAL DE CONFIRMACIÓN OFSC: ¿Esta seguro de instalar servicios ? -->
    <div class="ofsc-modal-backdrop" v-if="modalConfirmVisible" style="display:flex;">
      <div class="ofsc-modal-dialog">
        <div class="ofsc-modal-header">
          <span>Instalar Servicios</span>
          <span class="modal-x" @click="modalConfirmVisible = false">✕</span>
        </div>
        <div class="ofsc-modal-body">
          ¿Esta seguro de instalar servicios ?
        </div>
        <div class="ofsc-modal-footer">
          <button type="button" class="btn-modal-opt btn-modal-si" @click="confirmInstalarServicios">SI</button>
          <button type="button" class="btn-modal-opt btn-modal-no" @click="modalConfirmVisible = false">No</button>
        </div>
      </div>
    </div>

    <!-- CAJA DE PISTAS FLOTANTE (Solo Pistas orientativas del paso actual) -->
    <div class="ofsc-pdf-instruction-card">
      <div class="pdf-inst-header">💡 Pista - {{ currentStepTitle }}:</div>
      <div class="pdf-inst-body" v-html="currentHintText"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSimulator } from '../composables/useSimulator';

const { state, showScreen, showToast, openDrawer } = useSimulator();

const prog = state.activacionProgress;

// Control de pasos progresivos respaldados en state
const stepNumber = computed({
  get: () => prog.stepNumber || 1,
  set: (v) => { prog.stepNumber = v; }
});

const navMenuOpen = ref(false);
const serviceDropdownOpen = ref(false);

const selectedService = computed({
  get: () => prog.selectedService,
  set: (v) => { prog.selectedService = v; }
});

const selectedServiceLabel = computed(() => {
  if (selectedService.value === 'tv') return 'Television';
  if (selectedService.value === 'int') return 'Internet/Telefonia';
  if (selectedService.value === 'desinst') return 'Desinstalacion';
  return '';
});

// Al elegir el servicio en el select desplegable, se desbloquea el Paso 2
const onSelectServiceOption = (srv) => {
  selectedService.value = srv;
  serviceDropdownOpen.value = false;
  if (srv === 'desinst') {
    stepNumber.value = 1;
  } else {
    stepNumber.value = 2; // Desbloquea y avanza a la pantalla de ubicación
  }
};

// Alertas del sistema
const showAlertCheckUbicacion = ref(false);
const showAlertServiciosAsocOk = computed({
  get: () => prog.showAlertServiciosAsocOk,
  set: (v) => { prog.showAlertServiciosAsocOk = v; }
});
const showAlertServiciosInstOfsc = computed({
  get: () => prog.showAlertServiciosInstOfsc,
  set: (v) => { prog.showAlertServiciosInstOfsc = v; }
});

// Modal
const modalConfirmVisible = ref(false);
const pendingServiceToInstall = ref(null);

// ============================================================================
// DATOS Y MÉTODOS DE TELEVISIÓN
// ============================================================================
const ubicacionTvSelected = computed({
  get: () => prog.ubicacionTvSelected || 'Seleccione una ubicacion',
  set: (v) => { prog.ubicacionTvSelected = v; }
});
const ubicacionTvDropdownOpen = ref(false);

const tvServiciosList = [
  { id: 1, nombre: '1- TV DIGI PLUS;ARR DECO', tipo: 'ADI' },
  { id: 2, nombre: '2- TV DIGI PLUS;ARR DECO', tipo: 'ADI' }
];
const selectedTvServicioId = computed({
  get: () => prog.selectedTvServicioId,
  set: (v) => { prog.selectedTvServicioId = v; }
});

const tvModificarUbicacion = computed({
  get: () => prog.tvModificarUbicacion,
  set: (v) => { prog.tvModificarUbicacion = v; }
});
const tvPredioUbicacion = computed({
  get: () => prog.tvPredioUbicacion || 'Alcoba Auxiliar 1',
  set: (v) => { prog.tvPredioUbicacion = v; }
});
const tvPredioDropdownOpen = ref(false);

const tvMostrarMasTec = computed({
  get: () => prog.tvMostrarMasTec,
  set: (v) => { prog.tvMostrarMasTec = v; }
});
const selectedTvDecoSerial = computed({
  get: () => prog.selectedTvDecoSerial,
  set: (v) => { prog.selectedTvDecoSerial = v; }
});

const tvDecosList = [
  { serial: '610120818136', label: 'DBV_ZT3 - ZT3 - ZAPPER ZXV10 - 610120818136 - 022D2197 - TECH', extra: false },
  { serial: '00824416060029714', label: 'DBV_CH2 - CH2 - N8771C - 00824416060029714 - 0727C35F - TECH', extra: false },
  { serial: '601391700073530', label: 'DBV_NEW - NEW - NL5101-E - 601391700073530 - 01D40D8F - TECH', extra: false },
  { serial: '254419362225', label: 'ITV_N2P - N2P - NL-6105RC - 254419362225 - 3754F11631 - TECH', extra: true },
  { serial: '254871673753', label: 'ITV_NIP - NIP - NL-6105RB - 254871673753 - 378EDC165F - TECH', extra: true },
  { serial: '254871678602', label: 'ITV_NIP - NIP - NL-6105RB - 254871678602 - 376EDC2951 - TECH', extra: true }
];

const tvDecosFiltrados = computed(() => {
  return tvMostrarMasTec.value ? tvDecosList : tvDecosList.filter(d => !d.extra);
});

const selectedTvControl = computed({
  get: () => prog.selectedTvControl || 'Seleccione un control',
  set: (v) => { prog.selectedTvControl = v; }
});
const tvControlDropdownOpen = ref(false);

const tvTarjetasList = [
  { serial: '25441936222V', label: 'CAR_NGR - NGR - NGR - 25441936222V - TECH' },
  { serial: '25487167860V', label: 'CAR_NGR - NGR - NGR - 25487167860V - TECH' },
  { serial: '25487167870V', label: 'CAR_NGR - NGR - NGR - 25487167870V - TECH' }
];
const selectedTvTarjetaSerial = computed({
  get: () => prog.selectedTvTarjetaSerial,
  set: (v) => { prog.selectedTvTarjetaSerial = v; }
});

// Acciones TV que desbloquean el siguiente paso
const onChooseTvUbicacion = (ub) => {
  ubicacionTvSelected.value = ub;
  ubicacionTvDropdownOpen.value = false;
  stepNumber.value = 3; // Desbloquea tabla de servicios
};

const onChooseTvServicio = (id) => {
  selectedTvServicioId.value = id;
  setTimeout(() => {
    stepNumber.value = 4; // Desbloquea modificar ubicación
  }, 200);
};

const onChooseTvPredio = (ub) => {
  tvPredioUbicacion.value = ub;
  tvPredioDropdownOpen.value = false;
};

const onChooseTvDeco = (serial) => {
  selectedTvDecoSerial.value = serial;
  setTimeout(() => {
    stepNumber.value = 6; // Desbloquea control remoto
  }, 200);
};

const onChooseTvControl = (ctrl) => {
  selectedTvControl.value = ctrl;
  tvControlDropdownOpen.value = false;
  setTimeout(() => {
    stepNumber.value = 7; // Desbloquea tarjeta virtual
  }, 200);
};

const onChooseTvTarjeta = (serial) => {
  selectedTvTarjetaSerial.value = serial;
  setTimeout(() => {
    stepNumber.value = 8; // Desbloquea resumen de asociados y botón activar
  }, 200);
};

// ============================================================================
// DATOS Y MÉTODOS DE INTERNET / TELEFONÍA
// ============================================================================
const ubicacionIntSelected = computed({
  get: () => prog.ubicacionIntSelected || 'Seleccione una ubicacion',
  set: (v) => { prog.ubicacionIntSelected = v; }
});
const ubicacionIntDropdownOpen = ref(false);

const intServiciosList = [
  { id: 10, nombre: '3- INT 5+95 MB;MODEM WIFI;TELEFONIA - +576019353116' }
];
const selectedIntServicioId = computed({
  get: () => prog.selectedIntServicioId,
  set: (v) => { prog.selectedIntServicioId = v; }
});

const intModificarUbicacion = computed({
  get: () => prog.intModificarUbicacion,
  set: (v) => { prog.intModificarUbicacion = v; }
});
const intPredioUbicacion = computed({
  get: () => prog.intPredioUbicacion || 'Alcoba Auxiliar 2',
  set: (v) => { prog.intPredioUbicacion = v; }
});
const intPredioDropdownOpen = ref(false);

const intMostrarMasTec = computed({
  get: () => prog.intMostrarMasTec,
  set: (v) => { prog.intMostrarMasTec = v; }
});
const selectedModemSerial = computed({
  get: () => prog.selectedModemSerial,
  set: (v) => { prog.selectedModemSerial = v; }
});

const modemsList = [
  { serial: 'B4:8D:C7:EE:DF:54', label: 'MTA 41T - DPC3941 - B4:8D:C7:EE:DF:54 - TECH', extra: false },
  { serial: '38:3F:B3:97:5C:1B', label: 'MTA_CG1 - CGA0112 - 38:3F:B3:97:5C:1B - TECH', extra: true },
  { serial: '48:4B:D4:04:3A:BB', label: 'MTA_CG1 - CGA0112 - 48:4B:D4:04:3A:BB - TECH', extra: true }
];

const modemsListFiltrados = computed(() => {
  return intMostrarMasTec.value ? modemsList : modemsList.filter(m => !m.extra);
});

const selectedIntLinea = computed({
  get: () => prog.selectedIntLinea || 'Seleccione una línea',
  set: (v) => { prog.selectedIntLinea = v; }
});
const intLineaDropdownOpen = ref(false);

const selectedIntFuente = computed({
  get: () => prog.selectedIntFuente || 'Seleccione fuente de poder',
  set: (v) => { prog.selectedIntFuente = v; }
});
const intFuenteDropdownOpen = ref(false);

const onChooseIntUbicacion = (ub) => {
  ubicacionIntSelected.value = ub;
  ubicacionIntDropdownOpen.value = false;
  stepNumber.value = 3; // Desbloquea servicios internet
};

const onChooseIntServicio = (id) => {
  selectedIntServicioId.value = id;
  setTimeout(() => {
    stepNumber.value = 4; // Desbloquea modificar ubicación
  }, 200);
};

const onChooseIntPredio = (ub) => {
  intPredioUbicacion.value = ub;
  intPredioDropdownOpen.value = false;
};

const onChooseModem = (serial) => {
  selectedModemSerial.value = serial;
  setTimeout(() => {
    stepNumber.value = 6; // Desbloquea línea telefónica
  }, 200);
};

const onChooseIntLinea = (ln) => {
  selectedIntLinea.value = ln;
  intLineaDropdownOpen.value = false;
  setTimeout(() => {
    stepNumber.value = 7; // Desbloquea fuente de poder
  }, 200);
};

const onChooseIntFuente = (ft) => {
  selectedIntFuente.value = ft;
  intFuenteDropdownOpen.value = false;
  setTimeout(() => {
    stepNumber.value = 8; // Desbloquea resumen y activar
  }, 200);
};

// ============================================================================
// MODAL DE CONFIRMACIÓN Y CIERRE
// ============================================================================
const openConfirmModal = (serv) => {
  pendingServiceToInstall.value = serv;
  modalConfirmVisible.value = true;
};

const confirmInstalarServicios = () => {
  modalConfirmVisible.value = false;
  if (pendingServiceToInstall.value === 'tv') {
    showToast('Enviando comandos de activación TV a OFSC...', 'normal');
    setTimeout(() => {
      showAlertServiciosAsocOk.value = true;
      showToast('✓ Servicios de televisión asociados correctamente.', 'success');
      // Desbloquea la invitación al siguiente servicio (Internet)
      selectedService.value = null;
      stepNumber.value = 1;
    }, 600);
  } else if (pendingServiceToInstall.value === 'int') {
    showToast('Enviando comandos de activación Internet a OFSC...', 'normal');
    setTimeout(() => {
      showAlertServiciosInstOfsc.value = true;
      showToast('✓ Servicios instalados en OFSC correctamente.', 'success');
      stepNumber.value = 99; // Pantalla final de certificación exitosa
      if (state.currentActivity) {
        state.currentActivity.equiposInstalados = true;
        state.currentActivity.serviciosActivados = true;
      }
    }, 600);
  }
};

const reiniciarProceso = () => {
  navMenuOpen.value = false;
  selectedService.value = null;
  stepNumber.value = 1;
  selectedTvDecoSerial.value = null;
  selectedModemSerial.value = null;
  selectedTvServicioId.value = null;
  selectedIntServicioId.value = null;
  showAlertServiciosAsocOk.value = false;
  showAlertServiciosInstOfsc.value = false;
  showToast('Proceso de activación reiniciado.');
};

const cerrarFinal = () => {
  navMenuOpen.value = false;
  showScreen('/activity');
};

// ============================================================================
// PISTAS (HINTS) INTELIGENTES SEGÚN EL PASO ACTUAL
// ============================================================================
const currentStepTitle = computed(() => {
  if (stepNumber.value === 1) return 'Paso 1 - Selección de Servicio';
  if (stepNumber.value === 2) return 'Paso 2 - Ubicación Inicial';
  if (stepNumber.value === 3) return 'Paso 3 - Selección de Servicio';
  if (stepNumber.value === 4) return 'Paso 4 - Ubicación en Predio';
  if (stepNumber.value === 5) return 'Paso 5 - Inventario de Equipos';
  if (stepNumber.value === 6) return 'Paso 6 - Control o Línea';
  if (stepNumber.value === 7) return 'Paso 7 - Tarjeta o Fuente';
  if (stepNumber.value === 8) return 'Paso 8 - Confirmación y Envío';
  if (stepNumber.value === 99) return 'Paso Final - Certificado';
  return 'Paso en curso';
});

const currentHintText = computed(() => {
  if (stepNumber.value === 1) {
    if (showAlertServiciosAsocOk.value) {
      return '¡Servicios TV asociados! Ahora despliega el selector y elige <strong>Internet/Telefonia</strong> para continuar.';
    }
    return 'Despliega el selector principal y elige la opción que deseas gestionar (ej. <strong>Television</strong> o <strong>Internet/Telefonia</strong>).';
  }

  // Pistas de TV
  if (selectedService.value === 'tv') {
    if (stepNumber.value === 2) {
      return 'Haz clic en el selector de ubicación y elige la ubicación deseada (se sugiere <strong>Default</strong>).';
    }
    if (stepNumber.value === 3) {
      return 'Selecciona en la tabla el servicio de televisión que vas a asociar (ej. <strong>1- TV DIGI PLUS;ARR DECO</strong>).';
    }
    if (stepNumber.value === 4) {
      return 'Puedes activar <strong>Modificar Ubicación</strong> si requieres asignar una habitación específica (ej. <strong>Alcoba Auxiliar 1</strong>) y luego presiona Continuar.';
    }
    if (stepNumber.value === 5) {
      return 'Activa <strong>Mostrar más Tecnologías</strong> para ver todos los decodificadores y selecciona el equipo a instalar.';
    }
    if (stepNumber.value === 6) {
      return 'Despliega el selector y asocia el control remoto del decodificador (ej. <strong>Universal DVB, ATSC y DTH</strong>).';
    }
    if (stepNumber.value === 7) {
      return 'Elige la tarjeta virtual a asociar para vincular el aprovisionamiento de TV.';
    }
    if (stepNumber.value === 8) {
      return 'Revisa el resumen de servicios asociados y presiona <strong>Activar Servicios</strong> para enviar la confirmación.';
    }
  }

  // Pistas de Internet
  if (selectedService.value === 'int') {
    if (stepNumber.value === 2) {
      return 'Selecciona la ubicación inicial para la conexión de datos (ej. <strong>Default</strong>).';
    }
    if (stepNumber.value === 3) {
      return 'Marca el servicio de Internet / Telefonía en la tabla para desbloquear los equipos de red.';
    }
    if (stepNumber.value === 4) {
      return 'Puedes modificar la ubicación en predio (ej. <strong>Alcoba Auxiliar 2</strong>) y avanzar al módem.';
    }
    if (stepNumber.value === 5) {
      return 'Marca <strong>Mostrar más Tecnologías</strong> y selecciona el cable módem MTA de tu inventario.';
    }
    if (stepNumber.value === 6) {
      return 'Selecciona el puerto o línea telefónica asociada para la voz sobre IP (PT1).';
    }
    if (stepNumber.value === 7) {
      return 'Selecciona la fuente de poder compatible para energizar el módem.';
    }
    if (stepNumber.value === 8) {
      return 'Verifica el resumen de equipos de red y presiona <strong>Activar Servicios</strong> para certificar en OFSC.';
    }
  }

  if (stepNumber.value === 99) {
    return '¡Excelente! Todos los servicios han sido instalados y certificados. Pulsa <strong>Cerrar y Regresar</strong> para volver a OFSC.';
  }

  return 'Sigue las opciones en pantalla para avanzar en el aprovisionamiento técnico.';
});
</script>
