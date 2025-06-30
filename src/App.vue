<template>
  <page-navbar></page-navbar>
  <div class="container-fluid chronus-sports-page">
    <router-view />
  </div>
  <page-footer></page-footer>
</template>
<script setup lang='ts'>
import { PageFooter, PageNavbar } from '@chronus-sports/styleguide';
</script>
