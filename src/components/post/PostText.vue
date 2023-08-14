<script setup lang="ts">
import { useRichText } from '~/composables/useRichText'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  agent: {
    type: Object as () => any,
  },
  reply: {
    type: Object,
  },
})

const { htmlText } = useRichText(props.text, props.agent)
</script>

<template>
  <div v-if="htmlText" :class="{ 'mt-4': !reply }" class="font-mono text-lg overflow-auto break-words overflow-ellipsis" v-html="htmlText" />
</template>
