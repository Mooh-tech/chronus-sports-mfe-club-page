<template>
  <div class="row boxed-row">
    <div class="col-12">
      <club-carousel :items="clubs" />
    </div>

  </div>
</template>

<script setup lang="ts">
import clubCarousel from '@/components/club-carousel.vue';
import { ref } from 'vue';

const clubs = ref([
  { name: 'SALGUEIRO', image: 'salgueiro.png', text: 'Salgueiro<br>Atlético Clube', link: './' },
  { name: 'CLUBE 2', image: 'empty-shield.png', text: 'Em breve', link: '#' },
  { name: 'CLUBE 3', image: 'empty-shield.png', text: 'Em breve', link: '#' },
  { name: 'CLUBE 4', image: 'empty-shield.png', text: 'Em breve', link: '#' },
  { name: 'CLUBE 5', image: 'empty-shield.png', text: 'Em breve', link: '#' },
  { name: 'CLUBE 6', image: 'empty-shield.png', text: 'Em breve', link: '#' },
  { name: 'CLUBE 7', image: 'empty-shield.png', text: 'Em breve', link: '#' },
  { name: 'CLUBE 8', image: 'empty-shield.png', text: 'Em breve', link: '#' },
  // ... mais clubes
]);
</script>

/* Ellipse 23 */

position: absolute;
width: 417px;
height: 384px;
left: 485px;
top: 356px;

background: #07749C;
filter: blur(97.5px);
