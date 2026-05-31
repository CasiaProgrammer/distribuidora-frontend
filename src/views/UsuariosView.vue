<template>
  <div>
    <h2>Usuarios</h2>
    <button class="btn btn-primary mb-3" @click="showForm = !showForm">Nuevo Usuario</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>{{ editando ? 'Editar' : 'Crear' }} Usuario</h5>
      <input v-model="form.nombre" class="form-control mb-2" placeholder="Nombre" />
      <input v-model="form.email" class="form-control mb-2" placeholder="Email" />
      <input v-model="form.password" type="password" class="form-control mb-2" :placeholder="editando ? 'Dejar vacío para no cambiar' : 'Password'" />
      <select v-model="form.rol" class="form-select mb-2">
        <option value="administrador">Administrador</option>
        <option value="vendedor">Vendedor</option>
        <option value="compras">Compras</option>
      </select>
      <button class="btn btn-success" @click="guardar">Guardar</button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuarios" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.nombre }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.rol }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="editar(u)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminar(u.id)">Eliminar</button>
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
const usuarios = ref([])
const showForm = ref(false)
const editando = ref(false)
const form = ref({ id: 0, nombre: '', email: '', password: '', rol: 'vendedor' })

const limpiarForm = () => {
  form.value = { id: 0, nombre: '', email: '', password: '', rol: 'vendedor' }
}

const cargar = async () => {
  const res = await axios.get(`${API}/usuarios`)
  usuarios.value = res.data
}

const guardar = async () => {
  if (editando.value) {
    await axios.put(`${API}/usuarios?id=${form.value.id}`, form.value)
  } else {
    await axios.post(`${API}/usuarios`, form.value)
  }
  showForm.value = false
  editando.value = false
  limpiarForm()
  await cargar()
}

const editar = (u: any) => {
  form.value = { ...u, password: '' }
  editando.value = true
  showForm.value = true
}

const eliminar = async (id: any) => {
  if (confirm('¿Eliminar usuario?')) {
    await axios.delete(`${API}/usuarios?id=${id}`)
    await cargar()
  }
}

onMounted(cargar)
</script>