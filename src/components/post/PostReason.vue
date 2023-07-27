<script setup lang="ts">
defineProps({
  reason: Object,
})
</script>

<template>
  <div v-if="reason" class="mt-4">
    <div class="text-gray-400 mb-2 font-mono text-sm">
      Reposted by
    </div>
    <div class="flex items-center">
      <div>
        <img :src="reason.by.avatar" class="w-10 h-10 rounded-full">
      </div>
      <div class="flex flex-col ml-2">
        <div class="font-mono text-sm">
          {{ reason.by.displayName }}
        </div>
        <div class="text-gray-400 text-xs font-mono">
          {{ reason.by.handle }}
        </div>
      </div>
    </div>
  </div>
</template>
