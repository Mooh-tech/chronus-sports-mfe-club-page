<template>
  <div class="row boxed-row">
    <div class="col-12">
      <!-- Loading de verificação -->
      <div v-if="successStore.verifying" class="text-center py-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Verificando pagamento...</span>
        </div>
        <p class="mt-3">Verificando seu pagamento...</p>
      </div>

      <!-- Erro -->
      <div v-else-if="!successStore.isValidSession" class="text-center py-5">
        <div class="">
          <h3>Erro na Verificação</h3>
          <p>{{ successStore.errorMessage }}</p>
          <div class="row">
            <div class="col-3"></div>
            <div class="col-3">
              <router-link to="/marketplace" class="chronus-btn chronus-btn-view-product">
                Ver produtos
              </router-link>
            </div>
            <div class="col-3">
              <router-link to="/" class="chronus-btn chronus-btn-add-to-cart">
                <span>Ir para Home</span>
              </router-link>
            </div>
            <div class="col-3"></div>
          </div>
        </div>
      </div>

      <!-- Sucesso -->
      <div v-else-if="successStore.isPaymentSuccessful" class="text-center py-5">
        <div class="success-header mb-4">
          <div class="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#10B981" />
              <path d="M25 40L35 50L55 30" stroke="white" stroke-width="3" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <h1 class="text-success mt-3">Pagamento Aprovado!</h1>
          <p class="lead">Seu pedido foi processado com sucesso</p>
        </div>

        <div class="row">
          <div class="col-md-8 mx-auto">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title">Detalhes do Pedido</h5>

                <div class="row mb-3">
                  <div class="col-sm-6">
                    <strong>Número do Pedido:</strong><br>
                    <span class="text-muted">{{ successStore.orderNumber }}</span>
                  </div>
                  <div class="col-sm-6">
                    <strong>Valor Total:</strong><br>
                    <span class="text-success h5">{{ successStore.formattedAmount }}</span>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-sm-6">
                    <strong>Método de Pagamento:</strong><br>
                    <span class="text-muted">{{ successStore.paymentMethod }}</span>
                  </div>
                  <div class="col-sm-6">
                    <strong>Status:</strong><br>
                    <span class="badge bg-success">Aprovado</span>
                  </div>
                </div>

                <div class="row mb-3" v-if="successStore.session?.customer_details">
                  <div class="col-sm-6">
                    <strong>Email:</strong><br>
                    <span class="text-muted">{{ successStore.session.customer_details.email }}</span>
                  </div>
                  <div class="col-sm-6">
                    <strong>Nome:</strong><br>
                    <span class="text-muted">{{ successStore.session.customer_details.name }}</span>
                  </div>
                </div>

                <!-- Detalhes do pedido -->
                <div v-if="successStore.orderDetails" class="mt-4">
                  <h6>Itens do Pedido</h6>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qtd</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in successStore.orderDetails.items" :key="item.name">
                          <td>{{ item.name }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>R$ {{ (item.price / 100).toFixed(2).replace('.', ',') }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Endereço de entrega -->
                <div v-if="successStore.orderDetails?.shipping_address" class="mt-4">
                  <h6>Endereço de Entrega</h6>
                  <p class="text-muted small mb-0">
                    {{ successStore.orderDetails.shipping_address.name }}<br>
                    {{ successStore.orderDetails.shipping_address.line1 }}<br>
                    <span v-if="successStore.orderDetails.shipping_address.line2">
                      {{ successStore.orderDetails.shipping_address.line2 }}<br>
                    </span>
                    {{ successStore.orderDetails.shipping_address.city }} -
                    {{ successStore.orderDetails.shipping_address.state }}<br>
                    CEP: {{ successStore.orderDetails.shipping_address.postal_code }}
                  </p>
                </div>

                <!-- Assinatura -->
                <div v-if="successStore.isSubscriptionActive" class="alert alert-info mt-4">
                  <h6>Assinatura Ativada!</h6>
                  <p class="mb-0">
                    Sua assinatura de Sócio Torcedor foi ativada com sucesso.
                    A cobrança será realizada mensalmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-3"></div>
          <div class="col-3">
            <button @click="successStore.sendConfirmationEmail" class="chronus-btn chronus-btn-view-product"
              :disabled="successStore.loading">
              <span v-if="successStore.loading" class="spinner-border spinner-border-sm me-2"></span>
              Reenviar Confirmação
            </button>
          </div>
          <div class="col-3">
            <router-link to="/" class="chronus-btn chronus-btn-add-to-cart">
              <span>Ir para Home</span>
            </router-link>
          </div>
          <div class="col-3"></div>
        </div>
      </div>

      <!-- Pagamento pendente -->
      <div v-else class="text-center py-5">
        <div class="alert alert-warning">
          <h3>Pagamento Pendente</h3>
          <p>Seu pagamento está sendo processado. Aguarde a confirmação.</p>
          <p class="small">
            Pedido: {{ successStore.orderNumber }}<br>
            Valor: {{ successStore.formattedAmount }}
          </p>
          <div class="row">
            <div class="col-3"></div>
            <div class="col-3">
              <button @click="verifyPayment" class="chronus-btn chronus-btn-view-product"
                :disabled="successStore.verifying">
                <span v-if="successStore.verifying" class="spinner-border spinner-border-sm me-2"></span>
                Verificar Novamente
              </button>
            </div>
            <div class="col-3">
              <router-link to="/" class="chronus-btn chronus-btn-add-to-cart">
                <span>Ir para Home</span>
              </router-link>
            </div>
            <div class="col-3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSuccessStore } from '@/stores/'

const route = useRoute()
const successStore = useSuccessStore()

let verificationInterval: NodeJS.Timeout | null = null

const verifyPayment = async () => {
  const sessionId = route.query.session_id as string
  if (sessionId) {
    await successStore.verifySession(sessionId)
    await successStore.fetchOrderDetails(sessionId)
  }
}

onMounted(async () => {
  await verifyPayment()

  // Se pagamento ainda está pendente, verificar a cada 5 segundos
  if (!successStore.isPaymentSuccessful && successStore.isValidSession) {
    verificationInterval = setInterval(verifyPayment, 5000)
  }
})

onUnmounted(() => {
  if (verificationInterval) {
    clearInterval(verificationInterval)
  }
  successStore.clearData()
})
</script>

<style scoped>
.success-icon {
  display: inline-block;
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }

  50% {
    transform: scale(1.05);
  }

  70% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.card {
  border: 1px solid #e3e6f0;
}

.table th {
  background-color: #f8f9fc;
  font-weight: 600;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

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
}

.chronus-btn:hover {
  opacity: 1;
}

.chronus-btn-view-product {
  background: linear-gradient(322.68deg, #803EB4 36.47%, #4F25CC 92.31%);

}

.chronus-btn-add-to-cart {
  position: relative;
  background: linear-gradient(322.68deg, #803EB4 36.47%, #4F25CC 92.31%);
  overflow: hidden;
  width: 100%;
}

.chronus-btn-add-to-cart::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  background: #211546;
  /* cor do fundo interno ou do botão */
  border-radius: calc(1.25rem - 1px);
  /* mesmo raio - 1px */
  z-index: 1;
}

.chronus-btn-add-to-cart>span {
  color: #fff;
  position: relative;
  z-index: 1;
  font-weight: 700;
  font-size: 1rem;
}

.chronus-btn-add-to-cart>span.material-symbols-outlined {
  margin-right: .5rem;
  font-size: 1.25rem;
  vertical-align: text-bottom;
}
</style>