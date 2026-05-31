import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import VueApexCharts from 'vue3-apexcharts'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'

const app = createApp(App)
app.use(router)
app.use(VueApexCharts)
app.mount('#app')
