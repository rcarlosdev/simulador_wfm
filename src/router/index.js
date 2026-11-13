import { createRouter, createWebHashHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import ActivityListView from '../views/ActivityListView.vue';
import ActivityDetailsView from '../views/ActivityDetailsView.vue';
import ServiciosOtView from '../views/ServiciosOtView.vue';
import CheckInicioView from '../views/CheckInicioView.vue';
import ActivacionEquiposView from '../views/ActivacionEquiposView.vue';
import CoberturaWifiView from '../views/CoberturaWifiView.vue';
import InventarioView from '../views/InventarioView.vue';
import ComandosActivacionView from '../views/ComandosActivacionView.vue';
import ChatView from '../views/ChatView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/activities',
    name: 'activities',
    component: ActivityListView
  },
  {
    path: '/activity/:id?',
    name: 'activity-details',
    component: ActivityDetailsView
  },
  {
    path: '/servicios-ot',
    name: 'servicios-ot',
    component: ServiciosOtView
  },
  {
    path: '/check-inicio',
    name: 'check-inicio',
    component: CheckInicioView
  },
  {
    path: '/activacion-auto',
    name: 'activacion-auto',
    component: ActivacionEquiposView
  },
  {
    path: '/cobertura-wifi',
    name: 'cobertura-wifi',
    component: CoberturaWifiView
  },
  {
    path: '/inventario',
    name: 'inventario',
    component: InventarioView
  },
  {
    path: '/comandos-act',
    name: 'comandos-act',
    component: ComandosActivacionView
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
