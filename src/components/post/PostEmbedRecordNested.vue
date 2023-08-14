<script setup lang="ts">
import { useRichText } from '~/composables/useRichText'
import { getElapsedTime } from '~/utils/elapsed-time'

const props = defineProps({
  record: Object,
})

const { htmlText } = useRichText(props.record?.value?.text)
</script>

<template>
  <div v-if="record" class="mt-4 p-8 border-2 rounded-3xl border-blue shadow-md shadow-blue-500/50">
    <div class="flex justify-between items-start">
      <div class="flex items-center">
        <img :src="record.author?.avatar" class="w-10 h-10 rounded-full">
        <div class="flex flex-col ml-2">
          <div class="text-xl font-bold font-mono">
            {{ record.author?.displayName }}
          </div>
          <div class="text-gray-400 font-mono">
            {{ record.author?.handle }}
          </div>
        </div>
      </div>
      <div class="text-gray-400 text-xs font-mono">
        {{ getElapsedTime(record?.value?.createdAt) }}
      </div>
    </div>

    <div class="font-mono mt-2">
      <div v-html="htmlText" />

      <div v-for="embed in record.embeds" :key="embed.$type">
        <div v-if="embed.images">
          <div v-for="image in embed.images" :key="image.thumb" class="mt-4">
            <img :src="image.thumb" :alt="image.alt" class="rounded-md">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
