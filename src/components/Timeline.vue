<script setup lang="ts">
import { useSessionStore } from '~/stores/session'

const nuxtApp = useNuxtApp()
const bskyAgent = nuxtApp.$bskyAgent
const sessionStore = useSessionStore()

const timelineData = ref<Array<any>>([])
const loading = ref(false)
const cursor = ref<string | null>(null)
const endReached = ref(false)
const observer = ref<IntersectionObserver | null>(null)

async function fetchData(cursorValue?: string | null) {
  try {
    loading.value = true
    const savedSessionData = sessionStore.getSession()

    if (savedSessionData)
      await bskyAgent.resumeSession(savedSessionData)

    const response = cursorValue === null
      ? await bskyAgent.getTimeline({ limit: 50 })
      : await bskyAgent.getTimeline({ cursor: cursorValue, limit: 50 })

    const filteredPosts = response.data.feed.filter(post => !(post.post.record as any).reply || post.reason)

    timelineData.value = [...timelineData.value, ...filteredPosts]
    // eslint-disable-next-line no-console
    console.log('Timeline data:', timelineData.value)

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
  catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed:', error.message)
      if (error.message.includes('Authentication Required'))
        sessionStore.clearSession()
    }
    else {
      console.error('An unexpected error occurred:', error)
    }
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()

  observer.value = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !loading.value)
      await fetchData(cursor.value)
  }, {
    rootMargin: '200px 0px',
  })

  observer.value.observe(document.querySelector('#endOfList')!)
})
</script>

<template>
  <div>
    <ul class="mt-4">
      <Post v-for="post in timelineData" :key="post.post.record.cid" :post="post" :agent="bskyAgent" />
    </ul>
    <div id="endOfList" class="mb-4" />
  </div>
</template>
