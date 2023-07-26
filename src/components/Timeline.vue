<script setup lang="ts">
import * as AtprotoApi from '@atproto/api'
import { getElapsedTime } from '@/utils/elapsed-time'

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
      <li v-for="post in timelinePosts" :key="post.post.cid" class="bg-white text-black rounded-3xl shadow-lg p-6 mb-4">
        <!-- Display author details -->
        <div class="flex items-center">
          <img :src="post.post.author.avatar" class="w-18 h-18 rounded-full">
          <div class="flex flex-col ml-4">
            <div class="text-xl font-bold font-mono">
              {{ post.post.author.displayName }}
            </div>
            <div class="text-gray-400 font-mono">
              {{ post.post.author.handle }}
            </div>
            <div class="text-gray-400 text-xs">
              {{ getElapsedTime(post.post.record.createdAt) }}
            </div>
          </div>
        </div>

        <div v-if="(post.post.record as any).reply" class="text-gray-500 text-sm mt-4 mb-2">
          Reply to {{ post.reply.parent.author.displayName }}
        </div>

        <!-- Display post text -->
        <div :class="{ 'mt-4': !(post.post.record as any).reply }" class="font-mono text-lg">
          {{ post.post.record.text }}
        </div>

        <!-- Display post images if available -->
        <div v-if="post.post.embed && post.post.embed.images && post.post.embed.images.length > 0">
          <div v-if="post.post.embed.images.length === 1" class="mt-4 image-container">
            <img
              :src="post.post.embed.images[0].thumb" :alt="post.post.embed.images[0].alt"
              class="w-full  "
            >
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <div v-for="image in post.post.embed.images" :key="image.thumb" class="mt-4 image-container">
              <img :src="image.thumb" :alt="image.alt" class="w-full  ">
            </div>
          </div>
        </div>

        <div v-if="post.post.embed?.external" class="mt-4">
          <div class="p-4 border-2 border-gray-500 rounded-3xl">
            <div v-if="post.post.embed.external?.thumb">
              <img :src="post.post.embed.external?.thumb" class="w-full   mb-2">
            </div>
            <div class="text-xl font-bold font-mono">
              {{ post.post.embed.external?.title }}
            </div>
            <div class="text-gray-400 text-xs font-monos">
              {{ post.post.embed.external?.uri.substring(0, 100) + (post.post.embed.external?.uri.length > 100 ? '...' : '') }}
            </div>
            <div class="text-sm font-mono">
              {{ post.post.embed.external?.description }}
            </div>
          </div>
        </div>

        <div v-if="post.post.embed?.record?.value" class="mt-4 p-8 border-2 border-gray-500 rounded-3xl">
          <div class="flex items-center">
            <div>
              <img :src="post.post.embed.record?.author?.avatar" class="w-10 h-10 rounded-full">
            </div>
            <div class="flex flex-col ml-2">
              <div class="text-xl font-bold font-mono">
                {{ post.post.embed.record?.author?.displayName }}
              </div>
              <div class="text-gray-400 font-mono">
                {{ post.post.embed.record?.author?.handle }}
              </div>
            </div>
          </div>
          <div class="font-mono mt-2">
            {{ post.post.embed.record?.value?.text }}
          </div>

          <div v-if="post.post.embed.record?.embeds">
            <div v-for="embed in post.post.embed.record.embeds" :key="embed.$type">
              <div v-for="image in embed.images" :key="image.thumb" class="image-container">
                <img :src="image.thumb" :alt="image.alt" class="w-full   mt-4">
              </div>
            </div>
          </div>
        </div>

        <!-- repost with media -->
        <div
          v-if="post.post && post.post.embed && post.post.embed.media && post.post.embed.media.images && post.post.embed.media.images.length > 0"
          :class="{ 'grid grid-cols-2 gap-4': post.post.embed.media.images.length > 1 }"
        >
          <div v-for="(image, index) in post.post.embed.media.images" :key="index">
            <div class="image-container">
              <img
                :src="image.thumb" :alt="image.alt"
                class="w-full   mt-4"
              >
            </div>
          </div>
        </div>

        <div v-if="post.post.embed?.record?.record" class="mt-4 p-8 border-2 border-gray-500 ">
          <div>
            <div>
              <img :src="post.post.embed.record?.record?.author?.avatar" class="w-10 h-10 rounded-full">
            </div>
            <div class="text-xl font-bold font-mono">
              {{ post.post.embed.record?.record?.author?.displayName }}
            </div>
            <div class="text-gray-400 font-mono">
              {{ post.post.embed.record?.record?.author?.handle }}
            </div>
          </div>
          {{ post.post.embed.record?.record?.value?.text }}

          <div v-for="embed in post.post.embed.record?.record.embeds" :key="embed.record?.record?.cid" class="mb-6">
            <div v-if="embed.media && embed.media.images">
              <div v-for="image in embed.media.images" :key="image.fullsize">
                <img :src="image.fullsize" :alt="image.alt" class="mt-4 rounded-md">
              </div>
            </div>
          </div>
        </div>

        <!-- Display repost information if available -->
        <div v-if="post.reason" class="mt-4">
          <div class="text-gray-400 mb-2 font-mono text-sm">
            Reposted by
          </div>
          <div class="flex items-center">
            <div>
              <img :src="post.reason.by.avatar" class="w-10 h-10 rounded-full">
            </div>
            <div class="flex flex-col ml-2">
              <div class="font-mono text-sm">
                {{ post.reason.by.displayName }}
              </div>
              <div class="text-gray-400 text-xs font-mono">
                {{ post.reason.by.handle }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div id="endOfList" class="mb-4" />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
}
.image-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
