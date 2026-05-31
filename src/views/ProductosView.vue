<template>
  <div>
    <h2>Productos</h2>
    <button class="btn btn-primary mb-3" @click="showForm = !showForm">Nuevo Producto</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>{{ editando ? 'Editar' : 'Crear' }} Producto</h5>
      <input v-model="form.nombre" class="form-control mb-2" placeholder="Nombre" />
      <input v-model="form.descripcion" class="form-control mb-2" placeholder="Descripción" />
      <input v-model="form.precio" type="number" class="form-control mb-2" placeholder="Precio (ej: 25.50)" data-bs-toggle="tooltip" data-bs-placement="top" title="Ingresa el precio del producto" />
      <input v-model="form.stock" type="number" class="form-control mb-2" placeholder="Stock (ej: 100)" data-bs-toggle="tooltip" data-bs-placement="top" title="Ingresa la cantidad disponible" />
      <select v-model="form.categoria_id" class="form-select mb-2">
        <option value="">Selecciona categoría</option>
        <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
      </select>
      <button class="btn btn-success" @click="guardar">Guardar</button>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in productos" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.nombre }}</td>
          <td>Q{{ p.precio }}</td>
          <td>{{ p.stock }}</td>
          <td>{{ categorias.find(c => c.id === p.categoria_id)?.nombre }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" @click="editar(p)">Editar</button>
            <button class="btn btn-sm btn-danger" @click="eliminar(p.id)">Eliminar</button>
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
const productos = ref([])
const categorias = ref([])
const showForm = ref(false)
const editando = ref(false)
const form = ref({ id: 0, nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '' })

const cargar = async () => {
  const [p, c] = await Promise.all([
    axios.get(`${API}/productos`),
    axios.get(`${API}/categorias`)
  ])
  productos.value = p.data
  categorias.value = c.data
}

const guardar = async () => {
  if (editando.value) {
    await axios.put(`${API}/productos?id=${form.value.id}`, form.value)
  } else {
    await axios.post(`${API}/productos`, form.value)
  }
  showForm.value = false
  editando.value = false
  form.value = { id: 0, nombre: '', descripcion: '', precio: 0, stock: 0, categoria_id: '' }
  await cargar()
}

const editar = (p: any) => {
  form.value = { ...p }
  editando.value = true
  showForm.value = true
}

const eliminar = async (id: any) => {
  if (confirm('¿Eliminar producto?')) {
    await axios.delete(`${API}/productos?id=${id}`)
    await cargar()
  }
}

onMounted(cargar)

import { Tooltip } from 'bootstrap'
import { nextTick } from 'vue'

nextTick(() => {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new Tooltip(el)
  })
})

</script>