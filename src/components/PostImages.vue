<script setup lang="ts">
defineProps({
  post: Object,
})
</script>

<template>
  <div v-if="post?.post.embed && post?.post.embed.images && post?.post.embed.images.length > 0">
    <div v-if="post.post.embed.images.length === 1" class="mt-4 image-container">
      <img
        :src="post.post.embed.images[0].thumb" :alt="post.post.embed.images[0].alt"
        class="w-full  "
      >
    </div>
    <div v-else class="grid grid-cols-2 gap-4">
      <div v-for="image in post.post.embed.images" :key="image.thumb" class="mt-4 image-container">
        <img :src="image.thumb" :alt="image.alt" class="w-full  ">
      </div>
    </div>
  </div>
</template>
