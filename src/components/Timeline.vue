<script setup lang="ts">
import * as AtprotoApi from '@atproto/api'

const timelinePosts = ref<Array<any>>([])
const loading = ref(false)
const cursor = ref<string | null>(null)
const endReached = ref(false)
const observer = ref<IntersectionObserver | null>(null)

const agent = new AtprotoApi.BskyAgent({ service: 'https://bsky.social' })

const savedSessionData = localStorage.getItem('sessionData')
if (savedSessionData)
  await agent.resumeSession(JSON.parse(savedSessionData))

onMounted(async () => {
  await fetchTimeline()

  observer.value = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !loading.value)
      await fetchTimeline(cursor.value)
  }, {
    rootMargin: '200px 0px',
  })

  observer.value.observe(document.querySelector('#endOfList')!)
})

async function fetchTimeline(cursorValue?: string | null) {
  try {
    loading.value = true

    const response = cursorValue === null
      ? await agent.getTimeline({ limit: 50 })
      : await agent.getTimeline({ cursor: cursorValue, limit: 50 })

    const filteredPosts = response.data.feed.filter(post => !(post.post.record as any).reply || post.reason)

    timelinePosts.value = [...timelinePosts.value, ...filteredPosts]
    // eslint-disable-next-line no-console
    console.log('timelinePosts:', timelinePosts.value)

    if (response.data.cursor) {
      cursor.value = response.data.cursor
      endReached.value = false // There's more data to load
    }
    else {
      endReached.value = true // We've reached the end
      if (observer.value)
        observer.value.unobserve(document.querySelector('#endOfList')!)
    }
  }
  catch (error) {
    console.error('Error fetching timeline:', error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <ul class="mt-4">
      <Post v-for="post in timelinePosts" :key="post.post.cid" :post="post" />
    </ul>
    <div id="endOfList" class="mb-4" />
  </div>
</template>
