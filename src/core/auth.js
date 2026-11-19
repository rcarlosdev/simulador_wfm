import { reactive } from 'vue';
import { SIMULADOR_DATA } from '../js/data.js';

/**
 * Módulo de Autenticación y Técnico de Prueba Activo
 */

const defaultUser = JSON.parse(JSON.stringify(SIMULADOR_DATA.usuarios_prueba[0]));

export const authState = reactive({
  currentUser: defaultUser
});

export function setAuthenticatedUser(user) {
  authState.currentUser = user ? JSON.parse(JSON.stringify(user)) : null;
}

export function findUserByCredentials(cedula, password) {
  const users = SIMULADOR_DATA.usuarios_prueba;
  return users.find(u => u.cedula === String(cedula).trim() && u.password === password) || null;
}

export function findUserByCedula(cedula) {
  const users = SIMULADOR_DATA.usuarios_prueba;
  return users.find(u => u.cedula === String(cedula).trim()) || null;
}
