<script setup lang="ts">
defineProps({
  post: Object, // added the post prop to have access to the reply details
})
</script>

<template>
  <div
    v-if="post?.post && post.post.embed && post.post.embed.media && post.post.embed.media.images && post.post.embed.media.images.length > 0"
    :class="{ 'grid grid-cols-2 gap-4': post.post.embed.media.images.length > 1 }"
  >
    <div v-for="(image, index) in post.post.embed.media.images" :key="index">
      <div class="image-container">
        <img :src="image.thumb" :alt="image.alt" class="w-full   mt-4">
      </div>
    </div>
  </div>
</template>
