<template>
  <div>
    <h2>Proveedores</h2>
    <button class="btn btn-primary mb-3" @click="showForm = !showForm">Nuevo Proveedor</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>{{ editando ? 'Editar' : 'Crear' }} Proveedor</h5>
      <div class="row g-2 mb-2">
        <div class="col-md-6">
          <input v-model="form.nombre" class="form-control" placeholder="Nombre / Empresa" />
        </div>
        <div class="col-md-6">
          <input v-model="form.email" class="form-control" placeholder="Email" />
        </div>
        <div class="col-md-4">
          <input v-model="form.telefono" class="form-control" placeholder="Teléfono" />
        </div>
        <div class="col-md-4">
          <input v-model="form.nit" class="form-control" placeholder="NIT" />
        </div>
        <div class="col-md-4">
          <select v-model="form.activo" class="form-select">
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>
        <div class="col-12">
          <input v-model="form.direccion" class="form-control" placeholder="Dirección" />
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
            <th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>NIT</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in proveedores" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.nombre }}</td>
            <td>{{ p.email ?? '-' }}</td>
            <td>{{ p.telefono ?? '-' }}</td>
            <td>{{ p.nit ?? '-' }}</td>
            <td>
              <span :class="p.activo ? 'badge bg-success' : 'badge bg-secondary'">
                {{ p.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="editar(p)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminar(p.id)">Eliminar</button>
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
const proveedores = ref<any[]>([])
const showForm = ref(false)
const editando = ref(false)
const form = ref({ id: 0, nombre: '', email: '', telefono: '', direccion: '', nit: '', activo: true })

const limpiarForm = () => {
  form.value = { id: 0, nombre: '', email: '', telefono: '', direccion: '', nit: '', activo: true }
}

const cargar = async () => {
  const res = await axios.get(`${API}/proveedores`)
  proveedores.value = res.data
}

const guardar = async () => {
  if (editando.value) {
    await axios.put(`${API}/proveedores?id=${form.value.id}`, form.value)
  } else {
    await axios.post(`${API}/proveedores`, form.value)
  }
  showForm.value = false
  editando.value = false
  limpiarForm()
  await cargar()
}

const editar = (p: any) => {
  form.value = { ...p }
  editando.value = true
  showForm.value = true
}

const cancelar = () => {
  showForm.value = false
  editando.value = false
  limpiarForm()
}

const eliminar = async (id: any) => {
  if (confirm('¿Eliminar proveedor?')) {
    await axios.delete(`${API}/proveedores?id=${id}`)
    await cargar()
  }
}

onMounted(cargar)
</script>