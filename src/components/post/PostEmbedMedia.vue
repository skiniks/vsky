<script setup lang="ts">
defineProps({
  images: Array as PropType<Array<any>>,
})
</script>

<template>
  <div
    v-if="images && images.length > 0"
    :class="{ 'grid grid-cols-2 gap-4': images.length > 1 }"
  >
    <div v-for="(image, index) in images" :key="index">
      <div class="image-container">
        <img :src="image.thumb" :alt="image.alt" class="w-full mt-4">
      </div>
    </div>
  </div>
</template>
