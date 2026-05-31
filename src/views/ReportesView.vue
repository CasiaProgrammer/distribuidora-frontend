<template>
  <div>
    <h2>Reportes</h2>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'ventas' }" @click="tab = 'ventas'" href="#">Ventas</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'inventario' }" @click="tab = 'inventario'" href="#">Inventario</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'comisiones' }" @click="tab = 'comisiones'" href="#">Comisiones</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'pedidos' }" @click="tab = 'pedidos'" href="#">Pedidos</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'combustible' }" @click="tab = 'combustible'" href="#">Combustible</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'viaticos' }" @click="tab = 'viaticos'" href="#">Viáticos</a>
      </li>
    </ul>

    <!-- VENTAS -->
    <div v-if="tab === 'ventas'">
      <div class="card p-3 mb-3 bg-light">
        <div class="row g-2 align-items-end">
          <div class="col-md-3">
            <label class="form-label small text-muted">Mes</label>
            <select v-model="filtroVentasMes" class="form-select">
              <option value="">Todos los meses</option>
              <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small text-muted">Año</label>
            <select v-model="filtroVentasAnio" class="form-select">
              <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="filtroVentasMes = ''; filtroVentasAnio = anioActual">Limpiar</button>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-3">
          <div class="card p-3 border-primary">
            <div class="text-muted small">Total ventas</div>
            <div class="fs-4 fw-bold text-primary">Q{{ totalVentas }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-success">
            <div class="text-muted small">Pedidos entregados</div>
            <div class="fs-4 fw-bold text-success">{{ pedidosEntregados }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-warning">
            <div class="text-muted small">Pedidos pendientes</div>
            <div class="fs-4 fw-bold text-warning">{{ pedidosPendientes }}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 border-info">
            <div class="text-muted small">Pedidos aprobados</div>
            <div class="fs-4 fw-bold text-info">{{ pedidosAprobados }}</div>
          </div>
        </div>
      </div>
      <div class="card p-3 mb-3">
        <h6>Ventas por vendedor</h6>
        <apexchart type="bar" height="300" :options="ventasOpts" :series="ventasSeries" />
      </div>
    </div>

    <!-- INVENTARIO -->
    <div v-if="tab === 'inventario'">
      <div class="row mb-3">
        <div class="col-md-4">
          <div class="card p-3 border-primary">
            <div class="text-muted small">Total productos</div>
            <div class="fs-4 fw-bold text-primary">{{ productos.length }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3 border-danger">
            <div class="text-muted small">Sin stock</div>
            <div class="fs-4 fw-bold text-danger">{{ productosSinStock }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3 border-success">
            <div class="text-muted small">Con stock</div>
            <div class="fs-4 fw-bold text-success">{{ productosConStock }}</div>
          </div>
        </div>
      </div>
      <div class="card p-3 mb-3">
        <h6>Stock por producto</h6>
        <apexchart type="bar" height="300" :options="inventarioOpts" :series="inventarioSeries" />
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr><th>Producto</th><th>Stock</th><th>Precio</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in productos" :key="p.id">
              <td>{{ p.nombre }}</td>
              <td>{{ p.stock }}</td>
              <td>Q{{ p.precio }}</td>
              <td>
                <span :class="p.stock > 0 ? 'badge bg-success' : 'badge bg-danger'">
                  {{ p.stock > 0 ? 'En stock' : 'Sin stock' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- COMISIONES -->
    <div v-if="tab === 'comisiones'">
      <div class="card p-3 mb-3 bg-light">
        <div class="row g-2 align-items-end">
          <div class="col-md-3">
            <label class="form-label small text-muted">Mes</label>
            <select v-model="filtroComisionesMes" class="form-select">
              <option value="">Todos los meses</option>
              <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small text-muted">Año</label>
            <select v-model="filtroComisionesAnio" class="form-select">
              <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="filtroComisionesMes = ''; filtroComisionesAnio = anioActual">Limpiar</button>
          </div>
        </div>
      </div>
      <div class="card p-3 mb-3">
        <h6>Comisiones por vendedor</h6>
        <apexchart v-if="comisionesSeries.some(v => v > 0)" type="pie" height="300" :options="comisionesOpts" :series="comisionesSeries" />
        <div v-else class="text-muted text-center py-4">No hay comisiones registradas</div>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr><th>Vendedor</th><th>Total Comisiones</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in resumenComisiones" :key="c.nombre">
              <td>{{ c.nombre }}</td>
              <td class="fw-bold">Q{{ c.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PEDIDOS -->
    <div v-if="tab === 'pedidos'">
      <div class="card p-3 mb-3">
        <h6>Pedidos por estado</h6>
        <apexchart type="donut" height="300" :options="pedidosOpts" :series="pedidosSeries" />
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr><th>ID</th><th>Vendedor</th><th>Fecha</th><th>Estado</th><th>Total</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in pedidos" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ usuarios.find(u => u.id === p.vendedor_id)?.nombre }}</td>
              <td>{{ new Date(p.fecha).toLocaleDateString() }}</td>
              <td>
                <span :class="{
                  'badge bg-warning': p.estado === 'pendiente',
                  'badge bg-success': p.estado === 'aprobado',
                  'badge bg-primary': p.estado === 'entregado'
                }">{{ p.estado }}</span>
              </td>
              <td class="fw-bold">Q{{ p.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- COMBUSTIBLE -->
    <div v-if="tab === 'combustible'">
      <div class="card p-3 mb-3 bg-light">
        <div class="row g-2 align-items-end">
          <div class="col-md-3">
            <label class="form-label small text-muted">Mes</label>
            <select v-model="filtroCombustibleMes" class="form-select">
              <option value="">Todos los meses</option>
              <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small text-muted">Año</label>
            <select v-model="filtroCombustibleAnio" class="form-select">
              <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="filtroCombustibleMes = ''; filtroCombustibleAnio = anioActual">Limpiar</button>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4">
          <div class="card p-3 border-primary">
            <div class="text-muted small">Total gastado</div>
            <div class="fs-4 fw-bold text-primary">Q{{ totalCombustible }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3 border-success">
            <div class="text-muted small">Total galones</div>
            <div class="fs-4 fw-bold text-success">{{ totalGalones }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3 border-warning">
            <div class="text-muted small">Total registros</div>
            <div class="fs-4 fw-bold text-warning">{{ combustiblesFiltrados.length }}</div>
          </div>
        </div>
      </div>
      <div class="card p-3 mb-3">
        <h6>Gasto por vehículo</h6>
        <apexchart v-if="combustiblesFiltrados.length > 0" type="bar" height="300" :options="combustibleOpts" :series="combustibleSeries" />
        <div v-else class="text-muted text-center py-4">No hay registros de combustible</div>
      </div>
    </div>

    <!-- VIÁTICOS -->
    <div v-if="tab === 'viaticos'">
      <div class="card p-3 mb-3 bg-light">
        <div class="row g-2 align-items-end">
          <div class="col-md-3">
            <label class="form-label small text-muted">Mes</label>
            <select v-model="filtroViaticosMes" class="form-select">
              <option value="">Todos los meses</option>
              <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small text-muted">Año</label>
            <select v-model="filtroViaticosAnio" class="form-select">
              <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="filtroViaticosMes = ''; filtroViaticosAnio = anioActual">Limpiar</button>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-4">
          <div class="card p-3 border-primary">
            <div class="text-muted small">Total aprobado</div>
            <div class="fs-4 fw-bold text-primary">Q{{ totalViaticos }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3 border-success">
            <div class="text-muted small">Aprobados</div>
            <div class="fs-4 fw-bold text-success">{{ viaticosAprobados }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-3 border-warning">
            <div class="text-muted small">Pendientes</div>
            <div class="fs-4 fw-bold text-warning">{{ viaticosPendientes }}</div>
          </div>
        </div>
      </div>
      <div class="card p-3 mb-3">
        <h6>Viáticos por usuario</h6>
        <apexchart v-if="viaticosSeries.some(v => v > 0)" type="pie" height="300" :options="viaticosOpts" :series="viaticosSeries" />
        <div v-else class="text-muted text-center py-4">No hay viáticos aprobados</div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const tab = ref('ventas')
const pedidos = ref<any[]>([])
const usuarios = ref<any[]>([])
const productos = ref<any[]>([])
const comisiones = ref<any[]>([])
const combustibles = ref<any[]>([])
const viaticos = ref<any[]>([])
const vehiculos = ref<any[]>([])

const anioActual = new Date().getFullYear()
const anios = [anioActual - 1, anioActual, anioActual + 1]

const meses = [
  { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' }, { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' }
]

const filtroVentasMes = ref('')
const filtroVentasAnio = ref(anioActual)
const filtroComisionesMes = ref('')
const filtroComisionesAnio = ref(anioActual)
const filtroCombustibleMes = ref('')
const filtroCombustibleAnio = ref(anioActual)
const filtroViaticosMes = ref('')
const filtroViaticosAnio = ref(anioActual)

const filtrarPorFecha = (items: any[], campo: string, mes: string, anio: number) => {
  return items.filter(i => {
    const fecha = new Date(i[campo])
    const mismoAnio = fecha.getFullYear() === anio
    const mismoMes = mes === '' || (fecha.getMonth() + 1) === Number(mes)
    return mismoAnio && mismoMes
  })
}

const cargar = async () => {
  const [p, u, pr, c, co, vi, ve] = await Promise.all([
    axios.get(`${API}/pedidos`),
    axios.get(`${API}/usuarios`),
    axios.get(`${API}/productos`),
    axios.get(`${API}/comisiones`),
    axios.get(`${API}/combustible`),
    axios.get(`${API}/viaticos`),
    axios.get(`${API}/vehiculos`)
  ])
  pedidos.value = p.data
  usuarios.value = u.data
  productos.value = pr.data
  comisiones.value = c.data
  combustibles.value = co.data
  viaticos.value = vi.data
  vehiculos.value = ve.data
}

// VENTAS
const pedidosFiltrados = computed(() => filtrarPorFecha(pedidos.value, 'fecha', filtroVentasMes.value, filtroVentasAnio.value))
const totalVentas = computed(() => pedidosFiltrados.value.reduce((a, p) => a + Number(p.total), 0).toFixed(2))
const pedidosEntregados = computed(() => pedidosFiltrados.value.filter(p => p.estado === 'entregado').length)
const pedidosPendientes = computed(() => pedidosFiltrados.value.filter(p => p.estado === 'pendiente').length)
const pedidosAprobados = computed(() => pedidosFiltrados.value.filter(p => p.estado === 'aprobado').length)

const ventasOpts = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: { categories: usuarios.value.filter(u => u.rol === 'vendedor').map(u => u.nombre) },
  colors: ['#0d6efd']
}))

const ventasSeries = computed(() => [{
  name: 'Ventas (Q)',
  data: usuarios.value.filter(u => u.rol === 'vendedor').map(u =>
    pedidosFiltrados.value.filter(p => p.vendedor_id === u.id).reduce((a, p) => a + Number(p.total), 0)
  )
}])

// INVENTARIO
const productosSinStock = computed(() => productos.value.filter(p => p.stock <= 0).length)
const productosConStock = computed(() => productos.value.filter(p => p.stock > 0).length)

const inventarioOpts = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: { categories: productos.value.map(p => p.nombre) },
  colors: ['#198754']
}))

const inventarioSeries = computed(() => [{
  name: 'Stock',
  data: productos.value.map(p => p.stock)
}])

// COMISIONES
const comisionesFiltradas = computed(() => filtrarPorFecha(comisiones.value, 'fecha', filtroComisionesMes.value, filtroComisionesAnio.value))

const resumenComisiones = computed(() => {
  return usuarios.value.filter(u => u.rol === 'vendedor').map(u => ({
    nombre: u.nombre,
    total: comisionesFiltradas.value.filter(c => c.vendedor_id === u.id).reduce((a, c) => a + Number(c.monto), 0).toFixed(2)
  }))
})

const comisionesOpts = computed(() => ({
  labels: resumenComisiones.value.map(c => c.nombre),
  colors: ['#0dcaf0', '#ffc107', '#198754', '#dc3545']
}))

const comisionesSeries = computed(() => resumenComisiones.value.map(c => Number(c.total)))

// PEDIDOS
const pedidosOpts = computed(() => ({
  labels: ['Pendiente', 'Aprobado', 'Entregado'],
  colors: ['#ffc107', '#198754', '#0d6efd']
}))

const pedidosSeries = computed(() => [
  pedidos.value.filter(p => p.estado === 'pendiente').length,
  pedidos.value.filter(p => p.estado === 'aprobado').length,
  pedidos.value.filter(p => p.estado === 'entregado').length
])

// COMBUSTIBLE
const combustiblesFiltrados = computed(() => filtrarPorFecha(combustibles.value, 'fecha', filtroCombustibleMes.value, filtroCombustibleAnio.value))
const totalCombustible = computed(() => combustiblesFiltrados.value.reduce((a, c) => a + Number(c.total), 0).toFixed(2))
const totalGalones = computed(() => combustiblesFiltrados.value.reduce((a, c) => a + Number(c.galones), 0).toFixed(2))

const combustibleOpts = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: {
    categories: [...new Set(combustiblesFiltrados.value.map(c => {
      const v = vehiculos.value.find(ve => ve.id === c.vehiculo_id)
      return v ? v.placa : 'N/A'
    }))]
  },
  colors: ['#0dcaf0']
}))

const combustibleSeries = computed(() => {
  const placas = [...new Set(combustiblesFiltrados.value.map(c => {
    const v = vehiculos.value.find(ve => ve.id === c.vehiculo_id)
    return v ? v.placa : 'N/A'
  }))]
  return [{
    name: 'Total (Q)',
    data: placas.map(placa =>
      combustiblesFiltrados.value
        .filter(c => {
          const v = vehiculos.value.find(ve => ve.id === c.vehiculo_id)
          return v?.placa === placa
        })
        .reduce((a, c) => a + Number(c.total), 0)
    )
  }]
})

// VIÁTICOS
const viaticosFiltrados = computed(() => filtrarPorFecha(viaticos.value, 'fecha', filtroViaticosMes.value, filtroViaticosAnio.value))
const totalViaticos = computed(() => viaticosFiltrados.value.filter(v => v.estado === 'aprobado').reduce((a, v) => a + Number(v.monto), 0).toFixed(2))
const viaticosAprobados = computed(() => viaticosFiltrados.value.filter(v => v.estado === 'aprobado').length)
const viaticosPendientes = computed(() => viaticosFiltrados.value.filter(v => v.estado === 'pendiente').length)

const viaticosOpts = computed(() => ({
  labels: usuarios.value.map(u => u.nombre),
  colors: ['#0d6efd', '#198754', '#ffc107', '#dc3545']
}))

const viaticosSeries = computed(() => usuarios.value.map(u =>
  viaticosFiltrados.value.filter(v => v.usuario_id === u.id && v.estado === 'aprobado').reduce((a, v) => a + Number(v.monto), 0)
))

onMounted(cargar)
</script>