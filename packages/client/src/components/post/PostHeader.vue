<script setup lang="ts">
import { getElapsedTime } from '../../utils/elapsed-time'

const props = defineProps({
  author: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
})

const { author, createdAt } = props
</script>

<template>
  <div class="flex justify-between">
    <router-link :to="`/profile/${author.handle}`" class="no-underline">
      <div class="flex items-center">
        <div v-if="author.avatar">
          <img :src="author.avatar" :alt="`${author.handle}'s Avatar`" class="w-18 h-18 rounded-full ring ring-blue-600 ring-offset-white ring-offset-2 ring-width-3 mr-3">
        </div>
        <div v-else class="w-18 h-18 rounded-full bg-blue-600 mr-3" />
        <div class="font-mono">
          <div class="text-md mb-1 text-black">
            {{ author.displayName }}
          </div>
          <div class="text-sm text-black">
            <span class="text-blue-600">@</span>{{ author.handle }}
          </div>
        </div>
      </div>
    </router-link>

    <div class="font-mono text-xs">
      {{ getElapsedTime(createdAt) }}
    </div>
  </div>
</template>
