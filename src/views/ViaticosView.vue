<template>
  <div>
    <h2>Viáticos</h2>
    <button class="btn btn-primary mb-3" @click="showForm = !showForm">+ Solicitar Viático</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>Nueva Solicitud de Viático</h5>
      <div class="row g-2 mb-2">
        <div class="col-md-4">
          <label class="form-label small text-muted">Solicitante</label>
          <select v-model="form.usuario_id" class="form-select">
            <option value="">Selecciona usuario</option>
            <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nombre }} ({{ u.rol }})</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label small text-muted">Vehículo (opcional)</label>
          <select v-model="form.vehiculo_id" class="form-select">
            <option value="">Sin vehículo</option>
            <option v-for="v in vehiculos" :key="v.id" :value="v.id">{{ v.placa }} — {{ v.marca }} {{ v.modelo }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label small text-muted">Destino</label>
          <input v-model="form.destino" class="form-control" placeholder="Ciudad o lugar" />
        </div>
        <div class="col-md-4">
          <label class="form-label small text-muted">Monto (Q)</label>
          <input v-model="form.monto" type="number" class="form-control" placeholder="Ej: 500.00" />
        </div>
        <div class="col-md-8">
          <label class="form-label small text-muted">Motivo</label>
          <input v-model="form.motivo" class="form-control" placeholder="Describe el motivo" />
        </div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-success" @click="guardar">Enviar Solicitud</button>
        <button class="btn btn-secondary" @click="cancelar">Cancelar</button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th><th>Solicitante</th><th>Destino</th><th>Motivo</th><th>Monto</th><th>Vehículo</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in viaticos" :key="v.id">
            <td>{{ v.id }}</td>
            <td>{{ usuarios.find(u => u.id === v.usuario_id)?.nombre }}</td>
            <td>{{ v.destino }}</td>
            <td>{{ v.motivo ?? '-' }}</td>
            <td class="fw-bold">Q{{ v.monto }}</td>
            <td>{{ vehiculos.find(ve => ve.id === v.vehiculo_id)?.placa ?? '-' }}</td>
            <td>{{ new Date(v.fecha).toLocaleDateString() }}</td>
            <td>
              <span :class="{
                'badge bg-warning': v.estado === 'pendiente',
                'badge bg-success': v.estado === 'aprobado',
                'badge bg-danger': v.estado === 'rechazado'
              }">{{ v.estado }}</span>
            </td>
            <td>
              <div class="d-flex gap-1">
                <button v-if="v.estado === 'pendiente'" class="btn btn-sm btn-success" @click="cambiarEstado(v.id, 'aprobado')">Aprobar</button>
                <button v-if="v.estado === 'pendiente'" class="btn btn-sm btn-danger" @click="cambiarEstado(v.id, 'rechazado')">Rechazar</button>
                <span v-if="v.estado !== 'pendiente'" class="text-muted small">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const viaticos = ref<any[]>([])
const usuarios = ref<any[]>([])
const vehiculos = ref<any[]>([])
const showForm = ref(false)
const form = ref({ usuario_id: '', vehiculo_id: '', destino: '', motivo: '', monto: '' })

const cargar = async () => {
  const [vi, u, ve] = await Promise.all([
    axios.get(`${API}/viaticos`),
    axios.get(`${API}/usuarios`),
    axios.get(`${API}/vehiculos`)
  ])
  viaticos.value = vi.data
  usuarios.value = u.data
  vehiculos.value = ve.data
}

const guardar = async () => {
  if (!form.value.usuario_id || !form.value.destino || !form.value.monto) return
  await axios.post(`${API}/viaticos`, form.value)
  showForm.value = false
  form.value = { usuario_id: '', vehiculo_id: '', destino: '', motivo: '', monto: '' }
  await cargar()
}

const cancelar = () => {
  showForm.value = false
  form.value = { usuario_id: '', vehiculo_id: '', destino: '', motivo: '', monto: '' }
}

const cambiarEstado = async (id: any, estado: string) => {
  await axios.put(`${API}/viaticos?id=${id}`, { estado })
  await cargar()
}

onMounted(cargar)
</script>