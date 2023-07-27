<script setup lang="ts">
import type { Record } from '@/types'

defineProps({
  record: Object as () => Record,
})
</script>

<template>
  <div v-if="record" class="mt-4 p-8 border-2 rounded-3xl border-blue shadow-lg shadow-blue-500/50">
    <div>
      <div>
        <img :src="record.author?.avatar" class="w-10 h-10 rounded-full">
      </div>
      <div class="text-xl font-bold font-mono">
        {{ record.author?.displayName }}
      </div>
      <div class="text-gray-400 font-mono">
        {{ record.author?.handle }}
      </div>
    </div>
    {{ record.value?.text }}

    <div v-for="embed in record.embeds" :key="embed.$type">
      <div v-if="embed.images">
        <div v-for="image in embed.images" :key="image.thumb" class="mt-4">
          <img :src="image.thumb" :alt="image.alt" class="rounded-md">
        </div>
      </div>
    </div>
  </div>
</template>
