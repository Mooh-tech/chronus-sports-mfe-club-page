<template>
  <div class="row boxed-row">
    <div class="col-12">
      <h1>Carrinho</h1>

      <!-- Loading ou carrinho vazio -->
      <div v-if="cartStore.loadingProducts" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>

      <div v-else-if="cartStore.items.length === 0" class="text-center py-5">
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione produtos para continuar</p>
        <router-link to="/marketplace" class="chronus-btn chronus-btn-view-product">Ver produtos</router-link>
      </div>

      <!-- Itens do carrinho -->
      <template v-else>
        <h2>Itens selecionados</h2>
        <div v-for="item in cartStore.items" :key="item.product.id" class="cart-list">
          <div class="cart-image">
            <img class="img-fluid" :src="item.product.image || defaultProductImage">
          </div>
          <div class="cart-description">
            <span class="cart-description-title">{{ item.product.name }}</span>
            <span class="cart-description-type">{{ item.product.type }}</span>
            <span class="cart-description-category">{{ item.product.category }}</span>
          </div>
          <div class="cart-quantity">
            <div class="counter-container">
              <button @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                :disabled="item.quantity <= 1" class="counter-btn">
                -
              </button>
              <span class="counter-display">{{ item.quantity.toString().padStart(2, '0') }}</span>
              <button @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                :disabled="item.quantity >= 5" class="counter-btn">
                +
              </button>
            </div>
          </div>
          <div class="cart-value">
            <span class="cart-value-remove" @click="cartStore.removeFromCart(item.product.id)">
              <material-symbol>delete</material-symbol>
            </span>
            <span class="cart-value-text">Preço</span>
            <span class="cart-value-price">
              R$ {{ (item.product.price * item.quantity).toFixed(2).replace('.', ',') }}
            </span>
          </div>
        </div>

        <h2>Informações de entrega</h2>
        <div class="row">
          <div class="col-6">
            <div class="row">
              <!-- CEP -->
              <div class="col-6">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control"
                    :class="{ 'is-invalid': !cartStore.shippingAddress.cep && showValidationErrors }" id="cep"
                    placeholder="00000-000" v-model="cartStore.shippingAddress.cep" @input="handleCepInput"
                    :disabled="cartStore.loading || cartStore.loadingShipping" maxlength="9">
                  <label for="cep">CEP*</label>
                  <div v-if="cartStore.loadingShipping" class="spinner-border spinner-border-sm mt-1" role="status">
                    <span class="visually-hidden">Calculando frete...</span>
                  </div>
                  <div v-if="!cartStore.shippingAddress.cep && showValidationErrors" class="invalid-feedback">
                    CEP é obrigatório
                  </div>
                </div>
              </div>

              <!-- Campos de endereço com validação visual -->
              <commom-input v-model="cartStore.shippingAddress.logradouro" col-size="12" type="text" id="logradouro"
                label="Logradouro*" placeholder="Rua, Avenida..."
                :is-disabled="cartStore.loading || cartStore.loadingShipping"
                :class="{ 'is-invalid': !cartStore.shippingAddress.logradouro && showValidationErrors }" />

              <commom-input v-model="cartStore.shippingAddress.numero" col-size="12" type="text" id="numero"
                label="Número*" placeholder="123" :is-disabled="cartStore.loading"
                :class="{ 'is-invalid': !cartStore.shippingAddress.numero && showValidationErrors }" />

              <commom-input v-model="cartStore.shippingAddress.complemento" col-size="12" type="text" id="complemento"
                label="Complemento" placeholder="Apto 45, Bloco B..." :is-disabled="cartStore.loading" />

              <commom-input v-model="cartStore.shippingAddress.bairro" col-size="6" type="text" id="bairro"
                label="Bairro*" placeholder="Centro" :is-disabled="cartStore.loading || cartStore.loadingShipping"
                :class="{ 'is-invalid': !cartStore.shippingAddress.bairro && showValidationErrors }" />

              <commom-input v-model="cartStore.shippingAddress.cidade" col-size="6" type="text" id="cidade"
                label="Cidade*" placeholder="São Paulo" :is-disabled="cartStore.loading || cartStore.loadingShipping"
                :class="{ 'is-invalid': !cartStore.shippingAddress.cidade && showValidationErrors }" />
            </div>
          </div>

          <!-- Opções de entrega -->
          <div class="col-6">
            <div class="delivery-info">
              <h4 class="mb-3">Tipo de entrega</h4>

              <div v-if="cartStore.shippingOptions.length === 0 && !cartStore.loadingShipping" class="text-muted">
                Informe o CEP para calcular o frete
              </div>

              <div v-else>
                <div v-for="option in cartStore.shippingOptions" :key="option.id" class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" :id="option.id" :value="option.id"
                    v-model="cartStore.selectedShipping">
                  <label class="form-check-label" :for="option.id">
                    {{ option.name }} - R$ {{ option.price.toFixed(2).replace('.', ',') }}
                  </label>
                </div>

                <span v-if="cartStore.selectedShippingOption" class="delivery-info-time mt-4 d-block">
                  <h5>Previsão de entrega</h5>
                  <span class="delivery-time">{{ cartStore.selectedShippingOption.delivery_time }} dias úteis</span>
                </span>

                <span v-if="cartStore.selectedShippingOption" class="delivery-info-value mt-4 d-block">
                  <h5>Valor</h5>
                  <span class="delivery-value">R$ {{ cartStore.selectedShippingOption.price.toFixed(2).replace('.', ',')
                    }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Opções extras -->
        <div class="row mb-4 mt-4">
          <div class="col-12">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="defaultCheck1" v-model="cartStore.donationChecked">
              <label class="form-check-label" for="defaultCheck1">
                Faça uma doação
                <span v-if="cartStore.donationProduct"> - R$ {{ cartStore.donationProduct.price.toFixed(2).replace('.',
                  ',') }}</span>
                <br>
                Ajude seu clube do coração e concorra a prêmios
              </label>
            </div>
          </div>
          <!-- <div class="col-12">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="defaultCheck2"
                v-model="cartStore.membershipChecked"
              >
              <label class="form-check-label" for="defaultCheck2">
                Torne-se sócio
                <span v-if="cartStore.membershipProduct"> - R$ {{ cartStore.membershipProduct.price.toFixed(2).replace('.', ',') }}</span>
                <br>
                Mostre que é um torcedor de verdade e seja o décimo segundo jogador
              </label>
            </div>
          </div> -->
        </div>
        <!-- Resumo do pedido -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="order-summary">
              <div class="summary-line">
                <span>Subtotal:</span>
                <span>R$ {{ cartStore.subtotal.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div v-if="cartStore.donationValue > 0" class="summary-line">
                <span>Doação:</span>
                <span>R$ {{ cartStore.donationValue.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div v-if="cartStore.membershipValue > 0" class="summary-line">
                <span>Sócio torcedor:</span>
                <span>R$ {{ cartStore.membershipValue.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div v-if="cartStore.shippingCost > 0" class="summary-line">
                <span>Frete:</span>
                <span>R$ {{ cartStore.shippingCost.toFixed(2).replace('.', ',') }}</span>
              </div>
              <div class="summary-line total">
                <span>Total:</span>
                <span>R$ {{ cartStore.total.toFixed(2).replace('.', ',') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status de validação -->
        <div v-if="!cartStore.canCheckout" class="row mb-3">
          <div class="col-12">
            <div class="alert alert-warning" role="alert">
              <strong>Para finalizar a compra:</strong>
              <ul class="mb-0 mt-2">
                <li v-if="!authStore.isAuthenticated">Faça login na sua conta</li>
                <li v-if="cartStore.items.length === 0">Adicione pelo menos um produto ao carrinho</li>
                <li v-if="!cartStore.isAddressValid">Preencha todos os campos obrigatórios do endereço</li>
                <li v-if="!cartStore.selectedShippingOption">Selecione uma opção de entrega</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="row">
          <div class="col-4">
            <router-link to="/marketplace" class="chronus-btn chronus-btn-add-to-cart">
              <span>Continuar comprando</span>
            </router-link>
          </div>
          <div class="col-8">
            <button @click="handleCheckout" :disabled="!cartStore.canCheckout || cartStore.loading"
              class="chronus-btn chronus-btn-view-product" :class="{ 'disabled': !cartStore.canCheckout }">
              <span v-if="cartStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ cartStore.loading ? 'Processando...' : 'Fazer pagamento' }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { MaterialSymbol } from "@chronus-sports/styleguide"
import { useCartStore, useAuthStore } from '@/stores'
import defaultProductImage from '@/assets/camisa3.png'
import CommomInput from '@/components/commom-input.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const showValidationErrors = ref(false)

onMounted(async () => {
  await cartStore.fetchProducts()
  
  // Se usuário estiver logado, buscar endereço
  if (authStore.isAuthenticated) {
    await cartStore.fetchUserAddress()
  }
})

// Handle do input de CEP
const handleCepInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target) return

  let valor = target.value.replace(/\D/g, '')
  
  if (valor.length > 5) {
    valor = valor.substring(0, 5) + '-' + valor.substring(5, 8)
  }
  
  cartStore.shippingAddress.cep = valor
}

// Watch para buscar CEP automaticamente
watch(() => cartStore.shippingAddress.cep, (novoCep) => {
  const cepLimpo = novoCep.replace(/\D/g, '')
  if (cepLimpo.length === 8) {
    cartStore.fetchAddressByCep(cepLimpo)
  }
})

// Handle do checkout
const handleCheckout = async () => {
  // Mostrar erros de validação se houver
  showValidationErrors.value = true
  
  // Tentar fazer o checkout
  const success = await cartStore.processCheckout()
  
  // Se não deu certo, manter os erros visíveis
  if (!success) {
    // Os erros já são mostrados pelo toast da store
    return
  }
  
  // Se deu certo, limpar os erros
  showValidationErrors.value = false
}
</script>
<style scoped>
/* Seus estilos existentes + novos estilos para o resumo */
.order-summary {
  background: #131740;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 1rem;
}

.summary-line {
   display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.text-muted{
  color: #eee
}
.summary-line.total {
  font-weight: 700;
  font-size: 1.25rem;
  color: #00E4FF;
  border-top: 1px solid #363A5D;
  padding-top: 0.5rem;
  margin-top: 1rem;
}

.delivery-value {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  color: #00E4FF;
}

label.form-check-label {
  font-size: 1rem;
  color: #eee !important;
}

.counter-container {
  display: inline-flex;
  align-items: center;
  border: 2px solid #00E4FF;
  border-radius: 1.5rem;
  padding: 1rem;
  gap: .5rem;
  width: 130px;
}

.counter-btn {
  background: none;
  border: none;
  color: #00E4FF;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.counter-btn:hover:not(:disabled) {
  background-color: rgba(0, 212, 255, 0.1);
  transform: scale(1.1);
}

.counter-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.counter-display {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
  flex: 1;
}

.cart-list {
  display: flex;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  align-items: center;
}

.cart-image {
  max-width: 150px;
  background-color: #131740;
  padding: 1rem;
  margin-right: 2rem;
  border-radius: 1rem;
}

.cart-description {
  flex-grow: 1;
  margin-right: 2rem;
}

.cart-description-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  display: block;
  font-weight: 600;
}
.alert {
  border-radius: 0.5rem;
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}
.alert strong,
.alert ul li{
  color: #000;
}
.alert ul {
  padding-left: 1.2rem;
}

.chronus-btn:disabled,
.chronus-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
.cart-quantity {
  margin-right: 3rem;
}

.cart-description-type {
  font-size: 1.25rem;
  font-weight: 700;
  display: block;
  margin-top: 1.5rem;
}

.cart-description-category {
  font-size: 1.25rem;
  font-weight: 700;
  display: block;
}

.cart-value-remove {
  display: block;
  text-align: right;
}

.cart-value-text {
  display: block;
  text-align: right;
}

.cart-value-text {
  font-size: 1rem;
  margin-top: 1.5rem;
}

.cart-value-price {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  color: #00E4FF;
}

.cart-value-remove .material-symbols-outlined {
  color: #D9D9D9;
  width: 2.5rem;
  height: 2.5rem;
  display: block;
  margin-left: auto;
  background: rgba(255, 255, 255, .15);
  border-radius: 100%;
  text-align: center;
  line-height: 2.5rem;
  font-size: 1.5rem;
  opacity: .75;
  transition: opacity .3s;
  cursor: pointer;
}

.cart-value-remove .material-symbols-outlined:hover {
  opacity: 1;
}

.delivery-info {
  padding: 2rem 3rem;
  background: #131740;
  border-radius: 1rem;
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
</style>