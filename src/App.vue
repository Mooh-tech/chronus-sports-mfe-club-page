<template>
  <page-navbar :is-authenticated="authStore.isAuthenticated" :user="authStore.user"
    @logout="handleLogout"></page-navbar>
  <div class="container-fluid chronus-sports-page">
    <router-view />
  </div>
  <page-footer></page-footer>
</template>

<script setup lang='ts'>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore, useCartStore } from '@/stores'
import { PageFooter, PageNavbar } from '@chronus-sports/styleguide'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const cartStore = useCartStore() // ✅ Adicionar a store do carrinho

onMounted(async () => {
  // Inicializar stores quando o app carregar
  await authStore.initialize()
  await cartStore.initialize() // ✅ Inicializar carrinho
})

// Função para handle do logout
const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Logout realizado com sucesso!')

    // Redirecionar para a página inicial
    router.push('/')
  } catch (error) {
    toast.error('Erro ao fazer logout')
    console.error('Erro no logout:', error)
  }
}
</script>