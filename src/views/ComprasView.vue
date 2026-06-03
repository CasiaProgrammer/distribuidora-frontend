<template>
  <div>
    <h2>Compras</h2>

    <div class="alert alert-warning" v-if="sinStock.length > 0">
      <strong>⚠️ Productos sin stock:</strong>
      <span v-for="p in sinStock" :key="p.id" class="badge bg-danger me-1">{{ p.nombre }}</span>
    </div>

    <button class="btn btn-primary mb-3" @click="showForm = !showForm">Nueva Compra</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>Crear Compra</h5>
      <select v-model="form.proveedor" class="form-select mb-2">
        <option value="">Selecciona proveedor</option>
        <option v-for="p in proveedores" :key="p.id" :value="p.nombre">{{ p.nombre }}</option>
      </select>
      <button class="btn btn-success" @click="guardar">Guardar</button>
    </div>

    <!-- Detalle arriba de la tabla -->
    <div v-if="compraSeleccionada" ref="detalleRef" class="card p-3 mb-3">
      <h5>Detalle de Compra #{{ compraSeleccionada.id }}</h5>
      <div class="row mb-2">
        <div class="col">
          <select v-model="detalle.producto_id" class="form-select">
            <option value="">Selecciona producto</option>
            <option v-for="p in productos" :key="p.id" :value="p.id">{{ p.nombre }} (Stock: {{ p.stock }})</option>
          </select>
        </div>
        <div class="col">
          <input v-model="detalle.cantidad" type="number" class="form-control" placeholder="Cantidad" />
        </div>
        <div class="col">
          <input v-model="detalle.precio_unitario" type="number" class="form-control" placeholder="Precio unitario" />
        </div>
        <div class="col-auto">
          <button class="btn btn-success" @click="agregarDetalle">Agregar</button>
        </div>
      </div>

      <table class="table table-sm table-bordered">
        <thead class="table-secondary">
          <tr>
            <th>Producto</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in detalles" :key="d.id">
            <td>{{ productos.find(p => p.id === d.producto_id)?.nombre }}</td>
            <td>{{ d.cantidad }}</td>
            <td>Q{{ d.precio_unitario }}</td>
            <td>Q{{ d.cantidad * d.precio_unitario }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-secondary" @click="compraSeleccionada = null">Cerrar</button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th><th>Proveedor</th><th>Fecha</th><th>Total</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in paginado" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ c.proveedor }}</td>
            <td>{{ new Date(c.fecha).toLocaleDateString() }}</td>
            <td>Q{{ c.total }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="verDetalle(c)">+ Detalle</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="totalPaginas > 1">
      <ul class="pagination pagination-sm">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <button class="page-link" @click="paginaActual--">‹</button>
        </li>
        <li class="page-item" v-for="p in totalPaginas" :key="p" :class="{ active: p === paginaActual }">
          <button class="page-link" @click="paginaActual = p">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
          <button class="page-link" @click="paginaActual++">›</button>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const compras = ref([])
const productos = ref([])
const proveedores = ref([])
const sinStock = ref([])
const showForm = ref(false)
const form = ref({ proveedor: '' })
const compraSeleccionada = ref<any>(null)
const detalles = ref([])
const detalle = ref({ producto_id: '', cantidad: '', precio_unitario: '' })
const detalleRef = ref<HTMLElement | null>(null)
const paginaActual = ref(1)
const porPagina = 10

const totalPaginas = computed(() => Math.ceil(compras.value.length / porPagina))
const paginado = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return compras.value.slice(inicio, inicio + porPagina)
})

const cargar = async () => {
  const [c, p, s, pr] = await Promise.all([
    axios.get(`${API}/compras`),
    axios.get(`${API}/productos`),
    axios.get(`${API}/productos/sin-stock`),
    axios.get(`${API}/proveedores`)
  ])
  compras.value = c.data
  productos.value = p.data
  sinStock.value = s.data
  proveedores.value = pr.data
}

const guardar = async () => {
  if (!form.value.proveedor) return
  await axios.post(`${API}/compras`, { proveedor: form.value.proveedor, total: 0 })
  showForm.value = false
  form.value = { proveedor: '' }
  await cargar()
}

const verDetalle = async (c: any) => {
  compraSeleccionada.value = c
  const res = await axios.get(`${API}/compras/${c.id}/detalle`)
  detalles.value = res.data
  await nextTick()
  detalleRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const agregarDetalle = async () => {
  if (!detalle.value.producto_id || !detalle.value.cantidad) return
  await axios.post(`${API}/compras/${compraSeleccionada.value.id}/detalle`, {
    compra_id: compraSeleccionada.value.id,
    producto_id: detalle.value.producto_id,
    cantidad: detalle.value.cantidad,
    precio_unitario: detalle.value.precio_unitario
  })
  detalle.value = { producto_id: '', cantidad: 1, precio_unitario: 0 }
  await verDetalle(compraSeleccionada.value)
  await cargar()
}

onMounted(cargar)
</script>