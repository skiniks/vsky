<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'

const props = defineProps({
  reply: {
    type: Object,
    default: () => ({}),
  },
  agent: {
    type: Object as () => BskyAgent,
    required: true,
  },
})
</script>

<template>
  <div class="reply mt-6 mb-6">
    <Post :post="props.reply.post" :agent="props.agent" />
    <div v-if="props.reply.replies?.length" class="relative pl-5">
      <NestedReply v-for="(nestedReply) in props.reply.replies" :key="nestedReply.post.cid" :reply="nestedReply" :agent="props.agent" class="connected-reply" />
    </div>
  </div>
</template>

<style>
  .connected-reply::before {
    content: '';
    position: absolute;
    top: 0;
    left: -10px; /* Adjust the position of the line here */
    width: 1px;
    height: 100%;
    background-color: #FFF;
    opacity: 0.3;
  }
</style>
