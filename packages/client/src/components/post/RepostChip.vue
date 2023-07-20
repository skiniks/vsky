<script setup lang="ts">
const props = defineProps({
  reason: {
    type: Object,
    default: () => ({}),
  },
})

const { reason } = props
</script>

<template>
  <span class="block font-mono text-xs text-red-600 overflow-wrap-anywhere">
    Reposted
    <span class="text-black">
      by
      <span class="text-blue-600">@</span>{{ (reason.by as any | undefined)?.handle }}
    </span>
  </span>
</template>
