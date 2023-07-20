<script setup lang="ts">
const props = defineProps({
  images: {
    type: Array as () => Array<{ thumb: string; alt: string }>,
    required: false,
  },
})

const { images } = props

const imageCount = images?.length || 0
const gridColumns = Math.ceil(Math.sqrt(imageCount))
</script>

<template>
  <div
    v-if="images?.length"
    :class="`grid gap-4 ${imageCount === 3 ? 'grid-cols-2' : `grid-cols-${gridColumns}`}`" class="mb-6"
  >
    <div
      v-for="(image, index) in images" :key="image.thumb" class="w-full"
      :class="{ 'h-60 col-span-2': imageCount === 3 && index === 2, 'h-60': imageCount !== 3, 'h-full': imageCount === 1 }"
    >
      <img :src="image.thumb" :alt="image.alt" class="w-full h-full rounded-xl shadow-md object-cover">
    </div>
  </div>
</template>
