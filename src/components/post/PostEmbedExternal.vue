<script setup lang="ts">
defineProps({
  external: Object,
})
</script>

<template>
  <div v-if="external" class="mt-4">
    <div class="p-4 border-2 border-blue rounded-3xl shadow-md shadow-blue-500/50">
      <div v-if="external?.thumb">
        <img :src="external?.thumb" class="w-full   mb-2">
      </div>
      <div class="text-xl font-bold font-mono">
        {{ external?.title }}
      </div>
      <div class="text-gray-400 text-xs font-monos">
        {{ external?.uri.substring(0, 100) + (external?.uri.length > 100 ? '...' : '') }}
      </div>
      <div class="text-sm font-mono">
        {{ external?.description }}
      </div>
    </div>
  </div>
</template>
