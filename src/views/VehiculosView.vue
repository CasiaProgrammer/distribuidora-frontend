<template>
  <div>
    <h2>Vehículos</h2>
    <button class="btn btn-primary mb-3" @click="showForm = !showForm">Nuevo Vehículo</button>

    <div v-if="showForm" class="card p-3 mb-3">
      <h5>{{ editando ? 'Editar' : 'Crear' }} Vehículo</h5>
      <div class="row g-2 mb-2">
        <div class="col-md-4">
          <input v-model="form.placa" class="form-control" placeholder="Placa (ej: P-123ABC)" />
        </div>
        <div class="col-md-4">
          <input v-model="form.marca" class="form-control" placeholder="Marca (ej: Toyota)" />
        </div>
        <div class="col-md-4">
          <input v-model="form.modelo" class="form-control" placeholder="Modelo (ej: Hilux)" />
        </div>
        <div class="col-md-3">
          <input v-model="form.anio" type="number" class="form-control" placeholder="Año (ej: 2022)" />
        </div>
        <div class="col-md-3">
          <select v-model="form.tipo_combustible" class="form-select">
            <option value="">Tipo combustible</option>
            <option value="diesel">Diesel</option>
            <option value="gasolina">Gasolina</option>
          </select>
        </div>
        <div class="col-md-3">
          <input v-model="form.rendimiento" type="number" class="form-control" placeholder="Rendimiento km/gal" />
        </div>
        <div class="col-md-3">
          <select v-model="form.activo" class="form-select">
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
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
            <th>ID</th><th>Placa</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Combustible</th><th>Rendimiento</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in vehiculos" :key="v.id">
            <td>{{ v.id }}</td>
            <td>{{ v.placa }}</td>
            <td>{{ v.marca }}</td>
            <td>{{ v.modelo }}</td>
            <td>{{ v.anio ?? '-' }}</td>
            <td>
              <span :class="v.tipo_combustible === 'diesel' ? 'badge bg-info' : 'badge bg-warning'">
                {{ v.tipo_combustible }}
              </span>
            </td>
            <td>{{ v.rendimiento }} km/gal</td>
            <td>
              <span :class="v.activo ? 'badge bg-success' : 'badge bg-secondary'">
                {{ v.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="editar(v)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminar(v.id)">Eliminar</button>
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
const vehiculos = ref<any[]>([])
const showForm = ref(false)
const editando = ref(false)
const form = ref({ id: 0, placa: '', marca: '', modelo: '', anio: '', tipo_combustible: '', rendimiento: '', activo: true })

const limpiarForm = () => {
  form.value = { id: 0, placa: '', marca: '', modelo: '', anio: '', tipo_combustible: '', rendimiento: '', activo: true }
}

const cargar = async () => {
  const res = await axios.get(`${API}/vehiculos`)
  vehiculos.value = res.data
}

const guardar = async () => {
  if (editando.value) {
    await axios.put(`${API}/vehiculos?id=${form.value.id}`, form.value)
  } else {
    await axios.post(`${API}/vehiculos`, form.value)
  }
  showForm.value = false
  editando.value = false
  limpiarForm()
  await cargar()
}

const editar = (v: any) => {
  form.value = { ...v }
  editando.value = true
  showForm.value = true
}

const cancelar = () => {
  showForm.value = false
  editando.value = false
  limpiarForm()
}

const eliminar = async (id: any) => {
  if (confirm('¿Eliminar vehículo?')) {
    await axios.delete(`${API}/vehiculos?id=${id}`)
    await cargar()
  }
}

onMounted(cargar)
</script>