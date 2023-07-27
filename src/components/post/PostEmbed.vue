<script setup lang="ts">
import type { Image } from '@/types'

defineProps({
  images: Array as PropType<Image[]>,
})
</script>

<template>
  <div v-if="images && images.length > 0">
    <div v-if="images.length === 1" class="mt-4 image-container">
      <img :src="images[0].thumb" :alt="images[0].alt" class="w-full">
    </div>
    <div v-else class="grid grid-cols-2 gap-4">
      <div v-for="image in images" :key="image.thumb" class="mt-4 image-container">
        <img :src="image.thumb" :alt="image.alt" class="w-full">
      </div>
    </div>
  </div>
</template>
