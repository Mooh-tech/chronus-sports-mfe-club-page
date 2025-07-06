<template>
  <div class="club-carousel">
    <!-- Seta esquerda -->
    <button @click="previous" class="carousel-arrow carousel-arrow--left">
      <material-symbol class="first-arrow">arrow_back_ios</material-symbol>
      <material-symbol class="second-arrow">arrow_back_ios</material-symbol>
    </button>

    <!-- Container do carousel -->
    <div class="carousel-container">
      <div v-for="(item, displayIndex) in visibleItems" :key="`${item.originalIndex}-${displayIndex}`"
        class="club-carousel-item" :class="{ 'active': displayIndex === 3 }" @click="handleClick(item.link)">
        <div class="club-carousel-item-image">
          <img :src="getImagePath(item.image)" :alt="item.name" />
        </div>

        <!-- Nome e texto aparecem apenas no item ativo (centro) -->
        <div v-if="displayIndex === 3" class="club-carousel-item-text">
          <div class="club-carousel-item-description" v-html="item.text"></div>
        </div>
      </div>
    </div>

    <!-- Seta direita -->
    <button @click="next" class="carousel-arrow carousel-arrow--right">
      <material-symbol class="first-arrow">arrow_forward_ios</material-symbol>
      <material-symbol class="second-arrow">arrow_forward_ios</material-symbol>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MaterialSymbol } from "@chronus-sports/styleguide";
interface CarouselItem {
  name: string;
  image: string;
  text: string; // Novo campo para texto com HTML
  link: string;
}
const handleClick = (link: any) => {
  if (link !== "#") {
    window.location.href = link;
  }

}
const props = defineProps<{
  items: CarouselItem[];
}>();

// Índice do item ativo (sempre no centro)
const activeIndex = ref(0);

// Função para carregar imagens
const getImagePath = (imageName: string) => {
  try {
    return require(`@/assets/${imageName}`);
  } catch (error) {
    console.error(`Imagem não encontrada: ${imageName}`);
    return '';
  }
};

// Calcula os 7 itens visíveis com o ativo no centro
const visibleItems = computed(() => {
  const result = [];

  // Começar 3 posições antes do item ativo
  for (let i = -3; i <= 3; i++) {
    const index = (activeIndex.value + i + props.items.length) % props.items.length;
    result.push({
      ...props.items[index],
      originalIndex: index
    });
  }

  return result;
});

// Navegar para próximo item
const next = () => {
  activeIndex.value = (activeIndex.value + 1) % props.items.length;
};

// Navegar para item anterior
const previous = () => {
  activeIndex.value = (activeIndex.value - 1 + props.items.length) % props.items.length;
};
</script>

<style scoped>
.club-carousel {
  display: flex;
  align-items: center;
  gap: 20px;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
}

.club-carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.club-carousel-item.active {
  opacity: 1;
  transform: scale(1);
}

.club-carousel-item-image {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.club-carousel-item:nth-child(1) {
  transform: scale(0.7);
  margin-right: -6rem;
  z-index: 2;
  margin-top: -.5rem;
}

.club-carousel-item:nth-child(2) {

  transform: scale(0.8);
  margin-right: -5rem;
  z-index: 3;
  margin-top: -1rem;
}

.club-carousel-item:nth-child(3) {

  transform: scale(0.9);
  margin-right: -5rem;
  z-index: 4;
}

.club-carousel-item:nth-child(4) {
  z-index: 5;
}

.club-carousel-item:nth-child(5) {
  transform: scale(0.9);
  margin-left: -5rem;
  z-index: 4;
  margin-top: -2rem;
}

.club-carousel-item:nth-child(6) {

  transform: scale(0.8);
  margin-left: -5rem;
  z-index: 3;
  margin-top: -1rem;
}

.club-carousel-item:nth-child(7) {
  transform: scale(0.7);
  margin-left: -6rem;
  z-index: 2;
  margin-top: -.5rem;
}

.club-carousel-item.active .club-carousel-item-image {
  width: 250px;
  height: 250px;
}

.club-carousel-item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.club-carousel-item-text {
  margin-top: 15px;
  text-align: center;
  max-width: 400px;
}

.club-carousel-item-name {
  font-weight: 600;
  font-size: 18px;
  margin: 0 0 10px 0;
}

.club-carousel-item-description {
  font-size: 1.75rem;
  color: #FFF;
  font-weight: 900;
  line-height: 1.3;
  font-family: 'Outfit', sans-serif;
  text-transform: uppercase;
  min-height: 82px;
}

/* Estilos para elementos HTML dentro do texto */
.club-carousel-item-description :deep(strong) {
  font-weight: 600;
}

.club-carousel-item-description :deep(em) {
  font-style: italic;
}

.club-carousel-item-description :deep(p) {
  margin: 5px 0;
}

.club-carousel-item-description :deep(br) {
  line-height: 1.6;
}

.carousel-arrow {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  transition: opacity 0.3s ease;
  opacity: .75;
}

.carousel-arrow--left .first-arrow {
  color: #fff;

}

.carousel-arrow--left .second-arrow {
  color: rgba(255, 255, 255, .3);
  margin-left: -.75rem;

}

.carousel-arrow--right .first-arrow {

  color: rgba(255, 255, 255, .3);
  margin-right: -.75rem;
}

.carousel-arrow--right .second-arrow {
  color: #fff;

}

.carousel-arrow:hover {
  opacity: 1;
}

.club-carousel-item.active .club-carousel-item-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background: #07749C;
  filter: blur(97.5px);
  z-index: 1;
}

.club-carousel-item.active .club-carousel-item-image img {
  position: relative;
  z-index: 2;
}

.club-carousel {
  position: relative;
  padding: 4rem 2rem;
}

.club-carousel::before {
  content: '';
  width: 100%;
  height: 100%;
  background: linear-gradient(80.65deg, #548CFB 5.25%, rgba(117, 151, 219, 0.6) 100.74%);
  border-radius: 1rem;
  padding: 2rem;
  position: absolute;
  z-index: 0;
  opacity: .2;
  margin-left: -2rem;
}

.carousel-arrow,
.carousel-container {
  position: relative;
  z-index: 1;
}

.club-carousel-item-text {
  position: relative;
  z-index: 2;
}
@media screen and (max-width: 991px) {
  .club-carousel {
    padding: .5rem 1.5rem;
  }

  .club-carousel::before {
    margin-left: -1.25rem;
  }

  .carousel-arrow {
    display: flex;

  }

  .carousel-arrow span {
    font-size: 1rem;
  }

  .club-carousel-item-image {
    width: 5rem;
    height: auto;
  }

  .club-carousel-item.active {
    width: 5rem;
    height: auto;
  }

  .club-carousel-item.active .club-carousel-item-image {
    width: 100%;
    height: auto;
  }

  .club-carousel-item-description {
    font-size: 1rem;
    font-weight: 700;
  }

  .club-carousel-item:nth-child(1),
  .club-carousel-item:nth-child(2),
  .club-carousel-item:nth-child(6),
  .club-carousel-item:nth-child(7) {
    display: none;
  }


  .club-carousel-item:nth-child(3) {
    margin-right: -3rem;
    transform: scale(0.8);
    margin-top: -4rem;
  }

  .club-carousel-item:nth-child(5) {
    margin-left: -3rem;
    transform: scale(0.8);
    margin-top: -4rem;
  }
}
</style>