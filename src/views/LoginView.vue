<template>
  <div class="simulator-screen screen-login screen-active" id="screen-login">
    <div class="login-header-block">
      <div class="login-brand-banner">
        <img src="../assets/img/logo-5inco.png" alt="5inco - Compañía Integral Negocios de Colombia" class="login-5inco-logo" />
      </div>
      <div class="login-title-h1">Iniciar sesión</div>
      <div class="login-title-brand">Oracle <span class="login-title-service">Field Service</span></div>
    </div>

    <div class="login-body-block screen-scroll-body">
      <div class="login-welcome-text">Bienvenido a amx-res-co</div>

      <form @submit.prevent="handleLogin" autocomplete="off">
        <div class="login-form-group">
          <input
            type="text"
            v-model="cedula"
            class="login-input"
            placeholder="Ingresar cédula"
            required
          />
        </div>

        <div class="login-form-group">
          <div class="password-wrapper">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="password"
              class="login-input"
              placeholder="Ingresar contraseña asignada"
              required
            />
            <button
              type="button"
              class="password-toggle-btn"
              @click="passwordVisible = !passwordVisible"
              title="Ver contraseña"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-ofs-primary">
          Iniciar
        </button>
      </form>

      <!-- Selector de Técnicos Demo -->
      <div class="demo-users-box">
        <div class="demo-users-title">
          <svg style="width:14px;height:14px;fill:currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Técnico de Prueba (Clic para ingresar):
        </div>

        <div
          v-for="user in users"
          :key="user.cedula"
          class="demo-user-card"
          @click="selectDemo(user)"
        >
          <div>
            <div class="demo-user-name">{{ user.nombre }}</div>
            <div class="demo-user-role">CC {{ user.cedula }} · {{ user.rol }}</div>
          </div>
          <span class="demo-user-badge">Entrar</span>
        </div>
      </div>

      <!-- Créditos Institucionales 5inco -->
      <div class="login-footer-credits">
        <img src="../assets/img/logo-5inco-circle.png" alt="5inco" class="login-footer-circle-logo" />
        <span class="login-footer-text">5inco WFM · Plataforma de Entrenamiento</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSimulator } from '../composables/useSimulator';

const { users, login } = useSimulator();

const cedula = ref('1234567890');
const password = ref('Claro2026*');
const passwordVisible = ref(false);

const handleLogin = () => {
  login(cedula.value, password.value);
};

const selectDemo = (user) => {
  cedula.value = user.cedula;
  password.value = user.password;
  login(user.cedula, user.password);
};
</script>

<style scoped>
.login-brand-banner {
  background: #ffffff;
  border-radius: 8px;
  padding: 8px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-5inco-logo {
  height: 38px;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

.login-footer-credits {
  text-align: center;
  margin-top: 24px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.85;
}

.login-footer-circle-logo {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.login-footer-text {
  font-size: 0.74rem;
  color: #9e9e9e;
  letter-spacing: 0.2px;
}
</style>
