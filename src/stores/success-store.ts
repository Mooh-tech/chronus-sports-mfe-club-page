import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

export interface PaymentSession {
  id: string
  status: string
  payment_status: string
  amount_total: number
  currency: string
  customer_email: string
  customer_details: {
    email: string
    name: string
    phone?: string
  }
  payment_intent?: {
    id: string
    status: string
  }
  subscription?: {
    id: string
    status: string
  }
  metadata: Record<string, any>
  created: number
  url: string
}

export interface OrderDetails {
  id: string
  session_id: string
  checkout_intent_id: string
  status: string
  total_amount: number
  currency: string
  items: Array<{
    name: string
    quantity: number
    price: number
    type: string
  }>
  shipping_address: {
    name: string
    line1: string
    line2?: string
    city: string
    postal_code: string
    state: string
    country: string
  }
  customer: {
    email: string
    name: string
    phone?: string
  }
  created_at: string
  estimated_delivery?: string
}

export const useSuccessStore = defineStore('success', () => {
  const toast = useToast()
  
  // Estado
  const loading = ref(false)
  const verifying = ref(false)
  const session = ref<PaymentSession | null>(null)
  const orderDetails = ref<OrderDetails | null>(null)
  const isValidSession = ref(false)
  const errorMessage = ref('')

  // Computed
  const isPaymentSuccessful = computed(() => {
    return session.value?.payment_status === 'paid' || 
           session.value?.status === 'complete'
  })

  const isSubscriptionActive = computed(() => {
    return session.value?.subscription?.status === 'active'
  })

  const formattedAmount = computed(() => {
    if (!session.value) return 'R$ 0,00'
    const amount = session.value.amount_total / 100
    return `R$ ${amount.toFixed(2).replace('.', ',')}`
  })

  const paymentMethod = computed(() => {
    return session.value?.payment_intent ? 'Cartão de Crédito' : 'Boleto'
  })

  const orderNumber = computed(() => {
    return orderDetails.value?.id || session.value?.id || 'N/A'
  })

  // Verificar sessão no Stripe
  const verifySession = async (sessionId: string) => {
    if (!sessionId) {
      errorMessage.value = 'ID da sessão não informado'
      return false
    }

    verifying.value = true
    try {
      const response = await fetch(
        `https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/stripe/session/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao verificar sessão de pagamento')
      }

      const data = await response.json()
      
      if (data.success && data.session) {
        session.value = data.session
        orderDetails.value = data.order_details || null
        isValidSession.value = true
        
        // Limpar carrinho pendente se pagamento foi bem-sucedido
        if (isPaymentSuccessful.value) {
          localStorage.removeItem('chronus_pending_order')
          localStorage.removeItem('chronus_cart')
        }
        
        return true
      } else {
        throw new Error(data.message || 'Sessão inválida')
      }
    } catch (error: any) {
      console.error('Erro ao verificar sessão:', error)
      errorMessage.value = error.message || 'Erro ao verificar pagamento'
      isValidSession.value = false
      return false
    } finally {
      verifying.value = false
    }
  }

  // Obter detalhes do pedido
  const fetchOrderDetails = async (sessionId: string) => {
    if (!sessionId) return

    loading.value = true
    try {
      const response = await fetch(
        `https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/order/by-session/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.order) {
          orderDetails.value = data.order
        }
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error)
    } finally {
      loading.value = false
    }
  }

  // Enviar email de confirmação
  const sendConfirmationEmail = async () => {
    if (!session.value?.id) return

    try {
      await fetch(
        `https://2c3i1rmf99.execute-api.us-east-1.amazonaws.com/develop/order/send-confirmation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: session.value.id,
            email: session.value.customer_email,
          }),
        }
      )
      
      toast.success('Email de confirmação enviado!')
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      toast.error('Erro ao enviar email de confirmação')
    }
  }

  // Limpar dados
  const clearData = () => {
    session.value = null
    orderDetails.value = null
    isValidSession.value = false
    errorMessage.value = ''
  }

  return {
    // Estado
    loading,
    verifying,
    session,
    orderDetails,
    isValidSession,
    errorMessage,

    // Computed
    isPaymentSuccessful,
    isSubscriptionActive,
    formattedAmount,
    paymentMethod,
    orderNumber,

    // Ações
    verifySession,
    fetchOrderDetails,
    sendConfirmationEmail,
    clearData,
  }
})