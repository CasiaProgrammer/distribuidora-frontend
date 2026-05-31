<template>
  <div>
    <h2>Pedidos</h2>
    <button class="btn btn-primary mb-3" @click="showForm = !showForm">Nuevo Pedido</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>Crear Pedido</h5>
      <select v-model="form.vendedor_id" class="form-select mb-2">
        <option value="">Selecciona vendedor</option>
        <option v-for="u in vendedores" :key="u.id" :value="u.id">{{ u.nombre }}</option>
      </select>
      <button class="btn btn-success" @click="guardar">Guardar</button>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th><th>Vendedor</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pedidos" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ vendedores.find(v => v.id === p.vendedor_id)?.nombre }}</td>
          <td>{{ new Date(p.fecha).toLocaleDateString() }}</td>
          <td>
            <span :class="{
              'badge bg-warning': p.estado === 'pendiente',
              'badge bg-success': p.estado === 'aprobado',
              'badge bg-primary': p.estado === 'entregado'
            }">{{ p.estado }}</span>
          </td>
          <td>Q{{ p.total }}</td>
          <td>
            <button class="btn btn-sm btn-info me-1" @click="verDetalle(p)">+ Detalle</button>
            <select class="form-select form-select-sm mt-1" @change="cambiarEstado(p.id, $event)">
              <option value="">Cambiar estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="entregado">Entregado</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal detalle -->
    <div v-if="pedidoSeleccionado" class="card p-3 mt-3">
      <h5>Detalle del Pedido #{{ pedidoSeleccionado.id }}</h5>
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
      <button class="btn btn-secondary" @click="pedidoSeleccionado = null">Cerrar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const pedidos = ref([])
const vendedores = ref([])
const productos = ref([])
const showForm = ref(false)
const form = ref({ vendedor_id: '' })
const pedidoSeleccionado = ref<any>(null)
const detalles = ref([])
const detalle = ref({ producto_id: '', cantidad: '', precio_unitario: '' })

const cargar = async () => {
  const [p, u, pr] = await Promise.all([
    axios.get(`${API}/pedidos`),
    axios.get(`${API}/usuarios`),
    axios.get(`${API}/productos`)
  ])
  pedidos.value = p.data
  vendedores.value = u.data.filter((u: any) => u.rol === 'vendedor')
  productos.value = pr.data
}

const guardar = async () => {
  await axios.post(`${API}/pedidos`, { vendedor_id: form.value.vendedor_id, estado: 'pendiente', total: 0 })
  showForm.value = false
  form.value = { vendedor_id: '' }
  await cargar()
}

const cambiarEstado = async (id: any, event: any) => {
  const estado = event.target.value
  if (estado) {
    await axios.put(`${API}/pedidos?id=${id}`, { estado })
    await cargar()
  }
}

const verDetalle = async (p: any) => {
  pedidoSeleccionado.value = p
  const res = await axios.get(`${API}/pedidos/${p.id}/detalle`)
  detalles.value = res.data
}

const agregarDetalle = async () => {
  if (!detalle.value.producto_id || !detalle.value.cantidad) return
  const res = await axios.post(`${API}/pedidos/${pedidoSeleccionado.value.id}/detalle`, {
    pedido_id: pedidoSeleccionado.value.id,
    producto_id: detalle.value.producto_id,
    cantidad: detalle.value.cantidad,
    precio_unitario: detalle.value.precio_unitario
  })
  if (res.data.error) {
    alert(res.data.error)
    return
  }
  detalle.value = { producto_id: '', cantidad: 1, precio_unitario: 0 }
  await verDetalle(pedidoSeleccionado.value)
  await cargar()
}

onMounted(cargar)
</script>