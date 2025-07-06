<template>
  <div class="row boxed-row">
    <div v-if="cartStore.loadingProducts" class="col-12 text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando produto...</span>
      </div>
    </div>
    <template v-else-if="cartStore.mainProduct">
      <div class="col-4">
        <div class="product-img">
          <img class="img-fluid" :src="cartStore.mainProduct.image  || defaultProductImage">
        </div>
      </div>
      <div class="col-1"></div>
      <div class="col-7">
        <span class="product-seller">
          <span class="product-seller-name">CHRONUS Sports</span>
          <material-symbol>check</material-symbol>
        </span>
        <div class="row">
          <div class="col-8">
            <span class="product-name">{{ cartStore.mainProduct.name }}</span>
            <span class="product-quantity">{{ cartStore.mainProduct.stock }}/{{ cartStore.mainProduct.stock }}</span>
          </div>
          <div class="col-4">
            <span class="product-price">{{ formatCurrency(cartStore.mainProduct?.price) }}</span>
          </div>
        </div>
        <div class="product-description" v-html="sanitizeDescription(cartStore.mainProduct.description)"></div>
        <div class="row">
          <div class="col-4">
            <div class="product-quantity-selector">
              <span class="product-quantity-selector-text">Quantidade</span>
              <div class="counter-container">
                <button @click="decrement" :disabled="count <= 1" class="counter-btn">
                  -
                </button>
                <span class="counter-display">
                  {{ formattedCount }}
                </span>
                <button @click="increment" :disabled="count >= 5" class="counter-btn">
                  +
                </button>
              </div>
            </div>
            <button @click="buyNow" class="chronus-btn chronus-btn-view-product">Comprar</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MaterialSymbol } from "@chronus-sports/styleguide"
import { useCartStore } from '@/stores'
import { formatCurrency } from '@/utils/formatter'

import defaultProductImage from '@/assets/camisa3.png'
const router = useRouter()
const cartStore = useCartStore()

const count = ref(1)

const formattedCount = computed(() => {
  return count.value.toString().padStart(2, '0')
})

const increment = () => {
  if (count.value < 5) {
    count.value++
  }
}

const decrement = () => {
  if (count.value > 1) {
    count.value--
  }
}
const sanitizeDescription = (description?: string): string => {
  if (!description) {
    return 'Neque aut veniam consectetur magnam libero, natus eius numquam reprehenderit hic at, excepturi repudiandae magni optio odio doloribus? Facilisi lobortisal morbi fringilla urna amet sed ipsum.'
  }

  // Lista de tags HTML permitidas (whitelist)
  const allowedTags = ['strong', 'b', 'em', 'i', 'u', 'br', 'p', 'span']
  
  // Regex para remover tags não permitidas
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g
  
  // Sanitizar o HTML removendo tags não permitidas
  const sanitized = description.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      // Permitir apenas a tag, sem atributos para maior segurança
      if (match.startsWith('</')) {
        return `</${tagName.toLowerCase()}>`
      } else {
        return `<${tagName.toLowerCase()}>`
      }
    }
    return '' // Remover tags não permitidas
  })

  return sanitized
}
const buyNow = async () => {
  if (cartStore.mainProduct) {
    const success = cartStore.addToCart(cartStore.mainProduct, count.value)
    if (success) {
      router.push('/carrinho')
    }
  }
}

onMounted(async () => {
  await cartStore.fetchProducts()
})
</script>
<style scoped>
.product-seller {
  display: block;
  margin-bottom: .75rem;
}

.product-seller span.product-seller-name {
  color: #428AF8;
  font-size: .875rem;
  font-weight: 700;
}

.product-seller span.material-symbols-outlined {
  border: 2px solid #363A5D;
  background: #10B981;
  color: #FFF;
  margin-left: .75rem;
  border-radius: 100%;
  font-size: 1rem;
}

.product-name {
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  color: #EEE;
  display: block;
}

.product-quantity {

  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: .75rem;
  line-height: 1.5;
  color: #A1A2B3;
  display: block;
  margin-top: -.5rem;

}

.product-price {
  font-weight: 900;
  font-size: 2rem;
  font-family: 'Outfit', sans-serif;
  color: #4ADF3A;
  text-align: right;
  display: block;
}

.product-description {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #A1A2B3;
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: block;
}

.product-quantity-selector span.product-quantity-selector-text {
  font-size: .875rem;
  color: #FFF;
  font-weight: 700;
  margin-right: 1rem;
}
.product-quantity-selector{
  margin-bottom: 2rem;
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

.chronus-btn:hover{
  opacity: 1;
}

.chronus-btn-view-product {
  background: linear-gradient(322.68deg, #803EB4 36.47%, #4F25CC 92.31%);
  border: none;
  width: 100%;

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
</style>