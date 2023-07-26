<script setup lang="ts">
defineProps({
  record: Object,
})
</script>

<template>
  <div v-if="record?.value" class="mt-4 p-8 border-2 border-gray-500 rounded-3xl">
    <div class="flex items-center">
      <div>
        <img :src="record?.author?.avatar" class="w-10 h-10 rounded-full">
      </div>
      <div class="flex flex-col ml-2">
        <div class="text-xl font-bold font-mono">
          {{ record?.author?.displayName }}
        </div>
        <div class="text-gray-400 font-mono">
          {{ record?.author?.handle }}
        </div>
      </div>
    </div>
    <div class="font-mono mt-2">
      {{ record?.value?.text }}
    </div>

    <div v-if="record?.embeds">
      <div v-for="embed in record?.embeds" :key="embed.record?.record?.cid" class="mb-6">
        <div v-if="embed.media && embed.media.images">
          <div v-for="image in embed.media.images" :key="image.fullsize">
            <img :src="image.fullsize" :alt="image.alt" class="mt-4 rounded-md">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
