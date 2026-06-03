<template>
  <div>
    <h2>Distribución</h2>

    <!-- Formularios arriba -->
    <div class="card p-3 mb-3">
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

    <div v-if="editando" class="card p-3 mb-3">
      <h5>Editar Distribución #{{ editForm.id }}</h5>
      <select v-model="editForm.estado" class="form-select mb-2">
        <option value="completo">Completo</option>
        <option value="incompleto">Incompleto</option>
      </select>
      <input v-model="editForm.observaciones" class="form-control mb-2" placeholder="Observaciones" />
      <button class="btn btn-success me-2" @click="guardarEdicion">Guardar</button>
      <button class="btn btn-secondary" @click="editando = false">Cancelar</button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th><th>Pedido</th><th>Fecha</th><th>Estado</th><th>Observaciones</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in paginado" :key="d.id">
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
const distribuciones = ref([])
const pedidosAprobados = ref([])
const form = ref({ pedido_id: '', observaciones: '' })
const editando = ref(false)
const editForm = ref<any>({ id: 0, estado: 'completo', observaciones: '' })
const editRef = ref<HTMLElement | null>(null)
const paginaActual = ref(1)
const porPagina = 10

const totalPaginas = computed(() => Math.ceil(distribuciones.value.length / porPagina))
const paginado = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return distribuciones.value.slice(inicio, inicio + porPagina)
})

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

const editar = async (d: any) => {
  editForm.value = { ...d }
  editando.value = true
  await nextTick()
  editRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const guardarEdicion = async () => {
  await axios.put(`${API}/distribuciones?id=${editForm.value.id}`, editForm.value)
  editando.value = false
  await cargar()
}

onMounted(cargar)
</script>