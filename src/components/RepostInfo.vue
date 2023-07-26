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
    <AuthorDetail :author="reason.by" />
  </div>
</template>
