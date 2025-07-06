import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  uuid: string
  email: string
  phone: string
  full_name: string
  social_name: string
  email_validated: boolean
  phone_validated: boolean
  active: boolean
  last_login: string
  created_at: string
  updated_at?: string
}

export interface LoginForm {
  email: string
  senha: string
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const isInitialized = ref(false)

  // Computed
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const isAuthenticated = computed(() => isLoggedIn.value && user.value?.active)

  // Inicializar store (carregar dados do localStorage)
  const initialize = async () => {
    if (isInitialized.value) return

    const savedToken = localStorage.getItem('chronus_token')
    const savedUser = localStorage.getItem('chronus_user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      // Verificar se o token ainda é válido
      await checkAuthStatus()
    }

    isInitialized.value = true
  }

  // Função de login
  const login = async (credentials: LoginForm) => {
    loading.value = true
    
    try {
      const response = await fetch('https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const result = await response.json()

      if (response.ok) {
        // Salvar token e dados do usuário
        token.value = result.token
        user.value = result.user
        
        // Persistir no localStorage
        localStorage.setItem('chronus_token', result.token)
        localStorage.setItem('chronus_user', JSON.stringify(result.user))

        return { success: true, message: result.message }
      } else {
        return { success: false, message: result.message || 'Erro ao fazer login' }
      }
    } catch (error) {
      return { success: false, message: 'Erro de conexão. Tente novamente.' }
    } finally {
      loading.value = false
    }
  }

  // Função de logout
  const logout = async () => {
    loading.value = true
    
    try {
      // Chamar endpoint de logout se houver token
      if (token.value) {
        await fetch('https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/user/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Limpar dados locais independentemente do resultado da API
      clearAuthData()
      loading.value = false
    }
  }

  // Verificar status de autenticação
  const checkAuthStatus = async () => {
    if (!token.value) return false

    try {
      const response = await fetch('https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/user/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (response.ok) {
        // Atualizar dados do usuário
        user.value = result.user
        localStorage.setItem('chronus_user', JSON.stringify(result.user))
        return true
      } else {
        // Token inválido ou usuário inativo
        clearAuthData()
        return false
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      return false
    }
  }

  // Limpar dados de autenticação
  const clearAuthData = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('chronus_token')
    localStorage.removeItem('chronus_user')
  }

  // Atualizar dados do usuário
  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('chronus_user', JSON.stringify(user.value))
    }
  }

  // Validar formulário de login
  const validateLoginForm = (form: LoginForm) => {
    const errors: string[] = []
    
    if (!form.email.trim()) {
      errors.push('Email é obrigatório')
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.push('Email deve ter um formato válido')
    }
    
    if (!form.senha.trim()) {
      errors.push('Senha é obrigatória')
    } else if (form.senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres')
    }
    
    return errors
  }

  return {
    // Estado
    user,
    token,
    loading,
    isInitialized,
    
    // Computed
    isLoggedIn,
    isAuthenticated,
    
    // Ações
    initialize,
    login,
    logout,
    checkAuthStatus,
    clearAuthData,
    updateUser,
    validateLoginForm
  }
})