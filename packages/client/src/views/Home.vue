<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'

defineProps({
  agent: Object as () => BskyAgent,
})
</script>

<template>
  <Timeline v-if="agent" :agent="agent" />
</template>
