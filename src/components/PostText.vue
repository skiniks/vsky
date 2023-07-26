<script setup lang="ts">
defineProps({
  text: String,
  reply: Object,
})
</script>

<template>
  <div :class="{ 'mt-4': !reply }" class="font-mono text-lg">
    {{ text }}
  </div>
</template>
