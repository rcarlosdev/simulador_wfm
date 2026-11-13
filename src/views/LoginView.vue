<template>
  <div class="simulator-screen screen-login screen-active" id="screen-login">
    <div class="login-header-block">
      <div class="login-title-h1">Iniciar sesión</div>
      <div class="login-title-brand">Oracle</div>
      <div class="login-title-service">Field Service</div>
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
          Técnicos de Prueba (Clic para ingresar):
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSimulator } from '../composables/useSimulator';

const { users, login } = useSimulator();

const cedula = ref('1000123456');
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
