<script setup lang="ts">
interface PostType {
  post: {
    cid: string
    record: {
      reply?: any
    }
  }
}

const props = defineProps({
  posts: {
    type: Array as () => PostType[],
    required: true,
  },
  agent: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div v-if="props.posts.length > 0">
    <div v-for="post in props.posts" :key="post.post.cid" class="post mt-6 mb-6">
      <Post v-if="props.agent && !post.post.record.reply" :post="post" :agent="props.agent" />
    </div>
  </div>
</template>
