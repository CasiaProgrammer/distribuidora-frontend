<template>
  <div>
    <h2>Planilla</h2>

    <div class="card p-3 mb-4">
      <h5>Generar Nueva Planilla</h5>
      <input v-model="form.periodo" class="form-control mb-2" placeholder="Periodo (ej: Mayo 2026)" />
      <button class="btn btn-success" @click="generar">Generar Planilla</button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped mb-4">
        <thead class="table-dark">
          <tr>
            <th>ID</th><th>Periodo</th><th>Fecha</th><th>Total</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in planillas" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.periodo }}</td>
            <td>{{ new Date(p.fecha).toLocaleDateString() }}</td>
            <td>Q{{ p.total }}</td>
            <td>
              <button class="btn btn-sm btn-info" @click="verDetalle(p)">Ver Detalle</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="planillaSeleccionada" class="card p-3">
      <h5>Planilla: {{ planillaSeleccionada.periodo }}</h5>

      <div class="row mb-3">
        <div class="col">
          <select v-model="detalle.vendedor_id" class="form-select">
            <option value="">Selecciona vendedor</option>
            <option v-for="v in vendedores" :key="v.id" :value="v.id">{{ v.nombre }}</option>
          </select>
        </div>
        <div class="col">
          <input v-model="detalle.salario_base" type="number" class="form-control" placeholder="Salario base" />
        </div>
        <div class="col-auto">
          <button class="btn btn-success" @click="agregarDetalle">Agregar</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-sm table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Vendedor</th><th>Salario Base</th><th>Comisiones</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in detalles" :key="d.id">
              <td>{{ vendedores.find(v => v.id === d.vendedor_id)?.nombre }}</td>
              <td>Q{{ d.salario_base }}</td>
              <td>Q{{ d.comisiones }}</td>
              <td>Q{{ d.total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="table-success">
              <td colspan="3"><strong>Total Planilla</strong></td>
              <td><strong>Q{{ detalles.reduce((a, d) => a + Number(d.total), 0) }}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button class="btn btn-secondary mt-2" @click="planillaSeleccionada = null">Cerrar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const planillas = ref([])
const vendedores = ref([])
const form = ref({ periodo: '' })
const planillaSeleccionada = ref<any>(null)
const detalles = ref<any[]>([])
const detalle = ref({ vendedor_id: '', salario_base: '' })

const cargar = async () => {
  const [p, u] = await Promise.all([
    axios.get(`${API}/planillas`),
    axios.get(`${API}/usuarios`)
  ])
  planillas.value = p.data
  vendedores.value = u.data.filter((u: any) => u.rol === 'vendedor')
}

const generar = async () => {
  if (!form.value.periodo) return
  await axios.post(`${API}/planillas`, { periodo: form.value.periodo, total: 0 })
  form.value = { periodo: '' }
  await cargar()
}

const verDetalle = async (p: any) => {
  planillaSeleccionada.value = p
  const res = await axios.get(`${API}/planillas/${p.id}/detalle`)
  detalles.value = res.data
}

const agregarDetalle = async () => {
  if (!detalle.value.vendedor_id || !detalle.value.salario_base) return
  await axios.post(`${API}/planillas/${planillaSeleccionada.value.id}/detalle`, {
    planilla_id: planillaSeleccionada.value.id,
    vendedor_id: detalle.value.vendedor_id,
    salario_base: detalle.value.salario_base
  })
  detalle.value = { vendedor_id: '', salario_base: 0 }
  await cargar()
  await verDetalle(planillaSeleccionada.value)
}

onMounted(cargar)
</script>