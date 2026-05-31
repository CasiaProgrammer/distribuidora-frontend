<template>
  <div style="min-height: 100vh; display: flex; align-items: stretch; background: var(--color-background-tertiary);">

    <!-- Panel izquierdo -->
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 3rem; background: var(--color-background-primary); border-right: 0.5px solid var(--color-border-tertiary);">
      <div style="width: 100%; max-width: 360px;">

        <div style="margin-bottom: 2.5rem;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 2rem;">
            <div style="width: 36px; height: 36px; background: #1a365d; border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center;">
              <i class="ti ti-building-store" style="color: white; font-size: 18px;" aria-hidden="true"></i>
            </div>
            <span style="font-size: 16px; font-weight: 500; color: var(--color-text-primary);">Distribuidora</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 500; color: var(--color-text-primary); margin: 0 0 8px;">Bienvenido de nuevo</h1>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0;">Ingresa tus credenciales para continuar</p>
        </div>

        <div v-if="error" style="background: var(--color-background-danger); border: 0.5px solid var(--color-border-danger); border-radius: var(--border-radius-md); padding: 10px 14px; margin-bottom: 1.5rem; font-size: 13px; color: var(--color-text-danger); display: flex; align-items: center; gap: 8px;">
          <i class="ti ti-alert-circle" style="font-size: 16px;" aria-hidden="true"></i>
          {{ error }}
        </div>

        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 6px;">Correo electrónico</label>
          <input v-model="form.email" type="email" placeholder="correo@empresa.com" style="width: 100%; box-sizing: border-box;" @keyup.enter="login" />
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 6px;">Contraseña</label>
          <div style="position: relative;">
            <input v-model="form.password" :type="mostrarPassword ? 'text' : 'password'" placeholder="••••••••" style="width: 100%; box-sizing: border-box; padding-right: 40px;" @keyup.enter="login" />
            <button @click="mostrarPassword = !mostrarPassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0; color: var(--color-text-secondary);">
              <i :class="mostrarPassword ? 'ti ti-eye-off' : 'ti ti-eye'" style="font-size: 16px;" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <button @click="login" :disabled="cargando" style="width: 100%; background: #1a365d; color: white; border: none; border-radius: var(--border-radius-md); padding: 10px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i v-if="cargando" class="ti ti-loader-2" style="font-size: 16px; animation: spin 1s linear infinite;" aria-hidden="true"></i>
          <i v-else class="ti ti-login" style="font-size: 16px;" aria-hidden="true"></i>
          {{ cargando ? 'Ingresando...' : 'Ingresar al sistema' }}
        </button>

      </div>
    </div>

    <!-- Panel derecho -->
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 3rem; background: #1a365d;">
      <div style="text-align: center; max-width: 400px;">
        <i class="ti ti-truck-delivery" style="font-size: 64px; color: rgba(255,255,255,0.3); margin-bottom: 2rem; display: block;" aria-hidden="true"></i>
        <h2 style="font-size: 22px; font-weight: 500; color: white; margin: 0 0 1rem;">Sistema de Gestión</h2>
        <p style="font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; margin: 0 0 2rem;">Administra pedidos, inventario, distribución, comisiones y más desde un solo lugar.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: rgba(255,255,255,0.08); border-radius: var(--border-radius-md); padding: 14px; text-align: left;">
            <i class="ti ti-package" style="font-size: 20px; color: rgba(255,255,255,0.6); margin-bottom: 8px; display: block;" aria-hidden="true"></i>
            <p style="font-size: 13px; font-weight: 500; color: white; margin: 0 0 4px;">Inventario</p>
            <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0;">Control de productos y stock</p>
          </div>
          <div style="background: rgba(255,255,255,0.08); border-radius: var(--border-radius-md); padding: 14px; text-align: left;">
            <i class="ti ti-clipboard-list" style="font-size: 20px; color: rgba(255,255,255,0.6); margin-bottom: 8px; display: block;" aria-hidden="true"></i>
            <p style="font-size: 13px; font-weight: 500; color: white; margin: 0 0 4px;">Pedidos</p>
            <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0;">Gestión de ventas</p>
          </div>
          <div style="background: rgba(255,255,255,0.08); border-radius: var(--border-radius-md); padding: 14px; text-align: left;">
            <i class="ti ti-chart-bar" style="font-size: 20px; color: rgba(255,255,255,0.6); margin-bottom: 8px; display: block;" aria-hidden="true"></i>
            <p style="font-size: 13px; font-weight: 500; color: white; margin: 0 0 4px;">Reportes</p>
            <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0;">Análisis y estadísticas</p>
          </div>
          <div style="background: rgba(255,255,255,0.08); border-radius: var(--border-radius-md); padding: 14px; text-align: left;">
            <i class="ti ti-users" style="font-size: 20px; color: rgba(255,255,255,0.6); margin-bottom: 8px; display: block;" aria-hidden="true"></i>
            <p style="font-size: 13px; font-weight: 500; color: white; margin: 0 0 4px;">Usuarios</p>
            <p style="font-size: 12px; color: rgba(255,255,255,0.5); margin: 0;">Roles y permisos</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const API = import.meta.env.VITE_API_URL
const router = useRouter()
const form = ref({ email: '', password: '' })
const error = ref('')
const cargando = ref(false)
const mostrarPassword = ref(false)

const login = async () => {
  if (!form.value.email || !form.value.password) {
    error.value = 'Por favor ingresa email y contraseña'
    return
  }
  cargando.value = true
  error.value = ''
  try {
    const res = await axios.post(`${API}/auth`, form.value)
    if (res.data.error) {
      error.value = res.data.error
      return
    }
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    router.push('/')
  } catch (e) {
    error.value = 'Error al conectar con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>