<template>
  <div>
    <h2>Combustible</h2>

    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card p-3 border-primary">
          <div class="text-muted small">Total gastado</div>
          <div class="fs-4 fw-bold text-primary">Q{{ totalGastado }}</div>
          <div class="text-muted small">Todos los registros</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3 border-success">
          <div class="text-muted small">Galones cargados</div>
          <div class="fs-4 fw-bold text-success">{{ totalGalones }}</div>
          <div class="text-muted small">Todos los registros</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3 border-warning">
          <div class="text-muted small">KM recorridos</div>
          <div class="fs-4 fw-bold text-warning">{{ totalKm }}</div>
          <div class="text-muted small">Todos los registros</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3 border-danger">
          <div class="text-muted small">Registros</div>
          <div class="fs-4 fw-bold text-danger">{{ combustibles.length }}</div>
          <div class="text-muted small">Total de cargas</div>
        </div>
      </div>
    </div>

    <button class="btn btn-primary mb-3" @click="showForm = !showForm">+ Registrar Carga</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>Registrar Carga de Combustible</h5>
      <div class="row g-2 mb-2">
        <div class="col-md-6">
          <label class="form-label small text-muted">Vehículo</label>
          <select v-model="form.vehiculo_id" class="form-select">
            <option value="">Selecciona vehículo</option>
            <option v-for="v in vehiculos" :key="v.id" :value="v.id">{{ v.placa }} — {{ v.marca }} {{ v.modelo }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">Galones</label>
          <input v-model="form.galones" type="number" class="form-control" placeholder="Ej: 15.5" />
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">Precio por galón (Q)</label>
          <input v-model="form.precio_galon" type="number" class="form-control" placeholder="Ej: 28.50" />
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">KM recorridos</label>
          <input v-model="form.km_recorridos" type="number" class="form-control" placeholder="Opcional" />
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">Total (Q)</label>
          <input :value="form.galones && form.precio_galon ? (form.galones * form.precio_galon).toFixed(2) : ''" class="form-control bg-light" readonly placeholder="Se calcula automático" />
        </div>
        <div class="col-md-6">
          <label class="form-label small text-muted">Observaciones</label>
          <input v-model="form.observaciones" class="form-control" placeholder="Opcional" />
        </div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-success" @click="guardar">Guardar</button>
        <button class="btn btn-secondary" @click="cancelar">Cancelar</button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th><th>Vehículo</th><th>Fecha</th><th>Galones</th><th>Precio/Gal</th><th>KM</th><th>Total</th><th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in combustibles" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ vehiculos.find(v => v.id === c.vehiculo_id)?.placa }}</td>
            <td>{{ new Date(c.fecha).toLocaleDateString() }}</td>
            <td>{{ c.galones }}</td>
            <td>Q{{ c.precio_galon }}</td>
            <td>{{ c.km_recorridos ?? '-' }}</td>
            <td class="fw-bold">Q{{ c.total }}</td>
            <td>{{ c.observaciones ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const combustibles = ref<any[]>([])
const vehiculos = ref<any[]>([])
const showForm = ref(false)
const form = ref({ vehiculo_id: '', galones: '', precio_galon: '', km_recorridos: '', observaciones: '' })

const totalGastado = computed(() => combustibles.value.reduce((a, c) => a + Number(c.total), 0).toFixed(2))
const totalGalones = computed(() => combustibles.value.reduce((a, c) => a + Number(c.galones), 0).toFixed(2))
const totalKm = computed(() => combustibles.value.reduce((a, c) => a + Number(c.km_recorridos || 0), 0).toFixed(0))

const cargar = async () => {
  const [c, v] = await Promise.all([
    axios.get(`${API}/combustible`),
    axios.get(`${API}/vehiculos`)
  ])
  combustibles.value = c.data
  vehiculos.value = v.data
}

const guardar = async () => {
  if (!form.value.vehiculo_id || !form.value.galones || !form.value.precio_galon) return
  await axios.post(`${API}/combustible`, form.value)
  showForm.value = false
  form.value = { vehiculo_id: '', galones: '', precio_galon: '', km_recorridos: '', observaciones: '' }
  await cargar()
}

const cancelar = () => {
  showForm.value = false
  form.value = { vehiculo_id: '', galones: '', precio_galon: '', km_recorridos: '', observaciones: '' }
}

onMounted(cargar)
</script>