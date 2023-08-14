<script setup lang="ts">
defineProps({
  author: Object,
  timestamp: String,
  post: Object,
})
</script>

<template>
  <div class="flex items-start justify-between w-full">
    <div class="flex items-center">
      <img :src="author?.avatar" class="w-18 h-18 rounded-full">
      <div class="flex flex-col ml-4">
        <div class="text-xl font-bold font-mono">
          {{ author?.displayName }}
        </div>
        <div class="text-gray-400 font-mono">
          {{ author?.handle }}
        </div>
      </div>
    </div>
    <div v-if="timestamp" class="text-gray-400 text-xs">
      {{ timestamp }}
    </div>
  </div>
</template>
