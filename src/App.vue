<template>
  <div>
    <nav v-if="usuario" class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Distribuidora</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <div class="navbar-nav ms-auto">

            <router-link class="nav-link" to="/">Dashboard</router-link>

            <!-- MANTENIMIENTO - solo administrador -->
            <div v-if="esAdmin" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Mantenimiento
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><router-link class="dropdown-item" to="/usuarios">Usuarios</router-link></li>
                <li><router-link class="dropdown-item" to="/categorias">Categorías</router-link></li>
                <li><router-link class="dropdown-item" to="/productos">Productos</router-link></li>
                <li><router-link class="dropdown-item" to="/clientes">Clientes</router-link></li>
                <li><router-link class="dropdown-item" to="/proveedores">Proveedores</router-link></li>
                <li><router-link class="dropdown-item" to="/vehiculos">Vehículos</router-link></li>
              </ul>
            </div>

            <!-- OPERATIVO - administrador, vendedor y compras -->
            <div v-if="esAdmin || esVendedor || esCompras" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Operativo
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li v-if="esAdmin || esVendedor"><router-link class="dropdown-item" to="/pedidos">Pedidos</router-link></li>
                <li v-if="esAdmin || esCompras"><router-link class="dropdown-item" to="/compras">Compras</router-link></li>
              </ul>
            </div>

            <!-- LOGÍSTICA - administrador y piloto -->
            <div v-if="esAdmin || esPiloto" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Logística
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li v-if="esAdmin"><router-link class="dropdown-item" to="/distribucion">Distribución</router-link></li>
                <li v-if="esAdmin || esPiloto"><router-link class="dropdown-item" to="/combustible">Combustible</router-link></li>
                <li v-if="esAdmin || esPiloto"><router-link class="dropdown-item" to="/viaticos">Viáticos</router-link></li>
              </ul>
            </div>

            <!-- ADMINISTRATIVO - solo administrador -->
            <div v-if="esAdmin" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Administrativo
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><router-link class="dropdown-item" to="/comisiones">Comisiones</router-link></li>
                <li><router-link class="dropdown-item" to="/planilla">Planilla</router-link></li>
              </ul>
            </div>

            <!-- REPORTES - solo administrador -->
            <router-link v-if="esAdmin" class="nav-link" to="/reportes">Reportes</router-link>

            <span class="nav-link text-white opacity-75">👤 {{ usuario?.nombre }}</span>
            <a class="nav-link text-danger" href="#" @click="cerrarSesion">Cerrar Sesión</a>

          </div>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'

const router = useRouter()
const route = useRoute()

const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))

watch(route, () => {
  usuario.value = JSON.parse(localStorage.getItem('usuario') || 'null')
})

const esAdmin = computed(() => usuario.value?.rol === 'administrador')
const esVendedor = computed(() => usuario.value?.rol === 'vendedor')
const esCompras = computed(() => usuario.value?.rol === 'compras')
const esPiloto = computed(() => usuario.value?.rol === 'piloto')

const cerrarSesion = () => {
  const nombre = usuario.value?.nombre
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  usuario.value = null
  alert(`¡Hasta luego, ${nombre}! 👋`)
  router.push('/login')
}
</script>