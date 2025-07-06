import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
  import { useToast } from "vue-toastification";

export interface RegisterForm {
  nomeCompleto: string
  genero: string
  cpf: string
  rg: string
  dataNascimento: string
  telefone: string
  email: string
  senha: string
  confirmarSenha: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
}

export const useRegisterStore = defineStore('register', () => {
  const toast = useToast()
  // Estado
  const loading = ref(false)
  const loadingCep = ref(false)
  const message = ref('')
  const messageType = ref<'success' | 'error' | ''>('')
  
  // Dados do formulário
  const form = ref<RegisterForm>({
    nomeCompleto: '',
    genero: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: ''
  })

  // Validação dos campos obrigatórios
  const isFormValid = computed(() => {
    const requiredFields = [
      'nomeCompleto', 'cpf', 'rg', 'dataNascimento', 'telefone', 
      'email', 'senha', 'confirmarSenha', 'cep', 'logradouro', 
      'numero', 'bairro', 'cidade'
    ]
    
    const allFieldsFilled = requiredFields.every(field => 
      form.value[field as keyof RegisterForm].trim() !== ''
    )
    
    const passwordsMatch = form.value.senha === form.value.confirmarSenha
    
    return allFieldsFilled && passwordsMatch
  })

  // Função para buscar CEP
  const buscarCep = async (cep: string) => {
    if (!cep || cep.length !== 8) return
    
    loadingCep.value = true
    toast.info('Buscando CEP...', {
      timeout: 2000
    })
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        form.value.logradouro = data.logradouro || ''
        form.value.bairro = data.bairro || ''
        form.value.cidade = data.localidade || ''
        toast.success('CEP encontrado!', {
          timeout: 2000
        })
      } else {
        toast.error('CEP não encontrado')
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP')
    } finally {
      loadingCep.value = false
    }
  }

  // Função para enviar formulário
  const enviarFormulario = async () => {
    if (!isFormValid.value) {
      toast.warning('Preencha todos os campos obrigatórios')
      return
    }

    loading.value = true
    try {
      // Simular requisição POST - substitua pela URL real da sua API
      const response = await fetch('https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso!', {
          timeout: 3000
        })
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          // Substitua pela navegação do seu router
          window.location.href = '/login'
        }, 2000)
      } else {
        toast.error(result.message || 'Erro ao realizar cadastro')
      }
    } catch (error) {
       toast.error('Erro de conexão. Tente novamente.')
    } finally {
      loading.value = false
    }
  }

  
  // Função para limpar formulário
  const limparFormulario = () => {
    Object.keys(form.value).forEach(key => {
      form.value[key as keyof RegisterForm] = ''
    })
     toast.info('Formulário limpo')
  }

  return {
    // Estado
    loading,
    loadingCep,
    message,
    messageType,
    form,
    
    // Computed
    isFormValid,
    
    // Ações
    buscarCep,
    enviarFormulario,
    limparFormulario
  }
})