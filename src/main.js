import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setRouter } from './core/ui.js'
import './assets/css/simulator.css'

setRouter(router)

const app = createApp(App)
app.use(router)
app.mount('#app')
