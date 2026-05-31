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

    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categorias" :key="c.id">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL
const categorias = ref([])
const showForm = ref(false)
const editando = ref(false)
const form = ref({ id: 0, nombre: '', descripcion: '' })

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