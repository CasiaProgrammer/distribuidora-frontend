<template>
  <div>
    <h2>Categorías</h2>
    <button class="btn btn-primary mb-3" @click="showForm = !showForm">Nueva Categoría</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>{{ editando ? 'Editar' : 'Crear' }} Categoría</h5>
      <input v-model="form.nombre" class="form-control mb-2" placeholder="Nombre" />
      <input v-model="form.descripcion" class="form-control mb-2" placeholder="Descripción" />
      <button class="btn btn-success" @click="guardar">Guardar</button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in paginado" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ c.nombre }}</td>
            <td>{{ c.descripcion }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="editar(c)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminar(c.id)">Eliminar</button>
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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const categorias = ref([])
const showForm = ref(false)
const editando = ref(false)
const form = ref({ id: 0, nombre: '', descripcion: '' })
const paginaActual = ref(1)
const porPagina = 10

const totalPaginas = computed(() => Math.ceil(categorias.value.length / porPagina))
const paginado = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return categorias.value.slice(inicio, inicio + porPagina)
})

const cargar = async () => {
  const res = await axios.get(`${API}/categorias`)
  categorias.value = res.data
}

const guardar = async () => {
  if (editando.value) {
    await axios.put(`${API}/categorias?id=${form.value.id}`, form.value)
  } else {
    await axios.post(`${API}/categorias`, form.value)
  }
  showForm.value = false
  editando.value = false
  form.value = { id: 0, nombre: '', descripcion: '' }
  await cargar()
}

const editar = (c: any) => {
  form.value = { ...c }
  editando.value = true
  showForm.value = true
}

const eliminar = async (id: any) => {
  if (confirm('¿Eliminar categoría?')) {
    await axios.delete(`${API}/categorias?id=${id}`)
    await cargar()
  }
}

onMounted(cargar)
</script>