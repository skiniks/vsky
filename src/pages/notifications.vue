<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Notification } from '@atproto/api/dist/client/types/app/bsky/notification/listNotifications'
import { getElapsedTime } from '@/utils/elapsed-time'

const nuxtApp = useNuxtApp()
const agent = nuxtApp.$bskyAgent

const limit = 20
let cursor: any
const isLoading = ref(true)

const notifications = ref<Notification[]>([])

let sessionData = '{}'

function getNotificationReason(reason: string) {
  switch (reason) {
    case 'follow':
      return 'followed you'
    case 'like':
      return 'liked your post'
    case 'reply':
      return 'replied to your post'
    case 'repost':
      return 'reposted your post'
    default:
      return ''
  }
}

async function fetchNotifications() {
  let response
  if (agent) {
    await agent.resumeSession(JSON.parse(sessionData))
    response = await agent.listNotifications({
      limit,
      cursor,
    })
  }

  // eslint-disable-next-line no-console
  console.log('Response:', response)

  const newNotifications = response?.data.notifications as unknown as Notification[] || []
  notifications.value = [...notifications.value, ...newNotifications]
  cursor = response?.data.cursor
  isLoading.value = false
}

const isFetchingMore = ref(false)

async function fetchMoreNotifications() {
  if (isFetchingMore.value || !cursor)
    return

  isFetchingMore.value = true
  const response = await agent?.listNotifications({
    limit,
    cursor,
  })

  const newNotifications = response?.data.notifications || []
  notifications.value = [...notifications.value, ...newNotifications]
  cursor = response?.data.cursor
  isFetchingMore.value = false
}

function handleScroll() {
  const scrollThreshold = 100
  const isBottom = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - scrollThreshold
  if (isBottom)
    fetchMoreNotifications()
}

onMounted(() => {
  sessionData = localStorage.getItem('session') || '{}'
  fetchNotifications()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="w-full mt-10 max-w-xl m-auto">
    <div v-if="isLoading">
      <div class="flex items-center justify-center h-screen">
        <Loading />
      </div>
    </div>
    <div v-else>
      <div v-for="notification in notifications" :key="notification.cid" class="bg-white text-black rounded-3xl p-6 mb-4 font-mono text-black">
        <div class="avatar">
          <div class="w-12">
            <img :src="notification.author.avatar" alt="User Avatar">
          </div>
        </div>
        <div class="flex items-center justify-between w-full mt-4">
          <div>
            <router-link :to="`/profile/${notification.author.handle}`" class="text-black hover:text-black no-underline">
              {{ notification.author.displayName || notification.author.handle }}
            </router-link>
            {{ getNotificationReason(notification.reason) }}
            <div v-if="notification.reason === 'reply' && 'text' in notification.record" class="text-sm mt-2">
              {{ notification.record.text }}
            </div>
          </div>
          <div v-if="'createdAt' in notification.record" class="text-right text-xs">
            {{ getElapsedTime(notification.record.createdAt as string) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
