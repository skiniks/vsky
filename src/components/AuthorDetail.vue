<script setup lang="ts">
defineProps({
  author: Object,
  timestamp: String,
  post: Object, // added the post prop to have access to the reply details
})
</script>

<template>
  <div class="flex items-center">
    <img :src="author?.avatar" class="w-18 h-18 rounded-full">
    <div class="flex flex-col ml-4">
      <div class="text-xl font-bold font-mono">
        {{ author?.displayName }}
      </div>
      <div class="text-gray-400 font-mono">
        {{ author?.handle }}
      </div>
      <div v-if="timestamp" class="text-gray-400 text-xs">
        {{ timestamp }}
      </div>
    </div>
  </div>

  <div v-if="(post?.post.record as any)?.reply" class="text-gray-500 text-sm mt-4 mb-2">
    <div class="flex items-center">
      <div>
        Reply to {{ post?.reply?.parent.author.displayName }}
      </div>
    </div>
  </div>
</template>
