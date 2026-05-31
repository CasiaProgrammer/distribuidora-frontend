import { createRouter, createWebHistory } from 'vue-router'
import UsuariosView from '../views/UsuariosView.vue'
import CategoriasView from '../views/CategoriasView.vue'
import ProductosView from '../views/ProductosView.vue'
import PedidosView from '../views/PedidosView.vue'
import ComprasView from '../views/ComprasView.vue'
import DistribucionView from '../views/DistribucionView.vue'
import ComisionesView from '../views/ComisionesView.vue'
import PlanillaView from '../views/PlanillaView.vue'
import ClientesView from '../views/ClientesView.vue'
import ProveedoresView from '../views/ProveedoresView.vue'
import VehiculosView from '../views/VehiculosView.vue'
import CombustibleView from '../views/CombustibleView.vue'
import ViaticosView from '../views/ViaticosView.vue'
import ReportesView from '../views/ReportesView.vue'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', component: DashboardView },
    { path: '/usuarios', component: UsuariosView },
    { path: '/categorias', component: CategoriasView },
    { path: '/productos', component: ProductosView },
    { path: '/pedidos', component: PedidosView },
    { path: '/compras', component: ComprasView },
    { path: '/distribucion', component: DistribucionView },
    { path: '/comisiones', component: ComisionesView },
    { path: '/planilla', component: PlanillaView },
    { path: '/clientes', component: ClientesView },
    { path: '/proveedores', component: ProveedoresView },
    { path: '/vehiculos', component: VehiculosView },
    { path: '/combustible', component: CombustibleView },
    { path: '/viaticos', component: ViaticosView },
    { path: '/reportes', component: ReportesView },
  ]
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router