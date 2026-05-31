<template>
  <div>
    <h2>Comisiones</h2>

    <div class="card p-3 mb-4">
      <h5>Registrar Comisión</h5>
      <select v-model="form.vendedor_id" class="form-select mb-2">
        <option value="">Selecciona vendedor</option>
        <option v-for="v in vendedores" :key="v.id" :value="v.id">{{ v.nombre }}</option>
      </select>
      <select v-model="form.pedido_id" class="form-select mb-2">
        <option value="">Selecciona pedido entregado</option>
        <option v-for="p in pedidosEntregados" :key="p.id" :value="p.id">Pedido #{{ p.id }} - Q{{ p.total }}</option>
      </select>
      <input v-model="form.porcentaje" type="number" class="form-control mb-2" placeholder="Porcentaje (ej: 5)" />
      <button class="btn btn-success" @click="registrar">Registrar Comisión</button>
    </div>

    <div class="card p-3 mb-4">
      <h5>Consultar por Vendedor</h5>
      <div class="row">
        <div class="col">
          <select v-model="vendedorSeleccionado" class="form-select">
            <option value="">Selecciona vendedor</option>
            <option v-for="v in vendedores" :key="v.id" :value="v.id">{{ v.nombre }}</option>
          </select>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" @click="consultar">Consultar</button>
        </div>
      </div>

      <div v-if="resumen" class="mt-3">
        <div class="alert alert-success">
          <strong>Total acumulado: Q{{ resumen.total }}</strong>
        </div>
        <table class="table table-sm table-bordered">
          <thead class="table-dark">
            <tr>
              <th>ID</th><th>Pedido</th><th>Porcentaje</th><th>Monto</th><th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in resumen.comisiones" :key="c.id">
              <td>{{ c.id }}</td>
              <td>#{{ c.pedido_id }}</td>
              <td>{{ c.porcentaje }}%</td>
              <td>Q{{ c.monto }}</td>
              <td>{{ new Date(c.fecha).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <h5>Todas las Comisiones</h5>
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th><th>Vendedor</th><th>Pedido</th><th>Porcentaje</th><th>Monto</th><th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in comisiones" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ vendedores.find(v => v.id === c.vendedor_id)?.nombre }}</td>
          <td>#{{ c.pedido_id }}</td>
          <td>{{ c.porcentaje }}%</td>
          <td>Q{{ c.monto }}</td>
          <td>{{ new Date(c.fecha).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const comisiones = ref([])
const vendedores = ref([])
const pedidosEntregados = ref([])
const form = ref({ vendedor_id: '', pedido_id: '', porcentaje: '' })
const vendedorSeleccionado = ref('')
const resumen = ref<any>(null)

const cargar = async () => {
  const [c, u, p] = await Promise.all([
    axios.get(`${API}/comisiones`),
    axios.get(`${API}/usuarios`),
    axios.get(`${API}/pedidos`)
  ])
  comisiones.value = c.data
  vendedores.value = u.data.filter((u: any) => u.rol === 'vendedor')
  pedidosEntregados.value = p.data.filter((p: any) => p.estado === 'entregado')
}

const registrar = async () => {
  if (!form.value.vendedor_id || !form.value.pedido_id || !form.value.porcentaje) return
  const res = await axios.post(`${API}/comisiones`, form.value)
  if (res.data.error) { alert(res.data.error); return }
  alert(`Comisión registrada: Q${res.data.monto}`)
  form.value = { vendedor_id: '', pedido_id: '', porcentaje: 5 }
  await cargar()
}

const consultar = async () => {
  if (!vendedorSeleccionado.value) return
  const res = await axios.get(`${API}/comisiones/vendedor/${vendedorSeleccionado.value}`)
  resumen.value = res.data
}

onMounted(cargar)
</script>