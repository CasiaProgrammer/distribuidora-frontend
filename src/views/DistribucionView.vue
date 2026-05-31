<template>
  <div>
    <h2>Distribución</h2>

    <table class="table table-bordered table-striped mb-4">
      <thead class="table-dark">
        <tr>
          <th>ID</th><th>Pedido</th><th>Fecha</th><th>Estado</th><th>Observaciones</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in distribuciones" :key="d.id">
          <td>{{ d.id }}</td>
          <td>#{{ d.pedido_id }}</td>
          <td>{{ new Date(d.fecha).toLocaleDateString() }}</td>
          <td>
            <span :class="{
              'badge bg-success': d.estado === 'completo',
              'badge bg-warning': d.estado === 'incompleto'
            }">{{ d.estado }}</span>
          </td>
          <td>{{ d.observaciones ?? '-' }}</td>
          <td>
            <button class="btn btn-sm btn-warning" @click="editar(d)">Editar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="card p-3">
      <h5>Registrar Entrega</h5>
      <select v-model="form.pedido_id" class="form-select mb-2">
        <option value="">Selecciona pedido aprobado</option>
        <option v-for="p in pedidosAprobados" :key="p.id" :value="p.id">
          Pedido #{{ p.id }}
        </option>
      </select>
      <input v-model="form.observaciones" class="form-control mb-2" placeholder="Observaciones (opcional)" />
      <button class="btn btn-success" @click="registrar">Registrar Entrega</button>
    </div>

    <div v-if="editando" class="card p-3 mt-3">
      <h5>Editar Distribución #{{ editForm.id }}</h5>
      <select v-model="editForm.estado" class="form-select mb-2">
        <option value="completo">Completo</option>
        <option value="incompleto">Incompleto</option>
      </select>
      <input v-model="editForm.observaciones" class="form-control mb-2" placeholder="Observaciones" />
      <button class="btn btn-success me-2" @click="guardarEdicion">Guardar</button>
      <button class="btn btn-secondary" @click="editando = false">Cancelar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const distribuciones = ref([])
const pedidosAprobados = ref([])
const form = ref({ pedido_id: '', observaciones: '' })
const editando = ref(false)
const editForm = ref<any>({ id: 0, estado: 'completo', observaciones: '' })

const cargar = async () => {
  const [d, p] = await Promise.all([
    axios.get(`${API}/distribuciones`),
    axios.get(`${API}/pedidos`)
  ])
  distribuciones.value = d.data
  pedidosAprobados.value = p.data.filter((p: any) => p.estado === 'aprobado')
}

const registrar = async () => {
  if (!form.value.pedido_id) return
  const res = await axios.post(`${API}/distribuciones`, form.value)
  if (res.data.error) { alert(res.data.error); return }
  form.value = { pedido_id: '', observaciones: '' }
  await cargar()
}

const editar = (d: any) => {
  editForm.value = { ...d }
  editando.value = true
}

const guardarEdicion = async () => {
  await axios.put(`${API}/distribuciones?id=${editForm.value.id}`, editForm.value)
  editando.value = false
  await cargar()
}

onMounted(cargar)
</script>