<script setup lang="ts">
import { getElapsedTime } from '../../utils/elapsed-time'

const props = defineProps({
  agent: Object,
})

const limit = 20
let cursor: any
const isLoading = ref(true)

interface Notification {
  cid: string
  author: {
    avatar: string
    displayName: string
    handle: string
  }
  reason: string
  record: {
    createdAt: string
    subject: {
      cid: string
    }
    text: string
  }
  reasonSubject: string
}

const notifications = ref<Notification[]>([])
const groupedNotifications = ref<Record<string, Notification[]>>({})
const sessionData = localStorage.getItem('session') || '{}'

function getNotificationReason(reason: string) {
  switch (reason) {
    case 'follow':
      return 'followed you'
    case 'like':
      return 'liked your post'
    case 'reply':
      return 'replied to your post'
    default:
      return ''
  }
}

async function fetchNotifications() {
  let response
  if (props.agent) {
    await props.agent.resumeSession(JSON.parse(sessionData))
    response = await props.agent.listNotifications({
      limit,
      cursor,
    })
  }

  // eslint-disable-next-line no-console
  console.log('Response:', response)

  const newNotifications = response?.data.notifications || []
  notifications.value = [...notifications.value, ...newNotifications]
  cursor = response?.data.cursor
  isLoading.value = false
}

function groupNotifications() {
  const grouped: Record<string, Notification[]> = {}

  notifications.value.forEach((notification) => {
    if (notification.reason === 'reply' && notification.reasonSubject) {
      // Treat replies as individual notifications
      const key = `reply_${notification.reasonSubject}`
      grouped[key] = [notification]
    }
    else if (notification.reason && notification.record && notification.record.subject) {
      const key
        = notification.reason === 'follow'
          ? 'follow'
          : notification.reason === 'like'
            ? 'like'
            : `${notification.reason}_${notification.record.subject.cid}`

      if (!grouped[key]) {
        grouped[key] = [notification]
      }
      else {
        const groupCount = grouped[key].length
        if (groupCount >= 5) {
          let index = 1
          while (grouped[`${key}_${index}`]) index++
          grouped[`${key}_${index}`] = [notification]
        }
        else {
          grouped[key].push(notification)
        }
      }
    }
    else {
      // Handle the case where the notification cannot be grouped
      console.error('Notification is missing required properties:', notification)
    }
  })

  groupedNotifications.value = grouped
}

const isFetchingMore = ref(false)

// Function to fetch more notifications
async function fetchMoreNotifications() {
  // Avoid fetching more notifications if we are already fetching or no more data is available.
  if (isFetchingMore.value || !cursor)
    return

  isFetchingMore.value = true
  const response = await props.agent?.listNotifications({
    limit,
    cursor,
  })

  const newNotifications = response?.data.notifications || []
  notifications.value = [...notifications.value, ...newNotifications]
  cursor = response?.data.cursor
  isFetchingMore.value = false
}

// Function to check if the user has reached the bottom of the page
function handleScroll() {
  const scrollThreshold = 100 // Adjust this value as needed
  const isBottom
    = window.innerHeight + window.scrollY
    >= document.documentElement.offsetHeight - scrollThreshold

  if (isBottom)
    fetchMoreNotifications()
}

// Add scroll event listener to window
onMounted(() => {
  fetchNotifications()
  window.addEventListener('scroll', handleScroll)
})

// Remove scroll event listener when the component is unmounted to avoid memory leaks
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(notifications, groupNotifications)
</script>

<template>
  <div class="w-full mt-10 max-w-xl m-auto">
    <Loading v-if="isLoading" />
    <div v-else>
      <!-- Loop through the grouped notifications -->
      <div v-for="(group, groupKey) in groupedNotifications" :key="groupKey" class="bg-white text-black rounded-3xl p-6 mb-4 font-mono text-black">
        <div class="avatar-group -space-x-6">
          <!-- Loop through the notifications within each group -->
          <div v-for="notification in group" :key="notification.cid" class="avatar">
            <div class="w-12">
              <img :src="notification.author.avatar" alt="User Avatar">
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between w-full mt-4">
          <div>
            <router-link :to="`/profile/${group[0].author.handle}`" class="text-black hover:text-black no-underline">
              {{ group[0].author.displayName || group[0].author.handle }}
            </router-link>
            <span v-if="group.length > 1" class="text-black">
              and {{ group.length - 1 }} others
            </span>
            {{ getNotificationReason(group[0].reason) }}
            <div v-if="group[0].reason === 'reply'" class="text-sm mt-2">
              {{ group[0].record.text }}
            </div>
          </div>
          <div class="text-right text-xs">
            {{ getElapsedTime(group[0].record.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
