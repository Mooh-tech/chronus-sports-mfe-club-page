<template>
  <div class="row boxed-row">
    <div class="col-6 register-area m-auto">
      <h2 class="text-center mb-4">Login</h2>
      <p class="mb-4">
        Informe seus dados de acesso
      </p>
      <hr>

      <div class="row">
        <!-- Email -->
        <commom-input v-model="loginForm.email" col-size="12" type="email" id="email" label="E-mail*"
          placeholder="seu@email.com" :is-disabled="authStore.loading" />

        <!-- Senha -->
        <commom-input v-model="loginForm.senha" col-size="12" type="password" id="senha" label="Senha*"
          placeholder="Digite sua senha" :is-disabled="authStore.loading" />
      </div>

      <!-- Botão de login -->
      <button @click="handleLogin" :disabled="!isFormValid || authStore.loading"
        class="chronus-btn chronus-btn-view-product">
        <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <!-- Link para registro -->
      <div class="text-center mt-3">
        <router-link to="/registro" class="text-decoration-none">
          Não tem conta? Cadastre-se aqui
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification";
import { useAuthStore } from '@/stores/'
import CommomInput from '@/components/commom-input.vue'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// Dados do formulário
const loginForm = ref({
  email: '',
  senha: ''
})

// Validação do formulário
const isFormValid = computed(() => {
  return loginForm.value.email.trim() !== '' &&
    loginForm.value.senha.trim() !== ''
})

// Função para fazer login
const handleLogin = async () => {
  // Validar formulário
  const errors = authStore.validateLoginForm(loginForm.value)

  if (errors.length > 0) {
    errors.forEach(error => toast.error(error))
    return
  }

  // Fazer login
  const result = await authStore.login(loginForm.value)

  if (result.success) {
    toast.success(result.message)

    // Redirecionar para a página principal após login
    setTimeout(() => {
      router.push('/marketplace')
    }, 1000)
  } else {
    toast.error(result.message)
  }
}

// Verificar se usuário já está logado
if (authStore.isAuthenticated) {
  router.push('/marketplace')
}
</script>

<style scoped>
.chronus-btn {
  font-family: 'Inter';
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  display: block;
  text-transform: uppercase;
  padding: 1.25rem 1rem;
  border-radius: 1.25rem;
  opacity: .75;
  color: #FFFFFF;
  transition: opacity .3s;
  border: none;
  cursor: pointer;
  width: 100%;
}

.chronus-btn:hover:not(:disabled) {
  opacity: 1;
}

.chronus-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chronus-btn-view-product {
  background: linear-gradient(322.68deg, #803EB4 36.47%, #4F25CC 92.31%);
}
</style>