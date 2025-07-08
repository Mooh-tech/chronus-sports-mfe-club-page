<template>
  <div class="row boxed-row">
    <div class="col-12">
      <h1>Marketplace</h1>
    </div>
    <div class="products-list col-12">
      <div class="row">
        <div v-if="cartStore.loadingProducts" class="col-12 text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Carregando produtos...</span>
          </div>
        </div>
        <div v-else-if="cartStore.mainProduct" class="col-12 col-md-4">
          <div class="product">
            <div class="product-img">
              <img class="img-fluid" :src="cartStore.mainProduct.image || defaultProductImage">
            </div>
            <span class="product-name">{{ cartStore.mainProduct.name }}</span>
            <span class="product-type">{{ cartStore.mainProduct.type }}</span>
            <div class="row">
              <div class="col-6">
                <span class="product-category">{{ cartStore.mainProduct.category }}</span>
                <span class="product-quantity">{{ cartStore.mainProduct.available_quantity }}/{{
                  cartStore.mainProduct.total_quantity }}</span>
              </div>
              <div class="col-6">
                <span class="product-discount">
                </span>
                <span class="product-price">R$ {{ formatPrice(cartStore.mainProduct.price) }}</span>
              </div>
            </div>
            <div class="col-auto mt-2 mb-2">
              <div class="product-size-selector text-right ms-auto">
                <span class="size-selector-label me-3">Tamanho</span>
                <div class="size-buttons-container">
                  <button v-for="size in availableSizes" :key="size" @click="selectedSize = size"
                    :class="['size-btn', { 'size-btn-selected': selectedSize === size }]">
                    {{ size }}
                  </button>
                </div>
              </div>
            </div>
            <div class="row product-button-group">
              <div class="col-12 col-md-6 mb-4 mb-md-0">
                <router-link to="/produto/camisa-oficial-salgueiro" class="chronus-btn chronus-btn-view-product">Ver
                  produto</router-link>
              </div>
              <div class="col-12 col-md-6">
                <button @click="addToCart" class="chronus-btn chronus-btn-add-to-cart">
                  <material-symbol>add_shopping_cart</material-symbol>
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="product">
            <div class="product-img"><img class="img-fluid" src="@/assets/camisa_esgotada.png"></div><span
              data-v-5f21920b="" class="product-name">Lote 1: Camisa Oficial Salgueiro A.C. 2025</span><span
              data-v-5f21920b="" class="product-type">Camisa Oficial</span>
            <div class="row">
              <div class="col-6"><span class="product-category">Futebol</span><span
                  class="product-quantity">0/100</span>
              </div>
              <div class="col-6"><span class="product-discount"></span><span class="product-price">R$ 99,90</span></div>
            </div>
            <div class="row product-button-group">
              <div class="col-12 col-md-6 mb-4 mb-md-0 m-auto"><a data-v-5f21920b="" href="#"
                  class="chronus-btn chronus-btn-view-product">Esgotado</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { MaterialSymbol } from "@chronus-sports/styleguide"
import { useCartStore } from '@/stores'
import defaultProductImage from '@/assets/camisa3.png'
const cartStore = useCartStore()

onMounted(async () => {
  await cartStore.fetchProducts()
})

const addToCart = () => {
  if (cartStore.mainProduct) {
    cartStore.addToCart(cartStore.mainProduct, 1, selectedSize.value)
  }
}
const selectedSize = ref('')
const availableSizes = ['PP', 'P', 'M', 'G', 'XG', 'XXG']

const formatPrice = (price: any): string => {
  // Converter para número se for string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price

  // Verificar se é um número válido
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return '0,00'
  }

  return numPrice.toFixed(2).replace('.', ',')
}
</script>

<!-- Seus estilos existentes permanecem iguais -->
<style scoped>
.products-list {}

.product-img {
  margin-bottom: 1.5rem;
}

.product-button-group {
  margin-top: 1.5rem;
}

.product {
  background-color: #211546;
  padding: 1.5rem 2rem;
  border-radius: .75rem;
}

.product-name {
  font-weight: 700;
  display: block;
  margin-bottom: .5rem;
}

.product-type {
  font-size: .75rem;
  font-weight: bold;
  color: #DD851D;
  display: block;
}

.product-category {
  font-size: 0.875rem;
  color: #CBC8D3;
  display: block;
  margin-bottom: .675rem;
}

.product-quantity {
  font-size: 0.875rem;
  color: #A3A3A3;
  display: block;
}

.product-discount {
  min-height: 20px;
  display: block;
  margin-bottom: .675rem;
}

.product-price {
  font-weight: bold;
  color: #4ADF3A;
  text-align: right;
  display: block;
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

.size-selector-label {
  font-size: .875rem;
  color: #FFF;
  font-weight: 700;
}

.size-buttons-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.size-btn {
  min-width: 45px;
  height: 45px;
  border: 2px solid #666;
  background: transparent;
  color: #FFF;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-btn:hover {
  border-color: #00E4FF;
  background: rgba(0, 228, 255, 0.1);
}

.size-btn-selected {
  border-color: #00E4FF;
  background: #00E4FF;
  color: #000;
}

.product-size-selector {
  display: flex;
  align-items: center;
  width: fit-content;
}

@media (max-width: 768px) {
  .size-buttons-container {
    justify-content: center;
  }

  .product-quantity-selector,
  .product-size-selector {
    margin-bottom: 1rem;
  }
}
</style>
