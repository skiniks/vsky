<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { useRouter } from 'vue-router'
import { type BskyAgent, RichText } from '@atproto/api'
import type { ProfileViewDetailed } from '@atproto/api/src/client/types/app/bsky/actor/defs'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { truncate } from '@/utils/truncate'

const nuxtApp = useNuxtApp()
const agent: BskyAgent = nuxtApp.$bskyAgent

const router = useRouter()
const slug = ref<string | null>(null)
const isLoading = ref(true)
const profile = ref<ProfileViewDetailed | null>(null)
const posts = ref<Array<any>>([])

function handleRouteChange(to: RouteLocationNormalizedLoaded) {
  slug.value = to.params.slug as string
  fetchData(slug.value)
}

onMounted(async () => {
  slug.value = router.currentRoute.value.params.slug as string
  fetchData(slug.value)
  router.beforeEach(handleRouteChange)
})

onUnmounted(() => {
  router.beforeResolve(handleRouteChange) // Clean up the event listener
})

async function fetchData(handle: string | null) {
  isLoading.value = true
  try {
    await fetchProfile(handle)
    await fetchPosts(handle)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}

async function fetchProfile(handle: string | null) {
  if (agent && handle) {
    const sessionData = localStorage.getItem('session') || '{}'
    await agent.resumeSession(JSON.parse(sessionData))
    const response = await agent.getProfile({ actor: handle })

    // eslint-disable-next-line no-console
    console.log('Response:', response)

    if (response?.data) {
      profile.value = response.data
      if (profile.value.description)
        profile.value.description = await formatDescription(profile.value.description)
    }
  }
}

async function formatDescription(description: string) {
  if (agent) {
    const rt = new RichText({ text: description })
    await rt.detectFacets(agent)

    let markdown = ''
    for (const segment of rt.segments()) {
      if (segment.isLink()) {
        const displayText = truncate(segment.text, 40)
        markdown += `[${displayText}](${segment.link?.uri})`
      }
      else if (segment.isMention()) {
        markdown += `[${segment.text}](https://vsky-final.vercel.app/profile/${segment.mention?.did})`
      }
      else {
        markdown += segment.text
      }
    }

    const md = new MarkdownIt()
    return md.render(markdown)
  }
  return description
}

async function fetchPosts(handle: string | null) {
  if (agent && handle) {
    const response = await agent.getAuthorFeed({
      actor: handle,
      limit: 20,
    })

    // eslint-disable-next-line no-console
    console.log('Posts:', response)

    posts.value = response?.data.feed.filter(post => !post.reply) || []
  }
}
</script>

<template>
  <div class="max-w-xl m-auto">
    <div v-if="isLoading">
      <div class="flex items-center justify-center h-screen">
        <Loading />
      </div>
    </div>
    <div v-else>
      <ProfileHeader v-if="profile" :profile="profile" />
      <ProfilePosts :posts="posts" :agent="agent" />
    </div>
  </div>
</template>
