<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'

defineProps({
  agent: Object as () => BskyAgent,
})

const postsStore = usePostsStore()
postsStore.refreshPosts()

const loading = computed(() => postsStore.isLoading)

const posts = computed(() =>
  postsStore.posts.filter(post => !post.post.record.reply && !post.reply),
)

async function handleScroll() {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  if (!loading.value && nearBottom) {
    await postsStore.fetchPosts()
    await nextTick()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="max-w-xl m-auto">
    <div v-for="post in posts" :key="post.post.cid" class="post mt-6 mb-6">
      <Post v-if="agent" :post="post" :agent="agent" />
    </div>
  </div>
</template>
