<template>
  <div>
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <div>
        <h2 style="font-size: 20px; font-weight: 500; margin: 0 0 4px;">Dashboard</h2>
        <p style="font-size: 13px; color: #6c757d; margin: 0;">
          Bienvenido, <strong>{{ usuarioActual?.nombre }}</strong> · {{ usuarioActual?.rol }}
        </p>
      </div>
      <span style="font-size: 12px; color: #6c757d; background: white; border: 1px solid #dee2e6; padding: 6px 12px; border-radius: 8px;">
        📅 {{ fechaHoy }}
      </span>
    </div>

    <!-- Stats -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #6c757d;">Total ventas</span>
            <div style="width: 32px; height: 32px; background: #e6f1fb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <i class="ti ti-currency-dollar" style="font-size: 16px; color: #185fa5;" aria-hidden="true"></i>
            </div>
          </div>
          <p style="font-size: 24px; font-weight: 500; margin: 0 0 4px;">Q{{ totalVentas }}</p>
          <p style="font-size: 11px; color: #198754; margin: 0;">Total acumulado</p>
        </div>
      </div>
      <div class="col-md-3">
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #6c757d;">Pedidos pendientes</span>
            <div style="width: 32px; height: 32px; background: #faeeda; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <i class="ti ti-clipboard-list" style="font-size: 16px; color: #854f0b;" aria-hidden="true"></i>
            </div>
          </div>
          <p style="font-size: 24px; font-weight: 500; margin: 0 0 4px;">{{ pedidosPendientes }}</p>
          <p style="font-size: 11px; color: #6c757d; margin: 0;">Requieren atención</p>
        </div>
      </div>
      <div class="col-md-3">
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #6c757d;">Sin stock</span>
            <div style="width: 32px; height: 32px; background: #fcebeb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <i class="ti ti-package-off" style="font-size: 16px; color: #a32d2d;" aria-hidden="true"></i>
            </div>
          </div>
          <p style="font-size: 24px; font-weight: 500; margin: 0 0 4px;">{{ productosSinStock }}</p>
          <p style="font-size: 11px; color: #dc3545; margin: 0;">Productos agotados</p>
        </div>
      </div>
      <div class="col-md-3">
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span style="font-size: 12px; color: #6c757d;">Viáticos pendientes</span>
            <div style="width: 32px; height: 32px; background: #e1f5ee; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <i class="ti ti-receipt" style="font-size: 16px; color: #0f6e56;" aria-hidden="true"></i>
            </div>
          </div>
          <p style="font-size: 24px; font-weight: 500; margin: 0 0 4px;">{{ viaticosPendientes }}</p>
          <p style="font-size: 11px; color: #6c757d; margin: 0;">Por aprobar</p>
        </div>
      </div>
    </div>

    <!-- Módulos + Tabla -->
    <div class="row g-3">
      <div class="col-md-5">
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 1rem; height: 100%;">
          <h6 style="font-size: 14px; font-weight: 500; margin: 0 0 1rem;">Módulos del sistema</h6>
          <div class="row g-2">
            <div v-if="esAdmin" class="col-6">
              <router-link to="/usuarios" style="text-decoration: none;">
                <div style="border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                  <i class="ti ti-settings" style="font-size: 18px; color: #185fa5; margin-bottom: 4px; display: block;" aria-hidden="true"></i>
                  <p style="font-size: 12px; font-weight: 500; margin: 0 0 2px; color: #212529;">Mantenimiento</p>
                  <p style="font-size: 11px; color: #6c757d; margin: 0;">Usuarios, productos...</p>
                </div>
              </router-link>
            </div>
            <div v-if="esAdmin || esVendedor || esCompras" class="col-6">
              <router-link to="/pedidos" style="text-decoration: none;">
                <div style="border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                  <i class="ti ti-shopping-cart" style="font-size: 18px; color: #854f0b; margin-bottom: 4px; display: block;" aria-hidden="true"></i>
                  <p style="font-size: 12px; font-weight: 500; margin: 0 0 2px; color: #212529;">Operativo</p>
                  <p style="font-size: 11px; color: #6c757d; margin: 0;">Pedidos, compras...</p>
                </div>
              </router-link>
            </div>
            <div v-if="esAdmin || esPiloto" class="col-6">
              <router-link to="/distribucion" style="text-decoration: none;">
                <div style="border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                  <i class="ti ti-truck" style="font-size: 18px; color: #0f6e56; margin-bottom: 4px; display: block;" aria-hidden="true"></i>
                  <p style="font-size: 12px; font-weight: 500; margin: 0 0 2px; color: #212529;">Logística</p>
                  <p style="font-size: 11px; color: #6c757d; margin: 0;">Distribución, vehículos...</p>
                </div>
              </router-link>
            </div>
            <div v-if="esAdmin" class="col-6">
              <router-link to="/comisiones" style="text-decoration: none;">
                <div style="border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                  <i class="ti ti-report-money" style="font-size: 18px; color: #993556; margin-bottom: 4px; display: block;" aria-hidden="true"></i>
                  <p style="font-size: 12px; font-weight: 500; margin: 0 0 2px; color: #212529;">Administrativo</p>
                  <p style="font-size: 11px; color: #6c757d; margin: 0;">Comisiones, planilla...</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-7">
        <div style="background: white; border: 1px solid #dee2e6; border-radius: 12px; padding: 1rem;">
          <h6 style="font-size: 14px; font-weight: 500; margin: 0 0 1rem;">Últimos pedidos</h6>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <th style="text-align: left; padding: 8px; font-weight: 500; color: #6c757d; font-size: 12px;">ID</th>
                <th style="text-align: left; padding: 8px; font-weight: 500; color: #6c757d; font-size: 12px;">Vendedor</th>
                <th style="text-align: left; padding: 8px; font-weight: 500; color: #6c757d; font-size: 12px;">Fecha</th>
                <th style="text-align: left; padding: 8px; font-weight: 500; color: #6c757d; font-size: 12px;">Estado</th>
                <th style="text-align: right; padding: 8px; font-weight: 500; color: #6c757d; font-size: 12px;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in ultimosPedidos" :key="p.id" style="border-bottom: 1px solid #f1f3f5;">
                <td style="padding: 10px 8px; color: #6c757d;">#{{ p.id }}</td>
                <td style="padding: 10px 8px; color: #212529;">{{ usuarios.find(u => u.id === p.vendedor_id)?.nombre ?? '-' }}</td>
                <td style="padding: 10px 8px; color: #6c757d;">{{ new Date(p.fecha).toLocaleDateString() }}</td>
                <td style="padding: 10px 8px;">
                  <span :style="{
                    background: p.estado === 'pendiente' ? '#faeeda' : p.estado === 'aprobado' ? '#eaf3de' : '#e6f1fb',
                    color: p.estado === 'pendiente' ? '#854f0b' : p.estado === 'aprobado' ? '#3b6d11' : '#185fa5',
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px'
                  }">{{ p.estado }}</span>
                </td>
                <td style="padding: 10px 8px; text-align: right; font-weight: 500;">Q{{ p.total }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="ultimosPedidos.length === 0" style="text-align: center; padding: 2rem; color: #6c757d; font-size: 13px;">
            No hay pedidos registrados
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const pedidos = ref<any[]>([])
const usuarios = ref<any[]>([])
const productos = ref<any[]>([])
const viaticos = ref<any[]>([])

const usuarioActual = JSON.parse(localStorage.getItem('usuario') || 'null')

const esAdmin    = computed(() => usuarioActual?.rol === 'administrador')
const esVendedor = computed(() => usuarioActual?.rol === 'vendedor')
const esCompras  = computed(() => usuarioActual?.rol === 'compras')
const esPiloto   = computed(() => usuarioActual?.rol === 'piloto')

const fechaHoy = new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const cargar = async () => {
  const [p, u, pr, v] = await Promise.all([
    axios.get(`${API}/pedidos`),
    axios.get(`${API}/usuarios`),
    axios.get(`${API}/productos`),
    axios.get(`${API}/viaticos`)
  ])
  pedidos.value = p.data
  usuarios.value = u.data
  productos.value = pr.data
  viaticos.value = v.data
}

const totalVentas = computed(() => pedidos.value.reduce((a, p) => a + Number(p.total), 0).toFixed(2))
const pedidosPendientes = computed(() => pedidos.value.filter(p => p.estado === 'pendiente').length)
const productosSinStock = computed(() => productos.value.filter(p => p.stock <= 0).length)
const viaticosPendientes = computed(() => viaticos.value.filter(v => v.estado === 'pendiente').length)
const ultimosPedidos = computed(() => pedidos.value.slice(0, 5))

onMounted(cargar)
</script>